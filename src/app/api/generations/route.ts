import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { getDb } from "@/db";
import {
  anonymousGenerationClaims,
  generations,
  glassesStyles,
} from "@/db/schema";
import { generateTryOnImage, ImageGenerationError } from "@/lib/ai/provider";
import { buildTryOnPrompt } from "@/lib/ai/prompt";
import { env } from "@/lib/config";
import {
  canUseAnonymousFreeGeneration,
  FREE_GENERATION_COOKIE,
  freeGenerationDay,
  hashGateInput,
} from "@/lib/free-gate";
import { getStylesByIds } from "@/lib/glasses/catalog";
import { storeResultImage } from "@/lib/storage/r2";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const formData = await request.formData();
  const image = formData.get("image");
  const frameImage = formData.get("frameImage");
  const styleIdsValue = String(formData.get("styleIds") ?? "");
  const styleId = String(formData.get("styleId") ?? "");
  const userStyleDescription = String(formData.get("userStyleDescription") ?? "");
  const backgroundMode = parseBackgroundMode(formData.get("backgroundMode"));
  const customBackgroundPrompt = String(formData.get("customBackgroundPrompt") ?? "");
  const viewMode = parseViewMode(formData.get("viewMode"));
  const openAiApiKey = String(formData.get("openAiApiKey") ?? "").trim();
  const usingOwnKey = openAiApiKey.startsWith("sk-");
  const parsedStyleIds = parseStyleIds(styleIdsValue, styleId);
  const styles = getStylesByIds(parsedStyleIds).slice(
    0,
    viewMode === "three-view" ? 3 : 8,
  );

  if (
    !usingOwnKey &&
    !canUseAnonymousFreeGeneration(cookieStore.get(FREE_GENERATION_COOKIE)?.value)
  ) {
    return NextResponse.json(
      {
        error: "API_KEY_OR_CREDITS_REQUIRED",
        message:
          "Your free try-on for today is used. Add your own OpenAI API key or optionally buy credits to keep generating.",
      },
      { status: 402 },
    );
  }

  if (!(image instanceof File) || image.size === 0) {
    return NextResponse.json(
      { error: "IMAGE_REQUIRED", message: "Upload or capture a face photo." },
      { status: 400 },
    );
  }

  if (!styles.length) {
    return NextResponse.json(
      { error: "STYLE_REQUIRED", message: "Choose an eyeglasses style." },
      { status: 400 },
    );
  }

  const prompt = buildTryOnPrompt({
    styles,
    userStyleDescription,
    backgroundMode,
    customBackgroundPrompt,
    viewMode,
    hasFrameReference: frameImage instanceof File && frameImage.size > 0,
  });
  const generationId = nanoid();
  const claimId = nanoid();
  const today = freeGenerationDay();
  const requestHeaders = await headers();
  const fingerprint = [
    requestHeaders.get("x-forwarded-for") ?? "unknown-ip",
    requestHeaders.get("user-agent") ?? "unknown-agent",
    cookieStore.get("teg_device")?.value ?? "new-device",
  ].join("|");

  try {
    const db = getDb();
    for (const style of styles) {
      db.insert(glassesStyles)
        .values({
          id: style.id,
          name: `${style.brand} ${style.name}`,
          family: style.family,
          fit: style.fit,
          color: style.color,
          material: style.material,
          promptNotes: style.promptNotes,
        })
        .onConflictDoNothing()
        .run();
    }

    db.insert(anonymousGenerationClaims)
      .values({
        id: claimId,
        fingerprintHash: hashGateInput(`${today}|${fingerprint}`),
        ipHash: hashGateInput(requestHeaders.get("x-forwarded-for") ?? "unknown"),
        userAgentHash: hashGateInput(
          requestHeaders.get("user-agent") ?? "unknown",
        ),
      })
      .onConflictDoNothing()
      .run();

    db.insert(generations)
      .values({
        id: generationId,
        anonymousClaimId: claimId,
        styleId: styles[0].id,
        prompt,
        model: env().IMAGE_MODEL,
        quality: env().IMAGE_QUALITY,
        size: env().IMAGE_SIZE,
      })
      .run();
  } catch {
    // Local preview can still run before migrations; production health checks catch DB setup.
  }

  try {
    const referenceImages = await Promise.all(
      styles
        .map((style) => style.imageUrl)
        .filter((imageUrl): imageUrl is string => Boolean(imageUrl))
        .slice(0, 8)
        .map((imageUrl, index) =>
          fetchReferenceImage(imageUrl, `catalog-frame-${index}.jpg`),
        ),
    );
    const result = await generateTryOnImage({
      image,
      frameImage:
        frameImage instanceof File && frameImage.size > 0 ? frameImage : undefined,
      referenceImages: referenceImages.filter(
        (referenceImage): referenceImage is File => Boolean(referenceImage),
      ),
      prompt,
      apiKey: usingOwnKey ? openAiApiKey : undefined,
    });
    const extension = result.mimeType.includes("svg") ? "svg" : "png";
    const objectKey = `generations/${generationId}.${extension}`;
    const stored = await storeResultImage({
      key: objectKey,
      bytes: result.bytes,
      contentType: result.mimeType,
    });

    try {
      getDb()
        .update(generations)
        .set({
          status: "succeeded",
          resultObjectKey: stored.objectKey,
          resultUrl: stored.publicUrl,
          sourceDeletedAt: new Date().toISOString(),
        })
        .where(eq(generations.id, generationId))
        .run();
    } catch {
      // Non-fatal in local demo mode.
    }

    const response = NextResponse.json({
      id: generationId,
      imageUrl: stored.publicUrl,
      styleName:
        styles.length === 1
          ? `${styles[0].brand} ${styles[0].name}`
          : `${styles.length} frame board`,
      model: env().IMAGE_MODEL,
      source: result.source,
      selectedStyles: styles.map((style) => ({
        id: style.id,
        brand: style.brand,
        name: style.name,
        approxPriceUsd: style.approxPriceUsd,
      })),
    });

    if (!usingOwnKey) {
      response.cookies.set(FREE_GENERATION_COOKIE, today, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 36,
        path: "/",
      });
    }

    response.cookies.set("teg_device", nanoid(), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });

    return response;
  } catch (error) {
    if (error instanceof ImageGenerationError) {
      console.error("Image generation failed", {
        generationId,
        status: error.status,
        requestId: error.requestId,
      });
    }

    return NextResponse.json(
      {
        error: "GENERATION_FAILED",
        message:
          error instanceof Error
            ? error.message
            : "The try-on generation failed.",
      },
      { status: 500 },
    );
  }
}

function parseStyleIds(styleIdsValue: string, fallbackStyleId: string) {
  try {
    const parsed = JSON.parse(styleIdsValue) as unknown;
    if (Array.isArray(parsed)) {
      return parsed.filter((value): value is string => typeof value === "string");
    }
  } catch {
    // Fall back to the single-style field used by older clients.
  }

  return fallbackStyleId ? [fallbackStyleId] : [];
}

function parseBackgroundMode(value: FormDataEntryValue | null) {
  if (value === "blur" || value === "replace") {
    return value;
  }

  return "keep";
}

function parseViewMode(value: FormDataEntryValue | null) {
  return value === "three-view" ? "three-view" : "front";
}

async function fetchReferenceImage(imageUrl: string, filename: string) {
  try {
    const response = await fetch(imageUrl, {
      headers: { "user-agent": "TryEyeglasses image reference fetcher" },
    });

    if (!response.ok) {
      return null;
    }

    const contentType = response.headers.get("content-type") ?? "image/jpeg";
    const blob = await response.blob();

    return new File([blob], filename, { type: contentType });
  } catch {
    return null;
  }
}

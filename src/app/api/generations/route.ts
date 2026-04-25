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
  hashGateInput,
} from "@/lib/free-gate";
import { getStyleById } from "@/lib/glasses/catalog";
import { storeResultImage } from "@/lib/storage/r2";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const cookieStore = await cookies();

  if (
    !canUseAnonymousFreeGeneration(cookieStore.get(FREE_GENERATION_COOKIE)?.value)
  ) {
    return NextResponse.json(
      {
        error: "SIGN_UP_REQUIRED",
        message: "Your free try-on is ready. Create an account to generate more.",
      },
      { status: 402 },
    );
  }

  const formData = await request.formData();
  const image = formData.get("image");
  const styleId = String(formData.get("styleId") ?? "");
  const userStyleDescription = String(formData.get("userStyleDescription") ?? "");
  const style = getStyleById(styleId);

  if (!(image instanceof File) || image.size === 0) {
    return NextResponse.json(
      { error: "IMAGE_REQUIRED", message: "Upload or capture a face photo." },
      { status: 400 },
    );
  }

  if (!style) {
    return NextResponse.json(
      { error: "STYLE_REQUIRED", message: "Choose an eyeglasses style." },
      { status: 400 },
    );
  }

  const prompt = buildTryOnPrompt({ style, userStyleDescription });
  const generationId = nanoid();
  const claimId = nanoid();
  const requestHeaders = await headers();
  const fingerprint = [
    requestHeaders.get("x-forwarded-for") ?? "unknown-ip",
    requestHeaders.get("user-agent") ?? "unknown-agent",
    cookieStore.get("teg_device")?.value ?? "new-device",
  ].join("|");

  try {
    const db = getDb();
    db.insert(glassesStyles)
      .values({
        id: style.id,
        name: style.name,
        family: style.family,
        fit: style.fit,
        color: style.color,
        material: style.material,
        promptNotes: style.promptNotes,
      })
      .onConflictDoNothing()
      .run();

    db.insert(anonymousGenerationClaims)
      .values({
        id: claimId,
        fingerprintHash: hashGateInput(fingerprint),
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
        styleId: style.id,
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
    const result = await generateTryOnImage({ image, prompt });
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
      styleName: style.name,
      model: env().IMAGE_MODEL,
      source: result.source,
    });

    response.cookies.set(FREE_GENERATION_COOKIE, "claimed", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 180,
      path: "/",
    });

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

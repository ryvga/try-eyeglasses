import { nanoid } from "nanoid";
import { env } from "@/lib/config";

const OPENAI_IMAGE_EDIT_ENDPOINT = "https://api.openai.com/v1/images/edits";
const MAX_OPENAI_IMAGE_ATTEMPTS = 3;
const RETRYABLE_STATUSES = new Set([408, 409, 429, 500, 502, 503, 504]);

export class ImageGenerationError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly requestId?: string | null,
  ) {
    super(message);
    this.name = "ImageGenerationError";
  }
}

export type GenerateTryOnInput = {
  image: File;
  frameImage?: File;
  prompt: string;
  apiKey?: string;
};

export type GenerateTryOnResult = {
  id: string;
  mimeType: string;
  bytes: Buffer;
  source: "openai" | "demo";
};

export async function generateTryOnImage({
  image,
  frameImage,
  prompt,
  apiKey,
}: GenerateTryOnInput): Promise<GenerateTryOnResult> {
  const openAiApiKey = apiKey?.trim() || env().OPENAI_API_KEY;

  if (!openAiApiKey) {
    return createDemoResult(prompt);
  }

  const formData = new FormData();
  formData.set("model", env().IMAGE_MODEL);
  formData.set("prompt", prompt);
  formData.set("n", String(env().IMAGE_OUTPUT_COUNT));
  formData.set("size", env().IMAGE_SIZE);
  formData.set("quality", env().IMAGE_QUALITY);
  formData.append("image", image);
  if (frameImage) {
    formData.append("image", frameImage);
  }

  const response = await requestOpenAIImageEdit(formData, openAiApiKey);

  const payload = (await response.json()) as {
    data?: Array<{ b64_json?: string; url?: string }>;
  };
  const first = payload.data?.[0];

  if (!first) {
    throw new Error("OpenAI returned no image data.");
  }

  if (first.b64_json) {
    return {
      id: nanoid(),
      mimeType: "image/png",
      bytes: Buffer.from(first.b64_json, "base64"),
      source: "openai",
    };
  }

  if (first.url) {
    const imageResponse = await fetch(first.url);
    const arrayBuffer = await imageResponse.arrayBuffer();

    return {
      id: nanoid(),
      mimeType: imageResponse.headers.get("content-type") ?? "image/png",
      bytes: Buffer.from(arrayBuffer),
      source: "openai",
    };
  }

  throw new Error("OpenAI response did not include a usable image.");
}

async function requestOpenAIImageEdit(formData: FormData, apiKey: string) {
  let lastStatus: number | undefined;
  let lastRequestId: string | null = null;

  for (let attempt = 1; attempt <= MAX_OPENAI_IMAGE_ATTEMPTS; attempt += 1) {
    const response = await fetch(OPENAI_IMAGE_EDIT_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    });

    if (response.ok) {
      return response;
    }

    lastStatus = response.status;
    lastRequestId = response.headers.get("x-request-id");

    if (
      !RETRYABLE_STATUSES.has(response.status) ||
      attempt === MAX_OPENAI_IMAGE_ATTEMPTS
    ) {
      throw new ImageGenerationError(
        publicOpenAIErrorMessage(response.status),
        response.status,
        lastRequestId,
      );
    }

    await delay(450 * attempt);
  }

  throw new ImageGenerationError(
    "OpenAI image service had a temporary error. Please try again.",
    lastStatus,
    lastRequestId,
  );
}

function publicOpenAIErrorMessage(status: number) {
  if (status >= 500 || status === 408 || status === 409 || status === 429) {
    return "OpenAI image service had a temporary error. Please try again.";
  }

  return "The image generation request could not be completed. Please try a different photo.";
}

function delay(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

function createDemoResult(prompt: string): GenerateTryOnResult {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1536" height="1024" viewBox="0 0 1536 1024">
  <rect width="1536" height="1024" fill="#f8f4ea"/>
  <rect x="96" y="96" width="1344" height="832" rx="28" fill="#fffdf8" stroke="#57534e" stroke-width="3"/>
  <circle cx="768" cy="430" r="160" fill="#e7d2bd"/>
  <path d="M598 438 C640 410 696 410 736 438 M800 438 C840 410 896 410 938 438" fill="none" stroke="#292524" stroke-width="18" stroke-linecap="round"/>
  <path d="M736 438 C758 452 778 452 800 438" fill="none" stroke="#292524" stroke-width="10" stroke-linecap="round"/>
  <path d="M575 437 C510 405 472 392 428 396 M961 437 C1026 405 1064 392 1108 396" fill="none" stroke="#292524" stroke-width="10" stroke-linecap="round"/>
  <text x="768" y="700" text-anchor="middle" font-family="Inter, Arial" font-size="42" fill="#292524" font-weight="700">Demo try-on preview</text>
  <text x="768" y="760" text-anchor="middle" font-family="Inter, Arial" font-size="22" fill="#78716c">Set OPENAI_API_KEY to generate real gpt-image-2 results.</text>
  <text x="768" y="820" text-anchor="middle" font-family="monospace" font-size="16" fill="#a8a29e">${escapeXml(prompt.slice(0, 140))}</text>
</svg>`;

  return {
    id: nanoid(),
    mimeType: "image/svg+xml",
    bytes: Buffer.from(svg),
    source: "demo",
  };
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

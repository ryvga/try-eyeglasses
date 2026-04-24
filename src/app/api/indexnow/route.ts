import { NextResponse } from "next/server";
import { env } from "@/lib/config";
import { CANONICAL_HOST, canonicalUrl } from "@/lib/seo";

export async function POST(request: Request) {
  if (!env().INDEXNOW_KEY) {
    return NextResponse.json(
      { error: "INDEXNOW_NOT_CONFIGURED" },
      { status: 503 },
    );
  }

  const body = (await request.json()) as { urls?: string[] };
  const urls = body.urls?.length ? body.urls : [canonicalUrl("/")];
  const response = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      host: CANONICAL_HOST,
      key: env().INDEXNOW_KEY,
      keyLocation: canonicalUrl("/indexnow-key.txt"),
      urlList: urls,
    }),
  });

  return NextResponse.json({
    submitted: response.ok,
    status: response.status,
  });
}

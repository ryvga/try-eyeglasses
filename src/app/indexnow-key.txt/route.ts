import { NextResponse } from "next/server";
import { env } from "@/lib/config";

export function GET() {
  return new NextResponse(env().INDEXNOW_KEY ?? "set-INDEXNOW_KEY-in-env", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}

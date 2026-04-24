import { NextRequest, NextResponse } from "next/server";
import { getCanonicalRedirectUrl, shouldRedirectToCanonical } from "@/lib/seo";

export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const protocol =
    request.headers.get("x-forwarded-proto") ??
    request.nextUrl.protocol.replace(":", "");

  if (
    shouldRedirectToCanonical(
      host,
      protocol.endsWith(":") ? protocol : `${protocol}:`,
    )
  ) {
    return NextResponse.redirect(getCanonicalRedirectUrl(request.nextUrl), 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/health).*)"],
};

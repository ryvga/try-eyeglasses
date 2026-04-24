import { NextResponse } from "next/server";
import { createPayPalOrder, getCreditPack } from "@/lib/payments/paypal";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json()) as { packId?: string };
  const pack = getCreditPack(body.packId ?? "starter");

  if (!pack) {
    return NextResponse.json(
      { error: "PACK_NOT_FOUND", message: "Unknown credit pack." },
      { status: 400 },
    );
  }

  const order = await createPayPalOrder(pack);

  return NextResponse.json({
    id: order.id,
    status: order.status,
    credits: pack.credits,
    amountCents: pack.amountCents,
  });
}

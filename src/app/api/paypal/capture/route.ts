import { NextResponse } from "next/server";
import { capturePayPalOrder } from "@/lib/payments/paypal";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json()) as { orderId?: string };

  if (!body.orderId) {
    return NextResponse.json(
      { error: "ORDER_REQUIRED", message: "Missing PayPal order id." },
      { status: 400 },
    );
  }

  const capture = await capturePayPalOrder(body.orderId);

  return NextResponse.json({
    status: "captured",
    capture,
    message: "Credits unlocked.",
  });
}

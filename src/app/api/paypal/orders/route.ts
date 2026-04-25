import { NextResponse } from "next/server";
import { createPayPalOrder, getCreditPack, PayPalError } from "@/lib/payments/paypal";

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

  try {
    const order = await createPayPalOrder(pack);

    return NextResponse.json({
      id: order.id,
      status: order.status,
      approveUrl: order.approveUrl,
      credits: pack.credits,
      amountCents: pack.amountCents,
    });
  } catch (error) {
    if (error instanceof PayPalError) {
      console.error("PayPal order creation failed", {
        status: error.status,
        details: error.details,
      });
    }

    return NextResponse.json(
      {
        error: "PAYPAL_ORDER_FAILED",
        message:
          error instanceof Error
            ? error.message
            : "Could not create PayPal order.",
      },
      { status: 502 },
    );
  }
}

import { NextResponse } from "next/server";
import { capturePayPalOrder, PayPalError } from "@/lib/payments/paypal";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json()) as { orderId?: string };

  if (!body.orderId) {
    return NextResponse.json(
      { error: "ORDER_REQUIRED", message: "Missing PayPal order id." },
      { status: 400 },
    );
  }

  try {
    const capture = await capturePayPalOrder(body.orderId);

    return NextResponse.json({
      status: "captured",
      capture,
      message: "Credits unlocked.",
    });
  } catch (error) {
    if (error instanceof PayPalError) {
      console.error("PayPal capture failed", {
        status: error.status,
        details: error.details,
      });
    }

    return NextResponse.json(
      {
        error: "PAYPAL_CAPTURE_FAILED",
        message:
          error instanceof Error
            ? error.message
            : "Could not capture PayPal order.",
      },
      { status: 502 },
    );
  }
}

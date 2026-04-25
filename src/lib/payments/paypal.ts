import { env, requireEnv } from "@/lib/config";
import { CANONICAL_ORIGIN } from "@/lib/seo";

const PAYPAL_ORIGINS = {
  sandbox: "https://api-m.sandbox.paypal.com",
  live: "https://api-m.paypal.com",
};

export type CreditPack = {
  id: string;
  label: string;
  credits: number;
  amountCents: number;
};

type PayPalLink = {
  href: string;
  rel: string;
  method?: string;
};

type PayPalOrder = {
  id: string;
  status: string;
  links?: PayPalLink[];
  approveUrl?: string;
  demo?: boolean;
};

export class PayPalError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly details?: string,
  ) {
    super(message);
    this.name = "PayPalError";
  }
}

export const CREDIT_PACKS: CreditPack[] = [
  { id: "starter", label: "Starter", credits: 5, amountCents: 500 },
  { id: "creator", label: "Creator", credits: 20, amountCents: 1500 },
  { id: "studio", label: "Studio", credits: 60, amountCents: 3600 },
];

export function getCreditPack(packId: string) {
  return CREDIT_PACKS.find((pack) => pack.id === packId);
}

async function getAccessToken() {
  const credentials = Buffer.from(
    `${requireEnv("PAYPAL_CLIENT_ID")}:${requireEnv("PAYPAL_CLIENT_SECRET")}`,
  ).toString("base64");

  const response = await fetch(`${PAYPAL_ORIGINS[env().PAYPAL_ENV]}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    throw new Error(`PayPal token request failed: ${response.status}`);
  }

  const payload = (await response.json()) as { access_token: string };
  return payload.access_token;
}

export async function createPayPalOrder(pack: CreditPack) {
  if (!env().PAYPAL_CLIENT_ID || !env().PAYPAL_CLIENT_SECRET) {
    return {
      id: `demo-order-${pack.id}`,
      status: "CREATED",
      approveUrl: `/checkout?token=demo-order-${pack.id}`,
      demo: true,
    };
  }

  const token = await getAccessToken();
  const response = await fetch(`${PAYPAL_ORIGINS[env().PAYPAL_ENV]}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "PayPal-Request-Id": `tryeyeglasses-${pack.id}-${Date.now()}`,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      payment_source: {
        paypal: {
          experience_context: {
            brand_name: "TryEyeglasses",
            landing_page: "LOGIN",
            user_action: "PAY_NOW",
            return_url: `${CANONICAL_ORIGIN}/checkout`,
            cancel_url: `${CANONICAL_ORIGIN}/checkout?cancelled=1`,
          },
        },
      },
      purchase_units: [
        {
          description: `${pack.credits} TryEyeglasses credits`,
          amount: {
            currency_code: "USD",
            value: (pack.amountCents / 100).toFixed(2),
          },
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new PayPalError(
      "Could not create PayPal order.",
      response.status,
      await response.text(),
    );
  }

  const order = (await response.json()) as PayPalOrder;

  return {
    ...order,
    approveUrl: order.links?.find((link) => link.rel === "approve")?.href,
  };
}

export async function capturePayPalOrder(orderId: string) {
  if (orderId.startsWith("demo-order-")) {
    return {
      id: orderId,
      status: "COMPLETED",
      purchase_units: [{ payments: { captures: [{ id: `${orderId}-capture` }] } }],
      demo: true,
    };
  }

  const token = await getAccessToken();
  const response = await fetch(
    `${PAYPAL_ORIGINS[env().PAYPAL_ENV]}/v2/checkout/orders/${orderId}/capture`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "PayPal-Request-Id": `tryeyeglasses-capture-${orderId}`,
      },
    },
  );

  if (!response.ok) {
    throw new PayPalError(
      "Could not capture PayPal order.",
      response.status,
      await response.text(),
    );
  }

  return response.json();
}

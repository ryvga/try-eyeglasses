import { afterEach, describe, expect, it, vi } from "vitest";

const ORIGINAL_ENV = { ...process.env };

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
  vi.restoreAllMocks();
  vi.resetModules();
});

describe("createPayPalOrder", () => {
  it("creates an order with return URLs and exposes the approval URL", async () => {
    process.env.PAYPAL_ENV = "sandbox";
    process.env.PAYPAL_CLIENT_ID = "client-id";
    process.env.PAYPAL_CLIENT_SECRET = "client-secret";

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(Response.json({ access_token: "token" }))
      .mockResolvedValueOnce(
        Response.json({
          id: "ORDER-123",
          status: "CREATED",
          links: [
            {
              rel: "approve",
              href: "https://www.sandbox.paypal.com/checkoutnow?token=ORDER-123",
              method: "GET",
            },
          ],
        }),
      );
    vi.stubGlobal("fetch", fetchMock);

    const { createPayPalOrder, CREDIT_PACKS } = await import("./paypal");
    const order = await createPayPalOrder(CREDIT_PACKS[0]);
    const createCallBody = JSON.parse(fetchMock.mock.calls[1][1].body);

    expect(order.approveUrl).toBe(
      "https://www.sandbox.paypal.com/checkoutnow?token=ORDER-123",
    );
    expect(createCallBody.payment_source.paypal.experience_context).toMatchObject({
      return_url: "https://tryeyeglasses.com/checkout",
      cancel_url: "https://tryeyeglasses.com/checkout?cancelled=1",
    });
  });
});

import { afterEach, describe, expect, it, vi } from "vitest";

const ORIGINAL_ENV = { ...process.env };

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
  vi.resetModules();
});

describe("env", () => {
  it("treats blank optional values as unset", async () => {
    process.env.R2_PUBLIC_BASE_URL = "";
    process.env.PAYPAL_CLIENT_ID = "";
    process.env.PAYPAL_CLIENT_SECRET = "";

    const { env } = await import("./config");

    expect(env().R2_PUBLIC_BASE_URL).toBeUndefined();
    expect(env().PAYPAL_CLIENT_ID).toBeUndefined();
    expect(env().PAYPAL_CLIENT_SECRET).toBeUndefined();
  });

  it("rejects invalid configured URLs", async () => {
    process.env.R2_PUBLIC_BASE_URL = "not-a-url";

    const { env } = await import("./config");

    expect(() => env()).toThrow();
  });
});

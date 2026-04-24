import { describe, expect, it } from "vitest";
import {
  canonicalUrl,
  getCanonicalRedirectUrl,
  shouldRedirectToCanonical,
} from "@/lib/seo";

describe("seo canonical helpers", () => {
  it("always builds canonical tryeyeglasses.com URLs", () => {
    expect(canonicalUrl("/try-on-glasses")).toBe(
      "https://tryeyeglasses.com/try-on-glasses",
    );
  });

  it("redirects alternate domains and http traffic", () => {
    expect(shouldRedirectToCanonical("useeyeglasses.com", "https:")).toBe(true);
    expect(shouldRedirectToCanonical("www.tryeyeglasses.com", "https:")).toBe(
      true,
    );
    expect(shouldRedirectToCanonical("tryeyeglasses.com", "http:")).toBe(true);
    expect(shouldRedirectToCanonical("tryeyeglasses.com", "https:")).toBe(
      false,
    );
    expect(shouldRedirectToCanonical("localhost:3000", "http:")).toBe(false);
  });

  it("preserves paths and useful attribution params only", () => {
    const input = new URL(
      "https://useeyeglasses.com/faq?utm_source=ad&q=duplicate",
    );
    const output = getCanonicalRedirectUrl(input);

    expect(output.toString()).toBe(
      "https://tryeyeglasses.com/faq?utm_source=ad",
    );
  });
});

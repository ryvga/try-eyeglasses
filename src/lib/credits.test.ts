import { describe, expect, it } from "vitest";
import { applyCreditDelta, canDebitCredits } from "@/lib/credits";

describe("credits", () => {
  it("allows debits only when enough balance exists", () => {
    expect(canDebitCredits(1)).toBe(true);
    expect(canDebitCredits(0)).toBe(false);
    expect(canDebitCredits(4, 5)).toBe(false);
  });

  it("applies purchases and generation debits", () => {
    expect(applyCreditDelta(0, 5)).toBe(5);
    expect(applyCreditDelta(5, -1)).toBe(4);
  });

  it("rejects negative balances", () => {
    expect(() => applyCreditDelta(0, -1)).toThrow("cannot be negative");
  });
});

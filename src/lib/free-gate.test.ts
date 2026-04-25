import { describe, expect, it } from "vitest";
import { canUseAnonymousFreeGeneration, hashGateInput } from "@/lib/free-gate";

describe("anonymous free gate", () => {
  it("allows users without a claimed cookie", () => {
    expect(canUseAnonymousFreeGeneration(undefined)).toBe(true);
    expect(canUseAnonymousFreeGeneration(null)).toBe(true);
  });

  it("blocks a second anonymous generation on the same day", () => {
    expect(
      canUseAnonymousFreeGeneration("2026-04-25", new Date("2026-04-25T12:00:00Z")),
    ).toBe(false);
  });

  it("allows a new free generation on a later day", () => {
    expect(
      canUseAnonymousFreeGeneration("2026-04-24", new Date("2026-04-25T12:00:00Z")),
    ).toBe(true);
  });

  it("hashes gate identifiers deterministically without storing raw input", () => {
    const first = hashGateInput("ip|agent|device");
    const second = hashGateInput("ip|agent|device");

    expect(first).toBe(second);
    expect(first).not.toContain("ip|agent|device");
    expect(first).toHaveLength(64);
  });
});

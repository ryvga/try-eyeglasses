import { describe, expect, it } from "vitest";
import { GLASSES_STYLES } from "@/lib/glasses/catalog";
import { buildTryOnPrompt } from "@/lib/ai/prompt";

describe("buildTryOnPrompt", () => {
  it("preserves identity, background, lighting, and composition", () => {
    const prompt = buildTryOnPrompt({ style: GLASSES_STYLES[0] });

    expect(prompt).toContain("Preserve the person's identity");
    expect(prompt).toContain("background");
    expect(prompt).toContain("lighting direction");
    expect(prompt).toContain("original composition");
    expect(prompt).toContain("Change only the eyewear");
  });

  it("uses user reference notes when provided", () => {
    const prompt = buildTryOnPrompt({
      style: GLASSES_STYLES[0],
      userStyleDescription: "thin silver rimless glasses",
    });

    expect(prompt).toContain("thin silver rimless glasses");
    expect(prompt).not.toContain(GLASSES_STYLES[0].promptNotes);
  });
});

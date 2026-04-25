import { describe, expect, it } from "vitest";
import { GLASSES_STYLES } from "@/lib/glasses/catalog";
import { buildTryOnPrompt } from "@/lib/ai/prompt";

describe("buildTryOnPrompt", () => {
  it("preserves identity, background, lighting, and composition", () => {
    const prompt = buildTryOnPrompt({ styles: [GLASSES_STYLES[0]] });

    expect(prompt).toContain("Preserve the person's identity");
    expect(prompt).toContain("background");
    expect(prompt).toContain("lighting direction");
    expect(prompt).toContain("original composition");
    expect(prompt).toContain("Change only the eyewear");
  });

  it("uses user reference notes when provided", () => {
    const prompt = buildTryOnPrompt({
      styles: [GLASSES_STYLES[0]],
      userStyleDescription: "thin silver rimless glasses",
    });

    expect(prompt).toContain("thin silver rimless glasses");
    expect(prompt).not.toContain(GLASSES_STYLES[0].promptNotes);
  });

  it("builds one landscape contact sheet prompt for multiple frames", () => {
    const prompt = buildTryOnPrompt({
      styles: GLASSES_STYLES.slice(0, 4),
      backgroundMode: "blur",
    });

    expect(prompt).toContain("one single 1536x1024 landscape contact sheet");
    expect(prompt).toContain("4 labeled try-on variations");
    expect(prompt).toContain("subtle realistic portrait-depth blur");
  });

  it("limits three-view mode to three frames", () => {
    const prompt = buildTryOnPrompt({
      styles: GLASSES_STYLES.slice(0, 8),
      viewMode: "three-view",
    });

    expect(prompt).toContain("3 labeled try-on variations");
    expect(prompt).toContain("front view, slight left turn, and slight right turn");
  });
});

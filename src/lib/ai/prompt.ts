import type { GlassesStyle } from "@/lib/glasses/catalog";

export type TryOnPromptInput = {
  styles: GlassesStyle[];
  userStyleDescription?: string;
  backgroundMode?: "keep" | "blur" | "replace";
  customBackgroundPrompt?: string;
  viewMode?: "front" | "three-view";
  hasFrameReference?: boolean;
};

export function buildTryOnPrompt({
  styles,
  userStyleDescription,
  backgroundMode = "keep",
  customBackgroundPrompt,
  viewMode = "front",
  hasFrameReference = false,
}: TryOnPromptInput) {
  const selectedStyles = styles.slice(0, viewMode === "three-view" ? 3 : 8);
  const frameDescription =
    userStyleDescription?.trim() ||
    selectedStyles
      .map((style, index) => `${index + 1}. ${style.promptNotes}`)
      .join("\n");
  const backgroundInstruction =
    backgroundMode === "blur"
      ? "Keep the original background content and composition, but apply a subtle realistic portrait-depth blur behind the person only."
      : backgroundMode === "replace"
        ? `Replace only the background with this setting while preserving the person perfectly: ${customBackgroundPrompt?.trim() || "a clean softly lit optical studio backdrop"}.`
        : "Keep the original background unchanged.";
  const boardInstruction =
    selectedStyles.length === 1
      ? "Return one finished photorealistic image of the person wearing the selected frame."
      : [
          `Return one single 1536x1024 landscape contact sheet containing ${selectedStyles.length} labeled try-on variations generated in the same image.`,
          "Use a clean grid with equal-size crops, consistent face scale, and small unobtrusive labels in each tile with the brand/model and approximate price.",
          "Every tile must show the same person, same pose, same lighting, and a different selected frame. Do not make separate files.",
        ].join(" ");
  const viewInstruction =
    viewMode === "three-view"
      ? "For each frame, make a compact three-view set: front view, slight left turn, and slight right turn. Keep the face recognizable and natural in every view."
      : "Use the original camera angle and composition.";

  return [
    "Create a realistic virtual eyeglasses try-on edit of the provided person photo.",
    `Eyewear to add:\n${frameDescription}.`,
    hasFrameReference
      ? "Use the additional frame reference image as visual guidance for frame shape, thickness, lens tint, color, material, and hinge details."
      : "If no frame reference image is provided, infer the frame from the brand/model/style description.",
    "Preserve the person's identity, face shape, expression, skin tone, hair, clothing, pose, camera angle, focal length, background, lighting direction, shadows, image grain, and original composition.",
    backgroundInstruction,
    "Change only the eyewear and requested background treatment. Do not beautify the person, change their age, alter facial features, add makeup, change the hairstyle, or distort the face.",
    "Fit the glasses naturally on the bridge of the nose and ears with realistic scale, reflections, lens transparency, lens distortion, contact shadows, and perspective.",
    viewInstruction,
    boardInstruction,
    "Make the result polished enough for a consumer product preview, with no fake UI chrome and no duplicated full before/after panels inside the image.",
  ].join("\n");
}

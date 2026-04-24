import type { GlassesStyle } from "@/lib/glasses/catalog";

export type TryOnPromptInput = {
  style: GlassesStyle;
  userStyleDescription?: string;
};

export function buildTryOnPrompt({
  style,
  userStyleDescription,
}: TryOnPromptInput) {
  const frameDescription = userStyleDescription?.trim() || style.promptNotes;

  return [
    "Create a realistic virtual eyeglasses try-on edit of the provided person photo.",
    `Eyewear to add: ${frameDescription}.`,
    "Preserve the person's identity, face shape, expression, skin tone, hair, clothing, pose, camera angle, focal length, background, lighting direction, shadows, image grain, and original composition.",
    "Change only the eyewear. Do not beautify the person, change their age, alter facial features, change the background, add makeup, change the hairstyle, or crop the image.",
    "Fit the glasses naturally on the bridge of the nose and ears with realistic scale, reflections, lens transparency, lens distortion, contact shadows, and perspective.",
    "Return one finished photorealistic image suitable for a consumer product preview.",
  ].join("\n");
}

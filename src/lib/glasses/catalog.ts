export type GlassesStyle = {
  id: string;
  name: string;
  family: string;
  fit: string;
  color: string;
  material: string;
  promptNotes: string;
};

export const GLASSES_STYLES: GlassesStyle[] = [
  {
    id: "paper-thin-round",
    name: "Paper Thin Round",
    family: "round",
    fit: "lightweight balanced fit",
    color: "brushed champagne",
    material: "thin titanium wire",
    promptNotes:
      "delicate round titanium eyeglasses with clear nose pads and slim temples",
  },
  {
    id: "studio-rectangle",
    name: "Studio Rectangle",
    family: "rectangular",
    fit: "medium width professional fit",
    color: "matte black",
    material: "acetate and metal hinge",
    promptNotes:
      "clean rectangular matte black acetate eyeglasses with a refined office look",
  },
  {
    id: "soft-square-honey",
    name: "Soft Square Honey",
    family: "square",
    fit: "slightly oversized soft fit",
    color: "transparent honey",
    material: "polished acetate",
    promptNotes:
      "transparent honey acetate soft square eyeglasses with gentle rounded corners",
  },
  {
    id: "keyhole-classic",
    name: "Keyhole Classic",
    family: "panto",
    fit: "classic bridge fit",
    color: "deep tortoise",
    material: "layered acetate",
    promptNotes:
      "vintage panto eyeglasses with keyhole bridge and deep tortoise acetate",
  },
  {
    id: "airline-metal",
    name: "Airline Metal",
    family: "aviator",
    fit: "wide lightweight fit",
    color: "warm silver",
    material: "polished stainless steel",
    promptNotes:
      "modern aviator-inspired prescription eyeglasses in warm silver metal",
  },
  {
    id: "editorial-cat-eye",
    name: "Editorial Cat Eye",
    family: "cat-eye",
    fit: "lifted elegant fit",
    color: "ink brown",
    material: "gloss acetate",
    promptNotes:
      "subtle cat-eye eyeglasses with lifted outer corners in glossy ink brown acetate",
  },
];

export function getStyleById(styleId: string) {
  return GLASSES_STYLES.find((style) => style.id === styleId);
}

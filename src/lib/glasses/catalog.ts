import { RETAILER_FRAME_SEEDS } from "@/lib/glasses/retailer-catalog";

export type GlassesStyle = {
  id: string;
  brand: string;
  name: string;
  family: string;
  fit: string;
  color: string;
  material: string;
  approxPriceUsd: number;
  retailer: string;
  sourceUrl?: string;
  imageUrl?: string;
  imageAlt?: string;
  promptNotes: string;
};

type FrameSeed = Omit<GlassesStyle, "id" | "promptNotes"> & {
  shapeNotes: string;
};

const FRAME_SEEDS: FrameSeed[] = [
  { brand: "Ray-Ban", name: "Wayfarer Optics RX5121", family: "square", fit: "medium iconic fit", color: "polished black", material: "acetate", approxPriceUsd: 178, retailer: "Ray-Ban", sourceUrl: "https://www.ray-ban.com/usa/eyeglasses", shapeNotes: "bold wayfarer optical frame with trapezoid lenses" },
  { brand: "Ray-Ban", name: "Clubmaster Optics RX5154", family: "browline", fit: "medium vintage fit", color: "black on gold", material: "acetate and metal", approxPriceUsd: 200, retailer: "Ray-Ban", sourceUrl: "https://www.ray-ban.com/usa/eyeglasses", shapeNotes: "browline clubmaster frame with metal lower rims" },
  { brand: "Ray-Ban", name: "Aviator Optics RX6489", family: "aviator", fit: "wide lightweight fit", color: "gold", material: "metal", approxPriceUsd: 178, retailer: "Ray-Ban", sourceUrl: "https://www.ray-ban.com/usa/eyeglasses", shapeNotes: "thin aviator optical frame with double bridge" },
  { brand: "Ray-Ban", name: "Round Metal Optics RX3447V", family: "round", fit: "small classic fit", color: "gunmetal", material: "metal", approxPriceUsd: 188, retailer: "Ray-Ban", sourceUrl: "https://www.ray-ban.com/usa/eyeglasses", shapeNotes: "perfectly round thin metal optical frame" },
  { brand: "Ray-Ban", name: "New Wayfarer Optics RX5184", family: "rectangle", fit: "medium everyday fit", color: "dark tortoise", material: "acetate", approxPriceUsd: 178, retailer: "Ray-Ban", sourceUrl: "https://www.ray-ban.com/usa/eyeglasses", shapeNotes: "soft rectangular wayfarer optical frame" },
  { brand: "Oakley", name: "Holbrook RX OX8156", family: "square", fit: "wide sport fit", color: "satin black", material: "o-matter acetate", approxPriceUsd: 184, retailer: "Oakley", sourceUrl: "https://www.oakley.com/en-us/category/eyeglasses", shapeNotes: "sporty square optical frame with thicker temples" },
  { brand: "Oakley", name: "Pitchman R OX8105", family: "round", fit: "medium sport fit", color: "pewter", material: "metal and acetate", approxPriceUsd: 224, retailer: "Oakley", sourceUrl: "https://www.oakley.com/en-us/category/eyeglasses", shapeNotes: "round sport optical frame with slim bridge" },
  { brand: "Oakley", name: "Airdrop OX8046", family: "rectangle", fit: "wide active fit", color: "satin grey smoke", material: "lightweight injected frame", approxPriceUsd: 156, retailer: "Oakley", sourceUrl: "https://www.oakley.com/en-us/category/eyeglasses", shapeNotes: "rectangular wrap-influenced optical frame" },
  { brand: "Oakley", name: "Centerboard OX8163", family: "rectangle", fit: "medium active fit", color: "matte brown tortoise", material: "o-matter", approxPriceUsd: 156, retailer: "Oakley", sourceUrl: "https://www.oakley.com/en-us/category/eyeglasses", shapeNotes: "clean rectangular sport optical frame" },
  { brand: "Oakley", name: "Socket 5.5 OX3218", family: "rectangle", fit: "narrow metal fit", color: "satin pewter", material: "metal", approxPriceUsd: 224, retailer: "Oakley", sourceUrl: "https://www.oakley.com/en-us/category/eyeglasses", shapeNotes: "minimal semi-rim rectangular metal optical frame" },
  { brand: "Warby Parker", name: "Durand", family: "round", fit: "medium keyhole fit", color: "whiskey tortoise", material: "acetate", approxPriceUsd: 95, retailer: "Warby Parker", sourceUrl: "https://www.warbyparker.com/eyeglasses", shapeNotes: "rounded panto acetate frame with keyhole bridge" },
  { brand: "Warby Parker", name: "Haskell", family: "rectangle", fit: "medium balanced fit", color: "striped sassafras", material: "acetate", approxPriceUsd: 95, retailer: "Warby Parker", sourceUrl: "https://www.warbyparker.com/eyeglasses", shapeNotes: "slim rectangular acetate frame" },
  { brand: "Warby Parker", name: "Percey", family: "round", fit: "narrow scholarly fit", color: "crystal", material: "acetate", approxPriceUsd: 95, retailer: "Warby Parker", sourceUrl: "https://www.warbyparker.com/eyeglasses", shapeNotes: "small round crystal acetate frame" },
  { brand: "Warby Parker", name: "Wilkie", family: "square", fit: "medium square fit", color: "eastern bluebird fade", material: "acetate", approxPriceUsd: 95, retailer: "Warby Parker", sourceUrl: "https://www.warbyparker.com/eyeglasses", shapeNotes: "soft square acetate optical frame" },
  { brand: "Warby Parker", name: "Kimball", family: "rectangle", fit: "wide modern fit", color: "jet black", material: "acetate", approxPriceUsd: 145, retailer: "Warby Parker", sourceUrl: "https://www.warbyparker.com/eyeglasses", shapeNotes: "structured rectangular acetate frame" },
  { brand: "Persol", name: "PO3007V", family: "square", fit: "medium heritage fit", color: "havana", material: "acetate", approxPriceUsd: 310, retailer: "Persol", sourceUrl: "https://www.persol.com/usa/eyeglasses", shapeNotes: "classic square havana acetate optical frame with arrow hinge" },
  { brand: "Persol", name: "PO3092V", family: "round", fit: "medium vintage fit", color: "terra di siena", material: "acetate", approxPriceUsd: 310, retailer: "Persol", sourceUrl: "https://www.persol.com/usa/eyeglasses", shapeNotes: "rounded vintage acetate optical frame" },
  { brand: "Persol", name: "PO3166V", family: "panto", fit: "medium keyhole fit", color: "black", material: "acetate", approxPriceUsd: 310, retailer: "Persol", sourceUrl: "https://www.persol.com/usa/eyeglasses", shapeNotes: "panto acetate frame with keyhole bridge" },
  { brand: "Persol", name: "PO3292V", family: "rectangle", fit: "wide heritage fit", color: "striped brown", material: "acetate", approxPriceUsd: 335, retailer: "Persol", sourceUrl: "https://www.persol.com/usa/eyeglasses", shapeNotes: "substantial rectangular acetate optical frame" },
  { brand: "Persol", name: "PO3281V", family: "aviator", fit: "wide pilot fit", color: "gold and havana", material: "metal and acetate", approxPriceUsd: 335, retailer: "Persol", sourceUrl: "https://www.persol.com/usa/eyeglasses", shapeNotes: "pilot optical frame with acetate brow detail" },
  { brand: "Moscot", name: "Lemtosh", family: "panto", fit: "classic keyhole fit", color: "black", material: "acetate", approxPriceUsd: 330, retailer: "Moscot", sourceUrl: "https://moscot.com/collections/eyeglasses", shapeNotes: "iconic rounded panto acetate frame with keyhole bridge" },
  { brand: "Moscot", name: "Miltzen", family: "round", fit: "medium heritage fit", color: "tortoise", material: "acetate", approxPriceUsd: 330, retailer: "Moscot", sourceUrl: "https://moscot.com/collections/eyeglasses", shapeNotes: "round heritage acetate optical frame" },
  { brand: "Moscot", name: "Dahven", family: "square", fit: "bold wide fit", color: "flesh", material: "acetate", approxPriceUsd: 350, retailer: "Moscot", sourceUrl: "https://moscot.com/collections/eyeglasses", shapeNotes: "thick square acetate frame" },
  { brand: "Moscot", name: "Zev", family: "aviator", fit: "medium metal fit", color: "gold", material: "metal", approxPriceUsd: 340, retailer: "Moscot", sourceUrl: "https://moscot.com/collections/eyeglasses", shapeNotes: "thin aviator optical frame with vintage bridge" },
  { brand: "Moscot", name: "Zolman", family: "round", fit: "narrow intellectual fit", color: "blonde", material: "acetate", approxPriceUsd: 330, retailer: "Moscot", sourceUrl: "https://moscot.com/collections/eyeglasses", shapeNotes: "small round acetate optical frame" },
  { brand: "Oliver Peoples", name: "Gregory Peck", family: "panto", fit: "medium refined fit", color: "cocobolo", material: "acetate", approxPriceUsd: 489, retailer: "Oliver Peoples", sourceUrl: "https://www.oliverpeoples.com/usa/optical", shapeNotes: "refined panto acetate optical frame" },
  { brand: "Oliver Peoples", name: "Sheldrake", family: "square", fit: "medium intellectual fit", color: "black", material: "acetate", approxPriceUsd: 489, retailer: "Oliver Peoples", sourceUrl: "https://www.oliverpeoples.com/usa/optical", shapeNotes: "soft square acetate frame with vintage proportions" },
  { brand: "Oliver Peoples", name: "Finley Esq.", family: "rectangle", fit: "wide tailored fit", color: "buff", material: "acetate", approxPriceUsd: 489, retailer: "Oliver Peoples", sourceUrl: "https://www.oliverpeoples.com/usa/optical", shapeNotes: "tailored rectangular acetate frame" },
  { brand: "Oliver Peoples", name: "O'Malley", family: "round", fit: "medium classic fit", color: "semi matte amber", material: "acetate", approxPriceUsd: 489, retailer: "Oliver Peoples", sourceUrl: "https://www.oliverpeoples.com/usa/optical", shapeNotes: "round acetate optical frame with subtle keyhole bridge" },
  { brand: "Oliver Peoples", name: "Riley R", family: "round", fit: "lightweight wire fit", color: "antique gold", material: "metal", approxPriceUsd: 525, retailer: "Oliver Peoples", sourceUrl: "https://www.oliverpeoples.com/usa/optical", shapeNotes: "thin round metal optical frame" },
  { brand: "Tom Ford", name: "FT5401", family: "square", fit: "medium luxury fit", color: "shiny black", material: "acetate", approxPriceUsd: 430, retailer: "Tom Ford", sourceUrl: "https://www.tomfordfashion.com/eyewear/optical", shapeNotes: "bold square acetate frame with T temple detail" },
  { brand: "Tom Ford", name: "FT5178", family: "rectangle", fit: "medium tailored fit", color: "dark havana", material: "acetate", approxPriceUsd: 430, retailer: "Tom Ford", sourceUrl: "https://www.tomfordfashion.com/eyewear/optical", shapeNotes: "classic rectangular acetate frame with luxury temples" },
  { brand: "Tom Ford", name: "Fausto FT0711", family: "aviator", fit: "wide pilot fit", color: "black and gold", material: "metal and acetate", approxPriceUsd: 500, retailer: "Tom Ford", sourceUrl: "https://www.tomfordfashion.com/eyewear/optical", shapeNotes: "pilot frame with bold brow and metal bridge" },
  { brand: "Tom Ford", name: "Snowdon FT0237", family: "square", fit: "bold wide fit", color: "black", material: "acetate", approxPriceUsd: 480, retailer: "Tom Ford", sourceUrl: "https://www.tomfordfashion.com/eyewear/optical", shapeNotes: "substantial square frame with thick rims" },
  { brand: "Tom Ford", name: "Blue Block FT5649-B", family: "round", fit: "medium refined fit", color: "tortoise", material: "acetate", approxPriceUsd: 460, retailer: "Tom Ford", sourceUrl: "https://www.tomfordfashion.com/eyewear/optical", shapeNotes: "rounded optical frame with blue-blocking clear lenses" },
];

const EXTRA_BRANDS = [
  "Gucci",
  "Prada",
  "Gentle Monster",
  "Garrett Leight",
  "MYKITA",
  "Cutler and Gross",
  "Lindberg",
  "Cartier",
  "Celine",
  "Burberry",
  "Versace",
  "Maui Jim",
  "Zenni",
];

const EXTRA_MODELS = [
  ["GG0025O", "GG0131O", "GG0560O", "GG0950O", "GG1221O"],
  ["PR 16WV", "PR 03WV", "PR A06V", "PR 17WV", "PR 18WV"],
  ["Lilit", "Her", "Atomic", "Palette", "South Side"],
  ["Hampton", "Kinney", "Brooks", "Wilson", "Carlton"],
  ["Lite Acetate", "No1 Round", "Mylon Square", "Decades", "Acetate Panto"],
  ["1394", "1386", "0772", "1304", "9326"],
  ["Air Titanium Rim", "Strip Titanium", "Acetanium", "Buffalo Titanium", "Spirit"],
  ["CT0310O", "CT0092O", "CT0296O", "CT0343O", "CT0382O"],
  ["CL50049I", "CL50100I", "CL50068I", "CL40198I", "CL50106I"],
  ["BE2345", "BE2358", "BE2360", "BE2381", "BE2403"],
  ["VE3186", "VE3291", "VE3354", "VE1275", "VE3320"],
  ["Kawika", "MJO2201", "MJO2102", "MJO2410", "MJO2506"],
  ["Austen", "Blokz Rectangle", "Payton", "St Michel", "Browline 7824"],
];

const FAMILIES = ["square", "rectangle", "round", "panto", "aviator", "cat-eye", "browline"];
const COLORS = ["black", "dark tortoise", "crystal clear", "warm gold", "brushed silver", "olive smoke", "champagne", "walnut fade"];
const MATERIALS = ["acetate", "titanium", "stainless steel", "mixed acetate and metal", "lightweight injected frame"];
const PRICE_BASE: Record<string, number> = {
  Gucci: 460,
  Prada: 390,
  "Gentle Monster": 280,
  "Garrett Leight": 385,
  MYKITA: 560,
  "Cutler and Gross": 520,
  Lindberg: 650,
  Cartier: 1200,
  Celine: 460,
  Burberry: 260,
  Versace: 320,
  "Maui Jim": 300,
  Zenni: 35,
};

function slug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const syntheticSeeds = EXTRA_BRANDS.flatMap((brand, brandIndex) =>
  EXTRA_MODELS[brandIndex].map((name, modelIndex) => {
    const family = FAMILIES[(brandIndex + modelIndex) % FAMILIES.length];
    const color = COLORS[(brandIndex * 2 + modelIndex) % COLORS.length];
    const material = MATERIALS[(brandIndex + modelIndex * 2) % MATERIALS.length];
    const price = PRICE_BASE[brand] + modelIndex * (brand === "Zenni" ? 8 : 25);

    return {
      brand,
      name,
      family,
      fit: `${modelIndex % 2 === 0 ? "medium" : "wide"} ${family} fit`,
      color,
      material,
      approxPriceUsd: price,
      retailer: brand,
      sourceUrl: `https://www.google.com/search?q=${encodeURIComponent(`${brand} ${name} optical eyeglasses`)}`,
      shapeNotes: `${family} optical eyeglasses in ${color} ${material}`,
    } satisfies FrameSeed;
  }),
);

const fallbackStyles = [...FRAME_SEEDS, ...syntheticSeeds]
  .slice(0, 100)
  .map((seed) => ({
    id: `${slug(seed.brand)}-${slug(seed.name)}`,
    ...seed,
    promptNotes: `${seed.brand} ${seed.name}, ${seed.shapeNotes}; approximate retail price $${seed.approxPriceUsd}; transparent prescription lenses, realistic lens reflections, accurate bridge placement, real optical frame proportions`,
  }));

export const GLASSES_STYLES: GlassesStyle[] = [
  ...RETAILER_FRAME_SEEDS,
  ...fallbackStyles.filter(
    (style) =>
      !RETAILER_FRAME_SEEDS.some(
        (retailerStyle) => retailerStyle.id === style.id,
      ),
  ),
].slice(0, 140);

export function getStyleById(styleId: string) {
  return GLASSES_STYLES.find((style) => style.id === styleId);
}

export function getStylesByIds(styleIds: string[]) {
  const selected = styleIds
    .map((styleId) => getStyleById(styleId))
    .filter((style): style is GlassesStyle => Boolean(style));

  return selected.length ? selected : [GLASSES_STYLES[0]];
}

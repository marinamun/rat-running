// Collections and species for the wildlife map.
// Worldwide lists come from species.generated.json (built by scripts/build-species.mjs).
// "Near you" is loaded live from iNaturalist (see nearby.ts).

import generated from "./species.generated.json";

export const THEME = {
  sand: "#F3EFE4",
  ink: "#2B2420",
  muted: "#6b6359",
  soft: "#8a8278",
  line: "#e2dccf",
  space: "#10243A",
};

// Shared button styles (outline that fills dark on hover)
export const BTN =
  "inline-flex items-center justify-center gap-1.5 rounded-full border-[1.5px] border-[#2B2420] px-5 py-2.5 text-sm font-medium text-[#2B2420] transition-colors hover:bg-[#2B2420] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B2420] focus-visible:ring-offset-2 disabled:opacity-50";
export const BTN_WHITE = `${BTN} bg-white`;
export const BTN_PRIMARY = `${BTN} bg-[#FFD23F]`;

export type Collection = {
  id: string;
  name: string;
  description: string;
  color: string;
};

export type Species = {
  id: string; // "inat-<iNaturalist taxon id>"
  inatId: number;
  collectionId: string;
  rank: number; // 1 = most observed in its list
  name: string;
  scientificName: string;
  description: string | null;
  descriptionSource: { name: string; url: string; license: string } | null;
  photo: { url: string; attribution: string; license: string } | null;
  inatUrl: string;
  iucnUrl: string;
};

export const NEAR_YOU_ID = "near-you";
export const NEAR_YOU_COLOR = "#B9A6F2";

export const COLLECTIONS: Collection[] = [
  {
    id: NEAR_YOU_ID,
    name: "Near you",
    description:
      "The 20 most observed mammals, birds, reptiles and amphibians within 50 km of you",
    color: NEAR_YOU_COLOR,
  },
  ...generated.collections.map((c) => ({
    id: c.id,
    name: c.name,
    description:
      "The 20 most observed mammals, birds, reptiles and amphibians within 50 km of you",
    color: c.color,
  })),
];

export const WORLD_SPECIES = generated.species as Species[];

export const collectionById = new Map(COLLECTIONS.map((c) => [c.id, c]));

export const worldSpeciesIn = (collectionId: string) =>
  WORLD_SPECIES.filter((s) => s.collectionId === collectionId);

// "#FF8A3D" -> "255, 138, 61" (for glowing rings on the globe)
export const hexToRgb = (hex: string) => {
  const n = parseInt(hex.replace("#", ""), 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
};

// Merge species lists without duplicates (a species can be in a world list and near you)
export const mergeSpecies = (...lists: Species[][]) => {
  const byId = new Map<string, Species>();
  for (const list of lists)
    for (const s of list) if (!byId.has(s.id)) byId.set(s.id, s);
  return [...byId.values()];
};

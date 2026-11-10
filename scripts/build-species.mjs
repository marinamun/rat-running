// Builds the worldwide "most observed" species lists for the wildlife map.
//
// Data sources:
//   - Species lists, common names, reference photos: iNaturalist (most-observed, research-grade)
//   - Short descriptions: Wikipedia summaries (via iNaturalist), credited, CC BY-SA
//   - Conservation status: link to the species on the IUCN Red List
//
// Run with Node 18+ from the project root:
//   node scripts/build-species.mjs
// Output: src/wildlife/species.generated.json (commit this file).
// Re-run every few months to refresh the lists.

import { writeFile, mkdir } from "node:fs/promises";

const PER_LIST = 50;
const OUTPUT = "src/wildlife/species.generated.json";
const API = "https://api.inaturalist.org/v1";
const HEADERS = {
  "User-Agent": "LearnAndHelpAnimals species builder (learnandhelpanimals.com)",
  Accept: "application/json",
};

// iNaturalist taxon IDs for each worldwide collection
const COLLECTIONS = [
  { id: "mammals", name: "Mammals", taxonId: 40151, color: "#FF8A3D" },
  { id: "birds", name: "Birds", taxonId: 3, color: "#FFD23F" },
  { id: "reptiles", name: "Reptiles", taxonId: 26036, color: "#9AA77C" },
  { id: "amphibians", name: "Amphibians", taxonId: 20978, color: "#FF85B3" },
  { id: "fish", name: "Fish", taxonId: 47178, color: "#7CC4E8" }, // ray-finned fishes
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// iNaturalist asks API users to stay around 1 request per second
const getJson = async (url) => {
  await sleep(1100);
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.json();
};

const stripHtml = (html) =>
  (html ?? "")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size),
  );

// Most-observed species worldwide for one group
const mostObserved = async (taxonId) => {
  const params = new URLSearchParams({
    taxon_id: String(taxonId),
    quality_grade: "research",
    rank: "species",
    per_page: String(PER_LIST),
    locale: "en",
  });
  const data = await getJson(`${API}/observations/species_counts?${params}`);
  return data.results.map((r) => ({ taxon: r.taxon, observations: r.count }));
};

// Full taxon details (includes the Wikipedia summary), up to 30 per request
const taxonDetails = async (ids) => {
  const byId = new Map();
  for (const group of chunk(ids, 30)) {
    const data = await getJson(`${API}/taxa/${group.join(",")}?locale=en`);
    for (const t of data.results) byId.set(t.id, t);
  }
  return byId;
};

const toSpecies = (collectionId, rank, { taxon, observations }, details) => {
  const d = details.get(taxon.id) ?? taxon;
  const name =
    d.preferred_common_name ?? taxon.preferred_common_name ?? taxon.name;
  const scientificName = taxon.name;
  const photo = d.default_photo ?? taxon.default_photo;
  const summary = stripHtml(d.wikipedia_summary);

  return {
    id: `inat-${taxon.id}`,
    inatId: taxon.id,
    collectionId,
    rank, // 1 = most observed in this collection
    observations,
    name: name.charAt(0).toUpperCase() + name.slice(1),
    scientificName,
    description: summary || null,
    descriptionSource:
      summary && d.wikipedia_url
        ? { name: "Wikipedia", url: d.wikipedia_url, license: "CC BY-SA 4.0" }
        : null,
    // Only keep reference photos with an open license, and keep the credit
    photo:
      photo && photo.license_code
        ? {
            url: photo.medium_url ?? photo.square_url,
            attribution: photo.attribution,
            license: photo.license_code.toUpperCase(),
          }
        : null,
    inatUrl: `https://www.inaturalist.org/taxa/${taxon.id}`,
    iucnUrl: `https://www.iucnredlist.org/search?query=${encodeURIComponent(
      scientificName,
    )}&searchType=species`,
  };
};

const main = async () => {
  const species = [];

  for (const c of COLLECTIONS) {
    console.log(`Fetching ${c.name}…`);
    const top = await mostObserved(c.taxonId);
    const details = await taxonDetails(top.map((t) => t.taxon.id));
    top.forEach((entry, i) =>
      species.push(toSpecies(c.id, i + 1, entry, details)),
    );
    const missing = top.filter(
      (t) => !stripHtml(details.get(t.taxon.id)?.wikipedia_summary),
    ).length;
    console.log(`  ${top.length} species, ${missing} without a description`);
  }

  const output = {
    generatedAt: new Date().toISOString(),
    sources: {
      species: "iNaturalist: most-observed research-grade species worldwide",
      descriptions: "Wikipedia (CC BY-SA 4.0), via iNaturalist",
      status: "IUCN Red List (linked)",
    },
    collections: COLLECTIONS,
    species,
  };

  await mkdir("src/wildlife", { recursive: true });
  await writeFile(OUTPUT, JSON.stringify(output, null, 2));
  console.log(`Saved ${species.length} species to ${OUTPUT}`);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

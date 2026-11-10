import { useEffect, useState } from "react";
import { NEAR_YOU_ID, type Species } from "./data";
import { roundCoord } from "./useSightings";

// Live data from iNaturalist for the "Near you" collection

const API = "https://api.inaturalist.org/v1";
const VERTEBRATES = 355675; // iNaturalist taxon ID for all vertebrates
const RADIUS_KM = 50;

// "Near you" takes the top 10 of each group, so birds don't fill the whole list
const PER_GROUP = 20;
const NEARBY_GROUPS = [
  { name: "Mammals", taxonId: 40151 },
  { name: "Birds", taxonId: 3 },
  { name: "Reptiles", taxonId: 26036 },
  { name: "Amphibians", taxonId: 20978 },
];
const HOME_KEY = "lha-home-location";

export type HomeLocation = { lat: number; lng: number };

export const loadHome = (): HomeLocation | null => {
  try {
    const raw = localStorage.getItem(HOME_KEY);
    return raw ? (JSON.parse(raw) as HomeLocation) : null;
  } catch {
    return null;
  }
};

export const saveHome = (home: HomeLocation) => {
  try {
    localStorage.setItem(HOME_KEY, JSON.stringify(home));
  } catch {
    // Not saved; the user can set it again next visit
  }
};

// Ask the browser for the user's location (rounded to ~11 km)
export const getCurrentLocation = () =>
  new Promise<HomeLocation>((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Your browser can't share your location."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          lat: roundCoord(pos.coords.latitude),
          lng: roundCoord(pos.coords.longitude),
        }),
      () =>
        reject(
          new Error(
            "We couldn't get your location. Check your browser permissions.",
          ),
        ),
    );
  });

type InatTaxon = {
  id: number;
  name: string;
  preferred_common_name?: string;
  wikipedia_url?: string | null;
  wikipedia_summary?: string | null;
  default_photo?: {
    medium_url?: string;
    square_url?: string;
    attribution: string;
    license_code: string | null;
  } | null;
};

const stripHtml = (html = "") =>
  html
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

const toSpecies = (
  taxon: InatTaxon,
  rank: number,
  collectionId = NEAR_YOU_ID,
): Species => {
  const name = taxon.preferred_common_name ?? taxon.name;
  const photo = taxon.default_photo;
  return {
    id: `inat-${taxon.id}`,
    inatId: taxon.id,
    collectionId,
    rank,
    name: name.charAt(0).toUpperCase() + name.slice(1),
    scientificName: taxon.name,
    description: null, // loaded when the species is opened (fetchSummary)
    descriptionSource: null,
    photo:
      photo && photo.license_code
        ? {
            url: photo.medium_url ?? photo.square_url ?? "",
            attribution: photo.attribution,
            license: photo.license_code.toUpperCase(),
          }
        : null,
    inatUrl: `https://www.inaturalist.org/taxa/${taxon.id}`,
    iucnUrl: `https://www.iucnredlist.org/search?query=${encodeURIComponent(
      taxon.name,
    )}&searchType=species`,
  };
};

const nearbyCache = new Map<string, Species[]>();

// The 50 most-observed vertebrates around a location
export const useNearbySpecies = (home: HomeLocation | null) => {
  const [species, setSpecies] = useState<Species[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!home) {
      setSpecies([]);
      return;
    }
    const key = `${home.lat},${home.lng}`;
    const cached = nearbyCache.get(key);
    if (cached) {
      setSpecies(cached);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    const fetchGroup = (taxonId: number) => {
      const params = new URLSearchParams({
        lat: String(home.lat),
        lng: String(home.lng),
        radius: String(RADIUS_KM),
        taxon_id: String(taxonId),
        quality_grade: "research",
        rank: "species",
        per_page: String(PER_GROUP),
        locale: "en",
      });
      return fetch(`${API}/observations/species_counts?${params}`).then(
        (res) => {
          if (!res.ok) throw new Error(String(res.status));
          return res.json() as Promise<{ results: { taxon: InatTaxon }[] }>;
        },
      );
    };

    Promise.all(NEARBY_GROUPS.map((g) => fetchGroup(g.taxonId)))
      .then((groups) => {
        if (cancelled) return;
        // Mammals first, then birds, reptiles, amphibians and fish; rank within each group
        const list = groups.flatMap((data) =>
          data.results.map((r, i) => toSpecies(r.taxon, i + 1)),
        );
        nearbyCache.set(key, list);
        setSpecies(list);
      })
      .catch(() => {
        if (!cancelled)
          setError(
            "We couldn't load the animals near you. Please try again later.",
          );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [home]);

  return { species, loading, error };
};

// Search all vertebrate species on iNaturalist (for animals that aren't in any list)
export const searchSpecies = async (q: string): Promise<Species[]> => {
  const params = new URLSearchParams({
    q,
    rank: "species",
    taxon_id: String(VERTEBRATES),
    is_active: "true",
    per_page: "8",
    locale: "en",
  });
  const res = await fetch(`${API}/taxa?${params}`);
  if (!res.ok) throw new Error(String(res.status));
  const data: { results: InatTaxon[] } = await res.json();
  return data.results.map((t) => toSpecies(t, 0, "other"));
};

const summaryCache = new Map<
  number,
  Pick<Species, "description" | "descriptionSource">
>();

// Wikipedia summary for one species (via iNaturalist), credited
export const fetchSummary = async (inatId: number) => {
  const cached = summaryCache.get(inatId);
  if (cached) return cached;

  const res = await fetch(`${API}/taxa/${inatId}?locale=en`);
  if (!res.ok) throw new Error(String(res.status));
  const data: { results: InatTaxon[] } = await res.json();
  const taxon = data.results[0];
  const summary = stripHtml(taxon?.wikipedia_summary ?? "");

  const result = {
    description: summary || null,
    descriptionSource:
      summary && taxon?.wikipedia_url
        ? {
            name: "Wikipedia",
            url: taxon.wikipedia_url,
            license: "CC BY-SA 4.0",
          }
        : null,
  };
  summaryCache.set(inatId, result);
  return result;
};

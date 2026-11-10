// Place search and place names, using OpenStreetMap's free Nominatim service.
// Their usage policy: max 1 request per second, light use only, and credit
// "© OpenStreetMap contributors" (shown in the wildlife credits footer).

import { roundCoord } from "./useSightings";

const NOMINATIM = "https://nominatim.openstreetmap.org";

export type Spot = { lat: number; lng: number; place: string };

type NominatimResult = {
  lat: string;
  lon: string;
  name?: string;
  display_name: string;
  address?: Record<string, string>;
};

// Short, readable label, e.g. "Kampina, Oisterwijk, Netherlands"
const label = (r: NominatimResult) => {
  const a = r.address ?? {};
  const local =
    r.name ||
    a.nature_reserve ||
    a.park ||
    a.natural ||
    a.suburb ||
    a.village ||
    a.town ||
    a.city ||
    "";
  const area =
    a.town ||
    a.city ||
    a.village ||
    a.municipality ||
    a.county ||
    a.state ||
    "";
  const parts = [local, area, a.country].filter(Boolean);
  const unique = parts.filter((p, i) => parts.indexOf(p) === i);
  return unique.length
    ? unique.join(", ")
    : r.display_name.split(", ").slice(0, 3).join(", ");
};

// Keep requests at least 1.1 s apart (Nominatim's limit)
let lastRequest = 0;
const politeFetch = async (url: string) => {
  const wait = lastRequest + 1100 - Date.now();
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastRequest = Date.now();
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(String(res.status));
  return res.json();
};

// Coordinates -> place name
export const placeNameFor = async (
  lat: number,
  lng: number,
): Promise<string> => {
  try {
    const params = new URLSearchParams({
      format: "jsonv2",
      lat: String(lat),
      lon: String(lng),
      zoom: "14",
      "accept-language": "en",
    });
    const r: NominatimResult & { error?: string } = await politeFetch(
      `${NOMINATIM}/reverse?${params}`,
    );
    return r.error ? "" : label(r);
  } catch {
    return "";
  }
};

// Place name -> list of matching places
export const searchPlaces = async (q: string): Promise<Spot[]> => {
  const params = new URLSearchParams({
    format: "jsonv2",
    q,
    limit: "5",
    addressdetails: "1",
    "accept-language": "en",
  });
  const results: NominatimResult[] = await politeFetch(
    `${NOMINATIM}/search?${params}`,
  );
  return results.map((r) => ({
    lat: roundCoord(Number(r.lat)),
    lng: roundCoord(Number(r.lon)),
    place: label(r),
  }));
};

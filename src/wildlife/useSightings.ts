import { useCallback, useEffect, useState, type RefObject } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  deleteField,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import exifr from "exifr";
import { db } from "./firebase";

// Sightings are saved in Firestore under users/{uid}/sightings.
// The photo is stored inside the sighting as a small JPEG (data URL),
// which keeps everything on Firebase's free plan.

export type Sighting = {
  id: string;
  speciesId: string | null; // "inat-<id>", or null for an animal typed by name
  speciesName: string;
  scientificName?: string;
  photo: string;
  lat: number;
  lng: number;
  place?: string;
  date: string; // "YYYY-MM-DD"
  createdAt: number;
};

export type NewSighting = Omit<Sighting, "id" | "createdAt">;
export type SightingPatch = Omit<NewSighting, "photo">;

// Firestore doesn't accept undefined values
const withoutUndefined = <T extends object>(obj: T) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined));

export const useSightings = (uid: string | null | undefined) => {
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [loading, setLoading] = useState(Boolean(uid));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uid) {
      setSightings([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const q = query(
      collection(db, "users", uid, "sightings"),
      orderBy("createdAt", "asc"),
    );
    return onSnapshot(
      q,
      (snap) => {
        setSightings(
          snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as Omit<Sighting, "id">),
          })),
        );
        setLoading(false);
      },
      () => {
        setError("We couldn't load your sightings. Please refresh the page.");
        setLoading(false);
      },
    );
  }, [uid]);

  const add = useCallback(
    async (s: NewSighting) => {
      if (!uid) throw new Error("Please sign in first.");
      await addDoc(
        collection(db, "users", uid, "sightings"),
        withoutUndefined({ ...s, createdAt: Date.now() }),
      );
    },
    [uid],
  );

  // Edit the animal, place or date of a sighting (the photo itself can't change)
  const update = useCallback(
    async (id: string, patch: SightingPatch) => {
      if (!uid) throw new Error("Please sign in first.");
      await updateDoc(doc(db, "users", uid, "sightings", id), {
        speciesId: patch.speciesId,
        speciesName: patch.speciesName,
        scientificName: patch.scientificName ?? deleteField(),
        lat: patch.lat,
        lng: patch.lng,
        place: patch.place || deleteField(),
        date: patch.date,
      });
    },
    [uid],
  );

  const remove = useCallback(
    async (id: string) => {
      if (!uid) return;
      await deleteDoc(doc(db, "users", uid, "sightings", id));
    },
    [uid],
  );

  return { sightings, loading, error, add, update, remove };
};

// Round to ~100 m: precise enough for the map, without storing exact spots
export const roundCoord = (n: number) => Math.round(n * 1000) / 1000;

const toISODate = (d: Date) => d.toISOString().slice(0, 10);
export const today = () => toISODate(new Date());

// Firestore documents can be at most 1 MB, so keep photos well below that
const MAX_PHOTO_CHARS = 700_000;

// Resize the photo (this also strips its metadata, including GPS)
const resizeImage = async (file: File) => {
  const bitmap = await createImageBitmap(file);
  for (const [max, quality] of [
    [1000, 0.8],
    [800, 0.7],
    [600, 0.6],
  ]) {
    const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas
      .getContext("2d")
      ?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", quality);
    if (dataUrl.length <= MAX_PHOTO_CHARS) return dataUrl;
  }
  throw new Error("Photo too large");
};

// Read a photo: resized image + location and date from its metadata, if present
export const readPhoto = async (file: File) => {
  const [gps, meta] = await Promise.all([
    exifr.gps(file).catch(() => undefined),
    exifr.parse(file, ["DateTimeOriginal"]).catch(() => undefined),
  ]);
  const photo = await resizeImage(file);

  const location =
    gps && Number.isFinite(gps.latitude) && Number.isFinite(gps.longitude)
      ? { lat: roundCoord(gps.latitude), lng: roundCoord(gps.longitude) }
      : null;

  const taken = meta?.DateTimeOriginal;
  const date =
    taken instanceof Date && !isNaN(taken.getTime()) ? toISODate(taken) : null;

  return { photo, location, date };
};

// Width of an element, kept up to date (for sizing the globe)
export const useElementWidth = (ref: RefObject<HTMLElement | null>) => {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) =>
      setWidth(Math.floor(entry.contentRect.width)),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
  return width;
};

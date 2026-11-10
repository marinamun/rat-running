import { useCallback, useMemo, useState } from "react";
import {
  COLLECTIONS,
  NEAR_YOU_ID,
  WORLD_SPECIES,
  collectionById,
  mergeSpecies,
  worldSpeciesIn,
  type Species,
} from "./data";
import { useAuthUser } from "./firebase";
import {
  getCurrentLocation,
  loadHome,
  saveHome,
  useNearbySpecies,
  type HomeLocation,
} from "./nearby";
import { useSightings, type Sighting } from "./useSightings";
import { useTrackedCollection } from "./useTrackedCollection";

// Everything the wildlife pages need, in one place
export const useWildlife = () => {
  const { user, ready } = useAuthUser();
  const { sightings, loading, error, add, update, remove } = useSightings(
    user?.uid,
  );
  const { tracked, trackedLoading, track } = useTrackedCollection(user?.uid);

  const [home, setHome] = useState<HomeLocation | null>(loadHome);
  const [homeError, setHomeError] = useState<string | null>(null);
  const nearby = useNearbySpecies(home);

  const setHomeFromBrowser = useCallback(async () => {
    setHomeError(null);
    try {
      const location = await getCurrentLocation();
      saveHome(location);
      setHome(location);
    } catch (e) {
      setHomeError(
        e instanceof Error ? e.message : "We couldn't get your location.",
      );
    }
  }, []);

  // All species the user can pick from or that can appear on the map
  const allSpecies = useMemo(
    () => mergeSpecies(WORLD_SPECIES, nearby.species),
    [nearby.species],
  );
  const speciesById = useMemo(
    () => new Map(allSpecies.map((s) => [s.id, s])),
    [allSpecies],
  );

  const spotted = useMemo(
    () =>
      new Set(sightings.map((s) => s.speciesId).filter(Boolean) as string[]),
    [sightings],
  );

  const speciesInCollection = useCallback(
    (collectionId: string): Species[] =>
      collectionId === NEAR_YOU_ID
        ? nearby.species
        : worldSpeciesIn(collectionId),
    [nearby.species],
  );

  const sightingsOf = useCallback(
    (speciesId: string) => sightings.filter((s) => s.speciesId === speciesId),
    [sightings],
  );

  // Color of a sighting's dot: the color of the first collection its species belongs to
  const colorOf = useCallback(
    (s: Sighting) => {
      const species = s.speciesId ? speciesById.get(s.speciesId) : undefined;
      return (
        (species && collectionById.get(species.collectionId)?.color) ??
        "#FFFFFF"
      );
    },
    [speciesById],
  );

  // Number of different animals photographed (list species + animals added by name)
  const uniqueAnimals = useMemo(
    () =>
      new Set(
        sightings.map(
          (s) => s.speciesId ?? `name:${s.speciesName.toLowerCase()}`,
        ),
      ).size,
    [sightings],
  );

  return {
    user,
    authReady: ready,
    tracked,
    trackedLoading,
    track,
    uniqueAnimals,
    sightings,
    sightingsLoading: loading,
    sightingsError: error,
    addSighting: add,
    updateSighting: update,
    removeSighting: remove,
    home,
    homeError,
    setHomeFromBrowser,
    nearby,
    allSpecies,
    speciesById,
    spotted,
    speciesInCollection,
    sightingsOf,
    colorOf,
    collections: COLLECTIONS,
  };
};

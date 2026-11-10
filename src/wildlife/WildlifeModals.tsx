import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Globe from "react-globe.gl";
import {
  BTN_PRIMARY,
  BTN_WHITE,
  THEME,
  collectionById,
  type Species,
} from "./data";
import { placeNameFor, searchPlaces, type Spot } from "./geo";
import GlobeGuard, { GlobeUnavailable } from "./GlobeGuard";
import { fetchSummary, searchSpecies } from "./nearby";
import {
  readPhoto,
  roundCoord,
  today,
  useElementWidth,
  type NewSighting,
  type Sighting,
  type SightingPatch,
} from "./useSightings";

export const GLOBE_IMAGE =
  "https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

/* ---------- Shared form styles ---------- */

export const LABEL = "block text-sm font-semibold text-[#2B2420]";
export const INPUT =
  "mt-1.5 w-full rounded-xl border-[1.5px] border-[#2B2420] bg-white px-3 py-2.5 text-sm text-[#2B2420] outline-none focus-visible:ring-2 focus-visible:ring-[#2B2420]";
const LINK_BTN =
  "text-sm font-medium text-[#2B2420] underline underline-offset-2";

/* ---------- Modal shell ---------- */

export const Modal = ({
  title,
  onClose,
  children,
  wide = false,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className={`max-h-[92vh] w-full ${wide ? "max-w-3xl" : "max-w-lg"} overflow-y-auto rounded-t-2xl border-[1.5px] border-[#2B2420] bg-white p-6 sm:rounded-2xl`}
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-xl font-semibold" style={{ color: THEME.ink }}>
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border-[1.5px] border-[#2B2420] text-[#2B2420] transition-colors hover:bg-[#2B2420] hover:text-white"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

/* ---------- Species picker (search the lists + all of iNaturalist) ---------- */

export type SpeciesChoice = {
  species: Species | null;
  typedName: string | null;
};

export const SpeciesPicker = ({
  options,
  value,
  onChange,
  compact = false,
}: {
  options: Species[];
  value: SpeciesChoice;
  onChange: (next: SpeciesChoice) => void;
  compact?: boolean;
}) => {
  const [search, setSearch] = useState("");
  const [moreResults, setMoreResults] = useState<Species[]>([]);
  const [searchingMore, setSearchingMore] = useState(false);

  const matches = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    return options
      .filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.scientificName.toLowerCase().includes(q),
      )
      .slice(0, compact ? 5 : 8);
  }, [search, options, compact]);

  // Also search all species on iNaturalist, so any animal can be added
  useEffect(() => {
    const q = search.trim();
    if (q.length < 3) {
      setMoreResults([]);
      return;
    }
    let cancelled = false;
    const timer = setTimeout(() => {
      setSearchingMore(true);
      searchSpecies(q)
        .then((results) => {
          if (cancelled) return;
          const shown = new Set(matches.map((m) => m.id));
          setMoreResults(
            results.filter((r) => !shown.has(r.id)).slice(0, compact ? 5 : 8),
          );
        })
        .catch(() => !cancelled && setMoreResults([]))
        .finally(() => !cancelled && setSearchingMore(false));
    }, 400);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [search, matches, compact]);

  const pick = (s: Species) => {
    onChange({ species: s, typedName: null });
    setSearch("");
  };

  const resultList = (list: Species[]) => (
    <ul className="mt-1.5 overflow-hidden rounded-xl border-[1.5px] border-[#2B2420] bg-white">
      {list.map((s) => (
        <li key={s.id} className="border-b border-[#e2dccf] last:border-b-0">
          <button
            type="button"
            onClick={() => pick(s)}
            className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left hover:bg-[#FBF8F1]"
          >
            <span className="text-sm font-medium text-[#2B2420]">{s.name}</span>
            <span className="text-xs italic text-[#8a8278]">
              {s.scientificName}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );

  if (value.species) {
    return (
      <div className="mt-1.5 flex items-center justify-between gap-3 rounded-xl border-[1.5px] border-[#2B2420] bg-white px-3 py-2.5">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[#2B2420]">
            {value.species.name}
          </p>
          <p className="truncate text-xs italic text-[#8a8278]">
            {value.species.scientificName}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onChange({ species: null, typedName: null })}
          className={`${LINK_BTN} shrink-0`}
        >
          Change
        </button>
      </div>
    );
  }

  if (value.typedName !== null) {
    return (
      <>
        <input
          type="text"
          value={value.typedName}
          onChange={(e) =>
            onChange({ species: null, typedName: e.target.value })
          }
          placeholder="Name of the animal, e.g. Grey heron"
          aria-label="Animal name"
          className={INPUT}
        />
        <button
          type="button"
          onClick={() => onChange({ species: null, typedName: null })}
          className={`${LINK_BTN} mt-2`}
        >
          Search the lists instead
        </button>
      </>
    );
  }

  return (
    <>
      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search, e.g. roe deer or Capreolus"
        aria-label="Search animals"
        className={INPUT}
      />
      {matches.length > 0 && resultList(matches)}
      {moreResults.length > 0 && (
        <>
          <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-[#8a8278]">
            More species from iNaturalist
          </p>
          {resultList(moreResults)}
        </>
      )}
      {searchingMore && (
        <p className="mt-2 text-sm text-[#8a8278]">Searching all species…</p>
      )}
      {search.trim().length >= 3 &&
        !searchingMore &&
        matches.length === 0 &&
        moreResults.length === 0 && (
          <p className="mt-2 text-sm text-[#8a8278]">No animals found.</p>
        )}
      <button
        type="button"
        onClick={() => onChange({ species: null, typedName: search })}
        className={`${LINK_BTN} mt-2`}
      >
        Not in the lists? Add it by name
      </button>
    </>
  );
};

/* ---------- Place field (search a place, current location or click the globe) ---------- */

export const PlaceField = ({
  value,
  onChange,
  withGlobe = false,
  note,
}: {
  value: Spot | null;
  onChange: (next: Spot) => void;
  withGlobe?: boolean;
  note?: string; // e.g. "Location found in your photo"
}) => {
  const [editing, setEditing] = useState(!value);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Spot[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [naming, setNaming] = useState(false);

  // Leave edit mode when a location arrives from outside (e.g. read from the photo)
  useEffect(() => {
    if (value) setEditing(false);
  }, [value?.lat, value?.lng]); // eslint-disable-line react-hooks/exhaustive-deps

  // Search places as the user types
  useEffect(() => {
    const q = query.trim();
    if (q.length < 3) {
      setResults([]);
      return;
    }
    let cancelled = false;
    const timer = setTimeout(() => {
      setSearching(true);
      searchPlaces(q)
        .then((r) => !cancelled && setResults(r))
        .catch(
          () =>
            !cancelled && setError("Place search isn't available right now."),
        )
        .finally(() => !cancelled && setSearching(false));
    }, 700);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  // Pick coordinates, then look up a place name for them
  const choosePoint = async (lat: number, lng: number) => {
    const spot = { lat: roundCoord(lat), lng: roundCoord(lng), place: "" };
    onChange(spot);
    setEditing(false);
    setNaming(true);
    const place = await placeNameFor(spot.lat, spot.lng);
    setNaming(false);
    if (place) onChange({ ...spot, place });
  };

  const useMyLocation = () => {
    setError(null);
    if (!navigator.geolocation) {
      setError("Your browser can't share your location.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => choosePoint(pos.coords.latitude, pos.coords.longitude),
      () =>
        setError(
          "We couldn't get your location. Search for the place instead.",
        ),
    );
  };

  const globeBox = useRef<HTMLDivElement>(null);
  const globeWidth = useElementWidth(globeBox);

  return (
    <div>
      {value && !editing ? (
        <div className="mt-1.5 rounded-xl border-[1.5px] border-[#2B2420] bg-white px-3 py-2.5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <input
                type="text"
                value={value.place}
                onChange={(e) => onChange({ ...value, place: e.target.value })}
                placeholder={naming ? "Finding place name…" : "Name this place"}
                aria-label="Place name"
                className="w-full bg-transparent text-sm font-semibold text-[#2B2420] outline-none"
              />
              <p className="mt-0.5 text-xs text-[#8a8278]">
                📍 {value.lat}, {value.lng}
                {note && <> · {note}</>}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setEditing(true)}
              className={`${LINK_BTN} shrink-0`}
            >
              Change
            </button>
          </div>
        </div>
      ) : (
        <>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a place, e.g. Boulders Beach"
            aria-label="Search a place"
            className={INPUT}
          />
          {results.length > 0 && (
            <ul className="mt-1.5 overflow-hidden rounded-xl border-[1.5px] border-[#2B2420] bg-white">
              {results.map((r) => (
                <li
                  key={`${r.lat},${r.lng},${r.place}`}
                  className="border-b border-[#e2dccf] last:border-b-0"
                >
                  <button
                    type="button"
                    onClick={() => {
                      onChange(r);
                      setQuery("");
                      setResults([]);
                      setEditing(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-[#2B2420] hover:bg-[#FBF8F1]"
                  >
                    {r.place}
                  </button>
                </li>
              ))}
            </ul>
          )}
          {searching && (
            <p className="mt-2 text-sm text-[#8a8278]">Searching places…</p>
          )}

          {withGlobe && (
            <div
              ref={globeBox}
              className="mt-2 overflow-hidden rounded-xl border-[1.5px] border-[#2B2420]"
              style={{ backgroundColor: THEME.space }}
            >
              {globeWidth > 0 && (
                <GlobeGuard fallback={<GlobeUnavailable compact />}>
                  <Globe
                    width={globeWidth}
                    height={240}
                    globeImageUrl={GLOBE_IMAGE}
                    backgroundColor="rgba(0,0,0,0)"
                    atmosphereColor="#9ecbff"
                    pointsData={value ? [value] : []}
                    pointLat="lat"
                    pointLng="lng"
                    pointColor={() => "#FFD23F"}
                    pointAltitude={0.03}
                    pointRadius={1.2}
                    onGlobeClick={({ lat, lng }) => choosePoint(lat, lng)}
                  />
                </GlobeGuard>
              )}
            </div>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
            <button type="button" onClick={useMyLocation} className={LINK_BTN}>
              Use my current location
            </button>
            {withGlobe && (
              <span className="text-xs text-[#8a8278]">
                or click on the globe
              </span>
            )}
            {value && (
              <button
                type="button"
                onClick={() => setEditing(false)}
                className={LINK_BTN}
              >
                Cancel
              </button>
            )}
          </div>
        </>
      )}
      {error && <p className="mt-2 text-xs text-red-700">{error}</p>}
    </div>
  );
};

/* ---------- Species / sighting details (with editing) ---------- */

type SpeciesModalProps = {
  species: Species | null; // null for animals typed by name
  fallbackName?: string;
  sightings: Sighting[]; // this user's sightings of this species
  startId?: string;
  options: Species[]; // for changing the animal when editing
  onAdd?: () => void;
  onUpdate: (id: string, patch: SightingPatch) => Promise<void>;
  onDelete: (id: string) => void;
  onClose: () => void;
};

export const SpeciesModal = ({
  species,
  fallbackName,
  sightings,
  startId,
  options,
  onAdd,
  onUpdate,
  onDelete,
  onClose,
}: SpeciesModalProps) => {
  const [currentId, setCurrentId] = useState(startId ?? sightings[0]?.id);
  const current = sightings.find((s) => s.id === currentId) ?? sightings[0];
  const collection = species
    ? collectionById.get(species.collectionId)
    : undefined;
  const name = species?.name ?? fallbackName ?? "Unknown animal";

  // Load the description if this species doesn't have one yet (e.g. "Near you" species)
  const [info, setInfo] = useState({
    description: species?.description ?? null,
    descriptionSource: species?.descriptionSource ?? null,
  });
  const [loadingInfo, setLoadingInfo] = useState(false);

  useEffect(() => {
    if (!species || species.description) return;
    let cancelled = false;
    setLoadingInfo(true);
    fetchSummary(species.inatId)
      .then((result) => !cancelled && setInfo(result))
      .catch(() => undefined)
      .finally(() => !cancelled && setLoadingInfo(false));
    return () => {
      cancelled = true;
    };
  }, [species]);

  // Editing the current photo's animal, place and date
  const [editing, setEditing] = useState(false);
  const [choice, setChoice] = useState<SpeciesChoice>({
    species: null,
    typedName: null,
  });
  const [spot, setSpot] = useState<Spot | null>(null);
  const [date, setDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const startEditing = () => {
    if (!current) return;
    const currentSpecies = current.speciesId
      ? (options.find((s) => s.id === current.speciesId) ??
        (species?.id === current.speciesId ? species : null))
      : null;
    setChoice(
      currentSpecies
        ? { species: currentSpecies, typedName: null }
        : { species: null, typedName: current.speciesName },
    );
    setSpot({ lat: current.lat, lng: current.lng, place: current.place ?? "" });
    setDate(current.date);
    setEditError(null);
    setEditing(true);
  };

  const saveEdit = async () => {
    if (!current) return;
    if (!choice.species && !choice.typedName?.trim())
      return setEditError("Choose the animal.");
    if (!spot) return setEditError("Set the place.");
    setSaving(true);
    try {
      await onUpdate(current.id, {
        speciesId: choice.species?.id ?? null,
        speciesName: choice.species?.name ?? choice.typedName!.trim(),
        scientificName: choice.species?.scientificName,
        lat: spot.lat,
        lng: spot.lng,
        place: spot.place.trim() || undefined,
        date,
      });
      onClose();
    } catch {
      setEditError("We couldn't save your changes. Please try again.");
      setSaving(false);
    }
  };

  return (
    <Modal title={editing ? "Edit sighting" : name} onClose={onClose}>
      {!editing && (
        <div className="mt-1 flex flex-wrap items-center gap-2">
          {species && (
            <span className="text-sm italic text-[#8a8278]">
              {species.scientificName}
            </span>
          )}
          {collection && (
            <span
              className="rounded-full border border-[#2B2420] px-2.5 py-0.5 text-xs font-semibold text-[#2B2420]"
              style={{ backgroundColor: collection.color }}
            >
              {collection.name} · #{species?.rank}
            </span>
          )}
        </div>
      )}

      {current ? (
        <>
          <img
            src={current.photo}
            alt={`Your photo of a ${name}`}
            className="mt-5 aspect-[4/3] w-full rounded-xl border-[1.5px] border-[#2B2420] object-cover"
          />
          {!editing && (
            <p className="mt-2 text-sm text-[#8a8278]">
              Your photo · {formatDate(current.date)}
              {current.place && <> · {current.place}</>}
            </p>
          )}

          {!editing && sightings.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {sightings.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setCurrentId(s.id)}
                  aria-label={`Show photo from ${formatDate(s.date)}`}
                  className={`h-14 w-14 shrink-0 overflow-hidden rounded-lg border-[1.5px] ${
                    s.id === current.id
                      ? "border-[#2B2420]"
                      : "border-transparent opacity-60"
                  }`}
                >
                  <img
                    src={s.photo}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </>
      ) : species?.photo ? (
        <>
          <div className="relative mt-5">
            <img
              src={species.photo.url}
              alt={`Reference photo of a ${name}`}
              className="aspect-[4/3] w-full rounded-xl border-[1.5px] border-[#2B2420] object-cover grayscale"
            />
            <span className="absolute left-3 top-3 rounded-full border border-[#2B2420] bg-white px-2.5 py-0.5 text-xs font-semibold text-[#2B2420]">
              Not spotted yet
            </span>
          </div>
          <p className="mt-2 text-xs text-[#8a8278]">
            Reference photo: {species.photo.attribution}, via iNaturalist
          </p>
        </>
      ) : (
        <div className="mt-5 grid aspect-[4/3] place-items-center rounded-xl border-[1.5px] border-dashed border-[#c4bdb1] bg-[#FBF8F1] text-center">
          <p className="text-sm font-medium text-[#8a8278]">Not spotted yet</p>
        </div>
      )}

      {editing ? (
        /* ----- Edit form ----- */
        <div className="mt-5 space-y-5">
          <div>
            <span className={LABEL}>Animal</span>
            <SpeciesPicker
              options={options}
              value={choice}
              onChange={setChoice}
            />
          </div>
          <div>
            <span className={LABEL}>Place</span>
            <PlaceField value={spot} onChange={setSpot} withGlobe />
          </div>
          <div>
            <label htmlFor="edit-date" className={LABEL}>
              Date
            </label>
            <input
              id="edit-date"
              type="date"
              value={date}
              max={today()}
              onChange={(e) => setDate(e.target.value)}
              className={INPUT}
            />
          </div>
          {editError && (
            <p role="alert" className="text-sm text-red-700">
              {editError}
            </p>
          )}
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={saveEdit}
              disabled={saving}
              className={BTN_PRIMARY}
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className={BTN_WHITE}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          {species && (
            <div className="mt-5">
              {loadingInfo ? (
                <p className="text-sm text-[#8a8278]">Loading description…</p>
              ) : info.description ? (
                <>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: THEME.muted }}
                  >
                    {info.description}
                  </p>
                  {info.descriptionSource && (
                    <p className="mt-2 text-xs text-[#8a8278]">
                      Source:{" "}
                      <a
                        href={info.descriptionSource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline underline-offset-2"
                      >
                        {info.descriptionSource.name}
                      </a>{" "}
                      ({info.descriptionSource.license})
                    </p>
                  )}
                </>
              ) : (
                <p className="text-sm text-[#8a8278]">
                  No description available yet.
                </p>
              )}

              <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm font-medium text-[#2B2420]">
                <a
                  href={species.iucnUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2"
                >
                  Conservation status (IUCN) ↗
                </a>
                <a
                  href={species.inatUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2"
                >
                  More on iNaturalist ↗
                </a>
              </p>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            {current && (
              <button
                type="button"
                onClick={startEditing}
                className={BTN_PRIMARY}
              >
                Edit
              </button>
            )}
            {onAdd && (
              <button
                type="button"
                onClick={onAdd}
                className={current ? BTN_WHITE : BTN_PRIMARY}
              >
                {current ? "Add another photo" : "Add a sighting"}
              </button>
            )}
            {current && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("Delete this photo?")) {
                    onDelete(current.id);
                    if (sightings.length <= 1) onClose();
                  }
                }}
                className={BTN_WHITE}
              >
                Delete
              </button>
            )}
          </div>
        </>
      )}
    </Modal>
  );
};

/* ---------- Add one sighting ---------- */

type AddSightingModalProps = {
  options: Species[];
  defaultSpecies?: Species;
  onSave: (s: NewSighting) => Promise<void>;
  onClose: () => void;
};

export const AddSightingModal = ({
  options,
  defaultSpecies,
  onSave,
  onClose,
}: AddSightingModalProps) => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [reading, setReading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [spot, setSpot] = useState<Spot | null>(null);
  const [fromPhoto, setFromPhoto] = useState(false);
  const [choice, setChoice] = useState<SpeciesChoice>({
    species: defaultSpecies ?? null,
    typedName: null,
  });
  const [date, setDate] = useState(today());
  const [error, setError] = useState<string | null>(null);

  const onFile = async (file?: File) => {
    if (!file) return;
    setError(null);
    setReading(true);
    try {
      const result = await readPhoto(file);
      setPhoto(result.photo);
      if (result.date) setDate(result.date);
      if (result.location) {
        const found = { ...result.location, place: "" };
        setSpot(found);
        setFromPhoto(true);
        const place = await placeNameFor(found.lat, found.lng);
        // Only fill in the name if the user hasn't changed the location meanwhile
        if (place)
          setSpot((s) =>
            s && s.lat === found.lat && s.lng === found.lng && !s.place
              ? { ...s, place }
              : s,
          );
      }
    } catch {
      setError("We couldn't read that photo. Please try a JPG or PNG image.");
    } finally {
      setReading(false);
    }
  };

  const submit = async () => {
    if (!photo) return setError("Add a photo first.");
    if (!choice.species && !choice.typedName?.trim())
      return setError("Choose which animal you photographed.");
    if (!spot) return setError("Set where you took the photo.");
    if (!date) return setError("Add the date of your sighting.");

    setSaving(true);
    setError(null);
    try {
      await onSave({
        speciesId: choice.species?.id ?? null,
        speciesName: choice.species?.name ?? choice.typedName!.trim(),
        scientificName: choice.species?.scientificName,
        photo,
        lat: spot.lat,
        lng: spot.lng,
        place: spot.place.trim() || undefined,
        date,
      });
      onClose();
    } catch {
      setError(
        "We couldn't save your sighting. Please check your connection and try again.",
      );
      setSaving(false);
    }
  };

  return (
    <Modal title="Add a sighting" onClose={onClose}>
      <div className="mt-5 space-y-5">
        {/* Photo */}
        <div>
          <span className={LABEL}>Photo</span>
          <label className="mt-1.5 block cursor-pointer">
            {photo ? (
              <img
                src={photo}
                alt="Your selected photo"
                className="aspect-[4/3] w-full rounded-xl border-[1.5px] border-[#2B2420] object-cover"
              />
            ) : (
              <div className="grid aspect-[4/3] place-items-center rounded-xl border-[1.5px] border-dashed border-[#2B2420] bg-[#FBF8F1] text-center">
                <p className="text-sm font-medium text-[#6b6359]">
                  {reading ? "Reading photo…" : "Click to choose a photo"}
                </p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => onFile(e.target.files?.[0])}
            />
          </label>
          {photo && (
            <p className="mt-1.5 text-xs text-[#8a8278]">
              Click the photo to change it.
            </p>
          )}
        </div>

        {/* Species */}
        <div>
          <span className={LABEL}>Animal</span>
          <SpeciesPicker
            options={options}
            value={choice}
            onChange={setChoice}
          />
        </div>

        {/* Place */}
        <div>
          <span className={LABEL}>Where did you see it?</span>
          <PlaceField
            value={spot}
            onChange={(next) => {
              setSpot(next);
              if (!spot || next.lat !== spot.lat || next.lng !== spot.lng)
                setFromPhoto(false);
            }}
            withGlobe
            note={fromPhoto ? "from your photo" : undefined}
          />
        </div>

        {/* Date */}
        <div>
          <label htmlFor="date" className={LABEL}>
            Date
          </label>
          <input
            id="date"
            type="date"
            value={date}
            max={today()}
            onChange={(e) => setDate(e.target.value)}
            className={INPUT}
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="flex flex-wrap gap-3 pt-1">
          <button
            type="button"
            onClick={submit}
            disabled={reading || saving}
            className={BTN_PRIMARY}
          >
            {saving ? "Saving…" : "Save sighting"}
          </button>
          <button type="button" onClick={onClose} className={BTN_WHITE}>
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

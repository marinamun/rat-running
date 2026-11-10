import { useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { BTN_PRIMARY, BTN_WHITE, THEME, type Species } from "../wildlife/data";
import { signInWithGoogle } from "../wildlife/firebase";
import type { Sighting } from "../wildlife/useSightings";
import { useWildlife } from "../wildlife/useWildlife";
import { AddSightingModal, SpeciesModal } from "../wildlife/WildlifeModals";
import WildlifeCredits from "../wildlife/WildlifeCredits";
import BatchUploadModal from "../wildlife/BatchUploadModal";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const PageShell = ({ children }: { children: ReactNode }) => (
  <div
    className="min-h-screen"
    style={{ backgroundColor: THEME.sand, fontFamily: "'Poppins', sans-serif" }}
  >
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');`}</style>
    <div className="mx-auto max-w-5xl px-6 py-10">
      <Link
        to="/wildlife"
        className="text-sm font-medium text-[#6b6359] underline-offset-4 hover:underline"
      >
        ← Back to my map
      </Link>
      {children}
      <WildlifeCredits />
    </div>
  </div>
);

// All of the user's photos, newest first
const WildlifePhotos = () => {
  const w = useWildlife();
  const [open, setOpen] = useState<Sighting | null>(null);
  const [adding, setAdding] = useState<{ species?: Species } | null>(null);
  const [batch, setBatch] = useState(false);

  const photos = useMemo(
    () =>
      [...w.sightings].sort(
        (a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt,
      ),
    [w.sightings],
  );

  if (!w.authReady) {
    return (
      <PageShell>
        <p className="mt-10 text-sm text-[#8a8278]">Loading…</p>
      </PageShell>
    );
  }

  if (!w.user) {
    return (
      <PageShell>
        <p className="mt-10 text-base" style={{ color: THEME.ink }}>
          Sign in to see your photos.
        </p>
        <button
          type="button"
          onClick={() => signInWithGoogle().catch(() => undefined)}
          className={`${BTN_PRIMARY} mt-4`}
        >
          Sign in with Google
        </button>
      </PageShell>
    );
  }

  const openSpecies = open?.speciesId
    ? (w.speciesById.get(open.speciesId) ?? null)
    : null;
  const openSightings = open
    ? open.speciesId
      ? w.sightingsOf(open.speciesId)
      : w.sightings.filter((s) => s.id === open.id)
    : [];

  return (
    <PageShell>
      <header className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1
            className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl"
            style={{ color: THEME.ink }}
          >
            All my photos
          </h1>
          <p className="mt-2 text-base text-[#8a8278]">
            {w.sightingsLoading
              ? "Loading…"
              : `${photos.length} ${photos.length === 1 ? "photo" : "photos"} of ${w.uniqueAnimals} ${
                  w.uniqueAnimals === 1 ? "animal" : "animals"
                }`}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setBatch(true)}
            className={BTN_WHITE}
          >
            Upload several
          </button>
          <button
            type="button"
            onClick={() => setAdding({})}
            className={BTN_PRIMARY}
          >
            + Add a sighting
          </button>
        </div>
      </header>

      {!w.sightingsLoading && photos.length === 0 && (
        <p className="mt-10 text-base" style={{ color: THEME.ink }}>
          No photos yet. Add your first sighting!
        </p>
      )}

      <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {photos.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => setOpen(s)}
              className="flex w-full flex-col overflow-hidden rounded-2xl border-[1.5px] border-[#2B2420] bg-white text-left transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B2420] focus-visible:ring-offset-2"
            >
              <img
                src={s.photo}
                alt={`Your photo of a ${s.speciesName}`}
                loading="lazy"
                className="aspect-square w-full object-cover"
              />
              <div className="border-t-[1.5px] border-[#2B2420] p-3">
                <p
                  className="text-sm font-semibold leading-snug"
                  style={{ color: THEME.ink }}
                >
                  {s.speciesName}
                </p>
                <p className="mt-0.5 text-xs text-[#8a8278]">
                  {formatDate(s.date)}
                  {s.place && <> · {s.place}</>}
                </p>
              </div>
            </button>
          </li>
        ))}
      </ul>

      {open && (
        <SpeciesModal
          key={open.id}
          species={openSpecies}
          fallbackName={open.speciesName}
          sightings={openSightings}
          startId={open.id}
          onAdd={
            openSpecies
              ? () => {
                  setOpen(null);
                  setAdding({ species: openSpecies });
                }
              : undefined
          }
          options={w.allSpecies}
          onUpdate={w.updateSighting}
          onDelete={w.removeSighting}
          onClose={() => setOpen(null)}
        />
      )}

      {adding && (
        <AddSightingModal
          options={w.allSpecies}
          defaultSpecies={adding.species}
          onSave={w.addSighting}
          onClose={() => setAdding(null)}
        />
      )}

      {batch && (
        <BatchUploadModal
          options={w.allSpecies}
          onSave={w.addSighting}
          onClose={() => setBatch(false)}
        />
      )}
    </PageShell>
  );
};

export default WildlifePhotos;

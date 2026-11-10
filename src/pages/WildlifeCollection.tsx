import { useState, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import {
  BTN_PRIMARY,
  BTN_WHITE,
  NEAR_YOU_ID,
  THEME,
  collectionById,
  type Species,
} from "../wildlife/data";
import { signInWithGoogle } from "../wildlife/firebase";
import { useWildlife } from "../wildlife/useWildlife";
import { AddSightingModal, SpeciesModal } from "../wildlife/WildlifeModals";
import WildlifeCredits from "../wildlife/WildlifeCredits";

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

const WildlifeCollection = () => {
  const { collectionId = "" } = useParams();
  const collection = collectionById.get(collectionId);
  const w = useWildlife();
  const [open, setOpen] = useState<Species | null>(null);
  const [adding, setAdding] = useState<{ species?: Species } | null>(null);

  if (!collection) {
    return (
      <PageShell>
        <p className="mt-10 text-base" style={{ color: THEME.ink }}>
          This collection doesn't exist.
        </p>
      </PageShell>
    );
  }

  const isNearYou = collection.id === NEAR_YOU_ID;
  const list = w.speciesInCollection(collection.id);
  const found = list.filter((s) => w.spotted.has(s.id)).length;

  // Adding needs a signed-in user
  const startAdding = async (species?: Species) => {
    if (!w.user) {
      try {
        await signInWithGoogle();
      } catch {
        return;
      }
    }
    setOpen(null);
    setAdding({ species });
  };

  return (
    <PageShell>
      {/* HEADER */}
      <header className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span
            className="rounded-full border border-[#2B2420] px-2.5 py-0.5 text-xs font-semibold text-[#2B2420]"
            style={{ backgroundColor: collection.color }}
          >
            {found} / {list.length} found
          </span>
          <h1
            className="mt-3 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl"
            style={{ color: THEME.ink }}
          >
            {collection.name}
          </h1>
          <p className="mt-2 max-w-xl text-base text-[#8a8278]">
            {collection.description}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {w.user && w.tracked !== collection.id && (
            <button
              type="button"
              onClick={() => w.track(collection.id)}
              className={BTN_WHITE}
            >
              Track this collection
            </button>
          )}
          {w.user && w.tracked === collection.id && (
            <span className="inline-flex items-center rounded-full border-[1.5px] border-dashed border-[#2B2420] px-4 py-2.5 text-sm font-medium text-[#2B2420]">
              ✓ Tracking
            </span>
          )}
          <button
            type="button"
            onClick={() => startAdding()}
            className={BTN_PRIMARY}
          >
            + Add a sighting
          </button>
        </div>
      </header>

      {/* NEAR YOU: location and loading states */}
      {isNearYou && !w.home && (
        <div className="mt-10 rounded-2xl border-[1.5px] border-[#2B2420] bg-white p-6">
          <p className="text-base" style={{ color: THEME.ink }}>
            Share your location to see the most observed animals around you.
          </p>
          <button
            type="button"
            onClick={w.setHomeFromBrowser}
            className={`${BTN_WHITE} mt-4`}
          >
            Use my location
          </button>
          {w.homeError && (
            <p className="mt-2 text-sm text-red-700">{w.homeError}</p>
          )}
        </div>
      )}
      {isNearYou && w.nearby.loading && (
        <p className="mt-10 text-sm text-[#8a8278]">
          Finding animals near you…
        </p>
      )}
      {isNearYou && w.nearby.error && (
        <p role="alert" className="mt-10 text-sm text-red-700">
          {w.nearby.error}
        </p>
      )}

      {/* SPECIES GRID */}
      <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {list.map((species) => {
          const mine = w.sightingsOf(species.id);
          const latest = mine[mine.length - 1];
          return (
            <li key={species.id}>
              <button
                type="button"
                onClick={() => setOpen(species)}
                className="group flex w-full flex-col overflow-hidden rounded-2xl border-[1.5px] border-[#2B2420] bg-white text-left transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B2420] focus-visible:ring-offset-2"
              >
                <div className="relative">
                  {latest ? (
                    <img
                      src={latest.photo}
                      alt={`Your photo of a ${species.name}`}
                      className="aspect-square w-full object-cover"
                    />
                  ) : species.photo ? (
                    <img
                      src={species.photo.url}
                      alt=""
                      loading="lazy"
                      className="aspect-square w-full object-cover opacity-40 grayscale"
                    />
                  ) : (
                    <div className="aspect-square w-full bg-[#FBF8F1]" />
                  )}
                  <span className="absolute left-2 top-2 rounded-full border border-[#2B2420] bg-white px-2 py-0.5 text-[11px] font-semibold text-[#2B2420]">
                    #{species.rank}
                  </span>
                </div>
                <div className="border-t-[1.5px] border-[#2B2420] p-3">
                  <p
                    className="text-sm font-semibold leading-snug"
                    style={{ color: THEME.ink }}
                  >
                    {species.name}
                  </p>
                  <p className="mt-0.5 text-xs text-[#8a8278]">
                    {latest
                      ? `${mine.length} ${mine.length === 1 ? "photo" : "photos"}`
                      : "Not spotted yet"}
                  </p>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      {open && (
        <SpeciesModal
          key={open.id}
          species={open}
          sightings={w.sightingsOf(open.id)}
          onAdd={() => startAdding(open)}
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
    </PageShell>
  );
};

export default WildlifeCollection;

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import Globe, { type GlobeMethods } from "react-globe.gl";
import {
  BTN_PRIMARY,
  BTN_WHITE,
  NEAR_YOU_ID,
  THEME,
  hexToRgb,
  type Species,
} from "../wildlife/data";
import { signInWithGoogle, signOutUser } from "../wildlife/firebase";
import { useElementWidth, type Sighting } from "../wildlife/useSightings";
import { useWildlife } from "../wildlife/useWildlife";
import {
  AddSightingModal,
  GLOBE_IMAGE,
  SpeciesModal,
} from "../wildlife/WildlifeModals";
import WildlifeCredits from "../wildlife/WildlifeCredits";
import GlobeGuard, { GlobeUnavailable } from "../wildlife/GlobeGuard";
import BatchUploadModal from "../wildlife/BatchUploadModal";

type GlobePoint = Sighting & { color: string };

// The spinning globe with a glowing dot per sighting
const SightingsGlobe = ({
  points,
  showEmpty,
  onPick,
}: {
  points: GlobePoint[];
  showEmpty: boolean;
  onPick: (s: GlobePoint) => void;
}) => {
  const box = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const width = useElementWidth(box);
  const height = Math.min(Math.max(width * 0.75, 320), 520);

  useEffect(() => {
    const controls = globeRef.current?.controls();
    if (controls) {
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.5;
    }
  }, [width]);

  return (
    <div
      ref={box}
      className="relative mt-6 overflow-hidden rounded-2xl border-[1.5px] border-[#2B2420]"
      style={{ backgroundColor: THEME.space, minHeight: 320 }}
    >
      {width > 0 && (
        <GlobeGuard fallback={<GlobeUnavailable />}>
          <Globe
            ref={globeRef}
            width={width}
            height={height}
            globeImageUrl={GLOBE_IMAGE}
            backgroundColor="rgba(0,0,0,0)"
            atmosphereColor="#9ecbff"
            pointsData={points}
            pointLat="lat"
            pointLng="lng"
            pointColor={(d) => (d as GlobePoint).color}
            pointAltitude={0.02}
            pointRadius={0.7}
            pointLabel={(d) => (d as GlobePoint).speciesName}
            onPointClick={(d) => onPick(d as GlobePoint)}
            ringsData={points}
            ringLat="lat"
            ringLng="lng"
            ringColor={(d: object) => {
              const rgb = hexToRgb((d as GlobePoint).color);
              return (t: number) => `rgba(${rgb}, ${1 - t})`;
            }}
            ringMaxRadius={4}
            ringPropagationSpeed={2}
            ringRepeatPeriod={1400}
          />
        </GlobeGuard>
      )}
      {showEmpty && (
        <div className="pointer-events-none absolute inset-x-0 bottom-6 text-center">
          <p className="inline-block rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-[#2B2420]">
            Your globe is empty. Add your first sighting!
          </p>
        </div>
      )}
    </div>
  );
};

const PageShell = ({ children }: { children: ReactNode }) => (
  <div
    className="min-h-screen"
    style={{ backgroundColor: THEME.sand, fontFamily: "'Poppins', sans-serif" }}
  >
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');`}</style>
    <div className="mx-auto max-w-5xl px-6 py-10">
      <Link
        to="/"
        className="text-sm font-medium text-[#6b6359] underline-offset-4 hover:underline"
      >
        ← Back to home
      </Link>
      {children}
      <WildlifeCredits />
    </div>
  </div>
);

const WildlifeMap = () => {
  const w = useWildlife();
  const [adding, setAdding] = useState<{ species?: Species } | null>(null);
  const [batch, setBatch] = useState(false);
  const [open, setOpen] = useState<Sighting | null>(null);
  const [signInError, setSignInError] = useState<string | null>(null);

  const points: GlobePoint[] = useMemo(
    () => w.sightings.map((s) => ({ ...s, color: w.colorOf(s) })),
    [w.sightings, w.colorOf],
  );

  const signIn = async () => {
    setSignInError(null);
    try {
      await signInWithGoogle();
    } catch {
      setSignInError("Sign-in didn't work. Please try again.");
    }
  };

  /* ----- Loading / signed out ----- */

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
        <section className="mt-10 rounded-2xl border-[1.5px] border-[#2B2420] bg-white p-8 sm:p-12">
          <h1
            className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl"
            style={{ color: THEME.ink }}
          >
            Your wildlife map
          </h1>
          <p className="mt-3 max-w-xl text-base text-[#6b6359]">
            Photograph animals in the wild, pin them on your own globe and see
            how many of the world's most observed species you can find.
          </p>
          <button
            type="button"
            onClick={signIn}
            className={`${BTN_PRIMARY} mt-6`}
          >
            Sign in with Google to start
          </button>
          {signInError && (
            <p role="alert" className="mt-3 text-sm text-red-700">
              {signInError}
            </p>
          )}
        </section>
      </PageShell>
    );
  }

  /* ----- Signed in ----- */

  const trackedCollection = w.tracked
    ? w.collections.find((c) => c.id === w.tracked)
    : undefined;
  const trackedList = trackedCollection
    ? w.speciesInCollection(trackedCollection.id)
    : [];
  const trackedFound = trackedList.filter((s) => w.spotted.has(s.id)).length;

  const pickCollection = async (collectionId: string) => {
    if (collectionId === NEAR_YOU_ID && !w.home) await w.setHomeFromBrowser();
    await w.track(collectionId);
  };

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
      {/* HEADER */}
      <header className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1
            className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl"
            style={{ color: THEME.ink }}
          >
            My wildlife map
          </h1>
          <p className="mt-2 text-sm text-[#8a8278]">
            Signed in as {w.user.displayName ?? w.user.email} ·{" "}
            <button
              type="button"
              onClick={signOutUser}
              className="underline underline-offset-2"
            >
              Sign out
            </button>
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/wildlife/photos" className={BTN_WHITE}>
            All my photos
          </Link>
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

      {w.sightingsError && (
        <p role="alert" className="mt-4 text-sm text-red-700">
          {w.sightingsError}
        </p>
      )}

      {/* CHOOSE A COLLECTION (first visit) */}
      {!w.trackedLoading && !trackedCollection && (
        <section className="mt-8 rounded-2xl border-[1.5px] border-[#2B2420] bg-white p-6">
          <h2 className="text-xl font-semibold" style={{ color: THEME.ink }}>
            Choose a collection to track
          </h2>
          <p className="mt-1 text-sm text-[#6b6359]">
            Your progress will show here. You can change it anytime.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {w.collections.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => pickCollection(c.id)}
                className="rounded-full border-[1.5px] border-[#2B2420] px-4 py-2 text-sm font-medium text-[#2B2420] transition-colors hover:bg-[#2B2420] hover:text-white"
                style={{ backgroundColor: c.color }}
              >
                {c.name}
              </button>
            ))}
          </div>
          {w.homeError && (
            <p className="mt-3 text-sm text-red-700">{w.homeError}</p>
          )}
        </section>
      )}

      {/* STATS */}
      <dl className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border-[1.5px] border-[#2B2420] bg-white px-5 py-4">
          <dt className="text-sm text-[#8a8278]">Animals photographed</dt>
          <dd
            className="mt-1 text-2xl font-semibold"
            style={{ color: THEME.ink }}
          >
            {w.sightingsLoading ? "…" : w.uniqueAnimals}
            {!w.sightingsLoading && (
              <span className="ml-2 text-sm font-normal text-[#8a8278]">
                in {w.sightings.length}{" "}
                {w.sightings.length === 1 ? "photo" : "photos"}
              </span>
            )}
          </dd>
        </div>

        {trackedCollection && (
          <div className="rounded-2xl border-[1.5px] border-[#2B2420] bg-white px-5 py-4">
            <dt className="flex items-center justify-between gap-3 text-sm text-[#8a8278]">
              <span>Tracking</span>
              <label className="flex items-center gap-1">
                <span className="sr-only">Change tracked collection</span>
                <select
                  value={trackedCollection.id}
                  onChange={(e) => pickCollection(e.target.value)}
                  className="rounded-full border border-[#2B2420] bg-white px-2 py-0.5 text-xs font-medium text-[#2B2420]"
                >
                  {w.collections.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
            </dt>
            <dd
              className="mt-1 text-2xl font-semibold"
              style={{ color: THEME.ink }}
            >
              <Link
                to={`/wildlife/${trackedCollection.id}`}
                className="underline-offset-4 hover:underline"
              >
                {trackedCollection.name}
              </Link>
              <span className="ml-2 text-sm font-normal text-[#8a8278]">
                {trackedCollection.id === NEAR_YOU_ID && w.nearby.loading
                  ? "loading…"
                  : `${trackedFound} / ${trackedList.length} found`}
              </span>
            </dd>
          </div>
        )}
      </dl>

      {/* GLOBE */}
      <SightingsGlobe
        points={points}
        showEmpty={!w.sightingsLoading && w.sightings.length === 0}
        onPick={setOpen}
      />

      {/* COLLECTIONS */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold" style={{ color: THEME.ink }}>
          Collections
        </h2>
        <p className="mt-1 text-sm text-[#8a8278]">
          More collections will be added over time.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {w.collections.map((c) => {
            const isNearYou = c.id === NEAR_YOU_ID;
            const list = w.speciesInCollection(c.id);
            const found = list.filter((s) => w.spotted.has(s.id)).length;
            const pct = list.length
              ? Math.round((found / list.length) * 100)
              : 0;

            // "Near you" needs a location first
            if (isNearYou && !w.home) {
              return (
                <div
                  key={c.id}
                  className="flex flex-col rounded-2xl border-[1.5px] border-[#2B2420] bg-white p-5"
                >
                  <span
                    className="self-start rounded-full border border-[#2B2420] px-2.5 py-0.5 text-xs font-semibold text-[#2B2420]"
                    style={{ backgroundColor: c.color }}
                  >
                    Local
                  </span>
                  <h3
                    className="mt-3 text-lg font-semibold"
                    style={{ color: THEME.ink }}
                  >
                    {c.name}
                  </h3>
                  <p className="mt-1 flex-1 text-sm text-[#6b6359]">
                    {c.description}
                  </p>
                  <button
                    type="button"
                    onClick={w.setHomeFromBrowser}
                    className={`${BTN_WHITE} mt-4 self-start`}
                  >
                    Use my location
                  </button>
                  {w.homeError && (
                    <p className="mt-2 text-xs text-red-700">{w.homeError}</p>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={c.id}
                to={`/wildlife/${c.id}`}
                className="group flex flex-col rounded-2xl border-[1.5px] border-[#2B2420] bg-white p-5 transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B2420] focus-visible:ring-offset-2"
              >
                <span
                  className="self-start rounded-full border border-[#2B2420] px-2.5 py-0.5 text-xs font-semibold text-[#2B2420]"
                  style={{ backgroundColor: c.color }}
                >
                  {isNearYou && w.nearby.loading
                    ? "Loading…"
                    : found === list.length && list.length > 0
                      ? "Completed"
                      : `${found} / ${list.length}`}
                </span>
                <h3
                  className="mt-3 text-lg font-semibold"
                  style={{ color: THEME.ink }}
                >
                  {c.name}
                </h3>
                <p className="mt-1 flex-1 text-sm text-[#6b6359]">
                  {c.description}
                </p>
                <div
                  className="mt-4 h-2.5 overflow-hidden rounded-full border border-[#2B2420] bg-[#FBF8F1]"
                  role="progressbar"
                  aria-valuenow={pct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${c.name}: ${found} of ${list.length} species found`}
                >
                  <div
                    className="h-full transition-all"
                    style={{ width: `${pct}%`, backgroundColor: c.color }}
                  />
                </div>
              </Link>
            );
          })}

          <div className="flex items-center justify-center rounded-2xl border-[1.5px] border-dashed border-[#c4bdb1] p-5 text-center">
            <p className="text-sm text-[#8a8278]">
              More collections coming soon
            </p>
          </div>
        </div>
      </section>

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

export default WildlifeMap;

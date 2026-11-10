import { useState } from "react";
import { BTN_PRIMARY, BTN_WHITE, type Species } from "./data";
import { placeNameFor, type Spot } from "./geo";
import { readPhoto, today, type NewSighting } from "./useSightings";
import {
  INPUT,
  LABEL,
  Modal,
  PlaceField,
  SpeciesPicker,
  type SpeciesChoice,
} from "./WildlifeModals";

const MAX_PHOTOS = 20;

type Status =
  | "reading"
  | "ready"
  | "unreadable"
  | "saving"
  | "saved"
  | "failed";

type BatchItem = {
  key: string;
  fileName: string;
  status: Status;
  photo?: string;
  spot: Spot | null;
  fromPhoto: boolean; // location read from the photo itself
  date: string;
  choice: SpeciesChoice;
};

type Props = {
  options: Species[];
  onSave: (s: NewSighting) => Promise<void>;
  onClose: () => void;
};

const BatchUploadModal = ({ options, onSave, onClose }: Props) => {
  const [items, setItems] = useState<BatchItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [problems, setProblems] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const [saveTotal, setSaveTotal] = useState(0);

  const update = (key: string, patch: Partial<BatchItem>) =>
    setItems((list) =>
      list.map((it) => (it.key === key ? { ...it, ...patch } : it)),
    );

  const clearProblem = (key: string) =>
    setProblems((p) => {
      const next = { ...p };
      delete next[key];
      return next;
    });

  // Read the chosen photos one by one (keeps memory use low on phones)
  const addFiles = async (fileList: FileList | null) => {
    if (!fileList?.length) return;
    setError(null);
    const room = MAX_PHOTOS - items.length;
    const files = Array.from(fileList).slice(0, Math.max(room, 0));
    if (fileList.length > room)
      setError(`You can upload up to ${MAX_PHOTOS} photos at a time.`);

    const fresh: BatchItem[] = files.map((f) => ({
      key: crypto.randomUUID(),
      fileName: f.name,
      status: "reading",
      spot: null,
      fromPhoto: false,
      date: today(),
      choice: { species: null, typedName: null },
    }));
    setItems((list) => [...list, ...fresh]);

    const named: { key: string; lat: number; lng: number }[] = [];
    for (let i = 0; i < files.length; i++) {
      const key = fresh[i].key;
      try {
        const result = await readPhoto(files[i]);
        update(key, {
          status: "ready",
          photo: result.photo,
          date: result.date ?? today(),
          spot: result.location ? { ...result.location, place: "" } : null,
          fromPhoto: Boolean(result.location),
        });
        if (result.location) named.push({ key, ...result.location });
      } catch {
        update(key, { status: "unreadable" });
      }
    }

    // Then look up place names for photos with a location (one per second)
    for (const n of named) {
      const place = await placeNameFor(n.lat, n.lng);
      if (!place) continue;
      setItems((list) =>
        list.map((it) =>
          it.key === n.key &&
          it.spot &&
          it.spot.lat === n.lat &&
          it.spot.lng === n.lng &&
          !it.spot.place
            ? { ...it, spot: { ...it.spot, place } }
            : it,
        ),
      );
    }
  };

  const remove = (key: string) =>
    setItems((list) => list.filter((it) => it.key !== key));

  // Copy one photo's place to every photo that doesn't have one yet
  const useForOthers = (spot: Spot) =>
    setItems((list) =>
      list.map((it) =>
        it.spot ? it : { ...it, spot: { ...spot }, fromPhoto: false },
      ),
    );

  const toSave = items.filter(
    (it) => it.status === "ready" || it.status === "failed",
  );
  const withoutPlace = toSave.filter((it) => !it.spot).length;
  const reading = items.some((it) => it.status === "reading");

  const saveAll = async () => {
    setError(null);
    if (toSave.length === 0) return setError("Add at least one photo.");

    // Check every photo first
    const found: Record<string, string> = {};
    for (const it of toSave) {
      const noAnimal = !it.choice.species && !it.choice.typedName?.trim();
      if (noAnimal && !it.spot)
        found[it.key] = "Choose the animal and the place.";
      else if (noAnimal) found[it.key] = "Choose the animal.";
      else if (!it.spot) found[it.key] = "Set the place.";
    }
    setProblems(found);
    const count = Object.keys(found).length;
    if (count > 0)
      return setError(
        `${count} ${count === 1 ? "photo needs" : "photos need"} more details (marked in red).`,
      );

    setSaving(true);
    setSavedCount(0);
    setSaveTotal(toSave.length);
    let failures = 0;

    for (const it of toSave) {
      update(it.key, { status: "saving" });
      try {
        await onSave({
          speciesId: it.choice.species?.id ?? null,
          speciesName: it.choice.species?.name ?? it.choice.typedName!.trim(),
          scientificName: it.choice.species?.scientificName,
          photo: it.photo!,
          lat: it.spot!.lat,
          lng: it.spot!.lng,
          place: it.spot!.place.trim() || undefined,
          date: it.date,
        });
        update(it.key, { status: "saved" });
        setSavedCount((n) => n + 1);
      } catch {
        failures++;
        update(it.key, { status: "failed" });
      }
    }

    setSaving(false);
    if (failures === 0) onClose();
    else
      setError(
        `${failures} ${failures === 1 ? "photo" : "photos"} couldn't be saved. Check your connection and click "Save all" again.`,
      );
  };

  return (
    <Modal
      title="Upload several photos"
      onClose={saving ? () => undefined : onClose}
      wide
    >
      <div className="mt-5 space-y-6">
        {/* Choose photos */}
        <label className="block cursor-pointer">
          <div className="grid place-items-center rounded-xl border-[1.5px] border-dashed border-[#2B2420] bg-[#FBF8F1] px-4 py-8 text-center">
            <p className="text-sm font-medium text-[#2B2420]">
              {items.length ? "+ Add more photos" : "Click to choose photos"}
            </p>
            <p className="mt-1 text-xs text-[#8a8278]">
              Up to {MAX_PHOTOS} at a time. Place and date are read from each
              photo when available.
            </p>
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            disabled={saving || items.length >= MAX_PHOTOS}
            onChange={(e) => {
              addFiles(e.target.files);
              e.target.value = ""; // allow choosing the same files again
            }}
          />
        </label>

        {/* One card per photo */}
        {items.length > 0 && (
          <ul className="space-y-4">
            {items.map((it, i) => (
              <li
                key={it.key}
                className={`flex flex-col gap-4 rounded-2xl border-[1.5px] p-4 sm:flex-row ${
                  problems[it.key] ? "border-red-700" : "border-[#2B2420]"
                } ${it.status === "saved" ? "opacity-60" : ""}`}
              >
                <div className="w-full shrink-0 sm:w-32">
                  {it.photo ? (
                    <img
                      src={it.photo}
                      alt={`Photo ${i + 1}`}
                      className="aspect-square w-full rounded-xl border-[1.5px] border-[#2B2420] object-cover"
                    />
                  ) : (
                    <div className="grid aspect-square w-full place-items-center rounded-xl border-[1.5px] border-dashed border-[#c4bdb1] bg-[#FBF8F1] text-xs text-[#8a8278]">
                      {it.status === "unreadable" ? "Can't read" : "Reading…"}
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1 space-y-3">
                  {it.status === "unreadable" ? (
                    <p className="text-sm text-red-700">
                      We couldn't read {it.fileName}. Please use a JPG or PNG
                      image.
                    </p>
                  ) : (
                    <>
                      <div>
                        <span className={LABEL}>Animal</span>
                        <SpeciesPicker
                          options={options}
                          value={it.choice}
                          onChange={(choice) => {
                            update(it.key, { choice });
                            clearProblem(it.key);
                          }}
                          compact
                        />
                      </div>

                      <div>
                        <span className={LABEL}>Place</span>
                        <PlaceField
                          value={it.spot}
                          onChange={(spot) => {
                            const moved =
                              !it.spot ||
                              spot.lat !== it.spot.lat ||
                              spot.lng !== it.spot.lng;
                            update(it.key, {
                              spot,
                              fromPhoto: moved ? false : it.fromPhoto,
                            });
                            clearProblem(it.key);
                          }}
                          note={it.fromPhoto ? "from your photo" : undefined}
                        />
                        {it.spot && withoutPlace > 0 && (
                          <button
                            type="button"
                            onClick={() => useForOthers(it.spot!)}
                            className="mt-1.5 text-xs font-medium text-[#2B2420] underline underline-offset-2"
                          >
                            Use this place for the {withoutPlace}{" "}
                            {withoutPlace === 1 ? "photo" : "photos"} without
                            one
                          </button>
                        )}
                      </div>

                      <label className="block sm:max-w-[220px]">
                        <span className={LABEL}>Date</span>
                        <input
                          type="date"
                          value={it.date}
                          max={today()}
                          onChange={(e) =>
                            update(it.key, { date: e.target.value })
                          }
                          className={INPUT}
                        />
                      </label>
                    </>
                  )}

                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-medium text-[#8a8278]">
                      {problems[it.key] && (
                        <span className="text-red-700">{problems[it.key]}</span>
                      )}
                      {it.status === "saving" && "Saving…"}
                      {it.status === "saved" && "✓ Saved"}
                      {it.status === "failed" && (
                        <span className="text-red-700">Not saved</span>
                      )}
                    </p>
                    {it.status !== "saving" && it.status !== "saved" && (
                      <button
                        type="button"
                        onClick={() => remove(it.key)}
                        className="text-sm font-medium text-[#2B2420] underline underline-offset-2"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {error && (
          <p role="alert" className="text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={saveAll}
            disabled={saving || reading || toSave.length === 0}
            className={BTN_PRIMARY}
          >
            {saving
              ? `Saving ${savedCount} / ${saveTotal}…`
              : `Save all${toSave.length ? ` (${toSave.length})` : ""}`}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className={BTN_WHITE}
          >
            Cancel
          </button>
          {reading && (
            <span className="text-sm text-[#8a8278]">Reading photos…</span>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default BatchUploadModal;

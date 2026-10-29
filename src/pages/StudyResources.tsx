import { useMemo, useState } from "react";
import { hasAccess, useAuth } from "../auth/AuthProvider";
import ResourceOverview, {
  COLORS,
  TOPIC_COLORS,
  type Kind,
  type Resource,
  type Topic,
} from "../components/ResourceOverview";
import AccountBar from "../components/AccountBar";

// Paste your Tally or Google Forms link here.
// While it's empty, the button opens an email to you instead.
const RECOMMEND_FORM_URL = "";
const RECOMMEND_LINK =
  RECOMMEND_FORM_URL ||
  "mailto:learnandhelpanimals@gmail.com?subject=Resource%20recommendation";

// Add one entry per resource.
// kind "notes": your own file in /public (sign-in needed to open)
// kind "external": a full https:// link to another site (open to everyone)
const RESOURCES: Resource[] = [
  {
    id: "primates-overview",
    kind: "notes",
    title: "Primates classification",
    description:
      "Wet-nosed vs dry-nosed primates, the classification tree and the main traits of lemurs, monkeys and apes.",
    topic: "Zoology",
    type: "PDF",
    uploadedBy: "Marina",
    url: "/primates-overview.pdf",
    added: "2026-10-22",
  },
  {
    id: "mammals-classification",
    kind: "notes",
    title: "Mammals: Classification",
    description: "Mammals classification by reproduction and taxonomy groups",
    topic: "Zoology",
    type: "PDF",
    uploadedBy: "Marina",
    url: "/Mammals classification by reproduction and taxonomy groups.pdf",
    added: "2026-10-22",
  },
  {
    id: "introduction-to-primates",
    kind: "notes",
    title: "Introduction to Primates",
    description:
      "Wet-nosed vs dry-nosed primates, lemurs, lorises, tarsiers, New and Old World monkeys and apes, with their main traits.",
    topic: "Zoology",
    type: "PDF",
    uploadedBy: "Marina",
    url: "/Introduction to primates - study notes.pdf",
    added: "2026-10-29",
  },
];

const KINDS: { value: Kind; label: string }[] = [
  { value: "notes", label: "Notes" },
  { value: "external", label: "External" },
];

type Filter = "All" | Topic;
const FILTERS: Filter[] = ["All", "Zoology", "Ethology", "Welfare"];

const StudyResources = () => {
  const { user } = useAuth();
  const [kind, setKind] = useState<Kind>("notes");
  const [filter, setFilter] = useState<Filter>("All");
  const [query, setQuery] = useState("");

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return RESOURCES.filter((r) => r.kind === kind)
      .filter((r) => filter === "All" || r.topic === filter)
      .filter(
        (r) =>
          !q ||
          [r.title, r.description, r.topic, r.type, r.uploadedBy]
            .join(" ")
            .toLowerCase()
            .includes(q),
      )
      .sort((a, b) => (b.added ?? "").localeCompare(a.added ?? ""));
  }, [kind, filter, query]);

  const clear = () => {
    setFilter("All");
    setQuery("");
  };

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: COLORS.sand,
        fontFamily: "'Raleway', sans-serif",
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500&family=Raleway:wght@400;600;700&display=swap');`}</style>

      <div className="mx-auto max-w-5xl px-6 py-14">
        <AccountBar />
        {/* HEADER */}
        <header>
          <h1
            className="text-5xl leading-tight sm:text-6xl"
            style={{ fontFamily: "'Fraunces', serif", color: COLORS.bark }}
          >
            Study resources
          </h1>
          <p className="mt-2 max-w-xl text-base text-[#8a8278]">
            Free study sheets and materials on zoology, animal behaviour and
            welfare. Click any resource to open it.
          </p>
        </header>

        {/* NOTES / EXTERNAL TOGGLE */}
        <div
          className="mt-8 inline-flex rounded-full border-[1.5px] p-1"
          style={{ borderColor: COLORS.bark }}
          role="tablist"
          aria-label="Type of resource"
        >
          {KINDS.map((k) => {
            const active = kind === k.value;
            return (
              <button
                key={k.value}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setKind(k.value)}
                className="rounded-full px-5 py-1.5 text-sm font-semibold transition-colors"
                style={
                  active
                    ? { backgroundColor: COLORS.bark, color: COLORS.sand }
                    : { color: COLORS.bark }
                }
              >
                {k.label}
              </button>
            );
          })}
        </div>

        {/* FILTERS + SEARCH */}
        <div className="mt-6 flex flex-col gap-4 border-t border-[#d6d1c7] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Filter by topic"
          >
            {FILTERS.map((f) => {
              const active = filter === f;
              const color = f === "All" ? COLORS.bark : TOPIC_COLORS[f];
              return (
                <button
                  key={f}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(f)}
                  className="rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors"
                  style={
                    active
                      ? {
                          backgroundColor: color,
                          borderColor: color,
                          color: "#fff",
                        }
                      : { borderColor: "#d6d1c7", color: COLORS.bark }
                  }
                >
                  {f}
                </button>
              );
            })}
          </div>

          <label className="flex w-full items-center rounded-lg border border-[#d6d1c7] bg-white px-3 sm:max-w-xs">
            <span className="sr-only">Search resources</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search resources…"
              className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none"
              style={{ color: COLORS.bark }}
            />
          </label>
        </div>

        <p className="mt-6 text-sm text-[#8a8278]">
          {shown.length} {shown.length === 1 ? "resource" : "resources"}
          {kind === "notes" && !hasAccess(user) && (
            <> · 🔒 Sign in for free to open the study notes</>
          )}
        </p>

        {/* GRID */}
        {shown.length > 0 ? (
          <div className="mt-4 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((r) => (
              <ResourceOverview
                key={r.id}
                resource={r}
                index={RESOURCES.indexOf(r) + 1}
              />
            ))}
          </div>
        ) : (
          <div className="mt-10 text-center">
            <p className="text-base" style={{ color: COLORS.bark }}>
              {kind === "external" &&
              RESOURCES.every((r) => r.kind !== "external")
                ? "External resources are coming soon."
                : "No resources found."}
            </p>
            <button
              type="button"
              onClick={clear}
              className="mt-3 text-sm font-semibold underline underline-offset-2"
              style={{ color: COLORS.ocean }}
            >
              Clear filters
            </button>
          </div>
        )}

        {/* RECOMMEND A RESOURCE */}
        <div className="mt-16 flex flex-col gap-4 border-t border-[#d6d1c7] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2
              className="text-2xl"
              style={{ fontFamily: "'Fraunces', serif", color: COLORS.bark }}
            >
              Know a great resource?
            </h2>
            <p className="mt-1 max-w-md text-sm text-[#6b6359]">
              A course, video, book or site that helped you learn? Share it and
              it may be added to the library.
            </p>
          </div>
          <a
            href={RECOMMEND_LINK}
            target="_blank"
            rel="noopener noreferrer"
            data-umami-event="recommend-click"
            className="group inline-flex items-center gap-2 self-start rounded-lg px-5 py-3 text-sm font-semibold transition-opacity hover:opacity-90 sm:self-auto"
            style={{ backgroundColor: COLORS.bark, color: COLORS.sand }}
          >
            Recommend a resource
            <span
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-1"
            >
              →
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default StudyResources;

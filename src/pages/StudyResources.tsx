import { useMemo, useState } from "react";
import ResourceOverview, {
  COLORS,
  TOPIC_COLORS,
  type Resource,
  type Topic,
} from "../components/ResourceOverview";
// Login is paused for now; uncomment to bring it back
// import AccountBar from "../components/AccountBar";

const RECOMMEND_LINK = "https://tally.so/r/jeeKqx";

// Add one entry per resource (full https:// link)
const RESOURCES: Resource[] = [
  {
    id: "wur-introduction-animal-behaviour",
    title: "Introduction to Animal Behaviour",
    description:
      "Online course by Wageningen University & Research on how wild animals learn, communicate, find food, avoid predators, choose mates and raise young. 6 weeks, 4–6 hours per week, no prior knowledge needed. Free to study; the €209 is only for the official certificate.",
    topic: "Ethology",
    type: "Course",
    source: "Wageningen University & Research",
    url: "https://www.wur.nl/en/education/for-professionals/programmes-and-courses/introduction-animal-behaviour",
    added: "2026-10-29",
  },
  {
    id: "cetaceans-human-care-europe",
    title: "The Future of Cetaceans Under Human Care in Europe",
    description:
      "Position paper by Annemarie van den Berg (Annemarie Consultancy), with 20 years of experience in cetacean rescue and rehabilitation. Argues that dolphins already in European parks will need care for decades, and calls for modern enclosures and expert-led rescue plans as parks close. An opinion piece in an ongoing debate.",
    topic: "Welfare",
    type: "Article",
    source: "Annemarie van den Berg",
    url: "https://media.licdn.com/dms/document/media/v2/D4E1FAQFtDiXEEAQoSw/feedshare-document-pdf-analyzed/B4EaGCgoabIgAY-/0/1793190956506?e=1794441600&v=beta&t=GcmeX9PyMhqmGMWTYG21pReYKMPvtMmbCTmiHAt0jqE",
    added: "2026-10-29",
  },
];

type Filter = "All" | Topic;
const FILTERS: Filter[] = ["All", "Zoology", "Ethology", "Welfare"];

const StudyResources = () => {
  const [filter, setFilter] = useState<Filter>("All");
  const [query, setQuery] = useState("");

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return RESOURCES.filter((r) => filter === "All" || r.topic === filter)
      .filter(
        (r) =>
          !q ||
          [r.title, r.description, r.topic, r.type, r.source]
            .join(" ")
            .toLowerCase()
            .includes(q),
      )
      .sort((a, b) => (b.added ?? "").localeCompare(a.added ?? ""));
  }, [filter, query]);

  const clear = () => {
    setFilter("All");
    setQuery("");
  };

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: COLORS.sand,
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');`}</style>

      <div className="mx-auto max-w-4xl px-6 py-14">
        {/* Login is paused for now; uncomment to bring it back */}
        {/* <AccountBar /> */}

        {/* HEADER */}
        <header>
          <h1
            className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl"
            style={{ color: COLORS.bark }}
          >
            Study resources
          </h1>
          <p className="mt-2 max-w-xl text-base text-[#8a8278]">
            A curated hub of courses, articles and materials on zoology, animal
            behaviour and welfare from trusted sources.
          </p>
        </header>

        {/* FILTERS + SEARCH */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Filter by topic"
          >
            {FILTERS.map((f) => {
              const active = filter === f;
              const color = f === "All" ? "#2B2420" : TOPIC_COLORS[f];
              const textColor = f === "All" ? "#fff" : "#2B2420";
              return (
                <button
                  key={f}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(f)}
                  className="rounded-full border-[1.5px] px-4 py-1.5 text-sm font-medium transition-colors"
                  style={
                    active
                      ? {
                          backgroundColor: color,
                          borderColor: "#2B2420",
                          color: textColor,
                        }
                      : { borderColor: "#2B2420", color: "#2B2420" }
                  }
                >
                  {f}
                </button>
              );
            })}
          </div>

          <label className="flex w-full items-center rounded-full border-[1.5px] border-[#2B2420] bg-white px-4 sm:max-w-xs">
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

        <p className="mt-8 text-sm text-[#8a8278]">
          {shown.length} {shown.length === 1 ? "resource" : "resources"}
        </p>

        {/* LIST */}
        {shown.length > 0 ? (
          <ul className="mt-3 flex flex-col gap-4">
            {shown.map((r) => (
              <ResourceOverview key={r.id} resource={r} />
            ))}
          </ul>
        ) : (
          <div className="mt-10 text-center">
            <p className="text-base" style={{ color: COLORS.bark }}>
              No resources found.
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
        <div className="mt-16 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2
              className="text-2xl font-semibold"
              style={{ color: COLORS.bark }}
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
            className="group inline-flex items-center gap-1.5 self-start rounded-full border-[1.5px] border-[#2B2420] bg-white px-5 py-3 text-sm font-medium text-[#2B2420] transition-colors hover:bg-[#2B2420] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B2420] focus-visible:ring-offset-2 sm:self-auto"
          >
            Recommend a study resource
            <span
              aria-hidden="true"
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            >
              ↗
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default StudyResources;

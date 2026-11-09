export const COLORS = {
  sand: "#F3EFE4",
  bark: "#4A3A2E",
  sage: "#9AA77C",
  ocean: "#2E5E78",
  paper: "#FBF8F1",
};

export type Topic = "Zoology" | "Ethology" | "Welfare";
export type ContentType =
  | "PDF"
  | "Image"
  | "Video"
  | "Article"
  | "Worksheet"
  | "Course";

export type Resource = {
  id: string;
  title: string;
  description?: string;
  topic: Topic;
  type: ContentType;
  source: string; // author or organisation, e.g. "Wageningen University & Research"
  url: string; // full https:// link
  added?: string; // "YYYY-MM-DD"
};

// Bright topic colors, used as backgrounds with dark text on top
export const TOPIC_COLORS: Record<Topic, string> = {
  Zoology: "#FFD23F", // bright yellow
  Ethology: "#FF8A3D", // bright orange
  Welfare: "#FF85B3", // bright pink
};

const formatDate = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

type Props = {
  resource: Resource;
};

// One card in the resources list
const ResourceOverview = ({ resource }: Props) => {
  const { id, title, description, topic, type, source, url, added } = resource;
  const accent = TOPIC_COLORS[topic];

  return (
    <li>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        data-umami-event="external-click"
        data-umami-event-id={id}
        className="group flex flex-col gap-4 rounded-2xl border-[1.5px] border-[#2B2420] bg-white p-6 transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B2420] focus-visible:ring-offset-2 sm:flex-row sm:items-start sm:gap-6"
      >
        <div className="min-w-0 flex-1">
          {/* Topic pill + type */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="rounded-full border border-[#2B2420] px-2.5 py-0.5 text-xs font-semibold text-[#2B2420]"
              style={{ backgroundColor: accent }}
            >
              {topic}
            </span>
            <span className="rounded-full border border-[#2B2420] px-2.5 py-0.5 text-xs font-medium text-[#2B2420]">
              {type}
            </span>
          </div>

          {/* Title */}
          <h3
            className="mt-3 text-lg font-semibold leading-snug"
            style={{ color: COLORS.bark }}
          >
            {title}
          </h3>

          {/* Description */}
          {description && (
            <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-relaxed text-[#6b6359]">
              {description}
            </p>
          )}

          {/* Source + date */}
          <p className="mt-4 flex flex-wrap items-center gap-x-2 text-sm text-[#8a8278]">
            <span>By: {source}</span>
            {added && (
              <>
                <span aria-hidden="true" className="text-[#c4bdb1]">
                  ·
                </span>
                <time dateTime={added}>{formatDate(added)}</time>
              </>
            )}
          </p>
        </div>

        {/* Open button */}
        <span className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full border-[1.5px] border-[#2B2420] px-4 py-2 text-sm font-medium text-[#2B2420] transition-colors group-hover:bg-[#2B2420] group-hover:text-white">
          Open
          <span
            aria-hidden="true"
            className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          >
            ↗
          </span>
        </span>

        <span className="sr-only">(opens in a new tab)</span>
      </a>
    </li>
  );
};

export default ResourceOverview;

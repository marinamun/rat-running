import { Link } from "react-router-dom";
import { hasAccess, useAuth } from "../auth/AuthProvider";

export const COLORS = {
  sand: "#F3EFE4",
  bark: "#4A3A2E",
  sage: "#9AA77C",
  ocean: "#2E5E78",
  paper: "#FBF8F1",
};

export type Topic = "Zoology" | "Ethology" | "Welfare";
export type Kind = "notes" | "external";
export type ContentType =
  | "PDF"
  | "Image"
  | "Video"
  | "Article"
  | "Worksheet"
  | "Course";
export type Resource = {
  id: string;
  kind: Kind; // "notes" = your own study notes (sign-in needed), "external" = link to another site
  title: string;
  description?: string;
  topic: Topic;
  type: ContentType;
  uploadedBy: string;
  url: string; // notes: file in /public, e.g. "/primates-overview.pdf"; external: full https:// link
  added?: string; // "YYYY-MM-DD"
};

export const TOPIC_COLORS: Record<Topic, string> = {
  Zoology: COLORS.sage,
  Ethology: COLORS.ocean,
  Welfare: "#A0673F",
};

const formatDate = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

type Props = {
  resource: Resource;
  index?: number; // shown as a catalogue number, e.g. Nº 001
};

const ResourceOverview = ({ resource, index }: Props) => {
  const { user } = useAuth();
  const { id, kind, title, description, topic, type, uploadedBy, url, added } =
    resource;
  const accent = TOPIC_COLORS[topic];
  const locked = kind === "notes" && !hasAccess(user);

  const content = (
    <>
      {/* Folder tab with the topic */}
      <span
        className="absolute left-0 top-0 rounded-t-lg border-[1.5px] border-b-0 px-4 pb-1.5 pt-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white transition-transform group-hover:-translate-y-0.5"
        style={{ backgroundColor: accent, borderColor: COLORS.bark }}
      >
        {topic}
      </span>

      {/* Card */}
      <div
        className="relative flex h-full flex-col rounded-xl rounded-tl-none border-[1.5px] p-5 shadow-[3px_3px_0_#4A3A2E] transition-all duration-200 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 group-hover:shadow-[5px_5px_0_#4A3A2E] group-focus-visible:shadow-[5px_5px_0_#4A3A2E]"
        style={{ backgroundColor: COLORS.paper, borderColor: COLORS.bark }}
      >
        {/* Catalogue number + type stamp */}
        <div className="flex items-start justify-between gap-3">
          <span
            className="text-xs font-semibold tracking-widest"
            style={{ color: accent }}
          >
            {index !== undefined
              ? `Nº ${String(index).padStart(3, "0")}`
              : "Nº ———"}
            {locked && (
              <span
                className="ml-2 inline-grid h-6 w-6 place-items-center rounded-full align-middle text-[11px]"
                title="Sign in to open"
              >
                <span aria-hidden="true">🔒</span>
              </span>
            )}
          </span>
          <span
            className="rounded-md border-[3px] border-double px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.15em]"
            style={{ borderColor: accent, color: accent }}
          >
            {type}{" "}
          </span>
        </div>

        {/* Title + description */}
        <h3
          className="mt-4 text-2xl leading-tight"
          style={{ fontFamily: "'Fraunces', serif", color: COLORS.bark }}
        >
          {title}
        </h3>
        {description && (
          <p className="mt-2 flex-1 text-sm leading-relaxed text-[#6b6359]">
            {description}
          </p>
        )}

        {/* Specimen label */}
        <dl
          className="mt-5 grid grid-cols-2 gap-x-4 border-t border-dashed pt-3"
          style={{ borderColor: "#d6d1c7" }}
        >
          <div>
            <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8a8278]">
              {kind === "external" ? "Author" : "Collected by"}{" "}
            </dt>
            <dd
              className="mt-0.5 text-base italic"
              style={{ fontFamily: "'Fraunces', serif", color: COLORS.bark }}
            >
              {uploadedBy}
            </dd>
          </div>
          <div>
            <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8a8278]">
              Added
            </dt>
            <dd
              className="mt-0.5 text-base italic"
              style={{ fontFamily: "'Fraunces', serif", color: COLORS.bark }}
            >
              {formatDate(added)}
            </dd>
          </div>
        </dl>

        {/* Open arrow */}
        <span
          aria-hidden="true"
          className="absolute -bottom-4 right-5 grid h-9 w-9 place-items-center rounded-full border-[1.5px] text-base transition-transform duration-200 group-hover:-rotate-45"
          style={{
            backgroundColor: accent,
            borderColor: COLORS.bark,
            color: "#fff",
          }}
        >
          →
        </span>
      </div>
    </>
  );

  const className = "group relative block pt-7 focus:outline-none";

  // Signed out + study notes: sign in first, then go straight to the note
  if (locked) {
    return (
      <Link
        to={`/signin?next=${encodeURIComponent(url)}`}
        className={className}
        data-umami-event="note-locked-click"
        data-umami-event-id={id}
      >
        {content}
        <span className="sr-only">(sign in to open)</span>
      </Link>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      data-umami-event={kind === "notes" ? "note-open" : "external-click"}
      data-umami-event-id={id}
    >
      {content}
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
};

export default ResourceOverview;

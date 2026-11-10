import { Link } from "react-router-dom";

const THEME = {
  sand: "#F3EFE4",
  ink: "#2B2420",
};

// Add a new object here to add a new cause card
const CAUSES = [
  {
    title: "Save the Seal Centre",
    organisation: "Zeehondencentrum Pieterburen",
    location: "Netherlands",
    type: "Petition",
    description:
      "The Seal Centre rescues and rehabilitates sick and injured seals from the Wadden Sea, and it is now at risk of bankruptcy. Sign the petition or support them with a donation.",
    image: "/seals.jpg",
    imageAlt: "A young seal resting on the sand",
    url: "https://www.zeehondencentrum.nl/en/red-ons/",
    cta: "Sign the petition",
  },
];

const Causes = () => (
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

      <header className="mt-6">
        <h1
          className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl"
          style={{ color: THEME.ink }}
        >
          Causes that need you
        </h1>
        <p className="mt-2 max-w-xl text-base text-[#8a8278]">
          Animal causes that need signatures and support right now. It only
          takes a minute to help.
        </p>
      </header>

      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CAUSES.map((cause) => (
          <li key={cause.url}>
            <a
              href={cause.url}
              target="_blank"
              rel="noopener noreferrer"
              data-umami-event="cause-click"
              className="group flex h-full flex-col overflow-hidden rounded-2xl border-[1.5px] border-[#2B2420] bg-white transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2B2420] focus-visible:ring-offset-2"
            >
              <img
                src={cause.image}
                alt={cause.imageAlt}
                className="aspect-[4/3] w-full border-b-[1.5px] border-[#2B2420] object-cover"
              />
              <div className="flex flex-1 flex-col p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-[#2B2420] bg-[#FF85B3] px-2.5 py-0.5 text-xs font-semibold text-[#2B2420]">
                    {cause.type}
                  </span>
                  <span className="rounded-full border border-[#2B2420] px-2.5 py-0.5 text-xs font-medium text-[#2B2420]">
                    {cause.location}
                  </span>
                </div>
                <h2
                  className="mt-3 text-lg font-semibold leading-snug"
                  style={{ color: THEME.ink }}
                >
                  {cause.title}
                </h2>
                <p className="mt-1 text-sm text-[#8a8278]">
                  {cause.organisation}
                </p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-[#6b6359]">
                  {cause.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 self-start rounded-full border-[1.5px] border-[#2B2420] px-4 py-2 text-sm font-medium text-[#2B2420] transition-colors group-hover:bg-[#2B2420] group-hover:text-white">
                  {cause.cta}
                  <span
                    aria-hidden="true"
                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  >
                    ↗
                  </span>
                </span>
              </div>
            </a>
          </li>
        ))}

        <li className="flex items-center justify-center rounded-2xl border-[1.5px] border-dashed border-[#c4bdb1] p-6 text-center">
          <p className="text-sm text-[#8a8278]">More causes coming soon</p>
        </li>
      </ul>
    </div>
  </div>
);

export default Causes;

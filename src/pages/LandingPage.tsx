import { useState, type FormEvent } from "react";

// Server function that adds the email to Kit (keeps the API key private)
const SUBSCRIBE_URL = "/.netlify/functions/subscribe";

// Collage image: put your photo grid in /public as collage.jpg
const COLLAGE_SRC = "/hero img.png";

const COLORS = {
  sand: "#F3EFE4",
  bark: "#4A3A2E",
  sage: "#9AA77C",
};

const CAUSES = [
  {
    title: "Save the Seal Centre",
    organisation: "Zeehondencentrum Pieterburen",
    location: "Netherlands",
    description:
      "The Seal Centre rescues and rehabilitates sick and injured seals from the Wadden Sea, and it is now at risk of bankruptcy. Sign the petition or support them with a donation.",
    image: "seals.jpg",
    imageAlt: "A young seal resting on the sand",
    url: "https://www.zeehondencentrum.nl/en/red-ons/",
    cta: "Sign the petition",
  },
];

type Status = "idle" | "loading" | "done" | "error";

const LandingPage = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch(SUBSCRIBE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Subscribe failed");
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
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

      {/* HERO */}
      <header className="mx-auto max-w-4xl px-6 pb-14 pt-10">
        <h1
          className="text-5xl leading-tight sm:text-6xl"
          style={{ fontFamily: "'Fraunces', serif", color: COLORS.bark }}
        >
          Learn &amp; Help Animals
        </h1>

        <p className="mt-2 text-base text-[#8a8278]">
          Learn about animals, from zoology to behaviour and welfare, and help
          the causes that protect them. <span aria-hidden="true">🦍 🐬 🦎</span>
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          {status === "done" ? (
            <p className="text-sm" style={{ color: COLORS.bark }}>
              Thank you, you're on the list!
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex w-full max-w-sm items-center rounded-lg border border-[#d6d1c7] bg-white p-1"
            >
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm outline-none"
                style={{ color: COLORS.bark }}
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="rounded-md px-3 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-85 disabled:opacity-60"
                style={{ backgroundColor: COLORS.sage }}
              >
                {status === "loading" ? "Sending…" : "Subscribe"}
              </button>
            </form>
          )}

          {status !== "done" && (
            <p className="max-w-[220px] text-xs" style={{ color: COLORS.bark }}>
              Get notified when study resources and new features go live!
            </p>
          )}
        </div>

        {status === "error" && (
          <p className="mt-3 text-xs text-red-700">
            Something went wrong. Please try again.
          </p>
        )}
      </header>

      {/* ABOUT */}
      <section style={{ backgroundColor: COLORS.bark }}>
        <div className="mx-auto grid max-w-5xl items-center gap-8 px-6 py-12 md:grid-cols-2">
          <img
            src={COLLAGE_SRC}
            alt="Photo collage of animals: a gorilla, a kitten, deer, a lemur, a marmoset and the sea"
            className="w-full rounded-md"
          />

          <div className="space-y-5 text-sm leading-relaxed text-[#F3EFE4]">
            <p>
              Hi, my name is Marina. I'm building this platform so anyone can
              learn about animals (zoology, behaviour, welfare) while I do the
              same, and support different animal causes along the way.
            </p>
            <p>
              <strong>Why?</strong> I did a bachelor's degree in languages and
              now work full-time in tech. That didn't allow me to pursue formal
              education in zoology or animal sciences, both because of time
              constraints and because my background doesn't meet most programs'
              entry requirements. That's why I started taking courses online and
              volunteering in real life, so I could build my animal knowledge on
              my own.
            </p>
            <p>
              <strong>What is this platform about?</strong> I want to gather
              that knowledge in one structured, organised place where anyone can
              go to learn, instead of having to enrol in a thousand different
              courses, compare a thousand fees and look through a thousand
              different sites. A bit dramatic, but you get the point. Beyond the
              educational side, I also want to build a way for people to connect
              and offer their support (skills, time, or donations) to different
              animal causes.
            </p>
            <p>
              <strong>How can you join this community?</strong> Sign up to the
              email list above to be the first to know when the study resources
              go live and new features are added. And if you already have some
              knowledge in this space and would like to help create content for
              the socials, that would be veeery welcome. Simply email me at{" "}
              <a
                href="mailto:learnandhelpanimals@gmail.com"
                className="underline underline-offset-2"
              >
                learnandhelpanimals@gmail.com
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      {/* CAUSES */}
      <section id="causes">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <h2
            className="text-3xl sm:text-4xl"
            style={{ fontFamily: "'Fraunces', serif", color: COLORS.bark }}
          >
            Causes that need you
          </h2>
          <p className="mt-2 max-w-xl text-base text-[#8a8278]">
            Animal causes that need signatures and support right now. It only
            takes a minute to help.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CAUSES.map((cause) => (
              <a
                key={cause.url}
                href={cause.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col overflow-hidden rounded-xl border border-[#e2dccf] bg-white transition-transform hover:-translate-y-1"
              >
                <img
                  src={cause.image}
                  alt={cause.imageAlt}
                  className="aspect-[4/3] w-full object-cover"
                />
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <span
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: COLORS.sage }}
                  >
                    {cause.organisation} · {cause.location}
                  </span>
                  <h3
                    className="text-xl"
                    style={{
                      fontFamily: "'Fraunces', serif",
                      color: COLORS.bark,
                    }}
                  >
                    {cause.title}
                  </h3>
                  <p className="flex-1 text-sm leading-relaxed text-[#6b6359]">
                    {cause.description}
                  </p>
                  <span
                    className="mt-2 inline-flex items-center gap-1 text-sm font-semibold"
                    style={{ color: "#2E5E78" }}
                  >
                    {cause.cta}
                    <span
                      aria-hidden="true"
                      className="transition-transform group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

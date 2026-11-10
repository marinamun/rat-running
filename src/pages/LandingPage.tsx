import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import zebraBg from "../assets/zebra3.JPG";
import ImageCarousel, { type Slide } from "../components/ImageCarousel";
import babyElephant from "../assets/babyelephant.JPG";
import butterflies from "../assets/butterflies.JPG";
import elephants from "../assets/elephants11.JPG";
import giraffe from "../assets/giraffe6.JPG";
import hotelRoom from "../assets/hotelroom.JPG";
import ostriches from "../assets/ostrichfarm3.JPG";
import seals from "../assets/seals in cape town3.JPG";
import whales from "../assets/whales20.JPG";
import zebra from "../assets/zebra2.JPG";
import photo5 from "../assets/photo-output (5).jpeg";
import photo10 from "../assets/photo-output (10).jpeg";

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

const PILLARS = [
  {
    tag: "Learn",
    color: "#FFD23F",
    title: "A hub of learning resources",
    text: "The best courses, articles and materials on zoology, animal behaviour and welfare, in one place.",
    cta: "Go to the library",
    to: "/library",
  },
  {
    tag: "Explore",
    color: "#FF8A3D",
    title: "Your wildlife map",
    text: "Photograph animals in the wild, pin them on your own globe and complete collections, like the most observed animals near you.",
    cta: "Open my map",
    to: "/wildlife",
  },
  {
    tag: "Help",
    color: "#FF85B3",
    title: "Causes that need you",
    text: "Petitions to sign, shelters to support and ways to give your time or skills to protect animals.",
    cta: "See the causes",
    to: "#causes",
  },
];

const SLIDES: Slide[] = [
  { src: babyElephant, alt: "A baby elephant", caption: "Baby elephant" },
  { src: elephants, alt: "A herd of elephants", caption: "Elephant herd" },
  { src: giraffe, alt: "A giraffe", caption: "Giraffe" },
  { src: zebra, alt: "A zebra", caption: "Zebra" },
  {
    src: seals,
    alt: "Cape fur seals in Cape Town",
    caption: "Cape fur seals, Cape Town",
  },
  { src: whales, alt: "Whales in the ocean", caption: "Whales" },
  { src: ostriches, alt: "Ostriches", caption: "Ostriches" },
  { src: butterflies, alt: "Butterflies", caption: "Butterflies" },
  {
    src: hotelRoom,
    alt: "Impalas from my hotel room",
    caption: "View from hotel room",
  },
  { src: photo5, alt: "Crowned sifaka", caption: "Crowned sifaka" },
  { src: photo10, alt: "Western gorilla", caption: "Western gorilla" },
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
      {/* HERO */}
      <header
        className="relative bg-cover bg-center px-6 py-20 sm:py-28"
        style={{ backgroundImage: `url(${zebraBg})` }}
      >
        <div className="mx-auto max-w-3xl rounded-2xl border-2 border-white bg-white/60 p-8 backdrop-blur-md sm:p-10">
          <h1
            className="text-5xl leading-tight sm:text-6xl"
            style={{ fontFamily: "'Fraunces', serif", color: COLORS.bark }}
          >
            Learn &amp; Help Animals
          </h1>

          <p className="mt-2 text-base text-[#4A3A2E]">
            Learn about wildlife, collect your sightings and help the causes
            that protect animals. <span aria-hidden="true">🦍 🐬 🦎</span>
          </p>

          {/* MAIN BUTTONS */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/library"
              data-umami-event="library-button"
              className="group inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-[#2B2420] bg-white px-5 py-2.5 text-sm font-medium text-[#2B2420] transition-colors hover:bg-[#2B2420] hover:text-white"
            >
              Go to the library
              <span
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
            <Link
              to="/wildlife"
              data-umami-event="wildlife-button"
              className="group inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-[#2B2420] bg-white px-5 py-2.5 text-sm font-medium text-[#2B2420] transition-colors hover:bg-[#2B2420] hover:text-white"
            >
              Explore your wildlife map
              <span
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* LEARN · EXPLORE · HELP */}
      <section className="mx-auto max-w-5xl px-6 pb-14">
        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-14">
          {" "}
          {PILLARS.map((p) => {
            const cardClass =
              "group flex flex-col rounded-2xl border-[1.5px] border-[#2B2420] bg-white p-6 transition-transform hover:-translate-y-0.5";
            const content = (
              <>
                <span
                  className="self-start rounded-full border border-[#2B2420] px-2.5 py-0.5 text-xs font-semibold text-[#2B2420]"
                  style={{ backgroundColor: p.color }}
                >
                  {p.tag}
                </span>
                <h2
                  className="mt-4 text-2xl leading-snug"
                  style={{
                    fontFamily: "'Fraunces', serif",
                    color: COLORS.bark,
                  }}
                >
                  {p.title}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[#6b6359]">
                  {p.text}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 self-start rounded-full border-[1.5px] border-[#2B2420] px-4 py-2 text-sm font-medium text-[#2B2420] transition-colors group-hover:bg-[#2B2420] group-hover:text-white">
                  {p.cta}
                  <span
                    aria-hidden="true"
                    className="transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>
                </span>
              </>
            );
            return p.to.startsWith("#") ? (
              <a key={p.tag} href={p.to} className={cardClass}>
                {content}
              </a>
            ) : (
              <Link key={p.tag} to={p.to} className={cardClass}>
                {content}
              </Link>
            );
          })}
        </div>
      </section>

      {/* ABOUT */}
      {/* WHY THIS PLATFORM */}
      <section className="mx-auto max-w-5xl px-6 py-14">
        <div className="grid items-center gap-8 md:grid-cols-5">
          <div className="md:col-span-3">
            <ImageCarousel slides={SLIDES} />
          </div>

          <div
            className="md:col-span-2"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            <span className="rounded-full border border-[#2B2420] bg-white px-2.5 py-0.5 text-xs font-semibold text-[#2B2420]">
              Why this platform
            </span>
            <h2 className="mt-3 text-2xl font-semibold leading-snug text-[#2B2420] sm:text-3xl">
              Learn, explore and protect wildlife
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#6b6359]">
              Learn & Help Animals is a central hub for animal learning
              resources. Explore trusted courses and materials on zoology,
              behaviour and welfare, build your own wildlife photography
              collection on an interactive map, and support the causes working
              to protect animals.
            </p>
          </div>
        </div>
      </section>

      {/* EMAIL SIGN-UP */}
      <section className="mx-auto max-w-5xl px-6 py-14">
        <div className="flex flex-col gap-6 rounded-2xl border-[1.5px] border-[#2B2420] bg-white p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <h2
              className="text-xl font-semibold"
              style={{ fontFamily: "'Poppins', sans-serif", color: "#2B2420" }}
            >
              Stay in the loop
            </h2>
            <p className="mt-1 max-w-md text-sm text-[#6b6359]">
              Get notified when new study resources, causes and features go
              live.
            </p>
          </div>

          <div className="w-full sm:max-w-sm">
            {status === "done" ? (
              <p className="text-sm font-medium text-[#2B2420]">
                Thank you, you're on the list!
              </p>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex items-center gap-2 rounded-full border-[1.5px] border-[#2B2420] bg-white p-1"
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
                  placeholder="Your email"
                  className="min-w-0 flex-1 bg-transparent px-4 py-2 text-sm text-[#2B2420] outline-none"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="rounded-full border-[1.5px] border-[#2B2420] bg-[#FFD23F] px-4 py-2 text-sm font-medium text-[#2B2420] transition-colors hover:bg-[#2B2420] hover:text-white disabled:opacity-50"
                >
                  {status === "loading" ? "Sending…" : "Subscribe"}
                </button>
              </form>
            )}
            {status === "error" && (
              <p className="mt-2 text-xs text-red-700">
                Something went wrong. Please try again.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

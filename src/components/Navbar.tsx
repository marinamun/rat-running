import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

const COLORS = {
  ink: "#2B2420",
  muted: "#8a8278",
};

// Small line icons (inherit text color)
const Icon = ({ children }: { children: ReactNode }) => (
  <svg
    viewBox="0 0 24 24"
    className="block h-4 w-4 shrink-0"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const LINKS = [
  {
    to: "/",
    label: "Home",
    icon: (
      <Icon>
        <path d="M3 11l9-7 9 7" />
        <path d="M5 10v10h14V10" />
      </Icon>
    ),
  },
  {
    to: "/library",
    label: "Library",
    icon: (
      <Icon>
        <path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2z" />
        <path d="M4 21V5" />
      </Icon>
    ),
  },
  {
    to: "/wildlife",
    label: "Map",
    icon: (
      <Icon>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" />
      </Icon>
    ),
  },
  {
    to: "/causes",
    label: "Causes",
    icon: (
      <Icon>
        <path d="M12 20s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.5-7 10-7 10z" />
      </Icon>
    ),
  },
];

// Shared link layout: icon and text centred on the same line
const LINK_BASE =
  "relative z-10 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium leading-none transition-colors duration-200";

export default function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Sliding highlight behind the active link
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [pill, setPill] = useState<{ left: number; width: number } | null>(
    null,
  );

  const activeTo =
    LINKS.slice()
      .sort((a, b) => b.to.length - a.to.length)
      .find((l) =>
        l.to === "/"
          ? location.pathname === "/"
          : location.pathname.startsWith(l.to),
      )?.to ?? null;

  useLayoutEffect(() => {
    const measure = () => {
      const el = activeTo ? linkRefs.current[activeTo] : null;
      setPill(el ? { left: el.offsetLeft, width: el.offsetWidth } : null);
    };
    measure();
    // Re-measure once the font has loaded (text width changes)
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [activeTo]);

  // Soft shadow once the page scrolls
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on navigation
  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header
      className={`sticky top-0 z-50 border-b-[1.5px] border-[#2B2420] bg-white transition-shadow duration-300 ${
        scrolled ? "shadow-[0_6px_20px_rgba(43,36,32,0.10)]" : "shadow-none"
      }`}
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* Load Poppins here, so the navbar looks the same on every page */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');`}</style>

      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link to="/" className="group flex items-center gap-2.5 pr-3">
          <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-[1.5px] border-[#2B2420] bg-white transition-transform duration-300 group-hover:rotate-[-8deg] group-hover:scale-105">
            <img
              src="/logo.png"
              alt="Learn & Help Animals"
              className="h-9 w-9 object-contain"
            />
          </span>
          <span className="hidden flex-col leading-tight sm:flex">
            <span
              className="text-[15px] font-semibold tracking-tight"
              style={{ color: COLORS.ink }}
            >
              Learn &amp; Help Animals
            </span>
            <span
              className="text-[11px] font-medium uppercase tracking-[0.18em]"
              style={{ color: COLORS.muted }}
            >
              learn · spot · help
            </span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="relative hidden items-center gap-1 md:flex">
          {pill && (
            <span
              aria-hidden="true"
              className="absolute top-0 h-full rounded-full transition-all duration-300 ease-out"
              style={{
                left: pill.left,
                width: pill.width,
                backgroundColor: COLORS.ink,
              }}
            />
          )}
          {LINKS.map((l) => {
            const active = l.to === activeTo;
            return (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                ref={(el) => {
                  linkRefs.current[l.to] = el;
                }}
                className={`${LINK_BASE} ${
                  active
                    ? "text-white"
                    : "text-[#2B2420] hover:bg-[#2B2420]/[0.06]"
                }`}
              >
                {l.icon}
                <span>{l.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-[#2B2420]/[0.06] md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span
            className={`absolute h-0.5 w-5 rounded-full bg-[#2B2420] transition-transform duration-300 ${
              open ? "rotate-45" : "-translate-y-1.5"
            }`}
          />
          <span
            className={`absolute h-0.5 w-5 rounded-full bg-[#2B2420] transition-opacity duration-200 ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`absolute h-0.5 w-5 rounded-full bg-[#2B2420] transition-transform duration-300 ${
              open ? "-rotate-45" : "translate-y-1.5"
            }`}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden bg-white transition-all duration-300 md:hidden ${
          open
            ? "max-h-80 border-t border-[#e2dccf] opacity-100"
            : "pointer-events-none max-h-0 opacity-0"
        }`}
      >
        <div className="mx-auto flex max-w-5xl flex-col gap-1 px-4 py-3">
          {LINKS.map((l) => {
            const active = l.to === activeTo;
            return (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium leading-none transition-colors ${
                  active
                    ? "bg-[#2B2420] text-white"
                    : "text-[#2B2420] hover:bg-[#2B2420]/[0.06]"
                }`}
              >
                {l.icon}
                <span>{l.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </header>
  );
}

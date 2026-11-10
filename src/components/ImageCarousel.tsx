import { useCallback, useEffect, useState } from "react";

export type Slide = { src: string; alt: string; caption?: string };

type Props = {
  slides: Slide[];
  interval?: number; // ms between slides
};

// Crossfading image carousel with a slow zoom on the active photo.
// Auto-plays, pauses on hover/focus, and respects "reduce motion" settings.
const ImageCarousel = ({ slides, interval = 5500 }: Props) => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const count = slides.length;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const go = useCallback(
    (i: number) => setIndex(((i % count) + count) % count),
    [count],
  );
  const next = useCallback(() => go(index + 1), [go, index]);
  const prev = useCallback(() => go(index - 1), [go, index]);

  // Auto-play
  useEffect(() => {
    if (paused || reduceMotion || count < 2) return;
    const timer = setTimeout(next, interval);
    return () => clearTimeout(timer);
  }, [index, paused, reduceMotion, count, interval, next]);

  // Only keep the previous, current and next photos loaded
  const isMounted = (i: number) =>
    i === index ||
    i === (index + 1) % count ||
    i === (index - 1 + count) % count;

  const current = slides[index];

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Wildlife photos"
      className="group relative overflow-hidden rounded-2xl border-[1.5px] border-[#2B2420] bg-[#2B2420]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") next();
        if (e.key === "ArrowLeft") prev();
      }}
    >
      {/* Photos */}
      <div className="relative aspect-[4/3] w-full sm:aspect-[16/10]">
        {slides.map((s, i) =>
          isMounted(i) ? (
            <img
              key={s.src}
              src={s.src}
              alt={i === index ? s.alt : ""}
              aria-hidden={i !== index}
              loading={i === 0 ? "eager" : "lazy"}
              className="absolute inset-0 h-full w-full object-cover"
              style={{
                opacity: i === index ? 1 : 0,
                transform:
                  i === index && !reduceMotion ? "scale(1.08)" : "scale(1)",
                transition: reduceMotion
                  ? "opacity 0.3s ease"
                  : `opacity 1.2s ease, transform ${interval + 1500}ms ease-out`,
              }}
            />
          ) : null,
        )}

        {/* Soft gradient so the caption and dots stay readable */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/50 to-transparent" />

        {current?.caption && (
          <p
            key={current.src}
            aria-live="polite"
            className="absolute bottom-10 left-5 right-24 text-sm font-medium text-white"
          >
            {current.caption}
          </p>
        )}
      </div>

      {/* Previous / next */}
      {count > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous photo"
            className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border-[1.5px] border-[#2B2420] bg-white text-[#2B2420] opacity-90 transition-colors hover:bg-[#2B2420] hover:text-white sm:opacity-0 sm:group-hover:opacity-90 sm:focus-visible:opacity-90"
          >
            ←
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next photo"
            className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border-[1.5px] border-[#2B2420] bg-white text-[#2B2420] opacity-90 transition-colors hover:bg-[#2B2420] hover:text-white sm:opacity-0 sm:group-hover:opacity-90 sm:focus-visible:opacity-90"
          >
            →
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
            {slides.map((s, i) => (
              <button
                key={s.src}
                type="button"
                onClick={() => go(i)}
                aria-label={`Show photo ${i + 1} of ${count}`}
                aria-current={i === index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === index
                    ? "w-6 bg-white"
                    : "w-2 bg-white/60 hover:bg-white/90"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ImageCarousel;

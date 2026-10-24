import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Reveal from "@/components/Reveal";

const EASE = [0.23, 1, 0.32, 1];
const GUTTER = "px-[clamp(16px,4vw,64px)]";
const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

// The amenities as a walk up the tower: each space fills the screen and its text scrolls over
// it, so you read about the pool while standing at it. The photos sit in one pinned layer and
// crossfade as each note crosses the middle of the screen; nothing pans sideways, so the page
// never stops scrolling the way the reader is scrolling.
export default function Spaces({ items, name }) {
  const [active, setActive] = useState(0);
  // a photo loads once the reader is one space away from it, then stays
  const [reach, setReach] = useState(1);
  const cards = useRef([]);

  // grouped by floor, in the order the brochure walks them
  const floors = [];
  items.forEach((s, i) => {
    const key = s.area ?? "Arrival";
    if (floors.at(-1)?.key !== key) floors.push({ key, first: i, spaces: [] });
    floors.at(-1).spaces.push(i);
  });
  const floor = floors.findLast((f) => f.first <= active);

  useEffect(() => {
    // the card crossing the middle of the screen owns the background
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number(e.target.dataset.bg));
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );
    cards.current.forEach((n) => n && io.observe(n));
    return () => io.disconnect();
  }, []);

  useEffect(() => setReach((r) => Math.max(r, active + 1)), [active]);

  const card = (i) => (n) => void (cards.current[i] = n);
  const jump = (i) => document.getElementById(`space-${i}`)?.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "center" });
  let k = 0; // card index, for the observer

  return (
    <section aria-labelledby="spaces" data-tone="dark" className="relative bg-navy-deep text-paper">
      <div className="sticky top-0 h-svh overflow-hidden">
        {items.map(
          (s, i) =>
            i <= reach && (
              <img
                key={s.src}
                src={s.src}
                alt=""
                loading="lazy"
                decoding="async"
                className={`absolute inset-0 size-full object-cover transition-[opacity,scale] ease-(--ease-out-strong) motion-reduce:transition-none ${
                  i === active ? "scale-100 opacity-100 [transition-duration:800ms,1800ms]" : "scale-[1.06] opacity-0 [transition-duration:700ms,900ms]"
                }`}
                style={{ objectPosition: s.pos }}
              />
            )
        )}
        {/* the text side darkens: the foot of the screen on phones, the left on wider screens */}
        <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-navy-deep/95 via-navy-deep/65 via-50% to-navy-deep/10 md:bg-linear-to-r md:from-navy-deep/90 md:via-navy-deep/40 md:via-40% md:to-transparent md:to-70%" />
        <div aria-hidden="true" className="absolute inset-y-0 right-0 hidden w-[22vw] bg-linear-to-l from-navy-deep/60 to-transparent md:block" />

        {/* where in the tower you are, like the display over a lift door; a tick per space */}
        <nav aria-label="Spaces" className="absolute top-1/2 right-[clamp(16px,4vw,64px)] hidden -translate-y-1/2 flex-col items-end gap-6 md:flex">
          <div className="text-right">
            <div className="font-display h-[clamp(3rem,5vw,4.5rem)] overflow-hidden text-[clamp(3rem,5vw,4.5rem)] leading-none tabular-nums">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={floor.key}
                  className="block"
                  initial={{ transform: "translateY(100%)" }}
                  animate={{ transform: "translateY(0%)" }}
                  exit={{ transform: "translateY(-100%)" }}
                  transition={{ duration: 0.6, ease: EASE }}
                >
                  {parseInt(floor.key) || "L"}
                </motion.span>
              </AnimatePresence>
            </div>
            <p className="font-inscription mt-2 text-[0.62rem] tracking-[0.26em] text-champagne uppercase">{floor.key}</p>
          </div>
          <ol className="flex flex-col items-end gap-4">
            {floors.map((f) => (
              <li key={f.key} className="flex flex-col items-end gap-1.5">
                {f.spaces.map((i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => jump(i)}
                    aria-label={items[i].name}
                    aria-current={i === active ? "location" : undefined}
                    className="group flex h-3 items-center"
                  >
                    <span
                      className={`block h-[1.5px] origin-right transition-[width,background-color] duration-300 ease-(--ease-out-strong) ${
                        i === active ? "w-9 bg-gold" : i < active ? "w-4 bg-paper/80 group-hover:w-6" : "w-4 bg-paper/45 group-hover:w-6"
                      }`}
                    />
                  </button>
                ))}
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {/* the text rides over the pinned photos; only the words take the pointer, so the rail stays clickable */}
      <div className="pointer-events-none relative -mt-[100svh]">
        <div ref={card(k++)} data-bg={0} className={`flex min-h-svh items-end pb-[16svh] md:items-center md:pb-0 ${GUTTER}`}>
          <Reveal className="pointer-events-auto max-w-[36rem]">
            <p data-rise className="font-inscription text-[0.72rem] tracking-[0.3em] text-champagne uppercase">
              {name}
            </p>
            <h3 id="spaces" data-split className="font-display mt-4 text-[clamp(3rem,8vw,7.5rem)] leading-[0.92] tracking-[-0.03em]">
              Spaces
            </h3>
            <p data-rise className="mt-6 max-w-[34ch] text-[clamp(1rem,1.3vw,1.2rem)] leading-relaxed text-paper/85">
              Japanese-inspired amenities from the lobby to the thirty-seventh floor. Scroll to walk up through them.
            </p>
          </Reveal>
        </div>

        {floors.map((f) => (
          <div key={f.key}>
            {f.key !== "Arrival" && (
              <div ref={card(k++)} data-bg={f.first} className={`flex min-h-[70svh] items-center ${GUTTER}`}>
                <Reveal className="pointer-events-auto">
                  <p data-rise className="font-inscription text-[0.72rem] tracking-[0.3em] text-champagne uppercase">
                    Amenities
                  </p>
                  <p data-split className="font-display mt-3 text-[clamp(3.4rem,10vw,9rem)] leading-[0.9] tracking-[-0.03em]">
                    {f.key}
                  </p>
                </Reveal>
              </div>
            )}
            {f.spaces.map((i) => {
              const s = items[i];
              return (
                <article key={s.src} id={`space-${i}`} ref={card(k++)} data-bg={i} className={`flex min-h-svh items-end pb-[14svh] md:items-center md:pb-0 ${GUTTER}`}>
                  <Reveal className="pointer-events-auto max-w-[34rem]">
                    <p data-rise className="font-inscription flex items-center gap-3 text-[0.68rem] tracking-[0.28em] text-champagne uppercase tabular-nums">
                      <span>{String(i + 1).padStart(2, "0")}</span>
                      <span className="h-px w-8 bg-gold" />
                      <span>{s.area ?? "Arrival"}</span>
                    </p>
                    <h4 data-split className="font-display mt-4 text-[clamp(2.6rem,6vw,5.6rem)] leading-[0.95] tracking-[-0.02em]">
                      {s.name}
                    </h4>
                    {s.note && (
                      <p data-rise className="mt-5 max-w-[36ch] text-[clamp(1rem,1.25vw,1.15rem)] leading-relaxed text-paper/85">
                        {s.note}
                      </p>
                    )}
                    {s.list && (
                      <ul className="mt-7 max-w-[24rem] border-t border-paper/20">
                        {s.list.map((t) => (
                          <li key={t} data-rise className="flex items-center gap-3 border-b border-paper/15 py-2.5 text-[0.95rem] text-paper/90">
                            <span className="size-1 rounded-full bg-gold" />
                            {t}
                          </li>
                        ))}
                      </ul>
                    )}
                  </Reveal>
                </article>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}

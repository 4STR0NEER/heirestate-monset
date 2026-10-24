import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import { useInView } from "motion/react";
import Reveal from "@/components/Reveal";

const GUTTER = "px-[clamp(16px,4vw,64px)]";
const RINGS = [1, 3, 6, 12]; // km
const KINDS = [
  ["Shopping", "Shopping"],
  ["Healthcare", "Healthcare"],
  ["Everyday", "School, club and church"],
  ["Travel", "Getting away"],
];
const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const dist = (km) => (km < 1 ? `${Math.round(km * 1000)} m` : `${km} km`);

// What is near, as a set of tiles: the nearest door, how much lies within each ring of distance
// (drawn as ripples spreading from the tower), and every place grouped by what it is for.
export default function Nearby({ places, name, line, onBook }) {
  const root = useRef(null);
  const inView = useInView(root, { once: true, margin: "-120px" });
  const [nearest] = [...places].sort((a, b) => a[1] - b[1]);
  const within = RINGS.map((r) => places.filter(([, km]) => km <= r).length);

  // the ripples spread out one after another, then the bars draw in, nearest first
  useEffect(() => {
    if (!inView) return;
    const rings = root.current.querySelectorAll("[data-ring]");
    const bars = root.current.querySelectorAll("[data-bar]");
    if (reduced()) return void bars.forEach((n) => (n.style.transform = "none"));
    const a = animate(rings, { scale: [0.55, 1], opacity: [0, 1], duration: 1400, delay: stagger(160), ease: "out(3)" });
    const b = animate(bars, { scaleX: [0, 1], duration: 1100, delay: stagger(50, { start: 300 }), ease: "out(4)" });
    return () => (a.pause(), b.pause());
  }, [inView]);

  return (
    <section ref={root} aria-labelledby="nearby-title" className={`mx-auto max-w-[1440px] py-[clamp(88px,14vh,160px)] ${GUTTER}`}>
      <Reveal className="max-w-[44rem]">
        <p data-rise className="font-display text-[1.15rem] text-gold-ink italic">
          Location
        </p>
        <h2 id="nearby-title" data-split className="font-display mt-3 text-[clamp(2.6rem,5vw,4.6rem)] leading-[0.95] tracking-[-0.02em] text-ink">
          Within reach
        </h2>
      </Reveal>

      <div className="mt-12 grid gap-3 md:grid-cols-4 md:gap-4">
        {/* the nearest door */}
        <div className="flex min-h-[18rem] flex-col justify-between rounded-[6px] bg-navy-deep p-[clamp(20px,2.4vw,32px)] text-paper md:col-span-2">
          <p className="font-display text-[1.05rem] text-champagne italic">Nearest</p>
          <div>
            <p className="font-display text-[clamp(4.5rem,10vw,8.5rem)] leading-[0.85] tracking-[-0.04em] tabular-nums">{dist(nearest[1])}</p>
            <p className="mt-4 text-[1.1rem]">to {nearest[0]}</p>
            {line && <p className="mt-3 max-w-[44ch] text-[0.95rem] leading-relaxed text-paper/70">{line}</p>}
          </div>
        </div>

        {/* how much lies within each ring, as ripples spreading from the tower */}
        <div className="grid min-h-[18rem] grid-cols-[minmax(0,1fr)_auto] items-center gap-6 rounded-[6px] bg-stone p-[clamp(20px,2.4vw,32px)] md:col-span-2">
          <div className="relative mx-auto aspect-square w-full max-w-[17rem]">
            {RINGS.map((r, i) => (
              <span
                key={r}
                data-ring
                aria-hidden="true"
                className="absolute rounded-full border border-navy/30 bg-navy/[0.04]"
                style={{ inset: `${(1 - (i + 1) / RINGS.length) * 50}%` }}
              />
            ))}
            <span aria-hidden="true" className="ripple absolute inset-[37.5%] rounded-full border border-gold" />
            <span className="absolute top-1/2 left-1/2 grid size-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-navy-deep text-paper shadow-note">
              <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true">
                <path d="M4 14V4l4-2v12M8 14V5l4 1.5V14M2.5 14h11" fill="none" stroke="currentColor" strokeWidth="1.1" />
              </svg>
            </span>
          </div>
          <dl className="space-y-3">
            {RINGS.map((r, i) => (
              <div key={r} className="flex items-baseline gap-3">
                <dt className="w-14 text-[0.9rem] text-ink/60">{r} km</dt>
                <dd className="font-display text-[1.6rem] leading-none text-ink tabular-nums">
                  {within[i]}
                  <span className="ml-2 font-body text-[0.85rem] text-ink/60">{within[i] === 1 ? "place" : "places"}</span>
                </dd>
              </div>
            ))}
          </dl>
          <p className="col-span-2 text-[0.85rem] text-ink/55">Rings by distance from {name}, not by direction.</p>
        </div>

        {/* every place, grouped by what it is for */}
        {KINDS.map(([kind, title]) => {
          const list = places.filter(([, , k]) => k === kind).sort((a, b) => a[1] - b[1]);
          if (!list.length) return null;
          const max = Math.max(...list.map(([, km]) => km));
          return (
            <div key={kind} className="rounded-[6px] border border-ink/12 bg-paper p-[clamp(18px,2vw,26px)]">
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center rounded-full bg-stone text-navy">
                  <Icon kind={kind} />
                </span>
                <h3 className="text-ink">{title}</h3>
              </div>
              <ul className="mt-5 space-y-4">
                {list.map(([place, km]) => (
                  <li key={place}>
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="min-w-0 text-[0.95rem] text-ink/80">{place}</span>
                      <span className="font-display shrink-0 text-[1.1rem] text-ink tabular-nums">{dist(km)}</span>
                    </div>
                    <span className="mt-1.5 block h-px bg-ink/10">
                      <span data-bar className="block h-px origin-left bg-gold" style={{ width: `${(km / max) * 100}%`, transform: "scaleX(0)" }} />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {onBook && (
        <div className="mt-14 flex flex-wrap items-center justify-between gap-6 border-t border-ink/15 pt-8">
          <p className="font-display max-w-[30ch] text-[clamp(1.3rem,2vw,1.7rem)] leading-snug text-ink">See the neighbourhood, and the dress-up units, for yourself.</p>
          <button
            type="button"
            onClick={onBook}
            className="rounded-full bg-(--accent) px-6 py-3.5 text-paper transition-[background-color,transform] duration-200 hover:bg-ink active:scale-[0.97] motion-reduce:transform-none"
          >
            Arrange a visit
          </button>
        </div>
      )}
    </section>
  );
}

// one line icon per kind of place, drawn on a 20 grid
function Icon({ kind }) {
  const d = {
    Shopping: "M5 7h10l-1 10H6zM7.5 7V5.5a2.5 2.5 0 015 0V7",
    Healthcare: "M8 3h4v5h5v4h-5v5H8v-5H3V8h5z",
    Everyday: "M3 17h14M4.5 17V8.5L10 4l5.5 4.5V17M8 17v-4.5h4V17",
    Travel: "M2.5 11.5l15-5-3.5 9-3-3.5-4 2 .5-3.5zM11 12l6.5-5.5",
  }[kind];
  return (
    <svg viewBox="0 0 20 20" className="size-[18px]" aria-hidden="true">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

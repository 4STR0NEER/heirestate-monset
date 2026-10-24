import { useEffect, useRef, useState } from "react";
import { animate, stagger } from "animejs";
import { AnimatePresence, motion, useInView, useSpring } from "motion/react";
import Reveal from "@/components/Reveal";
import { inPlace, siteUrl } from "@/lib/links";
import { order, projects, showcase } from "@/projects";

const GUTTER = "px-[clamp(16px,4vw,64px)]";
const EASE = [0.23, 1, 0.32, 1];
const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const fact = (p, label) => p.facts.find(([k]) => k === label)?.[1];

// The collection as an index, like the contents page of a prospectus: a row to each project with
// where it is and how many homes, its picture held up beside the pointer as you run down the
// list (after VengeanceUI's ImageRevealList, here following the pointer on a spring), and a few
// figures across the foot that count up from the projects' own facts.
export default function Collection({ onOpen, onSection }) {
  const root = useRef(null);
  const figures = useRef(null);
  const [hover, setHover] = useState(null);
  const x = useSpring(0, { stiffness: 220, damping: 26, mass: 0.6 });
  const y = useSpring(0, { stiffness: 220, damping: 26, mass: 0.6 });
  const inView = useInView(root, { amount: 0.3 });
  const counted = useInView(figures, { once: true, amount: 0.6 });

  useEffect(() => {
    if (inView) onSection?.("top");
  }, [inView, onSection]);

  // homes across the towers that state them, and the windows still shuttered
  const homes = order.map((id) => parseInt(fact(projects[id], "Residences")?.replace(/,/g, "") ?? "", 10)).filter(Boolean);
  const stats = [
    [order.length, "Projects open now"],
    [homes.reduce((a, b) => a + b, 0), `Homes across ${homes.length === 2 ? "two" : homes.length} towers`],
    [showcase.filter((s) => s === "soon").length, "More, forthcoming"],
  ];

  useEffect(() => {
    if (!counted || reduced()) return;
    const els = [...figures.current.querySelectorAll("[data-count]")];
    const fmt = new Intl.NumberFormat("en-PH");
    const runs = els.map((n, i) => {
      const v = { n: 0 };
      return animate(v, { n: Number(n.dataset.count), duration: 1300, delay: i * 120, ease: "out(4)", onUpdate: () => (n.textContent = fmt.format(Math.round(v.n))) });
    });
    const lines = animate(figures.current.querySelectorAll("[data-rule]"), { scaleX: [0, 1], duration: 900, delay: stagger(120), ease: "out(3)" });
    return () => (runs.forEach((r) => r.pause()), lines.pause());
  }, [counted]);

  const move = (e) => {
    x.set(e.clientX);
    y.set(e.clientY);
  };

  return (
    <section ref={root} aria-labelledby="collection-title" className="relative">
      <div className={`mx-auto max-w-[1480px] py-[clamp(88px,14vh,160px)] ${GUTTER}`}>
        <div className="grid gap-x-20 gap-y-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-end">
          <Reveal>
            <p data-rise className="font-display text-[1.15rem] text-gold-ink italic">
              Three projects, open now
            </p>
            <h2 id="collection-title" data-split className="font-display mt-3 text-[clamp(2.8rem,6vw,5.6rem)] leading-[0.92] tracking-[-0.03em] text-ink">
              The collection
            </h2>
          </Reveal>
          <p className="max-w-[44ch] text-ink/70 md:justify-self-end">
            Each has a site of its own: its films, its floor plans, its amenities, and a way to arrange a viewing.
          </p>
        </div>

        <ol className="mt-12 border-t border-ink/15" onPointerMove={move} onPointerLeave={() => setHover(null)}>
          {order.map((id, i) => {
            const p = projects[id];
            const place = fact(p, "Location");
            const homesHere = fact(p, "Residences")?.split(",")[0];
            return (
              <li key={id}>
                <a
                  href={siteUrl(id)}
                  onClick={inPlace((e) => onOpen(id, e.currentTarget.getBoundingClientRect()))}
                  onPointerEnter={(e) => (move(e), setHover(id))}
                  onFocus={() => setHover(null)}
                  className="group relative grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-x-6 gap-y-2 border-b border-ink/15 py-[clamp(20px,3vw,36px)] md:grid-cols-[4rem_minmax(0,1.2fr)_minmax(0,1fr)_9rem_3rem]"
                  style={{ "--accent": p.accent }}
                >
                  {/* a rule in the project's colour draws across under the row it is on */}
                  <span aria-hidden="true" className="absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-(--accent) transition-transform duration-500 ease-(--ease-out-strong) group-hover:scale-x-100 group-focus-visible:scale-x-100" />
                  <span className="text-[0.9rem] text-ink/50 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <span className="min-w-0 transition-transform duration-500 ease-(--ease-out-strong) group-hover:translate-x-2 motion-reduce:transform-none">
                    <span className="flex items-center gap-3">
                      <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full bg-(--accent)" />
                      <span className="font-display text-[clamp(2rem,4.4vw,4rem)] leading-none tracking-[-0.02em] text-ink">{p.name}</span>
                    </span>
                    <span className="font-display mt-2 block text-[1.05rem] text-gold-ink italic">{p.tagline}</span>
                  </span>
                  <span className="col-span-3 col-start-2 text-ink/70 md:col-span-1 md:col-start-auto">{place ?? ""}</span>
                  <span className="hidden text-ink/70 tabular-nums md:block">{homesHere ?? ""}</span>
                  <span className="col-start-3 row-start-1 grid size-11 place-items-center justify-self-end rounded-full border border-ink/20 text-ink transition-[background-color,color,border-color] duration-300 group-hover:border-(--accent) group-hover:bg-(--accent) group-hover:text-paper md:col-start-auto md:row-start-auto">
                    <svg viewBox="0 0 24 10" className="w-5" aria-hidden="true">
                      <path d="M0 5h22M18 1l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.3" />
                    </svg>
                  </span>
                </a>
              </li>
            );
          })}
        </ol>

        {/* the figures, from the projects themselves */}
        <dl ref={figures} className="mt-[clamp(56px,9vh,96px)] grid gap-y-8 sm:grid-cols-3 sm:gap-x-10">
          {stats.map(([n, label]) => (
            <div key={label} className="relative pt-5">
              <span data-rule aria-hidden="true" className="absolute inset-x-0 top-0 h-px origin-left bg-gold" />
              <dt className="sr-only">{label}</dt>
              <dd className="font-display text-[clamp(3rem,6vw,5.4rem)] leading-none tracking-[-0.03em] text-ink tabular-nums" data-count={n}>
                {new Intl.NumberFormat("en-PH").format(n)}
              </dd>
              <p aria-hidden="true" className="mt-3 text-ink/70">
                {label}
              </p>
            </div>
          ))}
        </dl>
      </div>

      {/* the picture of the row under the pointer, held up beside it */}
      <AnimatePresence>
        {hover && (
          <motion.div
            key="peek"
            aria-hidden="true"
            className="pointer-events-none fixed top-0 left-0 z-30 hidden [@media(hover:hover)_and_(pointer:fine)]:block"
            style={{ x, y }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.15 } }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <div className="-translate-x-1/2 -translate-y-[115%] overflow-hidden rounded-[6px] shadow-[var(--shadow-lift)]">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.img
                  key={hover}
                  src={`${projects[hover].hero}.jpg`}
                  alt=""
                  className="block h-[13rem] w-[19rem] object-cover"
                  initial={{ opacity: 0, transform: "scale(1.08)" }}
                  animate={{ opacity: 1, transform: "scale(1)" }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                />
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

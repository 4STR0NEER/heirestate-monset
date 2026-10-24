import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Lightbox from "@/components/Lightbox";

const EASE = [0.23, 1, 0.32, 1];
const GUTTER = "px-[clamp(16px,4vw,64px)]";
const PLAN = [1165, 805]; // The Wave's plans are all cut to one frame; a unit can give its own (planSize)
const sqm = (n) => `${n.toFixed(2).replace(/\.?0+$/, "")} sqm`;
const range = (plans) => {
  const a = plans.map((p) => p[2]);
  if (a.length === 1) return sqm(a[0]);
  const lo = Math.floor(Math.min(...a));
  const hi = Math.ceil(Math.max(...a));
  return lo === hi ? `${lo} sqm` : `${lo} to ${hi} sqm`;
};

// The homes, one type at a time: the brochure's render of it, every layout drawn with its area,
// the dress-up unit's photographs, what it is finished in, and the ways to take it further.
export default function Residences({ units, name, features = [], tours = [], onTour, onBook }) {
  const [current, setCurrent] = useState(units[0].id);
  const tabs = useRef([]);
  const unit = units.find((u) => u.id === current);
  const layouts = units.reduce((n, u) => n + (u.plans?.length ?? 0), 0);

  // arrow keys move along the tabs, as a tablist should
  const onKey = (e, i) => {
    const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!d) return;
    const next = (i + d + units.length) % units.length;
    setCurrent(units[next].id);
    tabs.current[next].focus();
  };

  return (
    <section id="residences" aria-labelledby="residences-title" className={`mx-auto max-w-[1440px] py-[clamp(88px,14vh,160px)] ${GUTTER}`}>
      <div className="grid gap-x-20 gap-y-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-end">
        <div>
          {layouts > units.length && (
            <p className="font-display text-[1.15rem] text-gold-ink italic">
              {layouts} layouts in {units.length} types
            </p>
          )}
          <h2 id="residences-title" className="font-display mt-3 text-[clamp(2.6rem,5vw,4.6rem)] leading-none tracking-[-0.02em] text-ink">
            Residences
          </h2>
        </div>
        {features.length > 0 && (
          <details className="group border-t border-ink/15 md:mb-1">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-ink [&::-webkit-details-marker]:hidden">
              <span>In every unit at {name}</span>
              <svg viewBox="0 0 16 16" className="size-4 transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none" aria-hidden="true">
                <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.3" />
              </svg>
            </summary>
            <ul className="grid gap-x-8 gap-y-2 pb-5 text-[0.95rem] text-ink/75 sm:grid-cols-2">
              {features.map((f) => (
                <li key={f} className="flex gap-3">
                  <span className="mt-[0.6em] size-1 shrink-0 rounded-full bg-gold" aria-hidden="true" />
                  {f}
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>

      <div role="tablist" aria-label="Unit type" className="mt-12 flex gap-x-[clamp(20px,3vw,48px)] overflow-x-auto border-b border-ink/12 [scrollbar-width:none] max-md:pr-10 max-md:[mask-image:linear-gradient(to_right,black_80%,transparent)]">
        {units.map((u, i) => {
          const on = u.id === current;
          return (
            <button
              key={u.id}
              ref={(n) => (tabs.current[i] = n)}
              type="button"
              role="tab"
              id={`unit-${u.id}`}
              aria-selected={on}
              aria-controls="unit-panel"
              tabIndex={on ? 0 : -1}
              onClick={() => setCurrent(u.id)}
              onKeyDown={(e) => onKey(e, i)}
              className={`relative shrink-0 pb-4 text-left transition-colors duration-200 ${on ? "text-ink" : "text-ink/45 hover:text-ink/75"}`}
            >
              <span className="font-display block text-[clamp(1.25rem,2vw,1.75rem)] whitespace-nowrap">{u.name}</span>
              {u.plans && <span className="block text-[0.85rem] whitespace-nowrap tabular-nums">{range(u.plans)}</span>}
              {on && <motion.span layoutId="unit-rule" className="absolute inset-x-0 -bottom-px h-[2px] bg-(--accent)" transition={{ type: "spring", duration: 0.45, bounce: 0 }} />}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={unit.id}
          id="unit-panel"
          role="tabpanel"
          aria-labelledby={`unit-${unit.id}`}
          initial={{ opacity: 0, filter: "blur(4px)" }}
          animate={{ opacity: 1, filter: "blur(0px)", transition: { duration: 0.35, ease: EASE } }}
          exit={{ opacity: 0, filter: "blur(4px)", transition: { duration: 0.18 } }}
        >
          {unit.plans ? <Unit unit={unit} name={name} tour={tours.includes(unit.id)} onTour={onTour} onBook={onBook} /> : <Photos unit={unit} name={name} />}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

function Unit({ unit, name, tour, onTour, onBook }) {
  const [view, setView] = useState("plans");
  const ask = "rounded-full px-6 py-3.5 text-[0.95rem] transition-[background-color,color,transform] duration-200 active:scale-[0.97] motion-reduce:transform-none";

  return (
    <div className="mt-8">
      {/* the brochure's render of the type, with its name, its sizes and the tour; without one,
          the name and sizes stand on their own */}
      {!unit.render ? (
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-ink/12 pb-6">
          <p className="font-display text-[clamp(2.2rem,4.5vw,4rem)] leading-none tracking-[-0.02em] text-ink">{unit.name}</p>
          <p className="text-ink/70 tabular-nums">
            {range(unit.plans)}, {unit.plans.length} {unit.plans.length === 1 ? "layout" : "layouts"}
          </p>
        </div>
      ) : (
      <div className="relative aspect-[4/3] overflow-hidden bg-stone sm:aspect-[21/9]">
        <img src={unit.render} alt={`${name}, ${unit.name.toLowerCase()}: architect's perspective`} loading="lazy" decoding="async" className="size-full object-cover" />
        <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-navy-deep/80 via-navy-deep/15 via-50% to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-x-8 gap-y-5 p-[clamp(20px,3vw,40px)] text-paper">
          <div>
            <p className="font-display text-[clamp(2.2rem,4.5vw,4rem)] leading-none tracking-[-0.02em]">{unit.name}</p>
            <p className="mt-2 text-paper/85 tabular-nums">
              {range(unit.plans)}, {unit.plans.length} {unit.plans.length === 1 ? "layout" : "layouts"}
            </p>
          </div>
          {tour && (
            <button
              type="button"
              onClick={() => onTour(unit.id)}
              className="flex items-center gap-3 rounded-full bg-paper/95 py-2.5 pr-5 pl-3 text-[0.95rem] text-ink transition-[background-color,transform] duration-150 hover:bg-paper active:scale-[0.97] motion-reduce:transform-none"
            >
              <svg viewBox="0 0 24 24" className="size-6 text-(--accent)" aria-hidden="true">
                <circle cx="12" cy="12" r="11.5" fill="none" stroke="currentColor" strokeOpacity="0.6" />
                <path d="M10 8v8l6.5-4z" fill="currentColor" />
              </svg>
              Take the video tour
            </button>
          )}
        </div>
      </div>
      )}

      <div className="mt-12 grid gap-x-16 gap-y-12 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div>
          <div role="group" aria-label="Show" className="inline-flex rounded-full border border-ink/15 p-1">
            {[
              ["plans", unit.planTab ?? "Floor plans"],
              ["photos", `Photographs (${unit.photos.length})`],
            ].map(([k, label]) => (
              <button
                key={k}
                type="button"
                aria-pressed={view === k}
                onClick={() => setView(k)}
                className={`relative rounded-full px-4 py-2 text-[0.92rem] transition-colors duration-200 ${view === k ? "text-paper" : "text-ink/70 hover:text-ink"}`}
              >
                {view === k && <motion.span layoutId={`view-${unit.id}`} className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", duration: 0.4, bounce: 0 }} />}
                <span className="relative">{label}</span>
              </button>
            ))}
          </div>
          <div className="mt-6">{view === "plans" ? <Plans unit={unit} name={name} /> : <Photos unit={unit} name={name} strip />}</div>
        </div>

        <div>
          <p className="font-display text-[clamp(1.3rem,1.8vw,1.6rem)] leading-snug text-ink">{unit.about}</p>
          {unit.finishes && (
            <>
              <h3 className="font-display mt-10 text-[1.15rem] text-gold-ink italic">Finishes</h3>
              <dl className="mt-3 border-t border-ink/12">
                {unit.finishes.map(([k, v]) => (
                  <div key={k} className="grid gap-1 border-b border-ink/10 py-3.5 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-4">
                    <dt className="text-ink">{k}</dt>
                    <dd className="text-[0.95rem] leading-relaxed text-ink/70">{v}</dd>
                  </div>
                ))}
              </dl>
            </>
          )}
          {/* the type's own next step */}
          <div className="mt-10 bg-stone p-6">
            <p className="font-display text-[1.35rem] leading-tight text-ink">Interested in the {unit.name.toLowerCase()}?</p>
            <p className="mt-2 text-[0.95rem] text-ink/70">Get its current price list and the layouts still open, or see the dress-up unit in person.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button type="button" onClick={() => onBook("prices", unit.id)} className={`${ask} bg-(--accent) text-paper hover:bg-ink`}>
                Request the price list
              </button>
              <button type="button" onClick={() => onBook("viewing", unit.id)} className={`${ask} border border-ink/25 text-ink hover:bg-ink hover:text-paper`}>
                Book a viewing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// every layout of the type, picked by name; the open plan grows into a full view to read its areas
function Plans({ unit, name }) {
  const [at, setAt] = useState(0);
  const [pw, ph] = unit.planSize ?? PLAN;
  const images = useMemo(
    () =>
      unit.plans.map(([type, src, area]) => ({
        src,
        width: pw,
        height: ph,
        caption: `${unit.name}, ${type}: ${sqm(area)}`,
        alt: `${name}, ${unit.name.toLowerCase()} ${type}: floor plan with room areas, ${sqm(area)} in total`,
      })),
    [unit, name, pw, ph]
  );
  const [type, , area, has, rooms] = unit.plans[at];

  return (
    <Lightbox images={images}>
      {({ open, thumb, active }) => (
        <div>
          {unit.plans.length > 1 && (
          <div role="group" aria-label="Layout" className="flex flex-wrap gap-2">
            {unit.plans.map(([t, , a], i) => (
              <button
                key={t}
                type="button"
                aria-pressed={i === at}
                onClick={() => setAt(i)}
                className={`rounded-full border px-3.5 py-1.5 text-[0.88rem] tabular-nums transition-colors duration-200 ${
                  i === at ? "border-ink bg-ink text-paper" : "border-ink/15 text-ink/75 hover:border-ink/40 hover:text-ink"
                }`}
              >
                {t} <span className={i === at ? "text-paper/70" : "text-ink/50"}>{Math.round(a)}</span>
              </button>
            ))}
          </div>
          )}
          <button
            ref={thumb(at)}
            type="button"
            onClick={() => open(at)}
            aria-label={`Open the ${type} plan`}
            className={`group block w-full overflow-hidden border border-ink/10 bg-plan ${unit.plans.length > 1 ? "mt-5" : ""}`}
            style={{ opacity: active === at ? 0 : 1 }}
          >
            <img
              key={images[at].src}
              src={images[at].src}
              alt={images[at].alt}
              width={pw}
              height={ph}
              decoding="async"
              className={ph > pw ? "mx-auto h-auto max-h-[70svh] w-auto" : "h-auto w-full"}
            />
          </button>
          <p className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-ink">
            <span className="font-display text-[1.3rem]">
              {type}, {sqm(area)}
            </span>
            {has.length > 0 && <span className="text-[0.92rem] text-ink/65">{has.join(", ")}</span>}
          </p>
          {rooms && (
            <dl className="mt-4 grid max-w-[28rem] grid-cols-[minmax(0,1fr)_auto] gap-x-6 border-t border-ink/12 text-[0.95rem]">
              {rooms.map(([room, a]) => (
                <div key={room} className="contents">
                  <dt className="border-b border-ink/10 py-2 text-ink/75">{room}</dt>
                  <dd className="border-b border-ink/10 py-2 text-right text-ink tabular-nums">{sqm(a)}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      )}
    </Lightbox>
  );
}

// the dress-up unit: one photograph large, the rest in a strip beneath to choose from
function Photos({ unit, name, strip }) {
  const [at, setAt] = useState(0);
  const [w, h] = unit.size;
  const images = useMemo(
    () =>
      unit.photos.map((p, i) => ({
        src: p.src,
        width: w,
        height: h,
        caption: p.caption,
        alt: `${name}, ${unit.name.toLowerCase()} dress-up unit: ${p.caption?.toLowerCase() ?? `view ${i + 1}`}`,
      })),
    [unit, name, w, h]
  );

  return (
    <Lightbox images={images}>
      {({ open, thumb, active }) => (
        <div className={strip ? "" : "mt-8 max-w-[960px]"}>
          <button
            ref={thumb(at)}
            type="button"
            onClick={() => open(at)}
            aria-label={`Open ${images[at].caption ?? `photograph ${at + 1}`}`}
            className="group relative block aspect-[4/3] w-full overflow-hidden bg-stone"
            style={{ opacity: active === at ? 0 : 1 }}
          >
            <img
              key={images[at].src}
              src={images[at].src}
              alt={images[at].alt}
              decoding="async"
              className="size-full object-cover"
            />
            {images[at].caption && (
              <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink/60 to-transparent px-4 pt-12 pb-3.5 text-left text-[0.92rem] text-paper">{images[at].caption}</span>
            )}
          </button>
          <ul className="mt-3 flex gap-2 overflow-x-auto p-1 [scrollbar-width:none]">
            {images.map((img, i) => (
              <li key={img.src} className="shrink-0">
                <button
                  type="button"
                  onClick={() => setAt(i)}
                  aria-label={`Show ${img.caption ?? `photograph ${i + 1}`}`}
                  aria-current={i === at || undefined}
                  className={`block size-16 overflow-hidden transition-opacity duration-200 sm:size-20 ${i === at ? "ring-2 ring-(--accent) ring-offset-2 ring-offset-paper" : "opacity-60 hover:opacity-100"}`}
                >
                  <img src={img.src} alt="" loading="lazy" decoding="async" className="size-full object-cover" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Lightbox>
  );
}

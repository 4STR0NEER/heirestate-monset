import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Lightbox from "@/components/Lightbox";

const EASE = [0.23, 1, 0.32, 1];
const GUTTER = "px-[clamp(16px,4vw,64px)]";
const word = { 3: "Three", 5: "Five", 7: "Seven", 10: "Ten" };

// Where each photo sits in the six-column mosaic: the first is the room you walk into, large,
// with two beside it; the rest fill rows of three, or two wider ones so no row is left ragged.
function spans(n) {
  const out = ["md:col-span-4 md:row-span-2", "md:col-span-2", "md:col-span-2"].slice(0, n);
  let rest = n - out.length;
  while (rest > 0) {
    const row = rest === 4 || rest === 2 ? 2 : 3;
    out.push(...Array(row).fill(row === 2 ? "md:col-span-3" : "md:col-span-2"));
    rest -= row;
  }
  return out;
}

// Every layout, photographed in its dress-up unit. Pick a unit; any photo opens out of its
// tile into a full view you can swipe through.
export default function Residences({ units, name, tours = [], onTour }) {
  const [current, setCurrent] = useState(units[0].id);
  const tabs = useRef([]);
  const unit = units.find((u) => u.id === current);

  // arrow keys move along the tabs, as a tablist should
  const onKey = (e, i) => {
    const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!d) return;
    const next = (i + d + units.length) % units.length;
    setCurrent(units[next].id);
    tabs.current[next].focus();
  };

  return (
    <section aria-labelledby="residences" className={`mx-auto max-w-[1440px] py-[clamp(88px,14vh,160px)] ${GUTTER}`}>
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
        <h3 id="residences" className="font-display text-[clamp(2rem,4vw,3.6rem)] leading-none tracking-[-0.02em] text-ink">
          Residences
        </h3>
        <p className="max-w-[38ch] text-ink/65">Four layouts, each photographed in its dress-up unit. Open any photo to see it whole, or take a video tour of the larger three.</p>
      </div>

      <div role="tablist" aria-label="Unit type" className="mt-12 flex gap-x-[clamp(20px,3vw,48px)] gap-y-3 overflow-x-auto border-b border-ink/12 [scrollbar-width:none] max-md:pr-10 max-md:[mask-image:linear-gradient(to_right,black_80%,transparent)]">
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
              className={`font-display relative shrink-0 pb-4 text-[clamp(1.25rem,2vw,1.75rem)] whitespace-nowrap transition-colors duration-200 ${on ? "text-ink" : "text-ink/40 hover:text-ink/70"}`}
            >
              {u.name}
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
          <div className="mt-6 mb-8 flex flex-wrap items-baseline justify-between gap-4">
            <p className="font-inscription text-[0.72rem] tracking-[0.26em] text-ink/60 uppercase">
              {word[unit.photos.length] ?? unit.photos.length} photographs
            </p>
            {tours.includes(unit.id) && (
              <button
                type="button"
                onClick={() => onTour(unit.id)}
                className="flex items-center gap-3 rounded-full bg-(--accent) py-2.5 pr-5 pl-3 text-[0.95rem] text-paper transition-[transform,opacity] duration-150 hover:opacity-90 active:scale-[0.97] motion-reduce:transform-none"
              >
                <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true">
                  <circle cx="12" cy="12" r="11.5" fill="none" stroke="currentColor" strokeOpacity="0.6" />
                  <path d="M10 8v8l6.5-4z" fill="currentColor" />
                </svg>
                Take the video tour
              </button>
            )}
          </div>
          <Mosaic unit={unit} name={name} />
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

function Mosaic({ unit, name }) {
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
  const layout = spans(images.length);

  return (
    <Lightbox images={images}>
      {({ open, thumb, active }) => (
        <ul className="grid auto-rows-[44vw] grid-cols-2 gap-[clamp(8px,1vw,16px)] md:auto-rows-[clamp(200px,21vw,330px)] md:grid-cols-6">
          {images.map((img, i) => (
            <motion.li
              key={img.src}
              className={`${i === 0 || (i === images.length - 1 && images.length % 2 === 0) ? "col-span-2" : ""} ${layout[i]}`}
              initial={{ opacity: 0, transform: "translateY(12px)" }}
              animate={{ opacity: 1, transform: "translateY(0px)" }}
              transition={{ duration: 0.5, ease: EASE, delay: Math.min(i, 6) * 0.04 }}
            >
              <button
                ref={thumb(i)}
                type="button"
                onClick={() => open(i)}
                aria-label={`Open ${img.caption ?? `view ${i + 1}`}`}
                className="group relative block size-full overflow-hidden bg-stone"
                // the open photo has left its tile; the tile stays empty until it flies back
                style={{ opacity: active === i ? 0 : 1 }}
              >
                <img
                  src={img.src}
                  alt=""
                  width={w}
                  height={h}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="size-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.23,1,0.32,1)] [@media(hover:hover)]:group-hover:scale-[1.035]"
                />
                {img.caption && (
                  <span className="font-inscription absolute inset-x-0 bottom-0 bg-linear-to-t from-ink/60 to-transparent px-4 pt-12 pb-3.5 text-left text-[0.68rem] tracking-[0.26em] text-paper uppercase">
                    {img.caption}
                  </span>
                )}
              </button>
            </motion.li>
          ))}
        </ul>
      )}
    </Lightbox>
  );
}

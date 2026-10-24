import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Corners from "@/components/Corners";
import Reveal from "@/components/Reveal";

const GUTTER = "px-[clamp(16px,4vw,64px)]";
const EASE = [0.23, 1, 0.32, 1];

// The tower floor by floor, drawn as its own elevation: a stack of floors, each finned like the
// facade, the roof deck at the top. Choose a floor (or the run of typical floors, which light up
// together) and its plate from the deck comes up beside it, with what is on it.
export default function FloorStack({ tower, name }) {
  const [at, setAt] = useState(tower.levels.length - 1); // the typical floor first: it is most of the tower
  const level = tower.levels[at];
  // top to bottom, as an elevation reads: a bar for every storey, the typical floors as many bars
  const bars = tower.levels.flatMap((l, i) => Array.from({ length: l.floors ?? 1 }, (_, k) => ({ i, l, k }))).reverse();

  return (
    <section aria-labelledby="tower-title" data-tone="dark" className="bg-navy-deep text-paper">
      <div className={`mx-auto max-w-[1440px] py-[clamp(88px,14vh,160px)] ${GUTTER}`}>
        <Reveal className="max-w-[46rem]">
          <p data-rise className="font-display text-[1.15rem] text-champagne italic">
            {name}, floor by floor
          </p>
          <h2 id="tower-title" data-split className="font-display mt-3 text-[clamp(2.6rem,5vw,4.6rem)] leading-[0.95] tracking-[-0.02em]">
            The tower
          </h2>
          <p data-rise className="mt-5 max-w-[48ch] text-paper/75">
            {tower.note}
          </p>
        </Reveal>

        {/* on a phone, the floors as a row of choices */}
        <div role="group" aria-label="Floor" className="mt-10 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] md:hidden">
          {tower.levels.map((l, i) => (
            <button
              key={l.id}
              type="button"
              aria-pressed={i === at}
              onClick={() => setAt(i)}
              className={`shrink-0 rounded-full border px-4 py-2 text-[0.9rem] tabular-nums transition-colors duration-200 ${i === at ? "border-champagne bg-champagne text-ink" : "border-paper/25 text-paper/75"}`}
            >
              {l.short}
            </button>
          ))}
        </div>

        <div className="mt-8 grid items-start gap-x-16 gap-y-10 md:mt-14 md:grid-cols-[auto_minmax(0,1fr)]">
          {/* the elevation: each storey a finned bar, labelled at the start of its run */}
          <div role="group" aria-label="Floor" className="hidden w-[15rem] md:block">
            <div className="mx-auto mb-1 h-3 w-[78%] border border-paper/20" aria-hidden="true" title="Roof deck" />
            <ol className="flex flex-col gap-[3px]">
              {bars.map(({ i, l, k }) => {
                const on = i === at;
                const first = k === (l.floors ?? 1) - 1; // the top storey of a run carries its label
                return (
                  <li key={`${l.id}-${k}`} className="grid grid-cols-[3.25rem_minmax(0,1fr)] items-center gap-3">
                    <span className={`text-right text-[0.78rem] tabular-nums transition-colors duration-200 ${on ? "text-champagne" : "text-paper/45"}`}>{first ? l.short : ""}</span>
                    <button
                      type="button"
                      tabIndex={first ? 0 : -1}
                      aria-hidden={first ? undefined : "true"}
                      aria-pressed={first ? on : undefined}
                      aria-label={first ? l.label : undefined}
                      onClick={() => setAt(i)}
                      // the podium steps in from the street floors, the tower in from the podium
                      className={`fins mx-auto block transition-colors duration-200 ${l.floors ? "h-2.5" : "h-4"} ${on ? "bg-champagne text-ink/25" : "bg-paper/10 text-paper/15 hover:bg-paper/20"} ${
                        i < 2 ? "w-full" : i < 6 ? "w-[92%]" : "w-[78%]"
                      }`}
                    />
                  </li>
                );
              })}
            </ol>
            <div className="mt-[3px] grid grid-cols-[3.25rem_minmax(0,1fr)] gap-3" aria-hidden="true">
              <span />
              <span className="h-px bg-paper/40" />
            </div>
          </div>

          <div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={level.id}
                aria-live="polite"
                initial={{ opacity: 0, transform: "translateY(10px)" }}
                animate={{ opacity: 1, transform: "translateY(0px)" }}
                exit={{ opacity: 0, transition: { duration: 0.12 } }}
                transition={{ duration: 0.32, ease: EASE }}
              >
                <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
                  <p className="font-display text-[clamp(2rem,3.6vw,3.2rem)] leading-none">{level.label}</p>
                  {level.units && <p className="text-champagne">{level.units}</p>}
                </div>
                {level.note && <p className="mt-3 max-w-[56ch] text-paper/75">{level.note}</p>}
                <div className="relative mt-6 bg-stone p-[clamp(10px,2vw,24px)]">
                  <Corners className="border-champagne" />
                  <img
                    src={level.plate}
                    alt={`${name}, ${level.label.toLowerCase()} plan`}
                    width={level.size[0]}
                    height={level.size[1]}
                    decoding="async"
                    className="mx-auto max-h-[64svh] w-auto max-w-full object-contain"
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

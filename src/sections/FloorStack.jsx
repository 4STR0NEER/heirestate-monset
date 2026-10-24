import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Corners from "@/components/Corners";
import Reveal from "@/components/Reveal";

const GUTTER = "px-[clamp(16px,4vw,64px)]";
const EASE = [0.23, 1, 0.32, 1];

// The tower floor by floor, drawn as its own elevation: a stack of floors, the roof at the top.
// Choose a floor (or a run of typical floors, which light up together) and its plate comes up
// beside it, with what is on it. A project of two towers (tower.towers) gets one elevation for
// each, side by side, and a choice between them. In Alto Ranudo's hand the storeys are finned
// like its facade and step in from podium to tower; elsewhere they are plain.
export default function FloorStack({ tower, name, motif }) {
  const towers = tower.towers ?? [{ id: "tower", name: "The tower", levels: tower.levels }];
  const [t, setT] = useState(0);
  const [at, setAt] = useState(towers[0].levels.length - 1); // the highest run first: it is most of the tower
  const levels = towers[t].levels;
  const level = levels[Math.min(at, levels.length - 1)];
  const pick = (ti, i) => (setT(ti), setAt(i));
  const fins = motif === "fins";

  return (
    <section aria-labelledby="tower-title" data-tone="dark" className="bg-navy-deep text-paper">
      <div className={`mx-auto max-w-[1440px] py-[clamp(88px,14vh,160px)] ${GUTTER}`}>
        <Reveal className="max-w-[46rem]">
          <p data-rise className="font-display text-[1.15rem] text-champagne italic">
            {name}, floor by floor
          </p>
          <h2 id="tower-title" data-split className="font-display mt-3 text-[clamp(2.6rem,5vw,4.6rem)] leading-[0.95] tracking-[-0.02em]">
            {towers.length > 1 ? `${towers.length === 2 ? "Two" : towers.length} towers` : "The tower"}
          </h2>
          <p data-rise className="mt-5 max-w-[48ch] text-paper/75">
            {tower.note}
          </p>
        </Reveal>

        {/* on a phone, the towers and their floors as rows of choices */}
        <div className="mt-10 space-y-3 md:hidden">
          {towers.length > 1 && (
            <div role="group" aria-label="Tower" className="flex gap-2">
              {towers.map((tw, ti) => (
                <button
                  key={tw.id}
                  type="button"
                  aria-pressed={ti === t}
                  onClick={() => pick(ti, tw.levels.length - 1)}
                  className={`rounded-full border px-4 py-2 text-[0.9rem] transition-colors duration-200 ${ti === t ? "border-champagne bg-champagne text-ink" : "border-paper/25 text-paper/75"}`}
                >
                  {tw.name}
                </button>
              ))}
            </div>
          )}
          <div role="group" aria-label="Floor" className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
            {levels.map((l, i) => (
              <button
                key={l.id}
                type="button"
                aria-pressed={l === level}
                onClick={() => setAt(i)}
                className={`shrink-0 rounded-full border px-4 py-2 text-[0.9rem] tabular-nums transition-colors duration-200 ${l === level ? "border-champagne bg-champagne text-ink" : "border-paper/25 text-paper/75"}`}
              >
                {l.short}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid items-start gap-x-16 gap-y-10 md:mt-14 md:grid-cols-[auto_minmax(0,1fr)]">
          {/* the elevations: each storey a bar, labelled at the start of its run */}
          <div className="hidden items-end gap-6 md:flex">
            {towers.map((tw, ti) => {
              const bars = tw.levels.flatMap((l, i) => Array.from({ length: l.floors ?? 1 }, (_, k) => ({ i, l, k }))).reverse();
              return (
                <div key={tw.id} role="group" aria-label={tw.name} className={towers.length > 1 ? "w-[11rem]" : "w-[15rem]"}>
                  {towers.length > 1 && <p className={`mb-3 text-center font-display italic transition-colors duration-200 ${ti === t ? "text-champagne" : "text-paper/55"}`}>{tw.name}</p>}
                  <div className={`mx-auto mb-1 h-3 w-[78%] border border-paper/20 ${fins ? "" : "rounded-t-full"}`} aria-hidden="true" />
                  <ol className="flex flex-col gap-[3px]">
                    {bars.map(({ i, l, k }) => {
                      const on = ti === t && l === level;
                      const first = k === (l.floors ?? 1) - 1; // the top storey of a run carries its label
                      const width = fins ? (i < 2 ? "w-full" : i < 6 ? "w-[92%]" : "w-[78%]") : "w-[86%]";
                      return (
                        <li key={`${l.id}-${k}`} className="grid grid-cols-[3rem_minmax(0,1fr)] items-center gap-3">
                          <span className={`text-right text-[0.78rem] tabular-nums transition-colors duration-200 ${on ? "text-champagne" : "text-paper/45"}`}>{first ? l.short : ""}</span>
                          <button
                            type="button"
                            tabIndex={first ? 0 : -1}
                            aria-hidden={first ? undefined : "true"}
                            aria-pressed={first ? on : undefined}
                            aria-label={first ? `${tw.name}, ${l.label}` : undefined}
                            onClick={() => pick(ti, i)}
                            className={`mx-auto block transition-colors duration-200 ${fins ? "fins" : "rounded-[2px]"} ${l.floors ? "h-2.5" : "h-4"} ${width} ${
                              on ? "bg-champagne text-ink/25" : "bg-paper/10 text-paper/15 hover:bg-paper/20"
                            }`}
                          />
                        </li>
                      );
                    })}
                  </ol>
                  <div className="mt-[3px] grid grid-cols-[3rem_minmax(0,1fr)] gap-3" aria-hidden="true">
                    <span />
                    <span className="h-px bg-paper/40" />
                  </div>
                </div>
              );
            })}
          </div>

          <div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${towers[t].id}-${level.id}`}
                aria-live="polite"
                initial={{ opacity: 0, transform: "translateY(10px)" }}
                animate={{ opacity: 1, transform: "translateY(0px)" }}
                exit={{ opacity: 0, transition: { duration: 0.12 } }}
                transition={{ duration: 0.32, ease: EASE }}
              >
                <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
                  <p className="font-display text-[clamp(2rem,3.6vw,3.2rem)] leading-none">
                    {level.label}
                    {towers.length > 1 && <span className="font-display ml-3 text-[0.55em] text-champagne italic">{towers[t].name}</span>}
                  </p>
                  {level.units && <p className="text-champagne">{level.units}</p>}
                </div>
                {level.note && <p className="mt-3 max-w-[56ch] text-paper/75">{level.note}</p>}
                <div className="relative mt-6 bg-stone p-[clamp(10px,2vw,24px)]">
                  {fins && <Corners className="border-champagne" />}
                  <img
                    src={level.plate}
                    alt={`${name}, ${towers.length > 1 ? `${towers[t].name}, ` : ""}${level.label.toLowerCase()} plan`}
                    width={level.size[0]}
                    height={level.size[1]}
                    decoding="async"
                    className="mx-auto max-h-[64svh] w-auto max-w-full object-contain"
                  />
                </div>
                {/* the plans' own colour key, where the project gives one */}
                {tower.legend && (
                  <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[0.9rem] text-paper/75">
                    {tower.legend.map(([label, colour]) => (
                      <li key={label} className="flex items-center gap-2">
                        <span aria-hidden="true" className="size-3 rounded-[2px]" style={{ background: colour }} />
                        {label}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

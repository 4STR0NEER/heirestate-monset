import Contours from "@/components/Contours";
import Plumeria from "@/components/Plumeria";
import Reveal from "@/components/Reveal";

const GUTTER = "px-[clamp(16px,4vw,64px)]";

// How a unit is paid for, as the developer's sample term sheet sets it out: the shape of the
// scheme, step by step along a line, without a single price (those come from the agents).
export default function Terms({ terms, onBook }) {
  return (
    <section aria-labelledby="terms-title" className="relative overflow-hidden">
      <Contours seed={21} cx={0.18} cy={0.62} />
      <Plumeria className="absolute -top-10 right-[6%] hidden w-[clamp(120px,14vw,200px)] rotate-12 opacity-80 md:block" />
      <div className={`relative mx-auto max-w-[1440px] py-[clamp(88px,14vh,160px)] ${GUTTER}`}>
        <Reveal className="max-w-[44rem]">
          <p data-rise className="font-display text-[1.15rem] text-gold-ink italic">
            {terms.caption}
          </p>
          <h2 id="terms-title" data-split className="font-display mt-3 text-[clamp(2.6rem,5vw,4.6rem)] leading-[0.95] tracking-[-0.02em] text-ink">
            {terms.title}
          </h2>
        </Reveal>

        <ol className="relative mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {/* the line the steps stand on, like a contour across the page */}
          <span aria-hidden="true" className="absolute top-6 right-0 left-0 hidden h-px bg-gold/50 md:block" />
          {terms.steps.map(([title, note], i) => (
            <li key={title} className="relative">
              <span className="relative grid size-12 place-items-center rounded-full border border-gold bg-paper font-display text-[1.3rem] text-ink tabular-nums">{i + 1}</span>
              <p className="font-display mt-5 text-[clamp(1.5rem,2.4vw,2rem)] leading-tight text-ink">{title}</p>
              <p className="mt-2 max-w-[34ch] leading-relaxed text-ink/70">{note}</p>
            </li>
          ))}
        </ol>

        <div className="mt-14 grid gap-8 border-t border-ink/15 pt-8 md:grid-cols-[minmax(0,1.4fr)_auto] md:items-end">
          <ul className="space-y-1.5 text-[0.92rem] text-ink/60">
            {terms.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
          {onBook && (
            <button
              type="button"
              onClick={() => onBook("prices")}
              className="justify-self-start rounded-full bg-(--accent) px-6 py-3.5 text-paper transition-[background-color,transform] duration-200 hover:bg-ink active:scale-[0.97] motion-reduce:transform-none md:justify-self-end"
            >
              Request the price list
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

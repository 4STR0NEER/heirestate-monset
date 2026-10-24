import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import Corners from "@/components/Corners";
import Reveal from "@/components/Reveal";

const GUTTER = "px-[clamp(16px,4vw,64px)]";
const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

// A building told by its numbers, drawn like the deck: one word set huge in outline behind the
// statement, a render in a ruled frame, then a board of figures whose rules draw themselves in
// before the figures count up to their value.
export default function Profile({ profile, name }) {
  const root = useRef(null);
  const board = useRef(null);
  const inView = useInView(board, { once: true, amount: 0.3 });
  const { scrollYProgress } = useScroll({ target: root, offset: ["start end", "end start"] });
  const drift = useTransform(scrollYProgress, (v) => `translateX(${(0.5 - v) * 12}%)`);

  useEffect(() => {
    if (!inView) return;
    const lines = board.current.querySelectorAll("[data-rule]");
    const nums = [...board.current.querySelectorAll("[data-count]")];
    if (reduced()) return void lines.forEach((l) => (l.style.transform = "none"));
    const a = animate(lines, { scale: [0, 1], duration: 900, delay: stagger(40), ease: "out(3)" });
    // each figure counts up in the form it is written: commas, and as many decimals
    const runs = nums.map((n, i) => {
      const text = n.dataset.count;
      const decimals = text.split(".")[1]?.length ?? 0;
      const to = Number(text.replace(/,/g, ""));
      const fmt = new Intl.NumberFormat("en-PH", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
      const v = { n: 0 };
      return animate(v, { n: to, duration: 1400, delay: 300 + i * 70, ease: "out(4)", onUpdate: () => (n.textContent = fmt.format(v.n)) });
    });
    return () => (a.pause(), runs.forEach((r) => r.pause()));
  }, [inView]);

  return (
    <section ref={root} aria-labelledby="profile-title" className="grid-paper relative overflow-x-clip pt-[clamp(72px,12vh,140px)] pb-[clamp(88px,14vh,160px)]">
      {/* the deck's habit: a word set across the page in outline, drifting as you pass */}
      <motion.p
        aria-hidden="true"
        className="outline-word font-display pointer-events-none absolute top-[clamp(24px,6vh,72px)] left-0 text-[clamp(6rem,22vw,22rem)] leading-none whitespace-nowrap uppercase select-none"
        style={{ transform: drift }}
      >
        {profile.word}
      </motion.p>

      <div className={`relative mx-auto grid max-w-[1440px] items-center gap-x-20 gap-y-14 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] ${GUTTER}`}>
        <Reveal>
          <p data-rise className="font-display text-[1.15rem] text-gold-ink italic">
            {name}
          </p>
          <h2 id="profile-title" data-split className="font-display mt-3 text-[clamp(2.4rem,4.6vw,4.4rem)] leading-[0.98] tracking-[-0.02em] text-ink">
            {profile.title}
          </h2>
          {profile.body.map((t) => (
            <p key={t} data-rise className="mt-6 max-w-[44ch] text-[clamp(1.05rem,1.3vw,1.2rem)] leading-relaxed text-ink/75">
              {t}
            </p>
          ))}
        </Reveal>
        {/* the render in a ruled frame, offset like a drawing's border */}
        <div className="relative">
          <span aria-hidden="true" className="absolute -top-4 -right-4 bottom-4 left-4 border border-gold/60" />
          <div className="relative">
            <img src={profile.image} alt={profile.imageAlt} loading="lazy" decoding="async" className="aspect-[4/5] w-full object-cover sm:aspect-[5/4]" />
            <Corners />
          </div>
        </div>
      </div>

      {/* the figures, on a board of rules */}
      <div ref={board} className={`relative mx-auto mt-[clamp(72px,12vh,140px)] max-w-[1440px] ${GUTTER}`}>
        <dl className="relative grid grid-cols-2 bg-navy-deep text-paper md:grid-cols-4">
          {profile.figures.map(([num, label], i) => (
            // the first figure takes a square of four cells; the last two share the bottom row
            <div
              key={label}
              className={`relative flex flex-col-reverse justify-end gap-3 p-[clamp(18px,2.4vw,32px)] ${i === 0 ? "col-span-2 md:row-span-2" : ""} ${i >= 5 ? "md:col-span-2" : ""}`}
            >
              <span data-rule aria-hidden="true" className="absolute inset-x-0 top-0 h-px origin-left bg-gold/45" />
              <span data-rule aria-hidden="true" className="absolute inset-y-0 left-0 w-px origin-top bg-gold/45" />
              <dt className="text-[0.95rem] text-paper/70">{label}</dt>
              <dd data-count={num} className={`font-display leading-none tracking-[-0.02em] tabular-nums ${i === 0 ? "text-[clamp(5rem,12vw,10rem)]" : "text-[clamp(2.2rem,3.6vw,3.4rem)]"}`}>
                {num}
              </dd>
            </div>
          ))}
          <span data-rule aria-hidden="true" className="absolute inset-y-0 right-0 w-px origin-top bg-gold/45" />
          <span data-rule aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px origin-left bg-gold/45" />
        </dl>

        <div className="mt-12 grid gap-x-20 gap-y-6 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <h3 className="font-display text-[1.15rem] text-gold-ink italic">Building features</h3>
          <ul className="grid gap-x-10 gap-y-3 sm:grid-cols-2">
            {profile.features.map((f) => (
              <li key={f} className="flex items-center gap-3 border-b border-ink/12 pb-3 text-ink/80">
                <span aria-hidden="true" className="size-1.5 shrink-0 bg-gold" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

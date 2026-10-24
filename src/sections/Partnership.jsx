import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { animate } from "animejs";
import { useInView } from "motion/react";
import Reveal from "@/components/Reveal";
import { blotMask, swashPath } from "@/lib/ink";

const GUTTER = "px-[clamp(16px,4vw,64px)]";
const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

// Who is building it, told on paper the way the brochure's film paints: the tower opens out of a
// drop of ink, and each partner's figures are laid on strokes of the brush.
export default function Partnership({ venture }) {
  return (
    <section aria-labelledby="venture" className={`mx-auto max-w-[1440px] pt-[clamp(72px,12vh,140px)] pb-[clamp(88px,14vh,160px)] ${GUTTER}`}>
      <div className="grid items-center gap-x-20 gap-y-14 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Reveal>
          <p data-rise className="font-display text-[1.15rem] text-gold-ink italic">
            A joint venture
          </p>
          <h2 id="venture" data-split className="font-display mt-3 text-[clamp(2.6rem,5.5vw,5rem)] leading-[0.95] tracking-[-0.02em] text-ink">
            {venture.name}
          </h2>
          <p data-rise className="font-display mt-6 max-w-[30ch] text-[clamp(1.25rem,1.9vw,1.7rem)] leading-snug text-ink/85 italic">
            {venture.line}
          </p>
          <dl className="mt-10 max-w-[30rem] border-t border-ink/15">
            {venture.plan.map(([k, v]) => (
              <div key={k} data-rise className="grid grid-cols-[9.5rem_minmax(0,1fr)] gap-4 border-b border-ink/10 py-3.5">
                <dt className="text-ink">{k}</dt>
                <dd className="text-ink/70">{v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
        <InkReveal seed={11} src={venture.image} alt={venture.imageAlt} />
      </div>

      <div className="mt-[clamp(88px,14vh,160px)] grid gap-x-20 gap-y-20 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {venture.partners.map((pt, n) => (
          <Reveal key={pt.name}>
            <h3 data-split className="font-display text-[clamp(2rem,3.6vw,3.2rem)] leading-none tracking-[-0.02em] text-ink">
              {pt.name}
            </h3>
            <p data-rise className="mt-5 max-w-[46ch] leading-relaxed text-ink/75">
              {pt.about}
            </p>
            <p data-rise className="font-display mt-8 text-[1.05rem] text-gold-ink italic">
              {pt.figuresNote}
            </p>
            <ul className="mt-5 grid grid-cols-[repeat(auto-fill,minmax(6.25rem,1fr))] gap-x-3 gap-y-7">
              {pt.figures.map(([num, label], i) => (
                <li key={label}>
                  <Swash seed={31 + n * 17 + i * 5} delay={i * 140}>
                    <span className="font-display text-[clamp(1.25rem,1.8vw,1.6rem)] leading-none text-paper tabular-nums">{num}</span>
                  </Swash>
                  <span className="mt-2 block text-[0.92rem] leading-snug text-ink/75">{label}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// A figure laid on one stroke of the brush: the stroke sweeps in from the left, quick at first and
// slowing as the brush lifts, then the figure surfaces on it.
function Swash({ seed, delay = 0, children }) {
  const root = useRef(null);
  const inView = useInView(root, { once: true, amount: 0.6 });
  const d = useMemo(() => swashPath(seed), [seed]);

  useLayoutEffect(() => {
    if (reduced()) return;
    const [stroke, figure] = root.current.children;
    stroke.style.clipPath = "inset(0 100% 0 0)";
    figure.style.opacity = 0;
  }, []);

  useEffect(() => {
    if (!inView || reduced()) return;
    const [stroke, figure] = root.current.children;
    const runs = [
      animate(stroke, { clipPath: ["inset(0 100% 0 0)", "inset(0 0% 0 0)"], duration: 900, delay, ease: "out(3)" }),
      animate(figure, { opacity: [0, 1], y: [6, 0], duration: 600, delay: delay + 450, ease: "out(3)" }),
    ];
    return () => runs.forEach((r) => r.pause());
  }, [inView, delay]);

  return (
    <div ref={root} className="relative flex aspect-[10/3] w-full items-center pl-[16%]">
      <svg viewBox="0 0 200 60" aria-hidden="true" className="absolute inset-0 size-full fill-navy">
        <path d={d} fillRule="evenodd" />
      </svg>
      <span className="relative">{children}</span>
    </div>
  );
}

// A picture that opens out of a drop of ink and keeps the ink's ragged edge.
function InkReveal({ seed, src, alt }) {
  const root = useRef(null);
  const inView = useInView(root, { once: true, amount: 0.3 });
  const mask = useMemo(() => blotMask(seed, 40), [seed]);
  const size = (s) => {
    root.current.style.maskSize = root.current.style.webkitMaskSize = `${s}% ${s}%`;
  };

  useLayoutEffect(() => {
    if (!reduced()) size(4);
  }, []);

  useEffect(() => {
    if (!inView || reduced()) return;
    const v = { s: 4 };
    const a = animate(v, { s: 100, duration: 2200, ease: "out(4)", onUpdate: () => size(v.s) });
    return () => a.pause();
  }, [inView]);

  return (
    <div
      ref={root}
      className="mx-auto aspect-square w-full max-w-[600px]"
      style={{ maskImage: mask, WebkitMaskImage: mask, maskRepeat: "no-repeat", WebkitMaskRepeat: "no-repeat", maskPosition: "center", WebkitMaskPosition: "center", maskSize: "100% 100%", WebkitMaskSize: "100% 100%" }}
    >
      <img src={src} alt={alt} loading="lazy" decoding="async" className="size-full object-cover" />
    </div>
  );
}

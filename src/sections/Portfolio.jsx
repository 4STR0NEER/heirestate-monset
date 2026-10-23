import { useEffect, useRef } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Mark } from "@/components/Logo";
import { useMedia } from "@/lib/use-media";
import { order, projects } from "@/projects";

const EASE = [0.23, 1, 0.32, 1];
const EASE_IO = [0.77, 0, 0.175, 1];
const GUTTER = "px-[clamp(16px,4vw,64px)]";

// Below the hero: one full-screen chapter per project in its palette colour. Each chapter is
// sticky, so the next slides up over it while it eases back and darkens (card-stack-on-scroll,
// after Skiper UI skiper16). The forthcoming chapter and the footer close the page.
export default function Portfolio({ onOpen, onSection }) {
  return (
    <>
      <section id="portfolio" aria-label="The portfolio" className="relative">
        <header className={`mx-auto flex max-w-[1480px] flex-wrap items-end justify-between gap-6 pt-[clamp(88px,16vh,180px)] pb-[clamp(48px,8vh,96px)] ${GUTTER}`}>
          <h2 className="font-display text-[clamp(2.6rem,6.5vw,6rem)] leading-[0.95] tracking-[-0.03em] text-ink">
            The <span className="text-gold-display">portfolio</span>
          </h2>
          <p className="max-w-[34ch] text-[1.05rem] text-charcoal/85">
            Five addresses in the making. Three are open to explore today; two are still on the drawing board.
          </p>
        </header>
        {order.map((id, i) => (
          <Chapter key={id} id={id} index={i} onOpen={onOpen} onSection={onSection} />
        ))}
        <Forthcoming onSection={onSection} />
      </section>
      <Footer onOpen={onOpen} />
    </>
  );
}

function Chapter({ id, index, onOpen, onSection }) {
  const p = projects[id];
  const self = useRef(null);
  const image = useRef(null);
  const reduce = useReducedMotion();
  const active = useInView(self, { amount: 0.55 });
  useEffect(() => {
    if (active) onSection(id);
  }, [active, id, onSection]);

  // 0 while the chapter fills the screen, 1 once the next one has fully covered it
  const { scrollYProgress: covered } = useScroll({ target: self, offset: ["start start", "end start"] });
  const wide = useMedia("(min-width: 768px)");
  const scale = useTransform(covered, [0, 1], [1, reduce || !wide ? 1 : 0.9]);
  const dim = useTransform(covered, [0, 1], [0, wide ? 0.55 : 0]);
  // the photograph drifts slower than the page while the chapter arrives
  const { scrollYProgress: arriving } = useScroll({ target: self, offset: ["start end", "start start"] });
  const drift = useTransform(arriving, [0, 1], reduce ? ["0%", "0%"] : ["-8%", "0%"]);

  const open = () => onOpen(id, image.current.getBoundingClientRect());
  const flip = index % 2 === 1;

  return (
    // phones: chapters are taller than the screen, so they flow instead of stacking
    <article ref={self} aria-label={p.name} className="relative overflow-hidden md:sticky md:top-0 md:h-svh">
      <motion.div className="relative origin-top text-paper md:absolute md:inset-0" style={{ scale, background: p.accent }}>
        <div className={`mx-auto grid h-full max-w-[1480px] items-center gap-[clamp(24px,4vw,72px)] py-[clamp(72px,11vh,120px)] md:grid-cols-[1.15fr_1fr] ${GUTTER}`}>
          <motion.button
            ref={image}
            type="button"
            onClick={open}
            aria-label={`Explore ${p.name}`}
            className={`group relative h-[clamp(220px,38vh,460px)] overflow-hidden rounded-[6px] md:h-[min(68vh,620px)] ${flip ? "md:order-2" : ""}`}
            initial={{ clipPath: "inset(12% 12% 12% 12%)" }}
            whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.3, ease: EASE_IO }}
          >
            <motion.img
              src={`${p.hero}.jpg`}
              alt=""
              loading="lazy"
              style={{ y: drift }}
              className="absolute inset-0 size-full scale-[1.16] object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.2]"
            />
          </motion.button>

          <div className={flip ? "md:order-1" : ""}>
            <Rise delay={0}>
              <p className="font-inscription flex items-center gap-3 text-[0.72rem] tracking-[0.3em] text-champagne uppercase">
                <span className="h-px w-8 bg-gold" />
                {p.tagline}
              </p>
            </Rise>
            <Rise delay={0.08}>
              <h3 className="font-display mt-5 text-[clamp(2.6rem,6vw,5.6rem)] leading-[0.92] tracking-[-0.03em]">{p.name}</h3>
            </Rise>
            <Rise delay={0.16}>
              <p className="mt-6 max-w-[44ch] text-[clamp(1rem,1.2vw,1.12rem)] leading-relaxed text-paper/85">{p.statement.split(/(?<=\.)\s/)[0]}</p>
            </Rise>
            {p.facts.length > 0 && (
              <Rise delay={0.24}>
                <dl className="mt-8 grid max-w-[30rem] grid-cols-2 border-t border-champagne/30">
                  {p.facts.slice(0, 4).map(([label, value]) => (
                    <div key={label} className="border-b border-champagne/30 py-3 pr-4">
                      <dt className="font-inscription text-[0.6rem] tracking-[0.24em] text-champagne/75 uppercase">{label}</dt>
                      <dd className="mt-1 tabular-nums">{value}</dd>
                    </div>
                  ))}
                </dl>
              </Rise>
            )}
            <Rise delay={0.32}>
              <button
                type="button"
                onClick={open}
                className="font-inscription mt-9 flex items-center gap-3 rounded-full bg-paper px-6 py-3.5 text-[0.72rem] tracking-[0.26em] text-ink uppercase transition-[background-color,transform] duration-200 hover:bg-gold active:scale-[0.97]"
              >
                Explore {p.name}
                <svg viewBox="0 0 24 10" className="w-5" aria-hidden="true">
                  <path d="M0 5h22M18 1l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.3" />
                </svg>
              </button>
            </Rise>
          </div>
        </div>
        {/* the chapter dims as the next one slides over it */}
        <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-navy-deep" style={{ opacity: dim }} />
      </motion.div>
    </article>
  );
}

function Forthcoming({ onSection }) {
  const self = useRef(null);
  const active = useInView(self, { amount: 0.55 });
  useEffect(() => {
    if (active) onSection("soon");
  }, [active, onSection]);
  return (
    <article ref={self} aria-label="Forthcoming" className="relative grid min-h-svh place-items-center overflow-hidden bg-champagne md:sticky md:top-0 md:h-svh">
      <div className={`text-center ${GUTTER}`}>
        <Rise delay={0}>
          <Mark className="mx-auto h-16 w-auto text-ink" />
        </Rise>
        <Rise delay={0.1}>
          <h3 className="font-display mt-8 text-[clamp(2.4rem,5.5vw,5rem)] leading-[0.95] tracking-[-0.03em] text-ink">
            Two more, <span className="text-gold-ink">forthcoming</span>
          </h3>
        </Rise>
        <Rise delay={0.2}>
          <p className="mx-auto mt-6 max-w-[40ch] text-[1.05rem] text-charcoal">
            The fourth and fifth Heir Estate projects are still on the drawing board. They will be unveiled here first.
          </p>
        </Rise>
      </div>
    </article>
  );
}

function Footer({ onOpen }) {
  return (
    <footer className="relative bg-paper">
      <div className={`mx-auto grid max-w-[1480px] gap-12 py-[clamp(64px,12vh,120px)] md:grid-cols-[1.4fr_1fr_1fr] ${GUTTER}`}>
        <div>
          <Mark className="h-12 w-auto text-ink" />
          <p className="font-display mt-6 max-w-[18ch] text-[clamp(1.6rem,2.6vw,2.4rem)] leading-[1.1] text-ink">
            Securing wealth, creating your <span className="text-gold-display">legacy</span>.
          </p>
        </div>
        <nav aria-label="Projects">
          <p className="font-inscription text-[0.66rem] tracking-[0.28em] text-charcoal/70 uppercase">Projects</p>
          <ul className="mt-4 space-y-2.5">
            {order.map((id) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={(e) => onOpen(id, e.currentTarget.getBoundingClientRect())}
                  className="flex items-center gap-3 text-ink underline-offset-4 hover:underline"
                >
                  <span className="size-2 rounded-full" style={{ background: projects[id].accent }} />
                  {projects[id].name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="font-inscription text-[0.66rem] tracking-[0.28em] text-charcoal/70 uppercase">Heir Estate</p>
          <a href="#top" className="mt-4 inline-block text-ink underline-offset-4 hover:underline">
            Back to the top
          </a>
        </div>
      </div>
      <div className={`mx-auto flex max-w-[1480px] flex-wrap justify-between gap-4 border-t border-ink/10 py-6 text-[0.8rem] text-charcoal/70 ${GUTTER}`}>
        <span>© {new Date().getFullYear()} Heir Estate</span>
        <span>Renders and films by each project's developer.</span>
      </div>
    </footer>
  );
}

function Rise({ children, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, transform: "translateY(22px)", filter: "blur(6px)" }}
      whileInView={{ opacity: 1, transform: "translateY(0px)", filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 1, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

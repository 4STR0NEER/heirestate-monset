import { useEffect, useMemo, useRef } from "react";
import { motion, useInView, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { Mark } from "@/components/Logo";
import { sequence } from "@/lib/frames";
import { inPlace, siteUrl } from "@/lib/links";
import { order, projects } from "@/projects";

const EASE = [0.23, 1, 0.32, 1];
const GUTTER = "px-[clamp(16px,4vw,64px)]";
const PER = 320; // scroll length per building, in viewport heights
// where each tower sits across its footage, so a narrow phone screen crops around the building
const FOCUS = { alto: 0.5, wave: 0.42, pristina: 0.5 };
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

export default function Portfolio({ onOpen, onSection }) {
  return (
    <>
      <Descent onOpen={onOpen} onSection={onSection} />
      <Forthcoming onSection={onSection} />
      <Footer onOpen={onOpen} />
    </>
  );
}

// From the sky down onto each building in turn, the way the Kalea Heights tour scrubs its film.
// One sticky canvas holds the screen; scroll drives each project's footage frame by frame, so the
// facade rises up to meet you. Between buildings the view lifts back into the pale sky, the next
// name appears, and the next descent begins.
//
// Scroll position x runs 0 → 3, one unit per building. Within a building (t = x mod 1):
//   0.00–0.12  sky clears           0.02–0.80  footage scrubs from sky to facade
//   0.56–0.88  project card shows   0.88–1.00  back into the sky for the next one
function Descent({ onOpen, onSection }) {
  const root = useRef(null);
  const canvas = useRef(null);
  const seqs = useMemo(() => order.map(sequence), []);
  const n = order.length;

  const { scrollYProgress } = useScroll({ target: root, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, (p) => p * n);

  // start fetching the first building's frames a screen before the visitor gets there
  const near = useInView(root, { margin: "100% 0px", once: true });
  useEffect(() => {
    if (near) seqs[0].load();
  }, [near, seqs]);

  useMotionValueEvent(x, "change", (v) => {
    if (v > 0 && v < n) onSection(order[Math.min(n - 1, Math.floor(v))]);
  });

  useEffect(() => {
    const c = canvas.current;
    const ctx = c.getContext("2d");
    let w = 0;
    let h = 0;
    let drawn = "";
    let queued = false;

    const draw = () => {
      queued = false;
      const v = clamp(x.get(), 0, n - 0.0001);
      const b = Math.floor(v);
      const t = v - b;
      const s = seqs[b];
      s.load();
      if (t > 0.35) seqs[b + 1]?.load(); // the next building loads while this one is on screen
      const i = Math.round(easeInOut(clamp((t - 0.02) / 0.78, 0, 1)) * (s.count - 1));
      const img = s.nearest(i);
      if (!img) return;
      const key = `${w}:${img.src}`;
      if (key === drawn) return;
      drawn = key;
      // cover the screen, cropping around the tower
      const k = Math.max(c.width / img.naturalWidth, c.height / img.naturalHeight);
      const dw = img.naturalWidth * k;
      const dh = img.naturalHeight * k;
      const dx = clamp(c.width / 2 - FOCUS[order[b]] * dw, c.width - dw, 0);
      ctx.drawImage(img, dx, (c.height - dh) / 2, dw, dh);
    };
    const schedule = () => {
      if (!queued) (queued = true), requestAnimationFrame(draw);
    };
    const size = () => {
      const dpr = Math.min(devicePixelRatio, 1.5);
      w = innerWidth;
      h = innerHeight;
      c.width = Math.round(w * dpr);
      c.height = Math.round(h * dpr);
      drawn = "";
      schedule();
    };

    size();
    const off = x.on("change", schedule);
    addEventListener("resize", size);
    addEventListener("heir:frame", schedule);
    return () => {
      off();
      removeEventListener("resize", size);
      removeEventListener("heir:frame", schedule);
    };
  }, [x, seqs, n]);

  // the sky veil: full at the start of each descent, gone once the building is in view,
  // back again as the view lifts toward the next one
  const veilIn = [];
  const veilOut = [];
  order.forEach((_, b) => {
    if (b > 0) veilIn.push(b - 0.12, b - 0.03), veilOut.push(0, 1);
    veilIn.push(b + 0.02, b + 0.12);
    veilOut.push(1, 0);
  });
  const veil = useTransform(x, veilIn, veilOut);
  // the footage drifts toward you as it plays: the camera is still arriving
  const dolly = useTransform(x, (v) => 1.08 - 0.08 * clamp((v % 1) / 0.8, 0, 1));

  return (
    <section ref={root} id="portfolio" aria-label="The portfolio" className="relative" style={{ height: `${n * PER}vh` }}>
      <div className="sticky top-0 h-svh overflow-hidden bg-paper">
        <motion.canvas ref={canvas} aria-hidden="true" className="absolute inset-0 size-full" style={{ scale: dolly }} />
        {/* soften the top and bottom so the floating nav and the project card always read */}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-ink/25 via-transparent to-ink/30" />

        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-paper bg-[radial-gradient(80%_60%_at_50%_100%,rgb(196_155_76/0.22),transparent_70%)]"
          style={{ opacity: veil }}
        />

        {order.map((id, b) => (
          <BuildingName key={id} id={id} b={b} x={x} />
        ))}
        {order.map((id, b) => (
          <Card key={id} id={id} b={b} x={x} onOpen={onOpen} />
        ))}
        <Altimeter x={x} />
      </div>
    </section>
  );
}

// the next building's name, set large in the sky before the descent onto it
function BuildingName({ id, b, x }) {
  const p = projects[id];
  // the first name is already waiting in the sky when the hero scrolls away
  const opacity = useTransform(x, [b - 0.1, b - 0.03, b + 0.03, b + 0.1], [b === 0 ? 1 : 0, 1, 1, 0]);
  const y = useTransform(x, [b - 0.1, b + 0.1], ["14%", "-24%"]);
  return (
    <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 grid place-items-center px-4 text-center" style={{ opacity, y }}>
      <div>
        <span className="mx-auto mb-6 block size-2.5 rounded-full" style={{ background: p.accent }} />
        <p className="font-display text-[clamp(3rem,10vw,9rem)] leading-[0.92] tracking-[-0.03em] text-ink">{p.name}</p>
        <p className="font-inscription mt-5 text-[clamp(0.7rem,1vw,0.9rem)] tracking-[0.32em] text-gold-ink uppercase">{p.tagline}</p>
      </div>
    </motion.div>
  );
}

// the project card rises in the project's colour once its building has arrived
function Card({ id, b, x, onOpen }) {
  const p = projects[id];
  const self = useRef(null);
  const opacity = useTransform(x, [b + 0.56, b + 0.64, b + 0.82, b + 0.88], [0, 1, 1, 0]);
  const y = useTransform(x, [b + 0.56, b + 0.66], [40, 0]);
  const pointerEvents = useTransform(opacity, (o) => (o > 0.5 ? "auto" : "none"));
  const open = () => onOpen(id, self.current.getBoundingClientRect());

  return (
    <motion.article
      ref={self}
      aria-label={p.name}
      className="absolute inset-x-3 bottom-3 rounded-[8px] p-[clamp(20px,2.6vw,36px)] text-paper shadow-[0_30px_60px_-30px_rgb(12_21_38/0.6)] sm:inset-x-auto sm:bottom-[clamp(24px,6vh,64px)] sm:left-[clamp(16px,4vw,64px)] sm:w-[min(520px,46vw)]"
      style={{ opacity, y, pointerEvents, background: p.accent }}
    >
      <p className="font-inscription flex items-center gap-3 text-[0.68rem] tracking-[0.3em] text-champagne uppercase">
        <span className="h-px w-8 bg-gold" />
        {p.tagline}
      </p>
      <h3 className="font-display mt-4 text-[clamp(2.2rem,4vw,3.6rem)] leading-[0.95] tracking-[-0.03em]">{p.name}</h3>
      <p className="mt-4 hidden max-w-[46ch] leading-relaxed text-paper/85 sm:block">{p.statement.split(/(?<=\.)\s/)[0]}</p>
      {p.facts.length > 0 && (
        <dl className="mt-6 grid grid-cols-2 border-t border-champagne/30">
          {p.facts.slice(0, 4).map(([label, value]) => (
            <div key={label} className="border-b border-champagne/30 py-2.5 pr-4">
              <dt className="font-inscription text-[0.58rem] tracking-[0.24em] text-champagne/75 uppercase">{label}</dt>
              <dd className="mt-0.5 text-[0.95rem] tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>
      )}
      <a
        href={siteUrl(id)}
        onClick={inPlace(open)}
        className="font-inscription mt-7 flex w-fit items-center gap-3 rounded-full bg-paper px-6 py-3.5 text-[0.72rem] tracking-[0.26em] text-ink uppercase transition-[background-color,transform] duration-200 hover:bg-gold active:scale-[0.97]"
      >
        Explore {p.name}
        <svg viewBox="0 0 24 10" className="w-5" aria-hidden="true">
          <path d="M0 5h22M18 1l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.3" />
        </svg>
      </a>
    </motion.article>
  );
}

// a thin altitude rail on the right: one stop per building in its colour, a marker that descends
function Altimeter({ x }) {
  const top = useTransform(x, (v) => `${(clamp(v, 0, order.length) / order.length) * 100}%`);
  return (
    <div aria-hidden="true" className="pointer-events-none absolute top-1/2 right-[clamp(12px,2vw,28px)] hidden h-[42vh] w-px -translate-y-1/2 bg-paper/40 md:block">
      {order.map((id, b) => (
        <span
          key={id}
          className="absolute left-1/2 size-2 -translate-x-1/2 rounded-full ring-1 ring-paper/80"
          style={{ top: `${((b + 0.7) / order.length) * 100}%`, background: projects[id].accent }}
        />
      ))}
      <motion.span className="absolute left-1/2 h-6 w-[3px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold" style={{ top }} />
    </div>
  );
}

function Forthcoming({ onSection }) {
  const self = useRef(null);
  const active = useInView(self, { amount: 0.55 });
  useEffect(() => {
    if (active) onSection("soon");
  }, [active, onSection]);
  return (
    <article ref={self} aria-label="Forthcoming" className="relative grid min-h-svh place-items-center overflow-hidden bg-champagne">
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
                <a
                  href={siteUrl(id)}
                  onClick={inPlace((e) => onOpen(id, e.currentTarget.getBoundingClientRect()))}
                  className="flex items-center gap-3 text-ink underline-offset-4 hover:underline"
                >
                  <span className="size-2 rounded-full" style={{ background: projects[id].accent }} />
                  {projects[id].name}
                </a>
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

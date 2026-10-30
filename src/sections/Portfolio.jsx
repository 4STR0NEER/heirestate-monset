import { memo, useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { Mark } from "@/components/Logo";
import Reveal from "@/components/Reveal";
import Agents from "@/sections/Agents";
import Enquiry from "@/sections/Enquiry";
import { FINS } from "@/lib/fins";
import { sequence } from "@/lib/frames";
import { brushEdge } from "@/lib/ink";
import { inPlace, siteUrl } from "@/lib/links";
import { order, projects, showcase } from "@/projects";

const EASE = [0.23, 1, 0.32, 1];
const GUTTER = "px-[clamp(16px,4vw,64px)]";
const PER = 320; // scroll length per building, in viewport heights
// where each tower sits across its footage, so a narrow phone screen crops around the building
const FOCUS = { alto: 0.5, wave: 0.42, pristina: 0.5 };
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

// memo: the nav's section label changes as you scroll and re-renders the page around it;
// this section's own props never change with it, so it sits that render out
export default memo(function Portfolio({ onOpen, onSection }) {
  // the projects the agents handle, and what a button further up asked the desk for
  const sold = order.filter((id) => projects[id].agent);
  const [ask, setAsk] = useState(null);
  const book = (unit) => {
    setAsk({ intent: "viewing", unit, n: Date.now() });
    requestAnimationFrame(() => document.getElementById("enquiry")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };
  return (
    <>
      <Descent onOpen={onOpen} onSection={onSection} />
      <Forthcoming onSection={onSection} sold={sold} onBook={book} />
      {sold.length > 0 && <Agents agent={projects[sold[0]].agent} handles={sold} onSection={onSection} onBook={book} />}
      {sold.length > 0 && (
        <Enquiry
          agent={projects[sold[0]].agent}
          name={sold.map((id) => projects[id].name).join(" and ")}
          units={sold.map((id) => ({ id, name: projects[id].name }))}
          pick="Project"
          developer="Renders and films are each project's developer's; layouts, areas and prices are confirmed by the agents."
          ask={ask}
        />
      )}
      <Footer onOpen={onOpen} />
    </>
  );
});

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
      // the footage is 1024 wide: on a phone or tablet a denser canvas only adds work, not detail
      const dpr = innerWidth < 1024 ? 1 : Math.min(devicePixelRatio, 1.5);
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
          className="pointer-events-none absolute inset-0 bg-paper bg-[radial-gradient(80%_60%_at_50%_100%,color-mix(in_oklab,var(--color-gold)_22%,transparent),transparent_70%)]"
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
        <p className="font-display mt-4 text-[clamp(1.1rem,1.8vw,1.6rem)] text-gold-ink italic">{p.tagline}</p>
      </div>
    </motion.div>
  );
}

// The project card rises in the project's colour once its building has arrived, carrying the
// edge its own site is drawn with (The Wave's brush, Alto Ranudo's fins), so the card reads as a
// leaf of that site rather than a label laid over the film. It stands off the footage on a
// stack of shadows.
function Card({ id, b, x, onOpen }) {
  const p = projects[id];
  const self = useRef(null);
  const opacity = useTransform(x, [b + 0.56, b + 0.64, b + 0.82, b + 0.88], [0, 1, 1, 0]);
  const y = useTransform(x, [b + 0.56, b + 0.66], [40, 0]);
  const pointerEvents = useTransform(opacity, (o) => (o > 0.5 ? "auto" : "none"));
  const open = () => onOpen(id, self.current.getBoundingClientRect());
  const edge = useMemo(() => (p.motif === "fins" ? null : brushEdge(11 + b * 7)), [p.motif, b]);

  return (
    <motion.article
      ref={self}
      aria-label={p.name}
      className="absolute inset-x-3 bottom-3 text-paper sm:inset-x-auto sm:bottom-[clamp(24px,6vh,64px)] sm:left-[clamp(16px,4vw,64px)] sm:w-[min(540px,46vw)]"
      style={{ opacity, y, pointerEvents, "--accent": p.accent }}
    >
      {/* the edge of the project's own site, in its colour */}
      <svg viewBox="0 0 1000 60" preserveAspectRatio="none" aria-hidden="true" className="absolute bottom-[calc(100%-1px)] left-0 h-[clamp(18px,2.4vw,30px)] w-full fill-(--accent)">
        {p.motif === "fins" ? FINS.map((f, i) => <rect key={i} x={f.x} y={60 - f.h} width="5" height={f.h} />) : <path d={edge} />}
      </svg>
      <div className="relative bg-(--accent) p-[clamp(20px,2.6vw,36px)] shadow-lift">
        <div className="flex items-baseline justify-between gap-4">
          <p className="font-display text-[1.05rem] text-champagne italic">{p.tagline}</p>
          <p className="text-[0.85rem] text-paper/60 tabular-nums">
            {String(b + 1).padStart(2, "0")} / {String(order.length).padStart(2, "0")}
          </p>
        </div>
        <h3 className="font-display mt-3 text-[clamp(2.2rem,4vw,3.6rem)] leading-[0.95] tracking-[-0.03em]">{p.name}</h3>
        <p className="mt-4 hidden max-w-[46ch] leading-relaxed text-paper/85 sm:block">{p.statement.split(/(?<=\.)\s/)[0]}</p>
        {p.facts.length > 0 && (
          <dl className="mt-6 grid grid-cols-2 border-t border-paper/20">
            {p.facts.slice(0, 4).map(([label, value]) => (
              <div key={label} className="border-b border-paper/20 py-2.5 pr-4">
                <dt className="text-[0.82rem] text-paper/60">{label}</dt>
                <dd className="mt-0.5 text-[0.95rem] tabular-nums">{value}</dd>
              </div>
            ))}
          </dl>
        )}
        <a
          href={siteUrl(id)}
          onClick={inPlace(open)}
          className="mt-7 flex w-fit items-center gap-3 rounded-full bg-paper px-6 py-3.5 text-ink transition-[background-color,transform] duration-200 hover:bg-champagne active:scale-[0.97] motion-reduce:transform-none"
        >
          Visit {p.name}
          <svg viewBox="0 0 24 10" className="w-5" aria-hidden="true">
            <path d="M0 5h22M18 1l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.3" />
          </svg>
        </a>
      </div>
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

// The two projects not yet announced, as two windows still shuttered on a night facade: behind
// the louvres the Lit Window glows and slowly breathes, the way the mark lights its tower. Until
// they open, the way to an agent is through the projects already here.
function Forthcoming({ onSection, sold, onBook }) {
  const self = useRef(null);
  const active = useInView(self, { amount: 0.55 });
  useEffect(() => {
    if (active) onSection("soon");
  }, [active, onSection]);
  const shut = showcase.filter((s) => s === "soon").length;

  return (
    <article ref={self} aria-labelledby="soon-title" className="relative overflow-hidden bg-navy-deep text-paper">
      <div className={`mx-auto grid min-h-svh max-w-[1480px] items-center gap-x-20 gap-y-14 py-[clamp(88px,14vh,160px)] md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] ${GUTTER}`}>
        <div aria-hidden="true" className="flex justify-center gap-[clamp(16px,3vw,40px)]">
          {Array.from({ length: shut }, (_, i) => (
            <div key={i} className="relative aspect-[5/11] w-[clamp(110px,15vw,190px)] overflow-hidden border border-gold/40 bg-navy shadow-lift">
              <span className="glow absolute inset-[18%_14%] rounded-[2px] bg-gold" style={{ animationDelay: `${i * 1.7}s` }} />
              {/* the louvres, slat over slat */}
              <span className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,var(--color-navy-deep)_0_9px,transparent_9px_13px)] opacity-90" />
              <span className="absolute inset-0 border-[6px] border-navy-deep" />
            </div>
          ))}
        </div>
        <Reveal>
          <Mark className="h-14 w-auto text-paper" />
          <p data-rise className="font-display mt-8 text-[1.15rem] text-champagne italic">
            Forthcoming
          </p>
          <h3 id="soon-title" data-split className="font-display mt-3 text-[clamp(2.6rem,5.5vw,5rem)] leading-[0.95] tracking-[-0.03em]">
            Two more windows, still shuttered
          </h3>
          <p data-rise className="mt-6 max-w-[40ch] text-[1.05rem] text-paper/75">
            The fourth and fifth Heir Estates projects are still on the drawing board. They will be unveiled here first.
          </p>
          {sold.length > 0 && (
            <div data-rise className="mt-9 flex flex-wrap gap-3">
              {sold.map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => onBook(id)}
                  className="rounded-full border border-paper/30 px-5 py-3 transition-[background-color,color,border-color,transform] duration-200 hover:border-champagne hover:bg-champagne hover:text-ink active:scale-[0.97] motion-reduce:transform-none"
                >
                  Enquire about {projects[id].name}
                </button>
              ))}
            </div>
          )}
        </Reveal>
      </div>
    </article>
  );
}

// The foot of the collection: the house's name set huge in outline, each project with its
// picture and line, who to speak to, and the way back up.
function Footer({ onOpen }) {
  const agent = order.map((id) => projects[id].agent).find(Boolean);
  const sold = order.filter((id) => projects[id].agent).map((id) => projects[id].name);
  return (
    <footer className="relative overflow-hidden bg-paper">
      <div className={`mx-auto grid max-w-[1480px] gap-x-16 gap-y-12 pt-[clamp(72px,12vh,128px)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] ${GUTTER}`}>
        <div>
          <Mark className="h-12 w-auto text-ink" />
          <p className="font-display mt-6 max-w-[18ch] text-[clamp(1.8rem,3vw,2.6rem)] leading-[1.08] text-ink">Securing wealth, creating your legacy.</p>
          {agent && (
            <p className="mt-8 border-t border-ink/12 pt-5 text-[0.95rem] text-ink/75">
              Enquiries for {sold.join(" and ")}: <a href="#enquiry" className="text-ink underline underline-offset-4">{agent.names}, {agent.firm}</a>.
            </p>
          )}
        </div>
        <nav aria-label="Projects">
          <ul className="grid gap-4 sm:grid-cols-3">
            {order.map((id) => (
              <li key={id}>
                <a
                  href={siteUrl(id)}
                  onClick={inPlace((e) => onOpen(id, e.currentTarget.getBoundingClientRect()))}
                  className="group block"
                  style={{ "--accent": projects[id].accent }}
                >
                  <span className="relative block overflow-hidden rounded-[4px] shadow-lift">
                    <img src={`${projects[id].panel}.jpg`} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover" />
                    <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-(--accent) transition-transform duration-500 ease-(--ease-out-strong) group-hover:scale-x-100" />
                  </span>
                  <span className="mt-3 flex items-center gap-2">
                    <span aria-hidden="true" className="size-2 rounded-full bg-(--accent)" />
                    <span className="font-display text-[1.25rem] text-ink">{projects[id].name}</span>
                  </span>
                  <span className="font-display mt-0.5 block text-gold-ink italic">{projects[id].tagline}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* the house's name, set across the foot in outline */}
      <p aria-hidden="true" className="outline-word font-display mt-[clamp(48px,8vh,96px)] text-center text-[clamp(4rem,15vw,15rem)] leading-[0.8] whitespace-nowrap select-none">
        Heir Estates
      </p>
      <div className={`mx-auto flex max-w-[1480px] flex-wrap justify-between gap-4 border-t border-ink/10 py-6 text-[0.85rem] text-charcoal/70 ${GUTTER}`}>
        <span>© {new Date().getFullYear()} Heir Estates</span>
        <span>Renders and films by each project’s developer.</span>
        <a href="#top" className="text-ink underline-offset-4 hover:underline">
          Back to the top
        </a>
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

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { animate, stagger } from "animejs";
import { AnimatePresence, motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
import Logo, { Mark } from "@/components/Logo";
import { inPlace, siteUrl } from "@/lib/links";
import { useMedia } from "@/lib/use-media";
import Residences from "@/sections/Residences";
import Walkthrough from "@/sections/Walkthrough";
import { order, projects } from "@/projects";

const EASE = [0.23, 1, 0.32, 1];
const EASE_IO = [0.77, 0, 0.175, 1];
const GUTTER = "px-[clamp(16px,4vw,64px)]";
// the stills keep their native proportions so the horizontal track can be measured before they load
const SIZES = { alto: [1600, 688], wave: [1530, 640], pristina: [1600, 800] };

const insetOf = (r) => `inset(${r.top}px ${innerWidth - r.right}px ${innerHeight - r.bottom}px ${r.left}px)`;
const FULL = "inset(0px 0px 0px 0px)";


// The project opens out of the window that was clicked: the overlay starts clipped to that
// window's glass and expands to the screen. Without an origin (deep link, next project) it fades.
export default function ProjectView({ id, origin, onClose, onGo }) {
  const scroller = useRef(null);
  const closeBtn = useRef(null);
  const reduce = useReducedMotion();
  const clip = origin && !reduce;

  useEffect(() => {
    const before = document.activeElement;
    const html = document.documentElement;
    html.style.overflow = "hidden";
    closeBtn.current?.focus({ preventScroll: true });
    const onKey = (e) => e.key === "Escape" && onClose();
    addEventListener("keydown", onKey);
    return () => {
      removeEventListener("keydown", onKey);
      html.style.overflow = "";
      before?.focus?.({ preventScroll: true });
    };
  }, [onClose]);

  useEffect(() => {
    scroller.current?.scrollTo(0, 0);
  }, [id]);

  return (
    <motion.div
      ref={scroller}
      role="dialog"
      aria-modal="true"
      aria-label={projects[id].name}
      className="fixed inset-0 z-30 overflow-y-auto overscroll-contain bg-paper"
      initial={clip ? { clipPath: insetOf(origin) } : { opacity: 0 }}
      animate={clip ? { clipPath: FULL } : { opacity: 1 }}
      exit={clip ? { clipPath: insetOf(origin), transition: { duration: 0.7, ease: EASE_IO } } : { opacity: 0, transition: { duration: 0.4 } }}
      transition={{ duration: clip ? 0.95 : 0.5, ease: EASE_IO }}
    >
      <div className="sticky top-0 z-20 h-0">
        {/* a soft fade behind the bar keeps logo and close button legible over any section */}
        <div className={`flex items-center justify-between bg-linear-to-b from-paper/90 via-paper/50 to-transparent pt-6 pb-8 ${GUTTER}`}>
          <button type="button" onClick={onClose} aria-label="Back to the facade">
            <Logo />
          </button>
          <button
            ref={closeBtn}
            type="button"
            onClick={onClose}
            aria-label="Close project"
            className="grid size-12 place-items-center rounded-full border border-ink/20 bg-paper/70 text-ink backdrop-blur-sm transition-[background-color,color,transform] duration-200 hover:bg-ink hover:text-paper active:scale-95"
          >
            <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{ "--accent": projects[id].accent }}
        >
          <Project id={id} scroller={scroller} onClose={onClose} onGo={onGo} opened={clip} />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

// A project's own site (alto.<domain>, ...): the same page, scrolling the window, with the
// collection one link away instead of a close button.
export function ProjectPage({ id }) {
  // arriving from the collection, the page is covered in its colour (sites.js); lift it like a blind
  useEffect(() => {
    const html = document.documentElement;
    if (!("arrive" in html.dataset)) return;
    const done = () => delete html.dataset.arrive;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return done();
    html
      .animate([{ clipPath: "inset(0 0 0 0)" }, { clipPath: "inset(0 0 100% 0)" }], {
        duration: 900,
        delay: 150,
        easing: "cubic-bezier(0.77, 0, 0.175, 1)",
        pseudoElement: "::before",
        fill: "forwards",
      })
      .finished.then(done, done);
  }, []);

  return (
    <main style={{ "--accent": projects[id].accent }}>
      <div className="sticky top-0 z-20 h-0">
        <div className={`flex items-center justify-between bg-linear-to-b from-paper/90 via-paper/50 to-transparent pt-6 pb-8 ${GUTTER}`}>
          <a href={siteUrl()} aria-label="Heir Estate, the collection">
            <Logo />
          </a>
          {/* a round arrow on phones, where the logo leaves no room for the label */}
          <a
            href={siteUrl()}
            aria-label="The collection"
            className="font-inscription grid size-12 place-items-center rounded-full border border-ink/20 bg-paper/70 text-[0.7rem] tracking-[0.26em] text-ink uppercase backdrop-blur-sm transition-colors duration-200 hover:bg-ink hover:text-paper sm:block sm:size-auto sm:px-5 sm:py-3"
          >
            <svg viewBox="0 0 24 10" className="w-5 sm:hidden" aria-hidden="true">
              <path d="M24 5H2M6 1L2 5l4 4" fill="none" stroke="currentColor" strokeWidth="1.3" />
            </svg>
            <span className="hidden sm:inline">The collection</span>
          </a>
        </div>
      </div>
      <Project id={id} heading="h1" />
    </main>
  );
}

// onClose and onGo are set inside the main site's overlay; without them the links leave for the other site
function Project({ id, scroller, onClose, onGo, opened, heading: Title = "h2" }) {
  const p = projects[id];
  const nextId = order[(order.indexOf(id) + 1) % order.length];
  const film = useRef(null);
  // when the overlay grew out of a window, the title waits for the glass to finish opening
  const t0 = opened ? 0.55 : 0.15;

  return (
    <>
      <section className="relative h-svh overflow-hidden">
        <motion.video
          src={`${p.hero}.mp4`}
          poster={`${p.hero}.jpg`}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
          className="absolute inset-0 size-full object-cover"
          initial={{ scale: 1.18 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: EASE }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-paper via-paper/35 to-paper/0" />
        <div className={`absolute inset-x-0 bottom-0 flex flex-col gap-8 pb-[clamp(32px,7vh,80px)] md:flex-row md:items-end md:justify-between ${GUTTER}`}>
          <div>
            <Title className="font-display text-[clamp(3.2rem,10vw,9.5rem)] leading-[0.92] font-normal tracking-[-0.03em] text-ink">
              {p.name.split(" ").map((w, i) => (
                <span key={i} className="mr-[0.22em] inline-block overflow-hidden pb-[0.08em] align-bottom">
                  <motion.span
                    className="inline-block"
                    initial={{ transform: "translateY(105%)" }}
                    animate={{ transform: "translateY(0%)" }}
                    transition={{ duration: 1.1, ease: EASE, delay: t0 + i * 0.08 }}
                  >
                    {w}
                  </motion.span>
                </span>
              ))}
            </Title>
            <motion.p
              className="font-inscription mt-4 text-[clamp(0.75rem,1.1vw,1rem)] tracking-[0.3em] text-gold-ink uppercase"
              initial={{ opacity: 0, filter: "blur(6px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 1, ease: EASE, delay: t0 + 0.35 }}
            >
              {p.tagline}
            </motion.p>
            {p.kicker && (
              <motion.p
                className="mt-2 text-ink/70"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: t0 + 0.5 }}
              >
                {p.kicker}
              </motion.p>
            )}
          </div>
          <motion.button
            type="button"
            onClick={() => film.current?.scrollIntoView({ behavior: "smooth", block: "center" })}
            className="group font-inscription flex items-center gap-4 self-start text-[0.8rem] tracking-[0.3em] text-ink uppercase md:self-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: t0 + 0.6 }}
          >
            <PlayRing className="size-14" />
            Watch the film
          </motion.button>
        </div>
      </section>

      <section className={`mx-auto grid max-w-[1440px] gap-14 py-[clamp(88px,16vh,180px)] md:grid-cols-[1.35fr_1fr] md:gap-20 ${GUTTER}`}>
        <Rise className="font-display max-w-[32ch] text-[clamp(1.45rem,2.5vw,2.35rem)] leading-[1.28] text-ink">
          {p.statement}
        </Rise>
        {p.facts.length > 0 && <TitleBlock name={p.name} facts={p.facts} />}
      </section>

      <Gallery id={id} items={p.spaces} scroller={scroller} />
      {p.residences && <Residences units={p.residences} name={p.name} />}
      {p.walkthrough && <Walkthrough walk={p.walkthrough} unit={`${p.name}, one bedroom`} />}
      {p.nearby && <Nearby places={p.nearby} />}
      <Film ref={film} src={p.film} name={p.name} />
      {p.agent && <Agent agent={p.agent} name={p.name} />}

      <a href={siteUrl(nextId)} onClick={onGo && inPlace(() => onGo(nextId))} className="group relative block h-[62svh] w-full overflow-hidden text-left">
        <img
          src={`${projects[nextId].hero}.jpg`}
          alt=""
          loading="lazy"
          className="absolute inset-0 size-full scale-105 object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-100"
        />
        <div className="absolute inset-0 bg-ink/55 transition-colors duration-700 group-hover:bg-ink/35" />
        <div className={`absolute inset-x-0 bottom-0 pb-[clamp(32px,7vh,80px)] ${GUTTER}`}>
          <span className="font-display block text-[clamp(2.6rem,7vw,6.5rem)] leading-none tracking-[-0.03em] text-paper">
            {projects[nextId].name}
          </span>
          <span className="font-inscription mt-4 flex items-center gap-3 text-[0.78rem] tracking-[0.3em] text-gold uppercase">
            Next project
            <svg viewBox="0 0 24 10" className="w-6 transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden="true">
              <path d="M0 5h22M18 1l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </span>
        </div>
      </a>

      <footer className={`flex items-center justify-between py-10 ${GUTTER}`}>
        <a href={siteUrl()} onClick={onClose && inPlace(onClose)} className="font-inscription text-[0.78rem] tracking-[0.3em] text-ink/75 uppercase hover:text-gold-ink">
          Back to the facade
        </a>
        <Mark className="h-8 w-auto text-ink/70" />
      </footer>
    </>
  );
}

function Rise({ children, className, as: Tag = motion.p }) {
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, transform: "translateY(24px)", filter: "blur(6px)" }}
      whileInView={{ opacity: 1, transform: "translateY(0px)", filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1.1, ease: EASE }}
    >
      {children}
    </Tag>
  );
}

// the spec sheet drawn like the title block in the corner of an architect's elevation
function TitleBlock({ name, facts }) {
  return (
    <motion.dl
      className="self-start border border-ink/20"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1, ease: EASE, delay: 0.15 }}
    >
      <div className="flex items-center justify-between gap-4 bg-(--accent) px-5 py-4 text-paper">
        <span className="font-inscription text-[0.72rem] tracking-[0.3em] uppercase">{name}</span>
        <Mark className="h-6 w-auto text-paper/90" />
      </div>
      {facts.map(([label, value], i) => (
        <motion.div
          key={label}
          className="grid grid-cols-[minmax(7.5rem,auto)_1fr] gap-4 border-b border-ink/10 px-5 py-3.5 last:border-b-0"
          initial={{ opacity: 0, transform: "translateX(-8px)" }}
          whileInView={{ opacity: 1, transform: "translateX(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.25 + i * 0.05 }}
        >
          <dt className="font-inscription pt-0.5 text-[0.68rem] tracking-[0.24em] text-ink/55 uppercase">{label}</dt>
          <dd className="text-ink tabular-nums">{value}</dd>
        </motion.div>
      ))}
    </motion.dl>
  );
}

// Desktop: the section pins and vertical scroll pans the renders sideways.
// Phones: a plain swipeable row with snap points.
function Gallery({ id, items, scroller }) {
  const wide = useMedia("(min-width: 768px)");
  const section = useRef(null);
  const track = useRef(null);
  const [dist, setDist] = useState(0);
  const [w, h] = SIZES[id];

  useLayoutEffect(() => {
    if (!wide) return;
    const measure = () => setDist(Math.max(0, track.current.scrollWidth - innerWidth));
    const ro = new ResizeObserver(measure);
    ro.observe(track.current);
    return () => ro.disconnect();
  }, [wide, id]);

  const { scrollYProgress } = useScroll({ container: scroller, target: section, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist]);

  const heading = (
    <div className={`mb-8 flex items-end justify-between gap-6 ${GUTTER}`}>
      <h3 className="font-display text-[clamp(2rem,4vw,3.6rem)] leading-none tracking-[-0.02em]">Spaces</h3>
      {wide && (
        <div className="mb-2 h-px w-[min(240px,30vw)] bg-ink/10">
          <motion.div className="h-px origin-left bg-(--accent)" style={{ scaleX: scrollYProgress }} />
        </div>
      )}
    </div>
  );

  const card = (s, i) => (
    <figure key={s.src} className={wide ? "shrink-0" : "w-[86vw] shrink-0 snap-center"}>
      {/* the wrapper is what gets observed: a clipped element has no visible area, so it never "enters" */}
      <motion.div
        className="group overflow-hidden bg-stone"
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.img
          src={s.src}
          alt={s.name}
          width={w}
          height={h}
          loading="lazy"
          decoding="async"
          className={`${wide ? "h-[min(56vh,560px)] w-auto" : "h-auto w-full"} object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.04]`}
          variants={{ hidden: { clipPath: "inset(0 0 100% 0)" }, shown: { clipPath: "inset(0 0 0% 0)" } }}
          transition={{ duration: 1.1, ease: EASE_IO, delay: wide ? 0 : 0.05 * i }}
        />
      </motion.div>
      <figcaption className="mt-4 flex items-baseline justify-between gap-6">
        <span className="font-display text-[clamp(1.05rem,1.4vw,1.35rem)]">{s.name}</span>
        {s.area && <span className="font-inscription text-[0.72rem] tracking-[0.24em] text-ink/60 uppercase tabular-nums">{s.area}</span>}
      </figcaption>
    </figure>
  );

  if (!wide)
    return (
      <section ref={section} className="pb-24">
        {heading}
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none]">{items.map(card)}</div>
      </section>
    );

  return (
    <section ref={section} style={{ height: `calc(100svh + ${dist}px)` }} className="relative">
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        {heading}
        <motion.div ref={track} style={{ x }} className={`flex w-max gap-[clamp(20px,2.4vw,40px)] ${GUTTER}`}>
          {items.map(card)}
        </motion.div>
      </div>
    </section>
  );
}

// A measured scale, not a list: each bar is the real distance on one linear kilometre axis.
// anime.js draws the bars out in order once the section is on screen.
function Nearby({ places }) {
  const root = useRef(null);
  const inView = useInView(root, { once: true, margin: "-120px" });
  const max = Math.ceil(Math.max(...places.map(([, km]) => km)));

  useEffect(() => {
    if (!inView) return;
    const bars = root.current.querySelectorAll("[data-bar]");
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return void bars.forEach((b) => (b.style.transform = "none"));
    const a = animate(bars, { scaleX: [0, 1], duration: 1200, delay: stagger(70), ease: "outExpo" });
    return () => a.pause();
  }, [inView]);

  return (
    <section ref={root} className={`mx-auto max-w-[1200px] py-[clamp(88px,14vh,160px)] ${GUTTER}`}>
      <h3 className="font-display text-[clamp(2rem,4vw,3.6rem)] leading-none tracking-[-0.02em]">Within reach</h3>
      <p className="mt-3 text-ink/65">Distances from The Wave, in kilometres.</p>
      <ol className="mt-12">
        {places.map(([name, km]) => (
          <li key={name} className="grid grid-cols-[minmax(0,1fr)_3.5rem] items-center gap-x-4 border-b border-ink/10 py-3 md:grid-cols-[18rem_minmax(0,1fr)_4rem]">
            <span className="text-ink">{name}</span>
            <span className="order-last col-span-2 mt-2 h-px bg-ink/10 md:order-none md:col-span-1 md:mt-0">
              <span data-bar className="block h-px origin-left bg-gold" style={{ width: `${(km / max) * 100}%`, transform: "scaleX(0)" }} />
            </span>
            <span className="font-inscription text-right text-[0.8rem] tracking-[0.12em] text-gold-ink tabular-nums">{km} km</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

// The agent's card, set as a quiet closing: who to speak to, and the two ways to reach them.
function Agent({ agent, name }) {
  const row =
    "group flex items-center justify-between gap-6 border-b border-ink/12 py-5 text-[clamp(1.15rem,1.8vw,1.5rem)] text-ink transition-colors duration-200 hover:text-(--accent)";
  const arrow = (
    <svg viewBox="0 0 24 10" className="w-6 shrink-0 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
      <path d="M0 5h22M18 1l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
  return (
    <section aria-labelledby="agent" className="bg-stone">
      <div className={`mx-auto grid max-w-[1440px] gap-12 py-[clamp(88px,14vh,160px)] md:grid-cols-[1fr_1.1fr] md:gap-20 ${GUTTER}`}>
        <div>
          <h3 id="agent" className="font-display text-[clamp(2rem,4vw,3.6rem)] leading-none tracking-[-0.02em] text-ink">
            Speak to an agent
          </h3>
          <p className="mt-5 max-w-[36ch] text-ink/70">For viewings of the dress-up units, availability and pricing at {name}.</p>
          <p className="font-display mt-10 text-[1.6rem] leading-tight text-ink">{agent.names}</p>
          <p className="mt-1 text-ink/70">
            {agent.role}, {agent.firm}
          </p>
          <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-3">
            {agent.licences.map(([k, v]) => (
              <div key={k}>
                <dt className="font-inscription text-[0.62rem] tracking-[0.24em] text-ink/55 uppercase">{k}</dt>
                <dd className="mt-0.5 text-ink tabular-nums">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="self-end border-t border-ink/12">
          {agent.phones.map((t) => (
            <a key={t} href={`tel:${t.replace(/\s/g, "")}`} className={`${row} tabular-nums`}>
              <span>
                <span className="font-inscription mr-4 text-[0.66rem] tracking-[0.24em] text-ink/55 uppercase">Call</span>
                {t}
              </span>
              {arrow}
            </a>
          ))}
          <a href={`mailto:${agent.email}?subject=${encodeURIComponent(name)}`} className={row}>
            <span className="min-w-0 break-all">
              <span className="font-inscription mr-4 text-[0.66rem] tracking-[0.24em] text-ink/55 uppercase">Email</span>
              {agent.email}
            </span>
            {arrow}
          </a>
        </div>
      </div>
    </section>
  );
}

function Film({ ref, src, name }) {
  const video = useRef(null);
  const [playing, setPlaying] = useState(false);
  const play = () => {
    setPlaying(true);
    video.current.play().catch(() => {});
  };
  return (
    <section ref={ref} className={`mx-auto max-w-[1440px] pb-[clamp(88px,14vh,160px)] ${GUTTER}`}>
      <h3 className="font-display mb-8 text-[clamp(2rem,4vw,3.6rem)] leading-none tracking-[-0.02em]">The walkthrough</h3>
      <div className="relative aspect-video overflow-hidden border border-ink/15 bg-stone">
        <video
          ref={video}
          src={`${src}.mp4`}
          poster={`${src}.jpg`}
          preload="none"
          playsInline
          controls={playing}
          className="size-full object-cover"
        />
        {!playing && (
          <button type="button" onClick={play} aria-label={`Play the ${name} walkthrough`} className="group absolute inset-0 grid place-items-center bg-ink/25">
            <span className="flex flex-col items-center gap-4">
              <PlayRing className="size-24 transition-transform duration-300 group-hover:scale-105 group-active:scale-95" />
              <span className="font-inscription text-[0.78rem] tracking-[0.3em] text-paper uppercase">Play the film</span>
            </span>
          </button>
        )}
      </div>
    </section>
  );
}

function PlayRing({ className }) {
  return (
    <svg viewBox="0 0 56 56" className={className} aria-hidden="true">
      <circle cx="28" cy="28" r="27" fill="rgb(12 21 38 / 0.35)" stroke="var(--color-gold)" strokeWidth="1" />
      <path d="M23 19.5v17l14-8.5z" fill="var(--color-champagne)" />
    </svg>
  );
}

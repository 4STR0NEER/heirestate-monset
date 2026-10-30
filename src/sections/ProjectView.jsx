import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Logo, { Mark } from "@/components/Logo";
import { film } from "@/lib/film";
import { inPlace, leave, siteUrl } from "@/lib/links";
import Contours from "@/components/Contours";
import Reveal from "@/components/Reveal";
import Enquiry from "@/sections/Enquiry";
import Faq from "@/sections/Faq";
import FilmHero from "@/sections/FilmHero";
import FloorStack from "@/sections/FloorStack";
import Nearby from "@/sections/Nearby";
import Partnership from "@/sections/Partnership";
import Profile from "@/sections/Profile";
import Residences from "@/sections/Residences";
import Spaces from "@/sections/Spaces";
import Terms from "@/sections/Terms";
import TourPlayer from "@/sections/TourPlayer";
import { order, projects } from "@/projects";

const EASE = [0.23, 1, 0.32, 1];
const EASE_IO = [0.77, 0, 0.175, 1];
const GUTTER = "px-[clamp(16px,4vw,64px)]";

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
      <Bar>
        {(dark) => (
          <>
            <button type="button" onClick={onClose} aria-label="Back to the facade">
              <Logo className={`transition-colors duration-300 ${dark ? "text-paper drop-shadow-[0_1px_10px_rgb(12_21_38/0.6)]" : "text-ink"}`} />
            </button>
            <button
              ref={closeBtn}
              type="button"
              onClick={onClose}
              aria-label="Close project"
              className={`grid size-12 place-items-center rounded-full border transition-[background-color,color,border-color,transform] duration-200 active:scale-95 ${ROUND[dark ? 1 : 0]}`}
            >
              <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true">
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </button>
          </>
        )}
      </Bar>

      <AnimatePresence mode="wait">
        <motion.div
          key={id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{ "--accent": projects[id].accent }}
        >
          <Project id={id} onClose={onClose} onGo={onGo} opened={clip} />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

// A project's own site (alto.<domain>, ...): the same page, scrolling the window, with the
// collection one link away instead of a close button.
export function ProjectPage({ id }) {
  // the page opens covered in its colour (sites.js), arriving from another site or not; lift it like a blind
  useEffect(() => {
    const html = document.documentElement;
    if (!("arrive" in html.dataset)) return;
    const done = () => delete html.dataset.arrive;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return done();
    // hold the card until the page beneath has its type and hero poster (at most a moment), so the
    // blind lifts on a finished page, never on one still drawing itself
    const poster = new Promise((r) => {
      const img = new Image();
      img.onload = img.onerror = r;
      img.src = `${projects[id].hero}.jpg`;
    });
    Promise.race([Promise.all([document.fonts.ready, poster]), new Promise((r) => setTimeout(r, 1200))]).then(() =>
      html
        .animate([{ clipPath: "inset(0 0 0 0)" }, { clipPath: "inset(0 0 100% 0)" }], {
          duration: 1000,
          delay: 120,
          easing: "cubic-bezier(0.77, 0, 0.175, 1)",
          pseudoElement: "::before",
          fill: "forwards",
        })
        .finished.then(done, done)
    );
  }, []);

  return (
    <main style={{ "--accent": projects[id].accent }}>
      <Bar>
        {(dark) => (
          <>
            <a href={siteUrl()} onClick={toCollection} aria-label="Heir Estates, the collection">
              <Logo className={`transition-colors duration-300 ${dark ? "text-paper drop-shadow-[0_1px_10px_rgb(12_21_38/0.6)]" : "text-ink"}`} />
            </a>
            {/* a round arrow on phones, where the logo leaves no room for the label */}
            <a
              href={siteUrl()}
              onClick={toCollection}
              aria-label="The collection"
              className={`font-inscription grid size-12 place-items-center rounded-full border text-[0.7rem] tracking-[0.26em] uppercase transition-[background-color,color,border-color] duration-200 sm:block sm:size-auto sm:px-5 sm:py-3 ${ROUND[dark ? 1 : 0]}`}
            >
              <svg viewBox="0 0 24 10" className="w-5 sm:hidden" aria-hidden="true">
                <path d="M24 5H2M6 1L2 5l4 4" fill="none" stroke="currentColor" strokeWidth="1.3" />
              </svg>
              <span className="hidden sm:inline">The collection</span>
            </a>
          </>
        )}
      </Bar>
      <Project id={id} heading="h1" />
    </main>
  );
}

const toCollection = inPlace(() => leave());

// the round buttons in the top bar, on paper and over a dark section
const ROUND = [
  "border-ink/20 bg-paper/70 text-ink hover:bg-ink hover:text-paper",
  "border-paper/30 bg-navy-deep/40 text-paper hover:bg-paper hover:text-ink",
];

// The bar over the page: logo and one way out, on a soft fade that keeps them legible. Over a
// section marked data-tone="dark" (a film, the photographs) it turns light and the fade darkens.
function Bar({ children }) {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const under = new Set();
    // only the strip under the bar counts
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? under.add(e.target) : under.delete(e.target)));
        setDark(under.size > 0);
      },
      { rootMargin: "0px 0px -92% 0px" }
    );
    document.querySelectorAll("[data-tone=dark]").forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);
  return (
    <div className="sticky top-0 z-20 h-0">
      <div className={`relative flex items-center justify-between pt-6 pb-8 ${GUTTER}`}>
        <div aria-hidden="true" className={`absolute inset-0 bg-linear-to-b from-paper/90 via-paper/50 to-transparent transition-opacity duration-300 ${dark ? "opacity-0" : ""}`} />
        <div aria-hidden="true" className={`absolute inset-0 bg-linear-to-b from-navy-deep/85 via-navy-deep/45 via-55% to-transparent transition-opacity duration-300 ${dark ? "" : "opacity-0"}`} />
        {children(dark)}
      </div>
    </div>
  );
}

// onClose and onGo are set inside the main site's overlay; without them the links leave for the other site
function Project({ id, onClose, onGo, opened, heading: Title = "h2" }) {
  const p = projects[id];
  const nextId = order[(order.indexOf(id) + 1) % order.length];
  const film = useRef(null);
  const [tour, setTour] = useState(null); // the unit whose video tour is open
  const [ask, setAsk] = useState(null); // what the last "book" or "price list" button asked for
  // every call to action lands on the enquiry desk, its reason and unit filled in
  const book = (intent = "viewing", unit) => {
    setTour(null);
    setAsk({ intent, unit, n: Date.now() });
    requestAnimationFrame(() => document.getElementById("enquiry")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };
  const [filming, setFilming] = useState(false);
  // a project that opens on its film plays the whole of it over the page; the others scroll to it
  const playFilm = p.intro ? () => setFilming(true) : () => film.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  const facts = p.facts.length > 0 && <TitleBlock name={p.name} facts={p.facts} />;
  // when the overlay grew out of a window, the title waits for the glass to finish opening
  const t0 = opened ? 0.55 : 0.15;

  return (
    <>
      {p.intro ? (
        <FilmHero p={p} Title={Title} onBook={() => book()} onFilm={playFilm}>
          <section className={`relative isolate mx-auto grid max-w-[1440px] gap-14 pt-[clamp(56px,10vh,120px)] md:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] md:gap-20 ${GUTTER}`}>
            {p.motif === "contours" && <Contours seed={7} cx={0.8} cy={0.55} className="-z-10" />}
            <Reveal by="lines">
              {p.kicker && (
                <p data-rise className="font-display text-[1.15rem] text-gold-ink italic">
                  {p.kicker}
                </p>
              )}
              <p data-split className="font-display mt-5 max-w-[30ch] text-[clamp(1.6rem,2.9vw,2.7rem)] leading-[1.25] text-ink">
                {p.statement}
              </p>
            </Reveal>
            {facts}
          </section>
          {p.venture && <Partnership venture={p.venture} />}
          {p.profile && <Profile profile={p.profile} name={p.name} />}
        </FilmHero>
      ) : (
        <>
          <section className="relative h-svh overflow-hidden">
            <motion.video
              src={film(p.hero)}
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
                  {p.name.split(" ").map((w, i) => [
              i > 0 && " ",
                    <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                      <motion.span
                        className="inline-block"
                        initial={{ transform: "translateY(105%)" }}
                        animate={{ transform: "translateY(0%)" }}
                        transition={{ duration: 1.1, ease: EASE, delay: t0 + i * 0.08 }}
                      >
                        {w}
                      </motion.span>
                    </span>
                  ])}
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
                onClick={playFilm}
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
            {facts}
          </section>
        </>
      )}

      <Spaces items={p.spaces} name={p.name} intro={p.spacesIntro} place={p.place} deck={p.deck} amenities={p.amenities} motif={p.motif} onBook={() => book()} />
      {p.tower && <FloorStack tower={p.tower} name={p.name} motif={p.motif} />}
      {p.residences && <Residences units={p.residences} name={p.name} features={p.unitFeatures} tours={p.tours?.map((t) => t.id)} onTour={setTour} onBook={book} />}
      {p.terms && <Terms terms={p.terms} onBook={p.agent && book} />}
      {p.nearby && <Nearby places={p.nearby} name={p.name} line={p.locationLine} onBook={p.agent && (() => book())} />}
      {!p.intro && <Film ref={film} src={p.film} name={p.name} />}
      <Faq id={id} name={p.name} />
      {p.agent && <Enquiry agent={p.agent} name={p.name} units={p.residences} developer={p.disclaimer} ask={ask} motif={p.motif} />}
      {p.agent && <BookBar onBook={book} phone={p.agent.phones[0]} hidden={!!tour || filming} />}
      <AnimatePresence>{filming && <FilmPlayer src={p.film} name={p.name} onClose={() => setFilming(false)} />}</AnimatePresence>
      <AnimatePresence>
        {tour && (
          <TourPlayer
            key={tour}
            tour={p.tours.find((t) => t.id === tour)}
            unit={`${p.name}, ${p.residences.find((u) => u.id === tour).name.toLowerCase()}`}
            onClose={() => setTour(null)}
            onBook={() => book("viewing", tour)}
          />
        )}
      </AnimatePresence>

      <a href={siteUrl(nextId)} onClick={inPlace((e) => (onGo ? onGo(nextId) : leave(nextId, e.currentTarget.getBoundingClientRect())))} data-tone="dark" className="group relative block h-[62svh] w-full overflow-hidden text-left">
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
        <a href={siteUrl()} onClick={onClose ? inPlace(onClose) : toCollection} className="font-inscription text-[0.78rem] tracking-[0.3em] text-ink/75 uppercase hover:text-gold-ink">
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

// The way to the enquiry desk, kept in reach once the film is behind you: a pill in the corner,
// a bar along the foot of a phone with a call button beside it. It stands aside from the desk
// onwards and while a tour is open.
function BookBar({ onBook, phone, hidden }) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    let raf = 0;
    const desk = document.getElementById("enquiry");
    // between the film and the desk; from the desk on, the desk itself is the way to book
    const update = () => {
      raf = 0;
      setShown(scrollY > innerHeight * 0.9 && (desk?.getBoundingClientRect().top ?? Infinity) > innerHeight);
    };
    const onScroll = () => raf || (raf = requestAnimationFrame(update));
    addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => (removeEventListener("scroll", onScroll), cancelAnimationFrame(raf));
  }, []);
  const on = shown && !hidden;
  return (
    <div
      inert={!on}
      className={`fixed inset-x-3 bottom-3 z-30 flex gap-2 transition-[opacity,transform] duration-300 ease-(--ease-out-strong) motion-reduce:transition-opacity sm:inset-x-auto sm:right-6 sm:bottom-6 ${
        on ? "" : "translate-y-4 opacity-0"
      }`}
    >
      <a href={`tel:${phone.replace(/\s/g, "")}`} aria-label="Call an agent" className="grid size-14 shrink-0 place-items-center rounded-full bg-navy-deep text-paper shadow-note sm:hidden">
        <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
          <path d="M6.6 3.5l2.6 3.3-1.6 2.1a12 12 0 006.5 6.5l2.1-1.6 3.3 2.6-1.4 3.1c-.3.6-1 1-1.7.9C9.7 19.6 4.4 14.3 3.6 7.6c-.1-.7.3-1.4.9-1.7z" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </a>
      <button
        type="button"
        onClick={() => onBook("viewing")}
        className="flex-1 rounded-full bg-(--accent) px-7 py-4 text-paper shadow-note transition-[background-color,transform] duration-200 hover:bg-ink active:scale-[0.97] motion-reduce:transform-none"
      >
        Book a viewing
      </button>
    </div>
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
    <section ref={ref} data-tone="dark" className="bg-navy-deep text-paper">
      <div className={`mx-auto max-w-[1440px] py-[clamp(88px,14vh,160px)] ${GUTTER}`}>
        <h3 className="font-display mb-8 text-[clamp(2rem,4vw,3.6rem)] leading-none tracking-[-0.02em]">The film</h3>
        <div className="relative aspect-video overflow-hidden border border-paper/15 bg-navy">
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
            <button type="button" onClick={play} aria-label={`Play the ${name} film`} className="group absolute inset-0 grid place-items-center bg-ink/25">
              <span className="flex flex-col items-center gap-4">
                <PlayRing className="size-24 transition-transform duration-300 group-hover:scale-105 group-active:scale-95" />
                <span className="font-inscription text-[0.78rem] tracking-[0.3em] text-paper uppercase">Play the film</span>
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

// The whole film, full screen over the page, with its own controls; Escape or the button closes it.
function FilmPlayer({ src, name, onClose }) {
  const closeBtn = useRef(null);
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
  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${name}, the film`}
      data-tone="dark"
      className="fixed inset-0 z-50 grid place-items-center bg-navy-deep p-[clamp(12px,4vw,64px)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      transition={{ duration: 0.3, ease: EASE }}
    >
      <video src={`${src}.mp4`} poster={`${src}.jpg`} controls autoPlay playsInline className="aspect-video max-h-full w-full max-w-[1600px] bg-navy" />
      <button
        ref={closeBtn}
        type="button"
        onClick={onClose}
        aria-label="Close the film"
        className="absolute top-4 right-4 grid size-12 place-items-center rounded-full border border-paper/30 bg-navy-deep/60 text-paper transition-[background-color,color,transform] duration-200 hover:bg-paper hover:text-ink active:scale-95 motion-reduce:transform-none"
      >
        <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true">
          <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </button>
    </motion.div>
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

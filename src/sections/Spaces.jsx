import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Edge from "@/components/Edge";
import Lightbox from "@/components/Lightbox";
import Reveal from "@/components/Reveal";

const EASE = [0.23, 1, 0.32, 1];
const GUTTER = "px-[clamp(16px,4vw,64px)]";

// The amenities as a walk up the tower, each floor told its own way: the arrival as full-screen
// photographs the text scrolls over, then the rest. With a plan (deck, The Wave), the sixth floor
// is the brochure's plan to explore and the thirty-seventh a window that opens onto it. Where the
// spaces mark which are the arrival (Alto Ranudo), the rest are laid out as a grid. The geometric
// motif turns the arrival's crossfade into a louvre wipe.
export default function Spaces({ items, name, intro, place, deck, amenities, motif, onBook }) {
  const marked = items.some((s) => "arrival" in s);
  const story = marked ? items.filter((s) => s.arrival) : deck ? items.filter((s) => !s.area) : items;
  const sky = deck ? items.filter((s) => s.area?.startsWith("37")) : [];
  return (
    <>
      <Story items={story} name={name} intro={intro} place={place} motif={motif} />
      {deck && <Deck deck={deck} items={items} />}
      {sky.length > 0 && <Sky items={sky} />}
      {marked && <Mosaic items={items.filter((s) => !s.arrival)} name={name} amenities={amenities} />}
      <Onward onBook={onBook} motif={motif} />
    </>
  );
}

// Each space fills the screen and its text scrolls over it, so you read about the place while
// standing in it. The photos sit in one pinned layer and crossfade as each note crosses the
// middle of the screen.
// Alto Ranudo's spaces change through louvres, North Grove's open out in a widening ring.
function Story({ items, name, intro, place, motif }) {
  const Wipe = { fins: Slats, contours: Ring }[motif];
  // the space on screen, and the one it replaced (a louvre wipe opens over it)
  const [[active, prev], setPair] = useState([0, -1]);
  const setActive = (n) => setPair(([a, b]) => (n === a ? [a, b] : [n, a]));
  // a photo loads once the reader is one space away from it, then stays
  const [reach, setReach] = useState(1);
  const cards = useRef([]);

  useEffect(() => {
    // the card crossing the middle of the screen owns the background
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number(e.target.dataset.bg));
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );
    cards.current.forEach((n) => n && io.observe(n));
    return () => io.disconnect();
  }, []);

  useEffect(() => setReach((r) => Math.max(r, active + 1)), [active]);

  const card = (i) => (n) => void (cards.current[i] = n);

  return (
    <section aria-labelledby="spaces" data-tone="dark" className="relative bg-navy-deep text-paper">
      <Edge motif={motif} />
      <div className="sticky top-0 h-svh overflow-hidden">
        {items.map(
          (s, i) =>
            i <= reach &&
            (Wipe ? (
              <Wipe key={s.src} s={s} state={i === active ? "on" : i === prev ? "under" : "off"} />
            ) : (
              <img
                key={s.src}
                src={s.src}
                alt=""
                loading="lazy"
                decoding="async"
                className={`absolute inset-0 size-full object-cover transition-[opacity,scale] ease-(--ease-out-strong) motion-reduce:transition-none ${
                  i === active ? "scale-100 opacity-100 [transition-duration:800ms,1800ms]" : "scale-[1.06] opacity-0 [transition-duration:700ms,900ms]"
                }`}
                style={{ objectPosition: s.pos }}
              />
            ))
        )}
        {/* the text side darkens: the foot of the screen on phones, the left on wider screens */}
        <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-navy-deep/95 via-navy-deep/65 via-50% to-navy-deep/10 md:bg-linear-to-r md:from-navy-deep/90 md:via-navy-deep/40 md:via-40% md:to-transparent md:to-70%" />
      </div>

      <div className="relative -mt-[100svh]">
        <div ref={card(0)} data-bg={0} className={`flex min-h-svh items-end pb-[16svh] md:items-center md:pb-0 ${GUTTER}`}>
          <Reveal className="max-w-[36rem]">
            <p data-rise className="font-display text-[1.15rem] text-champagne italic">
              {name}
            </p>
            <h3 id="spaces" data-split className="font-display mt-3 text-[clamp(3rem,8vw,7.5rem)] leading-[0.92] tracking-[-0.03em]">
              Spaces
            </h3>
            <p data-rise className="mt-6 max-w-[34ch] text-[clamp(1rem,1.3vw,1.2rem)] leading-relaxed text-paper/85">
              {intro} Scroll to walk through them.
            </p>
          </Reveal>
        </div>

        {items.map((s, i) => (
          <article key={s.src} ref={card(i + 1)} data-bg={i} className={`flex min-h-svh items-end pb-[14svh] md:items-center md:pb-0 ${GUTTER}`}>
            <Reveal className="max-w-[34rem]">
              <p data-rise className="font-display text-[1.1rem] text-champagne italic">
                {s.arrival ? ["Arrival", s.area].filter(Boolean).join(", ") : (s.area ?? place ?? "Arrival")}
              </p>
              <h4 data-split className="font-display mt-3 text-[clamp(2.6rem,6vw,5.6rem)] leading-[0.95] tracking-[-0.02em]">
                {s.name}
              </h4>
              {s.note && (
                <p data-rise className="mt-5 max-w-[36ch] text-[clamp(1rem,1.25vw,1.15rem)] leading-relaxed text-paper/85">
                  {s.note}
                </p>
              )}
              {s.list && <List items={s.list} />}
            </Reveal>
          </article>
        ))}
      </div>
    </section>
  );
}

// A space shown through the facade's fins: seven slats, each holding its own slice of the photo.
// Coming on, they open one after another across the screen over the space it replaces.
const SLATS = 7;
function Slats({ s, state }) {
  return (
    <div className="absolute inset-0" style={{ zIndex: { on: 2, under: 1, off: 0 }[state] }}>
      {Array.from({ length: SLATS }, (_, i) => (
        <div
          key={i}
          className="absolute inset-y-0 overflow-hidden transition-[clip-path] ease-(--ease-in-out-strong) motion-reduce:transition-none"
          style={{
            left: `${(i * 100) / SLATS}%`,
            width: `calc(${100 / SLATS}% + 1px)`,
            clipPath: state === "off" ? "inset(0 0 0 100%)" : "inset(0 0 0 0)",
            transitionDuration: state === "on" ? "900ms" : "0ms",
            transitionDelay: state === "on" ? `${i * 60}ms` : "0ms",
          }}
        >
          <img
            src={s.src}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-y-0 h-full max-w-none object-cover"
            style={{ left: `${-i * 100}%`, width: `${SLATS * 100}%`, objectPosition: s.pos }}
          />
        </div>
      ))}
    </div>
  );
}

// A space opening out from the middle of the screen in a widening ring, like a contour line
// spreading from the top of a hill, over the space it replaces.
function Ring({ s, state }) {
  return (
    <div
      className="absolute inset-0 transition-[clip-path] ease-(--ease-in-out-strong) motion-reduce:transition-none"
      style={{
        zIndex: { on: 2, under: 1, off: 0 }[state],
        clipPath: state === "off" ? "circle(0% at 50% 55%)" : "circle(75% at 50% 55%)",
        transitionDuration: state === "on" ? "1300ms" : "0ms",
      }}
    >
      <img src={s.src} alt="" loading="lazy" decoding="async" className="size-full object-cover" style={{ objectPosition: s.pos }} />
    </div>
  );
}

// The amenities as a louvre: a row of tall slats, one render to each, like the facade's fins
// seen edge-on. The one under the pointer, or chosen, swings open to fill most of the row and
// says what it is; open, a press shows it full screen. On a phone the slats stack and the
// chosen one opens downward. The deck's full list of amenities sits above them.
function Mosaic({ items, name, amenities = [] }) {
  const [at, setAt] = useState(0);
  const images = useMemo(
    () => items.map((s) => ({ src: s.src, width: 1920, height: 1080, caption: [s.name, s.area].filter(Boolean).join(", "), alt: `${name}: ${s.name}` })),
    [items, name]
  );
  const fine = () => matchMedia("(hover: hover) and (pointer: fine)").matches;

  return (
    <section aria-labelledby="amenities-title" className="grid-paper">
      <div className={`mx-auto max-w-[1440px] py-[clamp(88px,14vh,160px)] ${GUTTER}`}>
        <div className="grid gap-x-20 gap-y-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-end">
          <Reveal>
            <p data-rise className="font-display text-[1.15rem] text-gold-ink italic">
              Amenities
            </p>
            <h3 id="amenities-title" data-split className="font-display mt-3 text-[clamp(2.6rem,5vw,4.6rem)] leading-[0.95] tracking-[-0.02em] text-ink">
              Crafted for today and tomorrow
            </h3>
            <p data-rise className="mt-5 max-w-[44ch] text-ink/75">
              In {name}, leisure and convenience are seamlessly woven into everyday life.
            </p>
          </Reveal>
          {amenities.length > 0 && (
            <ul className="flex flex-wrap gap-2" aria-label="Every amenity">
              {amenities.map((a) => (
                <li key={a} className="border border-ink/15 bg-paper px-3 py-1.5 text-[0.88rem] text-ink/75">
                  {a}
                </li>
              ))}
            </ul>
          )}
        </div>

        <Lightbox images={images}>
          {({ open, thumb, active }) => (
            <ul className="mt-12 flex h-[min(80svh,46rem)] flex-col gap-[clamp(4px,0.6vw,8px)] md:h-[clamp(26rem,68svh,44rem)] md:flex-row">
              {items.map((s, i) => {
                const on = i === at;
                return (
                  // the slat is what gets watched: a fully clipped element has no area, so it never comes into view
                  <motion.li
                    key={s.src}
                    className="relative min-h-0 min-w-0 transition-[flex-grow] duration-700 ease-(--ease-in-out-strong) motion-reduce:transition-none"
                    style={{ flex: `${on ? 7 : 1} 1 0%` }}
                    initial="hidden"
                    whileInView="shown"
                    viewport={{ once: true, amount: 0.2 }}
                  >
                    <motion.div
                      className="size-full"
                      variants={{ hidden: { clipPath: "inset(100% 0% 0% 0%)" }, shown: { clipPath: "inset(0% 0% 0% 0%)" } }}
                      transition={{ duration: 0.9, ease: [0.77, 0, 0.175, 1], delay: i * 0.06 }}
                    >
                      <button
                        ref={thumb(i)}
                        type="button"
                        onMouseEnter={() => fine() && setAt(i)}
                        onFocus={() => setAt(i)}
                        onClick={() => (on ? open(i) : setAt(i))}
                        aria-label={on ? `Show ${s.name} full screen` : s.name}
                        aria-expanded={on}
                        className="group relative block size-full overflow-hidden bg-stone text-left text-paper"
                        style={{ opacity: active === i ? 0 : 1 }}
                      >
                        <img src={s.src} alt="" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" style={{ objectPosition: s.pos }} />
                        <span
                          aria-hidden="true"
                          className={`absolute inset-0 transition-colors duration-500 ${on ? "bg-linear-to-t from-navy-deep/80 via-navy-deep/10 via-45% to-transparent" : "bg-navy-deep/55 group-hover:bg-navy-deep/40"}`}
                        />
                        {/* closed, the slat carries its number and name on its edge */}
                        <span
                          aria-hidden="true"
                          className={`absolute inset-x-0 top-0 flex items-center gap-3 p-3 transition-opacity duration-300 md:inset-y-0 md:right-auto md:flex-col md:items-center md:px-0 md:py-5 ${on ? "opacity-0" : "opacity-100"} md:w-full`}
                        >
                          <span className="text-[0.75rem] text-champagne tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                          <span className="h-px w-5 bg-champagne/60 md:h-5 md:w-px" />
                          <span className="font-display text-[1rem] whitespace-nowrap md:[writing-mode:vertical-rl] md:rotate-180">{s.name}</span>
                        </span>
                        {/* open, it says what it is */}
                        <span
                          className={`absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-x-6 gap-y-2 p-[clamp(16px,2.2vw,28px)] transition-[opacity,transform] duration-500 ease-(--ease-out-strong) ${
                            on ? "translate-y-0 opacity-100 delay-200" : "pointer-events-none translate-y-3 opacity-0"
                          }`}
                        >
                          <span>
                            <span className="block text-[0.85rem] text-champagne tabular-nums">
                              {String(i + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                              {s.floor ? `, ${s.floor}` : ""}
                            </span>
                            <span className="font-display mt-1 block text-[clamp(1.6rem,3vw,2.8rem)] leading-none">{s.name}</span>
                          </span>
                          {s.area && <span className="font-display text-[clamp(1.2rem,2vw,1.7rem)] tabular-nums">{s.area}</span>}
                        </span>
                      </button>
                    </motion.div>
                  </motion.li>
                );
              })}
            </ul>
          )}
        </Lightbox>
        <p className="mt-4 text-[0.88rem] text-ink/55">Point at a slat to open it; press an open one to see it full screen.</p>
      </div>
    </section>
  );
}

function List({ items, tone = "dark" }) {
  const line = tone === "dark" ? "border-paper/15 text-paper/90" : "border-ink/12 text-ink/80";
  return (
    <ul className={`mt-7 max-w-[24rem] border-t ${tone === "dark" ? "border-paper/20" : "border-ink/15"}`}>
      {items.map((t) => (
        <li key={t} data-rise className={`flex items-center gap-3 border-b py-2.5 text-[0.95rem] ${line}`}>
          <span className="size-1 rounded-full bg-gold" aria-hidden="true" />
          {t}
        </li>
      ))}
    </ul>
  );
}

// The sixth floor on the brochure's own plan: a marker on every amenity, and whichever is chosen
// shown beside it, its render, what it is and how big. The list under it does the same for
// keyboards and screen readers, and for thumbs on a small plan.
function Deck({ deck, items }) {
  const [at, setAt] = useState(0);
  const spots = deck.spots.map((sp) => ({ ...sp, space: items.find((s) => s.name === sp.space) }));
  const s = spots[at];
  const [w, h] = deck.size;

  return (
    <section aria-labelledby="deck-title" className={`mx-auto max-w-[1440px] py-[clamp(88px,14vh,160px)] ${GUTTER}`}>
      <Reveal className="max-w-[44rem]">
        <p data-rise className="font-display text-[1.15rem] text-gold-ink italic">
          6th floor
        </p>
        <h3 id="deck-title" data-split className="font-display mt-3 text-[clamp(2.6rem,5vw,4.6rem)] leading-[0.95] tracking-[-0.02em] text-ink">
          The amenity floor
        </h3>
        <p data-rise className="mt-5 max-w-[46ch] text-ink/75">
          Pools, a spa, a Japanese garden and rooms to gather in, all on one floor. Choose a place on the plan to see it.
        </p>
      </Reveal>

      <div className="mt-12 grid items-start gap-x-14 gap-y-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="relative bg-plan" style={{ aspectRatio: `${w} / ${h}` }}>
          <img src={deck.plan} alt="The sixth-floor amenity plan, from the brochure" width={w} height={h} loading="lazy" decoding="async" className="size-full" />
          {/* the markers repeat the list below for the pointer; the list is what assistive tech reads */}
          {spots.map((sp, i) => (
            <button
              key={sp.name}
              type="button"
              tabIndex={-1}
              aria-hidden="true"
              onClick={() => setAt(i)}
              className="absolute grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center"
              style={{ left: `${sp.x * 100}%`, top: `${sp.y * 100}%` }}
            >
              <span
                className={`grid size-7 place-items-center rounded-full text-[0.8rem] tabular-nums shadow-note transition-[background-color,color,scale] duration-200 ease-(--ease-out-strong) motion-reduce:transition-none ${
                  i === at ? "spot-on scale-110 bg-gold text-ink" : "bg-navy-deep text-paper hover:scale-110"
                }`}
              >
                {i + 1}
              </span>
            </button>
          ))}
        </div>

        <div className="md:sticky md:top-24">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={s.name}
              aria-live="polite"
              initial={{ opacity: 0, transform: "translateY(8px)" }}
              animate={{ opacity: 1, transform: "translateY(0px)" }}
              exit={{ opacity: 0, transition: { duration: 0.12 } }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              {s.space && (
                <div className="aspect-[16/10] overflow-hidden bg-stone">
                  <img src={s.space.src} alt={s.space.name} decoding="async" className="size-full object-cover" style={{ objectPosition: s.space.pos }} />
                </div>
              )}
              <p className="mt-6 flex flex-wrap items-baseline gap-x-4">
                <span className="font-display text-[clamp(1.8rem,3vw,2.6rem)] leading-tight text-ink">{s.name}</span>
                {s.area && <span className="text-ink/65 tabular-nums">{s.area}</span>}
              </p>
              <p className="mt-3 max-w-[44ch] leading-relaxed text-ink/75">{s.note ?? s.space?.note}</p>
            </motion.div>
          </AnimatePresence>

          <ol aria-label="On the plan" className="mt-8 grid grid-cols-2 gap-x-4 border-t border-ink/12 pt-4">
            {spots.map((sp, i) => (
              <li key={sp.name}>
                <button
                  type="button"
                  onClick={() => setAt(i)}
                  aria-pressed={i === at}
                  className={`flex w-full items-center gap-3 py-2 text-left text-[0.92rem] transition-colors duration-200 ${i === at ? "text-ink" : "text-ink/60 hover:text-ink"}`}
                >
                  <span className={`grid size-6 shrink-0 place-items-center rounded-full text-[0.72rem] tabular-nums ${i === at ? "bg-gold text-ink" : "border border-ink/25"}`}>{i + 1}</span>
                  {sp.name}
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

// The top floors seen through a window: the frame opens as you climb towards it until the room
// fills the screen, then the view turns from one room to the next.
function Sky({ items }) {
  const root = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress: p } = useScroll({ target: root, offset: ["start start", "end end"] });
  // a window to the room's proportions: tall and narrow on a wide screen, nearly full width on a phone
  const [win] = useState(() => (matchMedia("(min-width: 768px)").matches ? "inset(16% 30% 16% 30%)" : "inset(18% 12% 18% 12%)"));
  const clipPath = useTransform(p, [0, 0.35], [reduce ? "inset(0% 0% 0% 0%)" : win, "inset(0% 0% 0% 0%)"]);
  const zoom = useTransform(p, [0, 0.35], reduce ? ["scale(1)", "scale(1)"] : ["scale(1.18)", "scale(1)"]);
  const frame = useTransform(p, [0.2, 0.35], [1, 0]);
  const second = useTransform(p, [0.58, 0.68], [0, 1]);
  const first = useTransform(second, (v) => 1 - v);
  const floor = items[0].area;

  return (
    <section ref={root} aria-labelledby="sky-title" data-tone="dark" className="relative h-[300svh] bg-navy-deep text-paper">
      <div className="sticky top-0 h-svh overflow-hidden">
        <motion.div className="absolute inset-0" style={{ clipPath }}>
          {items.slice(0, 2).map((s, i) => (
            <motion.img
              key={s.src}
              src={s.src}
              alt=""
              loading="lazy"
              decoding="async"
              className="absolute inset-0 size-full object-cover"
              style={{ transform: zoom, opacity: i ? second : first, objectPosition: s.pos }}
            />
          ))}
          <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-navy-deep/90 via-navy-deep/30 via-45% to-transparent" />
        </motion.div>
        {/* the window's frame: mullions that fall away as it opens */}
        <motion.div aria-hidden="true" className="pointer-events-none absolute inset-[18%_12%] border border-champagne/60 md:inset-[16%_30%]" style={{ opacity: frame }}>
          <span className="absolute inset-y-0 left-1/3 w-px bg-champagne/40" />
          <span className="absolute inset-y-0 left-2/3 w-px bg-champagne/40" />
        </motion.div>

        <div className={`absolute inset-x-0 bottom-0 grid gap-8 pb-[clamp(40px,9vh,96px)] md:grid-cols-[auto_minmax(0,1fr)] md:items-end md:gap-16 ${GUTTER}`}>
          <div>
            <p className="font-display text-[clamp(5rem,14vw,12rem)] leading-[0.8] tracking-[-0.04em] tabular-nums">{parseInt(floor)}</p>
            <h3 id="sky-title" className="font-display mt-3 text-[1.15rem] text-champagne italic">
              {floor}, panoramic views
            </h3>
          </div>
          <div className="relative min-h-[9rem] max-w-[32rem]">
            {items.slice(0, 2).map((s, i) => (
              <motion.div key={s.src} className="absolute inset-x-0 bottom-0" style={{ opacity: i ? second : first }}>
                <p className="font-display text-[clamp(2rem,4vw,3.4rem)] leading-none">{s.name}</p>
                <p className="mt-3 text-paper/85">{s.note}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// the top of the tower: on to the homes in it
function Onward({ onBook, motif }) {
  return (
    <section data-tone="dark" className="relative bg-navy-deep text-paper">
      {motif === "fins" && <Edge motif={motif} />}
      <div className={`mx-auto flex max-w-[1440px] flex-wrap items-end justify-between gap-10 py-[clamp(72px,12vh,140px)] ${GUTTER}`}>
        <Reveal className="max-w-[40rem]">
          <p data-rise className="font-display text-[1.15rem] text-champagne italic">
            That is the tower
          </p>
          <p data-split className="font-display mt-3 text-[clamp(2.6rem,6vw,5.6rem)] leading-[0.95] tracking-[-0.02em]">
            Now, the homes in it
          </p>
        </Reveal>
        <div className="flex flex-wrap gap-3">
          <a href="#residences" className="rounded-full bg-champagne px-6 py-3.5 text-ink transition-[background-color,transform] duration-200 hover:bg-paper active:scale-[0.97] motion-reduce:transform-none">
            See the residences
          </a>
          {onBook && (
            <button type="button" onClick={onBook} className="rounded-full border border-paper/40 px-6 py-3.5 transition-[background-color,color,transform] duration-200 hover:bg-paper hover:text-ink active:scale-[0.97] motion-reduce:transform-none">
              Book a viewing
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

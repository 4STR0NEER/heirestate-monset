import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Reveal from "@/components/Reveal";

const EASE = [0.23, 1, 0.32, 1];
const GUTTER = "px-[clamp(16px,4vw,64px)]";

// The amenities as a walk up the tower, each floor told its own way: the arrival as full-screen
// photographs the text scrolls over, the sixth floor as the brochure's plan to explore, the
// thirty-seventh through a window that opens onto it. Without a plan (deck), every space is told
// the first way.
export default function Spaces({ items, name, deck, onBook }) {
  const story = deck ? items.filter((s) => !s.area) : items;
  const sky = deck ? items.filter((s) => s.area?.startsWith("37")) : [];
  return (
    <>
      <Story items={story} name={name} />
      {deck && <Deck deck={deck} items={items} />}
      {sky.length > 0 && <Sky items={sky} />}
      <Onward onBook={onBook} />
    </>
  );
}

// Each space fills the screen and its text scrolls over it, so you read about the place while
// standing in it. The photos sit in one pinned layer and crossfade as each note crosses the
// middle of the screen.
function Story({ items, name }) {
  const [active, setActive] = useState(0);
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
      <div className="sticky top-0 h-svh overflow-hidden">
        {items.map(
          (s, i) =>
            i <= reach && (
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
            )
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
              Japanese-inspired amenities from the lobby to the thirty-seventh floor. Scroll to walk up through them.
            </p>
          </Reveal>
        </div>

        {items.map((s, i) => (
          <article key={s.src} ref={card(i + 1)} data-bg={i} className={`flex min-h-svh items-end pb-[14svh] md:items-center md:pb-0 ${GUTTER}`}>
            <Reveal className="max-w-[34rem]">
              <p data-rise className="font-display text-[1.1rem] text-champagne italic">
                {s.area ?? "Arrival"}
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
function Onward({ onBook }) {
  return (
    <section data-tone="dark" className="bg-navy-deep text-paper">
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

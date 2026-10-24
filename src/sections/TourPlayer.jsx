import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "motion/react";

const SPEED = 1.25; // the films walk slowly; between rooms they play a little quicker
const NEAR = 25; // a room this many seconds ahead is walked to; further, or behind, is cut to
const EASE = [0.23, 1, 0.32, 1];

// A unit's walkthrough film, one room at a time. "Next room" plays the film on until the camera
// reaches the next stop and holds there while a line draws from the thing worth seeing to a note
// about it. Going back, or jumping far, cuts straight to the room. Opened on request, full screen.
export default function TourPlayer({ tour, unit, onClose, onBook }) {
  const video = useRef(null);
  const stage = useRef(null);
  const closeBtn = useRef(null);
  const watch = useRef(0);
  const [at, setAt] = useState(-1); // -1: at the door, before the first room
  const [moving, setMoving] = useState(false);
  const [done, setDone] = useState(false);
  const [box, setBox] = useState(null); // where the film sits on screen, to place the notes
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const stops = tour.stops;

  // the page behind stays put; Escape closes; focus returns where it came from
  useEffect(() => {
    const before = document.activeElement;
    const html = document.documentElement;
    html.style.overflow = "hidden";
    closeBtn.current?.focus({ preventScroll: true });
    return () => {
      html.style.overflow = "";
      cancelAnimationFrame(watch.current);
      before?.focus?.({ preventScroll: true });
    };
  }, []);

  // the film is cropped to fill the screen; notes are placed by the same crop
  useLayoutEffect(() => {
    const v = video.current;
    const measure = () => {
      if (!v.videoWidth) return;
      const w = stage.current.clientWidth;
      const h = stage.current.clientHeight;
      const k = Math.max(w / v.videoWidth, h / v.videoHeight);
      setBox({ w, h, k, dx: (w - v.videoWidth * k) / 2, dy: (h - v.videoHeight * k) / 2, vw: v.videoWidth, vh: v.videoHeight });
    };
    const ro = new ResizeObserver(measure);
    ro.observe(stage.current);
    v.addEventListener("loadedmetadata", measure);
    return () => (ro.disconnect(), v.removeEventListener("loadedmetadata", measure));
  }, []);

  const go = useCallback(
    (i) => {
      const v = video.current;
      cancelAnimationFrame(watch.current);
      setDone(false);
      // past the last room: walk on to the end of the film
      const target = i >= stops.length ? v.duration - 0.05 : stops[i].t;
      const arrive = () => {
        setMoving(false);
        if (i >= stops.length) setDone(true);
        else setAt(i);
      };
      const ahead = target - v.currentTime;
      setMoving(true);
      if (reduce || ahead <= 0 || ahead > NEAR) {
        v.pause();
        v.currentTime = target;
        v.addEventListener("seeked", arrive, { once: true });
        return;
      }
      v.playbackRate = SPEED;
      v.play().catch(() => {});
      const check = () => {
        if (v.currentTime >= target - 0.05 || v.ended) {
          v.pause();
          arrive();
        } else watch.current = requestAnimationFrame(check);
      };
      watch.current = requestAnimationFrame(check);
    },
    [stops, reduce]
  );

  const next = () => !moving && go(Math.min(at + 1, stops.length));
  const prev = () => !moving && at > 0 && go(at - 1);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  });

  const s = stops[at];
  const showNote = s && !moving && !done && box;
  let note = null;
  if (showNote) {
    const px = box.dx + s.x * box.vw * box.k;
    const py = box.dy + s.y * box.vh * box.k;
    const side = px < box.w / 2 ? 1 : -1;
    const ex = px + side * Math.min(170, box.w * 0.14);
    const ey = py - Math.min(110, box.h * 0.13);
    note = { px, py, side, ex, ey };
  }

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`Video tour: ${unit}`}
      data-tone="dark"
      className="fixed inset-0 z-50 bg-navy-deep text-paper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      transition={{ duration: 0.3, ease: EASE }}
    >
      <div ref={stage} className="absolute inset-0 overflow-hidden">
        <video ref={video} src={`${tour.video}.mp4`} poster={`${tour.video}.jpg`} preload="auto" muted playsInline className="size-full object-cover" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-linear-to-b from-navy-deep/70 via-transparent via-30% to-navy-deep/85" />

        {/* the note: a dot on the thing, a line out to the side with more room, the card at its end */}
        {note && (
          <>
            <svg aria-hidden="true" className="pointer-events-none absolute inset-0 hidden size-full md:block">
              <path
                key={at}
                d={`M${note.px} ${note.py}L${note.px + note.side * 60} ${note.ey}H${note.ex}`}
                pathLength="1"
                fill="none"
                stroke="var(--color-champagne)"
                strokeWidth="1"
                strokeDasharray="1"
                className="tour-line"
              />
            </svg>
            <span
              key={`dot-${at}`}
              aria-hidden="true"
              className="tour-dot pointer-events-none absolute top-0 left-0 -mt-2.5 -ml-2.5 grid size-5 place-items-center rounded-full border border-champagne"
              style={{ translate: `${note.px}px ${note.py}px` }}
            >
              <span className="size-2 rounded-full bg-gold" />
            </span>
          </>
        )}
      </div>

      {/* the room's note, read aloud as it changes */}
      <div aria-live="polite" className="pointer-events-none absolute inset-0">
        {showNote && (
          <div
            key={at}
            className="tour-card absolute inset-x-3 bottom-[9.5rem] rounded-[4px] bg-paper p-5 text-ink shadow-note md:inset-x-auto md:bottom-auto md:w-[min(320px,30vw)]"
            style={
              innerWidth >= 768
                ? { left: Math.min(Math.max(note.side > 0 ? note.ex + 14 : note.ex - 334, 16), box.w - 336), top: Math.min(Math.max(note.ey - 28, 88), box.h - 300) }
                : undefined
            }
          >
            <p className="font-display text-[1rem] text-(--accent) italic">{s.room}</p>
            <p className="font-display mt-1 text-[1.45rem] leading-tight">{s.title}</p>
            <p className="mt-2 text-[0.95rem] leading-relaxed text-ink/75">{s.note}</p>
          </div>
        )}
      </div>

      <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-4 px-[clamp(16px,4vw,64px)] pt-6">
        <div>
          <p className="font-display text-[1.05rem] text-champagne italic">Video tour</p>
          <p className="font-display text-[clamp(1.4rem,2.4vw,2rem)] leading-tight">{unit}</p>
        </div>
        <button
          ref={closeBtn}
          type="button"
          onClick={onClose}
          aria-label="Close the tour"
          className="grid size-12 shrink-0 place-items-center rounded-full border border-paper/30 bg-navy-deep/50 transition-[background-color,color,transform] duration-200 hover:bg-paper hover:text-ink active:scale-95 motion-reduce:transform-none"
        >
          <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true">
            <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </button>
      </div>

      {/* at the door: what the tour holds, and the way in */}
      {at < 0 && !moving && (
        <div className="absolute inset-0 grid place-items-center px-4">
          <div className="text-center">
            <p className="mx-auto max-w-[34ch] text-paper/85">
              {stops.length} rooms. Press next and the camera walks you to each one, then stops to show you around.
            </p>
            <button
              type="button"
              onClick={next}
              className="mt-7 rounded-full bg-champagne px-7 py-3.5 text-ink transition-[background-color,transform] duration-200 hover:bg-paper active:scale-[0.97] motion-reduce:transform-none"
            >
              Start the tour
            </button>
          </div>
        </div>
      )}

      {/* the end of the walk: the next step is a visit */}
      {done && (
        <div className="absolute inset-0 grid place-items-center bg-navy-deep/70 px-4">
          <div className="max-w-[30rem] text-center">
            <p className="font-display text-[1.15rem] text-champagne italic">That was the {unit.split(", ").pop()}</p>
            <p className="font-display mt-3 text-[clamp(2rem,4vw,3rem)] leading-tight">See it for yourself</p>
            <p className="mt-4 text-paper/80">The dress-up unit is open for viewings. An agent will walk it with you.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={onBook} className="rounded-full bg-champagne px-6 py-3.5 text-ink transition-[background-color,transform] duration-200 hover:bg-paper active:scale-[0.97] motion-reduce:transform-none">
                Book a viewing
              </button>
              <button type="button" onClick={() => go(0)} className="rounded-full border border-paper/35 px-6 py-3.5 transition-[background-color,color,transform] duration-200 hover:bg-paper hover:text-ink active:scale-[0.97] motion-reduce:transform-none">
                Watch again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* the rooms in order, each a way to go there; the arrows walk on or step back */}
      <nav aria-label="Rooms" className="absolute inset-x-0 bottom-0 px-[clamp(16px,4vw,64px)] pb-[clamp(16px,3vh,32px)]">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={prev}
            disabled={at <= 0 || moving}
            className="rounded-full border border-paper/30 px-5 py-3 text-[0.95rem] transition-[background-color,color,opacity,transform] duration-200 enabled:hover:bg-paper enabled:hover:text-ink enabled:active:scale-[0.97] motion-reduce:transform-none disabled:opacity-35"
          >
            Previous
          </button>
          <ol className="flex min-w-0 flex-1 gap-1 overflow-x-auto [scrollbar-width:none] md:justify-center">
            {stops.map((st, i) => (
              <li key={st.room} className="shrink-0">
                <button
                  type="button"
                  onClick={() => !moving && i !== at && go(i)}
                  aria-current={i === at ? "location" : undefined}
                  className={`rounded-full px-3 py-2 text-[0.85rem] transition-colors duration-200 ${i === at ? "bg-paper/15 text-paper" : i < at ? "text-paper/75 hover:text-paper" : "text-paper/50 hover:text-paper/85"} ${i === at ? "" : "max-md:hidden"}`}
                >
                  {st.room}
                </button>
              </li>
            ))}
          </ol>
          <button
            type="button"
            onClick={next}
            disabled={moving || done}
            className="rounded-full bg-champagne px-5 py-3 text-[0.95rem] text-ink transition-[background-color,opacity,transform] duration-200 enabled:hover:bg-paper enabled:active:scale-[0.97] motion-reduce:transform-none disabled:opacity-50"
          >
            {moving ? "Walking…" : at < 0 ? "Start" : at >= stops.length - 1 ? "Finish" : "Next room"}
          </button>
        </div>
        <div className="mt-4 flex gap-1" aria-hidden="true">
          {stops.map((st, i) => (
            <span key={st.room} className={`h-px flex-1 transition-colors duration-500 ${i <= at ? "bg-gold" : "bg-paper/25"}`} />
          ))}
        </div>
      </nav>
    </motion.div>
  );
}

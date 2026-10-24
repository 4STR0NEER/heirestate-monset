// Photos that grow out of their thumbnail into a full view and fly back to it. Ported from
// Kokonut UI's Lightbox Grid (MIT, kokonutui.com): the open photo is one element the whole time,
// and a transform plus a crop take it from its slot to the middle of the screen and back.
// Swipe or arrow keys step between photos; drag down (or flick) to put it back.
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";

const EASE = [0.23, 1, 0.32, 1];
const OPEN = { type: "spring", duration: 0.5, bounce: 0.1 };
const CLOSE = { type: "spring", duration: 0.42, bounce: 0.06 };
const SETTLE = { type: "spring", duration: 0.35, bounce: 0.15 };
// room around the open photo, and below it for the caption
const MARGIN = 56;
const MARGIN_SMALL = 12;
const CAPTION_ROOM = 64;
const DISMISS_DISTANCE = 110; // px
const DISMISS_SPEED = 0.55; // px/ms
const SWIPE_SPEED = 0.45;
const AXIS_LOCK = 6;
const FULL = "inset(0px 0px 0px 0px)";

function fitRect(image) {
  const margin = innerWidth < 640 ? MARGIN_SMALL : MARGIN;
  const scale = Math.min((innerWidth - margin * 2) / image.width, (innerHeight - margin * 2 - CAPTION_ROOM) / image.height);
  const width = image.width * scale;
  const height = image.height * scale;
  return { left: (innerWidth - width) / 2, top: (innerHeight - CAPTION_ROOM - height) / 2, width, height };
}

// the transform and crop that make the open photo sit exactly over its thumbnail
function thumbFrame(open, thumb, image) {
  const ratio = image.width / image.height;
  const cover = ratio > thumb.width / thumb.height ? thumb.height * ratio : thumb.width;
  const scale = cover / open.width;
  const ix = (open.width - thumb.width / scale) / 2;
  const iy = (open.height - thumb.height / scale) / 2;
  return {
    x: thumb.left + thumb.width / 2 - (open.left + open.width / 2),
    y: thumb.top + thumb.height / 2 - (open.top + open.height / 2),
    scale,
    clip: `inset(${iy}px ${ix}px ${iy}px ${ix}px)`,
  };
}

const onScreen = (r) => r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth;

function IconButton({ label, onClick, className = "", children, buttonRef, unavailable }) {
  return (
    <button
      ref={buttonRef}
      type="button"
      aria-label={label}
      aria-disabled={unavailable || undefined}
      onClick={onClick}
      className={`grid size-11 place-items-center rounded-full border border-paper/20 text-paper transition-[background-color,opacity,transform] duration-150 hover:bg-paper/10 active:scale-95 aria-disabled:cursor-default aria-disabled:opacity-30 aria-disabled:hover:bg-transparent ${className}`}
    >
      {children}
    </button>
  );
}

const Chevron = ({ flip }) => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={`size-4 ${flip ? "rotate-180" : ""}`}>
    <path d="m6 3.5 4.5 4.5L6 12.5" stroke="currentColor" strokeWidth="1.3" />
  </svg>
);

function Viewer({ images, index, rect, x, y, scale, clip, alpha, fade, settled, onClose, onStep }) {
  const closeRef = useRef(null);
  const dialog = useRef(null);
  const drag = useRef(null);
  const backdrop = useTransform(fade, (v) => v * 0.94);
  const image = images[index];
  const hasPrev = index > 0;
  const hasNext = index < images.length - 1;

  useEffect(() => closeRef.current?.focus({ preventScroll: true }), []);

  const down = (e) => {
    if (!settled || e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { id: e.pointerId, x0: e.clientX, y0: e.clientY, axis: null, samples: [{ x: e.clientX, y: e.clientY, t: e.timeStamp }] };
  };

  const move = (e) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x0;
    const dy = e.clientY - d.y0;
    if (!d.axis) {
      if (Math.hypot(dx, dy) < AXIS_LOCK) return;
      d.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
    }
    d.samples.push({ x: e.clientX, y: e.clientY, t: e.timeStamp });
    if (d.samples.length > 5) d.samples.shift();
    if (d.axis === "y") {
      // pulling away shrinks the photo and lets the page show through
      x.set(dx);
      y.set(dy);
      scale.set(1 - Math.min(Math.abs(dy) / innerHeight, 1) * 0.45);
      fade.set(1 - Math.min(Math.abs(dy) / 360, 1) * 0.85);
    } else {
      // past the first or last photo the drag only gives a little
      x.set((dx > 0 && !hasPrev) || (dx < 0 && !hasNext) ? dx * 0.25 : dx);
    }
  };

  const up = (e) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    const a = d.samples[0];
    const b = d.samples.at(-1);
    const dt = Math.max(1, b.t - a.t);
    const v = { x: (b.x - a.x) / dt, y: (b.y - a.y) / dt };
    const dx = e.clientX - d.x0;
    const dy = e.clientY - d.y0;
    if (d.axis === "y") {
      if (Math.abs(dy) > DISMISS_DISTANCE || Math.abs(v.y) > DISMISS_SPEED) return onClose(v);
      animate(x, 0, SETTLE);
      animate(y, 0, SETTLE);
      animate(scale, 1, SETTLE);
      animate(fade, 1, { duration: 0.2, ease: EASE });
    } else if (d.axis === "x") {
      const far = Math.abs(dx) > rect.width * 0.22 || Math.abs(v.x) > SWIPE_SPEED;
      if (far && dx < 0 && hasNext) onStep(1);
      else if (far && dx > 0 && hasPrev) onStep(-1);
      else animate(x, 0, SETTLE);
    }
  };

  const key = (e) => {
    if (e.key === "Escape") e.preventDefault(), onClose();
    else if (e.key === "ArrowRight" && hasNext) onStep(1);
    else if (e.key === "ArrowLeft" && hasPrev) onStep(-1);
    else if (e.key === "Tab") {
      // keep focus inside the viewer
      const all = [...dialog.current.querySelectorAll("button")];
      if (e.shiftKey && document.activeElement === all[0]) e.preventDefault(), all.at(-1).focus();
      else if (!e.shiftKey && document.activeElement === all.at(-1)) e.preventDefault(), all[0].focus();
    }
  };

  return (
    <div ref={dialog} role="dialog" aria-modal="true" aria-label={image.caption ?? image.alt} className="fixed inset-0 z-[100]" onKeyDown={key}>
      <motion.div aria-hidden="true" className="absolute inset-0 bg-navy-deep" style={{ opacity: backdrop }} onClick={() => onClose()} />

      <motion.div
        className="absolute cursor-grab touch-none overflow-hidden select-none active:cursor-grabbing"
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        onLostPointerCapture={up}
        style={{ left: rect.left, top: rect.top, width: rect.width, height: rect.height, x, y, scale, clipPath: clip, opacity: alpha, willChange: "transform, clip-path" }}
      >
        <img src={image.src} alt={image.alt} width={image.width} height={image.height} draggable={false} className="pointer-events-none size-full object-cover" />
      </motion.div>

      <motion.div className="pointer-events-none absolute inset-0" style={{ opacity: fade }}>
        <div className="pointer-events-auto absolute top-3 right-3 flex items-center gap-4 sm:top-5 sm:right-5">
          <span className="font-inscription text-[0.72rem] tracking-[0.24em] text-champagne/80 tabular-nums">
            {index + 1} / {images.length}
          </span>
          <IconButton buttonRef={closeRef} label="Close" onClick={() => onClose()}>
            <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.3" />
            </svg>
          </IconButton>
        </div>
        <IconButton className="pointer-events-auto absolute top-1/2 left-5 hidden -translate-y-1/2 sm:grid" label="Previous photo" onClick={() => hasPrev && onStep(-1)} unavailable={!hasPrev}>
          <Chevron flip />
        </IconButton>
        <IconButton className="pointer-events-auto absolute top-1/2 right-5 hidden -translate-y-1/2 sm:grid" label="Next photo" onClick={() => hasNext && onStep(1)} unavailable={!hasNext}>
          <Chevron />
        </IconButton>
        {image.caption && (
          <p className="font-inscription absolute inset-x-4 text-center text-[0.74rem] tracking-[0.26em] text-champagne uppercase" style={{ top: rect.top + rect.height + 22 }}>
            {image.caption}
          </p>
        )}
      </motion.div>
    </div>
  );
}

// children({ open, thumb, active }) draws the grid: `thumb(i)` is the ref for photo i's button,
// `open(i)` opens it, and `active` is the open index (its slot stays empty while it is out).
// images: { src, alt, width, height, caption? }
export default function Lightbox({ images, children }) {
  const [active, setActive] = useState(null);
  const [rect, setRect] = useState(null);
  const [settled, setSettled] = useState(false);
  const [closing, setClosing] = useState(false);
  const thumbs = useRef([]);
  const closeTimer = useRef(0);
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);
  const clip = useMotionValue(FULL);
  const alpha = useMotionValue(1);
  const fade = useMotionValue(0);

  const frameFor = useCallback(
    (i, to) => {
      const box = thumbs.current[i]?.getBoundingClientRect();
      return box && onScreen(box) ? thumbFrame(to, box, images[i]) : null;
    },
    [images]
  );

  const open = useCallback(
    (i) => {
      const to = fitRect(images[i]);
      const from = frameFor(i, to);
      setActive(i);
      setRect(to);
      setClosing(false);
      setSettled(false);
      alpha.set(1);
      if (!from || reduce) {
        x.set(0), y.set(0), scale.set(1), clip.set(FULL), fade.set(0), alpha.set(0);
        animate(alpha, 1, { duration: 0.18 });
        animate(fade, 1, { duration: 0.18 }).then(() => setSettled(true));
        return;
      }
      x.set(from.x), y.set(from.y), scale.set(from.scale), clip.set(from.clip), fade.set(0);
      animate(x, 0, OPEN);
      animate(y, 0, OPEN);
      animate(scale, 1, OPEN);
      animate(clip, FULL, OPEN);
      animate(fade, 1, { duration: 0.3, ease: EASE }).then(() => setSettled(true));
    },
    [alpha, clip, fade, frameFor, images, reduce, scale, x, y]
  );

  const close = useCallback(
    (velocity) => {
      if (active === null || !rect || closing) return;
      setClosing(true);
      const i = active;
      thumbs.current[i]?.scrollIntoView({ behavior: "instant", block: "nearest", inline: "nearest" });
      const to = frameFor(i, rect);
      const finish = () => {
        setActive(null);
        setRect(null);
        setClosing(false);
        thumbs.current[i]?.focus({ preventScroll: true });
      };
      if (!to || reduce) {
        animate(alpha, 0, { duration: 0.16 });
        animate(fade, 0, { duration: 0.16 }).then(finish);
        return;
      }
      // a flick carries its speed into the flight home
      animate(x, to.x, { ...CLOSE, velocity: (velocity?.x ?? 0) * 1000 });
      animate(y, to.y, { ...CLOSE, velocity: (velocity?.y ?? 0) * 1000 });
      animate(scale, to.scale, CLOSE);
      animate(clip, to.clip, CLOSE);
      animate(fade, 0, { duration: 0.28, ease: EASE });
      closeTimer.current = setTimeout(finish, 420);
    },
    [active, alpha, clip, closing, fade, frameFor, rect, reduce, scale, x, y]
  );

  const step = useCallback(
    (dir) => {
      if (active === null || closing) return;
      const next = active + dir;
      if (next < 0 || next >= images.length) return;
      setActive(next);
      setRect(fitRect(images[next]));
      y.set(0), scale.set(1), clip.set(FULL), fade.set(1);
      if (reduce) return void (x.set(0), alpha.set(1));
      // the next photo slides in from the side it was swiped from
      x.set(dir * 72);
      alpha.set(0);
      animate(x, 0, { duration: 0.32, ease: EASE });
      animate(alpha, 1, { duration: 0.22, ease: EASE });
    },
    [active, alpha, clip, closing, fade, images, reduce, scale, x, y]
  );

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  // lock the page behind the viewer and keep the open photo fitted
  useEffect(() => {
    if (active === null) return;
    const html = document.documentElement;
    const before = html.style.overflow;
    html.style.overflow = "hidden";
    const onResize = () => setRect(fitRect(images[active]));
    addEventListener("resize", onResize);
    return () => {
      html.style.overflow = before;
      removeEventListener("resize", onResize);
    };
  }, [active, images]);

  const thumb = (i) => (node) => void (thumbs.current[i] = node);

  return (
    <>
      {children({ open, thumb, active })}
      {active !== null &&
        rect &&
        createPortal(
          <Viewer
            images={images}
            index={active}
            rect={rect}
            x={x}
            y={y}
            scale={scale}
            clip={clip}
            alpha={alpha}
            fade={fade}
            settled={settled && !closing}
            onClose={close}
            onStep={step}
          />,
          document.body
        )}
    </>
  );
}

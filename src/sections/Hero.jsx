import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import Logo from "@/components/Logo";
import Sky from "@/components/Sky";
import TextRoll from "@/components/skiper/text-roll";
import { windows } from "@/projects";

const EASE = [0.23, 1, 0.32, 1];
const HEADLINE_DONE = 0.9; // windows start lighting once the headline has risen
const SLATS = 18;
// window heights step down from the centre, so the facade reads as one composed elevation
const HEIGHTS = [86, 93, 100, 93, 86];
const finePointer = () =>
  matchMedia("(hover: hover) and (pointer: fine)").matches;

export default function Hero({ ready = true, onOpen }) {
  const reduce = useReducedMotion();
  const facade = useRef(null);
  const [hovered, setHovered] = useState(null);

  // one pointer drives the scene in depth: sky still, headline a little, towers behind glass the most
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const px = useTransform(sx, (v) => `${v * -22}px`);
  const py = useTransform(sy, (v) => `${v * -14}px`);
  const hx = useTransform(sx, (v) => `${v * 8}px`);
  const hy = useTransform(sy, (v) => `${v * 5}px`);
  // the reflection band and the warm wall light both follow the same spring
  useMotionValueEvent(sx, "change", (v) =>
    facade.current?.style.setProperty("--lx", `${(v + 0.5) * 100}%`),
  );
  useMotionValueEvent(sy, "change", (v) =>
    facade.current?.style.setProperty("--ly", `${(v + 0.5) * 100}%`),
  );

  // raw pointer position for the cursor label
  const cx = useMotionValue(-100);
  const cy = useMotionValue(-100);

  const onPointerMove = (e) => {
    if (e.pointerType !== "mouse") return;
    cx.set(e.clientX);
    cy.set(e.clientY);
    if (reduce) return;
    mx.set(e.clientX / innerWidth - 0.5);
    my.set(e.clientY / innerHeight - 0.5);
  };

  return (
    <section
      onPointerMove={onPointerMove}
      className="relative flex min-h-svh flex-col overflow-hidden"
    >
      {/* the sky band ends at the cornice, so the distant city stands right behind the facade */}
      <div className="relative pb-[clamp(64px,12vh,132px)]">
        <Sky ready={ready} />

        <header className="relative flex justify-center pt-7">
          <motion.a
            href="/"
            aria-label="Heir Estate, home"
            initial={{ opacity: 0 }}
            animate={ready ? { opacity: 1 } : undefined}
            transition={{ duration: 1, ease: EASE }}
          >
            <Logo />
          </motion.a>
        </header>

        <motion.div
          style={{ x: hx, y: hy }}
          className="relative mt-[clamp(28px,5.5vh,64px)] px-4 text-center"
        >
          <h1 className="font-display text-[clamp(2rem,4.5vw,4.6rem)] leading-[1.04] font-normal tracking-[-0.02em] text-balance">
            <Line ready={ready} delay={0.15}>
              Building your future,
            </Line>
            <Line ready={ready} delay={0.3} className="text-gold">
              one property at a time
            </Line>
          </h1>
          <motion.p
            initial={{ opacity: 0, filter: "blur(6px)" }}
            animate={ready ? { opacity: 1, filter: "blur(0px)" } : undefined}
            transition={{ duration: 1, ease: EASE, delay: 0.7 }}
            className="font-inscription mt-5 text-[clamp(0.7rem,1vw,0.9rem)] tracking-[0.32em] text-balance text-champagne/75 uppercase"
          >
            Securing wealth, creating your legacy
          </motion.p>
        </motion.div>
      </div>

      <div
        ref={facade}
        className="facade relative flex flex-1 flex-col bg-navy"
      >
        <div className="wall-light pointer-events-none absolute inset-0" />
        {/* cornice: a double rule the windows hang from, drawn out from the centre */}
        <motion.div
          className="absolute inset-x-0 top-0 h-px origin-center bg-gold/55"
          initial={{ scaleX: 0 }}
          animate={ready ? { scaleX: 1 } : undefined}
          transition={{ duration: 1.6, ease: [0.77, 0, 0.175, 1], delay: 0.2 }}
        />
        <motion.div
          className="absolute inset-x-0 top-[5px] h-px origin-center bg-gold/15"
          initial={{ scaleX: 0 }}
          animate={ready ? { scaleX: 1 } : undefined}
          transition={{ duration: 1.6, ease: [0.77, 0, 0.175, 1], delay: 0.35 }}
        />

        <div className="relative grid min-h-[clamp(300px,50vh,620px)] flex-1 grid-cols-5 items-end gap-[clamp(6px,1.6vw,24px)] px-[clamp(16px,3.4vw,48px)] pt-[clamp(14px,2.2vw,30px)]">
          {windows.map((w, i) =>
            w.soon ? (
              <Shutter
                key={w.id}
                ready={ready}
                height={HEIGHTS[i]}
                delay={HEADLINE_DONE + 0.5}
              />
            ) : (
              <Window
                key={w.id}
                {...w}
                height={HEIGHTS[i]}
                px={reduce ? 0 : px}
                py={reduce ? 0 : py}
                reduce={reduce}
                ready={ready}
                // the centre window lights first, then outwards
                delay={HEADLINE_DONE + Math.abs(i - 2) * 0.22}
                onHover={setHovered}
                onOpen={onOpen}
              />
            ),
          )}
        </div>

        {/* sill and plinth */}
        <div className="relative h-px bg-gold/45" />
        <div className="relative h-[clamp(16px,3vh,34px)] bg-navy-deep/70" />
      </div>

      <CursorLabel x={cx} y={cy} label={hovered} />
    </section>
  );
}

function Line({ children, delay, className, ready }) {
  return (
    <span className="block overflow-hidden pb-[0.1em]">
      <motion.span
        className={`block ${className ?? ""}`}
        initial={{ transform: "translateY(105%)", filter: "blur(8px)" }}
        animate={
          ready
            ? { transform: "translateY(0%)", filter: "blur(0px)" }
            : undefined
        }
        transition={{ duration: 1.2, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

function Window({
  id,
  name,
  media,
  accent,
  height,
  px,
  py,
  delay,
  reduce,
  ready,
  onHover,
  onOpen,
}) {
  const video = useRef(null);
  const glass = useRef(null);

  // start each walkthrough as its window switches on; it plays once and holds the last frame
  useEffect(() => {
    if (reduce || !ready) return;
    const t = setTimeout(
      () => video.current?.play().catch(() => {}),
      delay * 1000,
    );
    return () => clearTimeout(t);
  }, [delay, reduce, ready]);

  const enter = () => {
    if (finePointer()) onHover("Enter");
    const v = video.current;
    if (reduce || !v || !v.ended) return;
    v.currentTime = 0;
    v.play().catch(() => {});
  };

  return (
    <motion.button
      type="button"
      aria-label={`Enter ${name}`}
      onClick={() => onOpen?.(id, glass.current.getBoundingClientRect())}
      className="win live-win group relative flex min-w-0 flex-col self-end text-left"
      style={{ "--accent": accent, height: `${height}%` }}
      initial="initial"
      whileHover="hovered"
      whileTap={{ scale: 0.985 }}
      onPointerEnter={enter}
      onPointerLeave={() => onHover(null)}
    >
      <Transom>
        <TextRoll className="font-inscription text-[clamp(0.6rem,0.85vw,0.8rem)] tracking-[0.28em] uppercase">
          {name}
        </TextRoll>
      </Transom>

      <div
        ref={glass}
        className="win-glass relative w-full flex-1 overflow-hidden border border-gold/35 bg-navy-deep"
      >
        {/* the light switching on: a quick flicker, then steady */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={
            ready ? { opacity: reduce ? 1 : [0, 0.55, 0.25, 1] } : undefined
          }
          transition={{
            duration: reduce ? 0.6 : 1,
            times: [0, 0.18, 0.32, 1],
            ease: "easeOut",
            delay,
          }}
        >
          <div
            className="breathe absolute inset-0"
            style={{ "--d": `${13 + height / 10}s` }}
          >
            <motion.video
              ref={video}
              src={`${media}.mp4`}
              poster={`${media}.jpg`}
              muted
              playsInline
              preload="auto"
              aria-hidden="true"
              style={{ x: px, y: py, scale: 1.12 }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-linear-to-t from-navy/85 via-navy/25 to-navy/5 transition-opacity duration-500 group-hover:opacity-35" />
        </motion.div>

        <div className="glass-sheen pointer-events-none absolute inset-0" />
        <div className="reveal pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute inset-[5px] border border-gold/20 transition-colors duration-500 group-hover:border-gold/55 group-focus-visible:border-gold" />

        {/* phones: the transom is too narrow, so the name runs up the glass */}
        <span className="font-inscription absolute bottom-3 left-1/2 -translate-x-1/2 rotate-180 text-[0.6rem] tracking-[0.3em] whitespace-nowrap text-champagne uppercase [writing-mode:vertical-rl] sm:hidden">
          {name}
        </span>
      </div>
    </motion.button>
  );
}

function Shutter({ delay, ready, height }) {
  return (
    <motion.article
      className="win group relative flex min-w-0 flex-col self-end"
      style={{ height: `${height}%` }}
      initial={{ opacity: 0 }}
      animate={ready ? { opacity: 1 } : undefined}
      transition={{ duration: 1.2, ease: EASE, delay }}
      aria-label="Forthcoming project"
    >
      <Transom>
        <span className="font-inscription text-[clamp(0.6rem,0.85vw,0.8rem)] tracking-[0.28em] text-champagne/55 uppercase">
          Forthcoming
        </span>
      </Transom>

      <div className="win-glass shutter relative flex flex-1 flex-col overflow-hidden border border-gold/25 bg-navy-deep">
        <div className="shutter-light absolute inset-0" />
        {Array.from({ length: SLATS }, (_, i) => (
          <div
            key={i}
            className="slat relative flex-1 border-b border-navy-deep"
            style={{ "--i": i }}
          />
        ))}
        <div className="reveal pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute inset-[5px] border border-gold/15" />
      </div>
    </motion.article>
  );
}

function Transom({ children }) {
  return (
    <div className="relative hidden h-[clamp(36px,4.6vh,48px)] w-full items-center justify-center border border-b-0 border-gold/35 bg-navy-deep/60 px-2 transition-colors duration-500 group-hover:bg-(--accent) sm:flex">
      {children}
    </div>
  );
}

// a gold ring that follows the pointer over the live windows (cursor-follow pattern from Skiper UI)
function CursorLabel({ x, y, label }) {
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });
  return (
    <motion.div
      aria-hidden="true"
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed top-0 left-0 z-40"
    >
      <AnimatePresence>
        {label && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6, transition: { duration: 0.15 } }}
            transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
            className="font-inscription -mt-9 -ml-9 grid size-18 place-items-center rounded-full border border-gold/70 bg-navy-deep/40 text-[0.62rem] tracking-[0.3em] text-champagne uppercase backdrop-blur-[2px]"
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

import { useEffect, useRef, useState } from "react";
import { animate, splitText, stagger } from "animejs";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import SilkBackground from "@/components/SilkBackground";
import { useMedia } from "@/lib/use-media";
import { projects, showcase } from "@/projects";

const EASE = [0.23, 1, 0.32, 1];
const OPEN = { duration: 0.75, ease: [0.77, 0, 0.175, 1] };
const HOVER_INTENT = 90; // ms the pointer must rest before a panel opens, so sweeping across never flickers

export default function Hero({ ready = true, onOpen, paused, onSection }) {
  const reduce = useReducedMotion();
  const section = useRef(null);
  const heading = useRef(null);
  const inView = useInView(section, { margin: "-10% 0px" });
  useEffect(() => {
    if (inView) onSection?.("top");
  }, [inView, onSection]);

  // anime.js splits the headline into letters, each rising out of its own clipped line
  useEffect(() => {
    const split = splitText(heading.current, { chars: { wrap: "clip" } });
    if (!ready) {
      split.chars.forEach((c) => (c.style.transform = "translateY(110%)"));
      return () => split.revert();
    }
    const a = reduce
      ? animate(split.chars, { translateY: "0%", duration: 0 })
      : animate(split.chars, { translateY: ["110%", "0%"], duration: 1100, delay: stagger(16, { start: 150 }), ease: "outExpo" });
    return () => {
      a.revert();
      split.revert();
    };
  }, [ready, reduce]);

  return (
    <section ref={section} id="top" className="relative flex min-h-svh flex-col overflow-hidden pt-[clamp(84px,12vh,120px)]">
      <SilkBackground />

      <div className="relative px-4 text-center">
        <h1 className="font-display text-[clamp(2rem,4.4vw,4.4rem)] leading-[1.06] font-normal tracking-[-0.02em] text-balance text-ink">
          <span ref={heading} className="block">
            Building your future, <span className="text-gold-display">one property at a time</span>
          </span>
        </h1>
        <motion.p
          initial={{ opacity: 0, filter: "blur(6px)" }}
          animate={ready ? { opacity: 1, filter: "blur(0px)" } : undefined}
          transition={{ duration: 1, ease: EASE, delay: 0.9 }}
          className="font-inscription mt-5 flex items-center justify-center gap-4 text-[clamp(0.7rem,1vw,0.9rem)] tracking-[0.32em] text-balance text-charcoal/80 uppercase"
        >
          <span aria-hidden="true" className="hidden h-px w-10 bg-gold sm:block" />
          Securing wealth, creating your legacy
          <span aria-hidden="true" className="hidden h-px w-10 bg-gold sm:block" />
        </motion.p>
      </div>

      <Panels ready={ready} playing={ready && inView && !paused && !reduce} onOpen={onOpen} />
    </section>
  );
}

// Five projects side by side as tall panels; the active one widens and its name and way in appear.
// The expand-on-hover interaction follows Skiper UI's HoverExpand (skiper52); on phones
// the row turns into a vertical stack that expands the same way (its skiper53 sibling).
function Panels({ ready, playing, onOpen }) {
  const wide = useMedia("(min-width: 768px)");
  const [active, setActive] = useState(1);
  const intent = useRef(0);

  const hoverStart = (i) => {
    clearTimeout(intent.current);
    intent.current = setTimeout(() => setActive(i), HOVER_INTENT);
  };
  useEffect(() => () => clearTimeout(intent.current), []);

  return (
    <motion.div
      className={`relative mx-auto mt-[clamp(28px,5vh,56px)] mb-[clamp(20px,4vh,44px)] flex w-full max-w-[1480px] flex-1 gap-[clamp(6px,0.8vw,12px)] px-[clamp(16px,3.4vw,48px)] ${
        wide ? "min-h-[clamp(340px,50vh,600px)] flex-row" : "min-h-[560px] flex-col"
      }`}
      initial={{ opacity: 0, transform: "translateY(24px)" }}
      animate={ready ? { opacity: 1, transform: "translateY(0px)" } : undefined}
      transition={{ duration: 1.1, ease: EASE, delay: 0.55 }}
      onHoverEnd={() => clearTimeout(intent.current)}
    >
      {showcase.map((id, i) => (
        <Panel
          key={`${id}-${i}`}
          id={id}
          wide={wide}
          isActive={active === i}
          playing={playing}
          onHover={wide ? () => hoverStart(i) : undefined}
          onActivate={() => setActive(i)}
          onOpen={onOpen}
        />
      ))}
    </motion.div>
  );
}

function Panel({ id, wide, isActive, playing, onHover, onActivate, onOpen }) {
  const p = projects[id];
  const self = useRef(null);
  const video = useRef(null);

  // the three loops run together and never pause on hover (that restart is what stuttered);
  // they only stop while the hero is off screen or a project page covers it
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (playing) v.play().catch(() => {});
    else v.pause();
  }, [playing]);

  const press = () => {
    if (!p) return onActivate();
    // first tap opens a closed panel (touch has no hover); a tap on the open one enters it
    if (isActive) onOpen?.(id, self.current.getBoundingClientRect());
    else onActivate();
  };

  return (
    <motion.button
      ref={self}
      type="button"
      onClick={press}
      onHoverStart={onHover}
      // keyboard focus opens a panel; a tap also focuses, and must not open-then-enter in one go
      onFocus={(e) => e.currentTarget.matches(":focus-visible") && onActivate()}
      aria-label={p ? (isActive ? `Enter ${p.name}` : `Show ${p.name}`) : "Forthcoming project"}
      aria-expanded={isActive}
      className="group relative min-h-0 min-w-0 overflow-hidden rounded-[6px] text-left focus-visible:outline-offset-2"
      style={{ flexBasis: 0, "--accent": p?.accent ?? "var(--color-gold)" }}
      animate={{ flexGrow: isActive ? (wide ? 5.4 : 4) : 1 }}
      transition={OPEN}
      whileTap={{ scale: 0.99 }}
    >
      {p ? (
        <>
          {/* sized to the widest the panel ever gets, so opening a panel only reveals more of it:
              the video is never resized or re-scaled mid-animation */}
          <video
            ref={video}
            src={`${p.panel}.mp4`}
            poster={`${p.panel}.jpg`}
            muted
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
            aria-hidden="true"
            className={`pointer-events-none absolute max-w-none object-cover ${
              wide ? "top-0 left-1/2 h-full w-[max(100%,62vw)] -translate-x-1/2" : "top-1/2 left-0 h-[max(100%,380px)] w-full -translate-y-1/2"
            }`}
          />
          {/* the film fades into the project's own colour from the palette */}
          <div className="accent-fade absolute inset-0 opacity-90 transition-opacity duration-700 group-aria-expanded:opacity-75" />
        </>
      ) : (
        // the unannounced projects: champagne card with a gold hairline, nothing to show yet
        <div className="absolute inset-0 border border-gold/45 bg-champagne/60" />
      )}

      {/* closed: an accent dot and the name running up the slice */}
      <motion.span
        className={`absolute flex items-center gap-3 ${wide ? "bottom-5 left-1/2 -translate-x-1/2 flex-col-reverse" : "top-1/2 left-5 -translate-y-1/2"}`}
        animate={{ opacity: isActive ? 0 : 1 }}
        transition={{ duration: isActive ? 0.15 : 0.5, delay: isActive ? 0 : 0.35 }}
      >
        <span aria-hidden="true" className={`size-2 shrink-0 rounded-full ring-1 ${p ? "bg-(--accent) ring-paper/80" : "bg-gold ring-gold"}`} />
        <span
          className={`font-inscription text-[0.68rem] tracking-[0.3em] whitespace-nowrap uppercase ${p ? "text-paper" : "text-charcoal/70"} ${
            wide ? "rotate-180 [writing-mode:vertical-rl]" : ""
          }`}
        >
          {p ? p.name : "Forthcoming"}
        </span>
      </motion.span>

      {/* open: title, line and a way in, arriving after the panel has widened */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-4 p-[clamp(16px,2vw,28px)]"
            initial={{ opacity: 0, transform: "translateY(12px)" }}
            animate={{ opacity: 1, transform: "translateY(0px)", transition: { duration: 0.6, ease: EASE, delay: 0.3 } }}
            exit={{ opacity: 0, transition: { duration: 0.12 } }}
          >
            {p ? (
              <>
                <div className="min-w-0">
                  <p className="font-display text-[clamp(1.7rem,2.8vw,2.9rem)] leading-none tracking-[-0.02em] whitespace-nowrap text-paper">{p.name}</p>
                  <p className="font-inscription mt-2 text-[0.7rem] tracking-[0.28em] whitespace-nowrap text-champagne uppercase">{p.tagline}</p>
                </div>
                <span className="font-inscription flex items-center gap-3 rounded-full bg-paper px-5 py-3 text-[0.7rem] tracking-[0.26em] whitespace-nowrap text-ink uppercase ring-1 ring-paper transition-colors duration-200 group-hover:bg-(--accent) group-hover:text-paper">
                  Enter
                  <svg viewBox="0 0 24 10" className="w-5" aria-hidden="true">
                    <path d="M0 5h22M18 1l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.3" />
                  </svg>
                </span>
              </>
            ) : (
              <div>
                <p className="font-display text-[clamp(1.5rem,2.4vw,2.4rem)] leading-tight text-ink">Forthcoming</p>
                <p className="mt-1 text-charcoal/80">The next Heir Estate project is on the drawing board.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

import { memo, useEffect, useRef, useState } from "react";
import { animate, splitText, stagger } from "animejs";
import { motion, useInView, useReducedMotion } from "motion/react";
import { inPlace, siteUrl } from "@/lib/links";
import { order, projects } from "@/projects";

const EASE = [0.23, 1, 0.32, 1];
const WIPE = "cubic-bezier(0.77, 0, 0.175, 1)";
const HOVER_INTENT = 90; // ms the pointer must rest on a name, so sweeping across the row never flickers
const HOLD = 7; // seconds each film holds before the next wipes in

// memo: the nav's section label changes as you scroll and re-renders the page around it;
// this section's own props never change with it, so it sits that render out
export default memo(function Hero({ ready = true, onOpen, paused, onSection }) {
  const reduce = useReducedMotion();
  const section = useRef(null);
  const heading = useRef(null);
  const inView = useInView(section, { margin: "-10% 0px" });
  // the film showing, and the one before it, which stays whole beneath the next one's wipe
  const [[active, before], setPair] = useState([0, null]);
  const setActive = (next) => setPair(([a, b]) => (next === a ? [a, b] : [next, a]));
  const [held, setHeld] = useState(false); // the pointer is on the index: hold the film it chose
  const intent = useRef(0);
  const playing = ready && inView && !paused;

  useEffect(() => {
    if (inView) onSection?.("top");
  }, [inView, onSection]);
  useEffect(() => () => clearTimeout(intent.current), []);

  // anime.js splits the headline into letters, each rising out of its own clipped line; once
  // risen it is plain text again, as each letter's clip would cut the italic's overhanging tails
  useEffect(() => {
    const split = splitText(heading.current, { chars: { wrap: "clip" } });
    if (!ready) {
      split.chars.forEach((c) => (c.style.transform = "translateY(110%)"));
      return () => split.revert();
    }
    if (reduce) return void split.revert();
    const a = animate(split.chars, { translateY: ["110%", "0%"], duration: 1100, delay: stagger(16, { start: 150 }), ease: "outExpo", onComplete: () => split.revert() });
    return () => {
      a.pause();
      split.revert();
    };
  }, [ready, reduce]);

  const choose = (i) => {
    clearTimeout(intent.current);
    intent.current = setTimeout(() => setActive(i), HOVER_INTENT);
  };

  return (
    <section ref={section} id="top" className="relative isolate flex min-h-svh flex-col justify-end overflow-hidden bg-ink text-paper">
      {/* One film at a time, full bleed. The camera of the loader arrives through the lit window
          into this frame, so it settles from a slight push-in. */}
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ transform: "scale(1.08)" }}
        animate={ready ? { transform: "scale(1)" } : undefined}
        transition={{ duration: 1.8, ease: EASE }}
      >
        {order.map((id, i) => (
          <Film key={id} p={projects[id]} layer={active === i ? 2 : before === i ? 1 : 0} playing={playing && active === i} reduce={reduce} />
        ))}
      </motion.div>
      {/* dark at the foot for the type, a little at the top for the nav, the film open in between */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(12_21_38/0.9)_0%,rgb(12_21_38/0.45)_45%,rgb(12_21_38/0.15)_70%,rgb(12_21_38/0.5)_100%)]"
      />

      <div className="mx-auto w-full max-w-[1480px] px-[clamp(16px,3.4vw,48px)] pt-[clamp(120px,22vh,220px)]">
        <h1 className="font-display max-w-[15ch] text-[clamp(2.7rem,6.6vw,6.6rem)] leading-[0.98] font-normal tracking-[-0.03em] text-balance">
          <span ref={heading} className="block">
            Building your future, <span className="text-champagne italic">one property at a time</span>
          </span>
        </h1>
        <motion.p
          initial={{ opacity: 0, filter: "blur(6px)" }}
          animate={ready ? { opacity: 1, filter: "blur(0px)" } : undefined}
          transition={{ duration: 1, ease: EASE, delay: 0.9 }}
          className="font-display mt-5 flex items-center gap-4 text-[clamp(1.1rem,1.6vw,1.45rem)] text-paper/80 italic"
        >
          <span aria-hidden="true" className="h-px w-10 bg-gold" />
          Securing wealth, creating your legacy
        </motion.p>

        {/* The projects as an index across the foot. Pointing at a name (or reaching it by keyboard)
            wipes its film in; choosing it opens the project. Left alone, the films take turns:
            the line under the one showing fills, and when it is full the next wipes in. */}
        <ol
          className="mt-[clamp(40px,8vh,88px)] mb-[clamp(20px,4vh,40px)] grid border-t border-paper/20 md:grid-cols-3"
          onPointerEnter={(e) => e.pointerType === "mouse" && setHeld(true)}
          onPointerLeave={() => (clearTimeout(intent.current), setHeld(false))}
        >
          {order.map((id, i) => {
            const p = projects[id];
            const on = active === i;
            return (
              <motion.li
                key={id}
                initial={{ opacity: 0, transform: "translateY(16px)" }}
                animate={ready ? { opacity: 1, transform: "translateY(0px)" } : undefined}
                transition={{ duration: 0.8, ease: EASE, delay: 1.1 + i * 0.07 }}
                className="relative border-b border-paper/20 md:border-b-0"
              >
                {/* how long until the next film: fills while this one shows, then hands over */}
                <span aria-hidden="true" className="absolute inset-x-0 -top-px h-px overflow-hidden">
                  {on && (
                    <span
                      key={active}
                      className="hero-progress block h-full origin-left bg-champagne"
                      style={{ animationDuration: `${HOLD}s`, animationPlayState: playing && !held ? "running" : "paused" }}
                      onAnimationEnd={() => setActive((active + 1) % order.length)}
                    />
                  )}
                </span>
                <a
                  href={siteUrl(id)}
                  onClick={inPlace((e) => onOpen(id, e.currentTarget.getBoundingClientRect()))}
                  onPointerEnter={(e) => e.pointerType === "mouse" && choose(i)}
                  onFocus={() => setActive(i)}
                  aria-label={`${p.name}, ${p.tagline}`}
                  className={`group flex items-baseline gap-4 py-[clamp(16px,2.6vh,26px)] transition-[color,transform] duration-200 ease-out active:scale-[0.98] md:pr-6 ${
                    on ? "text-paper" : "text-paper/55 hover:text-paper"
                  }`}
                >
                  <span className="font-inscription text-[0.68rem] tracking-[0.26em] text-champagne/80">{String(i + 1).padStart(2, "0")}</span>
                  <span className="min-w-0">
                    <span className="font-display flex items-center gap-3 text-[clamp(1.35rem,2vw,1.9rem)] leading-tight">
                      {p.name}
                      <svg
                        viewBox="0 0 24 10"
                        aria-hidden="true"
                        className={`w-5 shrink-0 transition-[opacity,transform] duration-200 ease-out ${on ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0"}`}
                      >
                        <path d="M0 5h22M18 1l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.3" />
                      </svg>
                    </span>
                    <span className="font-inscription mt-1 block text-[0.62rem] tracking-[0.22em] text-champagne/75 uppercase">{p.tagline}</span>
                  </span>
                </a>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
});

// A project's film. The one chosen comes in on top of the one before, wiped in from the left
// (the clip-path reveal of Skiper UI's image reveals); the one before stays whole beneath it until
// covered. Only the film showing plays and loads; the rest wait on their posters.
function Film({ p, layer, playing, reduce }) {
  const video = useRef(null);
  const first = useRef(layer === 2); // the opening film is simply there, no wipe
  const [seen, setSeen] = useState(first.current);

  useEffect(() => {
    if (layer !== 2) return;
    setSeen(true);
    if (first.current) return void (first.current = false);
    if (!reduce) video.current.animate([{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)" }], { duration: 1100, easing: WIPE });
  }, [layer, reduce]);

  useEffect(() => {
    const v = video.current;
    if (playing) v.play().catch(() => {});
    else v.pause();
  }, [playing]);

  return (
    <video
      ref={video}
      src={seen ? `${p.hero}.mp4` : undefined}
      poster={`${p.hero}.jpg`}
      muted
      loop
      playsInline
      preload={seen ? "auto" : "none"}
      disablePictureInPicture
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      style={{ zIndex: layer }}
    />
  );
}

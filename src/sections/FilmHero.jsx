import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { FINS } from "@/lib/fins";
import Plumeria from "@/components/Plumeria";
import { brushEdge } from "@/lib/ink";
import { ridge } from "@/lib/topo";

const EASE = [0.23, 1, 0.32, 1];
const GUTTER = "px-[clamp(16px,4vw,64px)]";
// the film's opening: its brush-stroke title, then "Rooted in Japan", then the aerial, which is
// where our own title comes up (a project's introAt moves it)
const TITLE_AT = 8;


// The opening of the brand film plays once and comes to rest on the towers; scrolling then pulls
// a sheet of paper up over it, its top edge left ragged as if laid down with a brush, carrying
// what comes next (children).
export default function FilmHero({ p, Title, onBook, onFilm, children }) {
  const video = useRef(null);
  const top = useRef(null);
  const reduce = useReducedMotion();
  const [titled, setTitled] = useState(false);
  const [ended, setEnded] = useState(false);
  const fins = p.motif === "fins";
  const hills = p.motif === "contours";
  const edge = useMemo(() => (hills ? ridge(9) : !fins && [brushEdge(7), brushEdge(19)]), [fins, hills]);

  // the film pushes back and dims as the paper covers it
  const { scrollYProgress } = useScroll({ target: top, offset: ["start start", "end start"] });
  const transform = useTransform(scrollYProgress, (v) => `scale(${1 + v * 0.08})`);
  const dim = useTransform(scrollYProgress, [0, 1], [0, 0.6]);
  // the fins grow to full height as the sheet comes up
  const rise = useTransform(scrollYProgress, [0, 0.7], ["scaleY(0.3)", "scaleY(1)"]);

  useEffect(() => {
    const v = video.current;
    if (reduce) return setTitled(true), setEnded(true);
    const tick = () => v.currentTime >= (p.introAt ?? TITLE_AT) && setTitled(true);
    v.addEventListener("timeupdate", tick);
    // a phone in low-power mode will not autoplay: show the towers and the title instead
    const t = setTimeout(() => v.paused && v.currentTime === 0 && (setEnded(true), setTitled(true)), 2500);
    return () => (v.removeEventListener("timeupdate", tick), clearTimeout(t));
  }, [reduce, p.introAt]);

  return (
    <div className="relative">
      {/* scrolls with the page while the film stays pinned: it is what the top bar sees as dark */}
      <div ref={top} data-tone="dark" aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-svh" />
      <section className="sticky top-0 h-svh overflow-hidden bg-navy-deep">
        <motion.div className="absolute inset-0" style={{ transform }}>
          {/* once the film has played, its last frame stays: the towers in the morning light */}
          <video
            ref={video}
            src={`${p.intro}.mp4`}
            poster={ended ? `${p.intro}-end.jpg` : `${p.intro}.jpg`}
            autoPlay={!reduce}
            muted
            playsInline
            preload="auto"
            onEnded={() => setEnded(true)}
            aria-hidden="true"
            className="size-full object-cover"
          />
        </motion.div>
        <motion.div aria-hidden="true" className="absolute inset-0 bg-navy-deep" style={{ opacity: dim }} />
        <div
          aria-hidden="true"
          className={`absolute inset-0 bg-linear-to-t from-navy-deep/85 via-navy-deep/25 via-45% to-transparent transition-opacity duration-[1400ms] ease-(--ease-out-strong) ${titled ? "opacity-100" : "opacity-0"}`}
        />

        <div className={`absolute inset-x-0 bottom-0 pb-[clamp(56px,11vh,120px)] ${GUTTER}`}>
          <Title className="font-display text-[clamp(3.4rem,10vw,9.5rem)] leading-[0.92] font-normal tracking-[-0.03em] text-paper">
            {p.name.split(" ").map((w, i) => (
              <span key={i} className="mr-[0.22em] inline-block overflow-hidden pb-[0.08em] align-bottom">
                <motion.span
                  className="inline-block"
                  initial={false}
                  animate={{ transform: titled ? "translateY(0%)" : "translateY(105%)" }}
                  transition={{ duration: 1.2, ease: EASE, delay: i * 0.09 }}
                >
                  {w}
                </motion.span>
              </span>
            ))}
          </Title>
          <motion.p
            className="font-display mt-3 text-[clamp(1.15rem,2vw,1.6rem)] text-champagne italic"
            initial={false}
            animate={{ opacity: titled ? 1 : 0, transform: titled ? "translateY(0px)" : "translateY(10px)" }}
            transition={{ duration: 1, ease: EASE, delay: 0.35 }}
          >
            {p.tagline}
          </motion.p>
          {/* the actions are there from the first frame: nobody waits for the film to book */}
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <button
              type="button"
              onClick={onBook}
              className="rounded-full bg-champagne px-6 py-3.5 text-[0.95rem] text-ink transition-[background-color,transform] duration-200 ease-(--ease-out-strong) hover:bg-paper active:scale-[0.97] motion-reduce:transform-none"
            >
              Book a private viewing
            </button>
            <button type="button" onClick={onFilm} className="group flex items-center gap-3 text-[0.95rem] text-paper transition-transform duration-150 active:scale-[0.97] motion-reduce:transform-none">
              <svg viewBox="0 0 40 40" className="size-10" aria-hidden="true">
                <circle cx="20" cy="20" r="19" fill="none" stroke="var(--color-champagne)" strokeOpacity="0.7" />
                <path d="M16.5 13.5v13l10-6.5z" fill="var(--color-champagne)" />
              </svg>
              <span className="underline-offset-4 group-hover:underline">Watch the film</span>
            </button>
          </div>
        </div>
      </section>

      {/* the sheet of paper, its leading edge brushed, or set with the facade's fins */}
      <div className="relative z-10">
        {fins ? (
          <motion.svg
            viewBox="0 0 1000 60"
            preserveAspectRatio="none"
            aria-hidden="true"
            className="absolute bottom-[calc(100%-1px)] left-0 h-[clamp(36px,7vw,110px)] w-full origin-bottom"
            style={{ transform: reduce ? "none" : rise }}
          >
            {FINS.map((f, i) => (
              <rect key={i} x={f.x} y={60 - f.h} width="5" height={f.h} className="fill-paper" />
            ))}
          </motion.svg>
        ) : hills ? (
          <>
            <motion.svg
              viewBox="0 0 1000 60"
              preserveAspectRatio="none"
              aria-hidden="true"
              className="absolute bottom-[calc(100%-1px)] left-0 h-[clamp(40px,7vw,110px)] w-full origin-bottom"
              style={{ transform: reduce ? "none" : rise }}
            >
              {edge.contours.map((d, i) => (
                <path key={i} d={d} fill="none" vectorEffect="non-scaling-stroke" strokeWidth="1" className="stroke-paper/60" />
              ))}
              <path d={edge.fill} className="fill-paper" />
            </motion.svg>
            <Plumeria className="absolute right-[8%] bottom-[calc(100%-18px)] w-[clamp(64px,8vw,120px)] -rotate-12" />
          </>
        ) : (
          <svg viewBox="0 0 1000 60" preserveAspectRatio="none" aria-hidden="true" className="absolute bottom-[calc(100%-1px)] left-0 h-[clamp(28px,5vw,80px)] w-full">
            <path d={edge[1]} className="fill-paper/50" transform="translate(0 -6)" />
            <path d={edge[0]} className="fill-paper" />
          </svg>
        )}
        <div className="bg-paper">{children}</div>
      </div>
    </div>
  );
}

import { useEffect, useRef } from "react";
import { animate, createDrawable, createTimeline, stagger } from "animejs";
import { Mark } from "@/components/Logo";

const SEEN = "heir-intro-seen";
const WORD = "HEIR ESTATE";
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// Resolves when fonts and the first frame of each hero video are in, or after 8s so a slow
// connection still gets in. The loops buffer the rest while they play.
function heroAssets() {
  const videos = [...document.querySelectorAll("video")].map((v) =>
    v.readyState >= 2
      ? null
      : new Promise((r) => {
          v.addEventListener("loadeddata", r, { once: true });
          v.addEventListener("error", r, { once: true });
        })
  );
  return Promise.race([Promise.all([document.fonts.ready, ...videos]), wait(8000)]);
}

// First visit: a gold tower builds floor by floor, becomes the logo, and the camera pushes
// through its lit window into the hero. Repeat visits and reduced motion get the logo only.
export default function Loader({ onReveal, onDone }) {
  const root = useRef(null);
  const canvas = useRef(null);
  const stage = useRef(null);

  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let short = reduce;
    try {
      short ||= sessionStorage.getItem(SEEN) === "1";
    } catch {}

    const running = [];
    const play = (a) => (running.push(a), a);
    let cancelled = false;
    let scene;
    const html = document.documentElement;
    delete html.dataset.arrive; // the navy painted before the scripts ran (sites.js); the loader is that navy now
    html.style.overflow = "hidden";
    const assets = heroAssets();

    const svg = stage.current.querySelector("svg");
    const win = svg.querySelector("rect");
    const strokes = createDrawable(svg.querySelectorAll("path"));
    const letters = stage.current.querySelectorAll("[data-letter]");
    win.style.opacity = "0";

    async function run() {
      if (!short) {
        // Three.js is only fetched when the 3D intro actually plays
        const { createTowerScene } = await import("@/lib/towers");
        if (cancelled) return;
        scene = createTowerScene(canvas.current);
        const build = play(createTimeline({ defaults: { ease: "outExpo", duration: 600 } }));
        build.add(scene.grid, { opacity: [0, 0.14], duration: 900, ease: "outQuad" }, 0);
        // one storey at a time, both towers rising together
        for (const f of scene.floors) {
          const at = 150 + f.level * 70;
          build.add(f.position, { y: f.y }, at);
          build.add(f.mats[0], { opacity: f.to[0] }, at);
          build.add(f.mats[1], { opacity: f.to[1] }, at);
        }
        build.add(scene.window, { opacity: [0, 0.7, 0.3, 1], duration: 500, ease: "outQuad" }, 1150);
        scene.lights.forEach((l, i) =>
          build.add(l.mat, { opacity: [0, l.to], duration: 260, ease: "outQuad" }, `<<+=${20 + (i % 4) * 15}`)
        );
        play(animate(scene.orbit, { angle: 0, lift: 0.04, radius: 10.5, duration: 2300, ease: "inOutCubic" }));
        await build;
      }
      await assets;
      if (cancelled) return;

      // the building settles into the flat mark: strokes draw, the window switches on, the name rises
      const k = short ? 0.5 : 0.7;
      const mark = play(createTimeline({ defaults: { ease: "inOutQuart" } }));
      if (!short) mark.add(canvas.current, { opacity: 0, scale: 1.12, filter: "blur(6px)", duration: 500, ease: "outQuad" }, 0);
      mark
        .add(stage.current, { opacity: [0, 1], duration: 400 * k, ease: "outQuad" }, 100 * k)
        .add(strokes, { draw: ["0 0", "0 1"], duration: 900 * k, delay: stagger(110 * k) }, 150 * k)
        .add(win, { opacity: [0, 0.7, 0.3, 1], duration: 500 * k, ease: "outQuad" }, 900 * k)
        .add(letters, { opacity: [0, 1], y: ["0.6em", "0em"], duration: 700 * k, ease: "outExpo", delay: stagger(35 * k) }, 700 * k);
      await mark;
      await wait(short ? 100 : 250);
      if (cancelled) return;

      if (!reduce) {
        // push through the window: scale the mark around the window until its gold fills the screen
        const r = win.getBoundingClientRect();
        const s = stage.current.getBoundingClientRect();
        stage.current.style.transformOrigin = `${r.left + r.width / 2 - s.left}px ${r.top + r.height / 2 - s.top}px`;
        win.classList.remove("lit-window"); // a drop-shadow at 100x scale costs frames
        const cover = Math.max(innerWidth / r.width, innerHeight / r.height) * 1.4;
        await play(animate(stage.current, { scale: cover, duration: short ? 700 : 900, ease: "inExpo" }));
        if (cancelled) return;
      }

      // the gold now covers everything; drop the navy behind it and let the light clear onto the hero
      root.current.style.background = "transparent";
      onReveal();
      await play(animate(stage.current, { opacity: 0, duration: 600, ease: "outQuad" }));
      if (cancelled) return;
      try {
        sessionStorage.setItem(SEEN, "1");
      } catch {}
      onDone();
    }
    run();

    // React StrictMode runs this effect twice in dev; the first run must leave nothing behind
    return () => {
      cancelled = true;
      running.forEach((a) => a.revert());
      scene?.dispose();
      html.style.overflow = "";
    };
  }, [onReveal, onDone]);

  return (
    <div ref={root} role="status" aria-label="Loading Heir Estate" className="fixed inset-0 z-50 grid place-items-center bg-navy">
      <canvas ref={canvas} className="absolute inset-0 h-full w-full" />
      <div ref={stage} className="relative flex flex-col items-center opacity-0">
        <Mark className="h-[clamp(88px,16vh,160px)] w-auto text-champagne" />
        <p aria-hidden="true" className="font-inscription mt-7 text-[clamp(0.8rem,1.2vw,1.05rem)] tracking-[0.42em] text-champagne">
          {WORD.split("").map((l, i) => (
            <span key={i} data-letter className="inline-block whitespace-pre opacity-0">
              {l}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useRef, useState } from "react";
import { useInView, useScroll } from "motion/react";
import { sequence } from "@/lib/frames";

// Scroll walks you through the unit, frame by frame. At each stop the camera holds still and a
// line draws from the thing worth seeing to a note about it; scroll on and it lets go.
//
// Scroll is measured in units: one per frame while walking, HOLD while standing at a stop.
const HOLD = 44;
const LEAD = 22; // standing at the door, under the title, before the first step
const TAIL = 14;
const UNIT_VH = 1.15; // section height per unit
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t) => 1 - (1 - t) ** 3;

// points [unit, frame] the scroll position is interpolated through; holds are where each stop begins
function timeline(stops, count, cut) {
  const pts = [[0, 0], [LEAD, 0]];
  const holds = [];
  let u = LEAD;
  let f = 0;
  let cutAt = 0;
  for (const s of stops) {
    if (cut > f && cut <= s.at) cutAt = u + (cut - f);
    u += s.at - f;
    f = s.at;
    pts.push([u, f]);
    holds.push(u);
    u += HOLD;
    pts.push([u, f]);
  }
  u += count - 1 - f;
  pts.push([u, count - 1]);
  u += TAIL;
  pts.push([u, count - 1]);
  return { pts, holds, cutAt, total: u };
}

function frameAt(pts, u) {
  for (let i = 1; i < pts.length; i++) {
    const [u1, f1] = pts[i];
    if (u <= u1) {
      const [u0, f0] = pts[i - 1];
      return u1 === u0 ? f1 : f0 + ((f1 - f0) * (u - u0)) / (u1 - u0);
    }
  }
  return pts.at(-1)[1];
}

export default function Walkthrough({ walk, unit }) {
  const root = useRef(null);
  const canvas = useRef(null);
  const els = useRef({});
  const seq = useMemo(() => sequence(walk.frames.split("/").pop()), [walk.frames]);
  const tl = useMemo(() => timeline(walk.stops, seq.count, walk.cut), [walk, seq.count]);
  const [stop, setStop] = useState(-1); // the stop whose note is up (or last passed, for the rail)
  const { scrollYProgress } = useScroll({ target: root, offset: ["start start", "end end"] });

  const near = useInView(root, { margin: "150% 0px", once: true });
  useEffect(() => {
    if (near) seq.load();
  }, [near, seq]);

  useEffect(() => {
    const c = canvas.current;
    const ctx = c.getContext("2d");
    const { dot, line, card, title, veil, fill } = els.current;
    let dpr = 1;
    let w = 0;
    let h = 0;
    let drawn = "";
    let queued = false;
    let shown = -2;

    const draw = () => {
      queued = false;
      const u = scrollYProgress.get() * tl.total;

      // the stop in view, and how far its note is drawn: in as you arrive, out as you leave
      let k = -1;
      let a = 0;
      let draw01 = 0;
      tl.holds.forEach((h0, i) => {
        const p = (u - h0) / HOLD;
        const inn = clamp((p + 0.1) / 0.3);
        const out = clamp((1.02 - p) / 0.22);
        const v = Math.min(inn, out);
        if (v > a) (k = i), (a = v), (draw01 = ease(inn));
      });
      const passed = tl.holds.findLastIndex((h0) => u >= h0 - 8);
      const show = k >= 0 ? k : passed;
      if (show !== shown) setStop((shown = show));

      title.style.opacity = 1 - clamp(u / LEAD);
      veil.style.opacity = clamp(1 - Math.abs(u - tl.cutAt) / 5);
      fill.style.transform = `scaleX(${u / tl.total})`;

      const img = seq.nearest(Math.round(frameAt(tl.pts, u)));
      if (!img) return;
      // turn toward the thing being pointed at: on a narrow screen it may sit outside the crop
      const s = walk.stops[k] ?? { x: 0.5, y: 0.5 };
      const fx = 0.5 + (s.x - 0.5) * ease(a);
      const fy = 0.5 + (s.y - 0.5) * ease(a);
      const kk = Math.max(c.width / img.naturalWidth, c.height / img.naturalHeight);
      const dw = img.naturalWidth * kk;
      const dh = img.naturalHeight * kk;
      const dx = clamp(c.width / 2 - fx * dw, c.width - dw, 0);
      const dy = clamp(c.height / 2 - fy * dh, c.height - dh, 0);
      const key = `${w}:${img.src}:${dx | 0}:${dy | 0}`;
      if (key !== drawn) {
        drawn = key;
        ctx.drawImage(img, dx, dy, dw, dh);
      }

      // the note: a dot on the thing, a line out to the side with more room, the card at its end
      if (k < 0 || a <= 0) {
        dot.style.opacity = card.style.opacity = line.style.opacity = 0;
        return;
      }
      const px = (dx + s.x * dw) / dpr;
      const py = (dy + s.y * dh) / dpr;
      const side = px < w / 2 ? 1 : -1;
      const ex = px + side * Math.min(170, w * 0.14);
      const ey = py - Math.min(110, h * 0.13);
      dot.style.opacity = a;
      dot.style.transform = `translate(${px}px, ${py}px) scale(${0.5 + 0.5 * ease(a)})`;
      line.setAttribute("d", `M${px} ${py}L${px + side * 60} ${ey}H${ex}`);
      line.style.opacity = 1;
      line.style.strokeDashoffset = 1 - draw01;
      card.style.opacity = clamp((draw01 - 0.55) / 0.45) * a;
      if (w >= 768) {
        const cw = card.offsetWidth;
        const left = clamp(side > 0 ? ex + 14 : ex - 14 - cw, 16, w - cw - 16);
        card.style.transform = `translate(${left}px, ${clamp(ey - 28, 88, h - card.offsetHeight - 120)}px)`;
      } else card.style.transform = "";
    };
    const schedule = () => {
      if (!queued) (queued = true), requestAnimationFrame(draw);
    };
    const size = () => {
      dpr = Math.min(devicePixelRatio, 1.5);
      w = innerWidth;
      h = c.clientHeight;
      c.width = Math.round(w * dpr);
      c.height = Math.round(h * dpr);
      drawn = "";
      schedule();
    };

    size();
    const off = scrollYProgress.on("change", schedule);
    addEventListener("resize", size);
    addEventListener("heir:frame", schedule);
    return () => {
      off();
      removeEventListener("resize", size);
      removeEventListener("heir:frame", schedule);
    };
  }, [scrollYProgress, seq, tl, walk.stops]);

  // a room on the rail takes you to the middle of its stop
  const goTo = (i) => {
    const top = root.current.getBoundingClientRect().top + scrollY;
    const run = root.current.offsetHeight - innerHeight;
    scrollTo({ top: top + ((tl.holds[i] + HOLD * 0.45) / tl.total) * run, behavior: "smooth" });
  };

  const s = walk.stops[stop];
  const ref = (name) => (n) => void (els.current[name] = n);

  return (
    <section ref={root} id="walkthrough" aria-labelledby="walkthrough-title" className="relative bg-navy-deep" style={{ height: `${tl.total * UNIT_VH}vh` }}>
      <div className="sticky top-0 h-svh overflow-hidden">
        <canvas ref={canvas} aria-hidden="true" className="absolute inset-0 size-full" />
        {/* the film jumps from one room to another here: a breath of navy hides the seam */}
        <div ref={ref("veil")} aria-hidden="true" className="pointer-events-none absolute inset-0 bg-navy-deep opacity-0" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-linear-to-b from-navy-deep/55 via-transparent via-40% to-navy-deep/70" />

        {/* a pool of navy under the title, so it reads over whatever the first frame holds */}
        <div ref={ref("title")} className="pointer-events-none absolute inset-0 grid place-items-center bg-[radial-gradient(60%_45%_at_50%_45%,rgb(12_21_38/0.72),transparent_75%)] px-4 pb-[12vh] text-center">
          <div>
          <p className="font-inscription text-[0.72rem] tracking-[0.3em] text-champagne uppercase">{unit}</p>
          <h3 id="walkthrough-title" className="font-display mt-4 text-[clamp(2.4rem,6vw,5.2rem)] leading-[0.98] tracking-[-0.02em] text-paper">
            Walk through it
          </h3>
          <p className="mx-auto mt-5 max-w-[34ch] text-paper/85">Scroll to step inside. The camera stops in each room to show you around.</p>
          </div>
        </div>

        <svg aria-hidden="true" className="pointer-events-none absolute inset-0 hidden size-full md:block">
          <path ref={ref("line")} pathLength="1" fill="none" stroke="var(--color-champagne)" strokeWidth="1" strokeDasharray="1" strokeDashoffset="1" style={{ opacity: 0 }} />
        </svg>
        <span ref={ref("dot")} aria-hidden="true" className="pointer-events-none absolute top-0 left-0 -mt-2.5 -ml-2.5 grid size-5 place-items-center rounded-full border border-champagne opacity-0">
          <span className="size-2 rounded-full bg-gold" />
        </span>

        <div
          ref={ref("card")}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-3 bottom-24 w-auto rounded-[4px] bg-paper p-5 opacity-0 shadow-[0_24px_48px_-24px_rgb(12_21_38/0.7)] md:inset-x-auto md:top-0 md:bottom-auto md:left-0 md:w-[min(320px,30vw)]"
        >
          {s && (
            <>
              <p className="font-inscription text-[0.64rem] tracking-[0.28em] text-(--accent) uppercase">{s.room}</p>
              <p className="font-display mt-2 text-[1.45rem] leading-tight text-ink">{s.title}</p>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-ink/75">{s.note}</p>
            </>
          )}
        </div>

        {/* the rooms in order: a route along the foot of the screen, each stop a way to jump there */}
        <nav aria-label="Rooms" className="absolute inset-x-0 bottom-0 px-[clamp(16px,4vw,64px)] pb-[clamp(16px,3vh,32px)]">
          <div className="relative h-px bg-paper/25">
            <span ref={ref("fill")} className="absolute inset-0 origin-left bg-gold" style={{ transform: "scaleX(0)" }} />
          </div>
          <ol className="relative h-10">
            {walk.stops.map((st, i) => {
              const at = (tl.holds[i] + HOLD / 2) / tl.total;
              const on = i === stop;
              return (
                <li key={st.room} className="absolute top-0 -translate-x-1/2" style={{ left: `${at * 100}%` }}>
                  <button type="button" onClick={() => goTo(i)} aria-current={on ? "location" : undefined} className="group flex flex-col items-center gap-2 px-1.5 pt-0">
                    <span className={`-mt-[3.5px] size-[7px] rounded-full ring-1 transition-colors duration-300 ${i <= stop ? "bg-gold ring-gold" : "bg-navy-deep ring-paper/60"}`} />
                    <span
                      className={`font-inscription text-[0.6rem] tracking-[0.2em] whitespace-nowrap uppercase transition-colors duration-300 ${on ? "text-champagne" : "text-paper/55 group-hover:text-paper/85"} ${on ? "" : "max-sm:sr-only"}`}
                    >
                      {st.room}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>

      {/* the same tour as text, for screen readers and search */}
      <ol className="sr-only">
        {walk.stops.map((st) => (
          <li key={st.room}>
            {st.title}: {st.note}
          </li>
        ))}
      </ol>
    </section>
  );
}

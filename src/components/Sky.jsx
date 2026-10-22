import { useEffect, useMemo, useRef } from "react";
import { animate, stagger, utils } from "animejs";

// The dusk the facade stands in: a slowly drifting glow on the horizon and a distant
// city whose windows switch on and off. Everything here is background; it never takes focus.
const W = 1440;
const H = 140;

// a seeded skyline so it is the same city on every visit
function buildCity() {
  const rand = utils.createSeededRandom(7);
  const towers = [];
  for (let x = 0; x < W; ) {
    const w = 26 + rand(0, 46);
    // taller towers near the middle, where the headline sits above them
    const centre = 1 - Math.abs(x + w / 2 - W / 2) / (W / 2);
    const h = 22 + rand(0, 40) + centre * rand(10, 70);
    const lights = [];
    for (let y = H - h + 8; y < H - 6; y += 9)
      for (let lx = x + 5; lx < x + w - 6; lx += 8) if (rand(0, 100) < 16) lights.push([lx, y]);
    towers.push({ x, w, h, lights });
    x += w + rand(2, 10);
  }
  return towers;
}

export default function Sky({ ready }) {
  const root = useRef(null);
  const city = useMemo(buildCity, []);

  useEffect(() => {
    const el = root.current;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const anims = [
      animate(el.querySelector("[data-glow='teal']"), {
        x: ["-6vw", "8vw"], y: ["0%", "-12%"], scale: [1, 1.15],
        duration: 19000, ease: "inOutSine", loop: true, alternate: true,
      }),
      animate(el.querySelector("[data-glow='wine']"), {
        x: ["5vw", "-9vw"], y: ["-6%", "4%"], scale: [1.1, 0.95],
        duration: 23000, ease: "inOutSine", loop: true, alternate: true,
      }),
    ];
    return () => anims.forEach((a) => a.revert());
  }, []);

  useEffect(() => {
    if (!ready) return;
    const el = root.current;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const towers = el.querySelectorAll("[data-tower]");
    const lights = [...el.querySelectorAll("[data-light]")];
    if (reduce) {
      utils.set(towers, { scaleY: 1 });
      utils.set(lights, { opacity: 0.5 });
      return;
    }
    // the city rises from the horizon, centre first, then its lights come on
    const anims = [
      animate(towers, { scaleY: [0, 1], duration: 1400, delay: stagger(18, { from: "center" }), ease: "outExpo" }),
      animate(lights, { opacity: [0, () => utils.random(0.35, 0.9, 2)], duration: 600, delay: () => 1100 + utils.random(0, 2200) }),
    ];
    // afterwards a few flats at a time switch off and on again, like a real evening
    const twinkle = setInterval(() => {
      utils.shuffle(lights).slice(0, 6).forEach((l) =>
        animate(l, { opacity: [{ to: 0.05, duration: 500 }, { to: utils.random(0.35, 0.9, 2), duration: 900, delay: utils.random(400, 2600) }] })
      );
    }, 1600);
    return () => {
      clearInterval(twinkle);
      anims.forEach((a) => a.revert());
    };
  }, [ready]);

  return (
    <div ref={root} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-b from-navy-deep via-navy to-[#1c2340]" />
      <div data-glow="teal" className="absolute -left-[10%] bottom-[-30%] h-[80%] w-[60%] bg-[radial-gradient(closest-side,rgb(10_79_84/0.7),transparent)]" />
      <div data-glow="wine" className="absolute -right-[10%] bottom-[-35%] h-[85%] w-[65%] bg-[radial-gradient(closest-side,rgb(122_32_56/0.55),transparent)]" />
      {/* a thin warm band where the sun has just gone down */}
      <div className="absolute inset-x-0 bottom-0 h-[30%] bg-linear-to-t from-gold/10 to-transparent" />

      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-x-0 bottom-0 h-[clamp(70px,14vh,140px)] w-full"
      >
        {city.map((t, i) => (
          <g key={i} data-tower style={{ transformOrigin: `${t.x + t.w / 2}px ${H}px`, transform: "scaleY(0)" }}>
            <rect x={t.x} y={H - t.h} width={t.w} height={t.h} fill="#18243d" />
            <rect x={t.x} y={H - t.h} width={t.w} height="0.8" fill="rgb(196 155 76 / 0.35)" />
            {t.lights.map(([x, y], j) => (
              <rect key={j} data-light x={x} y={y} width="3" height="3.4" fill="#e0b76a" opacity="0" />
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
}

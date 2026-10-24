// Ink shapes in the brochure's sumi-e manner, drawn from a seed so each is its own and stays the
// same between renders. A blot is a drop of ink spread in water: a round body whose rim wanders,
// with a few runs where the ink travelled further and flecks thrown clear of it.

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const f = (n) => n.toFixed(2);

// A closed blot in a 100 by 100 box, centred, reaching about `reach` from the middle.
export function blotPath(seed, reach = 40) {
  const r = rng(seed);
  const waves = Array.from({ length: 28 }, (_, i) => {
    const k = i + 2;
    return [k, ((r() * 0.9 + 0.1) * 0.22) / k ** 0.9, r() * Math.PI * 2];
  });
  const runs = Array.from({ length: 3 + Math.floor(r() * 3) }, () => [r() * Math.PI * 2, 0.12 + r() * 0.22, 0.05 + r() * 0.08]);
  const N = 240;
  let d = "";
  for (let i = 0; i < N; i++) {
    const th = (i / N) * Math.PI * 2;
    let m = 1;
    for (const [k, a, p] of waves) m += a * Math.sin(k * th + p);
    for (const [c, h, w] of runs) {
      const dd = Math.atan2(Math.sin(th - c), Math.cos(th - c));
      m += h * Math.exp(-((dd / w) ** 2));
    }
    m += (r() - 0.5) * 0.035; // the grain of the paper at the rim
    const rad = reach * Math.min(m, 1.22);
    d += `${i ? "L" : "M"}${f(50 + rad * Math.cos(th))} ${f(50 + rad * Math.sin(th))}`;
  }
  d += "Z";
  // flecks thrown clear of the rim
  for (let i = 0; i < 5; i++) {
    const th = r() * Math.PI * 2;
    const rad = reach * (1.14 + r() * 0.12);
    const s = 0.5 + r() * 1.3;
    const x = 50 + rad * Math.cos(th);
    const y = 50 + rad * Math.sin(th);
    d += `M${f(x - s)} ${f(y)}a${f(s)} ${f(s * 0.8)} 0 1 0 ${f(s * 2)} 0a${f(s)} ${f(s * 0.8)} 0 1 0 ${f(-s * 2)} 0Z`;
  }
  return d;
}

// the same blot as an image, for CSS masks
export const blotMask = (seed, reach) =>
  `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='${blotPath(seed, reach)}'/></svg>`)}")`;

// The leading edge of a broad brush pulled across the page, 1000 wide and 60 deep: the paint is
// below the line, and where the brush ran dry it leaves streaks and gaps along the top.
export function brushEdge(seed) {
  const r = rng(seed);
  const waves = Array.from({ length: 16 }, (_, i) => [i + 1, (r() * 7) / (i + 1) ** 0.8, r() * Math.PI * 2]);
  const N = 200;
  let d = "M0 60";
  for (let i = 0; i <= N; i++) {
    const x = (i / N) * 1000;
    let y = 30;
    for (const [k, a, p] of waves) y += a * Math.sin((k * x * Math.PI) / 1000 + p);
    y += (r() - 0.5) * 5;
    d += `L${f(x)} ${f(Math.max(4, Math.min(56, y)))}`;
  }
  d += "L1000 60Z";
  // dry-brush streaks just above the edge
  for (let i = 0; i < 14; i++) {
    const x = r() * 960;
    const w = 12 + r() * 60;
    const y = 8 + r() * 20;
    const h = 0.6 + r() * 1.6;
    d += `M${f(x)} ${f(y)}h${f(w)}l${f(-w * 0.1)} ${f(h)}h${f(-w * 0.85)}Z`;
  }
  return d;
}

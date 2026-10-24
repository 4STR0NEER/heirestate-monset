// North Grove's hand: the land drawn as a surveyor would. Contours are closed rings around a
// rise, each a little smaller and shifted, their rims wandering like a hillside; a ridgeline is
// the skyline of hills; the plumeria is the flower its brochure is set against.

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
const f = (n) => n.toFixed(1);

// Rings of a hill in a w by h box around (cx, cy): `rings` loops from the foot to the top. One
// set of waves shapes them all, so neighbouring rings run alike as real contours do.
export function contourPaths(seed, { w = 1000, h = 600, cx = 0.5, cy = 0.5, rings = 9, reach = 0.46 } = {}) {
  const r = rng(seed);
  const waves = Array.from({ length: 7 }, (_, i) => [i + 2, (0.05 + r() * 0.12) / (i + 1) ** 0.6, r() * Math.PI * 2]);
  const lean = [(r() - 0.5) * 0.18, (r() - 0.5) * 0.18];
  const N = 120;
  return Array.from({ length: rings }, (_, k) => {
    const s = reach * (1 - k / (rings + 1.5));
    const ox = cx + lean[0] * (k / rings);
    const oy = cy + lean[1] * (k / rings);
    let d = "";
    for (let i = 0; i <= N; i++) {
      const th = (i / N) * Math.PI * 2;
      let m = 1;
      for (const [n, a, p] of waves) m += a * Math.sin(n * th + p + k * 0.35);
      const x = (ox + s * m * Math.cos(th) * 1.35) * w;
      const y = (oy + s * m * Math.sin(th)) * h;
      d += `${i ? "L" : "M"}${f(x)} ${f(y)}`;
    }
    return d + "Z";
  });
}

// The skyline of hills, 1000 wide and 60 deep, filled below; and its first contour above it.
export function ridge(seed) {
  const r = rng(seed);
  const hills = Array.from({ length: 5 }, (_, i) => [i + 1, (6 + r() * 10) / (i + 1) ** 0.5, r() * Math.PI * 2]);
  const at = (x, lift = 0) => {
    let y = 34 - lift;
    for (const [n, a, p] of hills) y += a * Math.sin((n * x * Math.PI) / 1000 + p);
    return Math.max(4, Math.min(56, y));
  };
  const line = (lift) => Array.from({ length: 101 }, (_, i) => `${i ? "L" : "M"}${f(i * 10)} ${f(at(i * 10, lift))}`).join("");
  return { fill: `${line(0)}L1000 60L0 60Z`, contours: [line(9), line(18)] };
}

// A plumeria, 100 by 100: five broad petals turning round a small heart.
export function plumeria() {
  const petal = "M50 50C38 40 30 18 40 8C50 -2 66 10 62 30C60 40 55 46 50 50Z";
  return { petals: Array.from({ length: 5 }, (_, i) => ({ d: petal, rotate: i * 72 + 8 })), heart: [50, 50, 7] };
}

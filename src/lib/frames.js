// Frame sequences for the scroll descent, cut from each project's film into public/frames/<id>/.
// A sequence loads only when the visitor nears its building, and coarse-to-fine (every 8th frame,
// then every 4th, 2nd, the rest) so scrubbing works early and only gets smoother as frames land.
//
// The files are kept compressed (a 1920 frame is ~200 KB as webp, ~8 MB decoded) and only the
// frames around the one on screen are decoded, off the main thread, into bitmaps that draw at
// once: drawing an undecoded image decodes it on the main thread, which is what stutters a scrub.
export const COUNTS = { alto: 93, wave: 65, pristina: 63 };
const V = 2; // bump when the frames are re-cut: they are cached a week under the same names
const WINDOW = 10; // frames kept decoded either side of the one on screen
const DECODERS = 2;

const cache = {};
const ping = () => dispatchEvent(new Event("heir:frame"));

export function sequence(id) {
  if (cache[id]) return cache[id];
  const count = COUNTS[id];
  const files = new Array(count); // compressed blobs
  const bitmaps = new Map(); // index -> ImageBitmap, or a promise while decoding
  const s = { count, started: false, at: -1 };

  s.load = () => {
    if (s.started) return;
    s.started = true;
    const order = [];
    const seen = new Set();
    for (const step of [8, 4, 2, 1])
      for (let i = 0; i < count; i += step) if (!seen.has(i)) seen.add(i), order.push(i);
    let next = 0;
    const pump = () => {
      if (next >= order.length) return;
      const i = order[next++];
      fetch(`/frames/${id}/${String(i + 1).padStart(3, "0")}.webp?v=${V}`)
        .then((r) => (r.ok ? r.blob() : Promise.reject()))
        .then((b) => {
          files[i] = b;
          if (s.at >= 0 && Math.abs(i - s.at) <= WINDOW) s.focus(s.at);
          else if (bitmaps.size === 0) s.focus(i); // something to show before the visitor arrives
        })
        .catch(() => {})
        .finally(pump);
    };
    for (let k = 0; k < 6; k++) pump();
  };

  // decode the frames around i, nearest first and two at a time (more starves the compositor
  // of the cores it scrolls with); release the rest
  let busy = 0;
  const decode = () => {
    while (busy < DECODERS && s.at >= 0) {
      let j = -1;
      for (let d = 0; d <= WINDOW && j < 0; d++)
        for (const k of [s.at + d, s.at - d]) if (k >= 0 && k < count && files[k] && !bitmaps.has(k)) (j = k), (d = WINDOW);
      if (j < 0) return;
      busy++;
      const p = createImageBitmap(files[j])
        .then((b) => {
          // scrolled away while it decoded
          if (bitmaps.get(j) !== p || s.at < 0 || Math.abs(j - s.at) > WINDOW) return b.close(), bitmaps.get(j) === p && bitmaps.delete(j);
          bitmaps.set(j, b);
          ping();
        })
        .catch(() => bitmaps.delete(j))
        .finally(() => (busy--, decode()));
      bitmaps.set(j, p);
    }
  };
  s.focus = (i) => {
    s.at = i;
    for (const [j, b] of bitmaps)
      if (Math.abs(j - i) > WINDOW && !(b instanceof Promise)) b.close(), bitmaps.delete(j);
    decode();
  };

  // leaving this building: free its decoded frames
  s.release = () => {
    s.at = -1;
    for (const [j, b] of bitmaps) {
      if (!(b instanceof Promise)) b.close();
      bitmaps.delete(j); // a decode still running finds itself gone and closes its own bitmap
    }
  };

  // the closest decoded frame, so a gap never shows as a blank
  s.nearest = (i) => {
    for (let d = 0; d < count; d++) {
      const a = bitmaps.get(i - d);
      if (a && !(a instanceof Promise)) return a;
      const b = bitmaps.get(i + d);
      if (b && !(b instanceof Promise)) return b;
    }
    return null;
  };

  return (cache[id] = s);
}

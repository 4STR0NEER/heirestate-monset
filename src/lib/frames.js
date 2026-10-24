// Frame sequences for the scroll descent, cut from each project's film into public/frames/<id>/.
// A sequence loads only when the visitor nears its building, and coarse-to-fine (every 8th frame,
// then every 4th, 2nd, the rest) so scrubbing works early and only gets smoother as frames land.
export const COUNTS = { alto: 93, wave: 65, pristina: 63, "wave-1br": 304 };

const cache = {};

export function sequence(id) {
  if (cache[id]) return cache[id];
  const count = COUNTS[id];
  const images = new Array(count);
  const s = { count, images, started: false };

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
      const img = new Image();
      img.src = `/frames/${id}/${String(i + 1).padStart(3, "0")}.webp`;
      // decoded off the main thread before it is ever drawn, so scrubbing never stalls on it
      img
        .decode()
        .then(() => {
          images[i] = img;
          dispatchEvent(new Event("heir:frame"));
        })
        .catch(() => {})
        .finally(pump);
    };
    for (let k = 0; k < 6; k++) pump();
  };

  // the closest frame that has arrived, so a gap never shows as a blank
  s.nearest = (i) => {
    for (let d = 0; d < count; d++) {
      if (images[i - d]) return images[i - d];
      if (images[i + d]) return images[i + d];
    }
    return null;
  };

  return (cache[id] = s);
}

// The facade's fins, as a row: three to a bay like the monogram's strokes, the bays rising and
// falling across the width. 1000 by 60, drawn up from the bottom; bay is each fin's bay number.
export const FINS = Array.from({ length: 30 }, (_, bay) => {
  const h = 18 + 34 * Math.abs(Math.sin(bay * 0.61 + 0.4)) * (0.55 + 0.45 * Math.abs(Math.cos(bay * 0.23)));
  return [0, 1, 2].map((k) => ({ bay, x: bay * 33.4 + 4 + k * 8, h: h * (k === 1 ? 1 : 0.82) }));
}).flat();

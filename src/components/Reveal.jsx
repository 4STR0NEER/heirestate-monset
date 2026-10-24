import { useEffect, useLayoutEffect, useRef } from "react";
import { animate, splitText, stagger, utils } from "animejs";
import { useInView } from "motion/react";

const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

// Text that arrives as it comes into view: anime.js splits the [data-split] heading into words
// (or lines, with by="lines") that rise out of their own clipped lines, then the [data-rise]
// elements follow one after another. Without scripting, or with reduced motion, it simply shows.
export default function Reveal({ children, className = "", by = "words", as: Tag = "div" }) {
  const root = useRef(null);
  const split = useRef(null);
  const inView = useInView(root, { once: true, amount: 0.35 });

  // hidden before first paint, so nothing flashes in place and then animates
  useLayoutEffect(() => {
    if (reduced()) return;
    const head = root.current.querySelector("[data-split]");
    split.current = head && splitText(head, { [by]: { wrap: "clip" } });
    if (split.current) utils.set(split.current[by], { y: "110%" });
    utils.set(root.current.querySelectorAll("[data-rise]"), { opacity: 0, y: 14 });
    return () => split.current?.revert();
  }, [by]);

  useEffect(() => {
    if (!inView || reduced()) return;
    const parts = split.current?.[by] ?? [];
    const a = animate(parts, { y: "0%", duration: by === "lines" ? 1200 : 1000, ease: "out(4)", delay: stagger(by === "lines" ? 110 : 60) });
    const b = animate(root.current.querySelectorAll("[data-rise]"), {
      opacity: 1,
      y: 0,
      duration: 800,
      ease: "out(4)",
      delay: stagger(70, { start: 180 + parts.length * (by === "lines" ? 90 : 40) }),
    });
    return () => (a.pause(), b.pause());
  }, [inView, by]);

  return (
    <Tag ref={root} className={className}>
      {children}
    </Tag>
  );
}

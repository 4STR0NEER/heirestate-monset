import { useMemo, useRef } from "react";
import { useInView } from "motion/react";
import { contourPaths } from "@/lib/topo";

// A hill's contours drawn faintly behind a section, as on North Grove's plans: when the section
// comes into view the rings draw themselves in, from the foot of the hill to its top. Its parent
// must be positioned; it sits behind everything and takes no pointer.
export default function Contours({ seed = 3, className = "", cx = 0.72, cy = 0.45, rings = 10 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const paths = useMemo(() => contourPaths(seed, { cx, cy, rings }), [seed, cx, cy, rings]);
  return (
    <svg
      ref={ref}
      viewBox="0 0 1000 600"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 size-full ${className}`}
    >
      {paths.map((d, i) => (
        <path
          key={i}
          d={d}
          pathLength="1"
          fill="none"
          vectorEffect="non-scaling-stroke"
          strokeWidth="1"
          className="draw stroke-ink/20"
          style={{ strokeDashoffset: inView ? 0 : 1, transitionDelay: `${i * 140}ms` }}
        />
      ))}
    </svg>
  );
}

import { useMemo, useRef } from "react";
import { useInView } from "motion/react";
import FinEdge from "@/components/FinEdge";
import { ridge } from "@/lib/topo";

// The top edge of a dark section, in its project's hand: Alto Ranudo's fins, or North Grove's
// ridgeline of hills with its first two contours drawing in above it. Its parent must be
// positioned. Without a motif there is no edge.
export default function Edge({ motif }) {
  if (motif === "fins") return <FinEdge />;
  if (motif === "contours") return <RidgeEdge />;
  return null;
}

function RidgeEdge() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -8% 0px" });
  const { fill, contours } = useMemo(() => ridge(5), []);
  return (
    <svg
      ref={ref}
      viewBox="0 0 1000 60"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="pointer-events-none absolute bottom-[calc(100%-1px)] left-0 h-[clamp(36px,6vw,90px)] w-full"
    >
      {contours.map((d, i) => (
        <path
          key={i}
          d={d}
          pathLength="1"
          fill="none"
          vectorEffect="non-scaling-stroke"
          className="draw stroke-navy-deep/35"
          strokeWidth="1"
          style={{ strokeDashoffset: inView ? 0 : 1, transitionDelay: `${300 + i * 250}ms` }}
        />
      ))}
      <path d={fill} className="fill-navy-deep" />
    </svg>
  );
}

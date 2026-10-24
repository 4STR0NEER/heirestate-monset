import { useRef } from "react";
import { useInView } from "motion/react";
import { FINS } from "@/lib/fins";

// The top edge of a dark section, set with the facade's fins: they grow up out of the section,
// bay by bay from the left, as it comes into view. Its parent must be positioned.
export default function FinEdge() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -8% 0px" });
  return (
    <svg
      ref={ref}
      viewBox="0 0 1000 60"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="pointer-events-none absolute bottom-[calc(100%-1px)] left-0 h-[clamp(28px,5vw,72px)] w-full fill-navy-deep"
    >
      {FINS.map((f, i) => (
        <rect key={i} x={f.x} y={60 - f.h} width="5" height={f.h} className="fin" style={{ scale: inView ? "1 1" : "1 0", transitionDelay: `${f.bay * 22}ms` }} />
      ))}
    </svg>
  );
}

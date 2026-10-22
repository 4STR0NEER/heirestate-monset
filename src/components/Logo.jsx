// The Lit Window: an H drawn as two towers, the crossbar a lit window between them.
// The taller right tower is also an E (spine plus three arms), so the mark reads "HE".
// One path per stroke, butt caps sized to meet at the corners, so the loader can draw each line.
export function Mark({ className }) {
  return (
    <svg viewBox="0 0 40 48" fill="none" aria-hidden="true" className={className}>
      <g stroke="currentColor" strokeWidth="2.4">
        <path d="M4 43.2V8.8" />
        <path d="M22 43.2V3.8" />
        <path d="M20.8 5H35.2" />
        <path d="M22 24H32.2" />
        <path d="M20.8 42H35.2" />
      </g>
      <rect x="5.2" y="20.4" width="15.6" height="7.2" fill="var(--color-gold)" className="lit-window" />
    </svg>
  );
}

export default function Logo({ className }) {
  return (
    <span className={`inline-flex items-center gap-3 text-champagne ${className ?? ""}`}>
      <Mark className="h-10 w-auto" />
      <span className="font-inscription text-[0.95rem] leading-none tracking-[0.34em]">HEIR ESTATE</span>
    </span>
  );
}

import { plumeria } from "@/lib/topo";

const P = plumeria();

// North Grove's flower, cream petals round a warm heart, set here and there as on its plans.
export default function Plumeria({ className = "" }) {
  return (
    <svg viewBox="-10 -10 120 120" aria-hidden="true" className={`pointer-events-none ${className}`}>
      {P.petals.map((p, i) => (
        <path key={i} d={p.d} transform={`rotate(${p.rotate} 50 50)`} className="fill-paper stroke-gold/40" strokeWidth="0.6" />
      ))}
      <circle cx={P.heart[0]} cy={P.heart[1]} r={P.heart[2]} className="fill-champagne" />
    </svg>
  );
}

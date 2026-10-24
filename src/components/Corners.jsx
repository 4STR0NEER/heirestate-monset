// Registration marks at the four corners of a frame, as on a drawing sheet. Its parent must be
// positioned; the marks sit just outside it.
export default function Corners({ className = "border-gold" }) {
  const mark = `absolute size-4 ${className}`;
  return (
    <span aria-hidden="true" className="pointer-events-none absolute -inset-2">
      <span className={`${mark} top-0 left-0 border-t border-l`} />
      <span className={`${mark} top-0 right-0 border-t border-r`} />
      <span className={`${mark} bottom-0 left-0 border-b border-l`} />
      <span className={`${mark} right-0 bottom-0 border-r border-b`} />
    </span>
  );
}

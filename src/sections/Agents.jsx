import { memo, useEffect, useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import Reveal from "@/components/Reveal";
import { projects } from "@/projects";

const GUTTER = "px-[clamp(16px,4vw,64px)]";
const EASE = [0.23, 1, 0.32, 1];

// The agents behind every viewing: their portrait standing in a panel of its own, their name set large,
// and their licences as numbers that settle digit by digit, the way a register is read off, with
// the projects they handle and every way to reach them. Leads straight into the enquiry desk.
// memo: the nav's section label changes as you scroll and re-renders the page around it;
// this section's own props never change with it, so it sits that render out
export default memo(function Agents({ agent, handles, onSection, onBook }) {
  const root = useRef(null);
  const inView = useInView(root, { amount: 0.4 });

  useEffect(() => {
    if (inView) onSection?.("top");
  }, [inView, onSection]);

  const surname = agent.names.split(" ").at(-1);

  return (
    <section ref={root} id="agents" aria-labelledby="agents-title" className="grid-paper relative bg-paper py-[clamp(88px,14vh,160px)]">
      <div className={`mx-auto grid max-w-[1480px] gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] ${GUTTER}`}>
        {/* the portrait in a panel of champagne as tall as everything beside it, their surname in
            outline behind them (from tablets up: on a phone it would crowd their faces); it simply
            fades in, nothing moves over the text */}
        <div className="relative isolate aspect-[4/5] overflow-hidden sm:aspect-[5/4] rounded-[6px] bg-[linear-gradient(165deg,var(--color-champagne),color-mix(in_oklab,var(--color-champagne)_55%,var(--color-gold)))] shadow-lift lg:aspect-auto lg:min-h-[560px]">
          <p
            aria-hidden="true"
            className="font-display pointer-events-none absolute inset-x-0 top-[6%] -z-10 hidden text-center sm:block text-[clamp(4rem,11vw,10rem)] leading-none whitespace-nowrap text-transparent select-none [-webkit-text-stroke:1px_color-mix(in_oklab,var(--color-gold-ink)_45%,transparent)]"
          >
            {surname}
          </p>
          <FadeImg
            src={agent.photo}
            alt={`${agent.names}, ${agent.role.toLowerCase()} with ${agent.firm}`}
            className="absolute inset-x-0 bottom-0 mx-auto h-[86%] w-auto max-w-[96%] object-contain object-bottom sm:h-[90%]"
          />
          <p className="font-inscription absolute top-5 left-5 rounded-full bg-paper/80 px-3 py-1.5 text-[0.6rem] tracking-[0.24em] text-ink uppercase backdrop-blur-sm">
            {agent.firm}
          </p>
        </div>

        <div className="self-center">
          <Reveal>
            <p data-rise className="font-display text-[1.15rem] text-gold-ink italic">
              Your agents
            </p>
            <h2 id="agents-title" data-split className="font-display mt-3 text-[clamp(2.6rem,5.4vw,5.2rem)] leading-[0.95] tracking-[-0.03em] text-ink">
              {agent.names}
            </h2>
            <p data-rise className="mt-5 max-w-[46ch] text-[1.05rem] text-ink/75">
              {agent.role}, {agent.firm}
              {agent.network ? ` (${agent.network})` : ""}. Every viewing, price list and floor plan for{" "}
              {new Intl.ListFormat("en").format(handles.map((id) => projects[id].name))} goes through them.
            </p>
          </Reveal>

          {/* the licences: each number settles digit by digit as it comes into view */}
          <dl className="mt-10 grid gap-3 sm:grid-cols-2">
            {agent.licences.map(([label, value], i) => (
              <Credential key={label} label={label} value={value} delay={i * 0.12} />
            ))}
          </dl>

          {/* the projects they handle, each in its own colour */}
          <ul className="mt-8 flex flex-wrap gap-2" aria-label="Projects they handle">
            {handles.map((id) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => onBook(id)}
                  className="flex items-center gap-2 rounded-full border border-ink/15 bg-paper px-4 py-2 text-[0.9rem] text-ink transition-[border-color,transform] duration-200 ease-out hover:border-ink/40 active:scale-[0.97]"
                >
                  <span aria-hidden="true" className="size-2 rounded-full" style={{ background: projects[id].accent }} />
                  {projects[id].name}
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-10 grid gap-x-10 gap-y-5 border-t border-ink/12 pt-6 text-[0.95rem] sm:grid-cols-2">
            <Line label="Call or message">
              {agent.phones.map((t) => (
                <a key={t} href={`tel:${t.replace(/\s/g, "")}`} className="block text-ink underline-offset-4 hover:underline">
                  {t}
                </a>
              ))}
            </Line>
            <Line label="Write">
              <a href={`mailto:${agent.email}`} className="break-all text-ink underline-offset-4 hover:underline">
                {agent.email}
              </a>
            </Line>
            {agent.address && (
              <Line label="Office">
                <span className="text-ink">{agent.address}</span>
              </Line>
            )}
            {agent.profiles?.length > 0 && (
              <Line label="Find them on">
                {agent.profiles.map(([label, href]) => (
                  <a key={href} href={href} target="_blank" rel="noopener me" className="block text-ink underline-offset-4 hover:underline">
                    {label}
                  </a>
                ))}
              </Line>
            )}
            <div className="self-end">
              <button
                type="button"
                onClick={() => onBook()}
                className="flex items-center gap-3 rounded-full bg-ink px-6 py-3.5 text-paper transition-[background-color,transform] duration-200 ease-out hover:bg-charcoal active:scale-[0.97]"
              >
                Book a viewing with them
                <svg viewBox="0 0 24 10" className="w-5" aria-hidden="true">
                  <path d="M0 5h22M18 1l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

// fades in once loaded and in view, so it never pops in half drawn; no movement
function FadeImg({ className, ...props }) {
  const reduce = useReducedMotion();
  return (
    <motion.img
      {...props}
      width="1100"
      height="950"
      loading="lazy"
      className={className}
      initial={reduce ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: EASE }}
    />
  );
}

function Line({ label, children }) {
  return (
    <div>
      <p className="font-inscription mb-1.5 text-[0.62rem] tracking-[0.24em] text-charcoal/70 uppercase">{label}</p>
      {children}
    </div>
  );
}

// A licence as an entry in a register: a gold seal, its name, and its number, which runs through
// random characters and settles left to right the first time it is seen. The real number is in
// the markup throughout (screen readers and crawlers read it); only the visible copy runs.
function Credential({ label, value, delay }) {
  const reduce = useReducedMotion();
  const self = useRef(null);
  const digits = useRef(null);
  const seen = useInView(self, { once: true, amount: 0.8 });

  useEffect(() => {
    if (!seen || reduce) return;
    const el = digits.current;
    const pool = "0123456789";
    const start = performance.now() + delay * 1000;
    const span = 900;
    let raf;
    const tick = (now) => {
      const t = Math.max(0, now - start) / span;
      const settled = Math.floor(t * value.length);
      el.textContent = [...value]
        .map((c, i) => (i < settled || !/[0-9A-Z]/i.test(c) ? c : pool[(Math.random() * pool.length) | 0]))
        .join("");
      if (t < 1) raf = requestAnimationFrame(tick);
      else el.textContent = value;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, reduce, value, delay]);

  return (
    <motion.div
      ref={self}
      className="relative overflow-hidden rounded-[6px] border border-ink/12 bg-paper p-5 shadow-[0_1px_2px_rgb(12_21_38/0.06)]"
      initial={reduce ? false : { opacity: 0, transform: "translateY(12px)" }}
      animate={seen ? { opacity: 1, transform: "translateY(0px)" } : undefined}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      <div className="flex items-center gap-3">
        <Seal />
        <dt className="font-inscription text-[0.64rem] tracking-[0.24em] text-charcoal/75 uppercase">{label}</dt>
      </div>
      <dd className="mt-4">
        <span className="sr-only">{value}</span>
        <span ref={digits} aria-hidden="true" className="font-display text-[clamp(1.5rem,2.2vw,2rem)] leading-none tracking-[0.02em] text-ink tabular-nums">
          {value}
        </span>
      </dd>
      {/* a gold rule draws under the number once it has settled */}
      <motion.span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 block h-[2px] origin-left bg-gold"
        initial={{ transform: "scaleX(0)" }}
        animate={seen ? { transform: "scaleX(1)" } : undefined}
        transition={{ duration: 0.8, ease: EASE, delay: reduce ? 0 : delay + 0.9 }}
      />
    </motion.div>
  );
}

// a small rosette with a tick: an official, checked registration
function Seal() {
  return (
    <svg viewBox="0 0 24 24" className="size-6 shrink-0 text-gold" aria-hidden="true">
      <path
        d="M12 1.5l2.3 1.7 2.8-.3 1.1 2.6 2.6 1.1-.3 2.8 1.7 2.3-1.7 2.3.3 2.8-2.6 1.1-1.1 2.6-2.8-.3L12 22.5l-2.3-1.7-2.8.3-1.1-2.6-2.6-1.1.3-2.8L1.5 12l1.7-2.3-.3-2.8 2.6-1.1 1.1-2.6 2.8.3z"
        fill="currentColor"
        opacity="0.18"
        stroke="currentColor"
        strokeWidth="1"
      />
      <path d="M7.8 12.2l2.7 2.7 5.7-5.8" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

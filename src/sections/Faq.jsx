import Reveal from "@/components/Reveal";
import { faqFor } from "@/lib/seo";

const GUTTER = "px-[clamp(16px,4vw,64px)]";

// The questions buyers ask, answered only from the project's own material: the very list search
// and answer engines read (sites.js marks it up as FAQPage and writes it into the HTML). Native
// details and summary: every answer is in the page, open or closed, and the keyboard works as is.
// With no id, the collection's questions.
export default function Faq({ id, name }) {
  return (
    <section aria-labelledby="faq-title" className={`mx-auto grid max-w-[1440px] gap-x-20 gap-y-10 py-[clamp(72px,12vh,140px)] lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)] ${GUTTER}`}>
      <Reveal>
        <p data-rise className="font-display text-[1.15rem] text-gold-ink italic">
          Questions, answered
        </p>
        <h2 id="faq-title" data-split className="font-display mt-3 text-[clamp(2.4rem,4.6vw,4.4rem)] leading-[0.98] tracking-[-0.02em] text-ink">
          {name ? `About ${name}` : "Before you ask"}
        </h2>
      </Reveal>
      <div className="border-t border-ink/15">
        {faqFor(id).map(([q, a]) => (
          <details key={q} className="group border-b border-ink/15">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-ink transition-colors duration-200 hover:text-gold-ink [&::-webkit-details-marker]:hidden">
              <span className="font-display text-[clamp(1.15rem,1.6vw,1.4rem)] leading-snug">{q}</span>
              {/* a plus that turns into a cross while its answer is open */}
              <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4 shrink-0 transition-transform duration-200 ease-out group-open:rotate-45">
                <path d="M8 1v14M1 8h14" fill="none" stroke="currentColor" strokeWidth="1.3" />
              </svg>
            </summary>
            <p className="max-w-[68ch] pb-6 text-[1.02rem] leading-relaxed text-ink/75">{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

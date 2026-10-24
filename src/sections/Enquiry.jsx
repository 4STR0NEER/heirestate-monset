import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import FinEdge from "@/components/FinEdge";

const GUTTER = "px-[clamp(16px,4vw,64px)]";
const EASE = [0.23, 1, 0.32, 1];

// what the visitor wants, and what the button says for it
export const INTENTS = [
  ["viewing", "Book a viewing", "Request a viewing"],
  ["prices", "Get the price list", "Send me the price list"],
  ["plans", "Get the floor plans", "Send me the floor plans"],
  ["invest", "Ask about investing", "Send my question"],
];

const CHECKS = {
  name: (v) => (v.trim().length < 2 ? "Enter your full name" : ""),
  phone: (v) => (v.replace(/[^\d]/g, "").length < 10 ? "Enter a mobile number with at least 10 digits, such as +63 917 123 4567" : ""),
  email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "Enter an email address, such as name@example.com"),
  consent: (v) => (v ? "" : "Tick the box to let the agents use your details to reply"),
};
const LABELS = { name: "Full name", phone: "Mobile number", email: "Email", consent: "Consent" };

// ponytail: opens the visitor's mail app with the enquiry written out, addressed to the agents.
// Swap for a POST to /api/enquiry (Resend) once it exists; the form and its states stay as they are.
function send(f, { agent, name, units, pick }) {
  const unit = units.find((u) => u.id === f.unit)?.name ?? "Not decided yet";
  const intent = INTENTS.find(([k]) => k === f.intent)[1];
  const body = [
    `${intent}, ${name}`,
    "",
    `${pick}: ${unit}`,
    f.intent === "viewing" && f.date ? `Preferred date: ${f.date}` : "",
    `Name: ${f.name.trim()}`,
    `Mobile: ${f.phone.trim()}`,
    `Email: ${f.email.trim()}`,
    f.message.trim() ? `\n${f.message.trim()}` : "",
    "",
    "I agree to my details being used to respond to this enquiry, in line with the Data Privacy Act of 2012.",
  ]
    .filter((l) => l !== "")
    .join("\n");
  location.href = `mailto:${agent.email}?subject=${encodeURIComponent(`${intent}: ${name}, ${unit}`)}&body=${encodeURIComponent(body)}`;
}

// The enquiry desk: who you are speaking to, with their licences, and one form for every reason
// to get in touch. Anything on the page that asks for a viewing or a price list lands here with
// its unit and reason already filled in (ask).
// units are the choices in the second field and pick its name: a project's unit types on its own
// site, the projects themselves on the collection.
export default function Enquiry({ agent, name, units = [], pick = "Unit type", developer, ask, fins }) {
  const [f, setF] = useState({ intent: "viewing", unit: "", date: "", name: "", phone: "", email: "", message: "", consent: false });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const summary = useRef(null);
  const today = new Date().toLocaleDateString("en-CA"); // the visitor's own today, as YYYY-MM-DD

  // a button elsewhere on the page chose the reason and the unit
  useEffect(() => {
    if (ask?.n) setF((v) => ({ ...v, intent: ask.intent, unit: ask.unit ?? v.unit })), setSent(false);
  }, [ask]);

  const set = (k) => (e) => {
    const v = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setF((s) => ({ ...s, [k]: v }));
    // an error clears as soon as the field is right, but only appears once the field is left
    if (errors[k] && CHECKS[k] && !CHECKS[k](v)) setErrors((s) => ({ ...s, [k]: "" }));
  };
  const leave = (k) => () => CHECKS[k] && setErrors((s) => ({ ...s, [k]: CHECKS[k](f[k]) }));

  const submit = (e) => {
    e.preventDefault();
    const found = Object.fromEntries(Object.entries(CHECKS).map(([k, c]) => [k, c(f[k])]));
    setErrors(found);
    if (Object.values(found).some(Boolean)) return requestAnimationFrame(() => summary.current?.focus());
    send(f, { agent, name, units, pick });
    setSent(true);
  };

  const open = Object.entries(errors).filter(([, m]) => m);
  const field = "mt-2 w-full rounded-[4px] border bg-paper px-4 py-3 text-ink transition-colors duration-150 placeholder:text-ink/40 focus:border-ink focus:outline-none";
  const border = (k) => (errors[k] ? "border-burgundy" : "border-ink/20");
  const error = (k) =>
    errors[k] && (
      <p id={`${k}-error`} className="mt-1.5 text-[0.9rem] text-burgundy">
        {errors[k]}
      </p>
    );
  const button = INTENTS.find(([k]) => k === f.intent)[2];

  return (
    <section id="enquiry" aria-labelledby="enquiry-title" data-tone="dark" className="relative bg-navy-deep text-paper">
      {fins && <FinEdge />}
      <div className={`mx-auto grid max-w-[1440px] gap-x-20 gap-y-14 py-[clamp(88px,14vh,160px)] md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] ${GUTTER}`}>
        <div>
          <p className="font-display text-[1.15rem] text-champagne italic">Enquiries and viewings</p>
          <h2 id="enquiry-title" className="font-display mt-3 text-[clamp(2.6rem,5vw,4.6rem)] leading-[0.95] tracking-[-0.02em]">
            Speak to an agent
          </h2>
          <p className="mt-6 max-w-[40ch] text-paper/80">
            For viewings of the dress-up units, price lists, floor plans and availability at {name}. Every enquiry is answered by the licensed agents below.
          </p>

          {/* the agents' credentials, set out like the licence card they are */}
          <div className="mt-12 border border-paper/20">
            <div className="border-b border-paper/15 px-6 py-5">
              <p className="font-display text-[1.6rem] leading-tight">{agent.names}</p>
              <p className="mt-1 text-paper/75">
                {agent.role}, {agent.firm}
              </p>
            </div>
            <dl className="grid grid-cols-2 border-b border-paper/15">
              {agent.licences.map(([k, v], i) => (
                <div key={k} className={`px-6 py-4 ${i ? "border-l border-paper/15" : ""}`}>
                  <dt className="text-[0.85rem] text-paper/60">{k}</dt>
                  <dd className="mt-0.5 tabular-nums">{v}</dd>
                </div>
              ))}
            </dl>
            <ul>
              {agent.phones.map((t) => (
                <li key={t}>
                  <a href={`tel:${t.replace(/\s/g, "")}`} className="flex items-center justify-between gap-4 border-b border-paper/15 px-6 py-4 tabular-nums transition-colors duration-200 hover:bg-paper/5">
                    <span>
                      <span className="mr-3 text-[0.85rem] text-paper/60">Call</span>
                      {t}
                    </span>
                    <Arrow />
                  </a>
                </li>
              ))}
              <li>
                <a href={`mailto:${agent.email}?subject=${encodeURIComponent(name)}`} className="flex items-center justify-between gap-4 px-6 py-4 transition-colors duration-200 hover:bg-paper/5">
                  <span className="min-w-0 break-all">
                    <span className="mr-3 text-[0.85rem] text-paper/60">Email</span>
                    {agent.email}
                  </span>
                  <Arrow />
                </a>
              </li>
            </ul>
          </div>
          {developer && <p className="mt-6 max-w-[48ch] text-[0.9rem] leading-relaxed text-paper/60">{developer}</p>}
        </div>

        <div className="rounded-[4px] bg-paper p-[clamp(20px,3vw,40px)] text-ink">
          <AnimatePresence mode="wait" initial={false}>
            {sent ? (
              <motion.div key="sent" role="status" initial={{ opacity: 0, transform: "translateY(8px)" }} animate={{ opacity: 1, transform: "translateY(0px)" }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: EASE }}>
                <p className="font-display text-[1.15rem] text-gold-ink italic">Almost there</p>
                <p className="font-display mt-2 text-[clamp(1.8rem,3vw,2.4rem)] leading-tight">Your enquiry is written out in your email</p>
                <p className="mt-4 max-w-[46ch] text-ink/75">
                  Your email app has opened with everything you entered, addressed to {agent.names}. Press send there and an agent will reply.
                </p>
                <p className="mt-4 max-w-[46ch] text-ink/75">
                  Nothing opened? Email{" "}
                  <a href={`mailto:${agent.email}`} className="underline underline-offset-4">
                    {agent.email}
                  </a>{" "}
                  or call{" "}
                  <a href={`tel:${agent.phones[0].replace(/\s/g, "")}`} className="underline underline-offset-4">
                    {agent.phones[0]}
                  </a>
                  .
                </p>
                <button type="button" onClick={() => setSent(false)} className="mt-8 rounded-full border border-ink/25 px-6 py-3 transition-colors duration-200 hover:bg-ink hover:text-paper">
                  Back to the form
                </button>
              </motion.div>
            ) : (
              <motion.form key="form" noValidate onSubmit={submit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                {open.length > 0 && (
                  <div ref={summary} tabIndex={-1} role="alert" aria-labelledby="enquiry-problem" className="mb-8 border-l-2 border-burgundy bg-burgundy/5 px-5 py-4 focus:outline-none">
                    <p id="enquiry-problem" className="font-display text-[1.2rem]">
                      Check {open.length === 1 ? "one detail" : `${open.length} details`}
                    </p>
                    <ul className="mt-2 space-y-1 text-[0.95rem]">
                      {open.map(([k, m]) => (
                        <li key={k}>
                          <a href={`#enquiry-${k}`} className="text-burgundy underline underline-offset-4">
                            {LABELS[k]}: {m}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <fieldset>
                  <legend className="text-ink">I would like to</legend>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {INTENTS.map(([k, label]) => (
                      <label key={k} className="cursor-pointer">
                        <input type="radio" name="intent" value={k} checked={f.intent === k} onChange={set("intent")} className="peer sr-only" />
                        <span className="block rounded-full border border-ink/20 px-4 py-2 text-[0.92rem] transition-colors duration-150 peer-checked:border-ink peer-checked:bg-ink peer-checked:text-paper peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-gold-ink hover:border-ink/45">
                          {label}
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="mt-7 grid gap-x-5 gap-y-6 sm:grid-cols-2">
                  <label className="block">
                    <span>{pick}</span>
                    <select name="unit" value={f.unit} onChange={set("unit")} className={`${field} border-ink/20`}>
                      <option value="">Any, or not sure yet</option>
                      {units.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  {f.intent === "viewing" && (
                    <label className="block">
                      <span>
                        Preferred date <span className="text-ink/55">(optional)</span>
                      </span>
                      <input type="date" name="date" min={today} value={f.date} onChange={set("date")} className={`${field} border-ink/20`} />
                    </label>
                  )}
                  <label className="block sm:col-span-2">
                    <span>Full name</span>
                    <input
                      id="enquiry-name"
                      name="name"
                      autoComplete="name"
                      value={f.name}
                      onChange={set("name")}
                      onBlur={leave("name")}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "name-error" : undefined}
                      className={`${field} ${border("name")}`}
                    />
                    {error("name")}
                  </label>
                  <label className="block">
                    <span>Mobile number</span>
                    <input
                      id="enquiry-phone"
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="+63"
                      value={f.phone}
                      onChange={set("phone")}
                      onBlur={leave("phone")}
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? "phone-error" : undefined}
                      className={`${field} ${border("phone")}`}
                    />
                    {error("phone")}
                  </label>
                  <label className="block">
                    <span>Email</span>
                    <input
                      id="enquiry-email"
                      name="email"
                      type="email"
                      spellCheck={false}
                      autoComplete="email"
                      value={f.email}
                      onChange={set("email")}
                      onBlur={leave("email")}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      className={`${field} ${border("email")}`}
                    />
                    {error("email")}
                  </label>
                  <label className="block sm:col-span-2">
                    <span>
                      Message <span className="text-ink/55">(optional)</span>
                    </span>
                    <textarea name="message" rows={3} value={f.message} onChange={set("message")} placeholder="A floor you prefer, the best time to call, or anything else" className={`${field} resize-y border-ink/20`} />
                  </label>
                </div>

                <label className="mt-7 flex items-start gap-3 text-[0.92rem] leading-relaxed text-ink/80">
                  <input
                    id="enquiry-consent"
                    name="consent"
                    type="checkbox"
                    checked={f.consent}
                    onChange={set("consent")}
                    aria-invalid={!!errors.consent}
                    aria-describedby={errors.consent ? "consent-error" : undefined}
                    className="mt-1 size-4 shrink-0 accent-ink"
                  />
                  <span>
                    I agree that the agents named here may use these details to respond to my enquiry, in line with the Data Privacy Act of 2012 (Republic Act 10173).
                    {error("consent")}
                  </span>
                </label>

                <button type="submit" className="mt-8 w-full rounded-full bg-(--accent) px-6 py-4 text-paper transition-[background-color,transform] duration-200 hover:bg-ink active:scale-[0.98] motion-reduce:transform-none sm:w-auto">
                  {button}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 10" className="w-6 shrink-0" aria-hidden="true">
      <path d="M0 5h22M18 1l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

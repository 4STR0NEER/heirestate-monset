// What the sites say about themselves to search and answer engines, written from the same data
// the pages draw, so the two can never disagree: each project's questions and answers (shown on
// the page by Faq.jsx and marked up as FAQPage by sites.js), its unit types with their areas, and
// its full account as plain HTML for crawlers that do not run scripts.
import { order, projects } from "../projects.js";

export const BRAND = "Heir Estates";
const BEDS = { studio: 0, "1br": 1, "2br": 2, "3br": 3 };

export const fact = (p, label) => p.facts.find(([k]) => k === label)?.[1];
export const fullName = (p) => p.fullName ?? p.name;
export const agentOf = () => order.map((id) => projects[id].agent).find(Boolean);
const list = (xs) => new Intl.ListFormat("en").format(xs);
const sqm = (n) => `${n.toLocaleString("en", { maximumFractionDigits: 2 })} sqm`;
const away = (km) => (km < 1 ? `${Math.round(km * 1000)} m` : `${km} km`);
const cap = (s) => s[0].toUpperCase() + s.slice(1);

// each unit type with how many layouts the developer draws and its smallest and largest
export function unitTypes(p) {
  return (p.residences ?? []).map((r) => {
    const areas = r.plans.map((x) => x[2]);
    return { id: r.id, name: r.name, about: r.about, beds: BEDS[r.id], layouts: r.plans.length, min: Math.min(...areas), max: Math.max(...areas) };
  });
}
export const areaRange = (u) => (u.min === u.max ? sqm(u.min) : `${sqm(u.min)} to ${sqm(u.max)}`);

// what a project offers its residents: the deck's own list where there is one, else its spaces;
// a town's spaces are scenes from its film, not amenities, so it has none to list
export const amenitiesOf = (p) => p.amenities ?? (p.place ? null : p.spaces.map((s) => s.name));
const stop = (s) => s.replace(/\.$/, "");

// how to reach the agents, in one sentence
function contact(a) {
  const licences = list(a.licences.map(([k, v]) => `${k} ${v}`));
  return `${a.names}, ${a.role.toLowerCase()} with ${a.firm} (${licences}). Call or message ${list(a.phones)}, email ${a.email}, or use the enquiry form on this page.`;
}

// The questions buyers ask, each answered only from the project's own material. With no id, the
// collection's.
export function faqFor(id) {
  const a = agentOf();
  if (!id) {
    const line = (pid) => {
      const p = projects[pid];
      const where = fact(p, "Location");
      const kinds = unitTypes(p).map((u) => u.name.toLowerCase());
      return `${fullName(p)}${where ? `, ${where}` : ""}: ${list(kinds)} residences`;
    };
    return [
      [
        `What is ${BRAND}?`,
        `${BRAND} presents ${["no", "one", "two", "three", "four", "five"][order.length] ?? order.length} residential projects in Cebu: ${list(order.map((pid) => fullName(projects[pid])))}. Each has a site of its own with its films, floor plans, amenities and a way to arrange a viewing.`,
      ],
      ["Which projects are open now?", `${order.map(line).join("; ")}.`],
      a && ["Who handles enquiries and viewings?", contact(a)],
      a && ["How do I get a price list or book a viewing?", `Ask ${a.names} for the current price list, floor plans or a viewing of any of the projects. ${contact(a).split(". ").slice(1).join(". ")}`],
    ].filter(Boolean);
  }

  const p = projects[id];
  const name = fullName(p);
  const where = fact(p, "Location");
  const dev = fact(p, "Developer");
  const homes = fact(p, "Residences");
  const tower = fact(p, "Tower");
  const towers = fact(p, "Towers");
  const units = unitTypes(p);
  const qa = [];

  const inTowers = towers ? ` Its residences are in two towers: ${towers}.` : "";
  if (where)
    qa.push([
      `Where is ${name}?`,
      `${p.place ? `${p.name} is at ${p.place}, in` : `${name} is ${/street/i.test(where) ? "on" : "in"}`} ${where}.${p.locationLine ? ` ${p.locationLine}` : ""}${inTowers}`,
    ]);
  else if (p.place) qa.push([`Where is ${name}?`, `${p.name} is at ${p.place}.${inTowers}`]);
  if (dev) qa.push([`Who is the developer of ${name}?`, `${name} is developed by ${stop(dev)}.`]);
  if (units.length)
    qa.push([
      `What unit types does ${name} have, and how big are they?`,
      `${cap(list(units.map((u) => `${u.name.toLowerCase()} (${areaRange(u)}${u.layouts > 1 ? `, in ${u.layouts} layouts` : ""})`)))}. Areas are from the developer's plans and may change.`,
    ]);
  if (homes && /\d/.test(homes)) qa.push([`How many residences are there at ${name}?`, `${homes}${tower ? `, in a tower of ${tower}` : ""}.`]);
  if (amenitiesOf(p)) qa.push([`What amenities does ${name} have?`, `${list(amenitiesOf(p))}.`]);
  if (p.unitFeatures) qa.push([`What comes with each unit at ${name}?`, `${p.unitFeatures.join("; ")}.`]);
  if (p.nearby) {
    const near = [...p.nearby].sort((x, y) => x[1] - y[1]).slice(0, 6);
    qa.push([`What is near ${name}?`, `${list(near.map(([n, km]) => `${n} (${away(km)})`))}, among others.`]);
  }
  if (p.terms)
    qa.push([
      `What are the payment terms at ${name}?`,
      `${p.terms.title}. ${p.terms.steps.map(([k, v]) => `${k}: ${v}`).join(" ")} ${p.terms.notes[0]}`,
    ]);
  if (a) qa.push([`How do I book a viewing or get the price list for ${name}?`, `Through ${contact(a)}`]);
  return qa;
}

// The whole account of a site as plain HTML: what a crawler that does not run scripts reads. The
// page draws its own version over it once its scripts run.
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const faqHtml = (id) => `<h2>Questions and answers</h2><dl>${faqFor(id).map(([q, a]) => `<dt>${esc(q)}</dt><dd>${esc(a)}</dd>`).join("")}</dl>`;

export function pageText(id, href) {
  if (!id) {
    return `${order
      .map((pid) => {
        const p = projects[pid];
        return `<h2><a href="${href(pid)}">${esc(fullName(p))}</a></h2><p>${esc(p.tagline)}. ${esc(p.statement)}</p>`;
      })
      .join("")}${faqHtml()}`;
  }
  const p = projects[id];
  const units = unitTypes(p);
  return [
    units.length &&
      `<h2>Residences</h2><ul>${units.map((u) => `<li>${esc(u.name)}: ${esc(areaRange(u))}${u.layouts > 1 ? `, ${u.layouts} layouts` : ""}. ${esc(u.about ?? "")}</li>`).join("")}</ul>`,
    amenitiesOf(p) && `<h2>Amenities</h2><ul>${amenitiesOf(p).map((n) => `<li>${esc(n)}</li>`).join("")}</ul>`,
    p.unitFeatures && `<h2>In every unit</h2><ul>${p.unitFeatures.map((n) => `<li>${esc(n)}</li>`).join("")}</ul>`,
    p.nearby &&
      `<h2>Location</h2>${p.locationLine ? `<p>${esc(p.locationLine)}</p>` : ""}<ul>${p.nearby.map(([n, km, kind]) => `<li>${esc(n)}, ${away(km)} (${esc(kind)})</li>`).join("")}</ul>`,
    p.terms && `<h2>${esc(p.terms.caption)}: ${esc(p.terms.title)}</h2><ul>${p.terms.steps.map(([k, v]) => `<li>${esc(k)}: ${esc(v)}</li>`).join("")}</ul><p>${esc(p.terms.notes.join(" "))}</p>`,
    faqHtml(id),
    p.disclaimer && `<p>${esc(p.disclaimer)}</p>`,
  ]
    .filter(Boolean)
    .join("");
}

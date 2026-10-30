import { order, projects } from "../projects.js";

// Read by the page (import.meta.env) and by the build in Node (process.env).
const env = import.meta.env ?? process.env;

// The domain the sites live on: the collection on the bare domain, each project on its own
// subdomain (wave.<domain>, ...), routed by worker.js. VITE_DOMAIN="" builds every site onto one
// address instead, each project under its own path (/wave/), for a host without subdomains.
export const DOMAIN = env.VITE_DOMAIN ?? "heirestates.com";

// In development each site runs its own server (`npm run dev`), one port up per project.
export const devPort = (id) => 5173 + (id ? order.indexOf(id) + 1 : 0);

export const siteUrl = (id) => {
  if (env.DEV) return `http://localhost:${devPort(id)}/`;
  if (DOMAIN) return `https://${id ? `${id}.` : ""}${DOMAIN}/`;
  return id ? `/${id}/` : "/";
};

// For real links that open in place on a plain click: crawlers, new tabs and middle clicks
// still follow the href to the project's own site.
export const inPlace = (fn) => (e) => {
  if (e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  fn(e);
};

const insetOf = (r) => `inset(${r.top}px ${innerWidth - r.right}px ${innerHeight - r.bottom}px ${r.left}px)`;

// The collection's navy, written out: a project's palette repaints --color-navy on its own site.
export const HOUSE = "#14213a";

// The colour card between two sites, the same on both sides of the page load: the destination's
// name centred in its colour. leave() draws it on the page you leave; sites.js paints it as the
// next page's very first frame (html[data-arrive]::before), so the two meet without a seam.
export const ARRIVE =
  "position:fixed;inset:0;z-index:90;display:flex;align-items:center;justify-content:center;padding:0 16px;text-align:center;color:#f6f1e8;font:400 clamp(2.6rem,7vw,5.6rem)/1 var(--font-display);letter-spacing:-0.02em";

// Leaving for another site (a project's, or the collection with no id): its colour grows out of
// the element that was clicked (or rises from below) until it fills the screen, and the next page
// opens out of that same colour (data-arrive, set in its HTML by sites.js), never a blank page.
export function leave(id, rect) {
  const url = siteUrl(id);
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return location.assign(url);
  const from = rect ? insetOf(rect) : "inset(100% 0px 0px 0px)";
  const veil = document.createElement("div");
  veil.style.cssText = `${ARRIVE};background:${id ? projects[id].accent : HOUSE};clip-path:${from}`;
  const name = document.createElement("span");
  name.textContent = id ? projects[id].name : "Heir Estates";
  veil.append(name);
  document.body.append(veil);
  // the name settles in as the colour fills, so the next page opens on the very same card
  name.animate([{ opacity: 0, transform: "translateY(10px)", filter: "blur(4px)" }, { opacity: 1, transform: "none", filter: "none" }], {
    duration: 420,
    delay: 260,
    easing: "cubic-bezier(0.23, 1, 0.32, 1)",
    fill: "backwards",
  });
  // coming back with the browser's back button restores this page as it was left: clear the veil
  addEventListener("pageshow", () => veil.remove(), { once: true });
  veil
    .animate([{ clipPath: from }, { clipPath: "inset(0px 0px 0px 0px)" }], { duration: 680, easing: "cubic-bezier(0.77, 0, 0.175, 1)", fill: "forwards" })
    .finished.then(() => location.assign(url));
}

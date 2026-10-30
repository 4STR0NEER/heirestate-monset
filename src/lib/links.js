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

// Leaving for another site (a project's, or the collection with no id): its colour grows out of
// the element that was clicked (or rises from below) until it fills the screen, and the next page
// opens out of that same colour (data-arrive, set in its HTML by sites.js), never a blank page.
export function leave(id, rect) {
  const url = siteUrl(id);
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return location.assign(url);
  const from = rect ? insetOf(rect) : "inset(100% 0px 0px 0px)";
  const veil = document.createElement("div");
  veil.style.cssText = `position:fixed;inset:0;z-index:90;background:${id ? projects[id].accent : HOUSE};clip-path:${from}`;
  document.body.append(veil);
  // coming back with the browser's back button restores this page as it was left: clear the veil
  addEventListener("pageshow", () => veil.remove(), { once: true });
  veil
    .animate([{ clipPath: from }, { clipPath: "inset(0px 0px 0px 0px)" }], { duration: 650, easing: "cubic-bezier(0.77, 0, 0.175, 1)", fill: "forwards" })
    .finished.then(() => location.assign(url));
}

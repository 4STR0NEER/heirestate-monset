import { order, projects } from "../projects.js";

// Read by the page (import.meta.env) and by the build in Node (process.env).
const env = import.meta.env ?? process.env;

// The domain the sites live on: the collection on the bare domain, each project on its own
// subdomain (wave.<domain>, ...). Set VITE_DOMAIN in the host's environment once the domain is
// connected. Until then every site is served from one address, each project under its own path
// (/wave/), which is how a *.vercel.app address works: it cannot have subdomains.
export const DOMAIN = env.VITE_DOMAIN || "";

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

// Leaving for a project's own site: its colour grows out of the window that was clicked (or rises
// from below) until it fills the screen, and the project's site opens out of that same colour
// (#arrive, handled in its HTML by sites.js).
export function leave(id, rect) {
  const url = `${siteUrl(id)}#arrive`;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return location.assign(url);
  const from = rect ? insetOf(rect) : "inset(100% 0px 0px 0px)";
  const veil = document.createElement("div");
  veil.style.cssText = `position:fixed;inset:0;z-index:90;background:${projects[id].accent};clip-path:${from}`;
  document.body.append(veil);
  // coming back with the browser's back button restores this page as it was left: clear the veil
  addEventListener("pageshow", () => veil.remove(), { once: true });
  veil
    .animate([{ clipPath: from }, { clipPath: "inset(0px 0px 0px 0px)" }], { duration: 650, easing: "cubic-bezier(0.77, 0, 0.175, 1)", fill: "forwards" })
    .finished.then(() => location.assign(url));
}

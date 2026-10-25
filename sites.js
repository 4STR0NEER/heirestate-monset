// One codebase, one site per (sub)domain. `vite --mode wave` serves and builds The Wave's own
// site; any other mode is the main collection. Each site gets its own <head> (title, description,
// canonical, Open Graph, JSON-LD), crawlable text in the HTML before React takes over, its own
// robots.txt and sitemap.xml, and, for a project, only that project's media.
import { readdirSync, readFileSync } from "node:fs";
import { order, projects } from "./src/projects.js";
import { DOMAIN, HOUSE, devPort, siteUrl } from "./src/lib/links.js";

const BRAND = "Heir Estate";
const HEADLINE = "Building your future, one property at a time";
const SUB = "Securing wealth, creating your legacy";
const PUBLIC = new URL("./public/", import.meta.url);

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
// search results show about 160 characters; cut on a word
const clip = (s, n = 158) => (s.length <= n ? s : `${s.slice(0, s.lastIndexOf(" ", n - 1))}…`);
const names = new Intl.ListFormat("en").format(order.map((id) => projects[id].name));
const nextOf = (id) => order[(order.indexOf(id) + 1) % order.length];
// Search engines and link previews need full addresses. Before a domain is set, the sites share
// the deployment's own address (Vercel provides it to the build), each project under its path.
const HOST = process.env.VERCEL_PROJECT_PRODUCTION_URL || "localhost";
const absolute = (u) => (u.startsWith("http") ? u : `https://${HOST}${u}`);
const urlOf = (id) => absolute(siteUrl(id));
// where a site's files are served from: its subdomain, or the shared address (media is at the root either way)
const originOf = (id) => `${new URL(urlOf(id)).origin}/`;
const ORG = { "@type": "Organization", "@id": `${urlOf()}#org`, name: BRAND, url: urlOf() };

function page(site) {
  if (site === "main") {
    const url = urlOf();
    return {
      url,
      title: `${BRAND} · ${HEADLINE}`,
      description: `${BRAND}. ${SUB}. ${names}.`,
      image: `${originOf()}media/p/${order[0]}-hero.jpg`,
      graph: [
        ORG,
        { "@type": "WebSite", "@id": `${url}#website`, url, name: BRAND, publisher: { "@id": ORG["@id"] } },
        {
          "@type": "ItemList",
          name: `${BRAND} projects`,
          itemListElement: order.map((id, i) => ({ "@type": "ListItem", position: i + 1, url: urlOf(id), name: projects[id].name })),
        },
      ],
      body: `<h1>${esc(HEADLINE)}</h1><p>${esc(SUB)}</p><ul>${order
        .map((id) => `<li><a href="${siteUrl(id)}">${esc(projects[id].name)}</a>: ${esc(projects[id].tagline)}. ${esc(projects[id].statement)}</li>`)
        .join("")}</ul>`,
    };
  }

  const p = projects[site];
  const url = urlOf(site);
  const abs = (path) => `${originOf(site)}${path.slice(1)}`;
  const next = nextOf(site);
  const location = p.facts.find(([label]) => label === "Location")?.[1];
  return {
    url,
    title: `${p.name} · ${p.tagline} | ${BRAND}`,
    description: clip(`${p.name}, ${p.tagline.toLowerCase()}. ${p.statement}`),
    image: abs(`${p.hero}.jpg`),
    preload: `${p.hero}.jpg`, // the hero film's poster is the first big paint
    graph: [
      ORG,
      {
        "@type": "WebPage",
        "@id": url,
        url,
        name: `${p.name} · ${p.tagline}`,
        about: { "@id": `${url}#residence` },
        publisher: { "@id": ORG["@id"] },
      },
      {
        "@type": "Residence",
        "@id": `${url}#residence`,
        name: p.name,
        description: p.statement,
        url,
        image: [abs(`${p.hero}.jpg`), ...p.spaces.map((s) => abs(s.src))],
        ...(location && { address: location }),
      },
    ],
    body: `<h1>${esc(p.name)}</h1><p>${esc(p.tagline)}</p>${p.kicker ? `<p>${esc(p.kicker)}</p>` : ""}<p>${esc(p.statement)}</p>${
      p.facts.length ? `<dl>${p.facts.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join("")}</dl>` : ""
    }<h2>Spaces</h2><ul>${p.spaces.map((s) => `<li>${esc(s.name)}${s.area ? `, ${esc(s.area)}` : ""}</li>`).join("")}</ul><p><a href="${siteUrl(
      next
    )}">${esc(projects[next].name)}</a> · <a href="${siteUrl()}">${BRAND}, the collection</a></p>`,
  };
}

// a project's site carries its own media and frames, plus the next project's poster for the "next project" link
const list = (dir) =>
  readdirSync(new URL(`.${dir}/`, PUBLIC), { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? list(`${dir}/${e.name}`) : [`${dir}/${e.name}`]));
function mediaFor(id) {
  const refs = JSON.stringify(projects[id]).match(/\/(media|frames)\/[^"]+/g);
  const files = [...list("/media"), ...list("/frames")];
  const own = files.filter((f) => refs.some((r) => f === r || f.startsWith(`${r}.`) || f.startsWith(`${r}/`)));
  return ["/favicon.svg", `${projects[nextOf(id)].hero}.jpg`, ...own];
}

export default function sites() {
  let site;
  return {
    name: "heir-sites",
    config(_, { mode }) {
      site = order.includes(mode) ? mode : "main";
      return {
        define: { __SITE__: JSON.stringify(site) },
        build: { outDir: `dist/${site}`, emptyOutDir: true, copyPublicDir: site === "main" },
        // each site its own dependency cache, so `npm run dev` can start them all at once
        cacheDir: `node_modules/.vite/${site}`,
        // each site on its own port, so links between them work in development (links.js)
        server: { port: devPort(site === "main" ? null : site), strictPort: true },
        preview: { port: devPort(site === "main" ? null : site) + 1000 },
      };
    },
    transformIndexHtml(html) {
      const s = page(site);
      const ld = JSON.stringify({ "@context": "https://schema.org", "@graph": s.graph }).replace(/</g, "\\u003c");
      const head = [
        `<title>${esc(s.title)}</title>`,
        `<meta name="description" content="${esc(s.description)}" />`,
        `<link rel="canonical" href="${s.url}" />`,
        `<meta property="og:type" content="website" />`,
        `<meta property="og:site_name" content="${BRAND}" />`,
        `<meta property="og:title" content="${esc(s.title)}" />`,
        `<meta property="og:description" content="${esc(s.description)}" />`,
        `<meta property="og:url" content="${s.url}" />`,
        `<meta property="og:image" content="${s.image}" />`,
        `<meta name="twitter:card" content="summary_large_image" />`,
        s.preload && `<link rel="preload" as="image" href="${s.preload}" fetchpriority="high" />`,
        // until the page has drawn, the site's colour instead of a blank page: a project lifts it like a
        // blind (ProjectPage), the collection hands it to its loader. It is the colour leave() arrives in.
        // Should the scripts never run, it stands aside after 8s.
        `<style>html[data-arrive]::before{content:"";position:fixed;inset:0;z-index:80;background:${
          site === "main" ? HOUSE : projects[site].accent
        };animation:arrive-hold 0s 8s forwards}@keyframes arrive-hold{to{visibility:hidden}}</style>`,
        // a project with a palette of its own paints the house tokens before the page draws
        projects[site]?.theme &&
          `<style>html:root{${Object.entries(projects[site].theme).map(([k, v]) => `${k}:${v}`).join(";")}}</style>`,
        `<script>document.documentElement.dataset.arrive=""</script>`,
        `<script type="application/ld+json">${ld}</script>`,
      ];
      return html
        .replace("<!--seo-->", head.filter(Boolean).join("\n    "))
        .replace("<!--prerender-->", `<div class="prerender">${s.body}</div>`);
    },
    generateBundle() {
      const { url } = page(site);
      const emit = (fileName, source) => this.emitFile({ type: "asset", fileName, source });
      // on one shared address (no domain yet) the collection's sitemap lists every project's page too
      const urls = site === "main" && !DOMAIN ? [url, ...order.map(urlOf)] : [url];
      emit("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${url}sitemap.xml\n`);
      emit(
        "sitemap.xml",
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((u) => `<url><loc>${u}</loc></url>`).join("")}</urlset>\n`
      );
      if (site !== "main") for (const f of mediaFor(site)) emit(f.slice(1), readFileSync(new URL(f.slice(1), PUBLIC)));
    },
  };
}

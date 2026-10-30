// One codebase, one site per (sub)domain. `vite --mode wave` serves and builds The Wave's own
// site; any other mode is the main collection. Each site gets its own <head> (title, description,
// canonical, Open Graph, JSON-LD), crawlable text in the HTML before React takes over, its own
// robots.txt and sitemap.xml, and, for a project, only that project's media.
import { readdirSync, readFileSync } from "node:fs";
import { order, projects } from "./src/projects.js";
import { ARRIVE, DOMAIN, HOUSE, devPort, siteUrl } from "./src/lib/links.js";
import { BRAND, agentOf, amenitiesOf, fact, faqFor, fullName, pageText, unitTypes } from "./src/lib/seo.js";

const HEADLINE = "Building your future, one property at a time";
const SUB = "Securing wealth, creating your legacy";
const PUBLIC = new URL("./public/", import.meta.url);
const BUILT = new Date().toISOString().slice(0, 10); // each sitemap's lastmod: the day the sites were built

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
// search results show about 160 characters; cut on a word
const clip = (s, n = 158) => (s.length <= n ? s : `${s.slice(0, s.lastIndexOf(" ", n - 1))}…`);
const nextOf = (id) => order[(order.indexOf(id) + 1) % order.length];
// Search engines and link previews need full addresses. Without a domain (VITE_DOMAIN=""), the
// sites share one address, each project under its path: set SITE_HOST to that address.
const HOST = process.env.SITE_HOST || "localhost";
const absolute = (u) => (u.startsWith("http") ? u : `https://${HOST}${u}`);
const urlOf = (id) => absolute(siteUrl(id));
// where a site's files are served from: its subdomain, or the shared address (media is at the root either way)
const originOf = (id) => `${new URL(urlOf(id)).origin}/`;

// an address line as schema.org's PostalAddress: "Street, City", "Place, District, City" or, with
// a postcode, "Street, Town, Province 6000". Everything here is in the province of Cebu.
function postal(line) {
  const parts = line.split(", ");
  const coded = parts.at(-1).match(/^(.*) (\d{4})$/);
  const [locality, region, code] = coded ? [parts.at(-2), coded[1], coded[2]] : [parts.at(-1), "Cebu"];
  const street = parts.slice(0, coded ? -2 : -1).join(", ");
  return {
    "@type": "PostalAddress",
    ...(street && { streetAddress: street }),
    addressLocality: locality,
    addressRegion: region,
    ...(code && { postalCode: code }),
    addressCountry: "PH",
  };
}

// The house, and the licensed agents behind every project: the same two entities on every site,
// so search and answer engines tie the sites together and to the people who answer for them.
const AGENT = agentOf();
const ORG = {
  "@type": "Organization",
  "@id": `${urlOf()}#org`,
  name: BRAND,
  url: urlOf(),
  areaServed: "Cebu, Philippines",
  ...(AGENT && {
    email: AGENT.email,
    contactPoint: { "@type": "ContactPoint", contactType: "sales", email: AGENT.email, telephone: AGENT.phones[0], areaServed: "PH" },
    member: { "@id": `${urlOf()}#agents` },
  }),
};
const AGENTS = AGENT && {
  "@type": "RealEstateAgent",
  "@id": `${urlOf()}#agents`,
  name: AGENT.names,
  description: `${AGENT.role}, ${AGENT.firm}`,
  url: `${urlOf()}#agents`,
  image: `${originOf()}${AGENT.photo.slice(1)}`,
  email: AGENT.email,
  telephone: AGENT.phones,
  areaServed: "Cebu, Philippines",
  ...(AGENT.address && { address: postal(AGENT.address) }),
  parentOrganization: { "@type": "Organization", name: AGENT.firm },
  ...(AGENT.profiles?.length && { sameAs: AGENT.profiles.map(([, href]) => href) }),
  identifier: AGENT.licences.map(([name, value]) => ({ "@type": "PropertyValue", name, value })),
};
const faqPage = (url, id) => ({
  "@type": "FAQPage",
  "@id": `${url}#faq`,
  mainEntity: faqFor(id).map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
});

function page(site) {
  if (site === "main") {
    const url = urlOf();
    return {
      url,
      title: `${BRAND} · Cebu Condominiums: Alto Ranudo, The Wave, North Grove`,
      description: clip(
        `Three Cebu condominium projects: ${new Intl.ListFormat("en").format(order.map((id) => fullName(projects[id])))}. Floor plans, amenities and viewings with licensed agents.`
      ),
      image: `${originOf()}media/p/${order[0]}-hero.jpg`,
      imageAlt: `${fullName(projects[order[0]])}, one of the ${BRAND} projects`,
      images: [...order.map((id) => `${originOf()}${projects[id].hero.slice(1)}.jpg`), AGENTS?.image].filter(Boolean),
      preload: `${projects[order[0]].hero}.jpg`, // the hero's opening film's poster is the first big paint
      graph: [
        ORG,
        { "@type": "WebSite", "@id": `${url}#website`, url, name: BRAND, inLanguage: "en", publisher: { "@id": ORG["@id"] } },
        AGENTS,
        {
          "@type": "ItemList",
          name: `${BRAND} projects`,
          itemListElement: order.map((id, i) => ({ "@type": "ListItem", position: i + 1, url: urlOf(id), name: fullName(projects[id]) })),
        },
        faqPage(url),
      ].filter(Boolean),
      body: `<h1>${esc(HEADLINE)}</h1><p>${esc(SUB)}</p>${pageText(null, siteUrl)}${agentsText()}<p><a href="${siteUrl()}privacy/">Privacy notice</a></p>`,
    };
  }

  const p = projects[site];
  const url = urlOf(site);
  const abs = (path) => `${originOf(site)}${path.slice(1)}`;
  const next = nextOf(site);
  const where = fact(p, "Location");
  const homes = parseInt(fact(p, "Residences")?.replace(/,/g, "") ?? "", 10);
  const amenities = amenitiesOf(p);
  const images = [abs(`${p.hero}.jpg`), ...p.spaces.map((s) => abs(s.src))];
  return {
    url,
    title: p.seo?.title ?? `${p.name} · ${p.tagline} | ${BRAND}`,
    description: clip(p.seo?.description ?? `${p.name}, ${p.tagline.toLowerCase()}. ${p.statement}`),
    image: abs(`${p.hero}.jpg`),
    imageAlt: `${fullName(p)}, the developer's render`,
    images,
    preload: `${p.hero}.jpg`, // the hero film's poster is the first big paint
    graph: [
      ORG,
      AGENTS,
      {
        "@type": "WebPage",
        "@id": url,
        url,
        name: p.seo?.title ?? fullName(p),
        inLanguage: "en",
        about: { "@id": `${url}#residence` },
        primaryImageOfPage: images[0],
        publisher: { "@id": ORG["@id"] },
      },
      // the project as what it is: a complex of apartments, with its address, its homes, what it
      // offers, and each unit type's bedrooms and floor area from the developer's plans
      {
        "@type": "ApartmentComplex",
        "@id": `${url}#residence`,
        name: fullName(p),
        ...(p.fullName && { alternateName: p.name }),
        description: p.statement,
        url,
        image: images,
        ...(where && { address: postal(where) }),
        ...(p.place && { containedInPlace: { "@type": "Place", name: p.place } }),
        ...(homes > 0 && { numberOfAccommodationUnits: homes }),
        ...(amenities && { amenityFeature: amenities.map((name) => ({ "@type": "LocationFeatureSpecification", name, value: true })) }),
        accommodationFloorPlan: unitTypes(p).map((u) => ({
          "@type": "FloorPlan",
          name: u.name,
          numberOfBedrooms: u.beds,
          floorSize:
            u.min === u.max
              ? { "@type": "QuantitativeValue", value: u.min, unitCode: "MTK" }
              : { "@type": "QuantitativeValue", minValue: u.min, maxValue: u.max, unitCode: "MTK" },
          layoutImage: abs(p.residences.find((r) => r.id === u.id).plans[0][1]),
        })),
        ...(p.agent && { tourBookingPage: `${url}#enquiry` }),
      },
      faqPage(url, site),
    ].filter(Boolean),
    body: `<h1>${esc(p.name)}</h1><p>${esc(p.tagline)}</p>${p.kicker ? `<p>${esc(p.kicker)}</p>` : ""}<p>${esc(p.statement)}</p>${
      p.facts.length ? `<dl>${p.facts.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join("")}</dl>` : ""
    }${pageText(site, siteUrl)}${agentsText()}<p><a href="${siteUrl(next)}">${esc(fullName(projects[next]))}</a> · <a href="${siteUrl()}">${BRAND}, the collection</a> · <a href="${siteUrl()}privacy/">Privacy notice</a></p>`,
  };
}

// the agents, written out for crawlers: who they are, their registrations, how to reach them
function agentsText() {
  if (!AGENT) return "";
  return `<h2>Your agents: ${esc(AGENT.names)}</h2><p>${esc(AGENT.role)}, ${esc(AGENT.firm)}. ${AGENT.licences
    .map(([k, v]) => `${esc(k)} ${esc(v)}`)
    .join(". ")}. ${esc(AGENT.phones.join(", "))}. ${esc(AGENT.email)}. ${esc(AGENT.address ?? "")}</p>`;
}

// a project's site carries its own media and frames, plus the next project's poster for the "next project" link
const list = (dir) =>
  readdirSync(new URL(`.${dir}/`, PUBLIC), { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? list(`${dir}/${e.name}`) : [`${dir}/${e.name}`]));
function mediaFor(id) {
  const refs = JSON.stringify(projects[id]).match(/\/(media|frames)\/[^"]+/g);
  const files = [...list("/media"), ...list("/frames")];
  // a film comes with its phone cut (film.js): name-sm.mp4
  const own = files.filter((f) => refs.some((r) => f === r || f.startsWith(`${r}.`) || f.startsWith(`${r}-sm.`) || f.startsWith(`${r}/`)));
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
    transformIndexHtml(html, ctx) {
      const s = page(site);
      // the display face, fetched with the page: the name on the arriving colour is set in it
      const face = Object.keys(ctx.bundle ?? {}).find((f) => /bodoni-moda-latin-wght-normal-.*\.woff2$/.test(f));
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
        `<meta property="og:image:alt" content="${esc(s.imageAlt)}" />`,
        `<meta property="og:locale" content="en_PH" />`,
        `<meta name="twitter:card" content="summary_large_image" />`,
        s.preload && `<link rel="preload" as="image" href="${s.preload}" fetchpriority="high" />`,
        face && `<link rel="preload" as="font" type="font/woff2" href="/${face}" crossorigin />`,
        // until the page has drawn, the site's colour instead of a blank page: a project carries its
        // name in it, exactly where leave() set it on the page before, and lifts it like a blind
        // (ProjectPage); the collection's card hands over to its loader. Should the scripts never run,
        // it stands aside after 8s.
        `<style>html[data-arrive]::before{content:"${site === "main" ? BRAND : esc(projects[site].name)}";${ARRIVE};background:${
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
      // each address with the day it was built and the pictures on it (Google's image sitemap extension)
      const pics = (u) => (u === url ? page(site).images : []).map((i) => `<image:image><image:loc>${i}</image:loc></image:image>`).join("");
      emit(
        "sitemap.xml",
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${urls
          .map((u) => `<url><loc>${u}</loc><lastmod>${BUILT}</lastmod>${pics(u)}</url>`)
          .join("")}</urlset>\n`
      );
      if (site !== "main") for (const f of mediaFor(site)) emit(f.slice(1), readFileSync(new URL(f.slice(1), PUBLIC)));
    },
  };
}

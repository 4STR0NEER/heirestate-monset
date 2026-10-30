// One deployment, one site per host name: wave.<domain>/ serves /wave/ (and its own robots.txt and
// sitemap.xml), www.<domain> goes to the bare domain, and a project's page asked for at a path on
// any other host (<domain>/wave/, alto.<domain>/wave/) goes to its own subdomain for good, so each
// page has one address. Only these paths reach the worker (run_worker_first in wrangler.jsonc,
// which build.js checks lists every project); everything else is served straight from dist/all.
import { order } from "./src/projects.js";

export default {
  fetch(req, env) {
    const url = new URL(req.url);
    const [sub, ...rest] = url.hostname.split(".");
    const apex = order.includes(sub) || sub === "www" ? rest.join(".") : url.hostname;
    if (sub === "www") return Response.redirect(`https://${apex}${url.pathname}${url.search}`, 301);

    // previews (*.workers.dev) have no subdomains to send anyone to
    const first = url.pathname.split("/")[1];
    if (order.includes(first) && !url.hostname.endsWith("workers.dev")) {
      const path = url.pathname.slice(first.length + 1).replace(/^\/?index\.html$/, "/") || "/";
      return Response.redirect(`https://${first}.${apex}${path}${url.search}`, 301);
    }

    if (order.includes(sub)) url.pathname = `/${sub}${url.pathname}`;
    return env.ASSETS.fetch(new Request(url, req));
  },
};

// One deployment, one site per host name: wave.<domain>/ serves /wave/ (and its own robots.txt and
// sitemap.xml), www.<domain> goes to the bare domain. Only these paths reach the worker
// (run_worker_first in wrangler.jsonc); everything else is served straight from dist/all.
import { order } from "./src/projects.js";

export default {
  fetch(req, env) {
    const url = new URL(req.url);
    const sub = url.hostname.split(".")[0];
    if (sub === "www") return Response.redirect(`https://${url.hostname.slice(4)}${url.pathname}${url.search}`, 301);
    if (order.includes(sub)) url.pathname = `/${sub}${url.pathname}`;
    return env.ASSETS.fetch(new Request(url, req));
  },
};

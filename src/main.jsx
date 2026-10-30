import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/bodoni-moda";
import "@fontsource-variable/bodoni-moda/wght-italic.css";
import "@fontsource/marcellus";
import "@fontsource-variable/hanken-grotesk";
import "./index.css";
import App from "./App";
import { ProjectPage } from "./sections/ProjectView";

// Pointing at a link to another of the sites (wave.<domain>, the collection, ...) fetches that page
// ahead, so by the time the colour has filled the screen the next page is already here.
const fetched = new Set();
const site = (host) => host.split(".").slice(-2).join(".");
addEventListener("pointerover", (e) => {
  const a = e.target.closest?.("a[href]");
  if (!a || a.origin === location.origin || site(a.hostname) !== site(location.hostname) || fetched.has(a.href)) return;
  fetched.add(a.href);
  document.head.append(Object.assign(document.createElement("link"), { rel: "prefetch", href: a.href }));
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* set per build by sites.js: the collection, or one project's own site */}
    {__SITE__ === "main" ? <App /> : <ProjectPage id={__SITE__} />}
  </StrictMode>
);

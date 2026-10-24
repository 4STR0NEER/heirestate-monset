import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/bodoni-moda";
import "@fontsource/marcellus";
import "@fontsource-variable/hanken-grotesk";
import "./index.css";
import App from "./App";
import { ProjectPage } from "./sections/ProjectView";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* set per build by sites.js: the collection, or one project's own site */}
    {__SITE__ === "main" ? <App /> : <ProjectPage id={__SITE__} />}
  </StrictMode>
);

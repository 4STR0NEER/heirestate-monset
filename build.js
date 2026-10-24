// Builds the collection and every project's own site, each into dist/<site>/ for its (sub)domain.
import { build } from "vite";
import { order } from "./src/projects.js";

for (const mode of ["main", ...order]) await build({ mode });

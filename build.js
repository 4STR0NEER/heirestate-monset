// Builds the collection and every project's own site into dist/<site>/, then puts them together in
// dist/all/ as one deployment: the collection at the root, each project's page at /<id>/. All
// sites share the root's media and assets (hashed names never collide), so the same folder serves
// /wave/ on a single address and on wave.<domain> (worker.js routes by host name).
import { cpSync, mkdirSync, rmSync } from "node:fs";
import { build } from "vite";
import { order } from "./src/projects.js";

for (const mode of ["main", ...order]) await build({ mode });

rmSync("dist/all", { recursive: true, force: true });
cpSync("dist/main", "dist/all", { recursive: true });
for (const id of order) {
  cpSync(`dist/${id}/assets`, "dist/all/assets", { recursive: true });
  mkdirSync(`dist/all/${id}`);
  for (const f of ["index.html", "robots.txt", "sitemap.xml"]) cpSync(`dist/${id}/${f}`, `dist/all/${id}/${f}`);
}
console.log("dist/all: the collection at /, and", order.map((id) => `/${id}/`).join(" "));

// Builds the collection and every project's own site into dist/<site>/, then puts them together in
// dist/all/ as one deployment: the collection at the root, each project's page at /<id>/. All
// sites share the root's media and assets (hashed names never collide), so the same folder serves
// /wave/ on a single address now and wave.<domain> later (vercel.json routes by host name).
import { cpSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { build } from "vite";
import { order } from "./src/projects.js";

// vercel.json's host rule lists the projects by name; a project missing from it would never be reached
const rule = readFileSync("vercel.json", "utf8");
const missing = order.filter((id) => !rule.includes(id));
if (missing.length) throw new Error(`vercel.json's host rewrite is missing: ${missing.join(", ")}`);

for (const mode of ["main", ...order]) await build({ mode });

rmSync("dist/all", { recursive: true, force: true });
cpSync("dist/main", "dist/all", { recursive: true });
for (const id of order) {
  cpSync(`dist/${id}/assets`, "dist/all/assets", { recursive: true });
  mkdirSync(`dist/all/${id}`);
  for (const f of ["index.html", "robots.txt", "sitemap.xml"]) cpSync(`dist/${id}/${f}`, `dist/all/${id}/${f}`);
}
console.log("dist/all: the collection at /, and", order.map((id) => `/${id}/`).join(" "));

// Serves the collection and every project's own site at once, each on its own port (links.js),
// so links between them work in development.
import { createServer } from "vite";
import { order } from "./src/projects.js";

for (const mode of ["main", ...order]) {
  const server = await createServer({ mode });
  await server.listen();
  console.log(`${mode.padEnd(10)} ${server.resolvedUrls.local[0]}`);
}

import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import sites from "./sites.js";

export default defineConfig({
  plugins: [react(), tailwindcss(), sites()],
  // "@/..." is the import style Skiper and Vengeance components expect
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
});

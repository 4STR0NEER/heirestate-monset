import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/bodoni-moda";
import "@fontsource/marcellus";
import "@fontsource-variable/hanken-grotesk";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);

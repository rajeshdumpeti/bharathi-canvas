import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app/App";
import "./styles/index.css";

const container = document.getElementById("root");
if (!container) throw new Error("Root container missing in index.html");

const root = createRoot(container);

// Use BrowserRouter for all environments.
// Your vercel.json file (if you use it) or Vercel's framework preset
// will handle this correctly in production.
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

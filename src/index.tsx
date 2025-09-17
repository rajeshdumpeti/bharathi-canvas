import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, HashRouter } from "react-router-dom";
import App from "./app/App";
import "./styles/index.css";

const Router =
  process.env.NODE_ENV === "production" ? HashRouter : BrowserRouter;
// ^ if you’re using Vite, prefer `import.meta.env.MODE` over `process.env.NODE_ENV`
// if CRA, then keep `process.env.NODE_ENV`

const container = document.getElementById("root");
if (!container) throw new Error("Root container missing in index.html");

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);

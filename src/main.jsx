import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

import "./styles/reset.css";
import "./styles/base.css";

import { SpeedInsights } from "@vercel/speed-insights/next";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    <SpeedInsights />
  </React.StrictMode>
);

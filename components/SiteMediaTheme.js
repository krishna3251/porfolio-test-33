"use client";

import { useEffect } from "react";

const colorProperties = {
  paper: "--bg",
  surface: "--surface",
  ink: "--fg",
  muted: "--muted",
  accent: "--accent",
  orange: "--accent-hot",
  border: "--border",
};

export default function SiteMediaTheme() {
  useEffect(() => {
    let alive = true;
    fetch("/site-media.json?v=latest", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : null)
      .then((config) => {
        if (!alive || !config) return;
        const design = config.design || {};
        const palette = ["editorial", "darkroom", "sunset", "minimalism"].includes(design.theme) ? design.theme : "editorial";
        document.documentElement.dataset.theme = palette;
        Object.entries(colorProperties).forEach(([key, property]) => {
          if (design.theme === "custom" && /^#[0-9a-f]{6}$/i.test(design[key] || "")) {
            document.documentElement.style.setProperty(property, design[key]);
          } else {
            document.documentElement.style.removeProperty(property);
          }
        });
        if (Number.isFinite(Number(design.radius))) {
          document.documentElement.style.setProperty("--card-radius", Math.min(28, Math.max(4, Number(design.radius))) + "px");
        }
      })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

  return null;
}

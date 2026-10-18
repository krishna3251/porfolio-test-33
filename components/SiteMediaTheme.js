"use client";

import { useEffect } from "react";
import { loadSiteMedia } from "@/hooks/useSiteMedia";

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
    loadSiteMedia()
      .then((config) => {
        if (!alive || !config) return;
        const design = config.design || {};
        const palette = ["editorial", "darkroom", "sunset", "minimalism", "maximalism"].includes(design.theme) ? design.theme : "editorial";
        let selected = palette;
        try {
          const saved = JSON.parse(localStorage.getItem("krishna-theme-v3") || "null");
          if (saved?.version === (Number(config.version) || 1) && ["editorial", "darkroom", "sunset", "minimalism", "maximalism"].includes(saved.theme)) selected = saved.theme;
        } catch {}
        document.documentElement.dataset.theme = selected;
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

"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const themes = [
  {
    name: "Dark Technical",
    label: "Cyber Violet",
    dotColor: "bg-[#d7baff]",
    vars: {
      "--bg": "oklch(10% 0.015 285)",
      "--surface": "oklch(13% 0.02 285)",
      "--fg": "oklch(95% 0.008 285)",
      "--muted": "oklch(65% 0.015 285)",
      "--border": "rgba(255, 255, 255, 0.08)",
      "--accent": "oklch(75% 0.16 280)",
    },
  },
  {
    name: "Midnight",
    label: "Midnight Azure",
    dotColor: "bg-[#38bdf8]",
    vars: {
      "--bg": "oklch(10% 0.02 240)",
      "--surface": "oklch(13% 0.025 240)",
      "--fg": "oklch(94% 0.01 240)",
      "--muted": "oklch(65% 0.02 240)",
      "--border": "rgba(180, 210, 255, 0.09)",
      "--accent": "oklch(76% 0.15 210)",
    },
  },
  {
    name: "Aurora",
    label: "Emerald Aurora",
    dotColor: "bg-[#34d399]",
    vars: {
      "--bg": "oklch(9% 0.015 150)",
      "--surface": "oklch(12% 0.02 150)",
      "--fg": "oklch(95% 0.01 150)",
      "--muted": "oklch(65% 0.02 150)",
      "--border": "rgba(200, 255, 220, 0.09)",
      "--accent": "oklch(78% 0.20 145)",
    },
  },
  {
    name: "Lava Amber",
    label: "Sunset Ember",
    dotColor: "bg-[#fb923c]",
    vars: {
      "--bg": "oklch(10% 0.018 35)",
      "--surface": "oklch(13% 0.022 35)",
      "--fg": "oklch(95% 0.01 35)",
      "--muted": "oklch(65% 0.02 35)",
      "--border": "rgba(255, 200, 180, 0.09)",
      "--accent": "oklch(72% 0.19 45)",
    },
  },
  {
    name: "Light Studio",
    label: "Architectural Light",
    dotColor: "bg-[#f5f3ef] border border-black/20",
    vars: {
      "--bg": "oklch(96% 0.008 85)",
      "--surface": "oklch(99% 0.005 85)",
      "--fg": "oklch(15% 0.015 285)",
      "--muted": "oklch(45% 0.015 285)",
      "--border": "rgba(0, 0, 0, 0.09)",
      "--accent": "oklch(55% 0.22 280)",
    },
  },
];

export default function ThemeSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState("Dark Technical");

  const applyTheme = useCallback((theme) => {
    setActiveTheme(theme.name);
    localStorage.setItem("krishna-portfolio-theme-v3", theme.name);
    const root = document.documentElement;
    Object.entries(theme.vars).forEach(([key, val]) => {
      root.style.setProperty(key, val);
    });
  }, []);

  useEffect(() => {
    const savedThemeName = localStorage.getItem("krishna-portfolio-theme-v3") || "Dark Technical";
    const selected = themes.find((t) => t.name === savedThemeName) || themes[0];
    applyTheme(selected);
  }, [applyTheme]);

  const currentThemeObj = themes.find((t) => t.name === activeTheme) || themes[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="mono-metadata text-[9.5px] text-muted hover:text-foreground transition-colors flex items-center gap-2 cursor-pointer py-1"
        aria-label="Change theme colors"
      >
        <span className={`w-2.5 h-2.5 rounded-full ${currentThemeObj.dotColor}`} />
        <span className="hidden sm:inline font-bold">THEME</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-3 p-3 paper-sheet bg-surface/95 backdrop-blur-xl border border-foreground/10 rounded-2xl z-50 flex flex-col gap-2 min-w-[210px] shadow-2xl"
            >
              <div className="px-3 py-1.5 border-b border-foreground/5">
                <span className="mono-metadata text-[7.5px] text-muted tracking-widest block font-bold">
                  SELECT VISUAL PALETTE
                </span>
              </div>

              <div className="flex flex-col gap-1">
                {themes.map((t) => (
                  <button
                    key={t.name}
                    onClick={() => {
                      applyTheme(t);
                      setIsOpen(false);
                    }}
                    className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-xl transition-all duration-200 cursor-pointer ${
                      activeTheme === t.name
                        ? "bg-foreground/10 text-foreground font-bold shadow-sm"
                        : "text-muted hover:text-foreground hover:bg-foreground/5"
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${t.dotColor}`} />
                    <div className="flex flex-col">
                      <span className="mono-metadata text-[9px] tracking-wider">
                        {t.name}
                      </span>
                      <span className="font-sans text-[8px] text-muted">
                        {t.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

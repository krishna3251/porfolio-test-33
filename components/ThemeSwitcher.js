"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const themes = [
  {
    name: "Cyber Violet",
    accent: "oklch(75% 0.16 280)",
    colorDot: "bg-[#d7baff]"
  },
  {
    name: "Sky Cyan",
    accent: "oklch(75% 0.16 195)",
    colorDot: "bg-[#00f5ff]"
  },
  {
    name: "Toxic Neon",
    accent: "oklch(78% 0.22 140)",
    colorDot: "bg-[#39ff14]"
  },
  {
    name: "Lava Orange",
    accent: "oklch(68% 0.20 30)",
    colorDot: "bg-[#ff6b4a]"
  },
  {
    name: "Hot Pink",
    accent: "oklch(68% 0.22 330)",
    colorDot: "bg-[#f7b1e3]"
  }
];

export default function ThemeSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState("Cyber Violet");

  const applyTheme = useCallback((theme) => {
    setActiveTheme(theme.name);
    localStorage.setItem("krishna-portfolio-theme-v2", theme.name);
    document.documentElement.style.setProperty("--accent", theme.accent);
  }, []);

  useEffect(() => {
    const savedThemeName = localStorage.getItem("krishna-portfolio-theme-v2") || "Cyber Violet";
    const selected = themes.find(t => t.name === savedThemeName) || themes[0];
    applyTheme(selected);
  }, [applyTheme]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="mono-metadata text-[10px] text-muted hover:text-foreground transition-colors flex items-center gap-2 cursor-pointer"
        aria-label="Change theme colors"
      >
        <span className="w-2 h-2 rounded-full border border-foreground/10 bg-primary" />
        Tone
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute right-0 mt-4 p-4 paper-sheet z-50 flex flex-col gap-3 min-w-[200px]"
            >
              <span className="mono-metadata text-[9px] text-muted mb-1">
                Select Visual Tone
              </span>
              <div className="flex flex-col gap-1">
                {themes.map((t) => (
                  <button
                    key={t.name}
                    onClick={() => {
                      applyTheme(t);
                      setIsOpen(false);
                    }}
                    className={`flex items-center gap-3 w-full text-left px-3 py-2 transition-all duration-300 cursor-pointer ${
                      activeTheme === t.name
                        ? "bg-foreground/5 text-foreground"
                        : "text-muted hover:text-foreground hover:bg-foreground/5"
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${t.colorDot}`} />
                    <span className="mono-metadata text-[10px] uppercase tracking-widest">{t.name}</span>
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

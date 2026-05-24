"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const themes = [
  {
    name: "Lavender",
    primary: "#d7baff",
    primaryDark: "#411478",
    secondary: "#f7b1e3",
    secondaryDark: "#69335e",
    colorDot: "bg-[#d7baff]"
  },
  {
    name: "Cyan",
    primary: "#00f0ff",
    primaryDark: "#004f54",
    secondary: "#d1bcff",
    secondaryDark: "#3c0090",
    colorDot: "bg-[#00f0ff]"
  },
  {
    name: "Emerald",
    primary: "#34d399",
    primaryDark: "#064e3b",
    secondary: "#60a5fa",
    secondaryDark: "#1e3a8a",
    colorDot: "bg-[#34d399]"
  },
  {
    name: "Gold",
    primary: "#fbbf24",
    primaryDark: "#78350f",
    secondary: "#f87171",
    secondaryDark: "#7f1d1d",
    colorDot: "bg-[#fbbf24]"
  },
  {
    name: "Crimson",
    primary: "#f43f5e",
    primaryDark: "#881337",
    secondary: "#c084fc",
    secondaryDark: "#581c87",
    colorDot: "bg-[#f43f5e]"
  }
];

export default function ThemeSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState("Lavender");

  const applyTheme = useCallback((theme) => {
    setActiveTheme(theme.name);
    localStorage.setItem("krishna-portfolio-theme", theme.name);

    document.documentElement.style.setProperty("--primary-color", theme.primary);
    document.documentElement.style.setProperty("--primary-dark-color", theme.primaryDark);
    document.documentElement.style.setProperty("--secondary-color", theme.secondary);
    document.documentElement.style.setProperty("--secondary-dark-color", theme.secondaryDark);
  }, []);

  useEffect(() => {
    const syncSavedTheme = requestAnimationFrame(() => {
      const savedTheme = localStorage.getItem("krishna-portfolio-theme") || "Lavender";
      const selected = themes.find(t => t.name === savedTheme) || themes[0];
      applyTheme(selected);
    });

    return () => cancelAnimationFrame(syncSavedTheme);
  }, [applyTheme]);

  return (
    <div className="relative">
      {/* Selector trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center cursor-pointer shadow-lg hover:border-primary/20 active:scale-95 duration-300"
        aria-label="Change theme colors"
      >
        <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      </button>

      {/* Popover picker */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Click backdrop to close */}
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute right-0 mt-3 p-4 bg-surface-container/95 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl z-50 flex flex-col gap-3 min-w-[190px]"
            >
              <span className="font-ui text-[9px] text-white/40 tracking-widest uppercase">
                Accent Theme
              </span>
              <div className="flex flex-col gap-1.5">
                {themes.map((t) => (
                  <button
                    key={t.name}
                    onClick={() => {
                      applyTheme(t);
                      setIsOpen(false);
                    }}
                    className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-xl transition-all duration-300 cursor-pointer ${
                      activeTheme === t.name
                        ? "bg-white/5 text-primary border border-primary/20"
                        : "hover:bg-white/5 text-on-surface-variant hover:text-on-surface border border-transparent"
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-full ${t.colorDot} shadow-lg`} />
                    <span className="font-sans text-[13px] font-light">{t.name}</span>
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

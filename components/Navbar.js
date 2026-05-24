"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import AudioPlayer from "@/components/AudioPlayer";
import ThemeSwitcher from "@/components/ThemeSwitcher";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hireOpen, setHireOpen] = useState(false);
  const [briefCopied, setBriefCopied] = useState(false);

  const copyProjectBrief = () => {
    if (typeof navigator === "undefined") return;
    navigator.clipboard.writeText("Project inquiry: I want to hire Krishna for thumbnails, Discord bots, or a cinematic portfolio UI.").then(() => {
      setBriefCopied(true);
      setTimeout(() => setBriefCopied(false), 1800);
    });
  };

  const links = [
    { name: "Home", href: "/" },
    { name: "Thumbnails", href: "/thumbnails" },
    { name: "Bots", href: "/bots" },
  ];

  return (
    <>
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-6xl rounded-full border border-white/10 bg-surface-container/20 backdrop-blur-3xl shadow-2xl z-[100] flex justify-between items-center px-5 py-2.5 transition-all duration-300">
        {/* Left Side: Brand Logo */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="font-display text-xl font-bold tracking-tighter text-on-surface hover:text-primary transition-colors duration-300"
          >
            KRISHNA
          </Link>
        </div>

        {/* Center: Persistent Navigation Links */}
        <ul className="hidden md:flex items-center gap-1.5 relative">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href} className="relative">
                <Link
                  href={link.href}
                  className={`relative font-ui text-[12px] uppercase tracking-widest px-4 py-2 rounded-full block transition-colors duration-300 ${
                    isActive ? "text-primary" : "text-on-surface-variant/75 hover:text-on-surface"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeNavBackground"
                      className="absolute inset-0 bg-white/5 rounded-full border border-primary/20 shadow-[0_0_15px_rgba(215,186,255,0.08)] -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {link.name}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right Side: Media, Theme Settings, and Profile Avatar */}
        <div className="flex items-center gap-3">
          
          {/* Audio Equalizer Player */}
          <AudioPlayer />
          
          {/* Palette Accent Switcher */}
          <ThemeSwitcher />

          <button
            onClick={() => setHireOpen(true)}
            className="hidden lg:flex items-center gap-2 font-ui text-[10px] uppercase tracking-widest text-primary border border-primary/30 px-5 py-2.5 rounded-full hover:bg-primary/10 hover:shadow-[0_0_28px_rgba(215,186,255,0.18)] transition-all duration-300 active:scale-95 cursor-pointer"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_12px_var(--primary-color)]" />
            Hire Me
          </button>
          
          <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20 select-none hidden md:block">
            <img
              alt="Krishna Portfolio Avatar"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCEQuC9ynZupEDzmjA9PlblcMfOgnJA9FXHzZgUybvkViqtAs4cm-csnXTQxCZeNlA3YrVCOwp6e14kCtZqRybzkC7rMnPf-lKqPeFiqCR_DInTsIp2_NpS5_HXXSyhEI710lYmpARF2mnhGHbBi3tt7_tQ6dEPi1km4nUlEmdApRM7SBi-lcPkU5AGpya90KnhBqyWYcKffK0hIi8I4ZjaXlDGjvo7ypar4tePTcc15_KOx6yokBxJRARRS78xCImA2abUP1LJXVbI"
            />
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-on-surface-variant hover:text-primary transition-colors p-2"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-20 left-1/2 -translate-x-1/2 w-[92%] glass-panel rounded-2xl z-[90] p-6 flex flex-col gap-4 shadow-2xl md:hidden"
          >
            <ul className="flex flex-col gap-3">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`font-ui text-xs uppercase tracking-widest px-4 py-2.5 rounded-xl block transition-all duration-300 ${
                        isActive
                          ? "text-primary bg-white/5 border border-primary/20"
                          : "text-on-surface-variant hover:text-on-surface hover:bg-white/5"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="h-px bg-white/10 w-full my-2" />
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setHireOpen(true);
              }}
              className="w-full font-ui text-[10px] uppercase tracking-widest text-primary border border-primary/30 py-3 rounded-xl hover:bg-primary/10 transition-all duration-300"
            >
              Hire Me
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {hireOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[240] flex items-start justify-center bg-black/70 px-4 pt-24 backdrop-blur-md"
            onClick={() => setHireOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-primary/20 bg-[#0d0a10]/95 p-6 shadow-[0_30px_120px_rgba(0,0,0,0.85)]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
              <button
                onClick={() => setHireOpen(false)}
                className="absolute right-4 top-4 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-ui text-[9px] uppercase tracking-[0.18em] text-white/60 transition hover:text-primary"
              >
                Close
              </button>

              <p className="font-ui text-[9px] uppercase tracking-[0.32em] text-primary/80">
                Commission Console
              </p>
              <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-white">
                Build something cinematic.
              </h2>
              <p className="mt-3 max-w-md text-sm leading-7 text-on-surface-variant/70">
                Thumbnail design, Discord bot systems, portfolio UI, and motion-heavy web experiences.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {["Thumbnails", "Discord Bots", "Portfolio UI"].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-center font-ui text-[10px] uppercase tracking-[0.18em] text-white/70"
                  >
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={copyProjectBrief}
                  className="flex-1 rounded-full border border-primary/30 bg-primary/10 px-5 py-3 text-center font-ui text-[10px] uppercase tracking-[0.2em] text-primary transition hover:bg-primary/20 hover:shadow-[0_0_32px_rgba(215,186,255,0.18)]"
                >
                  {briefCopied ? "Brief Copied" : "Copy Brief"}
                </button>
                <a
                  href="https://github.com/krishna3251"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-center font-ui text-[10px] uppercase tracking-[0.2em] text-white/70 transition hover:border-primary/30 hover:text-white"
                >
                  GitHub
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

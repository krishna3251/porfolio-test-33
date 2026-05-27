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
      <nav className="fixed top-0 left-0 w-full border-b border-foreground/5 bg-background/80 backdrop-blur-md z-[100] flex justify-between items-center px-6 md:px-12 py-6 transition-all duration-300">
        {/* Left Side: Brand Logo */}
        <div className="flex items-center gap-12">
          <Link
            href="/"
            className="serif-display text-2xl font-bold tracking-tighter text-foreground hover:text-primary transition-colors duration-300"
          >
            Krishna<span className="text-primary italic">.</span>
          </Link>

          {/* Persistent Navigation Links */}
          <ul className="hidden md:flex items-center gap-8 relative">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href} className="relative">
                  <Link
                    href={link.href}
                    className={`relative mono-metadata text-[10px] transition-colors duration-300 ${
                      isActive ? "text-primary" : "text-muted hover:text-foreground"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activeNavUnderline"
                        className="absolute -bottom-1 left-0 w-full h-px bg-primary"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right Side: Media, Theme Settings, and Profile Avatar */}
        <div className="flex items-center gap-6">
          
          <div className="hidden sm:flex items-center gap-6 border-r border-foreground/5 pr-6">
            {/* Audio Equalizer Player */}
            <AudioPlayer />
            
            {/* Palette Accent Switcher */}
            <ThemeSwitcher />
          </div>

          <button
            onClick={() => setHireOpen(true)}
            className="mono-metadata text-[10px] text-foreground border border-foreground/10 px-6 py-2 hover:bg-foreground hover:text-background transition-all duration-300 cursor-pointer"
          >
            Commission
          </button>
          
          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-muted hover:text-foreground transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8h16M4 16h16" />
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

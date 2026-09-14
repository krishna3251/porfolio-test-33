"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import AudioPlayer from "@/components/AudioPlayer";
import ThemeSwitcher from "@/components/ThemeSwitcher";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [copied, setCopied] = useState(false);

  const mainSections = [
    { name: "Home", id: "home" },
    { name: "Work", id: "work" },
    { name: "About", id: "about" },
    { name: "Skills", id: "skills" },
    { name: "Projects", id: "projects" },
    { name: "Music", id: "music" },
    { name: "Contact", id: "contact" },
  ];

  // Observe active section when on home page
  useEffect(() => {
    if (pathname !== "/") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) {
          setActiveSection(visible.target.id);
        }
      },
      { rootMargin: "-30% 0px -50% 0px" }
    );

    mainSections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [pathname]);

  const handleNavClick = (id) => {
    setMobileMenuOpen(false);
    if (pathname === "/") {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const copyBrief = () => {
    if (typeof navigator === "undefined") return;
    navigator.clipboard
      .writeText("Inquiry: Looking to collaborate with Krishna on Python, AI applications, Discord automation, or creative visual pipelines.")
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full border-b border-foreground/5 bg-background/80 backdrop-blur-xl z-[100] transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center py-4 md:py-5">
          {/* Left Side: Brand Logo */}
          <div className="flex items-center gap-8 lg:gap-12">
            <Link
              href="/"
              onClick={() => handleNavClick("home")}
              className="serif-display text-2xl font-bold tracking-tighter text-foreground hover:text-primary transition-colors duration-300"
            >
              Krishna<span className="text-primary italic">.</span>
            </Link>

            {/* Main Section Navigation Links */}
            <ul className="hidden md:flex items-center gap-6 lg:gap-8 relative">
              {mainSections.map((sec) => {
                const isCurrentActive = pathname === "/" && activeSection === sec.id;
                return (
                  <li key={sec.id} className="relative">
                    {pathname === "/" ? (
                      <button
                        onClick={() => handleNavClick(sec.id)}
                        className={`mono-metadata text-[9.5px] transition-colors duration-300 cursor-pointer ${
                          isCurrentActive ? "text-primary font-bold" : "text-muted hover:text-foreground"
                        }`}
                      >
                        {sec.name}
                        {isCurrentActive && (
                          <motion.span
                            layoutId="activeNavUnderline"
                            className="absolute -bottom-1 left-0 w-full h-[1.5px] bg-primary rounded-full shadow-[0_0_8px_rgba(215,186,255,0.6)]"
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          />
                        )}
                      </button>
                    ) : (
                      <Link
                        href={`/#${sec.id}`}
                        className="mono-metadata text-[9.5px] text-muted hover:text-foreground transition-colors duration-300"
                      >
                        {sec.name}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Right Side: Audio, Theme Switcher, and Actions */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Audio Equalizer Controller */}
            <div className="hidden lg:block">
              <AudioPlayer />
            </div>

            {/* Theme Switcher */}
            <ThemeSwitcher />

            {/* Commission / Contact Quick Button */}
            <button
              onClick={copyBrief}
              className="mono-metadata text-[9px] text-foreground border border-foreground/15 px-4 py-2 rounded-full hover:bg-foreground hover:text-background transition-all duration-300 cursor-pointer hidden sm:block font-bold"
            >
              {copied ? "COPIED BRIEF ✓" : "CONTACT"}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-muted hover:text-foreground transition-colors p-2"
              aria-label="Toggle navigation menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-[65px] bg-surface/95 backdrop-blur-2xl border-b border-foreground/10 z-[99] p-6 flex flex-col gap-6 md:hidden shadow-2xl"
          >
            <div className="flex flex-col gap-4">
              {mainSections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => handleNavClick(sec.id)}
                  className={`text-left mono-metadata text-xs font-bold py-2 border-b border-foreground/5 cursor-pointer ${
                    activeSection === sec.id ? "text-primary" : "text-muted hover:text-foreground"
                  }`}
                >
                  {sec.name}
                </button>
              ))}
            </div>

            {/* Mobile Audio Player Display */}
            <div className="pt-2">
              <AudioPlayer />
            </div>

            {/* Deep Exhibition Links */}
            <div className="flex items-center gap-4 pt-4 border-t border-foreground/5">
              <Link
                href="/thumbnails"
                onClick={() => setMobileMenuOpen(false)}
                className="mono-metadata text-[9px] text-muted hover:text-foreground"
              >
                /THUMBNAILS (STANDALONE)
              </Link>
              <Link
                href="/bots"
                onClick={() => setMobileMenuOpen(false)}
                className="mono-metadata text-[9px] text-muted hover:text-foreground"
              >
                /BOTS (STANDALONE)
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

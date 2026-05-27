"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const options = {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
      };
      const formatter = new Intl.DateTimeFormat("en-US", options);
      setTimeStr(formatter.format(new Date()) + " GMT+5:30");
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const lineVariants = {
    hidden: { scaleX: 0 },
    visible: { 
      scaleX: 1, 
      transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  const socialLinks = [
    { name: "Instagram", href: "#" },
    { name: "Twitter", href: "#" },
    { name: "Discord", href: "#" },
  ];

  return (
    <div className="flex-grow flex flex-col w-full relative">
      
      {/* HERO SECTION - Editorial Grid */}
      <section className="min-h-screen flex items-center pt-32 pb-24">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start"
          >
            {/* Left Column: Metadata & Vertical Rule */}
            <div className="hidden lg:col-span-1 lg:flex flex-col items-center pt-4">
              <motion.div 
                variants={lineVariants}
                className="w-px h-64 bg-foreground/10 origin-top mb-8"
              />
              <motion.span 
                variants={itemVariants}
                className="mono-metadata [writing-mode:vertical-lr] rotate-180 text-muted uppercase tracking-[0.25em]"
              >
                Vol. 2026 — Ed. 01
              </motion.span>
            </div>

            {/* Main Center Column: Typography */}
            <div className="col-span-1 lg:col-span-7 flex flex-col pt-0 lg:pt-4">
              <motion.div variants={itemVariants} className="mb-10">
                <h2 className="mono-metadata text-primary font-semibold mb-4 tracking-[0.3em] flex items-center gap-3">
                  <span className="w-2 h-[1px] bg-primary" />
                  Creative Developer & Visual Artist
                </h2>
              </motion.div>

              <motion.h1 
                variants={itemVariants} 
                className="serif-display text-8xl md:text-9xl lg:text-[10rem] leading-[0.85] mb-12 music-glow-text bg-clip-text text-transparent bg-gradient-to-r from-foreground via-primary to-foreground cursor-default select-none"
              >
                Krishna<span className="text-primary italic font-sans">.</span>
              </motion.h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
                <motion.div variants={itemVariants} className="max-w-sm">
                  {/* Glassmorphic Biography Box */}
                  <div className="bg-surface/40 backdrop-blur-md border border-foreground/5 p-8 rounded-3xl relative overflow-hidden group hover:border-primary/20 transition-all duration-500 shadow-2xl mb-8">
                    <div className="absolute top-0 left-0 w-8 h-[1px] bg-primary/45" />
                    <div className="absolute top-0 left-0 w-[1px] h-8 bg-primary/45" />
                    <p className="font-sans text-sm md:text-base text-foreground/80 leading-relaxed">
                      Crafting immersive digital experiences through cinematic visuals, intelligent workflows, and interactive design. A fusion of technical precision and artistic intuition.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 pl-2">
                    <motion.div whileHover={{ y: -2 }}>
                      <Link 
                        href="/thumbnails" 
                        className="font-ui text-[10px] uppercase tracking-[0.3em] text-foreground border-b border-foreground/20 pb-1 hover:border-primary transition-all duration-300 block font-bold"
                      >
                        The Portfolio
                      </Link>
                    </motion.div>
                    <motion.div whileHover={{ y: -2 }}>
                      <Link 
                        href="/bots" 
                        className="font-ui text-[10px] uppercase tracking-[0.3em] text-muted hover:text-foreground transition-all duration-300 block font-bold"
                      >
                        Systems & Bots
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="flex flex-col gap-4 border-l border-foreground/5 pl-6 py-2">
                  <h3 className="serif-display text-4xl text-foreground/30 italic hover:text-primary transition-colors duration-300 cursor-default">Interactive.</h3>
                  <h3 className="serif-display text-4xl text-foreground/55 italic hover:text-primary transition-colors duration-300 cursor-default">Cinematic.</h3>
                  <h3 className="serif-display text-4xl text-foreground/85 italic hover:text-primary transition-colors duration-300 cursor-default">Refined.</h3>
                </motion.div>
              </div>
            </div>

            {/* Right Column: Featured Image with Pulse Aura */}
            <div className="col-span-1 lg:col-span-4 h-full flex flex-col justify-center items-end relative">
              {/* Sound-reactive glow aura */}
              <div className="absolute inset-0 bg-primary/5 blur-[80px] rounded-full scale-75 pointer-events-none music-bloom-glow z-0" />
              
              <motion.div
                variants={itemVariants}
                className="relative w-full aspect-[3/4] overflow-hidden paper-sheet group music-beat-scale music-glow-border rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.5)] border border-foreground/5 z-10"
              >
                <motion.img
                  alt="Krishna Portfolio Feature"
                  className="w-full h-full object-cover transition-all duration-1000 ease-out scale-105 group-hover:scale-100 group-hover:rotate-1"
                  src="/hero_krishna_vertical.jpg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070608]/90 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
                <div className="absolute inset-0 border-[1.5rem] border-surface pointer-events-none transition-all duration-500 group-hover:border-[1rem]"></div>
                
                {/* Visualizer micro-indicator */}
                <div className="absolute top-6 left-6 z-20 flex gap-1 items-center bg-background/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-foreground/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="mono-metadata text-[7px] text-foreground tracking-[0.2em]">LIVE ENGINE ACTIVE</span>
                </div>

                <div className="absolute bottom-10 left-0 right-0 text-center z-10 px-8">
                  <span className="mono-metadata text-white text-[9px] tracking-[0.35em] drop-shadow-md">Exhibition 01 // Core</span>
                </div>
              </motion.div>
              
              <motion.div 
                variants={itemVariants}
                className="mt-8 text-right max-w-[220px]"
              >
                <p className="mono-metadata text-[8px] text-muted leading-relaxed tracking-widest">
                  BASED IN INDIA / OPERATING GLOBALLY / SPECIALIZING IN NEXT-GEN CREATIVE DIRECTION.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto pt-12 pb-12 border-t border-foreground/5 relative z-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-end gap-12">
          <div className="flex flex-col gap-4">
            <span className="mono-metadata text-muted">© 2026 Edition</span>
            <span className="serif-display text-2xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-primary">Krishna Studio</span>
          </div>
          
          <div className="flex gap-12">
            {socialLinks.map((link) => (
              <motion.a 
                key={link.name}
                href={link.href} 
                whileHover={{ y: -2 }}
                className="mono-metadata text-muted hover:text-primary transition-colors duration-300"
              >
                {link.name}
              </motion.a>
            ))}
          </div>

          <div className="text-right">
            <span className="mono-metadata text-muted block mb-2">Local Time</span>
            <span className="font-ui text-xs tabular-nums">{timeStr || "12:00:00 PM GMT+5:30"}</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

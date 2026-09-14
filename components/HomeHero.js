"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HomeHero() {
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const options = {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };
      const formatter = new Intl.DateTimeFormat("en-US", options);
      setTimeStr(formatter.format(new Date()) + " IST (GMT+5:30)");
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
        staggerChildren: 0.12,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const lineVariants = {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center pt-32 pb-20 relative">
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
              Edition 2026 // Core
            </motion.span>
          </div>

          {/* Main Center Column: Identity & Typography */}
          <div className="col-span-1 lg:col-span-7 flex flex-col pt-0 lg:pt-4">
            <motion.div variants={itemVariants} className="mb-8">
              <div className="mono-metadata text-primary font-semibold tracking-[0.28em] flex items-center gap-3">
                <span className="w-2.5 h-[1px] bg-primary" />
                <span>DEVELOPER // AI SYSTEMS // DIGITAL CRAFT</span>
              </div>
            </motion.div>

            {/* Hero Main Name */}
            <motion.h1
              variants={itemVariants}
              className="serif-display text-8xl sm:text-9xl lg:text-[10rem] leading-[0.85] mb-10 music-glow-text bg-clip-text text-transparent bg-gradient-to-r from-foreground via-primary to-foreground cursor-default select-none tracking-tight"
            >
              Krishna<span className="text-primary italic font-sans">.</span>
            </motion.h1>

            {/* Biography & Interactive Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-end">
              <motion.div variants={itemVariants} className="max-w-md">
                {/* Glassmorphic Bio Card */}
                <div className="bg-surface/50 backdrop-blur-xl border border-foreground/10 p-7 rounded-3xl relative overflow-hidden group hover:border-primary/30 transition-all duration-500 shadow-2xl mb-8">
                  <div className="absolute top-0 left-0 w-8 h-[1px] bg-primary/50" />
                  <div className="absolute top-0 left-0 w-[1px] h-8 bg-primary/50" />
                  <p className="font-sans text-sm md:text-[15px] text-foreground/85 leading-relaxed">
                    Building robust Python backend systems, intelligent Discord automation, and AI-powered applications, fused with cinematic digital artwork and generative audio pipelines.
                  </p>
                  <div className="mt-4 pt-3 border-t border-foreground/5 flex items-center justify-between">
                    <span className="mono-metadata text-[7.5px] text-muted">BCA BACKGROUND</span>
                    <span className="mono-metadata text-[7.5px] text-primary font-bold">ALL SYSTEMS ACTIVE</span>
                  </div>
                </div>

                {/* Quick CTA Links */}
                <div className="flex flex-wrap items-center gap-5 pl-1">
                  <button
                    onClick={() => scrollTo("work")}
                    className="mono-metadata text-[9.5px] tracking-[0.25em] font-bold text-background bg-primary hover:bg-primary/90 px-5 py-2.5 rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(215,186,255,0.3)] cursor-pointer flex items-center gap-2"
                  >
                    <span>EXPLORE WORK</span>
                    <span>↓</span>
                  </button>

                  <button
                    onClick={() => scrollTo("projects")}
                    className="mono-metadata text-[9.5px] tracking-[0.25em] font-bold text-foreground border border-foreground/15 hover:border-primary hover:text-primary px-5 py-2.5 rounded-full transition-all duration-300 cursor-pointer"
                  >
                    SYSTEMS & BOTS
                  </button>
                </div>
              </motion.div>

              {/* Three Poetic Postures */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col gap-3 border-l border-foreground/10 pl-6 py-2"
              >
                <span className="mono-metadata text-[7.5px] text-muted tracking-widest block mb-1">
                  CORE ATTRIBUTES
                </span>
                <h3 className="serif-display text-3xl md:text-4xl text-foreground/40 italic hover:text-primary transition-colors duration-300 cursor-default">
                  Architected.
                </h3>
                <h3 className="serif-display text-3xl md:text-4xl text-foreground/65 italic hover:text-primary transition-colors duration-300 cursor-default">
                  Automated.
                </h3>
                <h3 className="serif-display text-3xl md:text-4xl text-foreground/95 italic hover:text-primary transition-colors duration-300 cursor-default">
                  Cinematic.
                </h3>
              </motion.div>
            </div>
          </div>

          {/* Right Column: Featured Image with Pulse Aura */}
          <div className="col-span-1 lg:col-span-4 h-full flex flex-col justify-center items-end relative">
            <div className="absolute inset-0 bg-primary/8 blur-[90px] rounded-full scale-75 pointer-events-none music-bloom-glow z-0" />

            <motion.div
              variants={itemVariants}
              className="relative w-full aspect-[3/4] overflow-hidden paper-sheet group music-beat-scale music-glow-border rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.5)] border border-foreground/10 z-10"
            >
              <img
                alt="Krishna Portfolio Feature Portrait"
                className="w-full h-full object-cover transition-all duration-1000 ease-out scale-105 group-hover:scale-100"
                src="/hero_krishna_vertical.jpg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070608]/90 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
              <div className="absolute inset-0 border-[1.5rem] border-surface pointer-events-none transition-all duration-500 group-hover:border-[1rem]" />

              {/* Status Micro-Indicator */}
              <div className="absolute top-6 left-6 z-20 flex gap-2 items-center bg-background/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-foreground/10">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="mono-metadata text-[7.5px] text-foreground font-bold tracking-[0.2em]">
                  LIVE ENGINE ACTIVE
                </span>
              </div>

              <div className="absolute bottom-8 left-0 right-0 text-center z-10 px-8">
                <span className="mono-metadata text-white text-[9px] tracking-[0.35em] drop-shadow-md">
                  PORTFOLIO REBUILD // 2026
                </span>
              </div>
            </motion.div>

            {/* Geographical & Status Footer Note */}
            <motion.div variants={itemVariants} className="mt-6 text-right max-w-xs">
              <p className="mono-metadata text-[8px] text-muted leading-relaxed tracking-widest">
                BASED IN INDIA // OPERATING GLOBALLY // SPECIALIZING IN PYTHON, AI AUTOMATION & DIGITAL WORKFLOWS.
              </p>
              <p className="font-mono text-[9px] text-primary/80 mt-1">
                {timeStr || "LOCAL TIME IST"}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

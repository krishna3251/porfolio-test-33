"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 90, damping: 20 },
    },
  };

  const socialLinks = [
    { name: "Instagram", href: "#" },
    { name: "Twitter", href: "#" },
    { name: "Discord", href: "#" },
  ];

  return (
    <div className="flex-grow flex flex-col w-full relative z-10">
      
      {/* 1. HERO SECTION */}
      <section className="min-h-screen flex items-center pt-24 pb-20">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Side: Typography and Call to Action */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="col-span-1 lg:col-span-6 flex flex-col justify-center items-start z-10"
          >
            <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
              <span className="w-8 h-[1px] bg-primary/40"></span>
              <h2 className="font-ui text-[10px] uppercase tracking-[0.3em] text-primary/95 font-semibold">
                Creative Developer & Visual Artist
              </h2>
            </motion.div>

            <motion.h1 
              variants={itemVariants} 
              className="font-display text-7xl md:text-8xl lg:text-[7rem] tracking-tighter leading-none text-on-surface mb-6 font-bold"
            >
              KRISHNA
            </motion.h1>

            <motion.div variants={itemVariants} className="flex flex-col gap-1.5 mb-8 pl-1">
              <h3 className="font-display text-3xl md:text-4xl lg:text-5xl text-on-surface-variant/90 italic tracking-tight leading-snug">
                Creative Developer,
              </h3>
              <h3 className="font-display text-3xl md:text-4xl lg:text-5xl text-on-surface-variant/90 italic tracking-tight leading-snug pl-6 md:pl-12 flex items-center gap-3">
                <span className="w-6 md:w-10 h-[1px] bg-on-surface-variant/30 hidden md:block"></span>
                Thumbnail Designer
              </h3>
              <h3 className="font-display text-3xl md:text-4xl lg:text-5xl text-on-surface-variant/90 italic tracking-tight leading-snug pl-12 md:pl-24 flex items-center gap-3">
                <span className="w-6 md:w-10 h-[1px] bg-on-surface-variant/30 hidden md:block"></span>
                &amp; Visual Designer.
              </h3>
            </motion.div>

            <motion.div 
              variants={itemVariants} 
              className="max-w-md border-l border-primary/30 pl-6 mb-10"
            >
              <p className="font-sans text-sm md:text-[15px] text-on-surface-variant/80 leading-[1.8] tracking-wide font-light">
                Crafting immersive digital experiences through cinematic visuals, intelligent workflows, and interactive design.
              </p>
              <p className="font-ui text-[9px] uppercase tracking-[0.25em] text-on-surface-variant/40 mt-5">
                © 2026 KRISHNA. DESIGNING DIGITAL EXPERIENCE.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-5">
              <Link 
                href="/thumbnails" 
                className="px-8 py-3.5 rounded-full font-ui text-xs uppercase tracking-[0.2em] text-white border border-primary/40 bg-primary/10 hover:bg-primary/20 hover:border-primary transition-all duration-500 flex items-center gap-2 group cursor-pointer shadow-[0_0_20px_rgba(215,186,255,0.1)] hover:shadow-[0_0_35px_rgba(215,186,255,0.2)]"
              >
                View Thumbnails
                <svg 
                  className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <Link 
                href="/bots" 
                className="px-8 py-3.5 rounded-full font-ui text-xs uppercase tracking-[0.2em] text-on-surface-variant hover:text-white hover:bg-white/5 border border-white/5 hover:border-white/10 transition-all duration-500 cursor-pointer"
              >
                Explore Bots
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Side: Cinematic Image Panel */}
          <div className="col-span-1 lg:col-span-6 h-[60vh] lg:h-[75vh] relative flex justify-center lg:justify-end items-center mt-6 lg:mt-0 z-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, cubicBezier: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-[450px] aspect-[2/3] rounded-[2.5rem] overflow-hidden group bg-surface-container/10 border border-primary/10 shadow-[0_0_50px_rgba(41,0,85,0.25)]"
            >
              <motion.img
                alt="Krishna Art"
                className="w-full h-full object-cover object-center opacity-85 group-hover:opacity-95 transition-opacity duration-1000 ease-out"
                src="/hero_krishna_vertical.jpg"
                animate={{
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  duration: 25,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#151218]/90 via-transparent to-transparent opacity-90 pointer-events-none"></div>
              <div className="absolute inset-0 bg-primary/5 mix-blend-overlay pointer-events-none"></div>

              <div className="absolute top-6 left-6 font-ui text-[10px] uppercase tracking-[0.3em] text-white/50 flex items-center gap-3">
                SYS.REC // 001
                <span className="w-8 h-[1px] bg-white/20"></span>
              </div>
              
              <div className="absolute bottom-10 right-6 flex items-center gap-3 bg-black/35 backdrop-blur-md px-4 py-2 rounded-full border border-primary/20">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#d7baff]"></span>
                <span className="font-ui text-[9px] uppercase tracking-[0.2em] text-white/95">Active Core</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. FOOTER */}
      <footer className="mt-auto pt-16 pb-12 border-t border-white/5 relative z-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6 text-on-surface-variant/40">
          <div className="font-ui text-[10px] font-medium uppercase tracking-[0.2em]">
            © 2026 KRISHNA. DESIGNING DIGITAL EXPERIENCE.
          </div>
          <div className="flex gap-8 font-ui text-[10px] uppercase tracking-[0.2em]">
            {socialLinks.map((link) => (
              <a 
                key={link.name}
                href={link.href} 
                className="hover:text-on-surface transition-colors duration-300"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}

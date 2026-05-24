"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function IntroOverlay() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const showOverlay = requestAnimationFrame(() => {
      const hasEntered = sessionStorage.getItem("krishna-portfolio-entered");
      if (!hasEntered) {
        setIsVisible(true);
      }
    });

    return () => cancelAnimationFrame(showOverlay);
  }, []);

  const handleEnter = () => {
    sessionStorage.setItem("krishna-portfolio-entered", "true");
    setIsVisible(false);

    // Fire event to trigger audio playback inside the persistent AudioPlayer
    window.dispatchEvent(new CustomEvent("play-portfolio-audio"));
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            y: -80,
            filter: "blur(12px)",
            transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } 
          }}
          className="fixed inset-0 bg-[#0a0a0c] z-[300] flex flex-col justify-center items-center select-none"
        >
          {/* Background Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

          {/* Radial Light Aura */}
          <div className="absolute w-[70vw] h-[70vw] rounded-full bg-primary/5 blur-[130px] pointer-events-none" />

          {/* Greeting Box */}
          <div className="relative z-10 flex flex-col items-center text-center px-6">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="font-ui text-[9px] tracking-[0.4em] text-primary/70 uppercase mb-4 block font-bold"
            >
              System Online // Initialization
            </motion.span>
            
            <motion.h1
              initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.4, duration: 1 }}
              className="font-display text-5xl md:text-7xl font-bold tracking-tighter text-white mb-4"
            >
              KRISHNA
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="font-sans text-xs md:text-[13px] text-on-surface-variant/60 max-w-sm leading-relaxed mb-12 font-light"
            >
              Immersive cinematic interface combining creative developer layouts with high-fidelity visual arts.
            </motion.p>

            {/* Enter Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              onClick={handleEnter}
              className="group relative px-10 py-4 rounded-full border border-primary/30 bg-primary/10 hover:bg-primary/20 hover:border-primary font-ui text-[11px] uppercase tracking-[0.25em] text-white transition-all duration-500 shadow-[0_0_30px_rgba(215,186,255,0.08)] hover:shadow-[0_0_50px_rgba(215,186,255,0.25)] cursor-pointer"
            >
              Enter Experience
            </motion.button>
          </div>
          
          <div className="absolute bottom-10 font-ui text-[8px] tracking-[0.3em] text-white/20 uppercase font-medium">
            Studio Krishna // 2026 Production
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

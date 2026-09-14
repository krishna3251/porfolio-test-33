"use client";

import { motion } from "framer-motion";

export default function AboutSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <div className="w-full relative">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center"
      >
        {/* Left Column: Portrait & Technical Frame */}
        <motion.div variants={itemVariants} className="lg:col-span-5 relative">
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden paper-sheet border border-foreground/5 shadow-2xl group">
            <img
              src="/hero_krishna.jpg"
              alt="Krishna Developer Portrait"
              className="w-full h-full object-cover grayscale-[0.15] group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a080e]/80 via-transparent to-transparent opacity-70" />
            <div className="absolute inset-0 border-[1.2rem] border-surface pointer-events-none transition-all duration-500 group-hover:border-[0.8rem]" />

            <div className="absolute bottom-6 left-6 z-10">
              <span className="mono-metadata text-[7px] text-white/90 bg-primary/15 border border-primary/30 px-3 py-1 rounded-full backdrop-blur-md font-bold tracking-widest">
                DEVELOPER // CREATIVE DIRECTION
              </span>
            </div>
          </div>

          {/* Micro HUD status indicator */}
          <div className="mt-6 flex items-center justify-between px-2">
            <span className="mono-metadata text-[8px] text-muted">ACADEMIC // BCA CORE</span>
            <span className="mono-metadata text-[8px] text-primary font-bold">STATUS: CODING & BUILDING</span>
          </div>
        </motion.div>

        {/* Right Column: Editorial Narrative Copy */}
        <motion.div variants={itemVariants} className="lg:col-span-7 flex flex-col justify-center">
          <div className="mono-metadata text-primary mb-4 tracking-[0.25em] font-bold flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-primary" />
            02 // BACKGROUND & IDENTITY
          </div>

          <h3 className="serif-display text-4xl md:text-5xl lg:text-6xl text-foreground font-semibold mb-8 leading-tight">
            Engineering logic meets <span className="italic text-primary">expressive craft.</span>
          </h3>

          <div className="space-y-6 text-foreground/80 font-sans text-sm md:text-base leading-relaxed max-w-2xl">
            <p>
              I am a BCA developer grounded in hands-on software building, AI-powered applications, and backend systems. Rather than treating code and aesthetics as separate worlds, I build systems where reliable architecture fuels immersive, cinematic digital experiences.
            </p>

            <p>
              My technical work centers on Python development, custom Discord bots, automated server infrastructure, and RESTful API integrations. From architecting automated guild deployments with instant role-sync in <span className="text-primary font-semibold">Rukia</span> to engineering proactive auto-moderation and sentiment analysis in <span className="text-primary font-semibold">Lxeus</span>, I enjoy solving problems that demand both structural discipline and rapid responsiveness.
            </p>

            <p>
              Alongside core software engineering, I actively work across AI-assisted development, high-fidelity digital artwork pipelines (combining Stable Diffusion ControlNet with multi-layer composite editing), and AI music production workflows. Every piece on this site reflects that balance: built from real code, shaped with personal curiosity.
            </p>
          </div>

          {/* Highlights Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mt-10 pt-8 border-t border-foreground/5">
            <div>
              <span className="mono-metadata text-[8px] text-muted block mb-1">FOCUS AREA</span>
              <span className="font-ui text-sm font-bold text-foreground">Python & AI Apps</span>
            </div>
            <div>
              <span className="mono-metadata text-[8px] text-muted block mb-1">AUTOMATION</span>
              <span className="font-ui text-sm font-bold text-foreground">Discord Infrastructure</span>
            </div>
            <div>
              <span className="mono-metadata text-[8px] text-muted block mb-1">CREATIVE WORKFLOWS</span>
              <span className="font-ui text-sm font-bold text-foreground">Digital Art & Music</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

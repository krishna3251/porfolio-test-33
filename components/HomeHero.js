"use client";

import { motion } from "framer-motion";

export default function HomeHero() {
  const scroll = (id) => document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });
  return (
    <section id="home" className="min-h-screen pt-28 pb-14 px-5 sm:px-8 lg:px-12">
      <div className="max-w-[1440px] mx-auto min-h-[calc(100vh-9rem)] grid lg:grid-cols-12 gap-8 items-end">
        <div className="lg:col-span-7 pb-8">
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.7}}>
            <p className="mono-metadata text-primary mb-6">Developer / Visual Designer / India</p>
            <h1 className="serif-display text-[clamp(4.5rem,12vw,11rem)] leading-[.78] tracking-[-.055em]">
              Krishna<span className="text-primary">.</span>
            </h1>
            <p className="mt-10 max-w-xl text-lg md:text-xl leading-relaxed text-muted">
              I build software systems, gaming visuals, and digital experiences where technical structure meets visual craft.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={()=>scroll("work")} className="bg-foreground text-background px-6 py-3 text-xs uppercase tracking-[.16em] font-semibold hover:bg-primary transition-colors">Selected work ↓</button>
              <button onClick={()=>scroll("projects")} className="border border-white/20 px-6 py-3 text-xs uppercase tracking-[.16em] hover:border-primary hover:text-primary transition-colors">Software →</button>
            </div>
          </motion.div>
        </div>
        <motion.div initial={{opacity:0,x:30}} animate={{opacity:1,x:0}} transition={{duration:.9,delay:.15}} className="lg:col-span-5">
          <div className="relative aspect-[16/10] overflow-hidden border border-white/10">
            <img src="/images/genshin skirk.png" alt="Selected gaming thumbnail by Krishna" className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.03]" />
          </div>
          <div className="flex justify-between mt-3 text-[10px] uppercase tracking-[.16em] text-muted">
            <span>Selected visual work / 01</span><span>2026</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

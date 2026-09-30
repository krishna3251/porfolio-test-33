"use client";

import { motion } from "framer-motion";

const tags = ["Python","AI applications","Discord systems","Web","Gaming visuals"];

export default function IntroSection(){
  return <section id="intro" className="relative py-16 md:py-24">
    <div className="site-grid absolute inset-0 opacity-35 pointer-events-none"/>
    <div className="relative grid lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-3">
        <p className="mono-metadata text-primary">01 / INTRODUCTION</p>
        <div className="mt-6 h-px w-24 bg-gradient-to-r from-primary to-hot"/>
        <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">Code, composition and motion treated as one creative practice.</p>
      </div>
      <div className="lg:col-span-9">
        <motion.h2 initial={{opacity:0,y:28}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:"-10% 0px"}} transition={{duration:.8,ease:[.16,1,.3,1]}} className="serif-display text-[clamp(3rem,7vw,7.5rem)] leading-[.86] text-balance">
          I build useful things,
          <span className="block text-primary italic">then make them feel alive.</span>
        </motion.h2>
        <div className="mt-12 grid md:grid-cols-12 gap-8 items-end">
          <motion.p initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.7,delay:.08}} className="md:col-span-7 text-lg md:text-xl leading-relaxed text-foreground/85">
            I work across software and visual design: Python systems, AI applications, Discord automation, web experiments, gaming thumbnails and digital artwork. The common thread is simple: take a rough idea, give it structure, and ship it with enough personality that somebody remembers it.
          </motion.p>
          <div className="md:col-span-5 glass-panel p-5 md:p-6">
            <p className="mono-metadata text-muted">CURRENT FIELD</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag,i)=><span key={tag} className="px-3 py-2 border border-white/10 bg-white/[.025] text-[11px] uppercase tracking-[.12em]"><span className={i%2===0?"text-primary":"text-hot"}>+</span> {tag}</span>)}
            </div>
          </div>
        </div>
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 border-t border-white/10">
          {[["BASE","INDIA"],["FOCUS","PYTHON / AI"],["VISUALS","GAMING ART"],["MODE","BUILD + EXPERIMENT"]].map(([a,b])=><div key={a} className="py-5 pr-4 border-r last:border-r-0 border-white/10"><p className="mono-metadata text-muted">{a}</p><p className="mt-2 text-sm md:text-base font-medium">{b}</p></div>)}
        </div>
      </div>
    </div>
  </section>;
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function WorkArchive({ groups=[] }) {
  const [selected,setSelected] = useState(null);
  const items = groups.flatMap(g => g.thumbnails).slice(0, 24);
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 border-b border-white/10 pb-6 mb-10">
        <div>
          <p className="mono-metadata text-primary mb-3">01 / Visual work</p>
          <h2 className="serif-display text-5xl md:text-7xl">Selected thumbnails</h2>
        </div>
        <p className="max-w-sm text-sm text-muted leading-relaxed">Gaming thumbnails and visual studies across Genshin Impact, HSR, Wuthering Waves, Valorant and more.</p>
      </div>

      <div className="grid grid-cols-12 gap-3 md:gap-5">
        {items.map((thumb,i) => {
          const featured = i % 7 === 0 || i === 6 || i === 13 || i === 20;
          return (
            <motion.button key={thumb.id} onClick={()=>setSelected(thumb)}
              initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:"0px 0px -60px"}} transition={{duration:.5,delay:(i%4)*.04}}
              className={`group text-left relative overflow-hidden ${featured ? "col-span-12 md:col-span-8" : "col-span-6 md:col-span-4"}`}
            >
              <div className="aspect-[16/9] overflow-hidden bg-[#171715] border border-white/10">
                <img src={thumb.src} alt={thumb.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.035]" />
              </div>
              <div className="pt-3 pb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium group-hover:text-primary transition-colors">{thumb.title}</p>
                  <p className="mono-metadata text-[8px] text-muted mt-1">{thumb.label} / {thumb.subtitle}</p>
                </div>
                <span className="text-muted group-hover:text-primary transition-colors">↗</span>
              </div>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setSelected(null)} className="fixed inset-0 z-[100] bg-black/90 p-4 md:p-10 flex items-center justify-center">
            <motion.div initial={{y:20,scale:.98}} animate={{y:0,scale:1}} exit={{y:20}} onClick={e=>e.stopPropagation()} className="w-full max-w-6xl max-h-[92vh] overflow-auto bg-[#141412] border border-white/10">
              <div className="p-3 md:p-5 flex justify-end"><button onClick={()=>setSelected(null)} className="text-xs uppercase tracking-[.16em] text-muted hover:text-foreground">Close ×</button></div>
              <img src={selected.src} alt={selected.title} className="w-full max-h-[70vh] object-contain bg-black" />
              <div className="p-6 md:p-8 grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2"><p className="mono-metadata text-primary mb-2">{selected.label}</p><h3 className="serif-display text-3xl md:text-5xl">{selected.title}</h3><p className="text-muted mt-3 max-w-xl">{selected.subtitle}</p></div>
                <div className="md:text-right"><p className="mono-metadata text-muted">Visual study</p><p className="mt-2 text-sm">Gaming thumbnail design / 2026</p></div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

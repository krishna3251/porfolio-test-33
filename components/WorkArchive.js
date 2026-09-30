"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

const categoryOrder=["GENSHIN","HSR","WUWA","VALORANT","PUBG","NTE","FORZA","OTHER"];

export default function WorkArchive({groups=[]}){
  const [activeFilter,setActiveFilter]=useState("ALL");
  const [selected,setSelected]=useState(null);
  const items=useMemo(()=>groups.flatMap((group)=>group.thumbnails||[]),[groups]);

  const categories=useMemo(()=>{
    const counts=new Map();
    items.forEach((item)=>counts.set(item.label,(counts.get(item.label)||0)+1));
    return categoryOrder.filter((label)=>counts.has(label)).map((label)=>({label,count:counts.get(label)}));
  },[items]);

  const filteredItems=activeFilter==="ALL"?items:items.filter((item)=>item.label===activeFilter);
  const featured=filteredItems[0];
  const gridItems=featured?filteredItems.slice(1):filteredItems;

  return <div className="relative">
    <div className="mb-8 grid lg:grid-cols-12 gap-8 items-end">
      <div className="lg:col-span-8">
        <p className="mono-metadata text-primary">02 / SELECTED VISUAL WORK</p>
        <h2 className="brutal-title text-[clamp(3.8rem,9vw,9rem)] mt-5 leading-[.78]">IMAGE<span className="block text-primary">ARCHIVE_</span></h2>
      </div>
      <div className="lg:col-span-4">
        <div className="flex items-center gap-3 mb-3">
          <span className="w-2 h-2 rounded-full bg-hot animate-pulse"/>
          <span className="mono-metadata text-hot text-[8px]">56 VISUALS / LIVE ARCHIVE</span>
        </div>
        <p className="text-sm leading-relaxed text-muted max-w-md">Gaming thumbnails, character studies and digital experiments. The archive is organized by the game name in each filename, so every image has a clear home instead of becoming tiny anonymous wallpaper.</p>
      </div>
    </div>

    <div className="glass-panel p-3 md:p-4 mb-8">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <FilterButton active={activeFilter==="ALL"} onClick={()=>setActiveFilter("ALL")} label="ALL WORK" count={items.length}/>
          {categories.map(({label,count})=><FilterButton key={label} active={activeFilter===label} onClick={()=>setActiveFilter(label)} label={label} count={count}/>)}
        </div>
        <div className="mono-metadata text-muted text-[8px] whitespace-nowrap">
          {filteredItems.length} PIECES / {activeFilter==="ALL"?"FULL ARCHIVE":activeFilter}
        </div>
      </div>
    </div>

    {featured&&<motion.button
      type="button"
      onClick={()=>setSelected(featured)}
      initial={{opacity:0,y:24}}
      whileInView={{opacity:1,y:0}}
      viewport={{once:true}}
      whileHover={{y:-5}}
      transition={{duration:.7,ease:[.16,1,.3,1]}}
      className="archive-feature w-full text-left grid lg:grid-cols-12 group mb-7"
    >
      <div className="lg:col-span-8 relative min-h-[260px] md:min-h-[390px] lg:min-h-[500px] overflow-hidden">
        <img src={featured.src} alt={featured.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.045]"/>
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070d] via-[#05070d]/15 to-transparent"/>
        <div className="absolute top-5 left-5 flex flex-wrap items-center gap-2 font-mono text-[9px] uppercase tracking-[.16em]">
          <span className="px-2.5 py-1.5 bg-primary text-white font-bold">{featured.label}</span>
          <span className="px-2.5 py-1.5 bg-black/35 border border-white/15 backdrop-blur-md">FEATURED FRAME</span>
        </div>
        <div className="absolute bottom-5 left-5 right-5">
          <p className="mono-metadata text-white/65">{featured.filename}</p>
          <h3 className="font-mono font-black text-3xl md:text-5xl uppercase tracking-[-.06em] mt-2">{featured.title}</h3>
        </div>
      </div>
      <div className="lg:col-span-4 p-6 md:p-8 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/10 bg-white/[.015]">
        <div>
          <p className="mono-metadata text-hot">FEATURED / 01</p>
          <h4 className="mt-5 serif-display text-3xl md:text-4xl leading-none">The work should have room to breathe.</h4>
          <p className="mt-5 text-sm md:text-base leading-relaxed text-muted">This first frame is intentionally oversized. Below it, the archive switches to a clean gallery so each thumbnail stays readable on desktop and mobile.</p>
        </div>
        <div className="mt-8 flex items-end justify-between gap-6">
          <div>
            <p className="mono-metadata text-muted">GAME</p>
            <p className="mt-1 font-mono text-sm text-primary">{featured.label}</p>
          </div>
          <span className="text-hot text-3xl group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">↗</span>
        </div>
      </div>
    </motion.button>}

    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
      {gridItems.map((item,index)=><motion.button
        key={item.id}
        type="button"
        onClick={()=>setSelected(item)}
        initial={{opacity:0,y:20}}
        whileInView={{opacity:1,y:0}}
        viewport={{once:true,margin:"0px 0px -50px"}}
        transition={{duration:.5,delay:(index%3)*.05,ease:[.16,1,.3,1]}}
        whileHover={{y:-7}}
        className="glass-card text-left group"
      >
        <div className="archive-media">
          <img src={item.src} alt={item.title} loading="lazy" className="w-full h-full object-cover"/>
          <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-transparent to-transparent opacity-90"/>
          <div className="absolute top-3 left-3 right-3 z-[3] flex justify-between items-center">
            <span className="px-2 py-1 bg-black/45 border border-white/15 backdrop-blur-md text-white font-mono text-[8px] font-bold">{item.label}</span>
            <span className="font-mono text-[8px] text-white/60">#{String(index+2).padStart(2,"0")}</span>
          </div>
          <div className="absolute left-4 right-4 bottom-3 z-[3]">
            <p className="font-mono text-[8px] uppercase tracking-[.14em] text-white/60 truncate">{item.filename}</p>
          </div>
        </div>
        <div className="p-4 md:p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="font-mono font-bold text-sm uppercase tracking-[-.02em] truncate">{item.title}</h3>
              <p className="mono-metadata text-[8px] text-muted mt-2 line-clamp-2">{item.subtitle}</p>
            </div>
            <span className="text-hot text-lg shrink-0 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">↗</span>
          </div>
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between font-mono text-[8px] uppercase tracking-[.12em]">
            <span className="text-primary">{item.label}</span>
            <span className="text-muted">OPEN FRAME</span>
          </div>
        </div>
      </motion.button>)}
    </div>

    {filteredItems.length===0&&<div className="glass-panel py-20 text-center"><p className="mono-metadata text-hot">NO MATCHES</p><p className="mt-3 text-muted">That filter has no images yet.</p></div>}

    <AnimatePresence>
      {selected&&<motion.div
        initial={{opacity:0}}
        animate={{opacity:1}}
        exit={{opacity:0}}
        className="fixed inset-0 z-[200] bg-[#03050a]/90 backdrop-blur-xl p-3 md:p-8 flex items-center justify-center"
        onClick={()=>setSelected(null)}
      >
        <motion.div
          initial={{opacity:0,y:18,scale:.97}}
          animate={{opacity:1,y:0,scale:1}}
          exit={{opacity:0,y:12,scale:.98}}
          transition={{duration:.35,ease:[.16,1,.3,1]}}
          onClick={(event)=>event.stopPropagation()}
          className="w-full max-w-6xl max-h-[94vh] overflow-auto glass-panel"
        >
          <div className="p-3 md:p-4 border-b border-white/10 flex items-center justify-between gap-4">
            <span className="mono-metadata text-primary">ARCHIVE / {selected.label}</span>
            <button type="button" onClick={()=>setSelected(null)} className="font-mono text-[10px] uppercase tracking-[.16em] text-muted hover:text-hot transition-colors">CLOSE ×</button>
          </div>
          <div className="bg-black/30 p-2 md:p-4">
            <img src={selected.src} alt={selected.title} className="w-full max-h-[66vh] object-contain"/>
          </div>
          <div className="grid md:grid-cols-12 gap-6 p-6 md:p-8">
            <div className="md:col-span-8">
              <p className="mono-metadata text-hot">{selected.label}</p>
              <h3 className="font-mono font-black text-3xl md:text-5xl uppercase tracking-[-.06em] mt-2">{selected.title}</h3>
              <p className="text-muted mt-4 max-w-2xl">{selected.subtitle}</p>
            </div>
            <div className="md:col-span-4 md:text-right font-mono text-[9px] leading-6 text-muted break-words">
              FILE<br/><span className="text-foreground">{selected.filename}</span><br/><br/>
              CATEGORY<br/><span className="text-primary">{selected.label}</span><br/><br/>
              TYPE<br/><span className="text-foreground">DIGITAL VISUAL / GAMING WORK</span>
            </div>
          </div>
        </motion.div>
      </motion.div>}
    </AnimatePresence>
  </div>;
}

function FilterButton({active,onClick,label,count}){
  return <button type="button" onClick={onClick} className={"px-3 py-2.5 border text-[9px] font-mono uppercase tracking-[.12em] transition-all "+(active?"border-primary bg-primary text-white":"border-white/10 bg-white/[.02] text-muted hover:border-white/25 hover:text-foreground hover:bg-white/[.05]")}>
    {label} <span className={active?"text-white/70":"text-muted/70"}>{count}</span>
  </button>;
}

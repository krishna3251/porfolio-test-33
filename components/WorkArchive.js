"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo,useState } from "react";
const categoryOrder=["GENSHIN","HSR","WUWA","VALORANT","PUBG","NTE","FORZA","OTHER"];

export default function WorkArchive({groups=[]}){
 const [active,setActive]=useState("ALL"); const [selected,setSelected]=useState(null);
 const items=useMemo(()=>groups.flatMap(g=>g.thumbnails||[]),[groups]);
 const categories=useMemo(()=>{const m=new Map();items.forEach(i=>m.set(i.label,(m.get(i.label)||0)+1));return categoryOrder.filter(x=>m.has(x)).map(label=>({label,count:m.get(label)}));},[items]);
 const filtered=active==="ALL"?items:items.filter(i=>i.label===active);
 return <div>
  <div className="archive-tabs">
   <button className={active==="ALL"?"active":""} onClick={()=>setActive("ALL")}>ALL <b>{items.length}</b></button>
   {categories.map(c=><button key={c.label} className={active===c.label?"active":""} onClick={()=>setActive(c.label)}>{c.label} <b>{c.count}</b></button>)}
  </div>
  <div className="archive-status"><span>{filtered.length} WORKS</span><span>{active==="ALL"?"ALL GAMES":active}</span></div>
  <div className="archive-grid">
   {filtered.map((item,index)=><motion.button key={item.id} type="button" onClick={()=>setSelected(item)} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:"0px 0px -40px"}} transition={{duration:.5,delay:(index%4)*.04,ease:[.16,1,.3,1]}} whileHover={{y:-8}} className="archive-card text-left group">
    <div className="archive-image"><img src={item.src} alt={item.title} loading="lazy"/><div className="archive-shade"/><span className="archive-badge">{item.label}</span><span className="archive-number">{String(index+1).padStart(2,"0")}</span><span className="archive-open">OPEN ↗</span></div>
    <div className="archive-info"><div><h3>{item.title}</h3><p>{item.subtitle}</p></div><span className="archive-arrow">↗</span></div>
   </motion.button>)}
  </div>
  <AnimatePresence>{selected&&<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="archive-modal" onClick={()=>setSelected(null)}><motion.div initial={{scale:.96,y:15}} animate={{scale:1,y:0}} exit={{scale:.98}} className="archive-modal-card" onClick={e=>e.stopPropagation()}><button className="archive-close" onClick={()=>setSelected(null)}>CLOSE ×</button><div className="archive-modal-image"><img src={selected.src} alt={selected.title}/></div><div className="archive-modal-copy"><div><p className="mono-metadata text-hot">{selected.label}</p><h2>{selected.title}</h2><p>{selected.subtitle}</p></div><p className="mono-metadata text-black/35 break-all">{selected.filename}</p></div></motion.div></motion.div>}</AnimatePresence>
 </div>;
}
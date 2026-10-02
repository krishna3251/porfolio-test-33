"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useMemo,useRef,useState } from "react";
import TerminalBar from "@/components/TerminalBar";

const order=["GENSHIN","HSR","WUWA","VALORANT","PUBG","NTE","FORZA","OTHER"];

const accentMap={
  GENSHIN:"#ff7a45",
  HSR:"#c8b3ff",
  WUWA:"#71e4ff",
  VALORANT:"#ff4655",
  PUBG:"#e4b45c",
  NTE:"#ff73cf",
  FORZA:"#65d8ff",
  OTHER:"#b9b3a9"
};

function ThumbnailCard({item,index,active,total}){
  const ref=useRef(null);
  const [hovered,setHovered]=useState(false);
  const mx=useMotionValue(0), my=useMotionValue(0);
  const rx=useSpring(useTransform(my,[-80,80],[3,-3]),{stiffness:170,damping:22});
  const ry=useSpring(useTransform(mx,[-80,80],[-3,3]),{stiffness:170,damping:22});
  const {scrollYProgress}=require("framer-motion").useScroll({target:ref,offset:["start end","end start"]});
  const imageY=useTransform(scrollYProgress,[0,1],["-4%","4%"]);
  const accent=accentMap[item.label]||accentMap.OTHER;

  const move=(e)=>{
    if(!window.matchMedia("(pointer:fine)").matches)return;
    const r=ref.current?.getBoundingClientRect();
    if(!r)return;
    mx.set(e.clientX-(r.left+r.width/2));
    my.set(e.clientY-(r.top+r.height/2));
  };

  return <motion.article
    ref={ref}
    className="thumb-card premium-thumb-card"
    style={{"--card-accent":accent}}
    initial={{opacity:0,y:54,scale:.97,rotateX:3}}
    whileInView={{opacity:1,y:0,scale:1,rotateX:0}}
    viewport={{once:true,amount:.16,margin:"0px 0px -8% 0px"}}
    transition={{duration:.65,delay:(index%3)*.055,ease:[.16,1,.3,1]}}
    onMouseEnter={()=>setHovered(true)}
    onMouseLeave={()=>{setHovered(false);mx.set(0);my.set(0)}}
    onMouseMove={move}
  >
    <Link
      href={"/thumbnails/view?file="+encodeURIComponent(item.filename)+"&category="+encodeURIComponent(active)}
      className="thumb-link"
      aria-label={"View "+item.title}
      data-cursor="VIEW"
    >
      <motion.div className="thumb-media" style={{rotateX:rx,rotateY:ry,transformStyle:"preserve-3d"}}>
        <motion.div className="thumb-parallax-image" style={{y:imageY}}>
          <Image src={item.src} alt={item.title} fill loading="lazy" quality={72} sizes="(max-width:760px) 100vw,(max-width:1100px) 50vw,33vw" className="thumb-image"/>
        </motion.div>
        <div className="thumb-vignette" aria-hidden="true"/>
        <div className="thumb-color-wash" aria-hidden="true"/>
        <div className="thumb-scanline" aria-hidden="true"/>
        <span className="thumb-label">{item.label}</span>
        <span className="thumb-index">{String(index+1).padStart(2,"0")} / {String(total).padStart(2,"0")}</span>
        <span className="thumb-open">OPEN <b>↗</b></span>
        <span className="thumb-corner top" aria-hidden="true"/>
        <span className="thumb-corner bottom" aria-hidden="true"/>
        <AnimatePresence>
          {hovered&&<motion.span className="thumb-hover-line" initial={{scaleX:0}} animate={{scaleX:1}} exit={{scaleX:0}} transition={{duration:.3}}/>}
        </AnimatePresence>
      </motion.div>
      <div className="thumb-meta">
        <div><h3>{item.title}</h3><p>{item.subtitle}</p></div>
        <span className="thumb-meta-arrow">↗</span>
      </div>
      <div className="thumb-meta-line"><span>{String(index+1).padStart(2,"0")}</span><span>{item.label}</span><i style={{background:accent}}/></div>
    </Link>
  </motion.article>;
}

export default function WorkArchive({groups=[]}){
  const [active,setActive]=useState("ALL");
  const items=useMemo(()=>groups.flatMap(g=>g.thumbnails||[]),[groups]);
  const cats=useMemo(()=>{
    const counts={};
    items.forEach(item=>{counts[item.label]=(counts[item.label]||0)+1});
    return order.filter(label=>counts[label]).map(label=>({label,count:counts[label]}));
  },[items]);
  const filtered=active==="ALL"?items:items.filter(item=>item.label===active);
  const featured=filtered[0];

  return <div className="archive-shell">
    <TerminalBar command="gallery --recent --sort=visual" meta="ARCHIVE / ONLINE" />
    <div className="archive-live-panel">
      <div><span className="archive-live-dot"/><span>ARCHIVE ONLINE</span></div>
      <strong>{String(filtered.length).padStart(2,"0")}</strong>
      <small>VISUAL WORKS INDEXED</small>
    </div>

    {active==="ALL"&&featured&&<motion.div className="archive-feature-card" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.55,ease:[.16,1,.3,1]}}>
      <div className="archive-feature-media"><Image src={featured.src} alt="" fill sizes="(max-width:900px) 100vw, 70vw" quality={72} className="archive-feature-image"/><div className="archive-feature-overlay"><span>{featured.label} / FEATURED</span><b>01 / {String(items.length).padStart(2,"0")}</b></div></div>
      <div className="archive-feature-copy"><span>SELECTED FRAME</span><h2>{featured.title}</h2><p>{featured.subtitle}</p><Link href={"/thumbnails/view?file="+encodeURIComponent(featured.filename)+"&category=ALL"} data-cursor="FEATURED">OPEN FEATURE ↗</Link></div>
    </motion.div>}

    <div className="archive-command"><div className="archive-command-left"><span className="archive-live"><i/> LIVE ARCHIVE</span><span>INDEX / {String(filtered.length).padStart(2,"0")}</span></div><span>FILTER / SELECT</span></div>

    <div className="archive-filter">
      <div className="archive-filter-track">
        <button onClick={()=>setActive("ALL")} className={active==="ALL"?"active":""} data-cursor="ALL WORK">ALL <b>{items.length}</b></button>
        {cats.map(cat=><button key={cat.label} onClick={()=>setActive(cat.label)} className={active===cat.label?"active":""} data-cursor={cat.label}>{cat.label} <b>{cat.count}</b></button>)}
      </div>
      <span>{String(filtered.length).padStart(2,"0")} WORKS / 2026</span>
    </div>

    <div className="archive-feature-row"><span>SCROLL / REVEAL</span><span>HOVER / PARALLAX</span><span>CLICK / OPEN</span></div>

    <motion.div layout className="thumb-grid">
      <AnimatePresence mode="popLayout">
        {filtered.map((item,index)=><ThumbnailCard key={item.id} item={item} index={index} active={active} total={filtered.length}/>)}
      </AnimatePresence>
    </motion.div>

    <div className="archive-endcap">
      <span>END OF CURRENT INDEX</span>
      <strong>{String(filtered.length).padStart(2,"0")} / {String(items.length).padStart(2,"0")}</strong>
      <p>Every frame is available in the fullscreen viewer.</p>
    </div>
  </div>;
}
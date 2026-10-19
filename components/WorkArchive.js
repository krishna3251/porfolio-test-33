"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { useMemo,useRef,useState } from "react";
import TerminalBar from "@/components/TerminalBar";
import WobbleImage from "@/components/WobbleImage";
import useSiteMedia from "@/hooks/useSiteMedia";

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
  const reduce = useReducedMotion();
  const settings=item.mediaSettings||{};
  const ref=useRef(null);
  const mx=useMotionValue(0), my=useMotionValue(0);
  const rx=useSpring(useTransform(my,[-80,80],[3,-3]),{stiffness:170,damping:22});
  const ry=useSpring(useTransform(mx,[-80,80],[-3,3]),{stiffness:170,damping:22});
  const accent=accentMap[item.label]||accentMap.OTHER;

  const move=(e)=>{
    if(reduce||!window.matchMedia("(hover:hover) and (pointer:fine)").matches)return;
    const r=ref.current?.getBoundingClientRect();
    if(!r)return;
    mx.set(e.clientX-(r.left+r.width/2));
    my.set(e.clientY-(r.top+r.height/2));
  };

  return <motion.article
    ref={ref}
    className="thumb-card premium-thumb-card"
    style={{"--card-accent":accent}}
    initial={false}
    onMouseLeave={()=>{mx.set(0);my.set(0)}}
    onMouseMove={move}
  >
    <Link
      href={"/thumbnails/view?file="+encodeURIComponent(item.filename)+"&category="+encodeURIComponent(active)}
      className="thumb-link"
      aria-label={"View "+item.title}
      data-cursor="VIEW"
    >
      <motion.div className="thumb-media" style={{rotateX:reduce?0:rx,rotateY:reduce?0:ry,transformStyle:"preserve-3d"}}>
        <div className="thumb-parallax-image">
          <WobbleImage className="absolute inset-0">
            <Image src={item.src} alt={item.title} fill loading="lazy" quality={72} sizes="(max-width:760px) 100vw,(max-width:1100px) 50vw,33vw" className="thumb-image" style={{objectFit:settings.fit==="contain"?"contain":"cover",objectPosition:(settings.positionX??50)+"% "+(settings.positionY??50)+"%",transform:"scale("+Math.min(2.5,Math.max(.5,Number(settings.scale)||1))+")",opacity:settings.visible===false?0:(settings.opacity??1)}}/>
          </WobbleImage>
        </div>
        <div className="thumb-vignette" aria-hidden="true"/>
        <div className="thumb-color-wash" aria-hidden="true"/>
        <div className="thumb-scanline" aria-hidden="true"/>
        <span className="thumb-label">{item.label}</span>
        <span className="thumb-index">{String(index+1).padStart(2,"0")} / {String(total).padStart(2,"0")}</span>
        <span className="thumb-open">OPEN <b>↗</b></span>
        <span className="thumb-corner top" aria-hidden="true"/>
        <span className="thumb-corner bottom" aria-hidden="true"/>
        <span className="thumb-hover-line" aria-hidden="true"/>
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
  const {media}=useSiteMedia();
  const items=useMemo(()=>groups.flatMap(g=>g.thumbnails||[]).map((item)=>{const settings=media.overrides?.[item.filename]||{};return {...item,src:settings.src||item.src,mediaSettings:settings};}),[groups,media.overrides]);
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

    {active==="ALL"&&featured&&<motion.div className="archive-feature-card" initial={false} animate={{opacity:1,y:0}} transition={{duration:.55,ease:[.16,1,.3,1]}}>
      <div className="archive-feature-media"><WobbleImage className="absolute inset-0"><Image src={featured.src} alt="" fill sizes="(max-width:900px) 100vw, 70vw" quality={72} className="archive-feature-image" style={{objectFit:featured.mediaSettings?.fit==="contain"?"contain":"cover",objectPosition:(featured.mediaSettings?.positionX??50)+"% "+(featured.mediaSettings?.positionY??50)+"%",transform:"scale("+Math.min(2.5,Math.max(.5,Number(featured.mediaSettings?.scale)||1))+")",opacity:featured.mediaSettings?.visible===false?0:(featured.mediaSettings?.opacity??1)}}/></WobbleImage><div className="archive-feature-overlay"><span>{featured.label} / FEATURED</span><b>01 / {String(items.length).padStart(2,"0")}</b></div></div>
      <div className="archive-feature-copy"><span>SELECTED FRAME</span><h2>{featured.title}</h2><p>{featured.subtitle}</p><Link href={"/thumbnails/view?file="+encodeURIComponent(featured.filename)+"&category=ALL"} data-cursor="FEATURED">OPEN FEATURE ↗</Link></div>
    </motion.div>}

    <div className="archive-command"><div className="archive-command-left"><span className="archive-live"><i/> LIVE ARCHIVE</span><span>INDEX / {String(filtered.length).padStart(2,"0")}</span></div><span>FILTER / SELECT</span></div>

    <div className="archive-filter">
      <div className="archive-filter-track" role="group" aria-label="Filter thumbnails by game">
        <button onClick={()=>setActive("ALL")} aria-pressed={active==="ALL"} className={active==="ALL"?"active":""} data-cursor="ALL WORK">ALL <b>{items.length}</b></button>
        {cats.map(cat=><button key={cat.label} onClick={()=>setActive(cat.label)} aria-pressed={active===cat.label} className={active===cat.label?"active":""} data-cursor={cat.label}>{cat.label} <b>{cat.count}</b></button>)}
      </div>
      <span role="status" aria-live="polite">{String(filtered.length).padStart(2,"0")} WORKS / 2026</span>
    </div>

    <div className="archive-feature-row"><span>BROWSE / FILTER</span><span>SELECT / EXPLORE</span><span>CLICK / OPEN</span></div>

    <div className="thumb-grid">
        {filtered.map((item,index)=><ThumbnailCard key={item.id} item={item} index={index} active={active} total={filtered.length}/>)}
    </div>

    <div className="archive-endcap">
      <span>END OF CURRENT INDEX</span>
      <strong>{String(filtered.length).padStart(2,"0")} / {String(items.length).padStart(2,"0")}</strong>
      <p>Every frame is available in the fullscreen viewer.</p>
    </div>
  </div>;
}
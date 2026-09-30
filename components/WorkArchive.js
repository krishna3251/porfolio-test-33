"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useMemo,useState } from "react";

const order=["GENSHIN","HSR","WUWA","VALORANT","PUBG","NTE","FORZA","OTHER"];

export default function WorkArchive({groups=[]}){
  const [active,setActive]=useState("ALL");
  const items=useMemo(()=>groups.flatMap(g=>g.thumbnails||[]),[groups]);
  const cats=useMemo(()=>{
    const counts={};
    items.forEach(item=>{counts[item.label]=(counts[item.label]||0)+1});
    return order.filter(label=>counts[label]).map(label=>({label,count:counts[label]}));
  },[items]);
  const filtered=active==="ALL"?items:items.filter(item=>item.label===active);

  return <div className="archive-shell">
    <div className="archive-filter">
      <div className="archive-filter-track">
        <button onClick={()=>setActive("ALL")} className={active==="ALL"?"active":""}>ALL <b>{items.length}</b></button>
        {cats.map(cat=><button key={cat.label} onClick={()=>setActive(cat.label)} className={active===cat.label?"active":""}>{cat.label} <b>{cat.count}</b></button>)}
      </div>
      <span>{filtered.length} WORKS</span>
    </div>

    <div className="thumb-grid">
      {filtered.map((item,index)=><motion.article
        key={item.id}
        className="thumb-card"
        initial={{opacity:0,y:18}}
        whileInView={{opacity:1,y:0}}
        viewport={{once:true,margin:"-30px"}}
        transition={{duration:.45,delay:(index%3)*.035,ease:[.16,1,.3,1]}}
      >
        <Link
          href={`/thumbnails/view?file=${encodeURIComponent(item.filename)}&category=${encodeURIComponent(active)}`}
          className="thumb-link"
          aria-label={`View ${item.title}`}
        >
          <div className="thumb-media">
            <Image
              src={item.src}
              alt={item.title}
              fill
              loading="lazy"
              quality={72}
              sizes="(max-width:760px) 100vw,(max-width:1100px) 50vw,33vw"
              className="thumb-image"
            />
            <span className="thumb-label">{item.label}</span>
            <span className="thumb-index">{String(index+1).padStart(2,"0")}</span>
            <span className="thumb-open">OPEN ↗</span>
          </div>
          <div className="thumb-meta">
            <div><h3>{item.title}</h3><p>{item.subtitle}</p></div>
            <span>↗</span>
          </div>
        </Link>
      </motion.article>)}
    </div>
  </div>;
}
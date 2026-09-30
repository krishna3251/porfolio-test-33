"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ThumbnailViewer({item,previous,next,first,last,index,total}){
  const router=useRouter();

  useEffect(()=>{
    const onKey=(event)=>{
      if(event.metaKey||event.ctrlKey||event.altKey) return;
      const key=event.key.toLowerCase();
      if(key==="escape"||key==="backspace"){event.preventDefault();router.push("/thumbnails");return;}
      if(event.key==="ArrowLeft"||key==="a"||key==="p"){event.preventDefault();router.push(previous);return;}
      if(event.key==="ArrowRight"||key==="d"||key==="n"){event.preventDefault();router.push(next);return;}
      if(event.key==="home"){event.preventDefault();router.push(first);return;}
      if(event.key==="end"){event.preventDefault();router.push(last);}
    };
    window.addEventListener("keydown",onKey);
    return()=>window.removeEventListener("keydown",onKey);
  },[first,last,next,previous,router]);

  return <main className="thumbnail-viewer-page">
    <header className="thumbnail-viewer-nav">
      <Link href="/thumbnails" className="thumbnail-viewer-brand">KRISHNA<span>.</span></Link>
      <div className="thumbnail-viewer-counter"><b>{String(index+1).padStart(2,"0")}</b><i>/</i><span>{String(total).padStart(2,"0")}</span><em>{item.label}</em></div>
      <Link href="/thumbnails" className="thumbnail-viewer-back">BACK ×</Link>
    </header>

    <section className="thumbnail-viewer-stage" aria-label={item.title}>
      <div className="viewer-side-tag">VISUAL / {item.label}</div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.img
          key={item.id}
          src={item.src}
          alt={item.title}
          className="thumbnail-viewer-image"
          draggable="false"
          initial={{opacity:0,scale:.965}}
          animate={{opacity:1,scale:1}}
          exit={{opacity:0,scale:1.015}}
          transition={{duration:.38,ease:[.16,1,.3,1]}}
        />
      </AnimatePresence>
      <span className="thumbnail-viewer-help">← A / P &nbsp; PREVIOUS &nbsp;&nbsp; D / N → &nbsp; NEXT &nbsp;&nbsp; ESC &nbsp; BACK</span>
    </section>

    <footer className="thumbnail-viewer-footer">
      <div>
        <span>{item.label}</span>
        <h1>{item.title}</h1>
        <p>{item.subtitle}</p>
      </div>
      <div className="thumbnail-viewer-actions"><Link href={previous}>←</Link><Link href={next}>→</Link></div>
    </footer>
  </main>;
}
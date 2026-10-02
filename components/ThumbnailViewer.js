"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function ThumbnailViewer({item,previous,next,first,last,index,total}){
  const router=useRouter();
  const previousIndexRef=useRef(index);
  const direction=index>=previousIndexRef.current?1:-1;

  useEffect(()=>{
    previousIndexRef.current=index;
  },[index]);

  useEffect(()=>{
    const body=document.body;
    const html=document.documentElement;
    const previousBodyOverflow=body.style.overflow;
    const previousBodyTouchAction=body.style.touchAction;
    const previousHtmlOverflow=html.style.overflow;

    body.style.overflow="hidden";
    body.style.touchAction="none";
    html.style.overflow="hidden";

    return()=>{
      body.style.overflow=previousBodyOverflow;
      body.style.touchAction=previousBodyTouchAction;
      html.style.overflow=previousHtmlOverflow;
    };
  },[]);

  useEffect(()=>{
    const onKey=(event)=>{
      if(event.metaKey||event.ctrlKey||event.altKey) return;
      const key=event.key.toLowerCase();
      if(key==="escape"||key==="backspace"){
        event.preventDefault();
        router.push("/thumbnails");
        return;
      }
      if(event.key==="ArrowLeft"||key==="a"||key==="p"){
        event.preventDefault();
        router.push(previous);
        return;
      }
      if(event.key==="ArrowRight"||key==="d"||key==="n"){
        event.preventDefault();
        router.push(next);
        return;
      }
      if(key==="home"){
        event.preventDefault();
        router.push(first);
        return;
      }
      if(key==="end"){
        event.preventDefault();
        router.push(last);
      }
    };

    window.addEventListener("keydown",onKey);
    return()=>window.removeEventListener("keydown",onKey);
  },[first,last,next,previous,router]);

  useEffect(()=>{
    [previous,next].forEach((url)=>{
      const image=new Image();
      image.decoding="async";
      const filename=new URL(url,window.location.origin).searchParams.get("file");
      if(filename) image.src=`/images/${encodeURIComponent(filename)}`;
    });
  },[previous,next]);

  return <main className="thumbnail-viewer-page" aria-label="Thumbnail viewer">
    <header className="thumbnail-viewer-nav">
      <Link href="/thumbnails" className="thumbnail-viewer-brand">KRISHNA<span>.</span></Link>
      <div className="thumbnail-viewer-counter" aria-live="polite">
        <b>{String(index+1).padStart(2,"0")}</b><i>/</i><span>{String(total).padStart(2,"0")}</span><em>{item.label}</em>
      </div>
      <Link href="/thumbnails" className="thumbnail-viewer-back">BACK ×</Link>
    </header>

    <section className="thumbnail-viewer-stage" aria-label={item.title}>
      <div className="viewer-side-tag">VISUAL / {item.label}</div>
      <AnimatePresence mode="wait" initial={false} custom={direction}>
        <motion.img
          key={item.id}
          src={item.src}
          alt={item.title}
          className="thumbnail-viewer-image"
          draggable="false"
          custom={direction}
          variants={{
            enter:(dir)=>({opacity:0,x:dir*42,scale:.985}),
            center:{opacity:1,x:0,scale:1},
            exit:(dir)=>({opacity:0,x:dir*-42,scale:.985})
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{duration:.32,ease:[.16,1,.3,1]}}
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
      <div className="thumbnail-viewer-actions" aria-label="Thumbnail navigation">
        <Link href={previous} aria-label="Previous thumbnail">←</Link>
        <Link href={next} aria-label="Next thumbnail">→</Link>
      </div>
    </footer>
  </main>;
}

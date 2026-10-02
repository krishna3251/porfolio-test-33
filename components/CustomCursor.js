"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

export default function CustomCursor(){
  const pathname=usePathname();
  const dotRef=useRef(null);
  const ringRef=useRef(null);
  const labelRef=useRef(null);

  useEffect(()=>{
    if(pathname.startsWith("/thumbnails/view")) return;
    const fine=window.matchMedia("(pointer:fine)").matches;
    if(!fine) return;

    const dot=dotRef.current;
    const ring=ringRef.current;
    const label=labelRef.current;
    if(!dot||!ring||!label) return;

    const body=document.body;
    body.classList.add("custom-cursor-active");

    gsap.set([dot,ring,label],{autoAlpha:0,xPercent:-50,yPercent:-50});
    const xDot=gsap.quickTo(dot,"x",{duration:.055,ease:"power3.out"});
    const yDot=gsap.quickTo(dot,"y",{duration:.055,ease:"power3.out"});
    const xRing=gsap.quickTo(ring,"x",{duration:.16,ease:"power3.out"});
    const yRing=gsap.quickTo(ring,"y",{duration:.16,ease:"power3.out"});
    const xLabel=gsap.quickTo(label,"x",{duration:.2,ease:"power3.out"});
    const yLabel=gsap.quickTo(label,"y",{duration:.2,ease:"power3.out"});

    const move=(event)=>{
      xDot(event.clientX);yDot(event.clientY);
      xRing(event.clientX);yRing(event.clientY);
      xLabel(event.clientX+34);yLabel(event.clientY+28);
      gsap.to([dot,ring],{autoAlpha:1,duration:.14,overwrite:true});
    };

    const getTarget=(event)=>event.target instanceof Element?event.target.closest("a,button,[data-cursor]"):null;

    const over=(event)=>{
      const target=getTarget(event);
      if(!target) return;
      const text=target.getAttribute("data-cursor")||target.getAttribute("aria-label")||target.textContent?.trim().split("\n")[0]||"OPEN";
      label.textContent=text.slice(0,18).toUpperCase();
      gsap.to(ring,{scale:1.65,borderColor:"#ff6a2a",backgroundColor:"rgba(255,106,42,.06)",duration:.2,overwrite:true});
      gsap.to(dot,{scale:.45,backgroundColor:"#ff6a2a",duration:.2,overwrite:true});
      gsap.to(label,{autoAlpha:1,scale:1,duration:.18,overwrite:true});
    };

    const out=(event)=>{
      const from=getTarget(event);
      const to=event.relatedTarget instanceof Element?event.relatedTarget.closest("a,button,[data-cursor]"):null;
      if(!from||from===to) return;
      gsap.to(ring,{scale:1,borderColor:"rgba(247,244,237,.25)",backgroundColor:"transparent",duration:.2,overwrite:true});
      gsap.to(dot,{scale:1,backgroundColor:"#f7f4ed",duration:.2,overwrite:true});
      gsap.to(label,{autoAlpha:0,scale:.9,duration:.14,overwrite:true});
    };

    window.addEventListener("pointermove",move,{passive:true});
    document.addEventListener("pointerover",over,{passive:true});
    document.addEventListener("pointerout",out,{passive:true});

    return()=>{
      body.classList.remove("custom-cursor-active");
      window.removeEventListener("pointermove",move);
      document.removeEventListener("pointerover",over);
      document.removeEventListener("pointerout",out);
      gsap.killTweensOf([dot,ring,label]);
    };
  },[pathname]);

  if(pathname.startsWith("/thumbnails/view")) return null;

  return <>
    <div ref={dotRef} className="cursor-dot fixed top-0 left-0 w-2 h-2 rounded-full bg-[#f7f4ed] pointer-events-none z-[99999]" aria-hidden="true"/>
    <div ref={ringRef} className="cursor-ring fixed top-0 left-0 w-9 h-9 rounded-full border border-white/25 pointer-events-none z-[99998]" aria-hidden="true"/>
    <div ref={labelRef} className="cursor-label fixed top-0 left-0 px-2 py-1 border border-white/10 bg-[#111318]/90 text-[#f7f4ed] pointer-events-none z-[99997]" aria-hidden="true"/>
  </>;
}
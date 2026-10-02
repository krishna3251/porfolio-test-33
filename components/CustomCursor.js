"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function CustomCursor(){
  const pathname=usePathname();
  const dotRef=useRef(null);
  const ringRef=useRef(null);
  const labelRef=useRef(null);
  const glowRef=useRef(null);
  const activeRef=useRef(false);

  useEffect(()=>{
    if(pathname.startsWith("/thumbnails/view")) return;
    if(!window.matchMedia("(pointer:fine)").matches) return;

    const dot=dotRef.current, ring=ringRef.current, label=labelRef.current, glow=glowRef.current;
    if(!dot||!ring||!label||!glow) return;

    const target={x:window.innerWidth/2,y:window.innerHeight/2};
    const ringPos={x:target.x,y:target.y};
    const glowPos={x:target.x,y:target.y};
    const labelPos={x:target.x+36,y:target.y+28};
    let raf=0;

    const render=()=>{
      ringPos.x+=(target.x-ringPos.x)*.2;
      ringPos.y+=(target.y-ringPos.y)*.2;
      glowPos.x+=(target.x-glowPos.x)*.09;
      glowPos.y+=(target.y-glowPos.y)*.09;
      labelPos.x+=(target.x+36-labelPos.x)*.17;
      labelPos.y+=(target.y+28-labelPos.y)*.17;

      dot.style.transform=`translate3d(${target.x}px,${target.y}px,0) translate(-50%,-50%)`;
      ring.style.transform=`translate3d(${ringPos.x}px,${ringPos.y}px,0) translate(-50%,-50%)`;
      glow.style.transform=`translate3d(${glowPos.x}px,${glowPos.y}px,0) translate(-50%,-50%)`;
      label.style.transform=`translate3d(${labelPos.x}px,${labelPos.y}px,0) translate(-50%,-50%) scale(${activeRef.current?1:.92})`;

      raf=requestAnimationFrame(render);
    };

    const show=()=>{
      if(activeRef.current)return;
      activeRef.current=true;
      document.body.classList.add("custom-cursor-active");
      dot.style.opacity="1"; ring.style.opacity="1"; glow.style.opacity="1";
    };
    const hide=()=>{
      activeRef.current=false;
      document.body.classList.remove("custom-cursor-active");
      dot.style.opacity="0"; ring.style.opacity="0"; glow.style.opacity="0"; label.style.opacity="0";
    };
    const move=(event)=>{
      target.x=event.clientX; target.y=event.clientY; show();
    };
    const targetFor=(event)=>event.target instanceof Element?event.target.closest("a,button,[data-cursor]"):null;
    const over=(event)=>{
      const el=targetFor(event); if(!el)return;
      const text=(el.getAttribute("data-cursor")||el.getAttribute("aria-label")||el.textContent||"OPEN").replace(/\s+/g," ").trim().slice(0,18).toUpperCase();
      label.textContent=text; label.style.opacity="1";
      ring.classList.add("is-hover"); dot.classList.add("is-hover"); glow.classList.add("is-hover");
    };
    const out=(event)=>{
      const from=targetFor(event);
      const to=event.relatedTarget instanceof Element?event.relatedTarget.closest("a,button,[data-cursor]"):null;
      if(!from||from===to)return;
      ring.classList.remove("is-hover"); dot.classList.remove("is-hover"); glow.classList.remove("is-hover"); label.style.opacity="0";
    };
    const down=()=>{ring.classList.add("is-pressed");setTimeout(()=>ring.classList.remove("is-pressed"),170)};
    const leave=()=>hide();

    window.addEventListener("pointermove",move,{passive:true});
    window.addEventListener("pointerleave",leave,{passive:true});
    document.addEventListener("pointerover",over,{passive:true});
    document.addEventListener("pointerout",out,{passive:true});
    document.addEventListener("pointerdown",down,{passive:true});
    raf=requestAnimationFrame(render);

    return()=>{cancelAnimationFrame(raf);document.body.classList.remove("custom-cursor-active");window.removeEventListener("pointermove",move);window.removeEventListener("pointerleave",leave);document.removeEventListener("pointerover",over);document.removeEventListener("pointerout",out);document.removeEventListener("pointerdown",down)};
  },[pathname]);

  if(pathname.startsWith("/thumbnails/view")) return null;
  return <>
    <div ref={glowRef} className="cursor-glow" aria-hidden="true"/>
    <div ref={dotRef} className="cursor-dot" aria-hidden="true"/>
    <div ref={ringRef} className="cursor-ring" aria-hidden="true"/>
    <div ref={labelRef} className="cursor-label" aria-hidden="true"/>
  </>;
}
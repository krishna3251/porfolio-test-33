"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useReducedMotion } from "framer-motion";

// An intentional, finite interaction. No perpetual render loop or scroll capture.
export default function WorksWheel({items=[],label="Works '26",action="View",className=""}) {
  const reduce = useReducedMotion();
  const root = useRef(null);
  const stageRef = useRef(null);
  const drag = useRef(null);
  const suppressClick = useRef(false);
  const id = useId();
  const [active,setActive] = useState(0);
  const [width,setWidth] = useState(900);
  const last = Math.max(0,items.length-1);
  const go = useCallback(index => setActive(Math.min(last,Math.max(0,index))),[last]);

  useEffect(() => {
    const observer = new ResizeObserver(entries => setWidth(entries[0].contentRect.width));
    if (stageRef.current) observer.observe(stageRef.current);
    return () => observer.disconnect();
  },[]);

  useLayoutEffect(() => {
    if (!root.current) return;
    const cards = root.current.querySelectorAll('.works-wheel-card');
    const tweens = [...cards].map((card,index) => {
        const distance = index-active;
        card.style.zIndex=String(20-Math.abs(distance));
        return gsap.to(card, {
          xPercent:-50, yPercent:-50, x:distance*8, y:distance*(width<640?110:150),
          z:-Math.abs(distance)*100, rotationX:-distance*6,
          scale:index===active?1:Math.max(.65,1-Math.abs(distance)*.1),
          opacity:Math.abs(distance)>2?0:Math.max(.15,1-Math.abs(distance)*.3),
          duration:reduce?0:.6, ease:"power3.out", overwrite:true,
        });
    });
    return () => tweens.forEach(tween => tween.kill());
  },[active,width,items.length,reduce]);

  if (!items.length) return null;
  return <section ref={root} className={`works-wheel-section ${className}`} aria-label={label}>
    <div className="works-wheel-stage" ref={stageRef} tabIndex={0} role="region" aria-label="Interactive work index. Use arrow keys to select a work."
      style={{perspective:1200}}
      onWheel={event => {
        if (!event.shiftKey) return;
        const delta=event.deltaY||event.deltaX;
        if (Math.abs(delta)>15) go(active+(delta>0?1:-1));
      }}
      onKeyDown={event => {
        if (["ArrowRight","ArrowDown"].includes(event.key)) { event.preventDefault(); go(active+1); }
        if (["ArrowLeft","ArrowUp"].includes(event.key)) { event.preventDefault(); go(active-1); }
        if (event.key==="Home") { event.preventDefault(); go(0); }
        if (event.key==="End") { event.preventDefault(); go(last); }
      }}
      onPointerDown={event => {
        if(event.button!==0)return;
        drag.current={x:event.clientX,y:event.clientY}; suppressClick.current=false;
      }}
      onPointerUp={event => {
        if (!drag.current) return;
        const dx=event.clientX-drag.current.x,dy=event.clientY-drag.current.y;
        drag.current=null;
        // Horizontal gestures select work. Vertical gestures belong to the page.
        if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)) {
          suppressClick.current=true; go(active+(dx<0?1:-1));
        }
      }}
      onPointerCancel={()=>{drag.current=null;}}
      onClickCapture={event=>{if(suppressClick.current){event.preventDefault();event.stopPropagation();suppressClick.current=false;}}}>
      <div className="works-wheel-ring">
        {items.map((item,index)=><Link key={item.title} href={item.href||"/thumbnails"} id={`${id}-${index}`}
          tabIndex={index===active?0:-1} aria-hidden={index!==active} className={`works-wheel-card ${index===active?"is-active":""}`}
          style={{width:Math.min(width<640?width*.68:width*.36,420),height:Math.min(width<640?width*.68:width*.36,420)*.5625,pointerEvents:index===active?"auto":"none"}}>
          <span className="works-wheel-face">
            <img src={item.image} alt={item.title} draggable="false" loading="lazy" decoding="async"
              style={{objectFit:item.fit||"cover",objectPosition:`${item.positionX??50}% ${item.positionY??50}%`,transform:`scale(${Math.min(2.5,Math.max(.5,Number(item.scale)||1))})`,opacity:item.opacity??1}}/>
            <span className="works-wheel-overlay"><small>{String(index+1).padStart(2,"0")} / SELECTED</small><strong>{item.title}</strong><em>{action} ↗</em></span>
          </span>
        </Link>)}
      </div>
    </div>
    <div className="works-wheel-label">{label}</div>
    <div className="works-wheel-active" aria-live="polite">{items[active]?.title}</div>
    <ol className="works-wheel-index">{items.map((item,index)=><li key={item.title}><button type="button" onClick={()=>go(index)} aria-current={index===active?"true":undefined} className={index===active?"active":""}><span>{String(index+1).padStart(2,"0")}</span>{item.title}</button></li>)}</ol>
    <div className="work-wheel-controls"><button type="button" aria-label="Previous work" disabled={active===0} onClick={()=>go(active-1)}>←</button><button type="button" aria-label="Next work" disabled={active===last} onClick={()=>go(active+1)}>→</button></div>
  </section>;
}

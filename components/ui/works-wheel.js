"use client";

import * as React from "react";
import Link from "next/link";

const clamp=(v,lo,hi)=>Math.min(hi,Math.max(lo,v));
const rad=d=>d*Math.PI/180;
const bowAt=(deg,bow)=>-bow*(1-Math.cos(rad(deg)));

export default function WorksWheel({items=[],label="Works '26",action="View",className=""}){
  const stageRef=React.useRef(null), wheelRef=React.useRef(null), cards=React.useRef([]);
  const turn=React.useRef(0), target=React.useRef(0), drag=React.useRef(null), settle=React.useRef(null);
  const [active,setActive]=React.useState(0), [stage,setStage]=React.useState({w:0,h:0});
  const labelRef=React.useRef(null), activeRef=React.useRef(null);
  const count=items.length, last=Math.max(count-1,0);

  React.useEffect(()=>{
    const el=stageRef.current;if(!el)return;
    const read=()=>setStage({w:el.clientWidth,h:el.clientHeight});
    read();const ro=new ResizeObserver(read);ro.observe(el);return()=>ro.disconnect();
  },[]);

  const metrics=React.useMemo(()=>{
    const h=stage.h,w=stage.w,cardH=Math.min(h*.38,Math.max(180,w*.31)),cardW=Math.min(cardH*1.45,w*.42);
    return {cardW,cardH,ringR:cardH*1.14,drumR:cardH*2.22,bow:cardH*1.82,depth:cardH*2.7};
  },[stage]);

  const go=React.useCallback(n=>{target.current=clamp(n,0,last+1)},[last]);

  React.useEffect(()=>{
    if(!stage.h||!count)return;
    let frame;
    const draw=()=>{
      const gap=target.current-turn.current;
      turn.current+=Math.abs(gap)<.0005?gap:gap*.12;
      const t=turn.current,m=clamp(t,0,1),pos=Math.max(0,t-1);
      if(wheelRef.current)wheelRef.current.style.transform=\`translateZ(\${-m*metrics.drumR}px)\`;
      cards.current.forEach((card,i)=>{
        if(!card)return;
        const d=i-pos,drumDeg=d*40,ring=1-m,x=m*bowAt(drumDeg,metrics.bow);
        card.style.transform=\`translateX(\${x}px) rotateZ(\${d*(360/count)*ring}deg) translateY(\${-ring*metrics.ringR}px) rotateX(\${m*drumDeg}deg) translateZ(\${m*metrics.drumR}px)\`;
        card.style.opacity=m>.5&&Math.abs(d)>1.6?"0":"1";
        card.style.zIndex=String(Math.round(100-Math.abs(d)*2));
        const face=card.firstElementChild;if(face)face.style.transform=\`scale(\${.25+.75*m})\`;
      });
      if(labelRef.current)labelRef.current.style.opacity=String(1-m);
      if(activeRef.current)activeRef.current.style.opacity=String(m);
      const near=clamp(Math.round(pos),0,last);setActive(v=>v===near?v:near);frame=requestAnimationFrame(draw);
    };
    frame=requestAnimationFrame(draw);return()=>cancelAnimationFrame(frame);
  },[metrics,stage.h,count,last]);

  React.useEffect(()=>()=>window.clearTimeout(settle.current),[]);

  const onWheel=e=>{
    const next=target.current+e.deltaY/900;
    if(next>0&&next<last+1)e.preventDefault();
    go(next);window.clearTimeout(settle.current);
    settle.current=window.setTimeout(()=>go(Math.round(target.current)),140);
  };

  if(!items.length)return null;

  return <section className={\`works-wheel-section \${className}\`} aria-label={label}>
    <div className="works-wheel-stage" ref={stageRef} tabIndex={0} role="listbox" aria-activedescendant={\`works-wheel-\${active}\`} style={{perspective:metrics.depth}}
      onWheel={onWheel}
      onPointerDown={e=>{drag.current=e.clientY;e.currentTarget.setPointerCapture(e.pointerId)}}
      onPointerMove={e=>{if(drag.current===null)return;go(target.current+(drag.current-e.clientY)/420);drag.current=e.clientY}}
      onPointerUp={()=>{drag.current=null;if(target.current>1)go(Math.round(target.current))}}
      onKeyDown={e=>{if(e.key==="ArrowDown"){go(Math.round(target.current)+1);e.preventDefault()}else if(e.key==="ArrowUp"){go(Math.round(target.current)-1);e.preventDefault()}}}>
      <div className="works-wheel-ring" ref={wheelRef}>
        {items.map((item,i)=>{
          const Card=item.href?Link:"div";
          return <Card key={item.title} id={\`works-wheel-\${i}\`} role="option" aria-selected={i===active} href={item.href} ref={node=>cards.current[i]=node}
            className="works-wheel-card" style={{width:metrics.cardW,height:metrics.cardH,marginLeft:-metrics.cardW/2,marginTop:-metrics.cardH/2}}>
            <span className="works-wheel-face"><img src={item.image} alt={item.title} draggable="false"/>{action&&item.href?<span className="works-wheel-view">{action} ↗</span>:null}</span>
          </Card>;
        })}
      </div>
    </div>
    <div className="works-wheel-label">{label}</div>
    <div className="works-wheel-active">{items[active]?.title}</div>
    <ol className="works-wheel-index">{items.map((item,i)=><li key={item.title}><button type="button" onClick={()=>go(i+1)} className={i===active?"active":""}>{item.title}</button></li>)}</ol>
    <div className="works-wheel-hint">SCROLL / DRAG / ARROW KEYS</div>
  </section>;
}

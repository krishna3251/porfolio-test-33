"use client";

import * as React from "react";
import Link from "next/link";

const clamp=(v,lo,hi)=>Math.min(hi,Math.max(lo,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const ease=(t)=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;

export default function WorksWheel({items=[],label="Works '26",action="View",className=""}){
  const stageRef=React.useRef(null), wheelRef=React.useRef(null), cards=React.useRef([]);
  const target=React.useRef(0), current=React.useRef(0), drag=React.useRef(null), settle=React.useRef(null);
  const [active,setActive]=React.useState(0), [stage,setStage]=React.useState({w:0,h:0}), [reduced,setReduced]=React.useState(false);
  const labelRef=React.useRef(null), activeRef=React.useRef(null);
  const count=items.length, last=Math.max(count-1,0);

  React.useEffect(()=>{
    const el=stageRef.current;if(!el)return;
    const read=()=>setStage({w:el.clientWidth,h:el.clientHeight});
    read();
    const ro=new ResizeObserver(read);ro.observe(el);
    const mq=window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync=()=>setReduced(mq.matches);sync();mq.addEventListener?.("change",sync);
    return()=>{ro.disconnect();mq.removeEventListener?.("change",sync)};
  },[]);

  const metrics=React.useMemo(()=>{
    const w=stage.w||900,h=stage.h||560;
    const mobile=w<640;
    const cardW=Math.min(mobile?w*.58:w*.28, mobile?240:340);
    const cardH=cardW*.62;
    return {
      cardW,cardH,
      ringY:mobile?Math.min(h*.28,170):Math.min(h*.31,210),
      ringX:mobile?Math.min(w*.32,145):Math.min(w*.32,360),
      drumGap:cardH*.78,
      perspective:Math.max(900,cardH*5)
    };
  },[stage]);

  const go=React.useCallback(n=>{
    target.current=clamp(n,0,last);
  },[last]);

  React.useEffect(()=>{
    if(!count)return;
    let frame;
    const draw=()=>{
      const gap=target.current-current.current;
      current.current+=reduced?gap:gap*.105;
      if(Math.abs(target.current-current.current)<.0005)current.current=target.current;
      const t=current.current;
      const index=Math.round(t);
      const phase=t-Math.floor(t);
      const mode=t<=.98?0:1;
      const local=mode?ease(Math.min(1,t-.98)):0;

      cards.current.forEach((card,i)=>{
        if(!card)return;
        const d=i-t;
        const abs=Math.abs(d);
        let x,y,z,rx,rz,scale,opacity;

        if(!mode){
          const angle=(i/count)*Math.PI*2-Math.PI/2;
          x=Math.cos(angle)*metrics.ringX;
          y=Math.sin(angle)*metrics.ringY;
          z=Math.cos(angle)*metrics.ringX*.42;
          rx=0;
          rz=0;
          scale=i===index?1.06:.78;
          opacity=abs<2.8?1:0;
        }else{
          const slot=d;
          x=lerp(0,slot*metrics.cardW*.08,local);
          y=lerp(Math.sign(slot)*Math.min(Math.abs(slot)*metrics.ringY*.7,metrics.ringY),slot*metrics.drumGap,local);
          z=lerp(Math.cos((i/count)*Math.PI*2)*metrics.ringX*.25,-Math.abs(slot)*80,local);
          rx=lerp(0,-slot*12,local);
          rz=lerp(0,slot*.8,local);
          scale=lerp(i===index?1.06:.78,Math.max(.62,1-Math.min(abs,3)*.09),local);
          opacity=abs<3.1?1:0;
        }

        card.style.transform=`translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), ${z}px) rotateX(${rx}deg) rotateZ(${rz}deg) scale(${scale})`;
        card.style.opacity=String(opacity);
        card.style.zIndex=String(Math.round(1000-abs*20));
        card.style.pointerEvents=(i===index||t>i-.85&&t<i+.85)?"auto":"none";
      });

      if(wheelRef.current)wheelRef.current.style.transform="translateZ(0)";
      if(labelRef.current)labelRef.current.style.opacity=String(Math.max(0,1-Math.min(1,t)));
      if(activeRef.current){
        activeRef.current.style.opacity="1";
        activeRef.current.style.transform=`translateY(-50%) translate3d(${Math.min(32,t*10)}px,0,0)`;
      }
      setActive(v=>v===index?v:index);

      if(!reduced)frame=requestAnimationFrame(draw);
    };
    if(reduced)draw();else frame=requestAnimationFrame(draw);
    return()=>cancelAnimationFrame(frame);
  },[count,reduced,metrics,last]);

  React.useEffect(()=>()=>window.clearTimeout(settle.current),[]);

  const onWheel=e=>{
    const delta=clamp(e.deltaY,-120,120);
    if((delta<0&&target.current>0)||(delta>0&&target.current<last))e.preventDefault();
    go(target.current+delta/520);
    window.clearTimeout(settle.current);
    settle.current=window.setTimeout(()=>go(Math.round(target.current)),110);
  };

  const onPointerDown=e=>{
    drag.current={y:e.clientY,id:e.pointerId};
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove=e=>{
    if(!drag.current)return;
    go(target.current+(drag.current.y-e.clientY)/280);
    drag.current.y=e.clientY;
  };
  const endDrag=()=>{
    if(!drag.current)return;
    drag.current=null;
    go(Math.round(target.current));
  };

  if(!items.length)return null;

  return <section className={"works-wheel-section "+className} aria-label={label}>
    <div className="works-wheel-stage" ref={stageRef} tabIndex={0} role="listbox" aria-activedescendant={"works-wheel-"+active}
      style={{perspective:metrics.perspective}}
      onWheel={onWheel}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onKeyDown={e=>{
        if(e.key==="ArrowDown"||e.key==="PageDown"){go(Math.min(last,Math.round(target.current)+1));e.preventDefault()}
        if(e.key==="ArrowUp"||e.key==="PageUp"){go(Math.max(0,Math.round(target.current)-1));e.preventDefault()}
        if(e.key==="Home"){go(0);e.preventDefault()}
        if(e.key==="End"){go(last);e.preventDefault()}
      }}>
      <div className="works-wheel-ring" ref={wheelRef}>
        {items.map((item,i)=>{
          const Card=item.href?Link:"div";
          return <Card
            key={item.title}
            id={"works-wheel-"+i}
            role="option"
            aria-selected={i===active}
            href={item.href}
            ref={node=>cards.current[i]=node}
            className={"works-wheel-card"+(i===active?" is-active":"")}
            style={{width:metrics.cardW,height:metrics.cardH}}
          >
            <span className="works-wheel-face">
              <img src={item.image} alt={item.title} draggable="false" loading={i<2?"eager":"lazy"}/>
              <span className="works-wheel-overlay"><small>{String(i+1).padStart(2,"0")} / SELECTED</small><strong>{item.title}</strong>{action&&item.href?<em>{action} ↗</em>:null}</span>
            </span>
          </Card>;
        })}
      </div>
    </div>
    <div className="works-wheel-label" ref={labelRef}>{label}</div>
    <div className="works-wheel-active" ref={activeRef}>{items[active]?.title}</div>
    <ol className="works-wheel-index">{items.map((item,i)=><li key={item.title}><button type="button" onClick={()=>go(i)} className={i===active?"active":""}><span>{String(i+1).padStart(2,"0")}</span>{item.title}</button></li>)}</ol>
    <div className="works-wheel-hint">SCROLL / DRAG / ARROW KEYS</div>
    <div className="works-wheel-progress" aria-hidden="true"><i style={{transform:`scaleX(${last?active/last:1})`}}/></div>
  </section>;
}

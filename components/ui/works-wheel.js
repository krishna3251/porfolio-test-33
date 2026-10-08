"use client";

import * as React from "react";
import Link from "next/link";

const clamp=(v,lo,hi)=>Math.min(hi,Math.max(lo,v));

export default function WorksWheel({items=[],label="Works '26",action="View",className=""}){
  const stageRef=React.useRef(null), wheelRef=React.useRef(null), cards=React.useRef([]);
  const target=React.useRef(0), current=React.useRef(0), velocity=React.useRef(0), drag=React.useRef(null);
  const [active,setActive]=React.useState(0), [stage,setStage]=React.useState({w:0,h:0}), [reduced,setReduced]=React.useState(false);
  const labelRef=React.useRef(null), activeRef=React.useRef(null), progressRef=React.useRef(null);
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
    const w=stage.w||900,h=stage.h||560,mobile=w<640;
    const cardW=Math.min(mobile?w*.58:w*.28,mobile?240:340), cardH=cardW*.62;
    return {cardW,cardH,ringY:mobile?Math.min(h*.28,170):Math.min(h*.31,210),ringX:mobile?Math.min(w*.32,145):Math.min(w*.32,360),drumGap:cardH*.8,perspective:Math.max(1000,cardH*5)};
  },[stage]);

  const go=React.useCallback((n,impulse=0)=>{
    target.current=clamp(n,0,last);
    velocity.current+=impulse;
  },[last]);

  React.useEffect(()=>{
    if(!count)return;
    let frame;
    const draw=()=>{
      const delta=target.current-current.current;
      if(reduced){
        current.current=target.current;
        velocity.current=0;
      }else{
        velocity.current+=(delta*.085-velocity.current*.18);
        current.current+=velocity.current;
        if(Math.abs(delta)<.0008&&Math.abs(velocity.current)<.0008){current.current=target.current;velocity.current=0}
      }
      const t=current.current,index=Math.round(t);
      const cardsEl=cards.current;

      cardsEl.forEach((card,i)=>{
        if(!card)return;
        const d=i-t,abs=Math.abs(d);
        const visible=abs<3.2;
        const side=Math.min(abs,3);
        const x=d*metrics.cardW*.075;
        const y=d*metrics.drumGap;
        const z=-side*92;
        const rx=-d*7.5;
        const scale=i===index?1.06:Math.max(.68,1-side*.085);
        const opacity=visible?Math.max(.16,1-side*.24):0;

        card.style.transform=`translate3d(calc(-50% + ${x}px),calc(-50% + ${y}px),${z}px) rotateX(${rx}deg) scale(${scale})`;
        card.style.opacity=String(opacity);
        card.style.zIndex=String(Math.round(1000-abs*28));
        card.style.pointerEvents=(i===index||abs<.9)?"auto":"none";
        card.classList.toggle("is-active",i===index);
      });

      if(labelRef.current)labelRef.current.style.opacity=String(Math.max(0,1-blend));
      if(activeRef.current){
        activeRef.current.style.opacity="1";
        activeRef.current.style.transform=`translateY(-50%) translate3d(${Math.min(36,t*9)}px,0,0)`;
      }
      if(progressRef.current)progressRef.current.style.transform=`scaleX(${last?clamp(t/last,0,1):1})`;
      setActive(v=>v===index?v:index);
      if(!reduced)frame=requestAnimationFrame(draw);
    };
    draw();
    return()=>cancelAnimationFrame(frame);
  },[count,reduced,metrics,last]);

  const onWheel=e=>{
    const raw=clamp(e.deltaY,-100,100);
    const atStart=target.current<=0&&raw<0, atEnd=target.current>=last&&raw>0;
    if(!atStart&&!atEnd)e.preventDefault();
    if(atStart||atEnd)return;
    const scale=e.deltaMode===1?.055:.0024;
    const impulse=raw*scale*.32;
    go(target.current+raw*scale,impulse);
  };

  const suppressClick=React.useRef(false);
  const onPointerDown=e=>{
    drag.current={y:e.clientY,id:e.pointerId,moved:false};
    suppressClick.current=false;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove=e=>{
    if(!drag.current)return;
    const dy=drag.current.y-e.clientY;
    drag.current.y=e.clientY;
    if(Math.abs(dy)>3)drag.current.moved=true;
    go(target.current+dy/300,dy/300*.035);
  };
  const endDrag=()=>{
    if(!drag.current)return;
    suppressClick.current=drag.current.moved;
    drag.current=null;
    const nearest=Math.round(target.current);
    target.current=clamp(nearest,0,last);
  };
  const onClickCapture=e=>{
    if(suppressClick.current){
      e.preventDefault();
      e.stopPropagation();
      suppressClick.current=false;
    }
  };

  if(!items.length)return null;

  return <section className={"works-wheel-section "+className} aria-label={label}>
    <div className="works-wheel-stage" ref={stageRef} tabIndex={0} role="listbox" aria-activedescendant={"works-wheel-"+active}
      style={{perspective:metrics.perspective}}
      onWheel={onWheel} onClickCapture={onClickCapture} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={endDrag} onPointerCancel={endDrag}
      onKeyDown={e=>{
        if(e.key==="ArrowDown"||e.key==="PageDown"){go(Math.min(last,Math.round(target.current)+1));e.preventDefault()}
        if(e.key==="ArrowUp"||e.key==="PageUp"){go(Math.max(0,Math.round(target.current)-1));e.preventDefault()}
        if(e.key==="Home"){go(0);e.preventDefault()}
        if(e.key==="End"){go(last);e.preventDefault()}
      }}>
      <div className="works-wheel-ring" ref={wheelRef}>
        {items.map((item,i)=>{
          const Card=item.href?Link:"div";
          return <Card key={item.title} id={"works-wheel-"+i} role="option" aria-selected={i===active} href={item.href}
            ref={node=>cards.current[i]=node} className="works-wheel-card" style={{width:metrics.cardW,height:metrics.cardH}}>
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
    <div className="works-wheel-progress" aria-hidden="true"><i ref={progressRef}/></div>
    <div className="works-wheel-light" aria-hidden="true"/>
  </section>;
}

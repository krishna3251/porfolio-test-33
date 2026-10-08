"use client";
import * as React from "react";

export default function SparklesEffect({count=34,className=""}){
  const particles=React.useMemo(()=>Array.from({length:count},(_,i)=>({
    left:`${(i*37)%100}%`,
    top:`${(i*61)%100}%`,
    delay:`${(i%9)*.42}s`,
    duration:`${2.8+(i%7)*.55}s`,
    size:`${1+(i%3)*.55}px`
  })),[count]);
  return <div className={`sparkles-effect ${className}`} aria-hidden="true">{particles.map((p,i)=><i key={i} style={{left:p.left,top:p.top,width:p.size,height:p.size,animationDelay:p.delay,animationDuration:p.duration}}/>)}</div>;
}

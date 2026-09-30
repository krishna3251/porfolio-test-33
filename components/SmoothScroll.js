"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

export default function SmoothScroll({children}){
  const pathname=usePathname();

  useEffect(()=>{
    const reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch=window.matchMedia("(pointer: coarse)").matches;
    if(reduce||touch)return;

    const lenis=new Lenis({
      duration:1.05,
      easing:(t)=>Math.min(1,1.001-Math.pow(2,-10*t)),
      smoothWheel:true,
      wheelMultiplier:.82,
      touchMultiplier:1,
      infinite:false
    });

    let frame=0;
    const raf=(time)=>{lenis.raf(time);frame=requestAnimationFrame(raf)};
    frame=requestAnimationFrame(raf);

    return()=>{cancelAnimationFrame(frame);lenis.destroy()};
  },[pathname]);

  return <>{children}</>;
}
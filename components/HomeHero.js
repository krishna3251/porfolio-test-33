"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomeHero(){
  const [time,setTime]=useState("");
  const mx=useMotionValue(0);
  const my=useMotionValue(0);
  const sx=useSpring(mx,{stiffness:120,damping:22});
  const sy=useSpring(my,{stiffness:120,damping:22});
  const photoX=useTransform(sx,[-500,500],[-10,10]);
  const photoY=useTransform(sy,[-500,500],[-8,8]);
  const titleX=useTransform(sx,[-500,500],[-6,6]);

  useEffect(()=>{
    const onMove=(e)=>{
      mx.set(e.clientX-window.innerWidth/2);
      my.set(e.clientY-window.innerHeight/2);
    };
    window.addEventListener("pointermove",onMove,{passive:true});
    return()=>window.removeEventListener("pointermove",onMove);
  },[mx,my]);

  useEffect(()=>{
    const f=()=>setTime(new Intl.DateTimeFormat("en-IN",{timeZone:"Asia/Kolkata",hour:"2-digit",minute:"2-digit",hour12:true}).format(new Date()));
    f(); const id=setInterval(f,30000); return()=>clearInterval(id);
  },[]);

  return <section id="home" className="relative min-h-[100svh] flex items-end overflow-hidden pt-[82px] pb-5 md:pb-8">
    <div className="absolute inset-0 site-grid-light opacity-70 pointer-events-none"/>
    <motion.div style={{x:photoX,y:photoY}} className="hero-orbit hero-orbit-orange"/>
    <motion.div style={{x:useTransform(sx,[-500,500],[8,-8]),y:useTransform(sy,[-500,500],[5,-5])}} className="hero-orbit hero-orbit-ink"/>

    <div className="absolute top-[24%] left-[5%] text-[10px] font-mono tracking-[.2em] text-black/35 rotate-90 origin-left hidden lg:block">
      CREATIVE DEVELOPER / INDIA
    </div>

    <div className="max-w-[1500px] w-full mx-auto px-5 md:px-8 lg:px-10">
      <div className="grid lg:grid-cols-12 gap-5 items-end">
        <div className="lg:col-span-8">
          <div className="flex items-center gap-3 mb-5">
            <span className="index-dot"/>
            <span className="mono-metadata text-black/55">01 / HOME</span>
            <span className="mono-metadata text-hot">SOFTWARE + VISUALS</span>
          </div>

          <div className="overflow-hidden">
            <motion.h1 initial={{y:"105%"}} animate={{y:0}} transition={{duration:.95,ease:[.16,1,.3,1]}} style={{x:titleX}} className="hero-title">
              KRISHNA<span className="text-hot">.</span>
            </motion.h1>
          </div>

          <motion.div initial={{scaleX:0}} animate={{scaleX:1}} transition={{duration:1,delay:.4,ease:[.16,1,.3,1]}} className="hero-rule"/>
          
          <motion.div initial={{opacity:0,y:22}} animate={{opacity:1,y:0}} transition={{duration:.7,delay:.5}} className="mt-7 max-w-3xl grid md:grid-cols-2 gap-7">
            <p className="text-base md:text-xl leading-relaxed text-black/70">
              I build Python systems, AI applications, Discord automation and gaming visuals. Technical underneath, expressive on the surface.
            </p>
            <div className="font-mono text-[9px] md:text-[10px] leading-[1.8] text-black/45 uppercase tracking-[.12em]">
              BASED IN INDIA / {time}<br/>
              CURRENT MODE / <span className="text-black">BUILD + EXPERIMENT</span><br/>
              AUDIO / <span className="text-hot">READY</span>
            </div>
          </motion.div>

          <div className="mt-7 flex flex-wrap gap-3">
            <LinkButton href="/thumbnails" label="View thumbnails ↗" filled/>
            <LinkButton href="/projects" label="View projects ↗"/>
          </div>
        </div>

        <div className="lg:col-span-4">
          <motion.div initial={{opacity:0,x:35,rotate:2}} animate={{opacity:1,x:0,rotate:0}} transition={{duration:1,delay:.25,ease:[.16,1,.3,1]}} className="relative max-w-md ml-auto">
            <div className="hero-photo glass-photo">
              <img src="/hero_krishna_vertical.jpg" alt="Krishna" className="w-full h-full object-cover"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent"/>
              <div className="absolute top-4 left-4 px-2.5 py-1.5 bg-hot text-white font-mono text-[8px] font-bold tracking-[.12em]">PORTRAIT / 001</div>
              <div className="absolute left-4 right-4 bottom-4 flex items-end justify-between gap-4 text-white">
                <div><div className="font-mono text-[11px] font-bold">CREATIVE DEVELOPER</div><div className="mono-metadata text-[7px] text-white/60 mt-1">CODE / ART / SOUND</div></div>
                <div className="font-mono text-[8px] text-white/55">HYD / IST</div>
              </div>
            </div>
            <div className="absolute -left-3 bottom-10 w-10 h-10 border-l-2 border-b-2 border-hot"/>
            <div className="absolute -right-3 top-8 w-12 h-12 border-r-2 border-t-2 border-black/50"/>
          </motion.div>
        </div>
      </div>

      <div className="mt-10 md:mt-14 flex items-center justify-between border-t border-black/10 pt-3">
        <span className="mono-metadata text-black/35">SCROLL TO EXPLORE</span>
        <motion.span animate={{x:[0,7,0]}} transition={{repeat:Infinity,duration:2,ease:"easeInOut"}} className="font-mono text-sm text-hot">→</motion.span>
      </div>
    </div>
  </section>;
}

function LinkButton({href,label,filled=false}){
  return <Link href={href} className={filled?"hero-button hero-button-filled":"hero-button"}>{label}</Link>;
}
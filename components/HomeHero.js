"use client";
import {motion} from "framer-motion";
import {useEffect,useState} from "react";
export default function HomeHero(){
 const[time,setTime]=useState("");
 useEffect(()=>{const f=()=>setTime(new Intl.DateTimeFormat("en-US",{timeZone:"Asia/Kolkata",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:true}).format(new Date()));f();const i=setInterval(f,1000);return()=>clearInterval(i)},[]);
 const go=id=>document.getElementById(id)?.scrollIntoView({behavior:"smooth"});
 return <section id="home" className="min-h-screen pt-20 relative overflow-hidden">
  <div className="absolute inset-0 brutal-grid opacity-60 pointer-events-none"/>
  <div className="absolute left-0 right-0 top-[47%] border-t border-white/20 pointer-events-none"/>
  <div className="absolute top-0 bottom-0 left-[8%] border-l border-white/15 pointer-events-none"/>
  <div className="absolute top-0 bottom-0 right-[8%] border-l border-white/15 pointer-events-none"/>
  <div className="max-w-[1500px] mx-auto min-h-[calc(100vh-5rem)] grid lg:grid-cols-12 relative z-10">
   <div className="hidden lg:flex lg:col-span-1 border-r border-white/20 flex-col justify-between p-3">
    <span className="mono-metadata [writing-mode:vertical-lr] rotate-180 text-muted">KRISHNA / CREATIVE DEVELOPER</span>
    <span className="font-mono text-[9px] text-primary">IND / 2026</span>
   </div>
   <div className="lg:col-span-7 p-5 md:p-10 lg:p-12 flex flex-col justify-center">
    <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.5}}>
     <div className="mono-metadata text-primary mb-5">01 / DEVELOPER + VISUAL ARTIST / LIVE AUDIO ENGINE</div>
     <motion.h1 initial={{y:50,opacity:0}} animate={{y:0,opacity:1}} transition={{duration:.9,ease:[.16,1,.3,1]}} className="font-mono font-black text-[clamp(4rem,11vw,10.5rem)] uppercase tracking-[-.11em] leading-[.76] music-glow-text">KRISHNA<span className="text-primary">_</span></motion.h1>
     <div className="grid md:grid-cols-2 gap-8 mt-10 pt-5 border-t border-white/20">
      <p className="text-base md:text-lg leading-relaxed text-foreground/80">I build Python systems, AI applications, Discord automation and gaming visuals. Code on one side. Visual chaos on the other.</p>
      <div className="font-mono text-[10px] leading-relaxed text-muted"><span className="text-primary">CURRENTLY</span><br/>BUILDING SOFTWARE + VISUALS<br/>BASED IN INDIA / {time}<br/>AUDIO ENGINE: <span className="text-foreground">ACTIVE</span></div>
     </div>
     <div className="flex flex-wrap gap-2 mt-8"><button onClick={()=>go("work")} className="bg-primary text-black px-6 py-4 font-mono text-[10px] uppercase font-bold hover:bg-white transition-colors">ENTER WORK ↘</button><button onClick={()=>go("projects")} className="border border-white/40 px-6 py-4 font-mono text-[10px] uppercase hover:bg-white hover:text-black transition-colors">VIEW SYSTEMS ↘</button></div>
    </motion.div>
   </div>
   <div className="lg:col-span-4 border-l border-white/20 p-5 md:p-10 flex items-center">
    <motion.div initial={{opacity:0,scale:.94}} animate={{opacity:1,scale:1}} transition={{duration:1,delay:.15}} className="w-full">
     <div className="relative border-2 border-white aspect-[4/5] overflow-hidden music-beat-scale music-glow-border bg-black">
      <img src="/hero_krishna_vertical.jpg" alt="Krishna" className="w-full h-full object-cover contrast-[1.1] transition-transform duration-700 hover:scale-105"/>
      <div className="absolute top-3 left-3 bg-primary text-black font-mono text-[8px] px-2 py-1 font-bold">PORTRAIT / LIVE</div>
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/75 border-t border-white/30"><div className="font-mono text-[10px] font-bold">CREATIVE DEVELOPER</div><div className="mono-metadata text-[7px] text-muted mt-1">SYSTEMS / ART / SOUND</div></div>
     </div>
     <div className="flex justify-between mt-2 font-mono text-[8px] text-muted"><span>HYDERABAD / IST</span><span>SCROLL ↓</span></div>
    </motion.div>
   </div>
  </div>
 </section>
}
"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function IntroOverlay(){
 const [visible,setVisible]=useState(false);
 const [progress,setProgress]=useState(0);
 useEffect(()=>{
  if(!sessionStorage.getItem("krishna-portfolio-entered")) setVisible(true);
 },[]);
 useEffect(()=>{
  if(!visible)return;
  const id=setInterval(()=>setProgress(p=>Math.min(100,p+2.5)),50);
  return()=>clearInterval(id);
 },[visible]);
 const enter=()=>{sessionStorage.setItem("krishna-portfolio-entered","true");setVisible(false);window.dispatchEvent(new CustomEvent("play-portfolio-audio"));};
 return <AnimatePresence>
  {visible&&<motion.div className="portfolio-intro" initial={{opacity:1}} exit={{opacity:0,y:"-8%",transition:{duration:.8,ease:[.16,1,.3,1]}}}>
   <div className="portfolio-intro-top"><span>KRISHNA.</span><span>PORTFOLIO / 2026</span></div>
   <div className="portfolio-intro-center">
    <span className="portfolio-kicker">Creative developer · visual designer</span>
    <h1>KRISHNA<span>.</span></h1>
    <div className="portfolio-intro-line"><span style={{width:progress+"%"}}/></div>
    <div className="portfolio-intro-status"><span>Loading work</span><span>{Math.floor(progress)}%</span></div>
    {progress>=100&&<motion.button initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} onClick={enter} className="hero-button hero-button-filled mt-8">Enter portfolio ↗</motion.button>}
   </div>
   <div className="portfolio-intro-bottom"><span>SOFTWARE / AI / VISUALS</span><span>CODE + ART + SOUND</span></div>
  </motion.div>}
 </AnimatePresence>;
}

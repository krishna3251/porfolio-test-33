"use client";

import * as React from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import Link from "next/link";
import TerminalBar from "@/components/TerminalBar";
import WobbleImage from "@/components/WobbleImage";
import SquigglyText from "@/components/ui/squiggly-text";
import WorksWheel from "@/components/ui/works-wheel";
import SparklesEffect from "@/components/ui/sparkles-effect";
import { CommandButton } from "@/components/PortfolioUI";

const HERO_IMAGE="/hero_krishna_vertical.jpg";

const heroWork=[
  {title:"Gaming thumbnails",image:"/images/genshin%20cinematic.png",href:"/thumbnails"},
  {title:"Skirk / Genshin",image:"/images/genshin%20skirk.png",href:"/thumbnails"},
  {title:"Wuthering Waves",image:"/images/wuwa%20cyberpunk%201.png",href:"/thumbnails"},
  {title:"Rukiya",image:"/images/bots/rukiya.png",href:"/projects"},
  {title:"Lxeus",image:"/images/bots/lexus.png",href:"/projects"},
  {title:"Valorant",image:"/images/valorant%20chamber%20velo.png",href:"/thumbnails"}
];

const reveal={hidden:{opacity:0,y:28},show:{opacity:1,y:0,transition:{duration:.7,ease:[.16,1,.3,1]}}};

export default function HomeHero(){
  const heroRef=React.useRef(null);
  const mx=useMotionValue(0), my=useMotionValue(0);
  const sx=useSpring(mx,{stiffness:70,damping:18,mass:.6}), sy=useSpring(my,{stiffness:70,damping:18,mass:.6});
  const {scrollYProgress}=useScroll({target:heroRef,offset:["start start","end start"]});
  const cinemaY=useTransform(scrollYProgress,[0,1],[0,-150]);
  const cinemaScale=useTransform(scrollYProgress,[0,.7,1],[1,1.035,1.08]);
  const cinemaOpacity=useTransform(scrollYProgress,[0,.65,1],[1,.7,0]);
  const gridY=useTransform(scrollYProgress,[0,1],[0,80]);
  const move=(event)=>{
    if(event.pointerType==="touch")return;
    mx.set((event.clientX-window.innerWidth/2)*.008);
    my.set((event.clientY-window.innerHeight/2)*.008);
  };

  return <section ref={heroRef} className="hero hero-v2 hero-cinematic" id="top" onPointerMove={move}>
    <motion.div className="hero-cinematic-bg" style={{y:cinemaY,scale:cinemaScale,opacity:cinemaOpacity}} aria-hidden="true">
      <div className="hero-orbit orbit-a"/><div className="hero-orbit orbit-b"/>
      <div className="hero-glow glow-a"/><div className="hero-glow glow-b"/>
      <div className="hero-vignette"/>
    </motion.div>
    <motion.div className="hero-grid hero-grid-cinematic" style={{y:gridY}} aria-hidden="true"><span/><span/><span/><span/></motion.div>
    <div className="hero-watermark" aria-hidden="true">01</div>
    <motion.pre className="hero-ascii" initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:.25,duration:.7}} aria-hidden="true">KRISHNA.STD / CODE + IMAGE</motion.pre>
    <div className="hero-rail" aria-hidden="true"><span>KRISHNA / 2026</span><i/></div>

    <motion.div initial="hidden" animate="show" variants={reveal}>
      <TerminalBar command="init portfolio --mode=creative" meta="BOOT / 01" />
    </motion.div>
    <motion.div className="hero-topline" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:.18,duration:.6,ease:[.16,1,.3,1]}}>
      <span>CREATIVE DEVELOPER / VISUAL DESIGNER</span><span>INDIA / 2026</span>
    </motion.div>

    <div className="hero-intro-block">
      <motion.div className="hero-copy" initial="hidden" animate="show" variants={reveal} transition={{delay:.18}}>
        <div className="hero-availability"><span/><b>AVAILABLE FOR SELECTED WORK</b></div>
        <p className="hero-kicker"><span className="hero-dot"/>I make software &amp; visuals.</p>
        <motion.h1 initial={{opacity:0,y:44,filter:"blur(10px)"}} animate={{opacity:1,y:0,filter:"blur(0px)"}} transition={{delay:.12,duration:1,ease:[.16,1,.3,1]}}>
          <span className="terminal-prefix">&gt; </span><SquigglyText scale={[2,3]} stepDuration={110}>KRISHNA</SquigglyText><span>.</span><i className="hero-terminal-cursor" aria-hidden="true">█</i>
        </motion.h1>
        <motion.p className="hero-one-line" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.7,duration:.8}}>AI systems, web experiences, automation and gaming visuals, built with equal attention to function and finish.</motion.p>
      </motion.div>

      <motion.div className="hero-portrait hero-portrait-small" style={{x:useTransform(sx,[-15,15],[-3,3]),y:useTransform(sy,[-15,15],[-2,2])}} initial={{opacity:0,scale:.92,y:25}} animate={{opacity:1,scale:1,y:0}} transition={{delay:.4,duration:.9,ease:[.16,1,.3,1]}}>
        <div className="hero-image-frame"><WobbleImage className="absolute inset-0"><Image src={HERO_IMAGE} alt="Krishna" fill priority sizes="(max-width: 640px) 92px, (max-width: 900px) 130px, 180px" quality={82} className="hero-portrait-image"/></WobbleImage></div>
        <div className="hero-portrait-tag">01 / KRISHNA</div><div className="hero-portrait-scan" aria-hidden="true"/><div className="hero-image-crosshair" aria-hidden="true"/>
      </motion.div>
    </div>

    <motion.div className="hero-work-intro" initial="hidden" whileInView="show" viewport={{once:true,amount:.25}} variants={reveal}>
      <div><span className="eyebrow">SELECTED WORK / LIVE INDEX</span><h2>Scroll through<br/><em>what I build.</em></h2></div>
      <div className="hero-wheel-instructions"><span>INTERACTIVE INDEX</span><p>Scroll or drag vertically. The front card becomes the active project. The wheel eases into place instead of snapping.</p></div>
    </motion.div>

    <motion.div className="hero-wheel-wrap" initial={{opacity:0,y:35}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.18}} transition={{duration:.9,ease:[.16,1,.3,1]}}>
      <SparklesEffect count={18}/>
      <WorksWheel items={heroWork} label="Works '26" action="Open"/>
    </motion.div>

    <motion.div className="hero-profile" initial="hidden" whileInView="show" viewport={{once:true,amount:.22}} variants={reveal}>
      <div className="hero-profile-index"><span>01 / PROFILE</span><i/></div>
      <div className="hero-profile-copy">
        <p className="hero-profile-lead">I&apos;m Krishna, a BCA graduate and creative developer based in India. I build AI systems, web experiences and gaming visuals where engineering and art need to work together.</p>
        <p>I care about clean structure, fast interactions, readable interfaces, useful automation and visuals with a clear purpose.</p>
      </div>
      <div className="hero-profile-side"><span>FOCUS</span><strong>AI / WEB / VISUAL</strong><span>STACK</span><strong>PYTHON / REACT / NEXT.JS</strong><div className="hero-actions"><CommandButton href="/thumbnails" label="view-work" cursor="VIEW WORK" accent /><CommandButton href="/projects" label="software" cursor="SOFTWARE" /></div></div>
    </motion.div>

    <motion.div className="hero-bottom" initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}} transition={{duration:.8}}><span>CODE + ART + SOUND</span><Link href="#services">SCROLL <i>↓</i></Link></motion.div>
  </section>;
}

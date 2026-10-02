"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import TerminalBar from "@/components/TerminalBar";

const HERO_IMAGE="https://cdn.jsdelivr.net/gh/krishna3251/porfolio-test-33@main/public/hero_krishna_vertical.jpg";

export default function HomeHero(){
  const mx=useMotionValue(0), my=useMotionValue(0);
  const sx=useSpring(mx,{stiffness:80,damping:20}), sy=useSpring(my,{stiffness:80,damping:20});
  const move=(event)=>{
    mx.set((event.clientX-window.innerWidth/2)*.02);
    my.set((event.clientY-window.innerHeight/2)*.02);
  };

  return <section className="hero" onPointerMove={move}>
    <div className="hero-grid" aria-hidden="true"><span/><span/><span/><span/></div>
    <div className="hero-watermark" aria-hidden="true">01</div>
    <pre className="hero-ascii" aria-hidden="true">{`┌──────────────┐
│ KRISHNA.STD  │
│ CODE + IMAGE │
└──────────────┘`}</pre>
    <div className="hero-rail" aria-hidden="true"><span>KRISHNA / 2026</span><i/></div>
    <TerminalBar command="init portfolio --mode=creative" meta="BOOT / 01" />
    <div className="hero-topline">
      <span>CREATIVE DEVELOPER / VISUAL DESIGNER</span>
      <span>INDIA / 2026</span>
    </div>
    <div className="hero-main">
      <div className="hero-copy">
        <div className="hero-availability"><span/><b>AVAILABLE FOR SELECTED WORK</b></div>
        <p className="hero-kicker"><span className="hero-dot"/>I make software &amp; visuals.</p>
        <motion.h1 initial={{opacity:0,y:50}} animate={{opacity:1,y:0}} transition={{duration:.8,ease:[.16,1,.3,1]}}><span className="terminal-prefix">&gt; </span>KRISHNA<span>.</span><i className="hero-terminal-cursor" aria-hidden="true">█</i></motion.h1>
        <div className="hero-rule"><span/></div>
        <p className="hero-intro">Building AI systems, web experiences and gaming visuals with a designer&apos;s eye and a developer&apos;s patience.</p>
        <div className="hero-actions">
          <Link href="/thumbnails" className="btn btn-accent magnetic" data-cursor="VIEW WORK">View work <span>↗</span></Link>
          <Link href="/projects" className="btn magnetic" data-cursor="SOFTWARE">Software <span>↗</span></Link>
        </div>
        <div className="hero-mini-meta"><span>BASED IN INDIA</span><span>AI / WEB / VISUAL</span><span>01—06</span></div>
      </div>
      <motion.div className="hero-portrait" style={{x:useTransform(sx,[-15,15],[-3,3]),y:useTransform(sy,[-15,15],[-2,2])}}>
        <div className="hero-image-frame">
          <Image src={HERO_IMAGE} alt="Krishna" fill priority sizes="(max-width: 840px) 88vw, 43vw" quality={75} className="hero-portrait-image"/>
        </div>
        <div className="hero-portrait-tag">01 / KRISHNA</div>
        <div className="hero-portrait-caption">SELECTED PORTRAIT / 2026</div>
        <div className="hero-portrait-corner" aria-hidden="true">↗</div>
        <div className="hero-portrait-scan" aria-hidden="true"/>
      </motion.div>
    </div>
    <div className="hero-scroll-badge" aria-hidden="true"><span>SCROLL / EXPLORE / </span></div>
    <div className="hero-bottom"><span>CODE + ART + SOUND</span><span>SCROLL <i>↓</i></span></div>
  </section>;
}
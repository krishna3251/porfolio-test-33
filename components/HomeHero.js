"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export default function HomeHero(){
  const mx=useMotionValue(0), my=useMotionValue(0);
  const sx=useSpring(mx,{stiffness:80,damping:20}), sy=useSpring(my,{stiffness:80,damping:20});
  const move=(event)=>{
    mx.set((event.clientX-window.innerWidth/2)*.02);
    my.set((event.clientY-window.innerHeight/2)*.02);
  };

  return <section className="hero" onPointerMove={move}>
    <div className="hero-topline"><span>CREATIVE DEVELOPER / VISUAL DESIGNER</span><span>INDIA / 2026</span></div>
    <div className="hero-main">
      <div className="hero-copy">
        <p className="hero-kicker">I make software &amp; visuals.</p>
        <motion.h1 initial={{opacity:0,y:50}} animate={{opacity:1,y:0}} transition={{duration:.8,ease:[.16,1,.3,1]}}>KRISHNA<span>.</span></motion.h1>
        <div className="hero-rule"/>
        <p className="hero-intro">Building AI systems, web experiences and gaming visuals with a designer&apos;s eye and a developer&apos;s patience.</p>
        <div className="hero-actions">
          <Link href="/thumbnails" className="btn btn-accent">View work ↗</Link>
          <Link href="/projects" className="btn">Software ↗</Link>
        </div>
      </div>
      <motion.div className="hero-portrait" style={{x:useTransform(sx,[-15,15],[-3,3]),y:useTransform(sy,[-15,15],[-2,2])}}>
        <Image src="/hero_krishna_vertical.jpg" alt="Krishna" fill priority sizes="(max-width: 840px) 88vw, 43vw" quality={75} className="hero-portrait-image"/>
        <div className="hero-portrait-tag">01 / KRISHNA</div>
      </motion.div>
    </div>
    <div className="hero-bottom"><span>CODE + ART + SOUND</span><span>SCROLL ↓</span></div>
  </section>;
}
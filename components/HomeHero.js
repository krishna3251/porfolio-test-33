"use client";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function HomeHero(){
 const [time,setTime]=useState("");
 const mx=useMotionValue(0),my=useMotionValue(0);
 const sx=useSpring(mx,{stiffness:90,damping:20}),sy=useSpring(my,{stiffness:90,damping:20});
 useEffect(()=>{const m=e=>{mx.set(e.clientX-innerWidth/2);my.set(e.clientY-innerHeight/2)};addEventListener("pointermove",m,{passive:true});return()=>removeEventListener("pointermove",m)},[mx,my]);
 useEffect(()=>{const f=()=>setTime(new Intl.DateTimeFormat("en-IN",{timeZone:"Asia/Kolkata",hour:"2-digit",minute:"2-digit",hour12:true}).format(new Date()));f();const id=setInterval(f,30000);return()=>clearInterval(id)},[]);
 return <section className="portfolio-hero" id="home">
  <div className="portfolio-hero-grid"/>
  <motion.div className="portfolio-hero-copy" style={{x:useTransform(sx,[-600,600],[-5,5])}}>
   <span className="portfolio-kicker">Creative developer · India</span>
   <h1>KRISHNA<span>.</span></h1>
   <p className="portfolio-hero-lead">I build software, AI systems and visual experiences that are useful first, expressive second.</p>
   <div className="portfolio-hero-actions"><Link href="/thumbnails" className="hero-button hero-button-filled">View my work ↗</Link><Link href="/projects" className="hero-button">Software projects ↗</Link></div>
   <div className="portfolio-hero-meta"><span>Based in India</span><span>IST / {time}</span><span>Code + Visuals + Sound</span></div>
  </motion.div>
  <motion.div className="portfolio-hero-image" style={{x:useTransform(sx,[-600,600],[8,-8]),y:useTransform(sy,[-600,600],[5,-5])}}>
   <div className="portfolio-hero-photo"><Image src="/hero_krishna_vertical.jpg" alt="Krishna" fill priority sizes="(max-width: 800px) 100vw, 480px" quality={75} className="object-cover" /><div className="portfolio-hero-photo-label">DEVELOPER / VISUAL DESIGNER</div></div>
  </motion.div>
  <div className="portfolio-hero-scroll">Scroll to explore <span>↓</span></div>
 </section>;
}
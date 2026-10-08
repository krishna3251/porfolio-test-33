"use client";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import TerminalBar from "@/components/TerminalBar";
import WobbleImage from "@/components/WobbleImage";
import SquigglyText from "@/components/ui/squiggly-text";
import WorksWheel from "@/components/ui/works-wheel";
import SparklesEffect from "@/components/ui/sparkles-effect";
import { CommandButton } from "@/components/PortfolioUI";

const HERO_IMAGE="https://cdn.jsdelivr.net/gh/krishna3251/porfolio-test-33@main/public/hero_krishna_vertical.jpg";

const heroWork=[
  {title:"Gaming thumbnails",image:"/images/thumbnails/genshin cinematic.png",href:"/thumbnails"},
  {title:"Skirk / Genshin",image:"/images/thumbnails/genshin skirk.png",href:"/thumbnails"},
  {title:"Wuthering Waves",image:"/images/thumbnails/wuwa cyberpunk 1.png",href:"/thumbnails"},
  {title:"Rukiya",image:"/images/bots/rukiya.png",href:"/projects"},
  {title:"Lxeus",image:"/images/bots/lexus.png",href:"/projects"},
  {title:"Valorant",image:"/images/thumbnails/valorant chamber velo.png",href:"/thumbnails"}
];

export default function HomeHero(){
  const mx=useMotionValue(0), my=useMotionValue(0);
  const sx=useSpring(mx,{stiffness:80,damping:20}), sy=useSpring(my,{stiffness:80,damping:20});
  const move=(event)=>{
    mx.set((event.clientX-window.innerWidth/2)*.012);
    my.set((event.clientY-window.innerHeight/2)*.012);
  };

  return <section className="hero" id="top" onPointerMove={move}>
    <div className="hero-grid" aria-hidden="true"><span/><span/><span/><span/></div>
    <div className="hero-watermark" aria-hidden="true">01</div>
    <pre className="hero-ascii" aria-hidden="true">KRISHNA.STD / CODE + IMAGE</pre>
    <div className="hero-rail" aria-hidden="true"><span>KRISHNA / 2026</span><i/></div>
    <TerminalBar command="init portfolio --mode=creative" meta="BOOT / 01" />
    <div className="hero-topline"><span>CREATIVE DEVELOPER / VISUAL DESIGNER</span><span>INDIA / 2026</span></div>

    <div className="hero-intro-block">
      <div className="hero-copy">
        <div className="hero-availability"><span/><b>AVAILABLE FOR SELECTED WORK</b></div>
        <p className="hero-kicker"><span className="hero-dot"/>I make software &amp; visuals.</p>
        <motion.h1 initial={{opacity:0,y:50}} animate={{opacity:1,y:0}} transition={{duration:.8,ease:[.16,1,.3,1]}}>
          <span className="terminal-prefix">&gt; </span><SquigglyText scale={[2,3]} stepDuration={110}>KRISHNA</SquigglyText><span>.</span><i className="hero-terminal-cursor" aria-hidden="true">█</i>
        </motion.h1>
      </div>
      <motion.div className="hero-portrait hero-portrait-small" style={{x:useTransform(sx,[-15,15],[-2,2]),y:useTransform(sy,[-15,15],[-1.5,1.5])}}>
        <div className="hero-image-frame"><WobbleImage className="absolute inset-0"><Image src={HERO_IMAGE} alt="Krishna" fill priority sizes="(max-width: 840px) 42vw, 22vw" quality={72} className="hero-portrait-image"/></WobbleImage></div>
        <div className="hero-portrait-tag">01 / KRISHNA</div><div className="hero-portrait-scan" aria-hidden="true"/>
      </motion.div>
    </div>

    <div className="hero-work-intro">
      <div><span className="eyebrow">SELECTED WORK / LIVE INDEX</span><h2>Scroll through<br/><em>what I build.</em></h2></div>
      <p>Use the wheel, drag it, or tap the index. Design, AI systems and automation are all part of the same practice.</p>
    </div>

    <div className="hero-wheel-wrap"><SparklesEffect count={34}/><WorksWheel items={heroWork} label="Works '26" action="Open"/></div>

    <div className="hero-profile">
      <div className="hero-profile-index"><span>01 / PROFILE</span><i/></div>
      <div className="hero-profile-copy">
        <p className="hero-profile-lead">I&apos;m Krishna, a BCA graduate and creative developer based in India. I build AI systems, web experiences and gaming visuals where engineering and art need to work together.</p>
        <p>I care about the details people usually skip: clean structure, fast interactions, readable interfaces, useful automation and visuals that have an actual point.</p>
      </div>
      <div className="hero-profile-side"><span>FOCUS</span><strong>AI / WEB / VISUAL</strong><span>STACK</span><strong>PYTHON / REACT / NEXT.JS</strong><div className="hero-actions"><CommandButton href="/thumbnails" label="view-work" cursor="VIEW WORK" accent /><CommandButton href="/projects" label="software" cursor="SOFTWARE" /></div></div>
    </div>

    <div className="hero-bottom"><span>CODE + ART + SOUND</span><Link href="#services">SCROLL <i>↓</i></Link></div>
  </section>;
}
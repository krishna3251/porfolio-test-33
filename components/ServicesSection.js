"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import TerminalBar from "@/components/TerminalBar";

const services=[
  ["01","AI SYSTEMS","LLM apps, automation and useful internal tools.","/projects"],
  ["02","WEB EXPERIENCES","Fast interfaces, interaction and motion with a strong visual system.","/projects"],
  ["03","VISUAL DIRECTION","Gaming thumbnails, composition, art direction and digital visuals.","/thumbnails"]
];

export default function ServicesSection(){
  return <section className="services section" id="services">
    <TerminalBar command="ls ./capabilities" meta="MODE / OUTPUT" />
    <div className="section-marker"><span>03</span><span>SELECTED CAPABILITIES</span><em>WHAT I BUILD</em></div>
    <div className="services-head">
      <div><span className="eyebrow">SERVICES / OUTPUT</span><h2>Different tools.<br/><em>Same obsession.</em></h2></div>
      <p>Software should feel clear. Visuals should feel intentional. The interesting work happens in the overlap.</p>
    </div>
    <div className="services-list service-glass-stack">
      {services.map(([no,title,text,href],i)=><Link href={href} key={no} className="service-card service-glass-card" style={{"--r": i===0 ? -7 : i===2 ? 7 : 0}} data-cursor={title}>
        <span className="service-no">{no}</span>
        <motion.div className="service-orb" initial={{scale:.7,opacity:.15}} whileInView={{scale:1,opacity:.65}} viewport={{once:true}} transition={{duration:.6,delay:i*.07}}><span/></motion.div>
        <div className="service-main"><h3>{title}<b>.</b></h3><p>{text}</p><span className="service-command">./open --{title.toLowerCase().replace(/\s+/g,"-")}</span></div>
        <span className="service-arrow">↗</span>
      </Link>)}
    </div>
  </section>;
}
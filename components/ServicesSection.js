"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import TerminalBar from "@/components/TerminalBar";
import SquigglyText from "@/components/ui/squiggly-text";
import useSiteMedia from "@/hooks/useSiteMedia";

const services=[
  ["01","AI SYSTEMS","LLM apps, automation and useful internal tools.","/projects","serviceAI","/images/bots/lexus.png"],
  ["02","WEB EXPERIENCES","Fast interfaces, interaction and motion with a strong visual system.","/projects","serviceWeb","/hero_krishna.jpg"],
  ["03","VISUAL DIRECTION","Gaming thumbnails, composition, art direction and digital visuals.","/thumbnails","serviceVisual","/images/genshin%20cinematic.png"]
];

function crop(settings){
  return {objectFit:settings?.fit==="contain"?"contain":"cover",objectPosition:(settings?.positionX??50)+"% "+(settings?.positionY??50)+"%",transform:"scale("+Math.min(2.5,Math.max(.5,Number(settings?.scale)||1))+")",opacity:settings?.visible===false?0:(settings?.opacity??.22)};
}

export default function ServicesSection(){
  const {media}=useSiteMedia();
  const slots=media.slots||{};
  return <section className="services section" id="services">
    <TerminalBar command="ls ./capabilities" meta="MODE / OUTPUT" />
    <div className="section-marker"><span>03</span><span>SELECTED CAPABILITIES</span><em>WHAT I BUILD</em></div>
    <div className="services-head">
      <div><span className="eyebrow">SERVICES / OUTPUT</span><h2>Different tools.<br/><em><SquigglyText scale={2.5}>Same obsession.</SquigglyText></em></h2></div>
      <p>Software should feel clear. Visuals should feel intentional. The interesting work happens in the overlap.</p>
    </div>
    <div className="services-list service-glass-stack editorial-service-grid">
      {services.map(([no,title,text,href,slot,defaultImage],i)=>{
        const settings=slots[slot]||{};
        return <Link href={href} key={no} className="service-card service-glass-card editorial-service-card" style={{"--r":i===0?-2:i===2?2:0}} data-cursor={title}>
          <div className="service-card-media"><img src={settings.src||defaultImage} alt="" loading="lazy" style={crop(settings)}/><span style={{backgroundColor:settings.overlayColor||"#191e1d",opacity:settings.overlayOpacity??.5}}/></div>
          <span className="service-no">{no}</span>
          <motion.div className="service-orb" initial={{scale:.7,opacity:.15}} whileInView={{scale:1,opacity:.65}} viewport={{once:true}} transition={{duration:.6,delay:i*.07}}><span/></motion.div>
          <div className="service-main"><h3>{title}<b>.</b></h3><p>{text}</p><span className="service-command">./open --{title.toLowerCase().replace(/\s+/g,"-")}</span></div>
          <span className="service-arrow">↗</span>
        </Link>;
      })}
    </div>
  </section>;
}

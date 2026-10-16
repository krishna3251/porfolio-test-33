"use client";
import { motion } from "framer-motion";
import TerminalBar from "@/components/TerminalBar";
import SquigglyText from "@/components/ui/squiggly-text";
import useSiteMedia from "@/hooks/useSiteMedia";

const projects=[
  ["01","Lxeus","DISCORD / AI","Moderation, automation and intelligent interaction for communities.","https://github.com/krishna3251/lexus_dc.git","botLxeus","/images/bots/lexus.png"],
  ["02","Rukiya","BOT / SYSTEM DESIGN","A configurable Discord architecture built to automate repetitive community setup.","https://github.com/rukia3287-jpg/rukiya.git","botRukiya","/images/bots/rukiya.png"],
  ["03","Damu","PYTHON / CONFIGURATION","A template compiler that turns structured layouts into deployable server configuration.","https://github.com/krishnverma32/damu-server-builder","botDamu","/images/bots/deku.png"],
  ["04","AI Chatbot","PYTHON / LLM","A conversational experiment exploring memory, intent and structured AI responses.","https://github.com/krishna3251?tab=repositories","heroPortrait","/hero_krishna_vertical.jpg"]
];

function imageStyle(settings){
  return {objectFit:settings?.fit==="contain"?"contain":"cover",objectPosition:(settings?.positionX??50)+"% "+(settings?.positionY??50)+"%",transform:"scale("+Math.min(2.5,Math.max(.5,Number(settings?.scale)||1))+")",opacity:settings?.visible===false?0:(settings?.opacity??1)};
}

export default function ProjectsSection(){
  const {media}=useSiteMedia();
  const slots=media.slots||{};
  return <section className="project-index editorial-project-index">
    <TerminalBar command="ls ./projects --long" meta="INDEX / 04" />
    <div className="project-live-row"><span><i/> BUILD INDEX ONLINE</span><span>04 SYSTEMS / 2026</span><span>SCROLL ↓</span></div>
    <div className="section-marker"><span>03</span><span>PROJECT INDEX</span></div>
    <div className="project-intro">
      <div><span className="eyebrow">SOFTWARE / SELECTED</span><h1>Software<br/><em><SquigglyText scale={2.5}>with character.</SquigglyText></em></h1></div>
      <p>Systems, bots and experiments built around real use cases. Each project is a working system, not a dashboard pretending to be a spaceship.</p>
    </div>
    <div className="project-list editorial-project-list">
      {projects.map(([no,name,type,desc,url,slot,defaultImage],index)=>{
        const settings=slots[slot]||{};
        return <motion.a key={no} href={url} target="_blank" rel="noreferrer" className="project-row editorial-project-row" initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:"-30px"}} transition={{duration:.5,delay:index*.045,ease:[.16,1,.3,1]}}>
          <span className="project-no">{no}</span>
          <div className="project-thumb"><img src={settings.src||defaultImage} alt="" loading="lazy" style={imageStyle(settings)}/></div>
          <div className="project-name"><span>{type}</span><h2>{name}<b>.</b></h2></div>
          <p>{desc}</p>
          <strong>↗</strong>
        </motion.a>;
      })}
    </div>
    <div className="project-footer-note"><span>EVERYTHING STARTS WITH A PROBLEM.</span><span>THE INTERFACE IS THE LAST 10%.</span></div>
    <div className="project-bottom"><a href="/bots">Explore bot systems ↗</a><a href="https://github.com/krishna3251?tab=repositories" target="_blank" rel="noreferrer">All repositories ↗</a></div>
  </section>;
}

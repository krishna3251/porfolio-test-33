"use client";
import { motion } from "framer-motion";

const projects=[
  ["01","Lxeus","DISCORD / AI","Moderation, automation and intelligent interaction for communities.","https://github.com/krishna3251/lexus_dc.git"],
  ["02","Rukiya","BOT / SYSTEM DESIGN","A configurable Discord architecture built to automate repetitive community setup.","https://github.com/rukia3287-jpg/rukiya.git"],
  ["03","Damu","PYTHON / CONFIGURATION","A template compiler that turns structured layouts into deployable server configuration.","https://github.com/krishnverma32/damu-server-builder"],
  ["04","AI Chatbot","PYTHON / LLM","A conversational experiment exploring memory, intent and structured AI responses.","https://github.com/krishna3251?tab=repositories"]
];

export default function ProjectsSection(){
  return <section className="project-index">
    <div className="project-live-row"><span><i/> BUILD INDEX ONLINE</span><span>04 SYSTEMS / 2026</span><span>SCROLL ↓</span></div>
    <div className="section-marker"><span>03</span><span>PROJECT INDEX</span></div>
    <div className="project-intro">
      <div><span className="eyebrow">SOFTWARE / SELECTED</span><h1>Software<br/><em>with character.</em></h1></div>
      <p>Systems, bots and experiments built around real use cases. Structured like work, not a dashboard pretending to be a spaceship.</p>
    </div>
    <div className="project-list">
      {projects.map(([no,name,type,desc,url])=><motion.a key={no} href={url} target="_blank" rel="noreferrer" className="project-row" initial={{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:"-30px"}} transition={{duration:.5,ease:[.16,1,.3,1]}}>
        <span className="project-no">{no}</span>
        <div className="project-name"><span>{type}</span><h2>{name}<b>.</b></h2></div>
        <p>{desc}</p>
        <strong>↗</strong>
      </motion.a>)}
    </div>
    <div className="project-footer-note"><span>EVERYTHING STARTS WITH A PROBLEM.</span><span>THE INTERFACE IS THE LAST 10%.</span></div>
    <div className="project-bottom"><a href="/bots">Explore bot systems ↗</a><a href="https://github.com/krishna3251?tab=repositories" target="_blank" rel="noreferrer">All repositories ↗</a></div>
  </section>;
}
"use client";

import { motion } from "framer-motion";

const projects=[
  {name:"Lxeus",type:"Discord moderation + AI",desc:"A moderation and chat system built around automation, server utilities and intelligent interaction.",repo:"https://github.com/krishna3251/lexus_dc.git",meta:"PYTHON / AI / AUTOMATION"},
  {name:"Rukiya",type:"Discord automation",desc:"A configurable server architecture and interaction bot designed to automate repetitive community setup.",repo:"https://github.com/rukia3287-jpg/rukiya.git",meta:"BOT / SYSTEM DESIGN"},
  {name:"Damu",type:"Guild configuration compiler",desc:"A Python system for turning structured server templates into deployable guild configurations.",repo:"https://github.com/krishnverma32/damu-server-builder",meta:"PYTHON / CONFIGURATION"},
  {name:"AI Chatbot",type:"Python / Streamlit",desc:"A conversational application exploring memory, intent and structured AI responses.",repo:"#",meta:"PYTHON / LLM / UI"}
];

export default function ProjectsSection(){
  return <div>
    <div className="grid lg:grid-cols-12 gap-7 items-end mb-10">
      <div className="lg:col-span-8">
        <p className="mono-metadata text-hot">PROJECT INDEX / 2026</p>
        <h1 className="page-display mt-3">Software with<br/><i>personality.</i></h1>
      </div>
      <p className="lg:col-span-4 text-sm md:text-base text-black/55 leading-relaxed">The engineering side of the portfolio. Systems, bots and experiments presented as work, not a telemetry dashboard pretending to be a spaceship.</p>
    </div>

    <div className="grid gap-5">
      {projects.map((p,i)=><motion.a
        key={p.name}
        href={p.repo}
        target={p.repo==="#"?"_self":"_blank"}
        rel="noreferrer"
        initial={{opacity:0,y:28}}
        whileInView={{opacity:1,y:0}}
        viewport={{once:true,margin:"-60px"}}
        transition={{duration:.65,delay:i*.06,ease:[.16,1,.3,1]}}
        whileHover={{y:-6}}
        className="project-card"
      >
        <div className="project-index">0{i+1}</div>
        <div className="project-main">
          <div className="flex items-center gap-3">
            <span className="project-dot"/>
            <span className="mono-metadata text-black/40">{p.meta}</span>
          </div>
          <h2 className="font-mono text-4xl md:text-6xl font-black tracking-[-.07em] mt-4">{p.name}<span className="text-hot">.</span></h2>
        </div>
        <div className="project-copy">
          <p className="mono-metadata text-hot text-[8px]">{p.type}</p>
          <p className="mt-3 text-sm leading-relaxed text-black/60">{p.desc}</p>
        </div>
        <div className="project-arrow">↗</div>
      </motion.a>)}
    </div>

    <div className="mt-7 grid md:grid-cols-2 gap-4">
      <a href="/bots" className="glass-panel p-6 flex items-center justify-between group">
        <div><p className="mono-metadata text-hot">DEEP DIVE</p><p className="mt-2 font-mono font-bold">Bot systems / demos</p></div>
        <span className="text-hot text-2xl group-hover:translate-x-1 transition-transform">→</span>
      </a>
      <a href="https://github.com/krishna3251?tab=repositories" target="_blank" rel="noreferrer" className="glass-panel p-6 flex items-center justify-between group">
        <div><p className="mono-metadata text-black/40">GITHUB</p><p className="mt-2 font-mono font-bold">Browse all repositories</p></div>
        <span className="text-hot text-2xl group-hover:translate-x-1 transition-transform">↗</span>
      </a>
    </div>
  </div>;
}
"use client";

const projects=[
  {name:"Lxeus",type:"Discord moderation + AI",desc:"A moderation and chat system built around automation, server utilities and intelligent interaction.",repo:"https://github.com/krishna3251/lexus_dc.git"},
  {name:"Rukiya",type:"Discord automation",desc:"A configurable server architecture and interaction bot designed to automate repetitive community setup.",repo:"https://github.com/rukia3287-jpg/rukiya.git"},
  {name:"Damu",type:"Guild configuration compiler",desc:"A Python system for turning structured server templates into deployable guild configurations.",repo:"https://github.com/krishnverma32/damu-server-builder"},
  {name:"AI Chatbot",type:"Python / Streamlit",desc:"A conversational application exploring memory, intent and structured AI responses.",repo:"#"}
];

export default function ProjectsSection(){
  return <div>
    <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 mb-2">
      <div><p className="mono-metadata text-primary mb-3">05 / Systems</p><h2 className="serif-display text-5xl md:text-7xl">Software I’ve built</h2></div>
      <p className="text-sm text-muted max-w-sm mt-4 md:mt-0">A few projects from the engineering side of the portfolio.</p>
    </div>
    <div className="divide-y divide-white/10 border-b border-white/10">
      {projects.map((p,i)=><a key={p.name} href={p.repo} target={p.repo==="#"?"_self":"_blank"} rel="noreferrer" className="group grid md:grid-cols-12 gap-5 py-7 hover:px-3 transition-all">
        <span className="mono-metadata text-muted md:col-span-1">0{i+1}</span>
        <div className="md:col-span-4"><h3 className="serif-display text-3xl group-hover:text-primary transition-colors">{p.name}</h3><p className="mono-metadata text-[8px] text-muted mt-2">{p.type}</p></div>
        <p className="text-sm text-muted leading-relaxed md:col-span-5">{p.desc}</p>
        <span className="md:col-span-2 md:text-right text-primary opacity-60 group-hover:opacity-100">View ↗</span>
      </a>)}
    </div>
  </div>
}

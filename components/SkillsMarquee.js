"use client";
import { motion } from "framer-motion";

export default function SkillsMarquee(){
  const groups=[["SOFTWARE","Python","JavaScript","Java","C++","SQL"],["AI + SYSTEMS","LLM apps","OpenRouter","REST APIs","Discord API","Automation"],["WEB","Next.js","React","Tailwind","Framer Motion","GitHub"],["VISUAL","Photoshop","Thumbnail design","Digital art","Composition","Art direction"]];
  return <section className="skills section" id="skills">
    <div className="section-marker"><span>04</span><span>CAPABILITIES</span></div>
    <div className="skills-head"><span className="eyebrow">CAPABILITIES / STACK</span><h2>What I<br/><em>work with.</em></h2></div>
    <motion.div className="skill-grid" initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:"-70px"}} transition={{duration:.65,ease:[.16,1,.3,1]}}>
      {groups.map(([title,...items])=><div className="skill-box" key={title}>
        <span className="skill-title">{title}<b>↗</b></span>
        {items.map((x,i)=><span className="skill-item" key={x}><i>{String(i+1).padStart(2,"0")}</i>{x}</span>)}
      </div>)}
    </motion.div>
    <div className="skills-ticker" aria-hidden="true"><span>BUILD / DESIGN / ITERATE / SHIP / BUILD / DESIGN / ITERATE / SHIP /</span></div>
  </section>;
}
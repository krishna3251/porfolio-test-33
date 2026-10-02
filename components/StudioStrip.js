"use client";
import { motion } from "framer-motion";

const items=[
  ["01","56","VISUAL PIECES","Thumbnail archive"],
  ["02","04","SOFTWARE BUILDS","Projects & systems"],
  ["03","03","CORE DISCIPLINES","AI / WEB / VISUAL"],
  ["04","∞","ITERATE","Ship, learn, repeat"]
];

export default function StudioStrip(){
  return <section className="studio-strip" aria-label="Portfolio overview">
    <div className="studio-strip-inner">
      {items.map(([no,value,label,desc],i)=><motion.div key={no} className="studio-stat" initial={{opacity:0,y:12}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.45,delay:i*.06}}>
        <span className="studio-stat-no">{no}</span>
        <div className="studio-stat-main"><strong>{value}</strong><span>{label}</span></div>
        <p>{desc}</p>
      </motion.div>)}
    </div>
    <div className="studio-marquee" aria-hidden="true"><span>AI SYSTEMS / WEB EXPERIENCES / VISUAL DESIGN / MOTION / AI SYSTEMS / WEB EXPERIENCES / VISUAL DESIGN / MOTION / </span></div>
  </section>;
}
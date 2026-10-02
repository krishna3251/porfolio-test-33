"use client";
import { motion } from "framer-motion";
import TerminalBar from "@/components/TerminalBar";
import SquigglyText from "@/components/ui/squiggly-text";

export default function AboutSection(){
  return <section className="about section" id="about">
    <TerminalBar command="whoami --profile" meta="USER / KRISHNA" />
    <div className="about-index"><span className="eyebrow">ABOUT</span><strong>03</strong></div>
    <motion.div className="about-body" initial={{opacity:0,y:28}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:"-80px"}} transition={{duration:.7}}>
      <div className="about-signal"><span/><span>PROFILE / CURRENT</span></div>
      <h2>I like useful things.<br/><em><SquigglyText scale={2.5}>I also like beautiful things.</SquigglyText></em></h2>
      <div className="about-copy">
        <p className="about-lead">I&apos;m Krishna, a developer who moves comfortably between code and visual design.</p>
        <p>My work spans Python systems, AI applications, automation, web projects and gaming artwork. I care about the boring parts too: structure, speed, accessibility, maintainability and actually shipping.</p>
      </div>
      <div className="about-facts">{[["FOCUS","AI + WEB"],["TOOLS","PYTHON / REACT"],["VISUAL","GAMING ART"],["STATUS","BUILDING"]].map(([a,b])=><div key={a}><span>{a}</span><strong>{b}</strong></div>)}</div>
    </motion.div>
  </section>;
}
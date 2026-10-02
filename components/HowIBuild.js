"use client";
import { motion } from "framer-motion";

export default function HowIBuild(){
  const rows=[["01","Understand","Start with the problem, the person and the actual outcome."],["02","Build","Break the idea into clear pieces and make them work."],["03","Refine","Test the real thing and remove friction."],["04","Ship","Put it in people&apos;s hands, learn, then improve."]];
  return <section className="process section" id="process">
    <div className="section-marker"><span>05</span><span>PROCESS</span></div>
    <div className="process-heading"><span className="eyebrow">PROCESS / HOW IT WORKS</span><h2>How I<br/><em>build.</em></h2></div>
    <div className="process-list">{rows.map(([no,title,text])=><motion.div className="process-row" key={no} initial={{opacity:0,x:18}} whileInView={{opacity:1,x:0}} viewport={{once:true,margin:"-30px"}} transition={{duration:.45,delay:Number(no)*.04,ease:[.16,1,.3,1]}}><span>{no}</span><h3>{title}<b>.</b></h3><p>{text}</p><strong>↗</strong></motion.div>)}</div>
  </section>;
}
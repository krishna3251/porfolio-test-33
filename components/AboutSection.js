"use client";
import { motion } from "framer-motion";
export default function AboutSection(){
 return <section className="portfolio-about" id="about">
  <div><span className="portfolio-kicker">About</span><h2 className="mt-5">A developer<br/><em>with a visual eye.</em></h2></div>
  <motion.div initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:"-10%"}} transition={{duration:.7}}>
   <p className="portfolio-about-lead">I’m Krishna, a BCA developer who likes building useful software and making it feel good to use.</p>
   <div className="portfolio-about-grid">
    <p>My work spans Python systems, AI applications, Discord automation, APIs and web projects. I like taking messy ideas, breaking them into reliable pieces, and actually shipping them.</p>
    <p>Outside software, I create gaming thumbnails and digital artwork. That work taught me composition, hierarchy, contrast and how to direct attention, which now influences how I design interfaces too.</p>
   </div>
   <div className="portfolio-facts">
    {[["Based","India"],["Focus","Python + AI"],["Visuals","Gaming art"],["Status","Building"]].map(([a,b])=><div className="portfolio-fact" key={a}><small>{a}</small><strong className={a==="Status"?"text-hot":""}>{b}</strong></div>)}
   </div>
  </motion.div>
 </section>;
}
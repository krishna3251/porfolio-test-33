"use client";
import { motion } from "framer-motion";
export default function AboutSection(){
 return <div className="home-section">
  <div className="section-number">02</div>
  <div className="grid lg:grid-cols-12 gap-10 lg:gap-20">
   <div className="lg:col-span-4"><p className="mono-metadata text-hot mb-4">02 / ABOUT</p><h2 className="editorial-heading-sm">Code with<br/><span className="editorial-italic">character.</span></h2></div>
   <motion.div initial={{opacity:0,y:25}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:"-10%"}} className="lg:col-span-8">
    <p className="text-xl md:text-2xl leading-9 max-w-3xl text-black/75">I’m a BCA developer who enjoys building useful software and making things look good while doing it.</p>
    <div className="mt-9 grid md:grid-cols-2 gap-8 text-sm leading-7 text-black/50"><p>My work spans Python systems, Discord bots, AI applications, APIs and web projects. I like taking an idea, breaking it into reliable pieces, and actually shipping the thing.</p><p>Outside software, I create gaming thumbnails and digital artwork. That visual work has taught me composition, hierarchy, contrast and how to make a viewer notice the right thing first.</p></div>
    <div className="mt-12 pt-5 border-t border-black/10 grid grid-cols-2 md:grid-cols-4 gap-5">{[["BASE","India"],["FOCUS","Python + AI"],["CREATIVE","Gaming visuals"],["STATUS","Building"]].map(([a,b])=><div key={a}><p className="mono-metadata text-black/35">{a}</p><p className={"mt-2 font-medium "+(a==="STATUS"?"text-hot":"")}>{b}</p></div>)}</div>
   </motion.div>
  </div>
 </div>;
}
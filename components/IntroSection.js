"use client";
import { motion } from "framer-motion";

const tags=["Python","AI applications","Discord systems","Web","Gaming visuals"];

export default function IntroSection(){
 return <section id="intro" className="home-section relative py-24 md:py-36">
  <div className="section-number">01</div>
  <div className="grid lg:grid-cols-12 gap-8 lg:gap-14 relative z-10">
   <div className="lg:col-span-3">
    <p className="mono-metadata text-hot">01 / INTRODUCTION</p>
    <div className="orange-line mt-5"/>
    <p className="mt-6 max-w-xs text-sm leading-7 text-black/50">Code, composition and motion treated as one creative practice.</p>
   </div>
   <div className="lg:col-span-9">
    <motion.h2 initial={{opacity:0,y:35}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:"-12%"}} transition={{duration:.8,ease:[.16,1,.3,1]}} className="editorial-heading">
      I build useful things,<span className="block editorial-italic">then make them feel alive.</span>
    </motion.h2>
    <div className="mt-12 grid md:grid-cols-12 gap-8 items-start">
      <p className="md:col-span-7 text-lg md:text-xl leading-8 text-black/65">I work across software and visual design: Python systems, AI applications, Discord automation, web experiments, gaming thumbnails and digital artwork. The goal is not to decorate a technical project. The goal is to make the whole thing feel intentional.</p>
      <div className="md:col-span-5 intro-tags">
       <p className="mono-metadata text-black/40 mb-4">CURRENT FIELD</p>
       <div className="flex flex-wrap gap-2">{tags.map((tag,i)=><span key={tag} className="tag-chip"><b className={i%2?"text-hot":"text-black"}>+</b>{tag}</span>)}</div>
      </div>
    </div>
    <div className="mt-14 grid grid-cols-2 md:grid-cols-4 border-y border-black/10">
      {[["BASE","INDIA"],["FOCUS","PYTHON / AI"],["VISUALS","GAMING ART"],["MODE","BUILD + EXPERIMENT"]].map(([a,b])=><div key={a} className="py-5 pr-4 border-r last:border-r-0 border-black/10"><p className="mono-metadata text-black/35">{a}</p><p className="mt-2 text-sm font-bold">{b}</p></div>)}
    </div>
   </div>
  </div>
 </section>;
}
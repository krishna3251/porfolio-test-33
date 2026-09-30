"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

const work=[
  {
    number:"01",
    type:"VISUAL DESIGN",
    title:"Gaming thumbnails",
    text:"A growing archive of gaming artwork built around composition, character, typography and visual impact.",
    image:"/images/genshin cinematic.png",
    href:"/thumbnails",
    label:"Explore thumbnails"
  },
  {
    number:"02",
    type:"SOFTWARE / AI",
    title:"Rukiya",
    text:"Automation and AI systems designed around real community workflows, memory and structured decisions.",
    image:"/images/wuwa.png",
    href:"/projects",
    label:"View projects"
  },
  {
    number:"03",
    type:"SOFTWARE / AUTOMATION",
    title:"Lxeus",
    text:"Discord tooling combining moderation, automation and intelligent interaction into one practical system.",
    image:"/images/valorant.png",
    href:"/projects",
    label:"See the work"
  }
];

export default function SelectedWork(){
  return <section id="work" className="portfolio-work">
    <div className="portfolio-work-head">
      <div>
        <span className="portfolio-kicker">Selected work</span>
        <h2 className="portfolio-display">Things I’ve<br/><em>made.</em></h2>
      </div>
      <p>Software and visual work live in the same portfolio because they come from the same obsession: making useful things feel intentional.</p>
    </div>

    <div className="portfolio-work-list">
      {work.map((item,i)=><motion.article
        key={item.number}
        className="portfolio-case"
        initial={{opacity:0,y:45}}
        whileInView={{opacity:1,y:0}}
        viewport={{once:true,margin:"-80px"}}
        transition={{duration:.7,delay:i*.08,ease:[.16,1,.3,1]}}
      >
        <div className="portfolio-case-meta">
          <span>{item.number}</span>
          <span>{item.type}</span>
        </div>
        <div className="portfolio-case-image">
          <Image
            src={item.image}
            alt={item.title}
            fill
            priority={i===0}
            quality={74}
            sizes="(max-width: 800px) 100vw, 62vw"
            className="object-cover"
          />
        </div>
        <div className="portfolio-case-copy">
          <h3>{item.title}</h3>
          <p>{item.text}</p>
          <Link href={item.href}>{item.label} <span>↗</span></Link>
        </div>
      </motion.article>)}
    </div>

    <div className="portfolio-work-footer">
      <span>More work in the archive</span>
      <Link href="/thumbnails">Open full archive ↗</Link>
    </div>
  </section>;
}

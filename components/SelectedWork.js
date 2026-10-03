"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { getThumbnailSrc } from "@/lib/thumbnails";
import TerminalBar from "@/components/TerminalBar";
import WobbleImage from "@/components/WobbleImage";
import SquigglyText from "@/components/ui/squiggly-text";

const work=[
  {no:"01",label:"VISUAL DESIGN",title:"Gaming thumbnails",text:"Character-led compositions, dramatic typography and art direction made to win attention in one frame.",filename:"genshin cinematic.png",href:"/thumbnails"},
  {no:"02",label:"AI / SOFTWARE",title:"Rukiya",text:"A practical automation system for communities, built around memory, decisions and reliable workflows.",filename:"https://cdn.jsdelivr.net/gh/krishna3251/porfolio-test-33@main/public/images/bots/rukiya.png",href:"/projects"},
  {no:"03",label:"AUTOMATION",title:"Lxeus",text:"Moderation and intelligent interaction tools for Discord, focused on useful automation instead of noise.",filename:"https://cdn.jsdelivr.net/gh/krishna3251/porfolio-test-33@main/public/images/bots/lexus.png",href:"/projects"}
];

export default function SelectedWork(){
  return <section className="selected-work section">
    <TerminalBar command="cat ./selected-work" meta="INDEX / 03" />
    <div className="section-marker"><span>02</span><span>SELECTED WORK</span><em>03 CASE STUDIES</em></div>
    <div className="section-heading">
      <div><span className="eyebrow">WORK / SELECTED</span><h2>Made with<br/><em><SquigglyText scale={2.5}>intent.</SquigglyText></em></h2></div>
      <p>Three different outputs, one approach: make the thing clear, useful and visually hard to ignore.</p>
    </div>
    <div className="case-list">
      {work.map((item,i)=><motion.article key={item.no} className={`case-row ${i%2?"reverse":""}`} initial={{opacity:0,y:36}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:"-70px"}} transition={{duration:.65,ease:[.16,1,.3,1]}}>
        <div className="case-no"><span>{item.no}</span><i>0{i+1}</i></div>
        <Link href={item.href} className="case-image-wrap" data-cursor="VIEW">
          <WobbleImage className="absolute inset-0">
            <Image src={item.filename.startsWith("http") ? item.filename : getThumbnailSrc(item.filename)} alt={item.title} fill loading="lazy" quality={72} sizes="(max-width: 840px) 100vw, 58vw" className="case-image"/>
          </WobbleImage>
          <span className="case-view">VIEW <b>↗</b></span>
          <span className="case-corner" aria-hidden="true"/>
        </Link>
        <div className="case-copy">
          <span className="eyebrow">{item.label}</span><h3>{item.title}<sup>.</sup></h3><p>{item.text}</p>
          <Link href={item.href} className="text-link" data-cursor="OPEN PROJECT">Open project <span>↗</span></Link>
        </div>
      </motion.article>)}
    </div>
    <Link href="/thumbnails" className="archive-link" data-cursor="ARCHIVE">Explore the full archive <span>↗</span></Link>
  </section>;
}
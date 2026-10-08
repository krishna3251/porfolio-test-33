"use client";
import Link from "next/link";
import { getThumbnailSrc } from "@/lib/thumbnails";
import TerminalBar from "@/components/TerminalBar";
import SquigglyText from "@/components/ui/squiggly-text";
import WorksWheel from "@/components/ui/works-wheel";
import SparklesEffect from "@/components/ui/sparkles-effect";

const work=[
  {no:"01",label:"VISUAL DESIGN",title:"Gaming thumbnails",text:"Character-led compositions and art direction built to win attention in one frame.",filename:"genshin cinematic.png",href:"/thumbnails"},
  {no:"02",label:"VISUAL DESIGN",title:"Skirk / Genshin",text:"High-impact character composition with cinematic contrast and editorial thumbnail direction.",filename:"genshin skirk.png",href:"/thumbnails"},
  {no:"03",label:"VISUAL DESIGN",title:"Wuthering Waves",text:"Anime gaming artwork shaped around atmosphere, hierarchy and a strong focal character.",filename:"wuwa cyberpunk 1.png",href:"/thumbnails"},
  {no:"04",label:"AI / SOFTWARE",title:"Rukiya",text:"A practical automation system for communities, built around memory, decisions and reliable workflows.",filename:"/images/bots/rukiya.png",href:"/projects"},
  {no:"05",label:"AUTOMATION",title:"Lxeus",text:"Moderation and intelligent interaction tools for Discord, focused on useful automation instead of noise.",filename:"/images/bots/lexus.png",href:"/projects"},
  {no:"06",label:"VISUAL DESIGN",title:"Valorant",text:"Agent-focused gaming visuals using strong framing, readable hierarchy and controlled energy.",filename:"valorant chamber velo.png",href:"/thumbnails"}
];

export default function SelectedWork(){
  const wheelItems=work.map(item=>({
    title:item.title,
    image:item.filename.startsWith("/")?item.filename:getThumbnailSrc(item.filename),
    href:item.href
  }));
  return <section className="selected-work section">
    <TerminalBar command="cat ./selected-work" meta="INDEX / 06" />
    <div className="section-marker"><span>02</span><span>SELECTED WORK</span><em>06 WORKS</em></div>
    <div className="section-heading"><div><span className="eyebrow">WORK / SELECTED</span><h2>Made with<br/><em><SquigglyText scale={2.5}>intent.</SquigglyText></em></h2></div><p>Visual design, AI systems and automation. Turn the wheel to move through the work.</p></div>
    <div className="selected-work-visual"><SparklesEffect count={42} /><WorksWheel items={wheelItems} label="Works '26" action="View" /></div>
    <div className="selected-work-wheel-details">
      {work.map(item=><Link key={item.no} href={item.href} className="selected-work-detail"><span>{item.no}</span><div><small>{item.label}</small><strong>{item.title}</strong><p>{item.text}</p></div><b>↗</b></Link>)}
    </div>
    <Link href="/thumbnails" className="archive-link" data-cursor="ARCHIVE">Explore the full archive <span>↗</span></Link>
  </section>;
}

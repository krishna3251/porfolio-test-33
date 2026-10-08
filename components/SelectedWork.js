"use client";
import Link from "next/link";
import { getThumbnailSrc } from "@/lib/thumbnails";
import TerminalBar from "@/components/TerminalBar";
import SquigglyText from "@/components/ui/squiggly-text";
import WorksWheel from "@/components/ui/works-wheel";

const work=[
  {no:"01",label:"VISUAL DESIGN",title:"Gaming thumbnails",text:"Character-led compositions, dramatic typography and art direction made to win attention in one frame.",filename:"genshin cinematic.png",href:"/thumbnails"},
  {no:"02",label:"AI / SOFTWARE",title:"Rukiya",text:"A practical automation system for communities, built around memory, decisions and reliable workflows.",filename:"/images/bots/rukiya.png",href:"/projects"},
  {no:"03",label:"AUTOMATION",title:"Lxeus",text:"Moderation and intelligent interaction tools for Discord, focused on useful automation instead of noise.",filename:"/images/bots/lexus.png",href:"/projects"}
];

export default function SelectedWork(){
  const wheelItems=work.map(item=>({title:item.title,image:item.filename.startsWith("/")?item.filename:getThumbnailSrc(item.filename),href:item.href}));
  return <section className="selected-work section">
    <TerminalBar command="cat ./selected-work" meta="INDEX / 03" />
    <div className="section-marker"><span>02</span><span>SELECTED WORK</span><em>03 CASE STUDIES</em></div>
    <div className="section-heading"><div><span className="eyebrow">WORK / SELECTED</span><h2>Made with<br/><em><SquigglyText scale={2.5}>intent.</SquigglyText></em></h2></div><p>Three different outputs, one approach: make the thing clear, useful and visually hard to ignore.</p></div>
    <WorksWheel items={wheelItems} label="Works '26" action="View" />
    <div className="selected-work-wheel-details">
      {work.map(item=><Link key={item.no} href={item.href} className="selected-work-detail"><span>{item.no}</span><div><small>{item.label}</small><strong>{item.title}</strong><p>{item.text}</p></div><b>↗</b></Link>)}
    </div>
    <Link href="/thumbnails" className="archive-link" data-cursor="ARCHIVE">Explore the full archive <span>↗</span></Link>
  </section>;
}

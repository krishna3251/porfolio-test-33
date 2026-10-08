"use client";
import Link from "next/link";
import TerminalBar from "@/components/TerminalBar";
import SquigglyText from "@/components/ui/squiggly-text";

const work=[
  ["01","VISUAL DESIGN","Gaming thumbnails","Character-led compositions and art direction built to win attention in one frame.","/thumbnails"],
  ["02","VISUAL DESIGN","Skirk / Genshin","High-impact character composition with cinematic contrast and editorial thumbnail direction.","/thumbnails"],
  ["03","VISUAL DESIGN","Wuthering Waves","Anime gaming artwork shaped around atmosphere, hierarchy and a strong focal character.","/thumbnails"],
  ["04","AI / SOFTWARE","Rukiya","A practical automation system for communities, built around memory, decisions and reliable workflows.","/projects"],
  ["05","AUTOMATION","Lxeus","Moderation and intelligent interaction tools for Discord, focused on useful automation instead of noise.","/projects"],
  ["06","VISUAL DESIGN","Valorant","Agent-focused gaming visuals using strong framing, readable hierarchy and controlled energy.","/thumbnails"]
];

export default function SelectedWork(){
  return <section className="selected-work section" id="work">
    <TerminalBar command="cat ./selected-work" meta="INDEX / 06" />
    <div className="section-marker"><span>02</span><span>SELECTED WORK</span><em>06 WORKS</em></div>
    <div className="section-heading"><div><span className="eyebrow">WORK / SELECTED</span><h2>Made with<br/><em><SquigglyText scale={2.5}>intent.</SquigglyText></em></h2></div><p>The hero wheel is the live index. This is the clean reference list, because humans occasionally need to read things instead of spinning them around in 3D.</p></div>
    <div className="selected-work-list">{work.map(([no,label,title,text,href])=><Link key={no} href={href} className="selected-work-row"><span className="selected-work-no">{no}</span><div><small>{label}</small><strong>{title}</strong><p>{text}</p></div><b>↗</b></Link>)}</div>
    <Link href="/thumbnails" className="archive-link" data-cursor="ARCHIVE">Explore the full archive <span>↗</span></Link>
  </section>;
}
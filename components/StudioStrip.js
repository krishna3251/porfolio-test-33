"use client";
import TerminalBar from "@/components/TerminalBar";

export default function StudioStrip({thumbnailCount}){
  const items = [
    ["01",String(thumbnailCount).padStart(2,"0"),"VISUAL PIECES","Thumbnail archive"],
    ["02","04","SOFTWARE BUILDS","Projects & systems"],
    ["03","03","CORE DISCIPLINES","AI / WEB / VISUAL"],
    ["04","∞","ITERATE","Ship, learn, repeat"],
  ];

  return <section className="studio-strip" aria-label="Portfolio overview">
    <TerminalBar command="status --summary" meta="SYSTEM / ONLINE" />
    <div className="studio-strip-inner">
      {items.map(([no,value,label,desc],i)=><div key={no} className="studio-stat">
        <span className="studio-stat-no">{no}</span>
        <div className="studio-stat-main"><strong>{value}</strong><span>{label}</span></div>
        <p>{desc}</p><span className="studio-progress" aria-hidden="true"><i style={{width:`${Math.min(100,20+(i*23))}%`}}/></span>
      </div>)}
    </div>
    <div className="studio-marquee" aria-hidden="true"><span>AI SYSTEMS / WEB EXPERIENCES / VISUAL DESIGN / MOTION / AI SYSTEMS / WEB EXPERIENCES / VISUAL DESIGN / MOTION / </span></div>
  </section>;
}

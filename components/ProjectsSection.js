"use client";
import TerminalBar from "@/components/TerminalBar";
import SquigglyText from "@/components/ui/squiggly-text";
import useSiteMedia from "@/hooks/useSiteMedia";

const projects=[
  ["01","Lxeus","DISCORD / AI","A Discord moderation and AI assistant with opt-in memory and confirmation before the bot changes server settings.","https://github.com/krishna3251/lexus_dc","botLxeus","/images/bots/lexus.png"],
  ["02","Rukiya","DISCORD / YOUTUBE","A livestream chat assistant that answers viewers on YouTube and Discord, with separate short-term and saved memory.","https://github.com/rukia3287-jpg/rukiya","botRukiya","/images/bots/rukiya.png"],
  ["03","Damu","PYTHON / AUTOMATION","A Discord server builder that previews changes to channels, roles and permissions before applying them.","https://github.com/krishnverma32/damu-server-builder","botDamu","/images/bots/deku.png"],
  ["04","AI Chatbot","PYTHON / EXPERIMENT","An experiment in remembering conversation context and returning structured responses.",null,"heroPortrait","/hero_krishna_vertical.jpg"]
];

function imageStyle(settings){
  return {objectFit:settings?.fit==="contain"?"contain":"cover",objectPosition:(settings?.positionX??50)+"% "+(settings?.positionY??50)+"%",transform:"scale("+Math.min(2.5,Math.max(.5,Number(settings?.scale)||1))+")",opacity:settings?.visible===false?0:(settings?.opacity??1)};
}

export default function ProjectsSection(){
  const {media}=useSiteMedia();
  const slots=media.slots||{};
  return <section className="project-index editorial-project-index">
    <TerminalBar command="ls ./projects --long" meta="INDEX / 04" />
    <div className="project-live-row"><span><i/> BUILD INDEX ONLINE</span><span>04 SYSTEMS / 2026</span><span>SCROLL ↓</span></div>
    <div className="section-marker"><span>03</span><span>PROJECT INDEX</span></div>
    <div className="project-intro">
      <div><span className="eyebrow">SOFTWARE / SELECTED</span><h1>Software<br/><em><SquigglyText scale={2.5}>with character.</SquigglyText></em></h1></div>
      <p>Discord automation, livestream chat and experiments in making AI useful in everyday conversations.</p>
    </div>
    <div className="project-list editorial-project-list">
      {projects.map(([no,name,type,desc,url,slot,defaultImage])=>{
        const settings=slots[slot]||{};
        const Row = url ? "a" : "article";
        return <Row key={no} id={name.toLowerCase().replace(/\s+/g,"-")} className="project-row editorial-project-row"
          {...(url ? {href:url,target:"_blank",rel:"noreferrer"} : {})}>
          <span className="project-no">{no}</span>
          <div className="project-thumb"><img src={settings.src||defaultImage} alt="" loading="lazy" style={imageStyle(settings)}/></div>
          <div className="project-name"><span>{type}</span><h2>{name}<b>.</b></h2></div>
          <p>{desc}</p>
          {url && <strong aria-hidden="true">↗</strong>}
        </Row>;
      })}
    </div>
    <div className="project-bottom"><a href="/bots">Explore bot systems ↗</a><a href="https://github.com/krishna3251?tab=repositories" target="_blank" rel="noreferrer">All repositories ↗</a></div>
  </section>;
}

"use client";
import TerminalBar from "@/components/TerminalBar";
import SquigglyText from "@/components/ui/squiggly-text";
import useSiteMedia from "@/hooks/useSiteMedia";

function crop(settings){
  return {objectFit:settings?.fit==="contain"?"contain":"cover",objectPosition:(settings?.positionX??50)+"% "+(settings?.positionY??50)+"%",transform:"scale("+Math.min(2.5,Math.max(.5,Number(settings?.scale)||1))+")",opacity:settings?.visible===false?0:(settings?.opacity??1)};
}

export default function AboutSection(){
  const {media}=useSiteMedia();
  const slots=media.slots||{};
  const portrait=slots.aboutPortrait||{src:"/hero_krishna.jpg"};
  const background=slots.aboutBackground||{};
  const copy=media.copy||{};
  return <section className="about section editorial-about" id="about">
    <TerminalBar command="whoami --profile" meta="USER / KRISHNA" />
    {background.src&&background.visible!==false&&<div className="about-custom-background"><img src={background.src} alt="" style={crop(background)}/><span style={{backgroundColor:background.overlayColor||"#eeeadf",opacity:background.overlayOpacity??.3}}/></div>}
    <div className="about-index"><span className="eyebrow">ABOUT</span><strong>04</strong></div>
    <div className="about-body editorial-about-body">
      <div className="about-photo-card">
        <div className="about-photo-frame"><img src={portrait.src||"/hero_krishna.jpg"} alt="Krishna portfolio visual" loading="lazy" style={crop(portrait)}/>{portrait.overlayOpacity>0&&<span style={{backgroundColor:portrait.overlayColor||"#a8271b",opacity:portrait.overlayOpacity}}/>}</div>
        <div className="about-photo-caption"><span>KRISHNA / PROFILE</span><span>HYDERABAD, IN</span></div>
        <span className="about-photo-index">K<span>.</span></span>
      </div>
      <div className="about-text-column">
        <div className="about-signal"><span/><span>PROFILE / CURRENT</span></div>
        <h2>I like useful things.<br/><em><SquigglyText scale={2.5}>I also like beautiful things.</SquigglyText></em></h2>
        <div className="about-copy">
          <p className="about-lead">{copy.profileLead||"I’m Krishna, a developer who moves comfortably between code and visual design."}</p>
          <p>{copy.profileBody||"My work spans Python systems, AI applications, automation, web projects and gaming artwork. I care about structure, speed, accessibility, maintainability and actually shipping."}</p>
        </div>
        <div className="about-facts">{[["FOCUS","AI + WEB"],["TOOLS","PYTHON / REACT"],["VISUAL","GAMING ART"],["STATUS","BUILDING"]].map(([a,b])=><div key={a}><span>{a}</span><strong>{b}</strong></div>)}</div>
      </div>
    </div>
  </section>;
}

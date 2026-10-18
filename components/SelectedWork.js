"use client";

import Link from "next/link";
import WorksWheel from "@/components/ui/works-wheel";
import TerminalBar from "@/components/TerminalBar";
import SquigglyText from "@/components/ui/squiggly-text";
import useSiteMedia from "@/hooks/useSiteMedia";

const work = [
  ["01","VISUAL DESIGN","Gaming thumbnails","Character-led compositions and art direction built to win attention in one frame.","/thumbnails","selectedGenshin","/images/genshin%20cinematic.png"],
  ["02","VISUAL DESIGN","Skirk / Genshin","High-impact character composition with cinematic contrast and deliberate framing.","/thumbnails","selectedSkirk","/images/genshin%20skirk.png"],
  ["03","VISUAL DESIGN","Wuthering Waves","Atmosphere, hierarchy and an unmistakable focal character.","/thumbnails","selectedWuwa","/images/wuwa%20cyberpunk%201.png"],
  ["04","AI / SOFTWARE","Rukiya","A practical automation system for communities, memory and repeatable workflows.","/projects","selectedRukiya","/images/bots/rukiya.png"],
  ["05","AUTOMATION","Lxeus","Moderation and intelligent interaction tools for Discord communities.","/projects","selectedLxeus","/images/bots/lexus.png"],
  ["06","VISUAL DESIGN","Valorant","Agent-focused gaming visuals with strong composition and controlled energy.","/thumbnails","selectedValorant","/images/valorant%20chamber%20velo.png"]
];

function imageStyle(settings) {
  return {
    objectFit: settings?.fit === "contain" ? "contain" : "cover",
    objectPosition: (settings?.positionX ?? 50) + "% " + (settings?.positionY ?? 50) + "%",
    transform: "scale(" + Math.min(2.5, Math.max(0.5, Number(settings?.scale) || 1)) + ")",
    opacity: settings?.visible === false ? 0 : (settings?.opacity ?? 1)
  };
}

export default function SelectedWork() {
  const { media } = useSiteMedia();
  const slots = media.slots || {};

  return (
    <section className="selected-work section" id="work">
      <TerminalBar command="cat ./selected-work" meta="INDEX / 06" />
      <div className="section-marker"><span>02</span><span>SELECTED WORK</span><em>06 WORKS</em></div>
      <div className="section-heading">
        <div><span className="eyebrow">WORK / SELECTED</span><h2>Made with<br /><em><SquigglyText scale={2.5}>intent.</SquigglyText></em></h2></div>
        <p>A visual index of the things I make: game artwork, useful software and automation. Six distinct frames, with enough room for the work to speak.</p>
      </div>

      <div className="selected-work-list editorial-work-grid">
        {work.map(([no,label,title,text,href,slot,defaultImage]) => {
          const settings = slots[slot] || {};
          const image = settings.src || defaultImage;
          return (
            <article key={no} className="selected-work-card">
              <Link href={href} className="selected-work-row" data-cursor={"OPEN " + title.toUpperCase()}>
                <span className="selected-work-no">{no}<i>/06</i></span>
                <div className="selected-work-image">
                  <img src={image} alt={title} loading="lazy" style={imageStyle(settings)} />
                  {settings.overlayOpacity > 0 && <span style={{ backgroundColor: settings.overlayColor || "#a8271b", opacity: settings.overlayOpacity }} />}
                  <b className="selected-work-image-open">VIEW WORK ↗</b>
                </div>
                <div className="selected-work-copy">
                  <small>{label} / 2026</small>
                  <strong>{title}</strong>
                  <p>{text}</p>
                </div>
                <b className="selected-work-arrow">↗</b>
              </Link>
            </article>
          );
        })}
      </div>
      <details className="work-explorer">
        <summary>Explore the interactive index <span aria-hidden="true">＋</span></summary>
        <WorksWheel items={work.map(([, , title, , href, slot, fallback]) => ({
          title, href, image: slots[slot]?.src || fallback, ...slots[slot]
        }))} />
      </details>
      <Link href="/thumbnails" className="archive-link" data-cursor="ARCHIVE">Explore the full archive <span>↗</span></Link>
    </section>
  );
}

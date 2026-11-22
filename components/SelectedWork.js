"use client";

import Image from "@/components/PortfolioImage";
import Link from "next/link";
import WorksWheel from "@/components/ui/works-wheel";
import useSiteMedia from "@/hooks/useSiteMedia";
import { portfolioImage } from "@/lib/portfolio-media";
import { getThumbnailViewerHref } from "@/lib/thumbnails";

const work = [
  ["Visual design", "Whale Above Teyvat", "A lone traveler beneath a celestial whale.", getThumbnailViewerHref("genshin cinematic.png", "GENSHIN"), "selectedGenshin", "/images/genshin%20cinematic.png"],
  ["Software / AI", "Rukiya", "A chat assistant for YouTube livestreams and Discord.", "/projects#rukiya", "selectedRukiya", "/images/bots/rukiya.png"],
  ["Visual design", "Skirk / Genshin", "Cinematic contrast and a clear character silhouette.", getThumbnailViewerHref("genshin skirk.png", "GENSHIN"), "selectedSkirk", "/images/genshin%20skirk.png"],
  ["Visual design", "Wuthering Waves", "A neon city composition with a single focal character.", getThumbnailViewerHref("wuwa cyberpunk 1.png", "WUWA"), "selectedWuwa", "/images/wuwa%20cyberpunk%201.png"],
  ["Discord automation", "Lxeus", "Moderation and AI chat tools for Discord communities.", "/projects#lxeus", "selectedLxeus", "/images/bots/lexus.png"],
  ["Visual design", "Valorant", "Agent-focused artwork with sharp contrast and typography.", getThumbnailViewerHref("valorant chamber velo.png", "VALORANT"), "selectedValorant", "/images/valorant%20chamber%20velo.png"],
];

export default function SelectedWork() {
  const { media } = useSiteMedia();
  const slots = media.slots || {};

  return (
    <section className="atlas-content-section atlas-container" id="work" aria-labelledby="selected-title">
      <div className="atlas-heading-row">
        <h2 id="selected-title">Selected <em>work.</em></h2>
        <Link href="/thumbnails" className="atlas-button">Full gallery</Link>
      </div>

      <div className="atlas-work-grid">
        {work.map(([category, title, description, href, slot, fallback]) => {
          const settings = slots[slot];
          const image = portfolioImage(settings?.src || fallback, settings);
          return (
            <article key={title} className="atlas-work-card" data-atlas-reveal>
              <Link href={href} className="atlas-work-link">
                <div className="atlas-work-media">
                  {image && <Image {...image} fill alt="" sizes="(max-width:600px) 100vw, (max-width:900px) 50vw, 35vw" quality={72} />}
                  {image && settings?.overlayOpacity > 0 && <span className="atlas-media-overlay" style={{
                    backgroundColor: settings.overlayColor, opacity: settings.overlayOpacity,
                  }} />}
                </div>
                <div className="atlas-work-copy"><span>{category}</span><h3>{title}</h3><p>{description}</p></div>
              </Link>
            </article>
          );
        })}
      </div>

      <details className="atlas-work-index">
        <summary>Interactive work index</summary>
        <WorksWheel items={work.map(([, title, , href, slot, fallback]) => ({
          title, href, image: slots[slot]?.src || fallback, ...slots[slot],
        }))} />
      </details>
    </section>
  );
}

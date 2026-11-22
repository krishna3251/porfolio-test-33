"use client";

import Image from "@/components/PortfolioImage";
import useSiteMedia from "@/hooks/useSiteMedia";
import { portfolioImage } from "@/lib/portfolio-media";

const steps = [
  ["Find the point", "Start with the audience, what they need and how the finished work should feel."],
  ["Build a first version", "Sketch the layout or build a prototype to see what works in practice."],
  ["Refine the details", "Improve the interaction, imagery, color and motion around the strongest idea."],
  ["Test and ship", "Check the finished work, publish it and carry what I learned into the next project."],
];

export default function HowIBuild() {
  const { media } = useSiteMedia();
  const settings = media.slots?.processBackground;
  const background = portfolioImage(settings?.src, settings);
  return (
    <section className="atlas-content-section atlas-container" id="process" aria-labelledby="process-title">
      <div className="atlas-heading-row"><h2 id="process-title">How I <em>build.</em></h2></div>
      <div className="atlas-process">
        {background && <div className="atlas-process-backdrop" aria-hidden="true">
          <Image {...background} fill alt="" sizes="100vw" quality={72} />
          {settings.overlayOpacity > 0 && <span className="atlas-media-overlay" style={{ backgroundColor: settings.overlayColor, opacity: settings.overlayOpacity }} />}
        </div>}
        <ol>{steps.map(([title, copy]) => <li key={title} data-atlas-reveal><h3>{title}</h3><p>{copy}</p></li>)}</ol>
      </div>
    </section>
  );
}

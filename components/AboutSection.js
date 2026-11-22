"use client";

import Image from "@/components/PortfolioImage";
import useSiteMedia from "@/hooks/useSiteMedia";
import { portfolioImage } from "@/lib/portfolio-media";

export default function AboutSection() {
  const { media } = useSiteMedia();
  const { aboutPortrait, aboutBackground } = media.slots || {};
  const portrait = portfolioImage(aboutPortrait?.src || "/hero_krishna.jpg", aboutPortrait);
  const background = portfolioImage(aboutBackground?.src, aboutBackground);
  const copy = media.copy || {};

  return (
    <section className="atlas-content-section atlas-container" id="about" aria-labelledby="about-title">
      <div className="atlas-about" data-atlas-reveal>
        {background && <div className="atlas-about-backdrop" aria-hidden="true">
          <Image {...background} fill alt="" sizes="100vw" quality={72} />
          {aboutBackground.overlayOpacity > 0 && <span className="atlas-media-overlay" style={{ backgroundColor: aboutBackground.overlayColor, opacity: aboutBackground.overlayOpacity }} />}
        </div>}
        {portrait && <div className="atlas-about-media">
          <Image {...portrait} fill alt="Krishna portfolio visual" sizes="(max-width:720px) 100vw, 36vw" quality={72} />
          {aboutPortrait?.overlayOpacity > 0 && <span className="atlas-media-overlay" style={{ backgroundColor: aboutPortrait.overlayColor, opacity: aboutPortrait.overlayOpacity }} />}
        </div>}
        <div className="atlas-about-copy">
          <p className="atlas-identity"><span className="atlas-location-dot" /> Hyderabad, India</p>
          <h2 id="about-title">I’m <em>Krishna.</em></h2>
          <p>{copy.profileLead || "I’m a developer and visual designer working across software and gaming art."}</p>
          <p>{copy.profileBody || "I work on Python, AI applications, web projects and cinematic thumbnails."}</p>
        </div>
      </div>
    </section>
  );
}

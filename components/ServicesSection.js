"use client";

import Image from "@/components/PortfolioImage";
import Link from "next/link";
import useSiteMedia from "@/hooks/useSiteMedia";
import { portfolioImage } from "@/lib/portfolio-media";

const services = [
  ["AI systems", "Bots, AI chat and tools that automate everyday tasks.", "/bots", "serviceAI", "/images/bots/lexus.png"],
  ["Web experiences", "Responsive web projects with custom interfaces and motion.", "/projects", "serviceWeb", "/hero_krishna.jpg"],
  ["Visual direction", "Gaming thumbnails, digital art and visual composition.", "/thumbnails", "serviceVisual", "/images/genshin%20cinematic.png"],
];

export default function ServicesSection() {
  const { media } = useSiteMedia();
  return (
    <section className="atlas-content-section atlas-container" id="services" aria-labelledby="services-title">
      <div className="atlas-heading-row"><h2 id="services-title">What I <em>build.</em></h2></div>
      <div className="atlas-service-grid">
        {services.map(([title, text, href, slot, fallback]) => {
          const settings = media.slots?.[slot];
          const image = portfolioImage(settings?.src || fallback, { opacity: 0.25, ...settings });
          return <Link href={href} key={title} className="atlas-service-card" data-atlas-reveal>
            {image && <span className="atlas-service-image" aria-hidden="true">
              <Image {...image} fill alt="" sizes="(max-width:700px) 70vw, 35vw" quality={72} />
              {settings?.overlayOpacity > 0 && <span className="atlas-media-overlay" style={{ background: settings.overlayColor, opacity: settings.overlayOpacity }} />}
            </span>}
            <div><h3>{title}</h3><p>{text}</p></div>
          </Link>;
        })}
      </div>
    </section>
  );
}

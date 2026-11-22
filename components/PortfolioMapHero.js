import Image from "@/components/PortfolioImage";
import Link from "next/link";
import PortfolioMap from "@/components/PortfolioMap";
import { portfolioImage } from "@/lib/portfolio-media";
import { getThumbnailViewerHref } from "@/lib/thumbnails";

export default function PortfolioMapHero({ featured, thumbnailCount, copy, slots, overrides }) {
  const showcase = slots.heroShowcase?.src ? slots.heroShowcase : overrides[featured?.filename];
  const showcaseImage = portfolioImage(showcase?.src || featured?.src, showcase);
  const portrait = portfolioImage(slots.heroPortrait?.src, slots.heroPortrait, "contain");
  const background = portfolioImage(slots.heroBackground?.src, slots.heroBackground);
  const cutout = portfolioImage(slots.heroCutout?.src, slots.heroCutout, "contain");

  return (
    <section className="atlas-hero atlas-container" aria-labelledby="portfolio-title">
      {background && <div className="atlas-hero-background" aria-hidden="true">
        <Image {...background} fill alt="" sizes="100vw" quality={72} />
        {slots.heroBackground.overlayOpacity > 0 && <span style={{ backgroundColor: slots.heroBackground.overlayColor, opacity: slots.heroBackground.overlayOpacity }} />}
      </div>}
      <div className="atlas-hero-copy">
        {cutout && <div className="atlas-hero-cutout" aria-hidden="true"><Image {...cutout} fill alt="" sizes="26vw" quality={72} /></div>}
        <div className="atlas-identity"><span className="atlas-location-dot" /> Krishna Soni <span>· Hyderabad, IN</span></div>
        <h1 id="portfolio-title">Explore my<br /><em>creative world.</em></h1>
        <p>{copy.heroDescription || "I build AI tools and Discord bots, and design cinematic artwork for games."}</p>
        <div className="atlas-actions">
          <Link className="atlas-button atlas-button-primary" href="#map">Explore the map</Link>
          <Link className="atlas-button" href="#work">Selected work</Link>
        </div>
        {showcaseImage && featured && <Link className="atlas-hero-feature" href={getThumbnailViewerHref(featured.filename, featured.label)}>
          <span className="atlas-hero-feature-image"><Image {...showcaseImage} fill alt="" sizes="90px" quality={72} /></span>
          <span><small>Featured artwork</small><strong>{featured.title}</strong></span>
          <span className="atlas-hero-feature-icon" aria-hidden="true" />
        </Link>}
        <p className="atlas-hero-index"><strong>{thumbnailCount}</strong> artworks in the archive</p>
      </div>
      <PortfolioMap portrait={portrait} aboutCopy={copy.heroEyebrow} />
    </section>
  );
}

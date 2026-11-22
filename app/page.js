import PortfolioMapHero from "@/components/PortfolioMapHero";
import ServicesSection from "@/components/ServicesSection";
import SelectedWork from "@/components/SelectedWork";
import AboutSection from "@/components/AboutSection";
import SkillsMarquee from "@/components/SkillsMarquee";
import HowIBuild from "@/components/HowIBuild";
import ContactFooter from "@/components/ContactFooter";
import siteMedia from "@/public/site-media.json";
import { FEATURED_THUMBNAIL, getChronologicalThumbnailGroups } from "@/lib/thumbnails";

export const metadata = {
  title: { absolute: "Krishna Soni — Creative Developer & Visual Designer" },
  description: "Explore a 3D map of Krishna Soni’s AI projects, Discord bots, and gaming artwork.",
};

export default function Home() {
  const thumbnails = getChronologicalThumbnailGroups(siteMedia).flatMap((group) => group.thumbnails);
  const featured = thumbnails.find((item) => item.filename === FEATURED_THUMBNAIL);

  return (
    <div className="atlas-home">
      <main id="main-content" tabIndex={-1}>
        <PortfolioMapHero featured={featured} thumbnailCount={thumbnails.length}
          copy={siteMedia.copy} slots={siteMedia.slots} overrides={siteMedia.overrides} />
        <SelectedWork />
        <ServicesSection />
        <AboutSection />
        <SkillsMarquee />
        <HowIBuild />
      </main>
      <ContactFooter />
    </div>
  );
}

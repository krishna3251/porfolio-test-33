import HomeHero from "@/components/HomeHero";
import CinematicThread from "@/components/CinematicThread";
import CinematicSectionFlow from "@/components/CinematicSectionFlow";
import StudioStrip from "@/components/StudioStrip";
import ServicesSection from "@/components/ServicesSection";
import SelectedWork from "@/components/SelectedWork";
import AboutSection from "@/components/AboutSection";
import SkillsMarquee from "@/components/SkillsMarquee";
import HowIBuild from "@/components/HowIBuild";
import ContactFooter from "@/components/ContactFooter";
import siteMedia from "@/public/site-media.json";
import { getChronologicalThumbnailGroups } from "@/lib/thumbnails";

export const metadata={
  title:"KRISHNA / Creative Developer + Visual Designer",
  description:"Software, AI systems, gaming visuals and experiments by Krishna.",
};

export default function Home(){
  const thumbnailCount = getChronologicalThumbnailGroups(siteMedia)
    .reduce((total, group) => total + group.thumbnails.length, 0);

  return <div className="site-page site-page--cinematic">
    <main id="main-content" tabIndex={-1}>
      <HomeHero/>
      <CinematicThread/>
      <CinematicSectionFlow/>
      <StudioStrip thumbnailCount={thumbnailCount}/>
      <ServicesSection/>
      <SelectedWork/>
      <AboutSection/>
      <SkillsMarquee/>
      <HowIBuild/>
    </main>
    <ContactFooter/>
  </div>;
}

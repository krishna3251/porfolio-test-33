import HomeHero from "@/components/HomeHero";
import CinematicThread from "@/components/CinematicThread";
import StudioStrip from "@/components/StudioStrip";
import ServicesSection from "@/components/ServicesSection";
import SelectedWork from "@/components/SelectedWork";
import AboutSection from "@/components/AboutSection";
import SkillsMarquee from "@/components/SkillsMarquee";
import HowIBuild from "@/components/HowIBuild";
import ContactFooter from "@/components/ContactFooter";

export const metadata={
  title:"KRISHNA / Creative Developer + Visual Designer",
  description:"Software, AI systems, gaming visuals and experiments by Krishna.",
};

export default function Home(){
  return <div className="site-page site-page--cinematic">
    <main id="main-content" tabIndex={-1}>
      <HomeHero/>
      <CinematicThread/>
      <StudioStrip/>
      <ServicesSection/>
      <SelectedWork/>
      <AboutSection/>
      <SkillsMarquee/>
      <HowIBuild/>
    </main>
    <ContactFooter/>
  </div>;
}
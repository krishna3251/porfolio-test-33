import HomeHero from "@/components/HomeHero";
import SelectedWork from "@/components/SelectedWork";
import AboutSection from "@/components/AboutSection";
import SkillsMarquee from "@/components/SkillsMarquee";
import HowIBuild from "@/components/HowIBuild";
import ContactFooter from "@/components/ContactFooter";

export const metadata={
  title:"KRISHNA | Creative Developer",
  description:"Krishna's portfolio of software systems, AI applications and gaming visuals.",
};

export default function Home(){
  return <div className="w-full">
    <HomeHero/>
    <main>
      <SelectedWork/>
      <AboutSection/>
      <SkillsMarquee/>
      <HowIBuild/>
    </main>
    <ContactFooter/>
  </div>;
}

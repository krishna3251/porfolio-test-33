import HomeHero from "@/components/HomeHero";
import IntroSection from "@/components/IntroSection";
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
    <main className="max-w-[1500px] mx-auto px-5 md:px-8 lg:px-10 pb-20">
      <IntroSection/>
      <section id="about" className="scroll-mt-28 pt-12 md:pt-24"><AboutSection/></section>
      <section id="skills" className="scroll-mt-28 pt-24 md:pt-36"><SkillsMarquee/></section>
      <section id="build" className="scroll-mt-28 pt-24 md:pt-36"><HowIBuild/></section>
    </main>
    <ContactFooter/>
  </div>;
}
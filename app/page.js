import { getChronologicalThumbnailGroups } from "@/lib/thumbnails";
import HomeHero from "@/components/HomeHero";
import WorkArchive from "@/components/WorkArchive";
import AboutSection from "@/components/AboutSection";
import SkillsMarquee from "@/components/SkillsMarquee";
import HowIBuild from "@/components/HowIBuild";
import ProjectsSection from "@/components/ProjectsSection";
import ContactFooter from "@/components/ContactFooter";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "KRISHNA | Developer & Visual Designer",
  description: "Krishna's portfolio of software systems, gaming thumbnails, and digital work.",
};

export default function Home() {
  const thumbnailGroups = getChronologicalThumbnailGroups();
  return (
    <div className="w-full">
      <HomeHero />
      <main className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pb-24">
        <section id="work" className="scroll-mt-28 pt-24 md:pt-36">
          <WorkArchive groups={thumbnailGroups} />
        </section>
        <section id="about" className="scroll-mt-28 pt-28 md:pt-40">
          <AboutSection />
        </section>
        <section id="skills" className="scroll-mt-28 pt-28 md:pt-40">
          <SkillsMarquee />
        </section>
        <section id="build" className="scroll-mt-28 pt-28 md:pt-40">
          <HowIBuild />
        </section>
        <section id="projects" className="scroll-mt-28 pt-28 md:pt-40">
          <ProjectsSection />
        </section>
      </main>
      <ContactFooter />
    </div>
  );
}

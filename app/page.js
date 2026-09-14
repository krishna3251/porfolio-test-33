import { getChronologicalThumbnailGroups } from "@/lib/thumbnails";
import HomeHero from "@/components/HomeHero";
import WorkArchive from "@/components/WorkArchive";
import AboutSection from "@/components/AboutSection";
import SkillsMarquee from "@/components/SkillsMarquee";
import HowIBuild from "@/components/HowIBuild";
import ProjectsSection from "@/components/ProjectsSection";
import MusicSpotlight from "@/components/MusicSpotlight";
import ContactFooter from "@/components/ContactFooter";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "KRISHNA | Developer & AI Systems Portfolio",
  description:
    "Personal portfolio of Krishna — Python systems developer, Discord bot architect, AI application builder, and digital artist.",
};

export default function Home() {
  const thumbnailGroups = getChronologicalThumbnailGroups();

  return (
    <div className="flex-grow flex flex-col w-full relative">
      {/* SECTION 00: HERO */}
      <HomeHero />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 w-full space-y-36 pb-24">
        {/* SECTION 01: WORK (CHRONOLOGICAL THUMBNAIL ARCHIVE) */}
        <section id="work" className="scroll-mt-28">
          <WorkArchive groups={thumbnailGroups} />
        </section>

        {/* SECTION 02: ABOUT */}
        <section id="about" className="scroll-mt-28">
          <AboutSection />
        </section>

        {/* SECTION 03: SKILLS */}
        <section id="skills" className="scroll-mt-28">
          <SkillsMarquee />
        </section>

        {/* SECTION 04: HOW I BUILD */}
        <section id="build" className="scroll-mt-28">
          <HowIBuild />
        </section>

        {/* SECTION 05: PROJECTS */}
        <section id="projects" className="scroll-mt-28">
          <ProjectsSection />
        </section>

        {/* SECTION 06: MUSIC */}
        <section id="music" className="scroll-mt-28">
          <MusicSpotlight />
        </section>
      </div>

      {/* SECTION 07: CONTACT & FOOTER */}
      <ContactFooter />
    </div>
  );
}

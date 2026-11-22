import AtlasSectionHero from "@/components/AtlasSectionHero";
import ProjectsSection from "@/components/ProjectsSection";

export const metadata = { title: "Projects", description: "Software, AI and automation projects by Krishna." };

export default function ProjectsPage() {
  return (
    <main id="main-content" tabIndex={-1} className="atlas-container atlas-destination-page">
      <AtlasSectionHero section="Projects" title="Software" accent="projects."
        description="Discord automation, livestream chat and experiments in making AI useful in everyday conversations." />
      <ProjectsSection />
    </main>
  );
}

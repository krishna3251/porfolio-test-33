import ProjectsSection from "@/components/ProjectsSection";

export const metadata={
  title:"Projects | Krishna",
  description:"Krishna's software, AI and automation projects.",
};

export default function ProjectsPage(){
  return <main className="max-w-[1500px] mx-auto px-5 md:px-8 lg:px-10 pt-[130px] pb-28 min-h-screen">
    <ProjectsSection/>
  </main>;
}
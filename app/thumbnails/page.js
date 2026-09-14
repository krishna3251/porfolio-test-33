import { getChronologicalThumbnailGroups } from "@/lib/thumbnails";
import WorkArchive from "@/components/WorkArchive";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Visual Archive | Krishna",
  description: "Chronological archive of digital artwork, visual studies, and 4K thumbnail productions.",
};

export default function ThumbnailsPage() {
  const groups = getChronologicalThumbnailGroups();
  const totalCount = groups.reduce((acc, g) => acc + g.thumbnails.length, 0);

  return (
    <main className="flex-grow pt-36 pb-32 px-6 md:px-12 lg:px-16 max-w-7xl mx-auto w-full relative">
      {/* Header Section */}
      <header className="mb-20 flex flex-col md:flex-row justify-between items-baseline gap-12 border-b border-foreground/5 pb-16">
        <div className="max-w-2xl">
          <div className="mono-metadata text-primary mb-4 tracking-[0.25em] font-bold">
            ARCHIVE // CHRONOLOGICAL EXHIBITION
          </div>
          <h1 className="serif-display text-7xl md:text-8xl mb-6 text-foreground leading-none">
            Visual <span className="italic text-primary">Manifesto.</span>
          </h1>
          <p className="font-sans text-base md:text-lg text-muted max-w-lg leading-relaxed">
            A comprehensive, date-ordered archive of high-impact visual studies and digital artwork. Every piece is chronologically indexed from newest to oldest.
          </p>
        </div>

        <div className="flex flex-col gap-3 text-right items-end rounded-2xl border border-foreground/10 bg-surface/50 px-7 py-6 backdrop-blur-md shadow-xl">
          <span className="mono-metadata text-[8px] text-muted">INDEXED FRAMES</span>
          <span className="serif-display text-5xl tabular-nums text-foreground">{totalCount}</span>
          <span className="mono-metadata text-primary text-[8.5px] font-bold tracking-widest">
            {groups.length} RECORDED DATES ONLINE
          </span>
        </div>
      </header>

      {/* Render the date-organized WorkArchive */}
      <WorkArchive groups={groups} />

      {/* Editorial Footer */}
      <footer className="mt-36 pt-12 border-t border-foreground/5 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="mono-metadata text-muted text-[8px]">
          STUDIO ARCHIVE © 2026 // KRISHNA
        </div>
        <div className="flex gap-10 mono-metadata text-[8px] text-muted font-bold tracking-widest">
          <a href="https://github.com/krishna3251" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
            GITHUB ↗
          </a>
          <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
            DISCORD ↗
          </a>
        </div>
      </footer>
    </main>
  );
}

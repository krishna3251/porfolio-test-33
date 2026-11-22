import AtlasSectionHero from "@/components/AtlasSectionHero";
import WorkArchive from "@/components/WorkArchive";
import siteMedia from "@/public/site-media.json";
import { getChronologicalThumbnailGroups } from "@/lib/thumbnails";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Thumbnails",
  description: "Gaming thumbnail and visual design archive by Krishna.",
};

export default function ThumbnailsPage() {
  const groups = getChronologicalThumbnailGroups(siteMedia);
  const total = groups.reduce((count, group) => count + group.thumbnails.length, 0);
  return (
    <main id="main-content" tabIndex={-1} className="atlas-container atlas-destination-page">
      <AtlasSectionHero section="Thumbnails" title="Visual" accent="archive."
        description={`${total} gaming thumbnails, key art and visual experiments. Pick a game or open any frame in the cinematic viewer.`} />
      <WorkArchive groups={groups} />
    </main>
  );
}

import WorkArchive from "@/components/WorkArchive";
import { getChronologicalThumbnailGroups } from "@/lib/thumbnails";

export const dynamic="force-dynamic";

export const metadata={
  title:"Thumbnails",
  description:"Gaming thumbnail and visual design archive by Krishna.",
};

export default function ThumbnailsPage(){
  const groups=getChronologicalThumbnailGroups();
  const total=groups.reduce((n,g)=>n+g.thumbnails.length,0);

  return <main className="archive-page">
    <section className="archive-hero" data-page="thumbnails">
      <div>
        <span className="archive-eyebrow">02 / VISUAL ARCHIVE</span>
        <h1>Pictures<br/><em>that punch.</em></h1>
      </div>
      <div className="archive-hero-aside">
        <span>{String(total).padStart(2,"0")} pieces</span>
        <p>Gaming thumbnails, key art and visual experiments. Built to make a frame stop the scroll.</p>
      </div>
    </section>
    <section className="archive-content"><WorkArchive groups={groups}/></section>
  </main>;
}
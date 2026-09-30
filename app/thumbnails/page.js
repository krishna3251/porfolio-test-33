import { getChronologicalThumbnailGroups } from "@/lib/thumbnails";
import WorkArchive from "@/components/WorkArchive";

export const dynamic="force-dynamic";

export const metadata={
  title:"Thumbnails | Krishna",
  description:"Gaming thumbnails and visual design archive by game category.",
};

export default function ThumbnailsPage(){
  const groups=getChronologicalThumbnailGroups();
  const total=groups.reduce((n,g)=>n+g.thumbnails.length,0);

  return <main className="max-w-[1500px] mx-auto px-5 md:px-8 lg:px-10 pt-[130px] pb-28 min-h-screen">
    <header className="grid lg:grid-cols-12 gap-7 items-end mb-10">
      <div className="lg:col-span-8">
        <p className="mono-metadata text-hot">VISUAL ARCHIVE / {total} FRAMES</p>
        <h1 className="page-display mt-3">Thumbnails,<br/><i>by game.</i></h1>
      </div>
      <div className="lg:col-span-4">
        <p className="text-sm md:text-base leading-relaxed text-black/55">Each image is classified from its filename into its game/category. Use the tabs to move between Genshin, HSR, Wuwa, Valorant and the other collections.</p>
      </div>
    </header>
    <WorkArchive groups={groups}/>
  </main>;
}
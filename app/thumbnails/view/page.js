import { notFound } from "next/navigation";
import ThumbnailViewer from "@/components/ThumbnailViewer";
import { getChronologicalThumbnailGroups, getThumbnailArchiveHref, getThumbnailViewerHref } from "@/lib/thumbnails";
import siteMedia from "@/public/site-media.json";

export const dynamic = "force-dynamic";

export default async function ThumbnailViewPage({ searchParams }) {
  const params = await searchParams;
  const filename = typeof params?.file === "string" ? params.file : "";
  const requestedCategory = params?.category;
  const groups = getChronologicalThumbnailGroups(siteMedia);
  const allItems = groups.flatMap((group) => group.thumbnails);
  const selectedItem = allItems.find((item) => item.filename === filename);
  if (!allItems.length || (filename && !selectedItem)) notFound();

  const categoryItems = allItems.filter((item) => item.label === requestedCategory);
  const matchesCategory = categoryItems.length && (!selectedItem || selectedItem.label === requestedCategory);
  const category = matchesCategory ? requestedCategory : "ALL";
  const items = matchesCategory ? categoryItems : allItems;
  const total = items.length;
  const index = selectedItem ? items.indexOf(selectedItem) : 0;
  const urlAt = (position) => getThumbnailViewerHref(items[position].filename, category);

  return <ThumbnailViewer
    item={items[index]}
    archiveHref={`${getThumbnailArchiveHref(category)}#gallery`}
    index={index}
    total={total}
    previous={urlAt((index + total - 1) % total)}
    next={urlAt((index + 1) % total)}
    first={urlAt(0)}
    last={urlAt(total - 1)}
  />;
}

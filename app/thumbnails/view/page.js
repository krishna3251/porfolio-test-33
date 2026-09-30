import { getChronologicalThumbnailGroups } from "@/lib/thumbnails";
import ThumbnailViewer from "@/components/ThumbnailViewer";

export const dynamic = "force-dynamic";

export default async function ThumbnailViewPage({ searchParams }) {
  const params = await searchParams;
  const filename = params?.file ? decodeURIComponent(params.file) : "";
  const requestedCategory = params?.category || "ALL";

  const groups = getChronologicalThumbnailGroups();
  const allItems = groups.flatMap((group) => group.thumbnails || []);
  const scopedItems =
    requestedCategory === "ALL"
      ? allItems
      : allItems.filter((item) => item.label === requestedCategory);

  const sourceItems = scopedItems.length ? scopedItems : allItems;
  const selectedIndex = Math.max(0, sourceItems.findIndex((item) => item.filename === filename));
  const item = sourceItems[selectedIndex] || allItems[0];

  if (!item) {
    return <main className="min-h-screen grid place-items-center bg-[#080a0d] text-white">No artwork found.</main>;
  }

  const previousItem = sourceItems[(selectedIndex - 1 + sourceItems.length) % sourceItems.length];
  const nextItem = sourceItems[(selectedIndex + 1) % sourceItems.length];
  const firstItem = sourceItems[0];
  const lastItem = sourceItems[sourceItems.length - 1];

  const makeUrl = (target) =>
    `/thumbnails/view?file=${encodeURIComponent(target.filename)}&category=${encodeURIComponent(requestedCategory)}`;

  return (
    <ThumbnailViewer
      item={item}
      index={selectedIndex}
      total={sourceItems.length}
      previous={makeUrl(previousItem)}
      next={makeUrl(nextItem)}
      first={makeUrl(firstItem)}
      last={makeUrl(lastItem)}
    />
  );
}

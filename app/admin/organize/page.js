import ThumbnailCategoryManager from "@/components/ThumbnailCategoryManager";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Thumbnail Organizer",
  description: "Private thumbnail category management.",
  robots: { index: false, follow: false },
};

export default function OrganizeThumbnailsPage() {
  return <ThumbnailCategoryManager />;
}

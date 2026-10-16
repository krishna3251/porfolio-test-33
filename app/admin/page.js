import AdminStudioClient from "@/components/AdminStudioClient";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Admin Studio",
  description: "Private image and visual design studio.",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <main className="admin-page"><AdminStudioClient /></main>;
}

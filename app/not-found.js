import Link from "next/link";

export const metadata = {
  title: "Page missing",
  description: "Return to the map or browse the visual archive.",
};

export default function NotFound() {
  return (
    <main className="atlas-container atlas-empty-page">
      <h1>Page <em>missing.</em></h1>
      <p>The link may have changed. You can return to the map or browse the gallery.</p>
      <div className="atlas-actions">
        <Link href="/" className="atlas-button atlas-button-primary">Back to the map</Link>
        <Link href="/thumbnails" className="atlas-button">Open gallery</Link>
      </div>
    </main>
  );
}

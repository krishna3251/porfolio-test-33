import Link from "next/link";

export default function AtlasSectionHero({ section, title, accent, description }) {
  return (
    <header className="atlas-section-hero">
      <nav className="atlas-breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Map</Link><span aria-hidden="true">/</span><span aria-current="page">{section}</span>
      </nav>
      <div className="atlas-section-hero-inner">
        <h1>{title} <em>{accent}</em></h1>
        <p>{description}</p>
      </div>
    </header>
  );
}

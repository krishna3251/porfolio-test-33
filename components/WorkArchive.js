"use client";

import Image from "@/components/PortfolioImage";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import useSiteMedia from "@/hooks/useSiteMedia";
import { portfolioImage } from "@/lib/portfolio-media";
import {
  FEATURED_THUMBNAIL,
  THUMBNAIL_CATEGORIES,
  getThumbnailArchiveHref,
  getThumbnailGameName,
  getThumbnailViewerHref,
} from "@/lib/thumbnails";

export default function WorkArchive({ groups }) {
  const searchParams = useSearchParams();
  const { media } = useSiteMedia();
  const items = useMemo(() => groups.flatMap((group) => group.thumbnails).map((item) => {
    const settings = media.overrides?.[item.filename];
    return { ...item, image: portfolioImage(settings?.src || item.src, settings) };
  }), [groups, media.overrides]);

  const counts = useMemo(() => {
    const byGame = {};
    items.forEach(({ label }) => { byGame[label] = (byGame[label] || 0) + 1; });
    return byGame;
  }, [items]);
  const requestedCategory = searchParams.get("category");
  const active = THUMBNAIL_CATEGORIES.includes(requestedCategory) && counts[requestedCategory] ? requestedCategory : "ALL";
  const filtered = active === "ALL" ? items : items.filter((item) => item.label === active);
  const featured = items.find((item) => item.filename === FEATURED_THUMBNAIL && item.image) || items.find((item) => item.image);

  function setActive(category) {
    window.history.replaceState(null, "", getThumbnailArchiveHref(category));
  }

  return (
    <>
      {featured && <article className="atlas-gallery-feature">
        <Link href={getThumbnailViewerHref(featured.filename)} className="atlas-gallery-feature-image" aria-label={`View ${featured.title}`}>
          <Image {...featured.image} fill alt="" sizes="(max-width:800px) 100vw, 65vw" quality={72}
            loading="eager" fetchPriority="high" />
        </Link>
        <div className="atlas-gallery-feature-copy">
          <span>Featured · {getThumbnailGameName(featured.label)}</span>
          <h2>{featured.title}</h2>
          <p>{featured.subtitle}</p>
          <Link className="atlas-button atlas-button-primary" href={getThumbnailViewerHref(featured.filename)}>View artwork</Link>
        </div>
      </article>}

      <div className="atlas-gallery-filter" id="gallery" tabIndex={-1}>
        <div role="group" aria-label="Filter thumbnails by game">
          <button type="button" aria-pressed={active === "ALL"} onClick={() => setActive("ALL")}>All <b>{items.length}</b></button>
          {THUMBNAIL_CATEGORIES.filter((category) => counts[category]).map((category) => (
            <button type="button" key={category} aria-pressed={active === category} onClick={() => setActive(category)}>
              {getThumbnailGameName(category)} <b>{counts[category]}</b>
            </button>
          ))}
        </div>
        <p role="status">{filtered.length} {filtered.length === 1 ? "artwork" : "artworks"}</p>
      </div>

      <div className="atlas-gallery-grid" key={active}>
        {filtered.map((item) => (
          <article key={item.id} className="atlas-work-card">
            <Link href={getThumbnailViewerHref(item.filename, active)} className="atlas-work-link" aria-label={`View ${item.title}`}>
              <div className="atlas-work-media">
                {item.image && <Image {...item.image} fill alt="" sizes="(max-width:560px) 100vw, (max-width:900px) 50vw, 33vw" quality={72} />}
              </div>
              <div className="atlas-work-copy">
                <span>{getThumbnailGameName(item.label)}</span><h3>{item.title}</h3>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </>
  );
}

"use client";

import Image from "@/components/PortfolioImage";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import GalleryExhibit from "@/components/GalleryExhibit";
import useSiteMedia from "@/hooks/useSiteMedia";
import { portfolioImage } from "@/lib/portfolio-media";
import { resetSurface, tiltSurface } from "@/lib/surface-depth";
import {
  FEATURED_THUMBNAIL,
  THUMBNAIL_CATEGORIES,
  getThumbnailArchiveHref,
  getThumbnailGameName,
  getThumbnailViewerHref,
} from "@/lib/thumbnails";

const exhibitOrder = [FEATURED_THUMBNAIL, "genshin skirk.png", "wuwa cyberpunk 1.png", "valorant chamber velo.png"];

function exhibitItems(items) {
  const gallery = items.filter((item) => item.image);
  const picks = exhibitOrder.map((filename) => gallery.find((item) => item.filename === filename)).filter(Boolean);
  return [...picks, ...gallery.filter((item) => !picks.includes(item))].slice(0, 4);
}

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
  const featured = useMemo(() => exhibitItems(items), [items]);

  function setActive(category) {
    window.history.replaceState(null, "", getThumbnailArchiveHref(category));
  }

  return (
    <>
      {featured.length > 0 && <GalleryExhibit items={featured} />}

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
          <article key={item.id} className="atlas-work-card spatial-art-card" onPointerMove={tiltSurface} onPointerLeave={resetSurface}>
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

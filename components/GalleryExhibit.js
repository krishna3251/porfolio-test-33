"use client";

import Image from "@/components/PortfolioImage";
import Link from "next/link";
import { useState } from "react";
import { resetSurface, tiltSurface } from "@/lib/surface-depth";
import { getThumbnailGameName, getThumbnailViewerHref } from "@/lib/thumbnails";

function positionOf(index, selected, count) {
  const offset = (index - selected + count) % count;
  if (offset === 0) return "front";
  if (offset === 1) return "right";
  if (offset === count - 1) return "left";
  return "behind";
}

export default function GalleryExhibit({ items }) {
  const [selectedId, setSelectedId] = useState(null);
  const selected = Math.max(0, items.findIndex((item) => item.id === selectedId));
  const artwork = items[selected];
  const href = getThumbnailViewerHref(artwork.filename);

  function advance(offset) {
    const position = (selected + offset + items.length) % items.length;
    setSelectedId(items[position].id);
  }

  return (
    <section className="spatial-exhibit" aria-label="Featured artwork">
      <div className="spatial-gallery-room" onPointerMove={tiltSurface} onPointerLeave={resetSurface}>
        <div className="spatial-gallery-floor" aria-hidden="true" />
        <div className="spatial-gallery-orbit" id="featured-frames">
          {items.map((item, index) => {
            const position = positionOf(index, selected, items.length);
            return (
              <div className="spatial-gallery-frame" data-position={position} key={item.id}>
                <div className="spatial-gallery-picture">
                  <Image {...item.image} fill alt="" sizes="(max-width:680px) 75vw, (max-width:1100px) 58vw, 700px"
                    quality={72} loading="eager" fetchPriority={index === 0 ? "high" : "low"} draggable={false} />
                  {position === "front" ? <Link href={href} className="spatial-gallery-hit" tabIndex={-1}
                    aria-label={`Open ${item.title}`} /> : position !== "behind" &&
                    <button type="button" className="spatial-gallery-hit" aria-label={`Preview ${item.title}`}
                      onClick={() => setSelectedId(item.id)} />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="spatial-exhibit-caption">
        <div aria-live="polite">
          <span>Featured · {getThumbnailGameName(artwork.label)}</span>
          <h2>{artwork.title}</h2>
          <p>{artwork.subtitle}</p>
        </div>
        <div className="spatial-exhibit-actions">
          {items.length > 1 && <div className="spatial-gallery-controls" aria-label="Featured artwork controls">
            <button type="button" className="atlas-button atlas-button-small" aria-controls="featured-frames"
              aria-label="Previous featured artwork" onClick={() => advance(-1)}>Previous</button>
            <span aria-hidden="true">{selected + 1} / {items.length}</span>
            <button type="button" className="atlas-button atlas-button-small" aria-controls="featured-frames"
              aria-label="Next featured artwork" onClick={() => advance(1)}>Next</button>
          </div>}
          <Link className="atlas-button atlas-button-primary" href={href}>Open artwork</Link>
        </div>
      </div>
    </section>
  );
}

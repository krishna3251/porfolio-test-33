"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "@/components/PortfolioImage";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getThumbnailGameName } from "@/lib/thumbnails";
import useSiteMedia from "@/hooks/useSiteMedia";

const formatFrame = (number) => String(number).padStart(2, "0");

export default function ThumbnailViewer({ item, archiveHref, previous, next, first, last, index, total }) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const { media } = useSiteMedia();
  const override = media.overrides?.[item.filename] || {};
  const artworkSrc = override.src || item.src;
  const gesture = useRef(null);

  useEffect(() => {
    function handleKey(event) {
      if (event.defaultPrevented || event.repeat || event.metaKey || event.ctrlKey || event.altKey ||
        event.target?.closest?.("input, textarea, select, [contenteditable]")) return;

      const destinations = {
        escape: archiveHref, backspace: archiveHref, arrowleft: previous, a: previous, p: previous,
        arrowright: next, d: next, n: next, home: first, end: last,
      };
      const destination = destinations[event.key.toLowerCase()];
      if (!destination) return;
      event.preventDefault();
      if (destination === archiveHref) router.push(destination);
      else router.replace(destination, { scroll: false });
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [archiveHref, first, last, next, previous, router]);

  function startSwipe(event) {
    const touch = event.touches[0];
    gesture.current = event.touches.length === 1 ? { x: touch.clientX, y: touch.clientY } : null;
  }

  function endSwipe(event) {
    const origin = gesture.current;
    gesture.current = null;
    if (!origin || !event.changedTouches.length || event.touches.length) return;
    const touch = event.changedTouches[0];
    const travelX = touch.clientX - origin.x;
    const travelY = touch.clientY - origin.y;
    if (Math.abs(travelX) < 55 || Math.abs(travelX) < Math.abs(travelY) * 1.4) return;
    router.replace(travelX > 0 ? previous : next, { scroll: false });
  }

  const game = getThumbnailGameName(item.label);
  const position = (index + 1) / total;
  const visible = override.visible !== false;

  return (
    <main className="cinema-viewer" aria-label="Thumbnail viewer" style={{
      "--viewer-light": item.swatches[1]?.hex || "#e69b7e",
      "--viewer-fill": item.swatches[2]?.hex || "#857ca7",
    }}>
      <header className="cinema-viewer-header">
        <Link href={archiveHref} className="cinema-viewer-back">
          <span aria-hidden="true">‹</span> Gallery
        </Link>
        <div className="cinema-viewer-counter" aria-label={`Artwork ${index + 1} of ${total}`}>
          <strong>{formatFrame(index + 1)}</strong>
          <span aria-hidden="true">/ {formatFrame(total)}</span>
        </div>
      </header>

      <div className="cinema-viewer-progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${position})` }} />
      </div>

      <section className="cinema-viewer-stage" aria-label="Artwork" onTouchStart={startSwipe}
        onTouchEnd={endSwipe} onTouchCancel={() => { gesture.current = null; }}>
        <div className="cinema-viewer-screen">
          <AnimatePresence initial={false}>
            <motion.div key={item.id} className="cinema-viewer-frame"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.986 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.34, ease: [0.22, 1, 0.36, 1] }}>
              {visible && <Image
                src={artworkSrc}
                alt={item.title}
                fill
                sizes="(max-width: 720px) 95vw, (min-width: 1600px) 1344px, 85vw"
                quality={75}
                loading="eager"
                fetchPriority="high"
                draggable={false}
                style={{ opacity: override.opacity ?? 1 }}
              />}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <footer className="cinema-viewer-footer">
        <div className="cinema-viewer-caption" aria-live="polite">
          <span>{game}</span>
          <h1>{item.title}</h1>
          <p>{item.subtitle}</p>
        </div>
        <p className="cinema-viewer-hint"><kbd>←</kbd> <kbd>→</kbd> Browse artwork</p>
        {total > 1 && <nav className="cinema-viewer-controls" aria-label="Thumbnail navigation">
          <Link href={previous} replace scroll={false} aria-label="Previous thumbnail">
            <span aria-hidden="true">‹</span> <span>Previous</span>
          </Link>
          <Link href={next} replace scroll={false} aria-label="Next thumbnail">
            <span>Next</span> <span aria-hidden="true">›</span>
          </Link>
        </nav>}
      </footer>
    </main>
  );
}

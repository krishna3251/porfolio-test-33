"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "@/components/PortfolioImage";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getThumbnailGameName } from "@/lib/thumbnails";
import { resetSurface, tiltSurface } from "@/lib/surface-depth";
import useSiteMedia from "@/hooks/useSiteMedia";

const formatFrame = (number) => String(number).padStart(2, "0");
const limit = (value) => Math.max(0, Math.min(100, value));

function placeZoom(screen, x, y) {
  screen.style.setProperty("--inspect-x", `${limit(x)}%`);
  screen.style.setProperty("--inspect-y", `${limit(y)}%`);
}

export default function ThumbnailViewer({ item, archiveHref, previous, next, first, last, index, total }) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const { media } = useSiteMedia();
  const override = media.overrides?.[item.filename] || {};
  const artworkSrc = override.src || item.src;
  const gesture = useRef(null);
  const screen = useRef(null);
  const zoomOrigin = useRef({ x: 50, y: 50 });
  const [inspectedId, setInspectedId] = useState(null);
  const zoomed = inspectedId === item.id;
  const visible = override.visible !== false;

  useEffect(() => {
    function handleKey(event) {
      if (event.defaultPrevented || event.repeat || event.metaKey || event.ctrlKey || event.altKey ||
        event.target?.closest?.("input, textarea, select, [contenteditable]")) return;

      if (zoomed && event.key === "Escape") {
        event.preventDefault();
        setInspectedId(null);
        return;
      }
      const inspectionKeys = { ArrowLeft: [-12, 0], ArrowRight: [12, 0], ArrowUp: [0, -12], ArrowDown: [0, 12] };
      if (zoomed && inspectionKeys[event.key] && screen.current) {
        event.preventDefault();
        const [dx, dy] = inspectionKeys[event.key];
        const x = limit(zoomOrigin.current.x + dx);
        const y = limit(zoomOrigin.current.y + dy);
        zoomOrigin.current = { x, y };
        placeZoom(screen.current, x, y);
        return;
      }

      const destinations = {
        escape: archiveHref, backspace: archiveHref, arrowleft: previous, a: previous, p: previous,
        arrowright: next, d: next, n: next, home: first, end: last,
      };
      const destination = destinations[event.key.toLowerCase()];
      if (!destination) return;
      event.preventDefault();
      setInspectedId(null);
      if (destination === archiveHref) router.push(destination);
      else router.replace(destination, { scroll: false });
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [archiveHref, first, last, next, previous, router, zoomed]);

  function toggleInspection() {
    zoomOrigin.current = { x: 50, y: 50 };
    if (screen.current) placeZoom(screen.current, 50, 50);
    setInspectedId(zoomed ? null : item.id);
  }

  function moveArtwork(event) {
    if (!zoomed) {
      tiltSurface(event);
      return;
    }
    const bounds = screen.current?.getBoundingClientRect();
    if (!bounds?.width || !bounds.height) return;
    const x = limit((event.clientX - bounds.left) * 100 / bounds.width);
    const y = limit((event.clientY - bounds.top) * 100 / bounds.height);
    zoomOrigin.current = { x, y };
    placeZoom(screen.current, x, y);
  }

  function startSwipe(event) {
    const touch = event.touches[0];
    gesture.current = !zoomed && event.touches.length === 1 ? { x: touch.clientX, y: touch.clientY } : null;
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

      <section className="cinema-viewer-stage spatial-viewer-stage" aria-label="Artwork" data-inspecting={zoomed}
        onPointerMove={moveArtwork} onPointerLeave={resetSurface}
        onPointerDown={(event) => {
          if (!zoomed || event.pointerType !== "touch" || !event.isPrimary) return;
          event.currentTarget.setPointerCapture(event.pointerId);
          moveArtwork(event);
        }} onTouchStart={startSwipe} onTouchEnd={endSwipe} onTouchCancel={() => { gesture.current = null; }}>
        <div className="cinema-viewer-screen" ref={screen} id="artwork-screen">
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
        <p className="cinema-viewer-hint"><kbd>←</kbd> <kbd>→</kbd> {zoomed ? "Pan artwork" : "Browse artwork"}</p>
        <div className="spatial-viewer-actions">
          {visible && <button className="spatial-viewer-zoom" type="button" onClick={toggleInspection}
            aria-label="Zoom artwork" aria-pressed={zoomed} aria-controls="artwork-screen">{zoomed ? "Fit artwork" : "Inspect detail"}</button>}
          {total > 1 && <nav className="cinema-viewer-controls" aria-label="Thumbnail navigation">
            <Link href={previous} replace scroll={false} aria-label="Previous thumbnail" onClick={() => setInspectedId(null)}>Previous</Link>
            <Link href={next} replace scroll={false} aria-label="Next thumbnail" onClick={() => setInspectedId(null)}>Next</Link>
          </nav>}
        </div>
      </footer>
    </main>
  );
}

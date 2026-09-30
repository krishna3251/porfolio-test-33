"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function ThumbnailViewer({ item, previous, next, first, last, index, total }) {
  const router = useRouter();
  const swipeStart = useRef(null);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      if (event.key === "Escape" || event.key === "Backspace") {
        event.preventDefault();
        router.push("/thumbnails");
        return;
      }

      if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a" || event.key.toLowerCase() === "p") {
        event.preventDefault();
        router.push(previous);
        return;
      }

      if (event.key === "ArrowRight" || event.key.toLowerCase() === "d" || event.key.toLowerCase() === "n") {
        event.preventDefault();
        router.push(next);
        return;
      }

      if (event.key === "Home") {
        event.preventDefault();
        router.push(first);
        return;
      }

      if (event.key === "End") {
        event.preventDefault();
        router.push(last);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [first, item.filename, next, previous, router]);

  const onPointerDown = (event) => {
    swipeStart.current = { x: event.clientX, y: event.clientY };
  };

  const onPointerUp = (event) => {
    if (!swipeStart.current) return;
    const dx = event.clientX - swipeStart.current.x;
    const dy = event.clientY - swipeStart.current.y;
    swipeStart.current = null;

    if (Math.abs(dx) < 70 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
    router.push(dx < 0 ? next : previous);
  };

  return (
    <main
      className="thumbnail-viewer-page"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      <div className="thumbnail-viewer-backdrop" />

      <motion.div
        className="thumbnail-viewer-layout"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <header className="thumbnail-viewer-nav">
          <Link href="/thumbnails" className="thumbnail-viewer-brand" aria-label="Back to thumbnail archive">
            KRISHNA<span>.</span>
          </Link>

          <div className="thumbnail-viewer-counter" aria-label={`Artwork ${index + 1} of ${total}`}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <i>/</i>
            <span>{String(total).padStart(2, "0")}</span>
            <b>{item.label}</b>
          </div>

          <Link href="/thumbnails" className="thumbnail-viewer-close">
            BACK <span>×</span>
          </Link>
        </header>

        <section className="thumbnail-viewer-canvas" aria-label="Artwork viewer">
          <div className="thumbnail-art-wrap">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={item.id}
                className="thumbnail-art-frame"
                initial={{ opacity: 0, scale: 0.965, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.985, y: -8 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  priority
                  quality={75}
                  sizes="100vw"
                  className="thumbnail-art"
                  draggable="false"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <span className="thumbnail-viewer-canvas-label">
            ← PREVIOUS &nbsp;&nbsp; A / D &nbsp;&nbsp; NEXT →
          </span>
        </section>

        <footer className="thumbnail-viewer-footer">
          <div className="thumbnail-viewer-title">
            <span className="thumbnail-viewer-kicker">{item.label}</span>
            <h1>{item.title}</h1>
            <p>{item.subtitle}</p>
          </div>

          <div className="thumbnail-viewer-actions">
            <Link href={previous} aria-label="Previous artwork">←</Link>
            <Link href={next} aria-label="Next artwork">→</Link>
          </div>
        </footer>
      </motion.div>
    </main>
  );
}

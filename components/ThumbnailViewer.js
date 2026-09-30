"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

export default function ThumbnailViewer({ item, previous, next, index, total }) {
  return (
    <main className="thumbnail-viewer-page">
      <div className="thumbnail-viewer-backdrop" />

      <motion.div
        className="thumbnail-viewer-layout"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
      >
        <header className="thumbnail-viewer-nav">
          <Link href="/thumbnails" className="thumbnail-viewer-brand">
            KRISHNA<span>.</span>
          </Link>

          <div className="thumbnail-viewer-counter">
            <span>{String(index + 1).padStart(2, "0")}</span>
            <i>/</i>
            <span>{String(total).padStart(2, "0")}</span>
            <b>{item.label}</b>
          </div>

          <Link href="/thumbnails" className="thumbnail-viewer-close">
            BACK TO ARCHIVE <span>×</span>
          </Link>
        </header>

        <section className="thumbnail-viewer-canvas">
          <div className="thumbnail-viewer-glow" />

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={item.id}
              className="thumbnail-art-wrap"
              initial={{ opacity: 0, scale: 0.94, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.015, y: -10 }}
              transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
            >
              <img src={item.src} alt={item.title} className="thumbnail-art" draggable="false" />
            </motion.div>
          </AnimatePresence>

          <span className="thumbnail-viewer-canvas-label">FULL FRAME / NO CROP</span>
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

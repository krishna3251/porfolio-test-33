"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

const categoryOrder = ["GENSHIN","HSR","WUWA","VALORANT","PUBG","NTE","FORZA","OTHER"];

export default function WorkArchive({ groups = [] }) {
  const [active, setActive] = useState("ALL");
  const [selectedIndex, setSelectedIndex] = useState(null);

  const items = useMemo(() => groups.flatMap((g) => g.thumbnails || []), [groups]);

  const categories = useMemo(() => {
    const counts = new Map();
    items.forEach((item) => counts.set(item.label, (counts.get(item.label) || 0) + 1));
    return categoryOrder
      .filter((label) => counts.has(label))
      .map((label) => ({ label, count: counts.get(label) }));
  }, [items]);

  const filtered = useMemo(
    () => (active === "ALL" ? items : items.filter((item) => item.label === active)),
    [active, items]
  );

  const selected = selectedIndex === null ? null : filtered[selectedIndex];

  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selected]);

  useEffect(() => {
    if (!selected) return;

    const onKey = (event) => {
      if (event.key === "Escape") setSelectedIndex(null);
      if (event.key === "ArrowRight") setSelectedIndex((current) => current === null ? null : (current + 1) % filtered.length);
      if (event.key === "ArrowLeft") setSelectedIndex((current) => current === null ? null : (current - 1 + filtered.length) % filtered.length);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, filtered.length]);

  return (
    <div>
      <div className="archive-tabs">
        <button className={active === "ALL" ? "active" : ""} onClick={() => setActive("ALL")}>
          ALL <b>{items.length}</b>
        </button>
        {categories.map((category) => (
          <button
            key={category.label}
            className={active === category.label ? "active" : ""}
            onClick={() => setActive(category.label)}
          >
            {category.label} <b>{category.count}</b>
          </button>
        ))}
      </div>

      <div className="archive-status">
        <span>{filtered.length} WORKS</span>
        <span>{active === "ALL" ? "ALL GAMES" : active}</span>
      </div>

      <div className="archive-grid">
        {filtered.map((item, index) => (
          <motion.button
            key={item.id}
            type="button"
            onClick={() => setSelectedIndex(index)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -40px" }}
            transition={{ duration: 0.5, delay: (index % 4) * 0.04, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -8 }}
            className="archive-card text-left group"
          >
            <div className="archive-image">
              <img src={item.src} alt={item.title} loading="lazy" />
              <div className="archive-shade" />
              <span className="archive-badge">{item.label}</span>
              <span className="archive-number">{String(index + 1).padStart(2, "0")}</span>
              <span className="archive-open">OPEN ↗</span>
            </div>
            <div className="archive-info">
              <div>
                <h3>{item.title}</h3>
                <p>{item.subtitle}</p>
              </div>
              <span className="archive-arrow">↗</span>
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            className="archive-viewer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedIndex(null)}
          >
            <motion.div
              className="archive-viewer-shell"
              initial={{ opacity: 0, scale: 0.97, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.985 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={(event) => event.stopPropagation()}
            >
              <header className="archive-viewer-top">
                <div>
                  <span className="archive-viewer-index">
                    {String(selectedIndex + 1).padStart(2, "0")} / {String(filtered.length).padStart(2, "0")}
                  </span>
                  <span className="archive-viewer-type">{selected.label}</span>
                </div>
                <button className="archive-viewer-close" onClick={() => setSelectedIndex(null)}>
                  CLOSE <span>×</span>
                </button>
              </header>

              <div className="archive-viewer-stage">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.img
                    key={selected.id || selected.src}
                    src={selected.src}
                    alt={selected.title}
                    initial={{ opacity: 0, scale: 0.965, x: 22, filter: "blur(8px)" }}
                    animate={{ opacity: 1, scale: 1, x: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, scale: 1.02, x: -22, filter: "blur(8px)" }}
                    transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                    draggable="false"
                  />
                </AnimatePresence>
                <span className="archive-viewer-hint">ESC TO CLOSE · ← → TO BROWSE</span>
              </div>

              <footer className="archive-viewer-bottom">
                <div className="archive-viewer-copy">
                  <h2>{selected.title}</h2>
                  <p>{selected.subtitle}</p>
                </div>

                <div className="archive-viewer-controls">
                  <button
                    type="button"
                    aria-label="Previous artwork"
                    onClick={() => setSelectedIndex((selectedIndex - 1 + filtered.length) % filtered.length)}
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    aria-label="Next artwork"
                    onClick={() => setSelectedIndex((selectedIndex + 1) % filtered.length)}
                  >
                    →
                  </button>
                </div>
              </footer>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

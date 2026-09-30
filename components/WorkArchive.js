"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useMemo, useState } from "react";

const categoryOrder = ["GENSHIN","HSR","WUWA","VALORANT","PUBG","NTE","FORZA","OTHER"];

export default function WorkArchive({ groups = [] }) {
  const [active, setActive] = useState("ALL");
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
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -40px" }}
            transition={{ duration: 0.5, delay: (index % 4) * 0.04, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -8 }}
            className="archive-card"
          >
            <Link
              href={`/thumbnails/view?file=${encodeURIComponent(item.filename)}&category=${encodeURIComponent(active)}`}
              className="block text-left group"
            >
              <div className="archive-image">
                <img src={item.src} alt={item.title} loading="lazy" />
                <div className="archive-shade" />
                <span className="archive-badge">{item.label}</span>
                <span className="archive-number">{String(index + 1).padStart(2, "0")}</span>
                <span className="archive-open">VIEW ↗</span>
              </div>
              <div className="archive-info">
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.subtitle}</p>
                </div>
                <span className="archive-arrow">↗</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

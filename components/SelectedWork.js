"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import useSiteMedia from "@/hooks/useSiteMedia";
import { mediaImageStyle } from "@/lib/media-image-style";

const work = [
  ["Gaming thumbnails", "Character-led composition / Art direction", "/thumbnails", "selectedGenshin", "/images/genshin%20cinematic.png", "VISUAL DESIGN"],
  ["Skirk / Genshin", "Cinematic contrast / Deliberate framing", "/thumbnails", "selectedSkirk", "/images/genshin%20skirk.png", "VISUAL DESIGN"],
  ["Wuthering Waves", "World-building / Atmosphere", "/thumbnails", "selectedWuwa", "/images/wuwa%20cyberpunk%201.png", "VISUAL DESIGN"],
  ["Rukiya", "Community tools / AI systems", "/projects", "selectedRukiya", "/images/bots/rukiya.png", "AI & SOFTWARE"],
  ["Lxeus", "Intelligent interaction / Automation", "/projects", "selectedLxeus", "/images/bots/lexus.png", "AUTOMATION"],
  ["Valorant", "Agent-led visuals / Composition", "/thumbnails", "selectedValorant", "/images/valorant%20chamber%20velo.png", "VISUAL DESIGN"],
];

export default function SelectedWork() {
  const root = useRef(null);
  const track = useRef(null);
  const viewport = useRef(null);
  const stage = useRef(null);
  const [geometry, setGeometry] = useState({ pinned: false, travel: 0, height: 0 });
  const [active, setActive] = useState(0);
  const { media } = useSiteMedia();
  const { scrollYProgress } = useScroll({ target: root, offset: ["start 70px", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -geometry.travel]);
  const progress = useTransform(scrollYProgress, [0, 1], [1 / work.length, 1]);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px) and (min-height: 650px) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    const measure = () => {
      const pinned = query.matches;
      const travel = pinned ? Math.max(0, track.current.scrollWidth - viewport.current.clientWidth) : 0;
      setGeometry({ pinned, travel, height: travel + window.innerHeight - 70 });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(viewport.current);
    observer.observe(track.current);
    observer.observe(stage.current);
    query.addEventListener("change", measure);
    window.addEventListener("resize", measure);
    measure();
    return () => {
      observer.disconnect();
      query.removeEventListener("change", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  useMotionValueEvent(scrollYProgress, "change", value => {
    if (!geometry.pinned || !track.current) return;
    const cards = [...track.current.children];
    const distance = value * geometry.travel;
    let nearest = 0;
    cards.forEach((card, index) => {
      const offset = Math.min(geometry.travel, card.offsetLeft - cards[0].offsetLeft);
      const previous = Math.min(geometry.travel, cards[nearest].offsetLeft - cards[0].offsetLeft);
      if (Math.abs(offset - distance) < Math.abs(previous - distance)) nearest = index;
    });
    setActive(nearest);
  });

  const goTo = (index, immediate = false) => {
    if (!geometry.pinned || !track.current) return;
    const card = track.current.children[index];
    const top = root.current.getBoundingClientRect().top + window.scrollY - 70;
    const offset = Math.min(geometry.travel, card.offsetLeft - track.current.children[0].offsetLeft);
    // The same native scroll position controls wheel, buttons and keyboard focus.
    window.scrollTo({ top: top + offset, behavior: immediate ? "instant" : "smooth" });
  };

  return <section ref={root} id="selected-work" className={`folio-work ${geometry.pinned ? "is-pinned" : ""}`} style={geometry.pinned ? { height: geometry.height } : undefined} aria-labelledby="folio-work-title">
    <div ref={stage} className="folio-work-stage">
      <div className="folio-work-overline"><span>01 / Selected work</span><span>Six projects. One creative practice.</span></div>
      <div className="folio-work-heading">
        <h2 id="folio-work-title">Built to work.<br /><em>Made to feel.</em></h2>
        <p>A few things from the intersection of code and visual culture. {geometry.pinned ? "Keep scrolling to explore the collection." : "Explore the collection below."}</p>
      </div>
      <div ref={viewport} className="folio-work-viewport">
        <motion.div ref={track} className="folio-work-track" style={{ x: geometry.pinned ? x : 0 }}>
          {work.map(([title, description, href, slot, fallback, category], index) => {
            const settings = media.slots?.[slot] || {};
            return <article className="folio-work-card" key={slot}>
              <Link href={href} className="folio-work-link" data-cursor="VIEW WORK" onFocus={() => goTo(index, true)}>
                <div className="folio-work-image">
                  <img src={settings.src || fallback} alt={title} loading="lazy" decoding="async" style={mediaImageStyle(settings)} />
                  {settings.overlayOpacity > 0 && <span className="folio-work-overlay" style={{ backgroundColor: settings.overlayColor, opacity: settings.overlayOpacity }} />}
                  <span className="folio-work-open" aria-hidden="true">↗</span>
                </div>
                <div className="folio-work-caption">
                  <span className="folio-work-number">{String(index + 1).padStart(2, "0")}</span>
                  <div><h3>{title}</h3><p>{description}</p></div>
                  <span className="folio-work-category">{category}</span>
                </div>
              </Link>
            </article>;
          })}
        </motion.div>
      </div>
      <div className="folio-work-footer">
        <div className="folio-work-controls">
          <button type="button" aria-label="Previous project" disabled={active === 0} onClick={() => goTo(active - 1)}>←</button>
          <span className="folio-work-count"><b>{String(active + 1).padStart(2, "0")}</b> / 06</span>
          <button type="button" aria-label="Next project" disabled={active === work.length - 1} onClick={() => goTo(active + 1)}>→</button>
        </div>
        <div className="folio-work-progress" aria-hidden="true"><motion.span style={{ scaleX: progress }} /></div>
        <Link href="/thumbnails">Explore the full archive ↗</Link>
      </div>
    </div>
  </section>;
}

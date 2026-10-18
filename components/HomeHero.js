"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import useSiteMedia from "@/hooks/useSiteMedia";
import { mediaImageStyle } from "@/lib/media-image-style";

const ease = [0.22, 1, 0.36, 1];

export default function HomeHero() {
  const root = useRef(null);
  const reduce = useReducedMotion();
  const { media } = useSiteMedia();
  const portrait = media.slots?.heroPortrait || { src: "/hero_krishna_vertical.jpg", fit: "contain" };
  const background = media.slots?.heroBackground || {};
  const cutout = media.slots?.heroCutout || {};
  const { scrollYProgress } = useScroll({ target: root, offset: ["start start", "end start"] });
  const photoY = useTransform(scrollYProgress, [0, 1], [0, 55]);
  const photoScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.12]);
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -65]);
  // Keep the server-rendered title visible. The entrance is decorative only.
  const enter = (delay = 0) => reduce ? {} : {
    initial: { y: 24 }, animate: { y: 0 }, transition: { duration: 1, delay, ease }
  };

  return <section ref={root} className="folio-hero" aria-labelledby="folio-title">
    {background.src && background.visible !== false && <img className="hero-background-photo" src={background.src} alt="" aria-hidden="true" style={mediaImageStyle(background)} />}
    <div className="folio-hero-top">
      <span className="folio-hero-status"><i aria-hidden="true" />Independent creative</span>
      <span>Hyderabad, India / Available worldwide</span>
    </div>
    <div className="folio-hero-stage">
      <motion.div className="folio-hero-copy" style={reduce ? undefined : { y: titleY }}>
        <motion.p className="folio-hero-eyebrow" {...enter()}>Developer × Visual designer</motion.p>
        <h1 className="folio-hero-title" id="folio-title" aria-label="Krishna. Code meets craft.">
          <span><motion.b {...enter(.05)}>KRISHNA.</motion.b></span>
          <span className="folio-title-second"><motion.b {...enter(.14)}>CODE &amp; CRAFT.</motion.b></span>
        </h1>
        <motion.p className="folio-hero-description" {...enter(.2)}>{media.copy?.heroDescription || "AI systems, web experiences, automation and gaming visuals, built with equal attention to function and finish."}</motion.p>
        <motion.div className="folio-hero-links" {...enter(.25)}>
          <a href="#selected-work" className="folio-primary" data-cursor="EXPLORE">Selected work <span aria-hidden="true">↘</span></a>
          <a href="#contact" className="folio-secondary">Let&apos;s talk <span aria-hidden="true">↗</span></a>
        </motion.div>
      </motion.div>
      <motion.figure className="folio-hero-visual" {...enter(.12)}>
        <div className="folio-hero-mat" aria-hidden="true" />
        <div className="folio-hero-image">
          <motion.div className="folio-hero-photo" style={reduce ? undefined : { y: photoY, scale: photoScale }}>
            <img src={portrait.src || "/hero_krishna_vertical.jpg"} alt="Krishna’s cinematic portrait artwork" style={mediaImageStyle(portrait)} fetchPriority="high" />
          </motion.div>
          {portrait.overlayOpacity > 0 && <span className="folio-hero-overlay" style={{ backgroundColor: portrait.overlayColor, opacity: portrait.overlayOpacity }} />}
        </div>
        {cutout.src && cutout.visible !== false && <img className="folio-hero-cutout" src={cutout.src} alt="" aria-hidden="true" style={mediaImageStyle(cutout)} />}
        <figcaption><span>A STUDY IN CODE &amp; COMPOSITION</span><span>01 / 26</span></figcaption>
        <div className="folio-hero-stamp" aria-hidden="true">Made<br />with intent.<small>KRISHNA / 2026</small></div>
      </motion.figure>
    </div>
    <div className="folio-hero-bottom">
      <a href="#selected-work"><span className="folio-scroll-arrow" aria-hidden="true">↓</span>Scroll to discover</a>
      <span>Software. Visuals. A little obsession.</span>
      <span className="folio-hero-year">Portfolio / 2026</span>
    </div>
  </section>;
}

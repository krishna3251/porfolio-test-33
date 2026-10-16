"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import TerminalBar from "@/components/TerminalBar";
import { CommandButton } from "@/components/PortfolioUI";
import WorksWheel from "@/components/ui/works-wheel";
import SparklesEffect from "@/components/ui/sparkles-effect";
import useSiteMedia from "@/hooks/useSiteMedia";

const defaultWork = [
  { title: "Gaming thumbnails", image: "/images/genshin%20cinematic.png", href: "/thumbnails", slot: "workGenshin" },
  { title: "Skirk / Genshin", image: "/images/genshin%20skirk.png", href: "/thumbnails", slot: "workSkirk" },
  { title: "Wuthering Waves", image: "/images/wuwa%20cyberpunk%201.png", href: "/thumbnails", slot: "workWuwa" },
  { title: "Rukiya", image: "/images/bots/rukiya.png", href: "/projects", slot: "workRukiya" },
  { title: "Lxeus", image: "/images/bots/lexus.png", href: "/projects", slot: "workLxeus" },
  { title: "Valorant", image: "/images/valorant%20chamber%20velo.png", href: "/thumbnails", slot: "workValorant" }
];

function imageStyle(settings) {
  return {
    objectFit: settings?.fit === "contain" ? "contain" : "cover",
    objectPosition: (settings?.positionX ?? 50) + "% " + (settings?.positionY ?? 50) + "%",
    transform: "scale(" + Math.min(2.5, Math.max(0.5, Number(settings?.scale) || 1)) + ")",
    opacity: settings?.visible === false ? 0 : (settings?.opacity ?? 1)
  };
}

const reveal = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.72, ease: [0.16, 1, 0.3, 1] } }
};

export default function HomeHero() {
  const heroRef = React.useRef(null);
  const [pointer, setPointer] = React.useState({ x: 0, y: 0 });
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 75, damping: 19, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 75, damping: 19, mass: 0.6 });
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.09]);
  const { media } = useSiteMedia();
  const slots = media.slots || {};
  const portrait = slots.heroPortrait || { src: "/hero_krishna_vertical.jpg", fit: "cover", positionX: 50, positionY: 42, scale: 1 };
  const background = slots.heroBackground || {};
  const cutout = slots.heroCutout || {};
  const copy = media.copy || {};
  const wheelItems = defaultWork.map((item) => {
    const settings = slots[item.slot] || {};
    return {
      ...item,
      image: settings.src || item.image,
      fit: settings.fit || "cover",
      positionX: settings.positionX ?? 50,
      positionY: settings.positionY ?? 50,
      scale: settings.scale ?? 1,
      opacity: settings.opacity ?? 1
    };
  });

  const handlePointer = (event) => {
    if (event.pointerType === "touch") return;
    const rect = event.currentTarget.getBoundingClientRect();
    setPointer({ x: event.clientX - rect.left, y: event.clientY - rect.top });
    mx.set((event.clientX - window.innerWidth / 2) * 0.006);
    my.set((event.clientY - window.innerHeight / 2) * 0.006);
  };

  return (
    <>
      <section
        ref={heroRef}
        className="hero hero-v2 hero-cinematic"
        id="top"
        onPointerMove={handlePointer}
        style={{ "--spot-x": pointer.x + "px", "--spot-y": pointer.y + "px" }}
      >
        <motion.div className="hero-cinematic-bg" style={{ y: bgY, scale: bgScale }} aria-hidden="true" />
        {background.src && background.visible !== false && (
          <motion.img
            className="hero-background-photo"
            src={background.src}
            alt=""
            aria-hidden="true"
            style={{ y: bgY, ...imageStyle(background) }}
          />
        )}
        <div className="hero-topography" aria-hidden="true" />
        <div className="hero-grid hero-grid-cinematic" aria-hidden="true"><span /><span /><span /><span /></div>
        <div className="hero-watermark" aria-hidden="true">01</div>
        <div className="hero-spotlight" aria-hidden="true" />

        <div className="hero-terminal-wrap">
          <TerminalBar command="init portfolio --mode=creative" meta="BOOT / 01" />
        </div>
        <div className="hero-topline">
          <span>CREATIVE DEVELOPER / VISUAL DESIGNER</span>
          <span>INDIA / 2026</span>
        </div>

        <div className="hero-intro-block">
          <motion.div className="hero-copy" initial="hidden" animate="show" variants={reveal}>
            <div className="hero-availability"><span /><b>AVAILABLE FOR SELECTED WORK</b></div>
            <p className="hero-kicker"><span className="hero-dot" />{copy.heroEyebrow || "I make software & visuals."}</p>
            <h1 className="hero-title">
              <span className="terminal-prefix">&gt;</span>
              <span className="hero-title-name">KRISHNA<span className="hero-title-dot">.</span></span>
            </h1>
            <p className="hero-one-line">{copy.heroDescription || "AI systems, web experiences, automation and gaming visuals, built with equal attention to function and finish."}</p>
            <div className="hero-primary-actions">
              <CommandButton href="/thumbnails" label="explore-work" cursor="WORK" accent />
              <CommandButton href="#contact" label="start-a-project" cursor="CONTACT" />
            </div>
            <div className="hero-meta-row">
              <span>01 / CODE + ART + SOUND</span>
              <span>PYTHON · NEXT.JS · MOTION</span>
            </div>
          </motion.div>

          <motion.div
            className="hero-portrait hero-portrait-small hero-portrait-editorial"
            style={{ x: useTransform(sx, [-15, 15], [-5, 5]), y: useTransform(sy, [-15, 15], [-3, 3]) }}
            initial={{ opacity: 0, scale: 0.94, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="hero-portrait-orange-shape" aria-hidden="true" />
            <div className="hero-image-frame">
              <img
                className="hero-main-photo"
                src={portrait.src || "/hero_krishna_vertical.jpg"}
                alt="Portfolio portrait artwork"
                style={imageStyle(portrait)}
                loading="eager"
                fetchPriority="high"
              />
              {portrait.overlayOpacity > 0 && <span className="hero-photo-overlay" style={{ backgroundColor: portrait.overlayColor || "#a8271b", opacity: portrait.overlayOpacity }} />}
              <span className="hero-photo-caption"><span>KRISHNA / VISUAL INDEX</span><span>01—26</span></span>
            </div>
            {cutout.src && cutout.visible !== false && (
              <img className="hero-portrait-cutout" src={cutout.src} alt="" aria-hidden="true" style={imageStyle(cutout)} />
            )}
            <div className="hero-portrait-tag">01 / INDEPENDENT CREATIVE</div>
            <div className="hero-portrait-index" aria-hidden="true">K<span>.</span></div>
            <div className="hero-image-crosshair" aria-hidden="true" />
          </motion.div>
        </div>

        <div className="hero-bottom">
          <a href="#selected-work" className="scroll-cue"><span className="scroll-icon">↓</span><span>SCROLL TO EXPLORE</span></a>
          <p className="hero-bottom-note">DIGITAL CRAFT / BUILT WITH INTENT</p>
          <p className="hero-bottom-location">HYDERABAD, INDIA<br />AVAILABLE WORLDWIDE</p>
        </div>
      </section>

      <section className="hero-work-section" id="selected-work">
        <div className="hero-work-inner">
          <div className="section-overline"><span>01B / SELECTED WORK</span><span>ART DIRECTION · SOFTWARE · EXPERIMENTS</span></div>
          <div className="hero-work-intro">
            <div>
              <span className="eyebrow">SELECTED WORK / LIVE INDEX</span>
              <h2>Scroll through<br /><em>what I build.</em></h2>
            </div>
            <div className="hero-wheel-instructions">
              <span>INTERACTIVE INDEX / 06</span>
              <p>Scroll, drag or use the arrow keys. The selected project moves forward while the rest of the archive recedes into depth.</p>
            </div>
          </div>
          <div className="hero-wheel-wrap">
            <SparklesEffect count={18} />
            <WorksWheel items={wheelItems} label="Works '26" action="Open" />
          </div>

          <div className="hero-profile">
            <div className="hero-profile-index"><span>01 / PROFILE</span><i /></div>
            <div className="hero-profile-copy">
              <p className="hero-profile-lead">{copy.profileLead || "I’m Krishna, a developer who moves comfortably between code and visual design."}</p>
              <p>{copy.profileBody || "My work spans Python systems, AI applications, automation, web projects and gaming artwork. I care about structure, speed, accessibility, maintainability and actually shipping."}</p>
            </div>
            <div className="hero-profile-side">
              <span>FOCUS</span><strong>AI / WEB / VISUAL</strong>
              <span>STACK</span><strong>PYTHON / REACT / NEXT.JS</strong>
              <div className="hero-actions">
                <CommandButton href="/thumbnails" label="view-work" cursor="VIEW WORK" accent />
                <CommandButton href="/projects" label="software" cursor="SOFTWARE" />
              </div>
            </div>
          </div>
          <div className="hero-work-footer"><span>CRAFT OVER NOISE / ALWAYS</span><Link href="/projects">EXPLORE SOFTWARE <b>↗</b></Link></div>
        </div>
      </section>
    </>
  );
}

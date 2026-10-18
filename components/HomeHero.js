"use client";

import TerminalBar from "@/components/TerminalBar";
import { CommandButton } from "@/components/PortfolioUI";
import useSiteMedia from "@/hooks/useSiteMedia";

function imageStyle(settings) {
  return {
    objectFit: settings?.fit === "contain" ? "contain" : "cover",
    objectPosition: (settings?.positionX ?? 50) + "% " + (settings?.positionY ?? 50) + "%",
    transform: "scale(" + Math.min(2.5, Math.max(0.5, Number(settings?.scale) || 1)) + ")",
    opacity: settings?.visible === false ? 0 : (settings?.opacity ?? 1)
  };
}

export default function HomeHero() {
  const { media } = useSiteMedia();
  const slots = media.slots || {};
  const portrait = slots.heroPortrait || { src: "/hero_krishna_vertical.jpg", fit: "cover", positionX: 50, positionY: 42, scale: 1 };
  const background = slots.heroBackground || {};
  const cutout = slots.heroCutout || {};
  const copy = media.copy || {};
  return (
    <>
      <section
        className="hero hero-v2 hero-cinematic"
        id="home"
      >
        <div className="hero-cinematic-bg"  aria-hidden="true" />
        {background.src && background.visible !== false && (
          <img
            className="hero-background-photo"
            src={background.src}
            alt=""
            aria-hidden="true"
            style={imageStyle(background)}
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
          <div className="hero-copy">
            <div className="hero-availability"><span /><b>AVAILABLE FOR SELECTED WORK</b></div>
            <p className="hero-kicker"><span className="hero-dot" />{copy.heroEyebrow || "I make software & visuals."}</p>
            <h1 className="hero-title">
              <span className="terminal-prefix">&gt;</span>
              <span className="hero-title-name">KRISHNA<span className="hero-title-dot">.</span></span>
            </h1>
            <p className="hero-one-line">{copy.heroDescription || "AI systems, web experiences, automation and gaming visuals, built with equal attention to function and finish."}</p>
            <div className="hero-primary-actions">
              <CommandButton href="#work" label="explore-work" cursor="WORK" accent />
              <CommandButton href="#contact" label="start-a-project" cursor="CONTACT" />
            </div>
            <div className="hero-meta-row">
              <span>01 / CODE + ART + SOUND</span>
              <span>PYTHON · NEXT.JS · MOTION</span>
            </div>
          </div>

          <div
            className="hero-portrait hero-portrait-small hero-portrait-editorial"
          >
            <div className="hero-portrait-orange-shape" aria-hidden="true" />
            <div className="hero-image-frame">
              <img
                className="hero-main-photo"
                src={portrait.src || "/hero_krishna_vertical.jpg"}
                alt="Portfolio portrait artwork"
                style={imageStyle(portrait)}
                width="960" height="1280"
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
          </div>
        </div>

        <div className="hero-bottom">
          <a href="#work" className="scroll-cue"><span className="scroll-icon">↓</span><span>SCROLL TO EXPLORE</span></a>
          <p className="hero-bottom-note">DIGITAL CRAFT / BUILT WITH INTENT</p>
          <p className="hero-bottom-location">HYDERABAD, INDIA<br />AVAILABLE WORLDWIDE</p>
        </div>
      </section>

    </>
  );
}

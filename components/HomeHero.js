"use client";

import { useEffect, useRef, useState } from "react";
import useSiteMedia from "@/hooks/useSiteMedia";

const STRANDS = Array.from({ length: 124 }, (_, index) => {
  const angle = (index / 124) * Math.PI * 2;
  const waviness = Math.sin(index * 2.37) * 12 + Math.cos(index * 0.71) * 7;
  const inner = 55 + Math.sin(index * 0.63) * 5;
  const outer = 140 + waviness;
  const width = 1.8 + (Math.sin(index * 1.3) + 1) * 1.65;
  const point = (distance, a) =>
    [220 + Math.cos(a) * distance, 220 + Math.sin(a) * distance]
      .map((value) => value.toFixed(1)).join(",");
  return {
    points: [
      point(inner, angle - width / 110),
      point(outer, angle - width / 240),
      point(outer + 8, angle + width / 290),
      point(inner, angle + width / 110)
    ].join(" "),
    fill: "hsl(" + (348 + Math.round(Math.sin(index * 0.83) * 6)) + " 72% " +
      (39 + Math.round((Math.sin(index * 1.9) + 1) * 12)) + "%)",
    delay: Math.round(index * 5.5)
  };
});

function imageStyle(settings) {
  return {
    objectFit: settings?.fit === "contain" ? "contain" : "cover",
    objectPosition: (settings?.positionX ?? 50) + "% " + (settings?.positionY ?? 50) + "%",
    transform: "scale(" + Math.min(2.5, Math.max(0.5, Number(settings?.scale) || 1)) + ")",
    opacity: settings?.visible === false ? 0 : (settings?.opacity ?? 1)
  };
}

function KineticSculpture({ expanded }) {
  return (
    <svg className="kinetic-sculpture" viewBox="0 0 440 440" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="kinetic-inner-glow">
          <stop offset="0%" stopColor="#fff4f4" stopOpacity="0.6" />
          <stop offset="70%" stopColor="#e84960" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#c52643" stopOpacity="0" />
        </radialGradient>
        <filter id="kinetic-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="12" />
        </filter>
      </defs>
      <ellipse cx="232" cy="310" rx="131" ry="24" fill="#7f1a2d" opacity=".16" filter="url(#kinetic-shadow)" />
      <circle cx="220" cy="220" r="168" fill="url(#kinetic-inner-glow)" />
      <g className="kinetic-orbit" fill="none" stroke="#c3b9ba" strokeWidth=".7" opacity=".64">
        <circle cx="220" cy="220" r="175" strokeDasharray="8 31" />
        <circle cx="220" cy="220" r="188" strokeDasharray="1 40" />
      </g>
      <g className={expanded ? "kinetic-flower kinetic-flower--open" : "kinetic-flower"}>
        {STRANDS.map((strand, index) => (
          <polygon
            key={index}
            className="kinetic-strand"
            points={strand.points}
            fill={strand.fill}
            style={{ animationDelay: strand.delay + "ms" }}
          />
        ))}
      </g>
      <circle cx="220" cy="220" r="49" className="kinetic-sculpture-core" />
      <circle cx="220" cy="220" r="52" fill="none" stroke="#f0a0ab" strokeOpacity=".5" strokeWidth=".8" />
    </svg>
  );
}

export default function HomeHero() {
  const { media } = useSiteMedia();
  const { slots = {}, copy = {} } = media;
  const portrait = slots.heroPortrait || {
    src: "/hero_krishna_vertical.jpg", fit: "cover", positionX: 50, positionY: 42, scale: 1
  };
  const background = slots.heroBackground || {};
  const cutout = slots.heroCutout || {};
  const [expanded, setExpanded] = useState(false);
  const stageRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }
    const timer = window.setTimeout(() => setExpanded(true), 2600);
    return () => window.clearTimeout(timer);
  }, []);

  function moveSculpture(event) {
    if (event.pointerType !== "mouse" || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    stageRef.current.style.setProperty("--tilt-x", (x * 10).toFixed(2) + "deg");
    stageRef.current.style.setProperty("--tilt-y", (-y * 10).toFixed(2) + "deg");
  }

  function resetSculpture() {
    if (!stageRef.current) return;
    stageRef.current.style.setProperty("--tilt-x", "0deg");
    stageRef.current.style.setProperty("--tilt-y", "0deg");
  }

  return (
    <section className="kinetic-hero" id="home" aria-labelledby="kinetic-heading">
      {background.src && background.visible !== false && (
        <img
          className="kinetic-stage-background"
          src={background.src}
          alt=""
          aria-hidden="true"
          style={imageStyle(background)}
        />
      )}
      <div className="kinetic-stage-mark kinetic-stage-mark--left" aria-hidden="true">✦</div>
      <div className="kinetic-stage-mark kinetic-stage-mark--right" aria-hidden="true">✦</div>

      <div className="kinetic-panel">
        <div className="kinetic-panel-top">
          <a href="#home" className="kinetic-wordmark" aria-label="Krishna, back to top">
            (KRISHNA<span>_</span>)
          </a>
          <span className="kinetic-panel-edition">INDEPENDENT DIGITAL MAKER<br />2026 / HYDERABAD, INDIA</span>
          <nav className="kinetic-panel-nav" aria-label="Portfolio quick links">
            <a href="#work">work ↗</a>
            <a href="#about">about ↗</a>
            <a href="#contact">contact ↗</a>
          </nav>
        </div>

        <div className="kinetic-panel-content">
          <div className="kinetic-intro">
            <p className="kinetic-eyebrow"><span aria-hidden="true" />{copy.heroEyebrow || "Creative developer / visual designer"}</p>
            <h1 id="kinetic-heading" className="kinetic-heading">
              {expanded ? (
                <>START SEEING<br /><em>DIFFERENTLY.</em></>
              ) : (
                <>WHERE CODE<br />MEETS <em>VISION.</em></>
              )}
            </h1>
            <p className="kinetic-description">
              {copy.heroDescription ||
                "I build intelligent software, engaging web experiences and cinematic gaming visuals. One idea, thoughtfully brought to life."}
            </p>
            <div className="kinetic-intro-links">
              <a href="#work">DISCOVER MY WORK <span aria-hidden="true">↗</span></a>
              <a href="#contact">LET&apos;S CONNECT <span aria-hidden="true">↗</span></a>
            </div>
          </div>

          <div
            className="kinetic-art-stage"
            ref={stageRef}
            onPointerMove={moveSculpture}
            onPointerLeave={resetSculpture}
          >
            <div className="kinetic-art-halo" aria-hidden="true" />
            {cutout.src && cutout.visible !== false && (
              <img
                src={cutout.src}
                className="kinetic-art-cutout"
                alt=""
                aria-hidden="true"
                style={{ ...imageStyle(cutout), opacity: Math.min(0.18, cutout.opacity ?? 1) }}
              />
            )}
            <button
              type="button"
              className="kinetic-art-toggle"
              onClick={() => setExpanded((current) => !current)}
              aria-label={expanded ? "Collapse the kinetic sculpture" : "Expand the kinetic sculpture"}
              aria-pressed={expanded}
              title="Interact with the sculpture"
            >
              <KineticSculpture expanded={expanded} />
            </button>
            <span className="kinetic-art-caption">AN EXPERIMENT IN MOTION / 001</span>
          </div>

          <div className="kinetic-side">
            <span className="kinetic-side-index">( {expanded ? "02" : "01"} / 02 )</span>
            <span>CODE<br />DESIGN<br />AI</span>
            <button
              type="button"
              className="kinetic-mode-button"
              onClick={() => setExpanded((current) => !current)}
              aria-label="Switch hero visual mode"
            >
              <span aria-hidden="true">↻</span> SWITCH VIEW
            </button>
          </div>
        </div>

        <div className="kinetic-panel-footer">
          <div className="kinetic-footer-person">
            {portrait.src && portrait.visible !== false && (
              <span className="kinetic-person-image">
                <img
                  src={portrait.src}
                  alt=""
                  aria-hidden="true"
                  style={imageStyle(portrait)}
                />
              </span>
            )}
            <span><b>KRISHNA</b><small>CODE × ART × EXPERIMENTS</small></span>
          </div>
          <a className="kinetic-bottom-action" href="#work">EXPLORE PORTFOLIO <span aria-hidden="true">↗</span></a>
          <span className="kinetic-panel-counter">01 / HOME</span>
        </div>
      </div>

      <div className="kinetic-ambient-footer">
        <span>CRAFTED WITH INTENT • BUILT TO FEEL DIFFERENT</span>
        <a href="#work">SCROLL TO EXPLORE <span aria-hidden="true">↓</span></a>
        <span>AVAILABLE FOR NEW IDEAS ↗</span>
      </div>
    </section>
  );
}

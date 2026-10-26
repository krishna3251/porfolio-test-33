"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useSiteMedia from "@/hooks/useSiteMedia";

const COUNT = 108;
const TAU = Math.PI * 2;
const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
const smooth = (start, end, value) => {
  const t = clamp((value - start) / (end - start));
  return t * t * (3 - 2 * t);
};
const mix = (a, b, t) => a + (b - a) * t;

function polarRibbon(angle, inner, outer, width, oval = 1) {
  const point = (radius, a) => [220 + Math.cos(a) * radius, 220 + Math.sin(a) * radius * oval];
  const nearLeft = point(inner, angle - width);
  const farLeft = point(outer, angle - width * .42);
  const farRight = point(outer + 7, angle + width * .42);
  const nearRight = point(inner, angle + width);
  return [...nearLeft, ...farLeft, ...farRight, ...nearRight];
}

const RIBBONS = Array.from({ length: COUNT }, (_, index) => {
  const t = index / (COUNT - 1);
  const wave = Math.sin(index * 2.17);
  const noise = Math.cos(index * .91) * 9;
  const spread = t - .5;
  const width = .012 + (Math.sin(index * 1.37) + 1) * .005;

  // Each stage has the same four vertices. Interpolating those vertices makes
  // the artwork reversible, unlike playing a timed animation on scroll.
  const descending = [
    128 + t * 153, -170 - wave * 13,
    132 + t * 153, -166 - wave * 13,
    278 + t * 39 + wave * 9, 138 + t * 45,
    272 + t * 39 + wave * 9, 143 + t * 45
  ];
  const folding = [
    160 + t * 95, -35 - wave * 27,
    170 + t * 95, -37 - wave * 27,
    260 + spread * 135 + wave * 16, 345 - t * 60,
    251 + spread * 135 + wave * 16, 354 - t * 60
  ];
  const fan = polarRibbon(Math.PI + t * Math.PI, 62 + noise * .3, 177 + noise, width * 1.8, .76);
  const ring = polarRibbon(Math.PI + t * TAU, 62 + wave * 5, 143 + noise, width, .83);
  return {
    poses: [descending, folding, fan, ring],
    fill: "hsl(" + (352 + Math.round(wave * 6)) + " 76% " + (34 + Math.round((wave + 1) * 11)) + "%)"
  };
});

function interpolatedPoints(ribbon, progress) {
  // Flowing fibres → folded ribbons → open fan → circular ring.
  const cuts = [.0, .30, .57, .84, 1];
  const phase = progress < cuts[1] ? 0 : progress < cuts[2] ? 1 : 2;
  const start = cuts[phase];
  const end = cuts[phase + 1];
  const t = phase === 2
    ? smooth(start, end, progress)
    : smooth(start, end, progress);
  const from = ribbon.poses[phase];
  const to = ribbon.poses[phase + 1];
  return from.map((coordinate, index) => mix(coordinate, to[index], t).toFixed(1)).join(",");
}

function imageStyle(settings) {
  return {
    objectFit: settings?.fit === "contain" ? "contain" : "cover",
    objectPosition: (settings?.positionX ?? 50) + "% " + (settings?.positionY ?? 50) + "%",
    transform: "scale(" + Math.min(2.5, Math.max(.5, Number(settings?.scale) || 1)) + ")",
    opacity: settings?.visible === false ? 0 : (settings?.opacity ?? 1)
  };
}

function KineticSculpture({ ribbonsRef, coreRef, orbitRef, highlightsRef }) {
  return (
    <svg className="kinetic-sculpture" viewBox="0 0 440 440" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="kinetic-inner-glow">
          <stop offset="0%" stopColor="#fff4f4" stopOpacity=".6" />
          <stop offset="70%" stopColor="#e84960" stopOpacity=".12" />
          <stop offset="100%" stopColor="#c52643" stopOpacity="0" />
        </radialGradient>
        <filter id="kinetic-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="12" />
        </filter>
      </defs>
      <ellipse cx="232" cy="330" rx="120" ry="20" fill="#7f1a2d" opacity=".12" filter="url(#kinetic-shadow)" />
      <circle cx="220" cy="220" r="168" fill="url(#kinetic-inner-glow)" />
      <g ref={orbitRef} className="kinetic-orbit" fill="none" stroke="#bca8ad" strokeWidth=".7" opacity="0">
        <circle cx="220" cy="220" r="176" strokeDasharray="8 31" />
        <circle cx="220" cy="220" r="188" strokeDasharray="1 40" />
      </g>
      <g ref={ribbonsRef} className="kinetic-scroll-fibers">
        {RIBBONS.map((ribbon, index) => (
          <polygon key={index} points={ribbon.poses[0].join(",")} fill={ribbon.fill} />
        ))}
      </g>
      <g ref={highlightsRef} className="kinetic-scroll-sparks">
        {Array.from({ length: 9 }, (_, index) => (
          <circle key={index} r={index % 2 ? 3.5 : 2.1} cx="0" cy="0" />
        ))}
      </g>
      <circle ref={coreRef} cx="220" cy="220" r="50" className="kinetic-sculpture-core" opacity="0" />
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

  const sceneRef = useRef(null);
  const stageRef = useRef(null);
  const ribbonsRef = useRef(null);
  const coreRef = useRef(null);
  const orbitRef = useRef(null);
  const highlightsRef = useRef(null);
  const firstTitleRef = useRef(null);
  const finalTitleRef = useRef(null);
  const subtitleRef = useRef(null);
  const progressRef = useRef(null);
  const stepRef = useRef(0);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || !ribbonsRef.current) return undefined;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const polygons = Array.from(ribbonsRef.current.children);
    const sparks = Array.from(highlightsRef.current.children);
    let animation;
    let resizeObserver;

    const measureHeader = () => {
      const header = document.querySelector(".site-header");
      const height = header ? Math.ceil(header.getBoundingClientRect().height) : 0;
      scene.style.setProperty("--kinetic-header-height", height + "px");
    };

    const draw = (progress) => {
      const p = clamp(progress);
      polygons.forEach((polygon, index) => {
        polygon.setAttribute("points", interpolatedPoints(RIBBONS[index], p));
      });

      // Glowing tips follow selected fibres, then fade as the ring closes.
      sparks.forEach((spark, index) => {
        const points = interpolatedPoints(RIBBONS[index * 12], p).split(",").map(Number);
        spark.setAttribute("cx", String((points[4] + points[6]) / 2));
        spark.setAttribute("cy", String((points[5] + points[7]) / 2));
        spark.style.opacity = String(1 - smooth(.24, .6, p));
      });
      coreRef.current.style.opacity = String(smooth(.72, .87, p));
      orbitRef.current.style.opacity = String(smooth(.65, .88, p) * .62);
      firstTitleRef.current.style.opacity = String(1 - smooth(.28, .48, p));
      firstTitleRef.current.style.transform = "translate3d(0," + (-14 * smooth(.28, .48, p)) + "px,0)";
      finalTitleRef.current.style.opacity = String(smooth(.69, .85, p));
      finalTitleRef.current.style.transform = "translate3d(0," + (16 * (1 - smooth(.69, .85, p))) + "px,0)";
      subtitleRef.current.style.opacity = String(1 - smooth(.33, .49, p) + smooth(.76, .95, p) * .95);
      progressRef.current.style.transform = "scaleX(" + p + ")";
      stageRef.current.style.setProperty("--scroll-tilt", (mix(-12, 0, smooth(.4, .93, p))).toFixed(2) + "deg");

      const nextStep = p < .3 ? 0 : p < .57 ? 1 : p < .84 ? 2 : 3;
      if (nextStep !== stepRef.current) {
        stepRef.current = nextStep;
        setStep(nextStep);
      }
    };

    measureHeader();
    if (reduced.matches) {
      draw(1);
      return () => scene.style.removeProperty("--kinetic-header-height");
    }

    gsap.registerPlugin(ScrollTrigger);
    const scrub = { value: 0 };
    animation = gsap.to(scrub, {
      value: 1,
      ease: "none",
      onUpdate: () => draw(scrub.value),
      scrollTrigger: {
        trigger: scene,
        start: () => "top top+=" + (parseFloat(scene.style.getPropertyValue("--kinetic-header-height")) || 0),
        end: "bottom bottom",
        scrub: .75,
        invalidateOnRefresh: true
      }
    });
    draw(0);
    const header = document.querySelector(".site-header");
    if (header) {
      resizeObserver = new ResizeObserver(() => {
        measureHeader();
        ScrollTrigger.refresh();
      });
      resizeObserver.observe(header);
    }
    const refresh = () => { measureHeader(); ScrollTrigger.refresh(); };
    window.addEventListener("resize", refresh, { passive: true });
    ScrollTrigger.refresh();
    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", refresh);
      animation?.scrollTrigger?.kill();
      animation?.kill();
      scene.style.removeProperty("--kinetic-header-height");
    };
  }, []);

  function moveSculpture(event) {
    if (event.pointerType !== "mouse" || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    stageRef.current.style.setProperty("--tilt-x", (x * 6).toFixed(1) + "deg");
    stageRef.current.style.setProperty("--tilt-y", (-y * 6).toFixed(1) + "deg");
  }

  function resetSculpture() {
    if (!stageRef.current) return;
    stageRef.current.style.setProperty("--tilt-x", "0deg");
    stageRef.current.style.setProperty("--tilt-y", "0deg");
  }

  function nextFrame() {
    const scene = sceneRef.current;
    if (!scene) return;
    const sceneStart = window.scrollY + scene.getBoundingClientRect().top;
    const scrollDistance = scene.offsetHeight - (window.innerHeight - (parseFloat(scene.style.getPropertyValue("--kinetic-header-height")) || 0));
    const target = Math.min(1, (step + 1) / 3) * scrollDistance;
    window.scrollTo({
      top: sceneStart + target,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth"
    });
  }

  return (
    <section className="kinetic-scroll-scene" ref={sceneRef} id="home" aria-label="Scroll-driven portfolio introduction">
      <div className="kinetic-hero" aria-labelledby="kinetic-heading">
        {background.src && background.visible !== false && (
          <img className="kinetic-stage-background" src={background.src} alt="" aria-hidden="true" style={imageStyle(background)} />
        )}
        <div className="kinetic-stage-mark kinetic-stage-mark--left" aria-hidden="true">✦</div>
        <div className="kinetic-stage-mark kinetic-stage-mark--right" aria-hidden="true">✦</div>

        <div className="kinetic-panel">
          <div className="kinetic-panel-top">
            <a href="#home" className="kinetic-wordmark" aria-label="Krishna, back to top">(KRISHNA<span>_</span>)</a>
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
              <h1 className="kinetic-heading kinetic-scroll-heading" id="kinetic-heading" aria-label="Where code meets vision. Start seeing differently.">
                <span ref={firstTitleRef} className="kinetic-heading-phase">
                  WHERE CODE<br />MEETS <em>VISION.</em>
                </span>
                <span ref={finalTitleRef} className="kinetic-heading-phase kinetic-heading-phase--last" aria-hidden="true">
                  START SEEING<br /><em>DIFFERENTLY.</em>
                </span>
              </h1>
              <div ref={subtitleRef} className="kinetic-subtitle-wrap">
                <p className="kinetic-description">{copy.heroDescription ||
                  "I build intelligent software, engaging web experiences and cinematic gaming visuals. One idea, thoughtfully brought to life."}</p>
                <div className="kinetic-intro-links">
                  <a href="#work">DISCOVER MY WORK <span aria-hidden="true">↗</span></a>
                  <a href="#contact">LET&apos;S CONNECT <span aria-hidden="true">↗</span></a>
                </div>
              </div>
            </div>

            <div className="kinetic-art-stage" ref={stageRef} onPointerMove={moveSculpture} onPointerLeave={resetSculpture}>
              <div className="kinetic-art-halo" aria-hidden="true" />
              {cutout.src && cutout.visible !== false && (
                <img src={cutout.src} className="kinetic-art-cutout" alt="" aria-hidden="true"
                  style={{ ...imageStyle(cutout), opacity: Math.min(.18, cutout.opacity ?? 1) }} />
              )}
              <div className="kinetic-art-toggle" aria-hidden="true">
                <KineticSculpture ribbonsRef={ribbonsRef} coreRef={coreRef} orbitRef={orbitRef} highlightsRef={highlightsRef} />
              </div>
              <span className="kinetic-art-caption">SCROLL TO TRANSFORM / 001</span>
            </div>

            <div className="kinetic-side">
              <span className="kinetic-side-index">( 0{step + 1} / 04 )</span>
              <span>CODE<br />DESIGN<br />AI</span>
              <button type="button" className="kinetic-mode-button" onClick={nextFrame}
                aria-label="Scroll to the next stage of the animation">
                <span aria-hidden="true">↓</span> NEXT FRAME
              </button>
            </div>
          </div>

          <div className="kinetic-panel-footer">
            <div className="kinetic-footer-person">
              {portrait.src && portrait.visible !== false && (
                <span className="kinetic-person-image">
                  <img src={portrait.src} alt="" aria-hidden="true" style={imageStyle(portrait)} />
                </span>
              )}
              <span><b>KRISHNA</b><small>CODE × ART × EXPERIMENTS</small></span>
            </div>
            <a className="kinetic-bottom-action" href="#work">EXPLORE PORTFOLIO <span aria-hidden="true">↗</span></a>
            <span className="kinetic-panel-counter">01 / HOME</span>
          </div>
          <span className="kinetic-scroll-progress" aria-hidden="true"><span ref={progressRef} /></span>
        </div>

        <div className="kinetic-ambient-footer">
          <span>CRAFTED WITH INTENT • BUILT TO FEEL DIFFERENT</span>
          <span>SCROLL TO TRANSFORM <span aria-hidden="true">↓</span></span>
          <span>AVAILABLE FOR NEW IDEAS ↗</span>
        </div>
      </div>
    </section>
  );
}

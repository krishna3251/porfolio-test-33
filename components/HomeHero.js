"use client";

import { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useSiteMedia from "@/hooks/useSiteMedia";
import { getChronologicalThumbnailGroups } from "@/lib/thumbnails";

const clamp = value => Math.max(0, Math.min(1, value));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (a, b, value) => {
  const t = clamp((value - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const interval = (progress, start, end) =>
  smooth(start, start + .05, progress) * (1 - smooth(end - .055, end, progress));

const FIBERS = Array.from({ length: 48 }, (_, index) => {
  const t = index / 47;
  const wave = Math.sin(index * 2.4);
  const perturb = Math.cos(index * 1.18);
  const center = 855;
  const angle = -Math.PI / 2 + 2 * Math.PI * t;
  const radius = 195 + wave * 20;
  const inner = 91 + perturb * 12;
  const yscale = .83;
  return {
    ink: "hsl(" + (350 + Math.round(wave * 5)) + " 71% " + (45 + Math.round(wave * 10)) + "%)",
    size: 2.9 + (wave + 1) * 1.6,
    start: [
      470 + t * 440 + perturb * 34, -260 - 130 * t,
      485 + t * 475 + perturb * 20, -160,
      630 + t * 220 + wave * 72, 160 + t * 70,
      760 + t * 165 + wave * 44, 420 + t * 120
    ],
    waterfall: [
      530 + t * 460, -210 - t * 75,
      590 + t * 420 + wave * 39, 120,
      605 + t * 250 + perturb * 60, 475 + 80 * t,
      750 + t * 195 + wave * 30, 950 + perturb * 75
    ],
    orbit: [
      center + Math.cos(angle) * radius, 400 + Math.sin(angle) * radius * yscale,
      center + Math.cos(angle + .68) * (radius + 36), 400 + Math.sin(angle + .68) * (radius + 36) * yscale,
      center + Math.cos(angle + 1.1) * inner, 400 + Math.sin(angle + 1.1) * inner * yscale,
      center + Math.cos(angle + .16) * inner, 400 + Math.sin(angle + .16) * inner * yscale
    ]
  };
});

function fiberPath(points) {
  return "M" + points[0].toFixed(1) + "," + points[1].toFixed(1) +
    " C" + points[2].toFixed(1) + "," + points[3].toFixed(1) +
    " " + points[4].toFixed(1) + "," + points[5].toFixed(1) +
    " " + points[6].toFixed(1) + "," + points[7].toFixed(1);
}
function fiberAt(fiber, progress) {
  const p = clamp(progress);
  if (p < .63) {
    const t = smooth(.02, .61, p);
    return fiber.start.map((a, index) => lerp(a, fiber.waterfall[index], t));
  }
  const t = smooth(.62, .99, p);
  return fiber.waterfall.map((a, index) => lerp(a, fiber.orbit[index], t));
}
function imageStyle(settings) {
  return {
    objectFit: settings?.fit === "contain" ? "contain" : "cover",
    objectPosition: (settings?.positionX ?? 50) + "% " + (settings?.positionY ?? 50) + "%",
    opacity: settings?.visible === false ? 0 : (settings?.opacity ?? 1),
    transform: "scale(" + Math.min(2.5, Math.max(.5, Number(settings?.scale) || 1)) + ")"
  };
}
const order = [
  "genshin cinematic.png",
  "genshin skirk.png",
  "genshin furina.png",
  "genshin miko.png"
];
const windows = [
  [.175, .35],
  [.355, .53],
  [.535, .71],
  [.715, .89]
];
const stories = [
  { tag: "01 / THE ATMOSPHERE", headline: "MAKE THEM", accent: "LOOK UP.", body: "A frame designed to stop the scroll. Cinematic atmosphere, one impossible moment." },
  { tag: "02 / THE CHARACTER", headline: "ONE FACE.", accent: "ONE STORY.", body: "Every detail leads back to the subject. Clarity first, then spectacle." },
  { tag: "03 / THE COMPOSITION", headline: "FRAME THE", accent: "FEELING.", body: "Shape, typography and color work together instead of fighting for attention." },
  { tag: "04 / THE FINISH", headline: "MAKE IT", accent: "MATTER.", body: "Expressive character art polished for a frame that feels worth clicking." }
];

function RibbonArt({ fibersRef, threadRef, dotRef }) {
  return <svg className="cinema-art" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id="cinema-ribbon-stroke" x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#f1a274" />
        <stop offset=".5" stopColor="#db444e" />
        <stop offset="1" stopColor="#8e2034" />
      </linearGradient>
    </defs>
    <path className="cinema-main-thread" ref={threadRef}
      d="M690,-90 C520,250 1000,240 760,520 S1110,840 840,990"
      pathLength="100" fill="none" stroke="url(#cinema-ribbon-stroke)" strokeWidth="4.5"
      strokeLinecap="round" />
    <g ref={fibersRef} fill="none" strokeLinecap="round">
      {FIBERS.map((fiber, index) => <path key={index} d={fiberPath(fiber.start)}
        stroke={fiber.ink} strokeWidth={fiber.size} opacity={.5 + (index % 6) * .065}/>)}
    </g>
    <circle ref={dotRef} cx="816" cy="401" r="7" fill="#f7d0b3" stroke="#dd4c56" strokeWidth="3" />
  </svg>;
}
function ArtworkCard({ item, index }) {
  const [start, end] = windows[index];
  return <div className="cinema-chapter" data-start={start} data-end={end} aria-hidden="true">
    <div className="cinema-chapter-text">
      <span className="cinema-chapter-label">{stories[index].tag} · GENSHIN IMPACT</span>
      <h2>{stories[index].headline}<br/><em>{stories[index].accent}</em></h2>
      <p>{stories[index].body}</p>
      <span className="cinema-chapter-count">0{index + 1} <b>/ 04</b> <i /> SCROLL / REVEAL</span>
    </div>
    <div className="cinema-image-track">
      <span className="cinema-image-knot" aria-hidden="true" />
      <Link href={"/thumbnails/view?file=" + encodeURIComponent(item.filename) + "&category=GENSHIN"}
        className="cinema-feature-image" tabIndex={-1} aria-label={"View artwork: " + item.title}>
        <Image src={item.src} alt={item.title} fill quality={72}
          sizes="(max-width: 760px) 88vw, (max-width: 1280px) 47vw, 45vw"
          loading={index ? "lazy" : "eager"} style={imageStyle(item.settings)} />
        <span className="cinema-image-shade" />
        <span className="cinema-image-caption">
          <small>0{index + 1} / ART DIRECTION</small><strong>{item.title}</strong><b>↗</b>
        </span>
      </Link>
      <span className="cinema-image-tail">CONNECTED TO THE LINE / 0{index + 1}</span>
    </div>
  </div>;
}

export default function HomeHero() {
  const { media } = useSiteMedia();
  const sceneRef = useRef(null);
  const fibersRef = useRef(null);
  const threadRef = useRef(null);
  const dotRef = useRef(null);
  const introRef = useRef(null);
  const finaleRef = useRef(null);
  const chaptersRef = useRef(null);
  const progressRef = useRef(null);
  const progressLabelRef = useRef(null);
  const bloomRef = useRef(null);
  const chapterLabelRef = useRef(null);
  const transitionRef = useRef(null);

  const items = useMemo(() => {
    const all = getChronologicalThumbnailGroups(media).flatMap(group => group.thumbnails)
      .filter(item => item.label === "GENSHIN");
    return order.map(name => all.find(item => item.filename === name))
      .filter(Boolean).map(item => ({
        ...item,
        settings: media.overrides?.[item.filename] || {},
        src: media.overrides?.[item.filename]?.src || item.src
      }));
  }, [media]);
  const itemKey = items.map(item => item.filename + item.src).join("|");

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fibers = [...fibersRef.current.children];
    const chapters = [...chaptersRef.current.children];
    const links = chapters.map(node => node.querySelector(".cinema-feature-image"));
    const threadLength = threadRef.current.getTotalLength();
    const mobile = window.matchMedia("(max-width: 760px)").matches;
    let tween;
    let observer;
    let indexCurrent = -1;
    let percentCurrent = -1;
    let introActive = false;
    let finaleActive = true;
    const introLinks = [...introRef.current.querySelectorAll("a")];
    const finaleLinks = [...finaleRef.current.querySelectorAll("a")];

    const header = document.querySelector(".site-header");
    const measure = () => {
      scene.style.setProperty("--cinema-header", (header?.getBoundingClientRect().height || 0) + "px");
    };
    const render = value => {
      const p = clamp(value);
      const artProgress = p < .15 ? p * .9 : p < .86 ? .16 + (p - .15) * .88 : .79 + (p - .86) * 1.5;
      fibers.forEach((fiber, index) => {
        if (mobile && index % 2) return;
        fiber.setAttribute("d", fiberPath(fiberAt(FIBERS[index], artProgress)));
      });
      threadRef.current.style.strokeDasharray = "100";
      threadRef.current.style.strokeDashoffset = String(100 - Math.min(100, p * 128));
      // Keep the traveling bead attached to the actual ribbon path, instead
      // of approximating its location with an unrelated sine wave.
      const location = threadRef.current.getPointAtLength(threadLength * Math.min(1, p * 1.28));
      dotRef.current.setAttribute("cx", location.x.toFixed(1));
      dotRef.current.setAttribute("cy", location.y.toFixed(1));
      dotRef.current.style.opacity = String(smooth(.08, .18, p) * (1 - smooth(.88, 1, p)));
      bloomRef.current.style.opacity = String(smooth(.79, .96, p));
      transitionRef.current.style.opacity = String(smooth(.945, .998, p));

      const introOpacity = 1 - smooth(.115, .21, p);
      introRef.current.style.opacity = String(introOpacity);
      introRef.current.style.transform = "translate3d(" + (-95 * (1 - introOpacity)).toFixed(1) + "px,0,0)";
      const allowIntro = introOpacity > .96;
      if (introActive !== allowIntro) {
        introActive = allowIntro;
        introRef.current.setAttribute("aria-hidden", allowIntro ? "false" : "true");
        introLinks.forEach(a => { a.tabIndex = allowIntro ? 0 : -1; a.style.pointerEvents = allowIntro ? "auto" : "none"; });
      }
      const finish = smooth(.89, .965, p);
      finaleRef.current.style.opacity = String(finish);
      finaleRef.current.style.transform = "translate3d(" + (100 * (1 - finish)).toFixed(1) + "px,0,0)";
      const allowFinale = finish > .96;
      if (finaleActive !== allowFinale) {
        finaleActive = allowFinale;
        finaleRef.current.setAttribute("aria-hidden", allowFinale ? "false" : "true");
        finaleLinks.forEach(a => { a.tabIndex = allowFinale ? 0 : -1; a.style.pointerEvents = allowFinale ? "auto" : "none"; });
      }

      chapters.forEach((chapter, index) => {
        const [start, end] = windows[index];
        const visibility = interval(p, start, end);
        const entry = 1 - smooth(start, start + .075, p);
        const exit = smooth(end - .075, end, p);
        chapter.style.opacity = String(visibility);
        chapter.style.visibility = visibility < .008 ? "hidden" : "visible";
        chapter.style.setProperty("--chapter-x", ((entry * 100) - (exit * 75)).toFixed(1) + "px");
        chapter.style.setProperty("--chapter-text-x", ((-entry * 90) + (exit * 65)).toFixed(1) + "px");
        chapter.style.setProperty("--chapter-image-y", ((entry * 86) - (exit * 45)).toFixed(1) + "px");
        const allowed = visibility > .92;
        if (chapter.dataset.active !== String(allowed)) {
          chapter.dataset.active = String(allowed);
          chapter.style.pointerEvents = allowed ? "auto" : "none";
          chapter.setAttribute("aria-hidden", allowed ? "false" : "true");
          if (links[index]) { links[index].tabIndex = allowed ? 0 : -1; links[index].style.pointerEvents = allowed ? "auto" : "none"; }
        }
      });

      progressRef.current.style.transform = "scaleX(" + p + ")";
      const percent = Math.round(p * 100);
      if (percent !== percentCurrent) {
        percentCurrent = percent;
        progressLabelRef.current.textContent = String(percent).padStart(2, "0") + "%";
      }
      const active = windows.findIndex(([start,end]) => p >= start && p < end);
      if (active !== indexCurrent) {
        indexCurrent = active;
        scene.dataset.chapter = String(active);
        if (chapterLabelRef.current) {
          chapterLabelRef.current.textContent = active < 0
            ? (p < .16 ? "01 / INTRODUCTION" : "06 / FINALE")
            : "0" + (active + 2) + " / ARTWORK";
        }
      }
    };

    measure();
    if (reduced) {
      render(0);
      introRef.current.removeAttribute("aria-hidden");
      finaleRef.current.removeAttribute("aria-hidden");
      introLinks.forEach(link => { link.tabIndex = 0; link.style.pointerEvents = "auto"; });
      finaleLinks.forEach(link => { link.tabIndex = 0; link.style.pointerEvents = "auto"; });
      chapters.forEach((node, index) => {
        node.style.opacity = "1";
        node.style.visibility = "visible";
        node.style.pointerEvents = "auto";
        node.setAttribute("aria-hidden", "false");
        node.style.setProperty("--chapter-x", "0px");
        node.style.setProperty("--chapter-text-x", "0px");
        node.style.setProperty("--chapter-image-y", "0px");
        if (links[index]) { links[index].tabIndex = 0; links[index].style.pointerEvents = "auto"; }
      });
      return () => scene.style.removeProperty("--cinema-header");
    }
    gsap.registerPlugin(ScrollTrigger);
    const state = { progress: 0 };
    tween = gsap.to(state, {
      progress: 1, ease: "none", onUpdate: () => render(state.progress),
      scrollTrigger: {
        trigger: scene,
        start: () => "top top+=" + (parseFloat(scene.style.getPropertyValue("--cinema-header")) || 0),
        end: "bottom bottom", scrub: .4, invalidateOnRefresh: true
      }
    });
    render(tween.scrollTrigger?.progress || 0);
    if (header) {
      observer = new ResizeObserver(() => { measure(); ScrollTrigger.refresh(); });
      observer.observe(header);
    }
    ScrollTrigger.refresh();
    return () => {
      observer?.disconnect();
      tween?.scrollTrigger?.kill();
      tween?.kill();
      scene.style.removeProperty("--cinema-header");
    };
  }, [itemKey]);

  const copy = media.copy || {};
  const portrait = media.slots?.heroPortrait || {
    src: "/hero_krishna_vertical.jpg", visible: true, positionX: 50, positionY: 42
  };
  const showcase = media.slots?.heroShowcase;
  const showcaseSrc = showcase?.src || items[0]?.src;
  const showcaseSettings = showcase?.src ? showcase : items[0]?.settings;
  const background = media.slots?.heroBackground;
  const cutout = media.slots?.heroCutout;

  return <section className="cinema-story" id="home" ref={sceneRef} aria-label="Scroll through Krishna's work">
    <div className="cinema-stage">
      {background?.src && background.visible !== false && <div className="cinema-custom-background" aria-hidden="true">
        <img src={background.src} alt="" style={imageStyle(background)} />
        {background.overlayOpacity > 0 && <span style={{backgroundColor: background.overlayColor || "#191e1d", opacity: background.overlayOpacity}} />}
      </div>}
      <div className="cinema-noise" aria-hidden="true" />
      <div className="cinema-amber-light" aria-hidden="true" />
      <div className="cinema-art-layer" aria-hidden="true">
        <RibbonArt fibersRef={fibersRef} threadRef={threadRef} dotRef={dotRef} />
        <div className="cinema-bloom" ref={bloomRef}/>
      </div>

      <div className="cinema-eyeline" aria-hidden="true">
        <span>KRISHNA / CREATIVE DEVELOPER</span>
        <span ref={chapterLabelRef}>01 / INTRODUCTION</span>
      </div>
      <a className="cinema-skip-story" href="#work" aria-label="Skip cinematic introduction and view selected work">
        SKIP TO WORK <span aria-hidden="true">↘</span>
      </a>

      <div className="cinema-intro" ref={introRef}>
        {cutout?.src && cutout.visible !== false && <div className="cinema-custom-cutout" aria-hidden="true"><img src={cutout.src} alt="" style={imageStyle(cutout)} /></div>}
        {showcaseSrc && showcase?.visible !== false && <div className="cinema-intro-object" aria-hidden="true">
          <div className="cinema-object-halo" />
          <div className="cinema-object-frame">
            <img src={showcaseSrc} alt="" style={imageStyle(showcaseSettings)} />
            {showcaseSettings?.overlayOpacity > 0 && <span className="cinema-object-overlay" style={{backgroundColor: showcaseSettings.overlayColor || "#a8271b", opacity: showcaseSettings.overlayOpacity}} />}
            <span className="cinema-object-glass" />
            <span className="cinema-object-label"><b>SELECTED FRAME</b><span>ART DIRECTION / 01</span></span>
          </div>
          <span className="cinema-object-index">01 / 06 <i /> CREATIVE PRACTICE</span>
        </div>}
        <span className="cinema-kicker">{copy.heroEyebrow || "CREATIVE DEVELOPER × VISUAL DESIGNER"}</span>
        <h1>NOT JUST<br/>A <em>FRAME.</em><br/>A FEELING.</h1>
        <p>{copy.heroDescription || "I craft immersive websites, intelligent software and expressive gaming artwork. Every detail has a reason."}</p>
        <div className="cinema-intro-actions">
          <a href="#work">EXPLORE MY WORK ↗</a>
          <a href="#contact">START A CONVERSATION ↗</a>
        </div>
      </div>

      <div className="cinema-chapters" ref={chaptersRef}>
        {items.map((item, index) => <ArtworkCard key={item.filename} item={item} index={index} />)}
      </div>

      <div className="cinema-finale" ref={finaleRef}>
        <span>FINAL CHAPTER / THE BIG PICTURE</span>
        <h2>BUILT WITH<br/><em>INTENT.</em></h2>
        <p>Great work is never just the image. It is the idea, the interaction, and the story that connects them.</p>
        <div className="cinema-finale-actions">
          <Link href="/thumbnails">DISCOVER THE ARCHIVE ↗</Link>
          <a href="#work">CONTINUE THE JOURNEY ↓</a>
        </div>
      </div>

      <div className="cinema-transition-wash" ref={transitionRef} aria-hidden="true" />
      <div className="cinema-bottom-bar">
        <div className="cinema-byline">
          {portrait.src && portrait.visible !== false && <span className="cinema-avatar">
            <img src={portrait.src} alt="" style={imageStyle(portrait)} />
          </span>}
          <span>KRISHNA <small>CODE • ART • EXPERIMENTS</small></span>
        </div>
        <span className="cinema-scroll-notice">SCROLL TO FOLLOW THE RED THREAD ↓</span>
        <span className="cinema-percent" ref={progressLabelRef}>00%</span>
      </div>
      <div className="cinema-viewport-progress"><span ref={progressRef}/></div>
    </div>
  </section>;
}

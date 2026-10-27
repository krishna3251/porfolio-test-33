"use client";

import { useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { getChronologicalThumbnailGroups } from "@/lib/thumbnails";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useSiteMedia from "@/hooks/useSiteMedia";

// Dense visual silhouette without excessive DOM work per animation frame.
const RIBBON_COUNT = 64;
const TAU = Math.PI * 2;
const clamp = (n) => Math.min(1, Math.max(0, n));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = (a, b, t) => {
  const p = clamp((t - a) / (b - a));
  return p * p * (3 - 2 * p);
};

function radialPath(angle, outerRadius, innerRadius, curl) {
  const cx = 790;
  const cy = 410;
  const at = (radius, rotation) => [
    cx + Math.cos(rotation) * radius,
    cy + Math.sin(rotation) * radius * .87
  ];
  return [
    ...at(outerRadius, angle + curl),
    ...at(outerRadius * .88, angle + curl * 1.65),
    ...at(innerRadius * 1.28, angle + curl * .48),
    ...at(innerRadius, angle)
  ];
}

const RIBBONS = Array.from({ length: RIBBON_COUNT }, (_, index) => {
  const t = index / (RIBBON_COUNT - 1);
  const wave = Math.sin(index * 1.83);
  const flutter = Math.cos(index * .77);
  const fanAngle = Math.PI + t * Math.PI;
  const circleAngle = Math.PI + t * TAU;
  const topX = 570 + t * 280 + wave * 26;
  const initial = [
    topX - 20, -350 - t * 110,
    topX + 55, -60,
    730 + t * 160 + flutter * 30, 80 + wave * 35,
    740 + t * 175 + flutter * 60, 260 + Math.sin(t * 8) * 110
  ];
  const falling = [
    410 + t * 500 + flutter * 18, -270 - t * 80,
    490 + t * 400 + wave * 63, 120 + t * 110,
    830 + Math.sin(t * 4.4) * 155, 450 + wave * 90,
    520 + t * 490 + flutter * 55, 890 + t * 110
  ];
  const fan = radialPath(fanAngle, 285 + flutter * 23, 88 + wave * 9, .17);
  const circle = radialPath(circleAngle, 226 + flutter * 20, 103 + wave * 9, .22);
  return {
    poses: [initial, falling, fan, circle],
    width: (5.7 + (1 + wave) * 3.1 + (index % 7 === 0 ? 2.2 : 0)).toFixed(2),
    hue: 350 + Math.round(wave * 6),
    lightness: 30 + Math.round((wave + 1) * 12),
    tip: index % 7 === 0
  };
});

function cubicPath(points) {
  return "M " + points[0].toFixed(1) + " " + points[1].toFixed(1) +
    " C " + points[2].toFixed(1) + " " + points[3].toFixed(1) +
    ", " + points[4].toFixed(1) + " " + points[5].toFixed(1) +
    ", " + points[6].toFixed(1) + " " + points[7].toFixed(1);
}

function ribbonAt(ribbon, progress) {
  const p = clamp(progress);
  const breaks = [0, .29, .63, .88];
  const stage = p < breaks[1] ? 0 : p < breaks[2] ? 1 : 2;
  const phase = ease(breaks[stage], breaks[stage + 1], p);
  return ribbon.poses[stage].map((point, index) =>
    lerp(point, ribbon.poses[stage + 1][index], phase)
  );
}

function imageStyle(settings) {
  return {
    objectFit: settings?.fit === "contain" ? "contain" : "cover",
    objectPosition: (settings?.positionX ?? 50) + "% " + (settings?.positionY ?? 50) + "%",
    transform: "scale(" + Math.min(2.5, Math.max(.5, Number(settings?.scale) || 1)) + ")",
    opacity: settings?.visible === false ? 0 : (settings?.opacity ?? 1)
  };
}

function FallingRibbons({ pathsRef, tipsRef, ringShadowRef }) {
  return (
    <svg className="fullbleed-artwork" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice"
      role="presentation" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="fullbleed-red-glow">
          <stop offset="0" stopColor="#e94954" stopOpacity=".18" />
          <stop offset=".63" stopColor="#ed5579" stopOpacity=".06" />
          <stop offset="1" stopColor="#ed5579" stopOpacity="0" />
        </radialGradient>
        <filter id="fullbleed-soft-glow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
      <circle cx="790" cy="410" r="360" fill="url(#fullbleed-red-glow)" />
      <ellipse ref={ringShadowRef} cx="795" cy="606" rx="240" ry="31"
        fill="#9c3e48" opacity="0" filter="url(#fullbleed-soft-glow)" />
      <g className="fullbleed-ribbons" ref={pathsRef} fill="none" strokeLinecap="round">
        {RIBBONS.map((ribbon, index) => (
          <path key={index} d={cubicPath(ribbon.poses[0])}
            stroke={"hsl(" + ribbon.hue + " 69% " + ribbon.lightness + "%)"}
            strokeWidth={ribbon.width} />
        ))}
      </g>
      <g className="fullbleed-light-tips" ref={tipsRef}>
        {RIBBONS.filter(r => r.tip).map((ribbon, index) => (
          <g key={index}>
            <circle r="12" fill="#ee4359" filter="url(#fullbleed-soft-glow)" />
            <circle r="3.5" fill="#ffb8a5" />
          </g>
        ))}
      </g>
    </svg>
  );
}

export default function HomeHero() {
  const { media } = useSiteMedia();
  const { slots = {}, copy = {} } = media;
  const sceneRef = useRef(null);
  const artRef = useRef(null);
  const pathsRef = useRef(null);
  const tipsRef = useRef(null);
  const ringShadowRef = useRef(null);
  const firstHeadingRef = useRef(null);
  const finalHeadingRef = useRef(null);
  const descriptionRef = useRef(null);
  const progressRef = useRef(null);
  const progressTextRef = useRef(null);
  const galleryRef = useRef(null);
  const galleryTitleRef = useRef(null);
  const galleryIndexRef = useRef(null);

  // Reuse the actual archive's category mapping and admin overrides.
  const galleryItems = useMemo(() => {
    const all = getChronologicalThumbnailGroups(media)
      .flatMap((group) => group.thumbnails)
      .filter((item) => item.label === "GENSHIN");
    const featuredOrder = [
      "genshin cinematic.png", "genshin skirk.png",
      "genshin furina.png", "genshin miko.png", "oddete genshin.png"
    ];
    return all
      .sort((a, b) => {
        const ar = featuredOrder.indexOf(a.filename);
        const br = featuredOrder.indexOf(b.filename);
        return (ar < 0 ? 99 : ar) - (br < 0 ? 99 : br);
      })
      .slice(0, 4)
      .map((item) => ({
        ...item,
        src: media.overrides?.[item.filename]?.src || item.src,
        settings: media.overrides?.[item.filename] || {}
      }));
  }, [media]);
  const galleryKey = galleryItems.map((item) => item.filename + item.src).join("|");

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || !pathsRef.current) return undefined;

    const paths = Array.from(pathsRef.current.children);
    const tips = Array.from(tipsRef.current.children);
    const glowingRibbons = RIBBONS.filter(r => r.tip);
    const galleryCards = Array.from(galleryRef.current?.querySelectorAll(".fullbleed-gallery-card") || []);
    const galleryLinks = galleryCards.map((card) => card.querySelector("a"));
    const archiveLink = galleryRef.current?.querySelector(".fullbleed-gallery-archive");
    const mobile = window.matchMedia("(max-width: 760px)").matches;
    let lastLabel = -1;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let tween;
    let observer;

    const updateLayout = () => {
      const header = document.querySelector(".site-header");
      scene.style.setProperty("--fullbleed-header", (header?.getBoundingClientRect().height || 0) + "px");
    };

    function draw(progress) {
      const p = clamp(progress);
      paths.forEach((path, index) => {
        // Alternate ribbons on phones: 32 paths still cover the full shape.
        if (mobile && index % 2 !== 0) return;
        path.setAttribute("d", cubicPath(ribbonAt(RIBBONS[index], p)));
      });
      tips.forEach((tip, index) => {
        const coords = ribbonAt(glowingRibbons[index], p);
        tip.setAttribute("transform", "translate(" + coords[6].toFixed(1) + " " + coords[7].toFixed(1) + ")");
        tip.style.opacity = String(1 - ease(.38, .68, p));
      });
      ringShadowRef.current.setAttribute("opacity", String(ease(.65, .9, p) * .18));
      firstHeadingRef.current.style.opacity = String(1 - ease(.41, .61, p));
      firstHeadingRef.current.style.transform = "translateY(" + (-18 * ease(.41, .61, p)) + "px)";
      finalHeadingRef.current.style.opacity = String(ease(.68, .87, p));
      finalHeadingRef.current.style.transform = "translateY(" + (22 * (1 - ease(.68, .87, p))) + "px)";
      descriptionRef.current.style.opacity = String(1 - ease(.34, .61, p) * .55);
      galleryCards.forEach((card, index) => {
        const first = .32 + index * .105;
        const reveal = ease(first, first + .135, p);
        const settle = ease(first + .16, first + .38, p);
        const y = (1 - reveal) * 95 - settle * 18;
        const rotate = (index % 2 ? 1 : -1) * (1 - reveal) * 9;
        const retreat = mobile ? 1 - ease(.78, .98, p) * .80 : 1;
        card.style.opacity = String(reveal * retreat);
        card.style.visibility = reveal < .02 ? "hidden" : "visible";
        const interactive = reveal * retreat > .58;
        if (card.dataset.interactive !== String(interactive)) {
          card.dataset.interactive = String(interactive);
          card.style.pointerEvents = interactive ? "auto" : "none";
          card.setAttribute("aria-hidden", interactive ? "false" : "true");
          if (galleryLinks[index]) galleryLinks[index].tabIndex = interactive ? 0 : -1;
        }
        card.style.transform =
          "translate3d(" + ((1 - reveal) * 56).toFixed(1) + "px," +
          y.toFixed(1) + "px,0) rotate(" + rotate.toFixed(1) + "deg) scale(" +
          (.88 + reveal * .12).toFixed(3) + ")";
       });
      if (archiveLink) {
        const showArchive = ease(.73, .89, p);
        archiveLink.style.opacity = String(showArchive);
        archiveLink.style.visibility = showArchive > .02 ? "visible" : "hidden";
        archiveLink.style.pointerEvents = showArchive > .65 ? "auto" : "none";
        archiveLink.tabIndex = showArchive > .65 ? 0 : -1;
      }
      if (galleryTitleRef.current) {
        const appear = ease(.28, .43, p);
        galleryTitleRef.current.style.opacity = String(appear);
        galleryTitleRef.current.style.transform = "translateY(" + (20 * (1 - appear)).toFixed(1) + "px)";
      }
      if (galleryIndexRef.current) {
        const index = Math.min(4, Math.max(0, Math.floor((p - .3) / .105)));
        galleryIndexRef.current.textContent = String(index).padStart(2, "0") + " / 04";
      }
      artRef.current.style.setProperty("--ribbon-drift", (-27 * ease(0, .58, p) + 20 * ease(.58, 1, p)).toFixed(1) + "px");
      progressRef.current.style.transform = "scaleX(" + p + ")";
      if (progressTextRef.current) {
        const next = Math.round(p * 100);
        if (next !== lastLabel) {
          lastLabel = next;
          progressTextRef.current.textContent = String(next).padStart(2, "0") + "%";
        }
      }
    }

    updateLayout();
    if (reducedMotion.matches) {
      draw(1);
      return () => scene.style.removeProperty("--fullbleed-header");
    }

    gsap.registerPlugin(ScrollTrigger);
    const scrub = { value: 0 };
    tween = gsap.to(scrub, {
      value: 1,
      ease: "none",
      onUpdate: () => draw(scrub.value),
      scrollTrigger: {
        trigger: scene,
        start: () => "top top+=" + (parseFloat(scene.style.getPropertyValue("--fullbleed-header")) || 0),
        end: "bottom bottom",
        scrub: .55,
        invalidateOnRefresh: true
      }
    });
    draw(tween.scrollTrigger?.progress ?? 0);

    const header = document.querySelector(".site-header");
    if (header) {
      observer = new ResizeObserver(() => {
        updateLayout();
        ScrollTrigger.refresh();
      });
      observer.observe(header);
    }
    ScrollTrigger.refresh();
    return () => {
      observer?.disconnect();
      tween?.scrollTrigger?.kill();
      tween?.kill();
      scene.style.removeProperty("--fullbleed-header");
    };
  }, [galleryKey]);

  function advance() {
    const scene = sceneRef.current;
    if (!scene) return;
    const begin = window.scrollY + scene.getBoundingClientRect().top;
    const travel = Math.max(0, scene.offsetHeight - (window.innerHeight - (parseFloat(scene.style.getPropertyValue("--fullbleed-header")) || 0)));
    const relative = (window.scrollY - begin) / (travel || 1);
    const next = Math.min(1, Math.floor(relative * 4 + 1) / 4);
    window.scrollTo({
      top: begin + next * travel,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth"
    });
  }

  const portrait = slots.heroPortrait || { src: "/hero_krishna_vertical.jpg", fit: "cover", positionX: 50, positionY: 42 };

  return (
    <section className="fullbleed-scroll-scene" ref={sceneRef} id="home" aria-label="Krishna portfolio, scroll to transform the artwork">
      <div className="fullbleed-hero">
        <div className="fullbleed-texture" aria-hidden="true" />
        {slots.heroBackground?.src && slots.heroBackground.visible !== false && (
          <img className="fullbleed-background-photo" src={slots.heroBackground.src} alt="" aria-hidden="true"
            style={imageStyle(slots.heroBackground)} />
        )}

        <div className="fullbleed-art" ref={artRef} aria-hidden="true">
          <FallingRibbons pathsRef={pathsRef} tipsRef={tipsRef} ringShadowRef={ringShadowRef} />
        </div>
        <div className="fullbleed-grain" aria-hidden="true" />

        {galleryItems.length > 0 && (
          <div className="fullbleed-gallery" ref={galleryRef} aria-label="Genshin Impact thumbnail highlights">
            <div className="fullbleed-gallery-heading" ref={galleryTitleRef}>
              <span>SELECTED / VISUAL ARCHIVE</span>
              <strong>GENSHIN IMPACT</strong>
              <span className="fullbleed-gallery-count" ref={galleryIndexRef}>00 / 04</span>
            </div>
            {galleryItems.map((item, index) => (
              <article className="fullbleed-gallery-card" key={item.filename} aria-hidden="true">
                <Link
                  href={"/thumbnails/view?file=" + encodeURIComponent(item.filename) + "&category=GENSHIN"}
                  className="fullbleed-gallery-link"
                  aria-label={"View Genshin artwork: " + item.title}
                  tabIndex={-1}
                >
                  <span className="fullbleed-gallery-image">
                    <Image src={item.src} alt={item.title} fill
                      sizes="(max-width: 760px) 56vw, (max-width: 1100px) 26vw, 23vw"
                      quality={72} loading={index === 0 ? "eager" : "lazy"} decoding="async"
                      style={imageStyle(item.settings)} />
                  </span>
                  <span className="fullbleed-gallery-meta">
                    <span>0{index + 1} / GENSHIN</span>
                    <strong>{item.title}</strong>
                    <span aria-hidden="true">↗</span>
                  </span>
                </Link>
              </article>
            ))}
            <Link href="/thumbnails" className="fullbleed-gallery-archive" tabIndex={-1}>VIEW ALL THUMBNAILS ↗</Link>
          </div>
        )}

        <div className="fullbleed-overline">
          <span><i aria-hidden="true" /> KRISHNA / DIGITAL CRAFT</span>
          <span>INDEPENDENT DEVELOPER<br />VISUAL DESIGNER / HYDERABAD</span>
          <span>EXPERIMENT NO. 001<br />SCROLL TO DISCOVER ↓</span>
        </div>

        <div className="fullbleed-editorial-content">
          <div className="fullbleed-intro">
            <p className="fullbleed-eyebrow">{copy.heroEyebrow || "WHERE DEVELOPMENT MEETS DESIGN"}</p>
            <h1 className="fullbleed-heading" aria-label="Where code meets your vision. Start seeing differently.">
              <span ref={firstHeadingRef} className="fullbleed-heading-state">
                WHERE CODE<br />MEETS <em>YOUR</em><br />VISION<span className="fullbleed-period">.</span>
              </span>
              <span ref={finalHeadingRef} className="fullbleed-heading-state fullbleed-heading-state-final" aria-hidden="true">
                START SEEING<br /><em>DIFFERENTLY</em><span className="fullbleed-period">.</span>
              </span>
            </h1>
            <div className="fullbleed-description" ref={descriptionRef}>
              <p>{copy.heroDescription ||
                "I build intelligent software, expressive websites, and gaming visuals that stand out. Code with character. Design with purpose."}</p>
              <div className="fullbleed-links">
                <a href="#work">EXPLORE WORK <span aria-hidden="true">↗</span></a>
                <a href="#contact">LET&apos;S CONNECT <span aria-hidden="true">↗</span></a>
              </div>
            </div>
          </div>
        </div>

        <div className="fullbleed-bottom">
          <div className="fullbleed-person">
            {portrait.src && portrait.visible !== false && (
              <span className="fullbleed-avatar">
                <img src={portrait.src} alt="" aria-hidden="true" style={imageStyle(portrait)} />
              </span>
            )}
            <span>KRISHNA<br /><small>CODE / ART / AI</small></span>
          </div>
          <button className="fullbleed-scroll-hint" type="button" onClick={advance}
            aria-label="Advance the scroll animation">
            SCROLL TO TRANSFORM <span aria-hidden="true">↓</span>
          </button>
          <div className="fullbleed-progress-label">SCROLL PROGRESS <span ref={progressTextRef}>00%</span></div>
        </div>
        <div className="fullbleed-progress-track" aria-hidden="true"><span ref={progressRef} /></div>
      </div>
    </section>
  );
}

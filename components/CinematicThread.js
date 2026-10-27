"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const clamp = n => Math.max(0, Math.min(1, n));

// A quiet continuation of the red ribbon along the entire homepage.
// It starts after the cinematic chapters and follows the remaining page scroll.
export default function CinematicThread() {
  const rootRef = useRef(null);
  const lineRef = useRef(null);
  const beadRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    const page = root?.closest(".site-page--cinematic");
    const story = page?.querySelector(".cinema-story");
    if (!root || !page || !story ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const render = () => {
      const storyBottom = story.getBoundingClientRect().bottom;
      const reveal = clamp((window.innerHeight - storyBottom) / (window.innerHeight * .9));
      const pageBottom = page.getBoundingClientRect().bottom;
      const available = Math.max(1, page.scrollHeight - story.offsetHeight - window.innerHeight);
      const traveled = Math.max(0, window.scrollY + window.innerHeight - (story.offsetTop + story.offsetHeight));
      const progress = clamp(traveled / available);
      const out = clamp(pageBottom / (window.innerHeight * .9));
      const opacity = reveal * Math.min(.65, .26 + progress * .32) * out;
      root.style.opacity = String(opacity);
      lineRef.current.style.strokeDashoffset = String(97 - progress * 90);
      beadRef.current.setAttribute("cy", String(30 + progress * 700));
    };

    const trigger = ScrollTrigger.create({
      trigger: page,
      start: "top top",
      end: "bottom bottom",
      onUpdate: render,
      onRefresh: render
    });
    render();
    return () => trigger.kill();
  }, []);

  return <div className="cinema-page-thread" ref={rootRef} aria-hidden="true">
    <svg viewBox="0 0 135 800" preserveAspectRatio="none" focusable="false">
      <path ref={lineRef} className="cinema-page-thread-line" pathLength="100"
        d="M72,-25 C0,185 147,265 64,408 S122,643 58,830" />
      <circle ref={beadRef} cx="64" cy="30" r="6" />
    </svg>
  </div>;
}

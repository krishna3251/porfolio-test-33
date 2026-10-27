"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Side-to-center reveals for the sections after the scroll narrative.
// Scrubbing preserves the same motion vocabulary when scrolling backwards,
// without replacing or disabling any existing interactive sections.
export default function CinematicSectionFlow() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const page = document.querySelector(".site-page--cinematic");
    if (!page) return;

    const sections = [...page.querySelectorAll("main > section:not(.cinema-story)")];
    if (!sections.length) return;

    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      sections.forEach((section, index) => {
        const direction = index % 2 === 0 ? -1 : 1;
        const fromX = direction * (window.innerWidth < 760 ? 26 : 70);
        gsap.fromTo(section, {
          x: fromX,
          opacity: .68
        }, {
          x: 0,
          opacity: 1,
          ease: "none",
          immediateRender: false,
          scrollTrigger: {
            trigger: section,
            start: "top 94%",
            end: "top 49%",
            scrub: .5,
            invalidateOnRefresh: true
          }
        });
        gsap.fromTo(section, {
          opacity: 1,
        }, {
          opacity: .82,
          ease: "none",
          immediateRender: false,
          scrollTrigger: {
            trigger: section,
            start: "bottom 26%",
            end: "bottom 4%",
            scrub: .5,
            invalidateOnRefresh: true
          }
        });
      });
    }, page);
    ScrollTrigger.refresh();

    return () => context.revert();
  }, []);

  return null;
}

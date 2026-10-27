"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const clamp = value => Math.max(0, Math.min(1, value));
const eased = value => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};

// One reversible calculation per section: no competing opacity tweens.
// Existing carousels, links and in-section animations remain intact.
export default function CinematicSectionFlow() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const page = document.querySelector(".site-page--cinematic");
    if (!page) return;
    const sections = [...page.querySelectorAll("main > section:not(.cinema-story), footer.contact")];
    if (!sections.length) return;

    gsap.registerPlugin(ScrollTrigger);
    const triggers = sections.map((section, index) => {
      const direction = index % 2 === 0 ? -1 : 1;
      const update = () => {
        const rect = section.getBoundingClientRect();
        const entry = eased((window.innerHeight - rect.top) / (window.innerHeight * .46));
        const departure = eased((window.innerHeight * .25 - rect.bottom) / (window.innerHeight * .25));
        const distance = window.innerWidth < 760 ? 25 : 70;
        section.style.opacity = String(.68 + .32 * entry - departure * .16);
        section.style.transform = "translate3d(" +
          (direction * (distance * (1 - entry) + 16 * departure)).toFixed(2) + "px,0,0)";
      };
      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        onUpdate: update,
        onRefresh: update,
        onEnter: update,
        onLeaveBack: update
      });
      update();
      return trigger;
    });
    ScrollTrigger.refresh();

    return () => {
      triggers.forEach(trigger => trigger.kill());
      sections.forEach(section => {
        section.style.removeProperty("opacity");
        section.style.removeProperty("transform");
      });
    };
  }, []);

  return null;
}

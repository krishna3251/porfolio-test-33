"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Smooth desktop wheel scrolling without taking over touch, keyboard navigation
// or reduced-motion preferences. GSAP and Lenis use the same ticker.
export default function SmoothScroll({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const touch = window.matchMedia("(pointer: coarse)");
    if (reduced.matches || touch.matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.13,
      smoothWheel: true,
      wheelMultiplier: 0.94,
      syncTouch: false,
      anchors: { offset: -80 },
      prevent: (element) => Boolean(element.closest?.("[data-lenis-prevent]"))
    });
    const update = () => ScrollTrigger.update();
    const frame = (time) => lenis.raf(time * 1000);
    lenis.on("scroll", update);
    gsap.ticker.add(frame);
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(frame);
      lenis.off("scroll", update);
      lenis.destroy();
      ScrollTrigger.refresh();
    };
  }, [pathname]);

  return children;
}

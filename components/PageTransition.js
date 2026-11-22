"use client";

import { useEffect, useRef } from "react";
import { MotionConfig } from "framer-motion";
import { usePathname } from "next/navigation";

export default function PageTransition({ children }) {
  const pathname = usePathname();
  const root = useRef(null);

  useEffect(() => {
    if (!root.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        !("IntersectionObserver" in window)) return;

    const animations = [];
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        observer.unobserve(target);
        if (!target.animate) return;
        animations.push(target.animate([
          { opacity: 0.68, transform: "translateY(16px)" },
          { opacity: 1, transform: "translateY(0)" },
        ], { duration: 520, easing: "cubic-bezier(.2,.75,.25,1)" }));
      });
    }, { threshold: 0.12 });
    root.current.querySelectorAll("[data-atlas-reveal]").forEach((section) => observer.observe(section));
    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
    };
  }, [pathname]);

  return <MotionConfig reducedMotion="user"><div ref={root} id="route-content" tabIndex={-1} className="page-content">{children}</div></MotionConfig>;
}

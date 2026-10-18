"use client";

import { useLayoutEffect, useRef } from "react";
import { MotionConfig } from "framer-motion";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Visible HTML first; route-scoped GSAP enhances it after hydration.
export default function PageTransition({ children }) {
  const pathname = usePathname();
  const root = useRef(null);
  useLayoutEffect(() => {
    if (!root.current || pathname.startsWith("/admin")) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", context => {
      const scope = gsap.utils.selector(root);
      gsap.from(scope(".hero-copy > *, .hero-portrait-editorial, .hero-topline"), {
        y: 22, opacity: .35, stagger: .055, duration: .75,
        ease: "power3.out", clearProps: "transform,opacity",
      });
      context.add("reveal", element => gsap.fromTo(element, { y: 22, opacity: .3 }, {
        y: 0, opacity: 1, duration: .65, ease: "power3.out", clearProps: "transform,opacity",
      }));
      scope(".section-heading, .services-head, .about-body, .skills-head, .skill-grid, .contact-inner, .project-intro, .project-row, .selected-work-card, .editorial-service-card, .process-display, .process-card, .studio-stat").forEach(element => {
        ScrollTrigger.create({ trigger: element, start: "top 92%", once: true,
          onEnter: () => context.reveal(element),
        });
      });
      scope(".section-marker").forEach(element => {
        gsap.from(element, { scaleX: .92, transformOrigin: "left", duration: .7,
          ease: "power3.out", scrollTrigger: { trigger: element, start: "top 90%", once: true },
          clearProps: "transform",
        });
      });
    }, root);
    const observer = new ResizeObserver(() => ScrollTrigger.refresh());
    observer.observe(root.current);
    return () => { observer.disconnect(); media.revert(); };
  }, [pathname]);
  return <MotionConfig reducedMotion="user"><div ref={root} id="route-content" tabIndex={-1} className="page-content">{children}</div></MotionConfig>;
}

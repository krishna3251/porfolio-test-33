"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const xDot = gsap.quickTo(dot, "x", { duration: 0.06, ease: "power3.out" });
    const yDot = gsap.quickTo(dot, "y", { duration: 0.06, ease: "power3.out" });
    const xRing = gsap.quickTo(ring, "x", { duration: 0.18, ease: "power3.out" });
    const yRing = gsap.quickTo(ring, "y", { duration: 0.18, ease: "power3.out" });

    const move = (event) => {
      xDot(event.clientX);
      yDot(event.clientY);
      xRing(event.clientX);
      yRing(event.clientY);
    };

    const over = (event) => {
      const target = event.target instanceof Element ? event.target.closest("a,button") : null;
      if (!target) return;

      gsap.to(ring, {
        scale: 1.45,
        borderColor: "#ff6a2a",
        duration: 0.18,
        overwrite: true,
      });

      gsap.to(dot, {
        scale: 0.45,
        backgroundColor: "#ff6a2a",
        duration: 0.18,
        overwrite: true,
      });
    };

    const out = (event) => {
      const from = event.target instanceof Element ? event.target.closest("a,button") : null;
      const to = event.relatedTarget instanceof Element ? event.relatedTarget.closest("a,button") : null;
      if (!from || from === to) return;

      gsap.to(ring, {
        scale: 1,
        borderColor: "rgba(247,244,237,.3)",
        duration: 0.18,
        overwrite: true,
      });

      gsap.to(dot, {
        scale: 1,
        backgroundColor: "#f7f4ed",
        duration: 0.18,
        overwrite: true,
      });
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    document.addEventListener("pointerout", out, { passive: true });

    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.removeEventListener("pointerout", out);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="cursor-dot fixed top-0 left-0 w-2 h-2 rounded-full bg-[#f7f4ed] pointer-events-none z-[99999] hidden md:block"
        aria-hidden="true"
      />
      <div
        ref={ringRef}
        className="cursor-ring fixed top-0 left-0 w-8 h-8 rounded-full border border-white/25 pointer-events-none z-[99998] hidden md:block"
        aria-hidden="true"
      />
    </>
  );
}

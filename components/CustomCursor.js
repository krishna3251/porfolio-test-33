"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const SELECTOR = "a, button, [role='button'], .cursor-pointer";

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) return;

    gsap.set([cursor, follower], { xPercent: -50, yPercent: -50 });

    const xTo = gsap.quickTo(cursor, "x", { duration: 0.08, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.08, ease: "power3" });
    const fxTo = gsap.quickTo(follower, "x", { duration: 0.28, ease: "power3" });
    const fyTo = gsap.quickTo(follower, "y", { duration: 0.28, ease: "power3" });

    const onPointerMove = (event) => {
      xTo(event.clientX);
      yTo(event.clientY);
      fxTo(event.clientX);
      fyTo(event.clientY);
    };

    const setHover = (active) => {
      gsap.to(follower, {
        scale: active ? 1.55 : 1,
        borderColor: active ? "var(--accent-hot)" : "rgba(247,244,237,.18)",
        backgroundColor: active ? "rgba(255,106,42,.04)" : "transparent",
        duration: 0.22,
        overwrite: true,
      });
      gsap.to(cursor, {
        scale: active ? 0.5 : 1,
        backgroundColor: active ? "var(--accent-hot)" : "rgba(247,244,237,.9)",
        duration: 0.22,
        overwrite: true,
      });
    };

    const onPointerOver = (event) => {
      const target = event.target instanceof Element ? event.target.closest(SELECTOR) : null;
      if (target) setHover(true);
    };

    const onPointerOut = (event) => {
      const target = event.target instanceof Element ? event.target.closest(SELECTOR) : null;
      if (!target) return;
      const nextTarget = event.relatedTarget instanceof Element
        ? event.relatedTarget.closest(SELECTOR)
        : null;
      if (nextTarget === target) return;
      setHover(false);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerover", onPointerOver, { passive: true });
    document.addEventListener("pointerout", onPointerOut, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("pointerout", onPointerOut);
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-2 h-2 bg-white/90 rounded-full pointer-events-none z-[300] hidden md:block mix-blend-difference"
        aria-hidden="true"
      />
      <div
        ref={followerRef}
        className="fixed top-0 left-0 w-7 h-7 border border-white/15 rounded-full pointer-events-none z-[300] hidden md:block"
        aria-hidden="true"
      />
    </>
  );
}

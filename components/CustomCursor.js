"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);

  useEffect(() => {
    // Disable custom cursor on touch devices to prevent scroll lag
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const cursor = cursorRef.current;
    const follower = followerRef.current;

    gsap.set(cursor, { xPercent: -50, yPercent: -50 });
    gsap.set(follower, { xPercent: -50, yPercent: -50 });

    const xTo = gsap.quickTo(cursor, "x", { duration: 0.08, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.08, ease: "power3" });
    const fxTo = gsap.quickTo(follower, "x", { duration: 0.35, ease: "power3" });
    const fyTo = gsap.quickTo(follower, "y", { duration: 0.35, ease: "power3" });

    const onMouseMove = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
      fxTo(e.clientX);
      fyTo(e.clientY);
    };

    window.addEventListener("mousemove", onMouseMove);

    // Hover states
    const onMouseEnter = () => {
      gsap.to(follower, {
        scale: 1.6,
        borderColor: "var(--primary-color)",
        backgroundColor: "rgba(255, 255, 255, 0.02)",
        duration: 0.3
      });
      gsap.to(cursor, {
        scale: 0.5,
        backgroundColor: "var(--primary-color)",
        duration: 0.3
      });
    };

    const onMouseLeave = () => {
      gsap.to(follower, {
        scale: 1,
        borderColor: "rgba(255, 255, 255, 0.15)",
        backgroundColor: "transparent",
        duration: 0.3
      });
      gsap.to(cursor, {
        scale: 1,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        duration: 0.3
      });
    };

    const updateListeners = () => {
      const clickables = document.querySelectorAll("a, button, [role='button'], .cursor-pointer");
      clickables.forEach((el) => {
        el.removeEventListener("mouseenter", onMouseEnter);
        el.removeEventListener("mouseleave", onMouseLeave);
        el.addEventListener("mouseenter", onMouseEnter);
        el.addEventListener("mouseleave", onMouseLeave);
      });
    };

    updateListeners();

    // Re-bind listeners when content shifts (Framer Motion mounts/demounts)
    const observer = new MutationObserver(updateListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      observer.disconnect();
      const clickables = document.querySelectorAll("a, button, [role='button'], .cursor-pointer");
      clickables.forEach((el) => {
        el.removeEventListener("mouseenter", onMouseEnter);
        el.removeEventListener("mouseleave", onMouseLeave);
      });
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-2 h-2 bg-white/90 rounded-full pointer-events-none z-[300] hidden md:block mix-blend-difference"
      />
      <div
        ref={followerRef}
        className="fixed top-0 left-0 w-7 h-7 border border-white/15 rounded-full pointer-events-none z-[300] hidden md:block transition-colors duration-200"
      />
    </>
  );
}

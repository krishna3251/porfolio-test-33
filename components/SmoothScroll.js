"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SmoothScroll({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const query = window.matchMedia("(prefers-reduced-motion: no-preference) and (pointer: fine)");
    let dispose = () => {};
    const configure = () => {
      dispose();
      if (!query.matches || pathname.startsWith("/admin")) return;
      const lenis = new Lenis({
        lerp: 0.11,
        smoothWheel: true,
        wheelMultiplier: 0.95,
        anchors: { offset: -72 },
        stopInertiaOnNavigate: true,
      });
      const update = () => ScrollTrigger.update();
      const raf = time => lenis.raf(time * 1000);
      lenis.on("scroll", update);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
      dispose = () => {
        cancelAnimationFrame(frame);
        gsap.ticker.remove(raf);
        lenis.off("scroll", update);
        lenis.destroy();
      };
    };
    configure();
    query.addEventListener("change", configure);

    return () => {
      query.removeEventListener("change", configure);
      dispose();
    };
  }, [pathname]);

  return <>{children}</>;
}

"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TerminalBar from "@/components/TerminalBar";
import useSiteMedia from "@/hooks/useSiteMedia";

const steps = [
  {
    no: "01",
    label: "THE BRIEF",
    title: <>Find the<br /><em>point.</em></>,
    text: "Get clear on the audience, the problem and the feeling the finished work should leave behind.",
    note: "CLARITY BEFORE COMPLEXITY",
    motif: "brief",
  },
  {
    no: "02",
    label: "THE ASSEMBLY",
    title: <>Shape the<br /><em>story.</em></>,
    text: "Bring the strongest parts together. Build a rhythm. Remove anything that is clever but not useful.",
    note: "STRUCTURE / PACE / FLOW",
    motif: "shape",
  },
  {
    no: "03",
    label: "THE POLISH",
    title: <>Make it<br /><em>land.</em></>,
    text: "Refine the details: interaction, sound, color, typography and motion until everything works together.",
    note: "DETAILS WITH A PURPOSE",
    motif: "polish",
  },
  {
    no: "04",
    label: "THE FINISH",
    title: <>Ship it.<br /><em>Learn. Repeat.</em></>,
    text: "Test the real thing, make the final checks and deliver. Then use what you learned on the next cut.",
    note: "MAKE / TEST / IMPROVE",
    motif: "ship",
  },
];

export default function HowIBuild() {
  const { media } = useSiteMedia();
  const processBackground = media.slots?.processBackground || {};
  const sectionRef = useRef(null);
  const cardsRef = useRef(null);

  useLayoutEffect(() => {
    const root = sectionRef.current;
    const cards = cardsRef.current;
    if (!root || !cards) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touchDevice = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    if (reduceMotion) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".process-heading .process-display",
        { y: 32, opacity: 0, clipPath: "inset(0 0 22% 0)" },
        {
          y: 0,
          opacity: 1,
          clipPath: "inset(0 0 0% 0)",
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: { trigger: root, start: "top 78%", once: true },
        }
      );

      gsap.fromTo(
        ".process-card",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.72,
          stagger: 0.11,
          ease: "power3.out",
          scrollTrigger: { trigger: cards, start: "top 86%", once: true },
        }
      );

      // Keep parallax for precision-pointer devices only. On phones the native
      // horizontal rail stays lightweight and avoids stacking scroll observers.
      if (!touchDevice) {
        gsap.to(".process-card-art", {
          yPercent: -5,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        });
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="process section editorial-process" id="process">
      <div className="process-topography" aria-hidden="true" />
      {processBackground.src && processBackground.visible !== false && <div className="process-custom-background" aria-hidden="true"><img src={processBackground.src} alt="" style={{objectFit:processBackground.fit==="contain"?"contain":"cover",objectPosition:(processBackground.positionX??50)+"% "+(processBackground.positionY??50)+"%",transform:"scale("+Math.min(2.5,Math.max(.5,Number(processBackground.scale)||1))+")",opacity:processBackground.opacity??.12}} /><span style={{backgroundColor:processBackground.overlayColor||"#eeeadf",opacity:processBackground.overlayOpacity??.65}} /></div>}
      <TerminalBar command="run ./process --verbose" meta="PIPELINE / ACTIVE" />
      <div className="section-marker">
        <span>05</span><span>PROCESS</span><em>FROM ROUGH TO RIGHT</em>
      </div>

      <div className="process-intro">
        <div className="process-heading">
          <span className="eyebrow">PROCESS / FOUR STEPS</span>
          <h2 className="process-display">From rough<br /><em>to right.</em></h2>
        </div>
        <p className="process-intro-copy">
          Good work rarely arrives finished. It gets clearer through deliberate decisions,
          small refinements, and knowing what to leave out. No sticky-card gymnastics required.
        </p>
      </div>

      <div className="process-track-header">
        <span>THE WORKFLOW / 01—04</span>
        <span className="process-track-hint"><i aria-hidden="true">↔</i> SCROLL SIDEWAYS TO EXPLORE</span>
      </div>

      <div className="process-track-viewport" aria-label="Four steps in my creative process">
        <div ref={cardsRef} className="process-track">
          {steps.map((step) => (
            <article className="process-card" key={step.no}>
              <div className="process-card-top">
                <span className="process-card-index">{step.no} / 04</span>
                <span className="process-card-label">{step.label}</span>
                <span className="process-card-arrow" aria-hidden="true">↗</span>
              </div>

              <div className={`process-card-art process-art-${step.motif}`} aria-hidden="true">
                <span className="process-art-ring process-art-ring-one" />
                <span className="process-art-ring process-art-ring-two" />
                <span className="process-art-core" />
                <span className="process-art-cross">+</span>
              </div>

              <div className="process-card-bottom">
                <h3>{step.title}</h3>
                <p>{step.text}</p>
                <div className="process-card-note"><span />{step.note}</div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="process-footnote">
        <span>01 / ALIGN THE IDEA</span><span>02 / BUILD THE SHAPE</span><span>03 / REFINE THE FEEL</span><span>04 / SHIP WITH CARE</span>
      </div>
    </section>
  );
}

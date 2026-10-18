"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import useSiteMedia from "@/hooks/useSiteMedia";
import { mediaImageStyle } from "@/lib/media-image-style";

const services = [
  ["01", "AI systems", "LLM apps, automation and useful internal tools. Built to take the repetitive work off your hands.", "/projects", "serviceAI", "/images/bots/lexus.png", "INTELLIGENCE / AUTOMATION"],
  ["02", "Web experiences", "Fast interfaces, thoughtful interactions and motion that gives every detail a purpose.", "/projects", "serviceWeb", "/hero_krishna.jpg", "DEVELOPMENT / INTERACTION"],
  ["03", "Visual direction", "Gaming thumbnails, bold compositions and digital artwork with a clear point of view.", "/thumbnails", "serviceVisual", "/images/genshin%20cinematic.png", "COMPOSITION / ART DIRECTION"],
];

export default function ServicesSection() {
  const { media } = useSiteMedia();
  const reduce = useReducedMotion();
  return <section className="folio-services section" id="services" aria-labelledby="services-title">
    <div className="section-marker"><span>02</span><span>What I bring to the table</span></div>
    <div className="folio-services-heading">
      <h2 id="services-title">Different tools.<br /><em>Same obsession.</em></h2>
      <p>Software should feel clear. Visuals should feel intentional. The interesting work happens in the overlap.</p>
    </div>
    <div className="folio-services-list">
      {services.map(([no, title, text, href, slot, fallback, detail], index) => {
        const settings = media.slots?.[slot] || {};
        return <motion.div key={slot} initial={reduce ? false : { y: 24 }} whileInView={{ y: 0 }} viewport={{ once: true }} transition={{ duration: .7, delay: index * .08 }}>
          <Link href={href} className="folio-service" data-cursor="EXPLORE">
            <span className="folio-service-no">{no}</span>
            <div className="folio-service-visual" aria-hidden="true"><img src={settings.src || fallback} alt="" loading="lazy" style={mediaImageStyle(settings)} /></div>
            <div className="folio-service-copy"><span>{detail}</span><h3>{title}<b>.</b></h3><p>{text}</p></div>
            <span className="folio-service-arrow" aria-hidden="true">↗</span>
          </Link>
        </motion.div>;
      })}
    </div>
  </section>;
}

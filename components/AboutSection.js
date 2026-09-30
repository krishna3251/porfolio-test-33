"use client";

import { motion } from "framer-motion";

export default function AboutSection() {
  return (
    <div className="grid lg:grid-cols-12 gap-10 lg:gap-20">
      <div className="lg:col-span-4">
        <p className="mono-metadata text-primary mb-4">03 / About</p>
        <h2 className="serif-display text-5xl md:text-7xl leading-[.9]">Code with<br/><i>character.</i></h2>
      </div>
      <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="lg:col-span-8">
        <p className="text-xl md:text-2xl leading-relaxed text-foreground/90 max-w-3xl">
          I’m a BCA developer who enjoys building useful software and making things look good while doing it.
        </p>
        <div className="mt-8 grid md:grid-cols-2 gap-8 text-sm leading-relaxed text-muted">
          <p>My work spans Python systems, Discord bots, AI applications, APIs and web projects. I like taking an idea, breaking it into reliable pieces, and actually shipping the thing.</p>
          <p>Outside software, I create gaming thumbnails and digital artwork. That visual work has taught me a lot about composition, hierarchy, contrast and making a viewer notice the right thing first.</p>
        </div>
        <div className="mt-12 pt-5 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-5">
          <div><p className="mono-metadata text-muted">Base</p><p className="mt-2">India</p></div>
          <div><p className="mono-metadata text-muted">Focus</p><p className="mt-2">Python + AI</p></div>
          <div><p className="mono-metadata text-muted">Creative</p><p className="mt-2">Gaming visuals</p></div>
          <div><p className="mono-metadata text-muted">Status</p><p className="mt-2 text-primary">Building</p></div>
        </div>
      </motion.div>
    </div>
  );
}

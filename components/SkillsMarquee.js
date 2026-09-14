"use client";

import { motion, useReducedMotion } from "framer-motion";

const skillsRow1 = [
  "PYTHON",
  "JAVASCRIPT",
  "SQL",
  "AI APPLICATIONS",
  "DISCORD API",
  "AUTOMATION",
  "REST APIs",
  "GIT & GITHUB",
  "STREAMLIT",
  "CHATBOT ARCHITECTURE",
  "PROMPT ENGINEERING",
];

const skillsRow2 = [
  "MYSQL",
  "SQLITE",
  "LINUX",
  "C++",
  "JAVA",
  "C",
  "HTML5 & CSS3",
  "VS CODE",
  "AI/ML FUNDAMENTALS",
  "CONTROLNET WORKFLOWS",
  "BACKEND SYSTEMS",
];

const skillCategories = [
  {
    title: "LANGUAGES",
    skills: ["Python", "JavaScript", "SQL", "Java", "C++", "C", "HTML/CSS"],
  },
  {
    title: "DATABASES & STORAGE",
    skills: ["MySQL", "SQLite", "Relational Schema Design", "JSON Storage"],
  },
  {
    title: "APIS & AI SYSTEMS",
    skills: ["Discord API", "OpenAI API", "REST APIs", "Streamlit", "Prompt Engineering"],
  },
  {
    title: "ENVIRONMENT & CRAFT",
    skills: ["Linux", "Git & GitHub", "VS Code", "Automation Scripts", "Digital Art Pipelines"],
  },
];

export default function SkillsMarquee() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="w-full relative py-8">
      {/* Header */}
      <div className="mb-14">
        <div className="mono-metadata text-primary mb-3 tracking-[0.25em] font-bold flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-primary" />
          03 // CAPABILITIES & STACK
        </div>
        <h3 className="serif-display text-4xl md:text-5xl text-foreground font-semibold">
          Technical Stack & <span className="italic text-primary">Tooling.</span>
        </h3>
        <p className="font-sans text-muted text-sm md:text-base mt-4 max-w-xl leading-relaxed">
          Grounding real software development with proven languages, relational data management, and specialized automation interfaces.
        </p>
      </div>

      {/* Categorized Capabilities Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {skillCategories.map((cat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, duration: 0.6 }}
            className="bg-surface/50 border border-foreground/5 p-6 rounded-2xl relative overflow-hidden group hover:border-primary/20 transition-all duration-300"
          >
            <div className="absolute top-0 left-0 w-6 h-[1px] bg-primary/40" />
            <span className="mono-metadata text-[8px] text-primary font-bold tracking-widest block mb-4">
              {cat.title}
            </span>
            <ul className="space-y-2">
              {cat.skills.map((skill, sIdx) => (
                <li key={sIdx} className="font-sans text-xs md:text-sm text-foreground/80 flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                  {skill}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Infinite Looping Skills Marquee */}
      <div className="relative overflow-hidden py-4 border-y border-foreground/5 bg-background/40">
        {/* Soft edge fade masks */}
        <div className="absolute top-0 left-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        {/* Marquee Row 1 - Leftward */}
        <div className="flex gap-4 overflow-hidden mb-4 select-none">
          <div
            className={`flex items-center gap-4 shrink-0 ${
              shouldReduceMotion ? "" : "animate-marquee-left"
            }`}
          >
            {[...skillsRow1, ...skillsRow1, ...skillsRow1].map((skill, idx) => (
              <span
                key={idx}
                className="mono-metadata text-[9.5px] tracking-[0.25em] text-foreground/90 bg-surface/70 border border-foreground/5 hover:border-primary/30 px-5 py-2.5 rounded-full font-bold transition-all duration-300 hover:text-primary whitespace-nowrap flex items-center gap-3"
              >
                <span>{skill}</span>
                <span className="text-primary/40 font-mono">→</span>
              </span>
            ))}
          </div>
        </div>

        {/* Marquee Row 2 - Rightward */}
        <div className="flex gap-4 overflow-hidden select-none">
          <div
            className={`flex items-center gap-4 shrink-0 ${
              shouldReduceMotion ? "" : "animate-marquee-right"
            }`}
          >
            {[...skillsRow2, ...skillsRow2, ...skillsRow2].map((skill, idx) => (
              <span
                key={idx}
                className="mono-metadata text-[9.5px] tracking-[0.25em] text-muted hover:text-foreground bg-surface/40 border border-foreground/5 hover:border-primary/20 px-5 py-2.5 rounded-full font-bold transition-all duration-300 whitespace-nowrap flex items-center gap-3"
              >
                <span>{skill}</span>
                <span className="text-primary/40 font-mono">←</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

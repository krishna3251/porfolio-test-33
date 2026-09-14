"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

const projectsData = [
  {
    id: "lxeus",
    name: "Lxeus",
    tagline: "Elite Moderation & AI Chatbot System",
    version: "v.3.4.1",
    status: "Active",
    description:
      "An elite moderation and AI chatbot system. Lxeus learns server message patterns to preemptively manage toxicity while providing intelligent conversational utility, sentiment tracking, and server analysis.",
    tags: ["Auto-Mod", "AI Chat", "Analytics", "Python", "Discord API"],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDRp6fxUuc2NLoYdCjWJqZi_lUavsXI8JICV48j3ZtziAPVv-uHnis5KWWP7SsGSf6MFL8KdGA9ncc_tm7EwY62xKTqDLclkGeqCAnFY7epz99ntO1XP_PoQZ4ChZQnJSqiQnS1d7fsUcWjnb2xw8DBRgL7sORJxs6xhSJXGuEAxMdtF1GSvKPi4REiKwWR4-2V-dP023GOKEM1E7N45fDo89-fYX1sDBJU4o3cF8ZxqaaVaV6KQPzdFULYG0IzWyplYnDg_905bSlX",
    links: [{ label: "Repository", url: "https://github.com/krishna3251/lexus_dc.git" }],
    commands: [
      {
        trigger: "lxeus analyze --user @target",
        output: [
          "SYS_CORE :: Reading server sentiment profile...",
          "> User activity logs retrieved (360 nodes)",
          "> Sentiment map: 87% positive / 13% neutral",
          "> Toxicity threat level: Minimal",
          "ACTION :: Trust score updated. Profile logged.",
        ],
      },
      {
        trigger: "lxeus chat --ask 'what is antispam?'",
        output: [
          "SYS_AI :: Query received: 'what is antispam?'",
          "> Running LLM resolver...",
          "> Response: 'Antispam analyzes message repetition, patterns, and velocity.'",
          "> Flagging algorithm configured to 0.42 threshold.",
        ],
      },
    ],
  },
  {
    id: "rukia",
    name: "Rukia",
    tagline: "Universal Discord Server Architect & Fun Bot",
    version: "v.1.2.0",
    status: "Active",
    description:
      "Universal server architect and interaction system. Rukia deploys complete, pre-configured Discord ecosystems in seconds, orchestrating roles, permissions, channel hierarchies, and fun engagement utilities.",
    tags: ["Templating", "Role Sync", "Guild Builder", "Interaction", "Python"],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAYXOGJvQ44bCq4OfDD8Qn4lmjqe9xqFuA0_UAvZaXUQFjiLukRyeF6M-BK0iPOnsI9FzA5i7oQEcnWwRhkVfc8TdNvTEqrJRVkHTZI7lzROLIYZHUGHGXoVMrtRjnHDC3ggamV0AAGvQF6sylcTvHgXmYlDKx3WeHRZMNf0OoD5FKRUe4n2sSTSWjcS_FfSfJtkpe2MCVgS-TnQ9ki3EfJRdd6vwm43zPZ3ZccjRBsDxo94vr4IHwAAuFjXXcwnsZia7Zlga3ECBrR",
    links: [{ label: "Repository", url: "https://github.com/rukia3287-jpg/rukiya.git" }],
    commands: [
      {
        trigger: "rukia deploy --template 'Agency'",
        output: [
          "GUILD_CORE :: Compiling configuration mapping...",
          "> Initializing layout tree structure...",
          "> Creating channels: 28 text nodes, 14 voice nodes",
          "> Generating and syncing 15 modular roles...",
          "SUCCESS :: Guild deployment complete.",
        ],
      },
    ],
  },
  {
    id: "damu",
    name: "Damu",
    tagline: "Discord Guild Template Compiler",
    version: "v.2.0.4",
    status: "Active",
    description:
      "A high-performance guild template compiler. Damu reads structured JSON layouts to validate permission matrices, resolve role dependencies, and output fully compiled guild maps ready for bot ingestion.",
    tags: ["Compiler Core", "JSON Templates", "Automation", "Python"],
    image: "/neverness_showcase.png",
    links: [{ label: "Repository", url: "https://github.com/krishnverma32/damu-server-builder" }],
    commands: [
      {
        trigger: "damu compile --source ./template.json",
        output: [
          "COMPILER :: Loading remote configuration stream...",
          "> Validating structure against schema...",
          "> Resolving role dependency map...",
          "> Success: Ready for deployment nodes.",
        ],
      },
    ],
  },
  {
    id: "ai-chatbot",
    name: "AI Chatbot with Memory",
    tagline: "Context-Retentive Conversational Utility",
    version: "v.1.1.0",
    status: "Active",
    description:
      "Streamlit & Python-powered conversational assistant with persistent session memory. Retains multi-turn dialogue context, extracts user intent, and generates structured summarizations.",
    tags: ["OpenAI API", "Python", "Streamlit", "Conversation Memory"],
    image: "/hero_krishna.jpg",
    links: [{ label: "Architecture", url: "#" }],
    commands: [
      {
        trigger: "chat_engine.query('Summarize discussion history')",
        output: [
          "MEMORY_STORE :: Loading session vector graph...",
          "> 24 interaction turns parsed",
          "> Key entities extracted: [Architecture, APIs, Deployment]",
          "> Returning synthesized contextual digest.",
        ],
      },
    ],
  },
];

function TerminalOutput({ trigger, output }) {
  const [displayedLines, setDisplayedLines] = useState([]);
  const [currentLineIdx, setCurrentLineIdx] = useState(0);
  const [currentCharIdx, setCurrentCharIdx] = useState(0);

  useEffect(() => {
    setDisplayedLines([]);
    setCurrentLineIdx(0);
    setCurrentCharIdx(0);
  }, [trigger, output]);

  useEffect(() => {
    if (currentLineIdx >= output.length) return;

    const fullLine = output[currentLineIdx];
    const delay = 16;

    const timeout = setTimeout(() => {
      if (currentCharIdx < fullLine.length) {
        setDisplayedLines((prev) => {
          const updated = [...prev];
          if (!updated[currentLineIdx]) {
            updated[currentLineIdx] = "";
          }
          updated[currentLineIdx] = fullLine.slice(0, currentCharIdx + 1);
          return updated;
        });
        setCurrentCharIdx((prev) => prev + 1);
      } else {
        setCurrentLineIdx((prev) => prev + 1);
        setCurrentCharIdx(0);
      }
    }, delay);

    return () => clearTimeout(timeout);
  }, [output, currentLineIdx, currentCharIdx]);

  return (
    <div className="bg-[#0b080f]/90 p-4 md:p-5 rounded-2xl border border-foreground/5 font-mono text-[9px] relative overflow-hidden shadow-inner min-h-[120px] backdrop-blur-sm">
      <div className="absolute top-2 right-4 text-[7px] text-primary/30 tracking-widest uppercase">
        console // node_output
      </div>

      <div className="mono-metadata text-[9.5px] text-primary mb-3 flex items-center gap-1.5 font-bold">
        <span className="text-primary/60">$</span>
        <span>{trigger}</span>
      </div>

      <div className="space-y-1.5">
        {displayedLines.map((line, idx) => (
          <div key={idx} className="text-foreground/80 leading-relaxed">
            {line}
          </div>
        ))}
        {currentLineIdx < output.length && (
          <div className="flex items-center mt-1">
            <span className="w-1.5 h-3 bg-primary animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectCard({ project, index }) {
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-150, 150], [5, -5]);
  const rotateY = useTransform(x, [-150, 150], [-5, 5]);

  const [selectedCmdIndex, setSelectedCmdIndex] = useState(0);
  const activeCmd = project.commands[selectedCmdIndex];

  const handleMouseMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - rect.width / 2;
    const mouseY = e.clientY - rect.top - rect.height / 2;
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-10 py-16 border-b border-foreground/5 relative items-center"
    >
      {/* Visual Image Preview with 3D Tilt */}
      <div className="lg:col-span-5 flex flex-col justify-center">
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="relative aspect-[4/3] overflow-hidden rounded-[2rem] paper-sheet group border border-foreground/5 shadow-xl hover:border-primary/30 transition-all duration-500"
        >
          <img
            src={project.image}
            alt={project.name}
            className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a080e]/70 via-transparent to-transparent pointer-events-none" />
          <div className="absolute inset-0 border-[1rem] border-surface pointer-events-none group-hover:border-[0.6rem] transition-all duration-500 rounded-[30px]" />

          <div className="absolute bottom-5 left-5 z-10">
            <span className="mono-metadata text-[7px] text-white/90 bg-primary/15 border border-primary/30 px-3 py-1 rounded-full backdrop-blur-md font-bold tracking-widest">
              CORE_ACTIVE // SYS
            </span>
          </div>
        </motion.div>
      </div>

      {/* Project Details & Terminal Console */}
      <div className="lg:col-span-7 flex flex-col justify-center relative z-10">
        <div className="flex justify-between items-baseline mb-4 border-b border-foreground/5 pb-3">
          <div className="flex items-center gap-3">
            <h4 className="serif-display text-4xl md:text-5xl text-foreground font-semibold">
              {project.name}
            </h4>
            <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
          </div>
          <span className="mono-metadata text-primary text-[8px] font-bold tracking-[0.2em] bg-primary/5 border border-primary/20 px-3 py-1 rounded-full">
            {project.version}
          </span>
        </div>

        <p className="font-sans text-sm md:text-base text-muted mb-6 leading-relaxed">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="mono-metadata text-[7.5px] text-foreground bg-surface border border-foreground/5 px-3 py-1.5 rounded-full tracking-widest font-bold"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex gap-6 mb-6">
          {project.links.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mono-metadata text-[8.5px] text-foreground font-bold tracking-[0.25em] border-b border-foreground/20 pb-1 hover:border-primary hover:text-primary transition-all duration-300 flex items-center gap-1.5"
            >
              {link.label}
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          ))}
        </div>

        {/* Selectable Interactive Terminal */}
        <div className="flex flex-col gap-3 pt-4 border-t border-foreground/5">
          <div className="flex gap-2">
            {project.commands.map((cmd, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedCmdIndex(idx)}
                className={`mono-metadata text-[7.5px] tracking-widest px-3 py-1.5 rounded-lg transition-all duration-300 font-bold cursor-pointer ${
                  selectedCmdIndex === idx
                    ? "bg-primary text-background border border-primary/30 shadow-sm"
                    : "text-muted hover:text-foreground border border-foreground/5"
                }`}
              >
                Terminal 0{idx + 1}
              </button>
            ))}
          </div>

          <TerminalOutput trigger={activeCmd.trigger} output={activeCmd.output} />
        </div>
      </div>
    </motion.article>
  );
}

export default function ProjectsSection() {
  return (
    <div className="w-full relative py-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-8 border-b border-foreground/5">
        <div>
          <div className="mono-metadata text-primary mb-3 tracking-[0.25em] font-bold flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-primary" />
            05 // SYSTEMS & AUTOMATION
          </div>
          <h3 className="serif-display text-4xl md:text-5xl text-foreground font-semibold">
            Featured <span className="italic text-primary">Projects.</span>
          </h3>
          <p className="font-sans text-muted text-sm md:text-base mt-4 max-w-xl leading-relaxed">
            Real software systems, automated server architectures, and AI-powered conversational tooling from Krishna&apos;s active portfolio.
          </p>
        </div>

        <div className="text-right">
          <span className="mono-metadata text-muted text-[8px] block mb-1">AUTOMATA ENGINE</span>
          <span className="font-mono text-sm font-bold text-primary">ALL NODES ONLINE</span>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {projectsData.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </div>
  );
}

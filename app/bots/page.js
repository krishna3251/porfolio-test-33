"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

const botsData = [
  {
    id: "lxeus",
    name: "Lxeus",
    tagline: "Elite Moderation & AI Chatbot System",
    version: "v.3.4.1",
    status: "Active",
    description: "An elite moderation and AI chatbot system. Lxeus learns server patterns to preemptively manage toxicity while providing intelligent conversational utility and server analysis.",
    tags: ["Auto-Mod", "AI Chat", "Analytics"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDRp6fxUuc2NLoYdCjWJqZi_lUavsXI8JICV48j3ZtziAPVv-uHnis5KWWP7SsGSf6MFL8KdGA9ncc_tm7EwY62xKTqDLclkGeqCAnFY7epz99ntO1XP_PoQZ4ChZQnJSqiQnS1d7fsUcWjnb2xw8DBRgL7sORJxs6xhSJXGuEAxMdtF1GSvKPi4REiKwWR4-2V-dP023GOKEM1E7N45fDo89-fYX1sDBJU4o3cF8ZxqaaVaV6KQPzdFULYG0IzWyplYnDg_905bSlX",
    color: "primary",
    links: [{ label: "Repository", url: "https://github.com/krishna3251/lexus_dc.git" }],
    commands: [
      {
        trigger: "lxeus analyze --user @target",
        output: [
          "SYS_CORE :: Reading server sentiment profile...",
          "> User activity logs retrieved (360 nodes)",
          "> Sentiment map: 87% positive / 13% neutral",
          "> Toxicity threat level: Minimal",
          "ACTION :: Trust score updated. Profile logged."
        ]
      },
      {
        trigger: "lxeus chat --ask 'what is antispam?'",
        output: [
          "SYS_AI :: Query received: 'what is antispam?'",
          "> Running LLM resolver...",
          "> Response: 'Antispam analyzes message repetition, patterns, and velocity.'",
          "> Flagging algorithm configured to 0.42 threshold."
        ]
      }
    ]
  },
  {
    id: "rukia",
    name: "Rukia",
    tagline: "Universal Discord Server Architect",
    version: "v.1.2.0",
    status: "Active",
    description: "The universal server builder. Rukia deploys complete, pre-configured Discord ecosystems in seconds, handling roles, permissions, and channel hierarchies instantly.",
    tags: ["Templating", "Role Sync", "Guild Builder"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAYXOGJvQ44bCq4OfDD8Qn4lmjqe9xqFuA0_UAvZaXUQFjiLukRyeF6M-BK0iPOnsI9FzA5i7oQEcnWwRhkVfc8TdNvTEqrJRVkHTZI7lzROLIYZHUGHGXoVMrtRjnHDC3ggamV0AAGvQF6sylcTvHgXmYlDKx3WeHRZMNf0OoD5FKRUe4n2sSTSWjcS_FfSfJtkpe2MCVgS-TnQ9ki3EfJRdd6vwm43zPZ3ZccjRBsDxo94vr4IHwAAuFjXXcwnsZia7Zlga3ECBrR",
    color: "primary",
    links: [{ label: "Repository", url: "https://github.com/rukia3287-jpg/rukiya.git" }],
    commands: [
      {
        trigger: "rukia deploy --template 'Agency'",
        output: [
          "GUILD_CORE :: Compiling configuration mapping...",
          "> Initializing layout tree structure...",
          "> Creating channels: 28 text nodes, 14 voice nodes",
          "> Generating and syncing 15 modular roles...",
          "SUCCESS :: Guild deployment complete."
        ]
      }
    ]
  },
  {
    id: "damu",
    name: "Damu",
    tagline: "Discord Guild Template Compiler",
    version: "v.2.0.4",
    status: "Active",
    description: "A high-performance guild template compiler. Damu reads structured JSON layouts to output fully compiled permission maps and channel configurations.",
    tags: ["Compiler Core", "JSON Templates"],
    image: "/neverness_showcase.png",
    color: "primary",
    links: [{ label: "Repository", url: "https://github.com/krishnverma32/damu-server-builder" }],
    commands: [
      {
        trigger: "damu compile --source ./template.json",
        output: [
          "COMPILER :: Loading remote configuration stream...",
          "> Validating structure against schema...",
          "> Resolving role dependency map...",
          "> Success: Ready for deployment nodes."
        ]
      }
    ]
  }
];

function TerminalOutput({ trigger, output }) {
  const [displayedLines, setDisplayedLines] = useState([]);
  const [currentLineIdx, setCurrentLineIdx] = useState(0);
  const [currentCharIdx, setCurrentCharIdx] = useState(0);

  // Reset typewriter when command updates
  useEffect(() => {
    setDisplayedLines([]);
    setCurrentLineIdx(0);
    setCurrentCharIdx(0);
  }, [trigger, output]);

  useEffect(() => {
    if (currentLineIdx >= output.length) return;

    const fullLine = output[currentLineIdx];
    const delay = 18; // Cinematic cyber type delay
    
    const timeout = setTimeout(() => {
      if (currentCharIdx < fullLine.length) {
        setDisplayedLines(prev => {
          const updated = [...prev];
          if (!updated[currentLineIdx]) {
            updated[currentLineIdx] = "";
          }
          updated[currentLineIdx] = fullLine.slice(0, currentCharIdx + 1);
          return updated;
        });
        setCurrentCharIdx(prev => prev + 1);
      } else {
        setCurrentLineIdx(prev => prev + 1);
        setCurrentCharIdx(0);
      }
    }, delay);

    return () => clearTimeout(timeout);
  }, [output, currentLineIdx, currentCharIdx]);

  return (
    <div className="bg-[#0b080f]/80 p-5 rounded-2xl border border-foreground/5 font-mono text-[9px] relative overflow-hidden shadow-inner min-h-[120px] backdrop-blur-sm">
      {/* Cyber overlay */}
      <div className="absolute inset-0 bg-grid-cyber opacity-[0.02] pointer-events-none" />
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

function BotLog({ bot }) {
  const [selectedCmdIndex, setSelectedCmdIndex] = useState(0);
  const activeCmd = bot.commands[selectedCmdIndex];

  return (
    <div className="flex flex-col gap-6 mt-8 pt-8 border-t border-foreground/5">
      <div className="flex gap-3 overflow-x-auto hide-scrollbar">
        {bot.commands.map((cmd, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedCmdIndex(idx)}
            className={`mono-metadata text-[8px] tracking-[0.18em] px-4 py-2 rounded-xl transition-all duration-300 font-bold cursor-pointer select-none ${
              selectedCmdIndex === idx 
                ? "bg-primary text-background border border-primary/20 shadow-[0_0_15px_rgba(215,186,255,0.25)]" 
                : "text-muted hover:text-foreground border border-foreground/5 hover:bg-foreground/5"
            }`}
          >
            Terminal 0{idx + 1}
          </button>
        ))}
      </div>
      
      <TerminalOutput trigger={activeCmd.trigger} output={activeCmd.output} />
    </div>
  );
}

function BotEntry({ bot, index }) {
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-150, 150], [6, -6]);
  const rotateY = useTransform(x, [-150, 150], [-6, 6]);

  const handleMouseMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay: index * 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-12 py-24 border-b border-foreground/5 relative items-center"
    >
      {/* Background glow matching active theme */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] bg-primary/5 rounded-full blur-[100px] pointer-events-none music-bloom-glow" />

      {/* Bot Card Left aspect */}
      <div className="lg:col-span-5 flex flex-col justify-center">
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="relative aspect-[4/3] overflow-hidden rounded-[2.5rem] paper-sheet group border border-foreground/5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:border-primary/20 transition-all duration-500"
        >
          <img 
            src={bot.image} 
            alt={bot.name} 
            className="w-full h-full object-cover grayscale-[0.25] group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a090d]/60 via-transparent to-transparent pointer-events-none" />
          <div className="absolute inset-0 border-[1.2rem] border-surface pointer-events-none group-hover:border-[0.8rem] transition-all duration-500 rounded-[38px]" />
          
          <div className="absolute bottom-6 left-6 z-10">
            <span className="mono-metadata text-[7px] text-white/90 bg-primary/10 border border-primary/25 px-3 py-1 rounded-full backdrop-blur-md font-bold tracking-widest">
              CORE_ACTIVE // SYS
            </span>
          </div>
        </motion.div>
      </div>

      {/* Details Right aspect */}
      <div className="lg:col-span-7 flex flex-col justify-center relative z-10">
        <div className="flex justify-between items-baseline mb-6 border-b border-foreground/5 pb-4">
          <div className="flex items-center gap-4">
            <h2 className="serif-display text-5xl md:text-6xl text-foreground font-semibold">{bot.name}</h2>
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
          </div>
          <span className="mono-metadata text-primary text-[8px] font-bold tracking-[0.2em] bg-primary/5 border border-primary/15 px-3 py-1 rounded-full">{bot.version}</span>
        </div>
        
        <p className="font-sans text-sm md:text-base text-muted mb-8 leading-relaxed max-w-xl">
          {bot.description}
        </p>

        <div className="flex flex-wrap gap-2.5 mb-10">
          {bot.tags.map(tag => (
            <span key={tag} className="mono-metadata text-[8px] text-foreground bg-[#14101a] border border-foreground/5 px-3.5 py-1.5 rounded-full tracking-widest font-bold">{tag}</span>
          ))}
        </div>
        
        <div className="flex gap-8 mb-6 pl-2">
          {bot.links.map(link => (
            <a 
              key={link.label} 
              href={link.url} 
              target="_blank" 
              className="mono-metadata text-[9px] text-foreground font-bold tracking-[0.25em] border-b border-foreground/20 pb-1 hover:border-primary hover:text-primary transition-all duration-300 flex items-center gap-1.5"
            >
              {link.label}
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          ))}
        </div>

        <BotLog bot={bot} />
      </div>
    </motion.div>
  );
}

export default function Bots() {
  return (
    <main className="flex-grow pt-40 pb-32 px-6 md:px-12 lg:px-16 max-w-7xl mx-auto w-full relative">
      <header className="mb-24 flex flex-col md:flex-row justify-between items-baseline gap-12 border-b border-foreground/5 pb-16">
        <div className="max-w-2xl">
          <div className="mono-metadata text-primary mb-6 tracking-[0.25em] font-bold">Automation // Systems</div>
          <h1 className="serif-display text-7xl md:text-8xl mb-8 text-foreground leading-none">
            Neural <span className="italic">Automata.</span>
          </h1>
          <p className="font-sans text-lg text-muted max-w-lg leading-relaxed">
            Advanced digital constructs. Explore a suite of intelligent Discord automation designed with premium aesthetics and robust architecture.
          </p>
        </div>
        <div className="text-right flex flex-col items-end gap-2">
          <span className="mono-metadata text-muted tracking-[0.2em]">Status</span>
          <span className="serif-display text-4xl block text-primary italic font-bold">All Systems Active</span>
        </div>
      </header>

      <div className="flex flex-col gap-6">
        {botsData.map((bot, index) => (
          <BotEntry key={bot.id} bot={bot} index={index} />
        ))}
      </div>
    </main>
  );
}

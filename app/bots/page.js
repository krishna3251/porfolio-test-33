"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";

const botsData = [
  {
    id: "lxeus",
    name: "Lxeus",
    tagline: "Elite Moderation & AI Chatbot System",
    version: "v.3.4.1",
    status: "Active",
    icon: "shield_person",
    description: "An elite moderation and AI chatbot system. Lxeus learns server patterns to preemptively manage toxicity while providing intelligent conversational utility and server analysis.",
    tags: ["Auto-Mod", "AI Chat", "Analytics", "Sentiment Analysis"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDRp6fxUuc2NLoYdCjWJqZi_lUavsXI8JICV48j3ZtziAPVv-uHnis5KWWP7SsGSf6MFL8KdGA9ncc_tm7EwY62xKTqDLclkGeqCAnFY7epz99ntO1XP_PoQZ4ChZQnJSqiQnS1d7fsUcWjnb2xw8DBRgL7sORJxs6xhSJXGuEAxMdtF1GSvKPi4REiKwWR4-2V-dP023GOKEM1E7N45fDo89-fYX1sDBJU4o3cF8ZxqaaVaV6KQPzdFULYG0IzWyplYnDg_905bSlX",
    color: "primary",
    links: [
      { label: "Lexus Bot Link", url: "https://github.com/krishna3251/lexus_dc.git" }
    ],
    stats: [
      { label: "Guard", value: "87%" },
      { label: "Latency", value: "24ms" },
      { label: "Mode", value: "AI Mod" }
    ],
    commands: [
      {
        trigger: "lxeus analyze --user @target",
        output: [
          "> Initializing user profile analysis...",
          "> User sentiment: 87% positive (Constructive contributor)",
          "> Threat level: Minimal (0.02% risk threshold)",
          "> Action: Trust score updated to Tier 1"
        ]
      },
      {
        trigger: "lxeus config --status",
        output: [
          "> Auto-mod: Active (High sensitivity)",
          "> Channels monitored: 18 / 18",
          "> Active API pipelines: Stable",
          "> Neural node latency: 24ms"
        ]
      },
      {
        trigger: "lxeus chat --ask 'what is antispam?'",
        output: [
          "> Resolving query with Lxeus LLM...",
          "> Response: 'Antispam analyzes message repetition and burst frequency to flag automated spambots.'"
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
    icon: "architecture",
    description: "The universal server builder. Rukia deploys complete, pre-configured Discord ecosystems in seconds, handling roles, permissions, category headers, and channel hierarchies instantly.",
    tags: ["Templating", "Role Sync", "Guild Builder", "Ecosystem Sync"],
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAYXOGJvQ44bCq4OfDD8Qn4lmjqe9xqFuA0_UAvZaXUQFjiLukRyeF6M-BK0iPOnsI9FzA5i7oQEcnWwRhkVfc8TdNvTEqrJRVkHTZI7lzROLIYZHUGHGXoVMrtRjnHDC3ggamV0AAGvQF6sylcTvHgXmYlDKx3WeHRZMNf0OoD5FKRUe4n2sSTSWjcS_FfSfJtkpe2MCVgS-TnQ9ki3EfJRdd6vwm43zPZ3ZccjRBsDxo94vr4IHwAAuFjXXcwnsZia7Zlga3ECBrR",
    color: "secondary",
    links: [
      { label: "Rukiya Bot Link", url: "https://github.com/rukia3287-jpg/rukiya.git" }
    ],
    stats: [
      { label: "Deploy", value: "42ch" },
      { label: "Roles", value: "15" },
      { label: "Mode", value: "Builder" }
    ],
    commands: [
      {
        trigger: "rukia deploy --template 'Creative Agency'",
        output: [
          "> Initializing layout parser...",
          "> Creating categories: [INFORMATION], [COMMUNITY], [WORKSPACES], [VOICE]",
          "> Creating channels: 28 text channels, 14 voice channels",
          "> Syncing 15 roles with advanced hierarchy permission trees...",
          "> Deployment complete. Invite code synced."
        ]
      },
      {
        trigger: "rukia sync --permissions",
        output: [
          "> Loading channel configurations...",
          "> Auditing voice channel overrides...",
          "> Synced permissions for 42 channels with category headers.",
          "> Zero sync mismatches found."
        ]
      },
      {
        trigger: "rukia backup --create",
        output: [
          "> Indexing active channels & roles...",
          "> Compressing layout metadata...",
          "> Backup created successfully. Key: RUKIA-BKP-7X21"
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
    icon: "construction",
    description: "A high-performance guild template compiler. Damu reads structured JSON layouts to output fully compiled permission maps, channel configurations, and guild sync details.",
    tags: ["Compiler Core", "Guild Architecture", "JSON Templates", "API Deploy"],
    image: "/neverness_showcase.png",
    color: "cyan",
    links: [
      { label: "Server Builder", url: "https://github.com/krishnverma32/damu-server-builder" }
    ],
    stats: [
      { label: "Compile", value: "JSON" },
      { label: "Audit", value: "100%" },
      { label: "Mode", value: "Core" }
    ],
    commands: [
      {
        trigger: "damu compile --source ./template.json",
        output: [
          "> Reading local template.json...",
          "> Compiling guild configurations...",
          "> Parsed 12 channels, 5 role groups, 3 permission categories",
          "> Compilation successful: Ready for deployment"
        ]
      },
      {
        trigger: "damu permission --audit",
        output: [
          "> Loading channel role mappings...",
          "> Audit: 0 permission leaks, 100% security sync verified"
        ]
      },
      {
        trigger: "damu variables --list",
        output: [
          "> Loading global variables...",
          "> { server_name: 'Damu Guild', prefix: 'd!', log_channel: '#audit-log' }"
        ]
      }
    ]
  }
];

function BotTerminal({ bot }) {
  const [selectedCmdIndex, setSelectedCmdIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [showOutput, setShowOutput] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const activeCmd = bot.commands[selectedCmdIndex];
  const activeTrigger = activeCmd.trigger;

  useEffect(() => {
    let interval;
    let revealTimeout;
    let currentLength = 0;

    const startTyping = setTimeout(() => {
      setShowOutput(false);
      setIsTyping(true);
      setCurrentText("");

      interval = setInterval(() => {
        if (currentLength < activeTrigger.length) {
          setCurrentText(activeTrigger.substring(0, currentLength + 1));
          currentLength++;
        } else {
          clearInterval(interval);
          setIsTyping(false);
          revealTimeout = setTimeout(() => {
            setShowOutput(true);
          }, 300);
        }
      }, 40);
    }, 0);

    return () => {
      clearTimeout(startTyping);
      clearTimeout(revealTimeout);
      clearInterval(interval);
    };
  }, [activeTrigger]);

  const getBotColorClass = () => {
    if (bot.id === "lxeus") return "text-primary/95";
    if (bot.id === "rukia") return "text-secondary/95";
    return "text-cyan-400/95";
  };

  const getCmdBtnClass = (idx) => {
    const isActive = selectedCmdIndex === idx;
    if (!isActive) return "bg-white/5 text-white/50 hover:text-white/80 hover:bg-white/10";
    if (bot.id === "lxeus") return "bg-primary/15 text-primary border border-primary/20 shadow-[0_0_10px_rgba(215,186,255,0.1)]";
    if (bot.id === "rukia") return "bg-secondary/15 text-secondary border border-secondary/20 shadow-[0_0_10px_rgba(247,177,227,0.1)]";
    return "bg-cyan-400/15 text-cyan-400 border border-cyan-400/20 shadow-[0_0_10px_rgba(34,211,238,0.1)]";
  };

  return (
    <div className="glass-panel rounded-2xl p-5 font-mono text-xs bg-[#100d13]/70 border border-white/5 shadow-inner flex flex-col justify-between h-[280px] transition-colors duration-500">
      
      {/* Terminal Titlebar */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-white/10 block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-white/10 block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-white/10 block"></span>
          </div>
          <span className="text-[9px] text-white/30 tracking-widest uppercase">
            Console Preview
          </span>
        </div>

        {/* Command Selection Buttons */}
        <div className="flex flex-wrap gap-2 mb-4 border-b border-white/5 pb-2.5">
          {bot.commands.map((cmd, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCmdIndex(idx)}
              className={`px-2.5 py-1 text-[10px] rounded-md transition-all duration-300 cursor-pointer ${getCmdBtnClass(idx)}`}
            >
              Cmd {idx + 1}
            </button>
          ))}
        </div>

        {/* Terminal Input Row */}
        <div className="text-on-surface-variant/90 text-[12px] leading-relaxed flex items-center">
          <span className={getBotColorClass()}>
            {bot.id} ~&nbsp;
          </span>
          <span className={isTyping ? "typing-effect" : ""}>{currentText}</span>
        </div>

        {/* Terminal Output Rows */}
        <div className="mt-2.5 text-on-surface-variant/50 text-[12px] pl-2.5 border-l border-white/10 leading-relaxed font-light h-[110px] overflow-y-auto hide-scrollbar">
          <AnimatePresence>
            {showOutput && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {activeCmd.output.map((line, lIdx) => (
                  <div key={lIdx} className="mb-1 text-white/70">
                    {line}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

    </div>
  );
}

// --- PREMIUM TILT BOT CARD COMPONENT ---
function BotCard({ bot, index }) {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [localMouse, setLocalMouse] = useState({ x: null, y: null });
  const [copiedLink, setCopiedLink] = useState("");

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // 3D rotations based on mouse coordinate tracking (Stronger 3D tilt)
  const rotateX = useTransform(y, [-150, 150], [12, -12]);
  const rotateY = useTransform(x, [-150, 150], [-12, 12]);

  // Magnetic shifts pulls card slightly towards cursor
  const translateX = useTransform(x, [-150, 150], [-8, 8]);
  const translateY = useTransform(y, [-150, 150], [-8, 8]);

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

    setLocalMouse({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
    setLocalMouse({ x: null, y: null });
  };

  const copyLink = (link) => {
    if (typeof navigator === "undefined") return;
    setCopiedLink(link.url);
    navigator.clipboard?.writeText(link.url).catch(() => {});
    setTimeout(() => setCopiedLink(""), 1600);
  };

  // Color theme mappings
  let themeColorClass = "text-primary";
  let badgeColorClass = "bg-primary/20 text-primary border border-primary/30";
  let btnBorderColorClass = "border-primary/20 text-primary hover:bg-primary/10 hover:border-primary/50 shadow-[0_0_15px_rgba(215,186,255,0.02)]";
  let spotlightColor = "rgba(var(--primary-color-rgb), 0.12)";

  if (bot.id === "rukia") {
    themeColorClass = "text-secondary";
    badgeColorClass = "bg-secondary/20 text-secondary border border-secondary/30";
    btnBorderColorClass = "border-secondary/20 text-secondary hover:bg-secondary/10 hover:border-secondary/50 shadow-[0_0_15px_rgba(247,177,227,0.02)]";
    spotlightColor = "rgba(var(--secondary-color-rgb), 0.12)";
  } else if (bot.id === "damu") {
    themeColorClass = "text-cyan-400";
    badgeColorClass = "bg-cyan-400/20 text-cyan-400 border border-cyan-400/30";
    btnBorderColorClass = "border-cyan-400/20 text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400/50 shadow-[0_0_15px_rgba(34,211,238,0.02)]";
    spotlightColor = "rgba(34, 211, 238, 0.12)";
  }

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 55, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
      style={{ 
        rotateX, 
        rotateY, 
        x: translateX, 
        y: translateY, 
        transformStyle: "preserve-3d" 
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`glass-lens rounded-[28px] overflow-hidden group flex flex-col border border-white/5 relative perspective-2000 select-none transition-all duration-500 hover:-translate-y-2 hover:border-white/15 shadow-2xl hover:shadow-[0_35px_80px_-18px_rgba(0,0,0,0.95)] ${
        index === 1 ? "lg:mt-8" : index === 2 ? "lg:mt-16" : ""
      }`}
    >
      <div className="pointer-events-none absolute inset-0 z-30 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className={`absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent ${
          bot.id === "lxeus" ? "via-primary" : bot.id === "rukia" ? "via-secondary" : "via-cyan-400"
        } to-transparent`} />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.05)_42%,transparent_45%)] translate-x-[-120%] transition-transform duration-1000 group-hover:translate-x-[120%]" />
      </div>

      {/* Header banner area */}
      <div 
        className="relative h-56 w-full bg-surface-container-highest/20 overflow-hidden border-b border-white/5"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${
          bot.id === "lxeus" ? "from-primary/25" : bot.id === "rukia" ? "from-secondary/25" : "from-cyan-400/25"
        } via-black/10 to-black/80 z-10`}></div>
        <div className="absolute inset-0 z-10 bg-grid-cyber opacity-25 mix-blend-screen"></div>
        
        <img
          alt={`${bot.name} Artwork`}
          className="w-full h-full object-cover opacity-55 group-hover:opacity-85 group-hover:scale-110 transition-all duration-[3s] mix-blend-luminosity group-hover:mix-blend-normal"
          src={bot.image}
          style={{ transform: "translateZ(-15px) scale(1.15)", transformStyle: "preserve-3d" }}
        />

        <div className="absolute bottom-5 left-6 right-6 z-20 grid grid-cols-3 gap-2" style={{ transform: "translateZ(45px)" }}>
          {bot.stats.map((stat) => (
            <div
              key={`${bot.id}-${stat.label}`}
              className="rounded-xl border border-white/10 bg-black/35 px-3 py-2 backdrop-blur-md"
            >
              <div className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/35">{stat.label}</div>
              <div className={`mt-1 font-ui text-[11px] uppercase tracking-[0.12em] ${themeColorClass}`}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Bot Meta Title overlay */}
        <div 
          className="absolute top-6 left-6 z-20 flex items-center gap-4"
          style={{ transform: "translateZ(50px)" }}
        >
          <div className="w-12 h-12 rounded-full glass-panel flex items-center justify-center border border-white/10 backdrop-blur-md shadow-lg">
            <span className={`text-2xl ${themeColorClass}`}>
              {bot.id === "lxeus" ? (
                <svg className="w-5.5 h-5.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
                </svg>
              ) : bot.id === "rukia" ? (
                <svg className="w-5.5 h-5.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3zm0 7.25c-.97 0-1.75-.78-1.75-1.75S11.03 6.75 12 6.75s1.75.78 1.75 1.75S12.97 10.25 12 10.25z"/>
                </svg>
              ) : (
                <svg className="w-5.5 h-5.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.3C.5 6.7.9 9.8 2.9 11.8c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.4-2.4c.4-.4.4-1 0-1.4z"/>
                </svg>
              )}
            </span>
          </div>
          <div className="flex flex-col">
            <h2 className="font-ui text-xl tracking-wider text-white font-bold uppercase drop-shadow-md flex items-center gap-2">
              {bot.name}
              <span className={`text-[8px] uppercase tracking-[0.1em] px-1.5 py-0.5 rounded ${badgeColorClass}`}>
                Bot
              </span>
            </h2>
            <span className="font-mono text-[9px] text-white/50 tracking-widest mt-0.5">
              {bot.version}{" // "}
              <span className="text-[#10B981] font-semibold">{bot.status}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Description & tags area */}
      <div 
        className="p-6 flex-grow flex flex-col justify-between bg-surface/30 backdrop-blur-xl relative"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Spotlight overlay tracking the cursor */}
        {isHovered && localMouse.x !== null && (
          <div
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              background: `radial-gradient(circle 220px at ${localMouse.x}px ${localMouse.y}px, ${spotlightColor} 0%, transparent 80%)`,
            }}
          />
        )}

        <div className="mb-5 relative z-10" style={{ transform: "translateZ(25px)" }}>
          <p className="font-sans text-[13px] text-on-surface-variant/80 mb-5 leading-relaxed font-light">
            {bot.description}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {bot.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 text-[8px] font-mono tracking-widest uppercase border border-white/5 rounded-full text-on-surface-variant/70 bg-white/[0.02]"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* GitHub CTA Repository Links */}
          {bot.links && (
            <div 
              className="flex flex-col gap-2 mt-5 border-t border-white/5 pt-4"
              style={{ transform: "translateZ(45px)", transformStyle: "preserve-3d" }}
            >
              {bot.links.map((link, lIdx) => (
                <div
                  key={lIdx}
                  className={`rounded-2xl border bg-black/15 p-2.5 transition-all duration-300 ${btnBorderColorClass}`}
                  style={{ transform: "translateZ(10px)" }}
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="font-mono text-[8px] uppercase tracking-widest">{link.label}</span>
                    <span className="font-mono text-[8px] uppercase tracking-widest text-white/35">Repo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-w-0 flex-1 items-center gap-2 rounded-xl bg-white/[0.035] px-3 py-2 font-mono text-[8px] uppercase tracking-widest text-white/60 transition hover:text-white"
                    >
                      <svg className="h-3.5 w-3.5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                      </svg>
                      <span className="truncate">{link.url.replace("https://github.com/", "")}</span>
                    </a>
                    <button
                      onClick={() => copyLink(link)}
                      className="rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2 font-ui text-[8px] uppercase tracking-[0.18em] text-white/55 transition hover:border-white/20 hover:text-white"
                    >
                      {copiedLink === link.url ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Interactive terminal panel */}
        <div className="relative z-10" style={{ transform: "translateZ(35px)" }}>
          <BotTerminal bot={bot} />
        </div>
      </div>
    </motion.article>
  );
}

export default function Bots() {
  return (
    <main className="flex-grow pt-32 pb-24 px-6 md:px-12 lg:px-16 max-w-7xl mx-auto w-full relative z-10">
      
      {/* Page Header */}
      <header className="mb-24 text-center md:text-left relative">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10 animate-pulse"></div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-display text-6xl md:text-8xl mb-6 text-on-surface/90 font-medium tracking-tight"
        >
          Neural<br />
          <span className="text-primary italic font-light">Automata</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="font-sans text-sm md:text-base text-on-surface-variant/80 max-w-xl font-light leading-relaxed pl-1 border-l-2 border-primary/30"
        >
          Advanced digital constructs. Explore a suite of intelligent Discord automation designed with premium aesthetics and robust architecture.
        </motion.p>
      </header>

      {/* Bots Grid Showcase (Upgraded grid configuration for 3 cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        {botsData.map((bot, index) => (
          <BotCard key={bot.id} bot={bot} index={index} />
        ))}
      </div>

      {/* Footer */}
      <footer className="mt-40 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-on-surface-variant/40">
        <div className="font-ui text-[10px] font-medium uppercase tracking-[0.2em]">
          © 2026 KRISHNA. DESIGNING DIGITAL EXPERIENCE.
        </div>
        <div className="flex gap-8 font-ui text-[10px] uppercase tracking-[0.2em]">
          <a href="#" className="hover:text-on-surface transition-colors duration-300">Instagram</a>
          <a href="#" className="hover:text-on-surface transition-colors duration-300">Twitter</a>
          <a href="#" className="hover:text-on-surface transition-colors duration-300">Discord</a>
        </div>
      </footer>

    </main>
  );
}

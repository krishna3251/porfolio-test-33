"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_LOGS = [
  "SYS_CORE :: COMPILING NEURAL NODES...",
  "RESOLVING ASSETS :: public/images/ resolves 22 nodes",
  "AUDIO_SYNC :: Web Audio API Analyser ready",
  "GLYPH_CORE :: Space Grotesk & Playfair font variables mapped",
  "LINKING AUTOMATA :: Lxeus v.3.4.1 & Rukia v.1.2.0 links compiled",
  "COMPILING INTERFACE :: 16:9 exhibition grid pre-rendered",
  "ESTABLISHING SECURE GATEWAY :: localtunnel node active",
  "NEURAL_SYNAPSE :: All systems online. Ready to launch."
];

// Glitch text character set
const GLITCH_CHARS = "01XYZ@#$%&*+-=[]{}|;:<>?";

export default function IntroOverlay() {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeLogIdx, setActiveLogIdx] = useState(0);
  const [bootingComplete, setBootingComplete] = useState(false);
  const [titleText, setTitleText] = useState("Krishna.");
  const [isGlitching, setIsGlitching] = useState(false);
  const [systemStats, setSystemStats] = useState({
    fps: 60,
    temp: 34.2,
    ram: "4.12 GB",
    load: "12%",
    ping: "22ms"
  });

  const canvasRef = useRef(null);
  const glitchTimer = useRef(null);

  useEffect(() => {
    // Check if the user has already entered the portfolio in this session
    const hasEntered = sessionStorage.getItem("krishna-portfolio-entered");
    if (!hasEntered) {
      setIsVisible(true);
    }
  }, []);

  // Diagnostic Stats Randomizer
  useEffect(() => {
    if (!isVisible || bootingComplete) return;
    const interval = setInterval(() => {
      setSystemStats({
        fps: Math.floor(58 + Math.random() * 4),
        temp: parseFloat((34.0 + Math.random() * 2.5).toFixed(1)),
        ram: (4.1 + Math.random() * 0.2).toFixed(2) + " GB",
        load: Math.floor(10 + Math.random() * 15) + "%",
        ping: Math.floor(18 + Math.random() * 8) + "ms"
      });
    }, 400);
    return () => clearInterval(interval);
  }, [isVisible, bootingComplete]);

  // Canvas Neural Particle Mesh
  useEffect(() => {
    if (!isVisible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Particle nodes definition
    const nodeCount = 50;
    const nodes = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 1.5 + 0.5,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        pulseVal: Math.random() * Math.PI
      });
    }

    let mouse = { x: width / 2, y: height / 2, tx: width / 2, ty: height / 2 };
    const handleMouseMove = (e) => {
      mouse.tx = e.clientX;
      mouse.ty = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const drawGridMesh = () => {
      ctx.clearRect(0, 0, width, height);

      // Lerp mouse
      mouse.x += (mouse.tx - mouse.x) * 0.08;
      mouse.y += (mouse.ty - mouse.y) * 0.08;

      // Draw cyber 3D perspective lines radiating from center
      ctx.strokeStyle = "rgba(215, 186, 255, 0.015)";
      ctx.lineWidth = 1;
      const horizontalLines = 15;
      for (let i = 0; i < horizontalLines; i++) {
        const ratio = i / horizontalLines;
        const lineY = height * ratio;
        ctx.beginPath();
        ctx.moveTo(0, lineY);
        ctx.lineTo(width, lineY);
        ctx.stroke();
      }

      // Render nodes & links
      nodes.forEach((node, idx) => {
        // Move nodes
        node.x += node.vx;
        node.y += node.vy;

        // Bounce borders
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        node.pulseVal += node.pulseSpeed;
        const alpha = 0.12 + Math.sin(node.pulseVal) * 0.08;

        // Pull toward mouse slightly
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);
        if (distToMouse < 220) {
          const force = (220 - distToMouse) * 0.0003;
          node.x -= dx * force;
          node.y -= dy * force;
        }

        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(215, 186, 255, ${alpha + 0.1})`;
        ctx.fill();

        // Connect nodes near each other
        for (let j = idx + 1; j < nodes.length; j++) {
          const target = nodes[j];
          const tdx = target.x - node.x;
          const tdy = target.y - node.y;
          const dist = Math.sqrt(tdx * tdx + tdy * tdy);
          if (dist < 130) {
            const linkAlpha = (1 - dist / 130) * 0.05;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(target.x, target.y);
            ctx.strokeStyle = `rgba(247, 177, 227, ${linkAlpha})`;
            ctx.stroke();
          }
        }
      });

      // Draw radar circle tracking cursor
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 45, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(215, 186, 255, 0.03)";
      ctx.stroke();

      animId = requestAnimationFrame(drawGridMesh);
    };

    drawGridMesh();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isVisible]);

  // Title glitch sequence trigger
  useEffect(() => {
    if (!isVisible) return;
    const triggerGlitch = () => {
      setIsGlitching(true);
      let count = 0;
      const originalText = "Krishna.";
      const glitchInterval = setInterval(() => {
        setTitleText(
          originalText
            .split("")
            .map((char, index) => {
              if (Math.random() > 0.6) {
                return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
              }
              return char;
            })
            .join("")
        );
        count++;
        if (count > 5) {
          clearInterval(glitchInterval);
          setTitleText(originalText);
          setIsGlitching(false);
        }
      }, 70);
    };

    glitchTimer.current = setInterval(triggerGlitch, 3500);
    return () => clearInterval(glitchTimer.current);
  }, [isVisible]);

  // Boot progress simulation
  useEffect(() => {
    if (!isVisible) return;

    const duration = 2800; // Slightly longer for the cooler visuals
    const intervalTime = 20;
    const steps = duration / intervalTime;
    const stepIncrement = 100 / steps;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + stepIncrement;
        if (next >= 100) {
          clearInterval(timer);
          setBootingComplete(true);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isVisible]);

  // Telemetry logs sequencing
  useEffect(() => {
    if (!isVisible || bootingComplete) return;

    const logInterval = Math.floor(100 / BOOT_LOGS.length);
    const currentIdx = Math.min(
      Math.floor(progress / logInterval),
      BOOT_LOGS.length - 1
    );
    setActiveLogIdx(currentIdx);
  }, [progress, isVisible, bootingComplete]);

  const handleEnter = () => {
    sessionStorage.setItem("krishna-portfolio-entered", "true");
    setIsVisible(false);

    // Fire event to trigger audio playback inside persistent player
    window.dispatchEvent(new CustomEvent("play-portfolio-audio"));
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.15,
            filter: "blur(25px) contrast(150%)",
            transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] }
          }}
          className="fixed inset-0 bg-[#070608] z-[300] flex flex-col justify-between items-center p-8 select-none overflow-hidden"
        >
          {/* Neural Particle Network Canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
          />

          {/* Cybernetic Grid & Scanning lines */}
          <div className="absolute inset-0 bg-grid-cyber opacity-[0.03] pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0),rgba(255,255,255,0.01)_50%,rgba(255,255,255,0)_100%)] bg-[size:100%_4px] pointer-events-none animate-scanline" />

          {/* Dynamic Light Accent Blooms */}
          <div className="absolute w-[50vw] h-[50vw] rounded-full bg-primary/10 blur-[130px] pointer-events-none top-1/3 left-1/3 animate-pulse" style={{ animationDuration: "6s" }} />
          <div className="absolute w-[45vw] h-[45vw] rounded-full bg-[#f7b1e3]/8 blur-[120px] pointer-events-none bottom-1/3 right-1/3 animate-pulse" style={{ animationDuration: "8s" }} />

          {/* Top Diagnostics Dashboard Panel */}
          <div className="w-full max-w-7xl flex justify-between items-center text-muted font-mono text-[8px] tracking-[0.25em] relative z-10 border-b border-foreground/5 pb-5">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                SYS_ONLINE // K_PORTFOLIO_NODE
              </span>
              <span className="hidden sm:inline text-foreground/30">|</span>
              <span className="hidden sm:inline">ADDR: 49.37.158.62</span>
            </div>
            <div className="flex gap-4">
              <span>LAT: {systemStats.ping}</span>
              <span className="hidden md:inline">TEMP: {systemStats.temp}°C</span>
              <span className="hidden md:inline">SYS_LOAD: {systemStats.load}</span>
            </div>
          </div>

          {/* Center Insane Visual Module */}
          <div className="w-full max-w-4xl flex flex-col lg:grid lg:grid-cols-12 gap-8 items-center justify-center relative z-10 my-auto px-4">
            
            {/* Left side: Cybernetic Gyroscope SVG (New mechanical animation) */}
            <div className="col-span-12 lg:col-span-5 flex justify-center items-center relative aspect-square w-52 md:w-64 max-w-full">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* Glowing Outer Rings */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                  className="absolute w-[95%] h-[95%] rounded-full border border-dashed border-primary/20"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                  className="absolute w-[80%] h-[80%] rounded-full border border-dotted border-foreground/15"
                />
                {/* SVG Cyberspace Lock Indicator */}
                <svg className="w-full h-full text-primary/40 animate-pulse" viewBox="0 0 100 100" style={{ animationDuration: "3s" }}>
                  <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 9" />
                  <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="12 4 4 4" />
                  <path d="M 50 10 L 50 20 M 50 80 L 50 90 M 10 50 L 20 50 M 80 50 L 90 50" stroke="currentColor" strokeWidth="0.75" />
                  <rect x="47" y="47" width="6" height="6" fill="none" stroke="currentColor" strokeWidth="0.5" className="animate-spin" style={{ transformOrigin: "50px 50px", animationDuration: "10s" }} />
                </svg>
                {/* Scanning sweep */}
                <div className="absolute w-[90%] h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent animate-bounce opacity-40" />
              </div>
              <div className="relative text-center flex flex-col justify-center items-center">
                <span className="mono-metadata text-[20px] font-bold text-foreground tabular-nums">
                  {Math.floor(progress)}%
                </span>
                <span className="mono-metadata text-[7px] text-muted tracking-[0.3em] uppercase">
                  compiling
                </span>
              </div>
            </div>

            {/* Right side: Title, terminal outputs, enter button */}
            <div className="col-span-12 lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left w-full">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-ui text-[9px] tracking-[0.45em] text-primary uppercase mb-4 font-bold"
              >
                INITIALIZING COGNITIVE RUNTIME
              </motion.span>
              
              <h1 className="font-display text-6xl md:text-8xl font-bold tracking-tighter text-foreground mb-6 relative min-h-[80px]">
                <span className={isGlitching ? "text-primary italic scale-y-110 tracking-widest font-mono" : ""}>
                  {titleText}
                </span>
              </h1>

              {/* Advanced Simulated Terminal Screen */}
              <div className="w-full bg-[#100e14]/90 border border-foreground/10 p-5 rounded-2xl text-left font-mono text-[9px] text-muted space-y-2 mb-8 min-h-[145px] shadow-2xl backdrop-blur-md relative overflow-hidden">
                <div className="absolute top-2 right-4 text-[7px] text-primary/40 uppercase tracking-widest animate-pulse flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-primary" />
                  telemetry feed
                </div>
                <div className="flex gap-2 text-primary font-bold border-b border-foreground/5 pb-2 mb-3">
                  <span>&gt;</span>
                  <span>Active Compile Stream</span>
                </div>
                {BOOT_LOGS.slice(0, activeLogIdx + 1).map((log, idx) => (
                  <div key={idx} className="flex gap-2">
                    <span className="text-primary/50">&gt;&gt;</span>
                    <span className={idx === activeLogIdx ? "text-foreground font-semibold" : "text-muted/65"}>
                      {log}
                    </span>
                  </div>
                ))}
              </div>

              {/* Progress Slider */}
              <div className="w-full flex flex-col gap-3">
                <div className="w-full h-[3px] bg-foreground/5 rounded-full overflow-hidden relative">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-primary via-[#f7b1e3] to-primary shadow-[0_0_15px_var(--accent)]" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between w-full font-mono text-[7.5px] text-muted tracking-widest px-1">
                  <span>SYS_CORE :: LOAD_SEQUENCE_OK</span>
                  <span className="text-foreground font-semibold tabular-nums">{systemStats.fps} FPS // TEMP {systemStats.temp}°C</span>
                </div>
              </div>

              {/* Launch controller */}
              <div className="h-16 flex items-center justify-start mt-8 w-full">
                <AnimatePresence>
                  {bootingComplete && (
                    <motion.button
                      initial={{ opacity: 0, y: 15, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95, filter: "blur(5px)" }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      onClick={handleEnter}
                      className="group relative px-10 py-4 w-full md:w-auto rounded-full border border-primary/50 bg-primary/10 hover:bg-primary/20 hover:border-primary font-ui text-[10px] uppercase tracking-[0.25em] text-foreground transition-all duration-500 shadow-[0_0_35px_rgba(215,186,255,0.1)] hover:shadow-[0_0_60px_rgba(215,186,255,0.35)] cursor-pointer overflow-hidden text-center"
                    >
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary/15 via-white/10 to-primary/15 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        Initialize Interface
                        <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </span>
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Bottom Telemetry Info */}
          <div className="w-full max-w-7xl flex justify-between items-center text-muted font-mono text-[7px] tracking-[0.3em] relative z-10 border-t border-foreground/5 pt-5">
            <span>© 2026 KRISHNA PRODUCTION // EST_3297</span>
            <span>SECURE SECURE_ESTABLISHED // KEY_V2</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

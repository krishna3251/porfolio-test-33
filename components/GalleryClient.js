"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useScroll } from "framer-motion";

const categories = [
  "All Work",
  "Valorant",
  "Genshin Impact",
  "Wuthering Waves",
  "Honkai Star Rail",
  "Neverness To Everness",
  "Other Games",
];

// Hex swatches mapped to categories for the Focus Mode color analysis
const categoryPalettes = {
  "Valorant": ["#FF4655", "#0F1923", "#ECE8E1", "#8E939E"],
  "Genshin Impact": ["#ECE5D8", "#4A90E2", "#9F8FEF", "#1D2E4E"],
  "Wuthering Waves": ["#FFC53D", "#6BD6FF", "#141416", "#8E939E"],
  "Honkai Star Rail": ["#E1E4EC", "#C99A4E", "#2A1D37", "#3FA7C4"],
  "Neverness To Everness": ["#BC3FFF", "#3FFF7C", "#FFD53F", "#242426"],
  "Other Games": ["#D7BAFF", "#F7B1E3", "#151218", "#C0C0C0"],
  "All Work": ["#D7BAFF", "#F7B1E3", "#FF4655", "#FFC53D"]
};

// Preset custom polygon shapes for card styling
const clipPaths = [
  "polygon(6% 0%, 100% 0%, 94% 100%, 0% 100%)",      // Slanted Left
  "polygon(0% 0%, 94% 0%, 100% 100%, 6% 100%)",      // Slanted Right
  "polygon(10% 0%, 100% 0%, 100% 90%, 90% 100%, 0% 100%, 0% 10%)", // Double Cut Corner
  "polygon(0% 8%, 100% 0%, 100% 100%, 0% 92%)",     // Slanted Top
  "polygon(0% 0%, 100% 8%, 100% 92%, 0% 100%)",     // Slanted Bottom
  "polygon(6% 0%, 100% 10%, 94% 100%, 0% 90%)",      // Asymmetrical Trapezoid
];

// --- CANVAS CARD PARTICLE SYSTEM COMPONENT ---
function CardCanvasParticles({ isHovered, mouseX, mouseY }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!isHovered) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationId;
    let particles = [];
    
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvasRef.current) return;
      width = canvasRef.current.width = canvasRef.current.offsetWidth;
      height = canvasRef.current.height = canvasRef.current.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    // Seed particles
    const particleCount = 20;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5 + 0.5,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: -(Math.random() * 0.6 + 0.2), // Float up
        opacity: Math.random() * 0.4 + 0.2,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        // Drifting animation
        p.x += p.speedX;
        p.y += p.speedY;

        // Gravity wrap
        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }
        if (p.x < 0 || p.x > width) {
          p.speedX *= -1;
        }

        // Magnet attraction to mouse coordinates if close
        if (mouseX !== null && mouseY !== null) {
          const dx = mouseX - p.x;
          const dy = mouseY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            p.x += dx * 0.04;
            p.y += dy * 0.04;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(215, 186, 255, ${p.opacity})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, [isHovered, mouseX, mouseY]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none z-10 transition-opacity duration-700 ${
        isHovered ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}

// --- PREMIUM TILT CARD COMPONENT ---
function ExperimentalCard({ item, index, onClick, onHoverStart, onHoverEnd }) {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [localMouse, setLocalMouse] = useState({ x: null, y: null });

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // 3D rotations based on motion values (Increased tilt limits for a stronger 3D feel)
  const rotateX = useTransform(y, [-150, 150], [15, -15]);
  const rotateY = useTransform(x, [-150, 150], [-15, 15]);

  // Magnetic shifts (Pulls card slightly towards the mouse)
  const translateX = useTransform(x, [-150, 150], [-12, 12]);
  const translateY = useTransform(y, [-150, 150], [-12, 12]);

  const defaultMask = clipPaths[index % clipPaths.length];
  const hoveredMask = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";

  const handleMouseMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Relative coordinates from center (-width/2 to +width/2)
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    x.set(mouseX);
    y.set(mouseY);

    // Coordinates relative to card bounds (for shaders/canvas)
    setLocalMouse({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (onHoverStart) onHoverStart(item.image);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
    setLocalMouse({ x: null, y: null });
    if (onHoverEnd) onHoverEnd();
  };

  // Idle floating bounce animation
  const floatY = [0, -6, 0];
  const floatDelay = (index % 4) * 0.5;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      animate={isHovered ? {} : {
        y: floatY,
        transition: {
          y: {
            duration: 6,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: floatDelay
          }
        }
      }}
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
      onClick={() => onClick?.(item)}
      className="group relative w-full aspect-video bg-surface-container-high/10 border border-white/5 hover:border-primary/40 shadow-2xl hover:shadow-[0_30px_90px_-18px_rgba(0,0,0,0.95)] cursor-zoom-in perspective-2000 select-none overflow-hidden transition-all duration-500 rounded-3xl hover:scale-[1.035]"
    >
      {/* Morphing Tech Frame Containment */}
      <motion.div
        className="absolute inset-0 w-full h-full overflow-hidden"
        initial={{ clipPath: defaultMask }}
        animate={{ clipPath: isHovered ? hoveredMask : defaultMask }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Parallax Image - Pushed back in Z-space, 16:9 ratio, zooms in on hover */}
        <div 
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ transform: "translateZ(-15px)", transformStyle: "preserve-3d" }}
        >
          <img
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-[1.22]"
            src={item.image}
            loading="lazy"
          />
        </div>

        {/* Hover zoom lens */}
        <div
          className="absolute inset-6 z-20 overflow-hidden border border-white/15 bg-black/40 opacity-0 shadow-[0_30px_80px_rgba(0,0,0,0.7)] backdrop-blur-sm transition-all duration-500 group-hover:opacity-100"
          style={{
            clipPath: "polygon(4% 0%, 100% 0%, 96% 100%, 0% 100%)",
            transform: "translateZ(65px)",
          }}
        >
          <img
            alt={`${item.title} zoom preview`}
            className="h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.34]"
            src={item.image}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.28))]" />
          <div className="absolute left-4 top-4 flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.22em] text-white/75">
            <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_12px_var(--primary-color)]" />
            Preview Zoom
          </div>
        </div>

        {/* Dynamic Holographic Cursor-Following Spotlight Overlay */}
        {isHovered && localMouse.x !== null && (
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background: `radial-gradient(circle 200px at ${localMouse.x}px ${localMouse.y}px, rgba(var(--primary-color-rgb), 0.15) 0%, transparent 80%)`,
            }}
          />
        )}

        {/* Holographic foil sweep */}
        <div className="holo-foil absolute inset-0 z-20 pointer-events-none opacity-40 group-hover:opacity-70" />

        {/* Technical HUD Corner Brackets - Floated in Z-space */}
        <div 
          className="absolute top-5 left-5 w-4 h-4 border-t border-l border-white/20 group-hover:border-primary/50 transition-colors pointer-events-none z-20"
          style={{ transform: "translateZ(20px)" }}
        />
        <div 
          className="absolute bottom-5 right-5 w-4 h-4 border-b border-r border-white/20 group-hover:border-primary/50 transition-colors pointer-events-none z-20"
          style={{ transform: "translateZ(20px)" }}
        />

        {/* Matrix scan grid lines */}
        <div className="absolute inset-0 bg-grid-cyber pointer-events-none opacity-20 mix-blend-overlay group-hover:opacity-5 transition-opacity duration-700 z-10"></div>

        {/* Ambient Darkened Shading */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10 group-hover:from-black/95 group-hover:via-black/40 group-hover:to-black/30 transition-all duration-500 pointer-events-none z-10"></div>

        {/* Embedded Canvas Particles */}
        <CardCanvasParticles
          isHovered={isHovered}
          mouseX={localMouse.x}
          mouseY={localMouse.y}
        />

        {/* Floating Spec Telemetry HUD */}
        <div 
          className="absolute top-5 right-5 font-mono text-[7px] text-white/40 tracking-[0.2em] pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-[-5px] group-hover:translate-y-0 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/5 z-20"
          style={{ transform: "translateZ(40px)" }}
        >
          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>
          <span>SYSTEM: RENDER_COMPILATION_PASS_01</span>
        </div>

        {/* Card Details Footer */}
        <div
          className="absolute bottom-0 left-0 right-0 p-6 z-30 flex justify-between items-end w-full"
          style={{ transform: "translateZ(55px)", transformStyle: "preserve-3d" }}
        >
          <div className="w-full">
            <span 
              className="font-ui text-[8px] text-primary uppercase tracking-[0.3em] mb-2 block font-semibold"
              style={{ transform: "translateZ(15px)" }}
            >
              {"// "}
              {item.category}
            </span>
            <h3 
              className="font-display text-xl text-white font-medium mb-1 drop-shadow-md tracking-wide"
              style={{ transform: "translateZ(30px)" }}
            >
              {item.title}
            </h3>
            <p 
              className="font-sans text-[11px] text-white/50 font-light opacity-0 group-hover:opacity-100 transition-opacity duration-500 leading-normal line-clamp-1"
              style={{ transform: "translateZ(20px)" }}
            >
              {item.info}
            </p>
          </div>
          <span className="mb-1 hidden shrink-0 rounded-full border border-primary/30 bg-black/40 px-3 py-1.5 font-ui text-[8px] uppercase tracking-[0.18em] text-primary opacity-0 transition-opacity duration-500 group-hover:opacity-100 md:block">
            Open
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

// --- MAIN GALLERY ENGINE CLIENT COMPONENT ---
export default function GalleryClient({ initialItems }) {
  const [activeCategory, setActiveCategory] = useState("All Work");
  const [lightboxItem, setLightboxItem] = useState(null);
  const [projectedImage, setProjectedImage] = useState(null);
  const [dragProgress, setDragProgress] = useState(0);
  const runwayRef = useRef(null);

  // Parallax Scroll value
  const { scrollY } = useScroll();
  const parallaxOffset = useTransform(scrollY, [0, 1000], [0, -120]);

  // Select 4 items for the top runway carousel (preferably unique games)
  const featuredRunwayItems = initialItems.filter(item => 
    item.filename.toLowerCase().includes("op") || 
    item.filename.toLowerCase().includes("wuwa.png") || 
    item.filename.toLowerCase().includes("image.png") || 
    item.filename.toLowerCase().includes("nte")
  ).slice(0, 4);

  // Filter remaining items for the main grid showcase
  const filteredGridItems = initialItems.filter(
    (item) => activeCategory === "All Work" || item.category === activeCategory
  );

  // Calculate items quantity for HUD badges
  const getCategoryCount = (catName) => {
    if (catName === "All Work") return initialItems.length;
    return initialItems.filter(item => item.category === catName).length;
  };

  // Keyboard navigation inside Focus Mode
  useEffect(() => {
    if (!lightboxItem) return;

    const handleKeyDown = (e) => {
      const activeIdx = filteredGridItems.findIndex(i => i.id === lightboxItem.id);
      if (e.key === "Escape") {
        setLightboxItem(null);
      } else if (e.key === "ArrowRight" && activeIdx < filteredGridItems.length - 1) {
        setLightboxItem(filteredGridItems[activeIdx + 1]);
      } else if (e.key === "ArrowLeft" && activeIdx > 0) {
        setLightboxItem(filteredGridItems[activeIdx - 1]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxItem, filteredGridItems]);

  // Track dragging runway carousel scroll bar
  const handleRunwayScroll = () => {
    if (!runwayRef.current) return;
    const el = runwayRef.current;
    const scrollMax = el.scrollWidth - el.clientWidth;
    if (scrollMax <= 0) return;
    setDragProgress(el.scrollLeft / scrollMax);
  };

  // Modal zoom parallax
  const [modalParallax, setModalParallax] = useState({ x: 0, y: 0 });
  const handleModalMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setModalParallax({ x, y });
  };

  return (
    <div className="w-full relative">
      {/* Background Aurora projection shader layer */}
      <AnimatePresence>
        {projectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.12 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
          >
            <div
              className="absolute inset-0 bg-cover bg-center blur-[130px] scale-110"
              style={{ backgroundImage: `url(${projectedImage})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#121014]/65 via-transparent to-[#121014]/85" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* DYNAMIC CATEGORY NAVIGATION - CYBER BADGES */}
      <div className="flex overflow-x-auto hide-scrollbar gap-5 mb-16 pb-4 border-b border-white/5 relative z-30 justify-start xl:justify-center items-center">
        {categories.map((category, index) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`font-ui text-[10px] uppercase tracking-[0.25em] py-3 px-5 rounded-full transition-all duration-300 relative cursor-pointer flex items-center gap-2 select-none ${
              activeCategory === category 
                ? "text-primary font-bold" 
                : "text-on-surface-variant/50 hover:text-on-surface hover:bg-white/[0.02]"
            }`}
          >
            {activeCategory === category && (
              <motion.span
                layoutId="activeFilterPill"
                className="absolute inset-0 bg-white/[0.04] border border-primary/20 rounded-full shadow-[0_0_20px_rgba(215,186,255,0.06)] -z-10"
                transition={{ type: "spring", stiffness: 350, damping: 26 }}
              />
            )}
            <span>[ {String(index + 1).padStart(2, "0")} ]</span>
            <span>{category}</span>
            <span className="font-mono text-[8px] opacity-40 px-1 border border-white/10 rounded">
              {getCategoryCount(category)}
            </span>
          </button>
        ))}
      </div>

      {/* Main Exhibition Separator */}
      <div className="flex items-center gap-4 mb-16">
        <span className="font-mono text-[9px] text-primary tracking-widest">
          {"// EXHIBITION_GRID_INDEX // "}
          {activeCategory.toUpperCase()}
        </span>
        <div className="flex-grow h-px bg-gradient-to-r from-primary/30 to-transparent"></div>
        <span className="font-mono text-[8px] text-on-surface-variant/30 uppercase">
          {filteredGridItems.length} Nodes Resolved
        </span>
      </div>

      {/* UNIFORM GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        <AnimatePresence mode="popLayout">
          {filteredGridItems.map((item, idx) => {
            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                key={item.id}
                className="flex justify-center w-full"
              >
                <ExperimentalCard
                  item={item}
                  index={idx}
                  onClick={setLightboxItem}
                  onHoverStart={setProjectedImage}
                  onHoverEnd={() => setProjectedImage(null)}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[220] flex items-center justify-center bg-black/88 px-4 py-8 backdrop-blur-xl"
            onClick={() => setLightboxItem(null)}
            onMouseMove={handleModalMouseMove}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-6xl overflow-hidden rounded-[28px] border border-primary/20 bg-[#08070a] shadow-[0_0_120px_rgba(0,0,0,0.9)]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  alt={lightboxItem.title}
                  className="h-full w-full object-cover"
                  src={lightboxItem.image}
                  style={{
                    transform: `scale(1.08) translate(${modalParallax.x * -18}px, ${modalParallax.y * -18}px)`,
                    transition: "transform 120ms ease-out",
                  }}
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.72),transparent_45%,rgba(0,0,0,0.18))]" />
                <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-2 p-6 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="font-ui text-[10px] uppercase tracking-[0.3em] text-primary">
                      {lightboxItem.category}
                    </p>
                    <h2 className="mt-2 font-display text-4xl font-semibold text-white md:text-6xl">
                      {lightboxItem.title}
                    </h2>
                    <p className="mt-2 max-w-xl text-sm text-white/60">{lightboxItem.info}</p>
                  </div>
                  <button
                    onClick={() => setLightboxItem(null)}
                    className="self-start rounded-full border border-white/15 bg-white/5 px-5 py-2.5 font-ui text-[10px] uppercase tracking-[0.2em] text-white/80 transition hover:border-primary/40 hover:text-primary md:self-auto"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-16" />

    </div>
  );
}

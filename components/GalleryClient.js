"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";

const categories = [
  "All Work",
  "Valorant",
  "Genshin Impact",
  "Wuthering Waves",
  "Honkai Star Rail",
  "Neverness To Everness",
  "Other Games",
];

// Helper to get color swatches based on category
const getSwatches = (category) => {
  switch (category) {
    case "Genshin Impact":
      return [
        { hex: "#e5c07b", name: "Cor Lapis" },
        { hex: "#c678dd", name: "Electro Violet" },
        { hex: "#4db5ff", name: "Anemo Teal" },
        { hex: "#1e1e24", name: "Abyss Black" }
      ];
    case "Wuthering Waves":
      return [
        { hex: "#98c379", name: "Emerald Resonator" },
        { hex: "#e06c75", name: "Havoc Red" },
        { hex: "#61afef", name: "Glacio Blue" },
        { hex: "#282c34", name: "Tacet Core" }
      ];
    case "Honkai Star Rail":
      return [
        { hex: "#f7b1e3", name: "Stellaron Pink" },
        { hex: "#d7baff", name: "Astral Indigo" },
        { hex: "#abb2bf", name: "Express Silver" },
        { hex: "#16121e", name: "Void Purple" }
      ];
    case "Valorant":
      return [
        { hex: "#ff4655", name: "First Light Red" },
        { hex: "#00f5ff", name: "Radianite Cyan" },
        { hex: "#39ff14", name: "Viper Toxic" },
        { hex: "#11141a", name: "Defuse Black" }
      ];
    case "Neverness To Everness":
      return [
        { hex: "#d7baff", name: "Cyber Violet" },
        { hex: "#ff6b4a", name: "Neon Orange" },
        { hex: "#ffffff", name: "Evershine White" },
        { hex: "#08060a", name: "Urban Void" }
      ];
    default:
      return [
        { hex: "#ff6b4a", name: "Lava Orange" },
        { hex: "#00f5ff", name: "Sky Cyan" },
        { hex: "#abb2bf", name: "Muted Chrome" },
        { hex: "#1a1a24", name: "Matte Void" }
      ];
  }
};

// Helper to get technical specs based on category
const getSpecs = (category) => {
  switch (category) {
    case "Genshin Impact":
      return {
        software: "Adobe Photoshop CC / Blender 3D",
        canvas: "3840 x 2160 (4K UHD)",
        time: "9.5 Hours",
        layers: "182 Composite Layers",
        colorSpace: "Display P3 Wide Color"
      };
    case "Wuthering Waves":
      return {
        software: "Photoshop CC / Stable Diffusion ControlNet",
        canvas: "3840 x 2160 (4K UHD)",
        time: "8.0 Hours",
        layers: "148 Composite Layers",
        colorSpace: "Display P3 Wide Color"
      };
    case "Honkai Star Rail":
      return {
        software: "Photoshop CC / Figma Layouts",
        canvas: "3840 x 2160 (4K UHD)",
        time: "7.5 Hours",
        layers: "160 Composite Layers",
        colorSpace: "sRGB IEC61966-2.1"
      };
    case "Valorant":
      return {
        software: "Photoshop CC / Unreal Engine 5",
        canvas: "3840 x 2160 (4K UHD)",
        time: "6.0 Hours",
        layers: "92 Composite Layers",
        colorSpace: "sRGB IEC61966-2.1"
      };
    case "Neverness To Everness":
      return {
        software: "Photoshop CC / Blender (Cycles) / Substance Painter",
        canvas: "3840 x 2160 (4K UHD)",
        time: "11.5 Hours",
        layers: "224 Composite Layers",
        colorSpace: "Display P3 Wide Color"
      };
    default:
      return {
        software: "Adobe Photoshop CC / Illustrator",
        canvas: "3840 x 2160 (4K UHD)",
        time: "5.5 Hours",
        layers: "78 Composite Layers",
        colorSpace: "sRGB IEC61966-2.1"
      };
  }
};

// --- EDITORIAL CARD COMPONENT ---
function EditorialCard({ item, index, onClick }) {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Advanced 3D rotation and translation
  const rotateX = useTransform(y, [-150, 150], [8, -8]);
  const rotateY = useTransform(x, [-150, 150], [-8, 8]);
  const tx = useTransform(x, [-150, 150], [-5, 5]);
  const ty = useTransform(y, [-150, 150], [-5, 5]);

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
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={() => onClick?.(item)}
      className="group relative w-full flex flex-col gap-6 cursor-zoom-in select-none music-beat-scale"
    >
      {/* Dynamic Sound Reactive Ambient Glow behind card */}
      <div className="absolute inset-0 bg-primary/5 blur-[45px] rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none music-bloom-glow" />

      {/* Image Container with 3D Parallax */}
      <motion.div 
        style={{ rotateX, rotateY, x: tx, y: ty, transformStyle: "preserve-3d" }}
        className="relative aspect-video overflow-hidden rounded-3xl paper-sheet border border-foreground/5 transition-all duration-500 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)] group-hover:border-primary/20"
      >
        <motion.img
          alt={item.title}
          className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-1000 ease-out group-hover:scale-105"
          src={item.image}
          loading="lazy"
        />
        {/* Futuristic Cyber Overlay Grid */}
        <div className="absolute inset-0 bg-grid-cyber opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent pointer-events-none" />
        <div className="absolute inset-0 border-[1rem] border-surface pointer-events-none transition-all duration-500 group-hover:border-[0.5rem] rounded-[22px]"></div>

        {/* Live scanner indicator */}
        <div className="absolute top-4 right-4 z-10 w-2 h-2 rounded-full bg-primary/40 animate-ping opacity-0 group-hover:opacity-100" />
      </motion.div>

      {/* Label / Metadata */}
      <div className="flex flex-col gap-2 px-3">
        <div className="flex justify-between items-baseline">
          <span className="mono-metadata text-primary text-[9px] font-bold tracking-widest">{item.category}</span>
          <span className="mono-metadata text-muted text-[8px]">EX_0{index + 1}</span>
        </div>
        <h3 className="serif-display text-2xl text-foreground group-hover:text-primary transition-all duration-300">
          {item.title}
        </h3>
        <p className="font-sans text-xs text-muted leading-relaxed max-w-[280px]">
          {item.info}
        </p>
      </div>
    </motion.div>
  );
}

// --- MAIN GALLERY ENGINE CLIENT COMPONENT ---
export default function GalleryClient({ initialItems }) {
  const [activeCategory, setActiveCategory] = useState("All Work");
  const [lightboxItem, setLightboxItem] = useState(null);

  const filteredGridItems = initialItems.filter(
    (item) => activeCategory === "All Work" || item.category === activeCategory
  );

  return (
    <div className="w-full relative">
      
      {/* CATEGORY NAVIGATION */}
      <div className="flex overflow-x-auto hide-scrollbar gap-12 mb-20 pb-6 border-b border-foreground/5 justify-start lg:justify-center items-center">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`mono-metadata text-[10px] transition-all duration-300 relative cursor-pointer select-none pb-2 ${
              activeCategory === category 
                ? "text-primary font-bold" 
                : "text-muted hover:text-foreground"
            }`}
          >
            {category}
            {activeCategory === category && (
              <motion.span
                layoutId="activePill"
                className="absolute bottom-0 left-0 w-full h-[2px] bg-primary"
                transition={{ type: "spring", stiffness: 350, damping: 26 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24 relative z-10">
        <AnimatePresence mode="popLayout">
          {filteredGridItems.map((item, idx) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={item.id}
            >
              <EditorialCard
                item={item}
                index={idx}
                onClick={setLightboxItem}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* LUXURY LIGHTBOX EXHIBITION MODAL */}
      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[220] flex items-center justify-center bg-background/95 p-4 md:p-8 lg:p-12 backdrop-blur-md"
            onClick={() => setLightboxItem(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.98 }}
              className="relative w-full max-w-6xl rounded-3xl border border-primary/20 bg-surface/90 overflow-hidden shadow-[0_45px_150px_rgba(0,0,0,0.8)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Dynamic top gradient line */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                {/* Visualizer screen */}
                <div className="lg:col-span-8 aspect-video overflow-hidden relative bg-black flex items-center justify-center">
                  <img
                    alt={lightboxItem.title}
                    className="h-full w-full object-cover"
                    src={lightboxItem.image}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute inset-0 bg-grid-cyber opacity-[0.04] pointer-events-none" />
                  
                  {/* Visualizer resolution stamp */}
                  <div className="absolute bottom-6 left-6 z-10 bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl text-[8px] font-mono text-white/80 tracking-widest uppercase">
                    Exhibition Feed // 3840 x 2160 px
                  </div>
                </div>

                {/* Information Dashboard */}
                <div className="lg:col-span-4 p-8 md:p-10 flex flex-col justify-between bg-[#0d0912]/95 border-l border-foreground/5 h-full relative overflow-y-auto">
                  <div className="space-y-8">
                    <div>
                      <span className="mono-metadata text-primary text-[9px] font-bold tracking-[0.25em] mb-3 block">
                        {lightboxItem.category}
                      </span>
                      <h2 className="serif-display text-4xl text-foreground font-semibold leading-tight mb-4">
                        {lightboxItem.title}
                      </h2>
                      <p className="font-sans text-xs text-muted leading-relaxed">
                        {lightboxItem.info}
                      </p>
                    </div>

                    <div className="h-px bg-foreground/5" />

                    {/* Color Swatches Panel */}
                    <div>
                      <span className="mono-metadata text-muted text-[8px] tracking-[0.2em] mb-4 block uppercase">
                        Identified Palette
                      </span>
                      <div className="grid grid-cols-4 gap-2">
                        {getSwatches(lightboxItem.category).map((swatch, sIdx) => (
                          <div key={sIdx} className="flex flex-col items-center gap-1.5 group/swatch">
                            <div 
                              className="w-10 h-10 rounded-full border border-white/10 shadow-lg relative cursor-help flex items-center justify-center" 
                              style={{ backgroundColor: swatch.hex }}
                              title={swatch.name}
                            >
                              <span className="opacity-0 group-hover/swatch:opacity-100 transition-opacity duration-300 text-[6px] text-white mix-blend-difference font-mono select-none">
                                {swatch.hex}
                              </span>
                            </div>
                            <span className="text-[6.5px] font-mono text-muted text-center leading-none mt-1 group-hover/swatch:text-primary transition-colors">
                              {swatch.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="h-px bg-foreground/5" />

                    {/* Technical Metadata specs */}
                    <div>
                      <span className="mono-metadata text-muted text-[8px] tracking-[0.2em] mb-4 block uppercase">
                        Technical Metadata
                      </span>
                      <div className="space-y-3 font-mono text-[9px]">
                        <div className="flex justify-between">
                          <span className="text-muted">Software Nodes</span>
                          <span className="text-foreground text-right">{getSpecs(lightboxItem.category).software}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted">Active Space</span>
                          <span className="text-foreground">{getSpecs(lightboxItem.category).colorSpace}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted">Complexity</span>
                          <span className="text-foreground">{getSpecs(lightboxItem.category).layers}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted">Session Render</span>
                          <span className="text-foreground">{getSpecs(lightboxItem.category).time}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setLightboxItem(null)}
                    className="mono-metadata text-[9px] tracking-[0.2em] text-foreground border border-foreground/10 py-3.5 w-full rounded-2xl hover:bg-foreground hover:text-background transition-all duration-300 cursor-pointer mt-12 text-center"
                  >
                    Close Archive
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-24" />
    </div>
  );
}

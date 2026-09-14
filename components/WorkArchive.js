"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

export default function WorkArchive({ groups = [] }) {
  const [activeDateKey, setActiveDateKey] = useState("all");
  const [selectedThumbnail, setSelectedThumbnail] = useState(null);
  const shouldReduceMotion = useReducedMotion();
  const [, startTransition] = useTransition();

  const totalThumbnails = groups.reduce((acc, g) => acc + g.thumbnails.length, 0);

  const displayedGroups =
    activeDateKey === "all"
      ? groups
      : groups.filter((g) => g.dateKey === activeDateKey);

  const cardVariants = {
    hidden: {
      opacity: 0,
      scale: shouldReduceMotion ? 1 : 0.8,
      filter: shouldReduceMotion ? "blur(0px)" : "blur(10px)",
    },
    visible: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: shouldReduceMotion ? 0 : 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
      },
    },
  };

  return (
    <div className="w-full relative">
      {/* Top Controls: Timeline Date Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 pb-8 border-b border-foreground/5">
        <div>
          <div className="mono-metadata text-primary text-[8px] tracking-[0.25em] font-bold mb-2">
            CHRONOLOGICAL ARCHIVE // NEWEST FIRST
          </div>
          <h3 className="serif-display text-3xl md:text-4xl text-foreground">
            Visual Studies Archive
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <span className="mono-metadata text-[8px] text-muted tracking-widest">
            TOTAL INDEXED:
          </span>
          <span className="mono-metadata text-xs text-primary font-bold bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
            {totalThumbnails} FRAMES
          </span>
        </div>
      </div>

      {/* Date Rail Navigation Chips */}
      <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-6 mb-10 -mx-2 px-2">
        <button
          onClick={() => startTransition(() => setActiveDateKey("all"))}
          className={`flex items-center gap-2.5 px-4 py-2 rounded-full mono-metadata text-[8.5px] font-bold tracking-widest transition-all duration-300 cursor-pointer shrink-0 ${
            activeDateKey === "all"
              ? "bg-primary text-background border border-primary shadow-[0_0_20px_rgba(215,186,255,0.25)]"
              : "bg-surface/60 text-muted hover:text-foreground border border-foreground/5 hover:border-foreground/15"
          }`}
        >
          <span>ALL DATES</span>
          <span
            className={`text-[7px] px-1.5 py-0.5 rounded-full ${
              activeDateKey === "all"
                ? "bg-background/20 text-background"
                : "bg-foreground/5 text-muted"
            }`}
          >
            {totalThumbnails}
          </span>
        </button>

        {groups.map((group, idx) => {
          const isActive = activeDateKey === group.dateKey;
          return (
            <button
              key={group.dateKey}
              onClick={() => startTransition(() => setActiveDateKey(group.dateKey))}
              className={`flex items-center gap-2 px-4 py-2 rounded-full mono-metadata text-[8.5px] font-bold tracking-widest transition-all duration-300 cursor-pointer shrink-0 ${
                isActive
                  ? "bg-primary text-background border border-primary shadow-[0_0_20px_rgba(215,186,255,0.25)]"
                  : "bg-surface/60 text-muted hover:text-foreground border border-foreground/5 hover:border-foreground/15"
              }`}
            >
              <span>{idx === 0 ? `LATEST (${group.shortDate})` : group.shortDate}</span>
              <span
                className={`text-[7px] px-1.5 py-0.5 rounded-full ${
                  isActive
                    ? "bg-background/20 text-background"
                    : "bg-foreground/5 text-muted"
                }`}
              >
                {group.thumbnails.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Date Groups List */}
      <div className="space-y-20">
        {displayedGroups.map((group) => (
          <div key={group.dateKey} className="relative">
            {/* Date Header Stamp */}
            <div className="flex items-baseline justify-between mb-8 pb-3 border-b border-foreground/5">
              <div className="flex items-center gap-4">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <h4 className="serif-display text-2xl md:text-3xl text-foreground font-semibold">
                  {group.formattedDate}
                </h4>
              </div>
              <span className="mono-metadata text-[8px] text-muted tracking-widest">
                {group.thumbnails.length} {group.thumbnails.length === 1 ? "STUDY" : "STUDIES"}
              </span>
            </div>

            {/* InView Staggered Thumbnail Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "0px 0px -100px 0px" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {group.thumbnails.map((thumb) => (
                <motion.article
                  key={thumb.id}
                  variants={cardVariants}
                  whileHover={shouldReduceMotion ? undefined : { y: -6, scale: 1.02 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  onClick={() => setSelectedThumbnail(thumb)}
                  className="group relative bg-surface/50 border border-foreground/5 hover:border-primary/40 rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col"
                >
                  {/* Thumbnail Image Container */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-black/40">
                    <img
                      src={thumb.src}
                      alt={`${thumb.label} study: ${thumb.title}`}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a080d]/80 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-300" />

                    {/* Short Label Pill */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="mono-metadata text-[7px] text-white/95 font-bold tracking-widest bg-black/70 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-md shadow-md">
                        {thumb.label}
                      </span>
                    </div>

                    {/* Inspect Badge on hover */}
                    <div className="absolute bottom-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="mono-metadata text-[7px] text-primary bg-background/90 backdrop-blur-md border border-primary/30 px-2.5 py-1 rounded-md font-bold">
                        VIEW SPECS ↗
                      </span>
                    </div>
                  </div>

                  {/* Thumbnail Metadata Footer */}
                  <div className="p-4 flex flex-col justify-between flex-grow">
                    <div>
                      <h5 className="font-sans text-xs md:text-sm font-semibold text-foreground/90 group-hover:text-primary transition-colors line-clamp-1 mb-1">
                        {thumb.title}
                      </h5>
                      <p className="mono-metadata text-[7.5px] text-muted tracking-wider line-clamp-1">
                        {thumb.subtitle}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-foreground/5">
                      <div className="flex items-center gap-1.5">
                        {thumb.swatches.slice(0, 3).map((swatch, sIdx) => (
                          <span
                            key={sIdx}
                            title={swatch.name}
                            className="w-2 h-2 rounded-full border border-black/30"
                            style={{ backgroundColor: swatch.hex }}
                          />
                        ))}
                      </div>
                      <span className="mono-metadata text-[7px] text-muted">
                        {group.shortDate}
                      </span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </div>
        ))}
      </div>

      {/* High-Resolution Inspection Lightbox Modal */}
      <AnimatePresence>
        {selectedThumbnail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedThumbnail(null)}
            className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full max-h-[90vh] overflow-y-auto bg-surface border border-foreground/10 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col gap-6"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedThumbnail(null)}
                className="absolute top-6 right-6 z-10 w-9 h-9 rounded-full bg-background/80 border border-foreground/10 text-foreground/80 hover:text-foreground hover:bg-foreground/10 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                ✕
              </button>

              {/* Main Full-Res Display */}
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-foreground/10 bg-black/60 shadow-inner">
                <img
                  src={selectedThumbnail.src}
                  alt={selectedThumbnail.title}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Detail Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-2">
                <div className="md:col-span-7 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="mono-metadata text-[8px] text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-md font-bold">
                      {selectedThumbnail.label}
                    </span>
                    <span className="mono-metadata text-[8px] text-muted">
                      EXHIBITION ID // {selectedThumbnail.id}
                    </span>
                  </div>
                  <h3 className="serif-display text-3xl text-foreground font-semibold mb-2">
                    {selectedThumbnail.title}
                  </h3>
                  <p className="font-sans text-sm text-muted leading-relaxed mb-6">
                    {selectedThumbnail.subtitle}. Produced as part of Krishna&apos;s digital artwork and thumbnail design research, testing focal hierarchy, lighting contrast, and character presence.
                  </p>

                  {/* Swatches Palette */}
                  <div>
                    <span className="mono-metadata text-[8px] text-muted block mb-2">
                      CHROMATIC PROFILE
                    </span>
                    <div className="flex flex-wrap gap-3">
                      {selectedThumbnail.swatches.map((swatch, sIdx) => (
                        <div
                          key={sIdx}
                          className="flex items-center gap-2 bg-background/60 border border-foreground/5 px-3 py-1.5 rounded-lg"
                        >
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-black/40"
                            style={{ backgroundColor: swatch.hex }}
                          />
                          <span className="mono-metadata text-[7.5px] text-foreground/90">
                            {swatch.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Technical Specs Card */}
                <div className="md:col-span-5 bg-background/60 border border-foreground/5 p-6 rounded-2xl flex flex-col justify-between">
                  <span className="mono-metadata text-[8px] text-primary font-bold tracking-widest mb-4 block">
                    PRODUCTION SPECIFICATIONS
                  </span>
                  <div className="space-y-3 font-mono text-[9px]">
                    <div className="flex justify-between py-1.5 border-b border-foreground/5">
                      <span className="text-muted">Canvas Resolution</span>
                      <span className="text-foreground font-bold">{selectedThumbnail.specs.canvas}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-foreground/5">
                      <span className="text-muted">Production Time</span>
                      <span className="text-foreground font-bold">{selectedThumbnail.specs.time}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-foreground/5">
                      <span className="text-muted">Composite Elements</span>
                      <span className="text-foreground font-bold">{selectedThumbnail.specs.layers}</span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-foreground/5">
                      <span className="text-muted">Color Space</span>
                      <span className="text-foreground font-bold">{selectedThumbnail.specs.colorSpace}</span>
                    </div>
                    <div className="flex flex-col gap-1 pt-1.5">
                      <span className="text-muted">Software Pipeline</span>
                      <span className="text-primary font-bold text-[8.5px]">{selectedThumbnail.specs.software}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

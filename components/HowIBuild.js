"use client";

import { motion } from "framer-motion";

const principles = [
  {
    code: "ARCH_01",
    title: "Modular Architecture",
    description: "Decoupling concerns into discrete services, modular components, and clear data pathways.",
  },
  {
    code: "COMP_02",
    title: "Reusable Components",
    description: "Building composable, well-typed UI blocks and backend handlers that avoid duplication.",
  },
  {
    code: "INTG_03",
    title: "Robust API Integration",
    description: "Handling rate limits, schema variations, payload parsing, and secure key hygiene.",
  },
  {
    code: "AUTO_04",
    title: "Scripted Automation",
    description: "Replacing repetitive manual server tasks with reliable Python and Node pipelines.",
  },
  {
    code: "RESP_05",
    title: "Responsive Viewport Design",
    description: "Engineering layouts from mobile constraints up to ultra-wide displays without horizontal breakages.",
  },
  {
    code: "ERR_06",
    title: "Resilient Error Handling",
    description: "Graceful fallbacks, informative console logging, and structured try-catch containment.",
  },
  {
    code: "VAL_07",
    title: "Strict Input Validation",
    description: "Validating incoming payloads, user bot commands, and parameters prior to execution.",
  },
  {
    code: "PERF_08",
    title: "Performance Awareness",
    description: "Lazy-loading heavy imagery, optimizing rerenders, and minimizing unneeded runtime dependencies.",
  },
  {
    code: "MAINT_09",
    title: "Maintainable Codebase",
    description: "Clear naming, predictable file trees, and zero artificial bloat so systems remain easy to extend.",
  },
];

export default function HowIBuild() {
  return (
    <div className="w-full relative py-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-foreground/5">
        <div>
          <div className="mono-metadata text-primary mb-3 tracking-[0.25em] font-bold flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-primary" />
            04 // ENGINEERING STANDARDS
          </div>
          <h3 className="serif-display text-4xl md:text-5xl text-foreground font-semibold">
            How I <span className="italic text-primary">Build.</span>
          </h3>
          <p className="font-sans text-muted text-sm md:text-base mt-4 max-w-xl leading-relaxed">
            Practical engineering disciplines guiding my Discord bots, AI workflows, and front-end architectures.
          </p>
        </div>

        {/* HUD Status Box */}
        <div className="bg-surface/50 border border-foreground/5 p-4 rounded-2xl flex items-center gap-4">
          <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
          <div>
            <div className="mono-metadata text-[7.5px] text-muted">SYSTEM VALIDATION</div>
            <div className="font-mono text-xs font-bold text-foreground">STANDARDS VERIFIED // ALL PASS</div>
          </div>
        </div>
      </div>

      {/* Checklist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {principles.map((item, idx) => (
          <motion.article
            key={item.code}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.06, duration: 0.5 }}
            className="relative bg-surface/40 hover:bg-surface/70 border border-foreground/5 hover:border-primary/30 p-6 rounded-2xl transition-all duration-300 group flex flex-col justify-between"
          >
            {/* Top Micro-line */}
            <div className="flex items-center justify-between mb-4">
              <span className="mono-metadata text-[8px] text-primary/70 tracking-widest font-bold">
                {item.code}
              </span>
              <span className="w-5 h-5 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center text-[10px] font-bold group-hover:bg-primary group-hover:text-background transition-colors">
                ✓
              </span>
            </div>

            {/* Content */}
            <div>
              <h4 className="font-sans text-base font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                {item.title}
              </h4>
              <p className="font-sans text-xs md:text-sm text-muted leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Bottom HUD bar */}
            <div className="mt-6 pt-3 border-t border-foreground/5 flex items-center justify-between">
              <span className="mono-metadata text-[7px] text-muted/60">ACTIVE SPECIFICATION</span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";

export default function MusicSpotlight() {
  const triggerGlobalAudio = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("play-portfolio-audio"));
    }
  };

  return (
    <div className="w-full relative py-8">
      {/* Header */}
      <div className="mb-14">
        <div className="mono-metadata text-primary mb-3 tracking-[0.25em] font-bold flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-primary" />
          06 // AMBIENT SOUNDTRACK
        </div>
        <h3 className="serif-display text-4xl md:text-5xl text-foreground font-semibold">
          Sound & <span className="italic text-primary">Atmosphere.</span>
        </h3>
        <p className="font-sans text-muted text-sm md:text-base mt-4 max-w-xl leading-relaxed">
          Audio runs as a global background soundtrack across the entire portfolio. Built with Web Audio API frequency analysis driving subtle edge ripples and ambient particle velocity.
        </p>
      </div>

      {/* Featured Vinyl Player Showcase Card */}
      <div className="bg-surface/50 border border-foreground/5 p-8 md:p-12 rounded-3xl relative overflow-hidden group shadow-2xl">
        {/* Glow behind card */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[35vw] h-[35vw] bg-primary/5 rounded-full blur-[90px] pointer-events-none music-bloom-glow" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
          {/* Vinyl & Artwork Mockup */}
          <div className="md:col-span-5 flex justify-center">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56">
              {/* Spinning Vinyl behind */}
              <div className="absolute inset-0 rounded-full bg-[#110f17] border-4 border-black/80 shadow-2xl flex items-center justify-center animate-spin group-hover:translate-x-6 transition-transform duration-700" style={{ animationDuration: "10s" }}>
                <div className="w-24 h-24 rounded-full border-2 border-foreground/10 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-background" />
                  </div>
                </div>
              </div>

              {/* Sleeve Cover */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden paper-sheet border border-foreground/10 shadow-2xl bg-surface">
                <img
                  src="/neverness_showcase.png"
                  alt="Soundtrack Cover Art"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="mono-metadata text-[7px] text-white/90 bg-primary/20 border border-primary/30 px-2 py-0.5 rounded-full">
                    GLOBAL AMBIENT
                  </span>
                  <div className="font-serif text-lg text-white font-bold mt-1">i (Cover)</div>
                  <div className="mono-metadata text-[7px] text-white/70">KRISHNA SOUNDTRACK ARCHIVE</div>
                </div>
              </div>
            </div>
          </div>

          {/* Player Details & Action */}
          <div className="md:col-span-7 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="mono-metadata text-[8px] text-primary tracking-widest font-bold">
                PERSISTENT ACROSS NAVIGATION
              </span>
            </div>
            <h4 className="serif-display text-3xl md:text-4xl text-foreground font-semibold mb-3">
              Subtle Audio-Reactive Engine
            </h4>
            <p className="font-sans text-sm text-muted leading-relaxed mb-8 max-w-lg">
              The soundtrack connects to an active Web Audio API Analyser, broadcasting live frequency metrics (<code className="text-primary font-mono text-xs">--music-intensity</code> & <code className="text-primary font-mono text-xs">--music-bass</code>) that gently modulate borders, text shadows, and particle speeds without turning into a club.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={triggerGlobalAudio}
                className="mono-metadata text-[9.5px] tracking-[0.25em] font-bold bg-primary text-background px-6 py-3 rounded-full shadow-[0_0_25px_rgba(215,186,255,0.3)] hover:scale-105 transition-all duration-300 cursor-pointer flex items-center gap-2"
              >
                <span>PLAY SOUNDTRACK</span>
                <span>▶</span>
              </button>

              <span className="mono-metadata text-[8px] text-muted">
                USE TOP BAR TO MUTE OR PAUSE ANYTIME
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

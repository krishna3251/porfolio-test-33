"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export default function AudioPlayer() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const analyserInitialized = useRef(false);

  const initAnalyser = useCallback(() => {
    if (analyserInitialized.current) return;
    const audio = audioRef.current;
    if (!audio) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      const audioCtx = new AudioContextClass();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      const source = audioCtx.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(audioCtx.destination);
      window.portfolioAnalyser = analyser;
      window.portfolioAudioContext = audioCtx;
      analyserInitialized.current = true;
    } catch (e) {
      console.log("Audio API failed:", e);
    }
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    initAnalyser();
    if (window.portfolioAudioContext?.state === "suspended") {
      window.portfolioAudioContext.resume();
    }
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleAutoplay = () => {
    const nextVal = !autoplay;
    setAutoplay(nextVal);
    localStorage.setItem("portfolio-autoplay-music", String(nextVal));
  };

  // Init autoplay state from storage
  useEffect(() => {
    const saved = localStorage.getItem("portfolio-autoplay-music");
    if (saved !== null) {
      setAutoplay(saved === "true");
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.35;

    // Direct event-based trigger from IntroOverlay
    const handleEventPlay = () => {
      initAnalyser();
      if (audio && audio.paused) {
        audio.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    };
    window.addEventListener("play-portfolio-audio", handleEventPlay);

    // Fallback interaction trigger to bypass browser autoplay blocks
    const triggerPlayOnInteraction = () => {
      const isAutoplayEnabled = localStorage.getItem("portfolio-autoplay-music") !== "false";
      if (!isAutoplayEnabled) {
        removeInteractionListeners();
        return;
      }
      
      initAnalyser();
      if (window.portfolioAudioContext?.state === "suspended") {
        window.portfolioAudioContext.resume();
      }
      if (audio && audio.paused) {
        audio.play()
          .then(() => {
            setIsPlaying(true);
            removeInteractionListeners();
          })
          .catch((e) => console.log("Autoplay deferred:", e));
      } else {
        removeInteractionListeners();
      }
    };

    const removeInteractionListeners = () => {
      window.removeEventListener("click", triggerPlayOnInteraction);
      window.removeEventListener("scroll", triggerPlayOnInteraction);
      window.removeEventListener("touchstart", triggerPlayOnInteraction);
    };

    window.addEventListener("click", triggerPlayOnInteraction);
    window.addEventListener("scroll", triggerPlayOnInteraction, { passive: true });
    window.addEventListener("touchstart", triggerPlayOnInteraction, { passive: true });

    return () => {
      removeInteractionListeners();
      window.removeEventListener("play-portfolio-audio", handleEventPlay);
    };
  }, [initAnalyser]);

  return (
    <div className="flex items-center gap-4 bg-foreground/5 border border-foreground/5 rounded-full px-4 py-2">
      <audio ref={audioRef} src="/song.mp3" loop crossOrigin="anonymous" />
      
      {/* Visualizer Lines */}
      <div 
        onClick={togglePlay} 
        className="flex items-end gap-[2px] h-3.5 w-5 cursor-pointer justify-center"
        title="Play / Pause Audio"
      >
        {[0, 1, 2, 3].map((idx) => (
          <span
            key={idx}
            className={`w-[1.5px] bg-primary transition-all duration-300 rounded-full ${
              isPlaying ? "animate-pulse" : "h-[2px]"
            }`}
            style={{
              animationDelay: isPlaying ? `${idx * 0.15}s` : "0s",
              animationDuration: isPlaying ? "0.6s" : "0s",
              height: isPlaying ? "100%" : "2px",
            }}
          />
        ))}
      </div>

      <button
        onClick={togglePlay}
        className="mono-metadata text-[9px] text-muted hover:text-primary transition-colors cursor-pointer"
      >
        {isPlaying ? "Pause" : "Play"}
      </button>

      {/* Vertical divider */}
      <span className="w-px h-3 bg-foreground/10" />

      {/* Autoplay setting indicator */}
      <button
        onClick={toggleAutoplay}
        className={`mono-metadata text-[8px] transition-colors cursor-pointer ${
          autoplay ? "text-primary font-bold" : "text-muted hover:text-foreground"
        }`}
        title="Toggle music autoplay on load"
      >
        AP: {autoplay ? "ON" : "OFF"}
      </button>

      {/* Mute button */}
      <button
        onClick={toggleMute}
        className="text-muted hover:text-primary transition-colors cursor-pointer flex items-center justify-center"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isMuted ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          )}
        </svg>
      </button>
    </div>
  );
}

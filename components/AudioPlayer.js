"use client";

import { useEffect, useRef, useState } from "react";

export default function AudioPlayer() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const analyserInitialized = useRef(false);

  const initAnalyser = () => {
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
      console.log("Web Audio API not allowed or failed:", e);
    }
  };

  const resumeContext = () => {
    if (window.portfolioAudioContext && window.portfolioAudioContext.state === "suspended") {
      window.portfolioAudioContext.resume();
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;

    initAnalyser();
    resumeContext();

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(err => {
          console.log("Audio play blocked by browser:", err);
        });
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Browser Autoplay Policy Bypass & Event Bindings
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Set moderate comfortable volume
    audio.volume = 0.45;

    const attemptPlay = () => {
      initAnalyser();
      resumeContext();
      audio.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.log("Autoplay deferred: waiting for document interaction.", err);
        });
    };

    // Try autoplaying immediately (might succeed on reload if already interacted)
    attemptPlay();

    // Custom Event Listener from IntroOverlay
    const handleEventPlay = () => {
      initAnalyser();
      resumeContext();
      if (audio && audio.paused) {
        audio.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((e) => console.log("Failed to play on event:", e));
      }
    };

    window.addEventListener("play-portfolio-audio", handleEventPlay);

    // Fallback trigger: play on first user scroll, touch, or click
    const triggerPlayOnInteraction = () => {
      initAnalyser();
      resumeContext();
      if (audio && audio.paused) {
        audio.play()
          .then(() => {
            setIsPlaying(true);
            removeInteractionListeners();
          })
          .catch((e) => console.log("Failed playback on interaction:", e));
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
  }, []);

  return (
    <>
      {/* Upper-Side Glowing Visualizer Bar */}
      <div 
        className={`fixed top-0 left-0 w-full h-[3px] z-[200] bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] animate-gradient-shift shadow-[0_1px_15px_rgba(215,186,255,0.4)] transition-opacity duration-700 pointer-events-none ${
          isPlaying ? "opacity-100" : "opacity-0"
        }`}
        style={{
          boxShadow: isPlaying ? "0 1px 18px var(--primary-color)" : "none"
        }}
      />

      <div className="flex items-center gap-3 bg-white/[0.03] border border-white/10 rounded-full px-3 py-1.5 backdrop-blur-md shadow-lg transition-all duration-300 hover:border-primary/20">
        <audio ref={audioRef} src="/song.mp3" loop crossOrigin="anonymous" />

        {/* Equalizer Wave Visualizer */}
        <div 
          onClick={togglePlay} 
          className="flex items-end gap-[3px] h-3 w-5 cursor-pointer relative justify-center"
          title={isPlaying ? "Click to Pause" : "Click to Play"}
        >
          {[
            { delay: "0.1s", dur: "0.6s" },
            { delay: "0.3s", dur: "0.8s" },
            { delay: "0.0s", dur: "0.5s" },
            { delay: "0.4s", dur: "0.7s" },
            { delay: "0.2s", dur: "0.9s" }
          ].map((bar, idx) => (
            <span
              key={idx}
              className={`w-[2.5px] bg-primary rounded-full origin-bottom transition-all duration-300 ${
                isPlaying ? "animate-pulse" : "h-[3px]"
              }`}
              style={{
                animationDelay: isPlaying ? bar.delay : "0s",
                animationDuration: isPlaying ? bar.dur : "0s",
                height: isPlaying ? "100%" : "3px",
              }}
            />
          ))}
        </div>

        {/* Control Label */}
        <button
          onClick={togglePlay}
          className="text-[10px] uppercase font-ui tracking-wider text-on-surface-variant hover:text-primary transition-colors cursor-pointer select-none"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>

        {/* Divider */}
        <span className="w-px h-2.5 bg-white/10" />

        {/* Speaker Icon / Mute Button */}
        <button
          onClick={toggleMute}
          className="text-on-surface-variant/70 hover:text-primary transition-colors cursor-pointer flex items-center justify-center"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          )}
        </button>
      </div>
    </>
  );
}

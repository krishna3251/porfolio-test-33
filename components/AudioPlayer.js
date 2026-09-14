"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export default function AudioPlayer() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.35);
  const [autoplay, setAutoplay] = useState(true);
  const [progress, setProgress] = useState(0);
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
      console.log("Audio API connection status:", e);
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
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    const nextMuted = !isMuted;
    audioRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
    localStorage.setItem("krishna-audio-muted", String(nextMuted));
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
    localStorage.setItem("krishna-audio-volume", String(val));
  };

  const toggleAutoplay = () => {
    const nextVal = !autoplay;
    setAutoplay(nextVal);
    localStorage.setItem("portfolio-autoplay-music", String(nextVal));
  };

  // Restore saved audio settings
  useEffect(() => {
    const savedAP = localStorage.getItem("portfolio-autoplay-music");
    if (savedAP !== null) setAutoplay(savedAP === "true");

    const savedVol = localStorage.getItem("krishna-audio-volume");
    if (savedVol !== null) setVolume(parseFloat(savedVol));

    const savedMuted = localStorage.getItem("krishna-audio-muted");
    if (savedMuted !== null) setIsMuted(savedMuted === "true");
  }, []);

  // Time update for progress
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    return () => audio.removeEventListener("timeupdate", handleTimeUpdate);
  }, []);

  // Autoplay attempt + graceful first-interaction fallback
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    audio.muted = isMuted;

    // Listen for custom play events (e.g. from hero or overlay)
    const handleEventPlay = () => {
      initAnalyser();
      if (audio && audio.paused) {
        audio
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
      }
    };
    window.addEventListener("play-portfolio-audio", handleEventPlay);

    // First interaction trigger
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
        audio
          .play()
          .then(() => {
            setIsPlaying(true);
            removeInteractionListeners();
          })
          .catch(() => {});
      } else {
        removeInteractionListeners();
      }
    };

    const removeInteractionListeners = () => {
      window.removeEventListener("click", triggerPlayOnInteraction);
      window.removeEventListener("scroll", triggerPlayOnInteraction);
      window.removeEventListener("touchstart", triggerPlayOnInteraction);
    };

    window.addEventListener("click", triggerPlayOnInteraction, { passive: true });
    window.addEventListener("scroll", triggerPlayOnInteraction, { passive: true });
    window.addEventListener("touchstart", triggerPlayOnInteraction, { passive: true });

    return () => {
      removeInteractionListeners();
      window.removeEventListener("play-portfolio-audio", handleEventPlay);
    };
  }, [initAnalyser, volume, isMuted]);

  return (
    <div className="flex items-center gap-3 bg-surface/70 border border-foreground/10 backdrop-blur-md rounded-full px-3 py-1.5 shadow-sm transition-all duration-300 hover:border-primary/30">
      <audio ref={audioRef} src="/song.mp3" loop crossOrigin="anonymous" preload="metadata" />

      {/* Rotating Vinyl / Artwork Micro Badge */}
      <button
        onClick={togglePlay}
        className={`w-6 h-6 rounded-full overflow-hidden border border-foreground/15 flex items-center justify-center shrink-0 cursor-pointer relative ${
          isPlaying ? "animate-spin" : ""
        }`}
        style={{ animationDuration: "6s" }}
        title={isPlaying ? "Pause background track" : "Play background track"}
        aria-label={isPlaying ? "Pause music" : "Play music"}
      >
        <img
          src="/neverness_showcase.png"
          alt="Track Artwork"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
        </div>
      </button>

      {/* Track Title & Playback State */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="font-sans text-[10px] font-semibold text-foreground/90 max-w-[110px] truncate">
            i (Cover)
          </span>
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isPlaying ? "bg-primary animate-pulse" : "bg-muted"
            }`}
          />
        </div>
        <span className="mono-metadata text-[6.5px] text-muted tracking-wider">
          {isPlaying ? "PLAYING" : "PAUSED"}
        </span>
      </div>

      {/* Visualizer Waveform Bars */}
      <div
        onClick={togglePlay}
        className="flex items-end gap-[2px] h-3 w-4 cursor-pointer justify-center ml-1"
        title="Play / Pause Audio"
      >
        {[0, 1, 2, 3].map((idx) => (
          <span
            key={idx}
            className={`w-[1.5px] bg-primary rounded-full transition-all duration-200 ${
              isPlaying ? "animate-pulse" : "h-[2px]"
            }`}
            style={{
              animationDelay: isPlaying ? `${idx * 0.15}s` : "0s",
              animationDuration: isPlaying ? "0.6s" : "0s",
              height: isPlaying ? `${40 + (idx % 3) * 30}%` : "2px",
            }}
          />
        ))}
      </div>

      {/* Play / Pause Toggle Button */}
      <button
        onClick={togglePlay}
        className="mono-metadata text-[8px] font-bold text-muted hover:text-primary transition-colors cursor-pointer px-1"
      >
        {isPlaying ? "PAUSE" : "PLAY"}
      </button>

      {/* Vertical divider */}
      <span className="w-px h-3 bg-foreground/10" />

      {/* Mute Button */}
      <button
        onClick={toggleMute}
        className="text-muted hover:text-primary transition-colors cursor-pointer flex items-center justify-center p-0.5"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
            />
          </svg>
        ) : (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            />
          </svg>
        )}
      </button>
    </div>
  );
}

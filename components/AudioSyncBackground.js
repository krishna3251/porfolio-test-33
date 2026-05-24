"use client";

import { useEffect, useRef } from "react";

export default function AudioSyncBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Particle class
    class SnowParticle {
      constructor(side) {
        this.side = side; // 0: top, 1: bottom, 2: left, 3: right
        this.reset();
      }

      reset() {
        this.opacity = Math.random() * 0.45 + 0.15;
        this.size = Math.random() * 2 + 1;
        this.time = Math.random() * 100;
        
        // Spawn coordinates concentrated near respective borders
        if (this.side === 0) { // top border
          this.x = Math.random() * width;
          this.y = -Math.random() * 15;
          this.vx = (Math.random() - 0.5) * 0.5;
          this.vy = Math.random() * 0.5 + 0.25;
        } else if (this.side === 1) { // bottom border
          this.x = Math.random() * width;
          this.y = height + Math.random() * 15;
          this.vx = (Math.random() - 0.5) * 0.5;
          this.vy = -(Math.random() * 0.5 + 0.25);
        } else if (this.side === 2) { // left border
          this.x = -Math.random() * 15;
          this.y = Math.random() * height;
          this.vx = Math.random() * 0.5 + 0.25;
          this.vy = (Math.random() - 0.5) * 0.5;
        } else { // right border
          this.x = width + Math.random() * 15;
          this.y = Math.random() * height;
          this.vx = -(Math.random() * 0.5 + 0.25);
          this.vy = (Math.random() - 0.5) * 0.5;
        }
      }

      update(intensity) {
        // Velocities scale up with music intensity
        const speedScale = 1 + intensity * 0.035;
        this.x += this.vx * speedScale;
        this.y += this.vy * speedScale;
        
        // Sway drift
        this.time += 0.025;
        this.x += Math.sin(this.time) * 0.2;
        this.y += Math.cos(this.time) * 0.2;

        // Reset if drifted too far inside or out
        if (
          this.x < -40 || 
          this.x > width + 40 || 
          this.y < -40 || 
          this.y > height + 40
        ) {
          this.reset();
        }
      }

      draw(intensity) {
        ctx.beginPath();
        // Particle size expands slightly on beats
        ctx.arc(this.x, this.y, this.size * (1 + intensity * 0.012), 0, Math.PI * 2);
        const alpha = Math.min(1, this.opacity * (1 + intensity * 0.03));
        
        // Swatch colors alternating
        ctx.fillStyle = this.side % 2 === 0 
          ? `rgba(215, 186, 255, ${alpha})` // Lavender
          : `rgba(247, 177, 227, ${alpha})`; // Pink
        
        if (intensity > 25) {
          ctx.shadowColor = this.side % 2 === 0 ? "rgba(215, 186, 255, 0.6)" : "rgba(247, 177, 227, 0.6)";
          ctx.shadowBlur = intensity * 0.15;
        }
        
        ctx.fill();
        ctx.shadowBlur = 0; // reset shadow
      }
    }

    // Seed particles distributed on all 4 sides
    const particles = [];
    const particlesPerSide = 25; // 100 particles total
    for (let side = 0; side < 4; side++) {
      for (let i = 0; i < particlesPerSide; i++) {
        particles.push(new SnowParticle(side));
      }
    }

    let time = 0;
    const frequencyData = new Uint8Array(32);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Poll Web Audio API analyser
      let intensity = 0;
      if (typeof window !== "undefined" && window.portfolioAnalyser) {
        window.portfolioAnalyser.getByteFrequencyData(frequencyData);
        let sum = 0;
        for (let i = 0; i < frequencyData.length; i++) {
          sum += frequencyData[i];
        }
        intensity = sum / frequencyData.length; // 0 to 255
      }

      time += 0.025;

      // Draw sine waves running on all 4 sides of the viewport
      drawBorderWave(0, intensity); // Top wave
      drawBorderWave(1, intensity); // Bottom wave
      drawBorderWave(2, intensity); // Left wave
      drawBorderWave(3, intensity); // Right wave

      // Update and draw snowfall
      particles.forEach((p) => {
        p.update(intensity);
        p.draw(intensity);
      });

      animationId = requestAnimationFrame(render);
    };

    const drawBorderWave = (side, intensity) => {
      // Sine wave configs (amplitude scales with music beats)
      const amp = 3 + intensity * 0.35;
      const waveFreq = 0.012;
      const speed = time * 1.2 + intensity * 0.02;

      ctx.beginPath();
      
      if (side === 0) { // Top Wave
        ctx.moveTo(0, 0);
        for (let x = 0; x <= width; x += 10) {
          const y = amp * Math.sin(x * waveFreq + speed);
          ctx.lineTo(x, y + 4);
        }
        ctx.strokeStyle = `rgba(215, 186, 255, ${0.18 + intensity * 0.004})`;
      } 
      else if (side === 1) { // Bottom Wave
        ctx.moveTo(0, height);
        for (let x = 0; x <= width; x += 10) {
          const y = amp * Math.sin(x * waveFreq - speed);
          ctx.lineTo(x, height - 4 + y);
        }
        ctx.strokeStyle = `rgba(247, 177, 227, ${0.18 + intensity * 0.004})`;
      } 
      else if (side === 2) { // Left Wave
        ctx.moveTo(0, 0);
        for (let y = 0; y <= height; y += 10) {
          const x = amp * Math.sin(y * waveFreq + speed);
          ctx.lineTo(x + 4, y);
        }
        ctx.strokeStyle = `rgba(215, 186, 255, ${0.18 + intensity * 0.004})`;
      } 
      else { // Right Wave
        ctx.moveTo(width, 0);
        for (let y = 0; y <= height; y += 10) {
          const x = amp * Math.sin(y * waveFreq - speed);
          ctx.lineTo(width - 4 + x, y);
        }
        ctx.strokeStyle = `rgba(247, 177, 227, ${0.18 + intensity * 0.004})`;
      }

      ctx.lineWidth = 1.5 + intensity * 0.02;
      
      if (intensity > 20) {
        ctx.shadowColor = side === 1 || side === 3 ? "rgba(247, 177, 227, 0.5)" : "rgba(215, 186, 255, 0.5)";
        ctx.shadowBlur = intensity * 0.15;
      }
      
      ctx.stroke();
      ctx.shadowBlur = 0; // reset shadow
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-[90] bg-transparent"
    />
  );
}

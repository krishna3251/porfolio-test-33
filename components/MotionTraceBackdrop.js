"use client";

import { useEffect, useRef } from "react";

export default function MotionTraceBackdrop() {
  const canvasRef = useRef(null);
  const pointerRef = useRef({ x: 0, y: 0, tx: 0, ty: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrame;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let time = 0;

    const traces = Array.from({ length: 32 }, (_, index) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      length: 90 + Math.random() * 180,
      speed: 0.12 + Math.random() * 0.42,
      drift: Math.random() * Math.PI * 2,
      alpha: 0.02 + Math.random() * 0.045,
      hue: index % 2 === 0 ? "215, 186, 255" : "247, 177, 227",
    }));

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const handlePointerMove = (event) => {
      pointerRef.current.tx = event.clientX;
      pointerRef.current.ty = event.clientY;
      pointerRef.current.active = true;
    };

    const drawTraceLine = (trace) => {
      const pulse = Math.sin(time * 0.018 + trace.drift) * 0.5 + 0.5;
      const tilt = -0.42 + Math.sin(trace.drift) * 0.14;
      const x2 = trace.x + trace.length;
      const y2 = trace.y + trace.length * tilt;

      const gradient = ctx.createLinearGradient(trace.x, trace.y, x2, y2);
      gradient.addColorStop(0, `rgba(${trace.hue}, 0)`);
      gradient.addColorStop(0.45, `rgba(${trace.hue}, ${trace.alpha + pulse * 0.03})`);
      gradient.addColorStop(1, `rgba(${trace.hue}, 0)`);

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(trace.x, trace.y);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      trace.x += trace.speed;
      trace.y -= trace.speed * 0.28;

      if (trace.x > width + trace.length || trace.y < -trace.length) {
        trace.x = -trace.length;
        trace.y = height * (0.15 + Math.random() * 0.95);
      }
    };

    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      const pointer = pointerRef.current;
      pointer.x += (pointer.tx - pointer.x) * 0.08;
      pointer.y += (pointer.ty - pointer.y) * 0.08;

      ctx.globalCompositeOperation = "lighter";
      traces.forEach(drawTraceLine);

      if (pointer.active) {
        for (let i = 0; i < 5; i++) {
          const radius = 42 + i * 28 + Math.sin(time * 0.04 + i) * 8;
          ctx.strokeStyle = `rgba(215, 186, 255, ${0.055 - i * 0.008})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.ellipse(pointer.x, pointer.y, radius * 1.4, radius * 0.42, -0.35, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      ctx.globalCompositeOperation = "source-over";
      animationFrame = requestAnimationFrame(render);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    render();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[1] pointer-events-none opacity-80 mix-blend-screen"
      aria-hidden="true"
    />
  );
}

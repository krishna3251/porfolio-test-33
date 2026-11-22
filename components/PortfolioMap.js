"use client";

import Image from "@/components/PortfolioImage";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { mapLocations } from "@/lib/portfolio-map";
import { drawTerrain, initialCamera, makeTerrain } from "@/lib/portfolio-terrain";

const fallbackCoordinates = [[23, 36], [55, 25], [76, 46], [44, 68]];
const minZoom = 0.86;
const maxZoom = 1.30;
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export default function PortfolioMap({ portrait, aboutCopy }) {
  const canvas = useRef(null);
  const stage = useRef(null);
  const compass = useRef(null);
  const pins = useRef([]);
  const controls = useRef(null);
  const selected = useRef(mapLocations[0].id);
  const [activeId, setActiveId] = useState(mapLocations[0].id);
  const active = mapLocations.find((place) => place.id === activeId);
  const preview = activeId === "about" ? portrait : null;

  useEffect(() => {
    const surface = stage.current;
    const output = canvas.current;
    const context = output?.getContext("2d");
    if (!surface || !context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const terrain = makeTerrain();
    const position = { ...initialCamera };
    const target = { ...initialCamera };
    let width = 0;
    let height = 0;
    let frame = 0;
    let dragged = null;
    let lastTime = 0;

    function render(time) {
      frame = 0;
      if (!width || !height) return;
      const elapsed = lastTime ? Math.min(64, time - lastTime) : 16;
      lastTime = time;
      const step = reducedMotion.matches ? 1 : 1 - Math.exp(-elapsed / 88);
      let animating = false;
      for (const field of ["yaw", "tilt", "zoom"]) {
        const gap = target[field] - position[field];
        if (Math.abs(gap) <= 0.0007) position[field] = target[field];
        else {
          position[field] += gap * step;
          animating ||= step < 1;
        }
      }
      const points = drawTerrain(context, terrain, position, width, height, selected.current);
      const heading = Math.atan2(Math.sin(position.yaw), Math.cos(position.yaw) * position.tilt);
      if (compass.current) compass.current.style.transform = `rotate(${heading}rad)`;
      points.forEach(([x, y], index) => {
        const pin = pins.current[index];
        if (!pin) return;
        pin.style.left = `${clamp(x, 37, width - 37)}px`;
        pin.style.top = `${clamp(y, 51, height - 28)}px`;
      });
      if (animating) frame = requestAnimationFrame(render);
      else lastTime = 0;
    }

    function redraw() {
      if (!frame) frame = requestAnimationFrame(render);
    }

    function resize() {
      width = surface.clientWidth;
      height = surface.clientHeight;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.7);
      output.width = Math.round(width * pixelRatio);
      output.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      redraw();
    }

    function rotate(yaw, tilt) {
      target.yaw = clamp(yaw, initialCamera.yaw - 0.62, initialCamera.yaw + 0.62);
      target.tilt = clamp(tilt, 0.43, 0.69);
      redraw();
    }

    function down(event) {
      if (event.button !== 0 || dragged || event.target.closest("button")) return;
      dragged = { pointer: event.pointerId, x: event.clientX, y: event.clientY, yaw: target.yaw, tilt: target.tilt };
      surface.setPointerCapture(event.pointerId);
      surface.dataset.dragging = "true";
    }

    function move(event) {
      if (dragged?.pointer !== event.pointerId) return;
      rotate(dragged.yaw + (event.clientX - dragged.x) / 250,
        dragged.tilt - (event.clientY - dragged.y) / 450);
    }

    function up(event) {
      if (dragged?.pointer !== event.pointerId) return;
      dragged = null;
      delete surface.dataset.dragging;
    }

    controls.current = {
      redraw,
      zoom(amount) {
        target.zoom = clamp(target.zoom + amount, minZoom, maxZoom);
        redraw();
      },
      reset() {
        Object.assign(target, initialCamera);
        redraw();
      },
    };

    function keydown(event) {
      if (event.target !== surface || event.altKey || event.ctrlKey || event.metaKey) return;
      const angle = { ArrowLeft: -0.15, ArrowRight: 0.15, ArrowUp: 0, ArrowDown: 0 }[event.key];
      if (angle !== undefined) {
        event.preventDefault();
        const tilt = event.key === "ArrowUp" ? 0.04 : event.key === "ArrowDown" ? -0.04 : 0;
        rotate(target.yaw + angle, target.tilt + tilt);
      } else if (event.key === "Home") {
        event.preventDefault();
        controls.current.reset();
      }
    }

    surface.dataset.interactive = "true";
    const observer = new ResizeObserver(resize);
    observer.observe(surface);
    surface.addEventListener("pointerdown", down);
    surface.addEventListener("pointermove", move);
    surface.addEventListener("lostpointercapture", up);
    surface.addEventListener("keydown", keydown);
    resize();

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      surface.removeEventListener("pointerdown", down);
      surface.removeEventListener("pointermove", move);
      surface.removeEventListener("lostpointercapture", up);
      surface.removeEventListener("keydown", keydown);
      delete surface.dataset.interactive;
      delete surface.dataset.dragging;
      controls.current = null;
    };
  }, []);

  function select(place) {
    selected.current = place.id;
    setActiveId(place.id);
    controls.current?.redraw();
  }

  return (
    <div className="atlas-map" id="map" tabIndex={-1}>
      <div className="atlas-map-header">
        <span><i aria-hidden="true" /> Portfolio map</span>
        <div className="atlas-map-tools" aria-label="Map controls">
          <button type="button" onClick={() => controls.current?.zoom(-0.12)} aria-label="Zoom out" title="Zoom out">−</button>
          <button type="button" onClick={() => controls.current?.zoom(0.12)} aria-label="Zoom in" title="Zoom in">+</button>
          <button type="button" onClick={() => controls.current?.reset()} aria-label="Reset map view" title="Reset map view">↺</button>
        </div>
      </div>
      <div ref={stage} className="atlas-map-stage" tabIndex={0} role="group" aria-label="3D terrain map" aria-describedby="map-help">
        <canvas ref={canvas} aria-hidden="true" />
        <div className="atlas-map-compass" aria-hidden="true"><span>N</span><i ref={compass} /></div>
        {mapLocations.map((place, index) => (
          <button key={place.id} type="button" ref={(element) => { pins.current[index] = element; }}
            className="atlas-map-pin" aria-pressed={activeId === place.id}
            onClick={() => select(place)}
            style={{ "--pin": place.color, left: `${fallbackCoordinates[index][0]}%`, top: `${fallbackCoordinates[index][1]}%` }}>
            <span>{place.label}</span><i aria-hidden="true" />
          </button>
        ))}
        <span className="atlas-map-help" id="map-help">
          <span className="atlas-map-help-pointer">Drag or use arrow keys to rotate</span>
          <span className="atlas-map-help-touch">Drag to rotate · Tap a pin</span>
        </span>
      </div>
      <div className="atlas-map-destination" style={{ "--pin": active.color }}>
        <div className="atlas-map-preview" aria-hidden="true">
          {preview?.src ? <Image src={preview.src} fill alt="" sizes="100px" quality={72}
            style={preview.style} unoptimized={preview.unoptimized} /> : <span className="atlas-map-preview-symbol">{activeId === "projects" ? "{ }" : activeId === "visuals" ? "▧" : "◉"}</span>}
        </div>
        <div className="atlas-map-destination-copy" aria-live="polite" aria-atomic="true">
          <strong>{active.title}</strong>
          <p>{activeId === "about" && aboutCopy ? aboutCopy : active.description}</p>
        </div>
        <Link className="atlas-button atlas-button-small" href={active.href}>{active.action}</Link>
      </div>
    </div>
  );
}

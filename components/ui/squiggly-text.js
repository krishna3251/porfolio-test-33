"use client";

import React, { useEffect, useId, useMemo, useState } from "react";

export default function SquigglyText({
  children,
  steps = 6,
  stepDuration = 80,
  scale = [4, 6],
  baseFrequency = 0.018,
  numOctaves = 3,
  className = "",
  style,
  as = "span",
}) {
  const reactId = useId();
  const safeId = reactId.replace(/[:_]/g, "");
  const filterId = (i) => `squiggly-${safeId}-${i}`;

  const filters = useMemo(
    () => Array.from({ length: steps }, (_, i) => `url(#${filterId(i)})`),
    [steps, safeId]
  );

  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (steps <= 1) return;
    const timer = window.setInterval(() => {
      setFrame((current) => (current + 1) % steps);
    }, stepDuration);

    return () => window.clearInterval(timer);
  }, [steps, stepDuration]);

  const scaleAt = (i) =>
    Array.isArray(scale) ? scale[i % scale.length] : scale;

  const Wrapper = as === "div" ? "div" : "span";

  return (
    <Wrapper
      style={{
        filter: filters[frame],
        WebkitFilter: filters[frame],
        ...style,
      }}
      className={`inline-block squiggly-text ${className}`}
    >
      <svg
        aria-hidden="true"
        width="0"
        height="0"
        viewBox="0 0 1 1"
        className="pointer-events-none absolute overflow-hidden"
        style={{ position: "absolute", width: 0, height: 0 }}
      >
        <defs>
          {Array.from({ length: steps }).map((_, i) => (
            <filter
              id={filterId(i)}
              key={i}
              x="-20%"
              y="-35%"
              width="140%"
              height="170%"
              filterUnits="objectBoundingBox"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency={baseFrequency}
                numOctaves={numOctaves}
                seed={i * 17 + 3}
                result="noise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale={scaleAt(i)}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          ))}
        </defs>
      </svg>
      {children}
    </Wrapper>
  );
}

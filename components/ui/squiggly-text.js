"use client";

import React, { useId, useMemo } from "react";
import { motion, useTime, useTransform } from "framer-motion";

export default function SquigglyText({
  children,
  steps = 5,
  stepDuration = 90,
  scale = [3, 5],
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

  const time = useTime();
  const filter = useTransform(
    time,
    (t) => filters[Math.floor(t / stepDuration) % filters.length]
  );

  const scaleAt = (i) => (Array.isArray(scale) ? scale[i % scale.length] : scale);
  const Wrapper = as === "div" ? motion.div : motion.span;

  return (
    <Wrapper
      style={{ filter, ...style }}
      className={`inline-block squiggly-text ${className}`}
    >
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute h-0 w-0 overflow-hidden"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {Array.from({ length: steps }).map((_, i) => (
            <filter id={filterId(i)} key={i}>
              <feTurbulence
                baseFrequency={baseFrequency}
                numOctaves={numOctaves}
                result="noise"
                seed={i}
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale={scaleAt(i)}
              />
            </filter>
          ))}
        </defs>
      </svg>
      {children}
    </Wrapper>
  );
}

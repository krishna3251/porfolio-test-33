"use client";

// Native scrolling keeps anchors, touch and history responsive. ScrollTrigger
// observes it directly instead of competing with a second smoothing loop.
export default function SmoothScroll({ children }) {
  return children;
}

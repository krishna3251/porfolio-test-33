"use client";

// A restrained hover response; avoids React rerenders on every mouse movement.
export default function WobbleImage({ children, className = "" }) {
  return <div className={`wobble-image ${className}`}>
    <div className="wobble-image-inner w-full h-full">{children}</div>
  </div>;
}

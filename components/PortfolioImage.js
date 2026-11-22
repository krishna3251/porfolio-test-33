"use client";

import Image from "next/image";
import { useState } from "react";

// The gallery can fall back to the original when an image optimizer or CDN is unavailable.
export default function PortfolioImage({ src, alt = "", unoptimized = false, ...props }) {
  const [failure, setFailure] = useState(null);
  const currentFailure = failure?.src === src ? failure : null;
  if (currentFailure?.exhausted) return null;

  const original = unoptimized || Boolean(currentFailure);
  return <Image {...props} src={src} alt={alt} unoptimized={original}
    onError={() => setFailure({ src, exhausted: original })} />;
}

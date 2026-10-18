"use client";

import { motion, useReducedMotion } from "framer-motion";

// A restrained hover response; avoids React rerenders on every mouse movement.
export default function WobbleImage({ children, className = "" }) {
  const reduce = useReducedMotion();
  return <motion.div className={`wobble-image ${className}`} whileHover={reduce?undefined:{scale:1.015}} transition={{duration:.35,ease:[.16,1,.3,1]}}>
    <div className="wobble-image-inner w-full h-full">{children}</div>
  </motion.div>;
}

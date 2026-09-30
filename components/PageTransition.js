"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function PageTransition({ children }) {
  const pathname = usePathname();

  if (pathname.startsWith("/thumbnails/view")) {
    return <>{children}</>;
  }

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="w-full flex-grow flex flex-col justify-between"
    >
      {children}
    </motion.div>
  );
}

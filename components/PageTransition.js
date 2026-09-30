"use client";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function PageTransition({children}){
  const pathname=usePathname();
  return <motion.div
    key={pathname}
    initial={{opacity:0,y:10}}
    animate={{opacity:1,y:0}}
    transition={{duration:.42,ease:[.16,1,.3,1]}}
    className="w-full"
  >{children}</motion.div>;
}
"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const themes=[
  {
    name:"Signal Blue / Red",
    label:"Electric blue + signal red",
    dotColor:"bg-[#3b82f6]",
    vars:{
      "--bg":"#070a12","--surface":"#0d1220","--fg":"#f5f7fb","--muted":"#8c96aa",
      "--border":"rgba(245,247,251,.14)","--accent":"#3b82f6","--accent-hot":"#ff3b4d",
    },
  },
  {
    name:"Midnight Blue",
    label:"Deep blue + cool white",
    dotColor:"bg-[#4da3ff]",
    vars:{
      "--bg":"#050914","--surface":"#0b1220","--fg":"#f3f7ff","--muted":"#8290a8",
      "--border":"rgba(205,225,255,.14)","--accent":"#4da3ff","--accent-hot":"#ff5363",
    },
  },
  {
    name:"Redline",
    label:"Ink black + red signal",
    dotColor:"bg-[#ff3b4d]",
    vars:{
      "--bg":"#0b080b","--surface":"#151015","--fg":"#faf5f7","--muted":"#9f8e95",
      "--border":"rgba(255,235,240,.13)","--accent":"#ff4b5f","--accent-hot":"#4d9bff",
    },
  },
];

export default function ThemeSwitcher(){
  const [isOpen,setIsOpen]=useState(false);
  const [activeTheme,setActiveTheme]=useState(themes[0].name);

  const applyTheme=useCallback((theme)=>{
    setActiveTheme(theme.name);
    localStorage.setItem("krishna-portfolio-theme-v4",theme.name);
    const root=document.documentElement;
    Object.entries(theme.vars).forEach(([key,val])=>root.style.setProperty(key,val));
  },[]);

  useEffect(()=>{
    const saved=localStorage.getItem("krishna-portfolio-theme-v4");
    const selected=themes.find((t)=>t.name===saved)||themes[0];
    applyTheme(selected);
  },[applyTheme]);

  const current=themes.find((t)=>t.name===activeTheme)||themes[0];

  return <div className="relative">
    <button onClick={()=>setIsOpen(!isOpen)} className="mono-metadata text-[9.5px] text-muted hover:text-foreground transition-colors flex items-center gap-2 cursor-pointer py-1" aria-label="Change theme colors">
      <span className={"w-2.5 h-2.5 rounded-full "+current.dotColor}/>
      <span className="hidden sm:inline font-bold">THEME</span>
    </button>
    <AnimatePresence>
      {isOpen&&<>
        <div className="fixed inset-0 z-40" onClick={()=>setIsOpen(false)}/>
        <motion.div initial={{opacity:0,y:8,scale:.96}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:8,scale:.96}} transition={{duration:.2}} className="absolute right-0 mt-3 p-3 glass-panel z-50 flex flex-col gap-2 min-w-[220px]">
          <div className="px-3 py-1.5 border-b border-foreground/10"><span className="mono-metadata text-[7.5px] text-muted tracking-widest block font-bold">SELECT VISUAL PALETTE</span></div>
          <div className="flex flex-col gap-1">
            {themes.map((t)=><button key={t.name} onClick={()=>{applyTheme(t);setIsOpen(false)}} className={"flex items-center gap-3 w-full text-left px-3 py-3 transition-all duration-200 cursor-pointer "+(activeTheme===t.name?"bg-white/10 text-foreground font-bold":"text-muted hover:text-foreground hover:bg-white/5")}>
              <span className={"w-2.5 h-2.5 rounded-full shrink-0 "+t.dotColor}/>
              <div className="flex flex-col"><span className="mono-metadata text-[9px] tracking-wider">{t.name}</span><span className="font-sans text-[8px] text-muted">{t.label}</span></div>
            </button>)}
          </div>
        </motion.div>
      </>}
    </AnimatePresence>
  </div>;
}

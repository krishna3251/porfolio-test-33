"use client";
import AudioPlayer from "@/components/AudioPlayer"; import ThemeSwitcher from "@/components/ThemeSwitcher";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const links = [
    ["Work","work"],["About","about"],["Systems","projects"],["Contact","contact"]
  ];
  const go = (id) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] bg-[#09090b]/90 border-b border-white/20">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 h-[72px] flex items-center justify-between">
        <Link href="/" className="serif-display text-2xl font-semibold tracking-tight">
          Krishna<span className="text-primary">.</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {links.map(([label,id]) => (
            <button key={id} onClick={()=>go(id)} className="text-[12px] uppercase tracking-[.16em] text-muted hover:text-foreground transition-colors">
              {label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-3"><div className="hidden lg:block"><AudioPlayer/></div><ThemeSwitcher/>
          <a href="https://github.com/krishna3251" target="_blank" rel="noreferrer" className="hidden sm:block text-[12px] uppercase tracking-[.16em] hover:text-primary transition-colors">GitHub ↗</a>
          <button onClick={()=>setOpen(!open)} className="md:hidden text-xs uppercase tracking-[.16em]">{open ? "Close" : "Menu"}</button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-white/10 bg-[#0d0d0c] px-5 py-6 flex flex-col gap-5">
          {links.map(([label,id]) => <button key={id} onClick={()=>go(id)} className="text-left text-sm uppercase tracking-[.16em]">{label}</button>)}
        </div>
      )}
    </header>
  );
}

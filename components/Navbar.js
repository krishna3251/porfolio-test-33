"use client";

import AudioPlayer from "@/components/AudioPlayer";
import { useState } from "react";
import Link from "next/link";

const navLinks=[
  ["Home","/"],
  ["Thumbnails","/thumbnails"],
  ["Projects","/projects"],
];

export default function Navbar(){
  const [open,setOpen]=useState(false);
  return <header className="fixed top-0 left-0 right-0 z-[100] px-3 md:px-5 pt-3">
    <div className="max-w-[1480px] mx-auto glass-nav h-[66px] px-4 md:px-6 flex items-center justify-between">
      <Link href="/" className="font-mono text-lg md:text-xl font-black tracking-[-.06em]">
        KRISHNA<span className="text-hot">.</span>
      </Link>

      <nav className="hidden md:flex items-center gap-1 p-1 bg-black/[.035] border border-black/[.06]">
        {navLinks.map(([label,href])=><Link key={href} href={href} className="nav-pill">{label}</Link>)}
      </nav>

      <div className="flex items-center gap-3">
        <div className="hidden lg:block"><AudioPlayer/></div>
        <a href="https://github.com/krishna3251" target="_blank" rel="noreferrer" className="hidden sm:block nav-link">GitHub ↗</a>
        <button onClick={()=>setOpen(!open)} className="md:hidden nav-link">{open?"Close":"Menu"}</button>
      </div>
    </div>

    {open&&<div className="md:hidden max-w-[1480px] mx-auto mt-2 glass-nav p-2 flex flex-col gap-1">
      {navLinks.map(([label,href])=><Link key={href} href={href} onClick={()=>setOpen(false)} className="nav-mobile">{label}</Link>)}
      <a href="https://github.com/krishna3251" target="_blank" rel="noreferrer" className="nav-mobile">GitHub ↗</a>
    </div>}
  </header>;
}
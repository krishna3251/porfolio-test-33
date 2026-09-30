"use client";

import AudioPlayer from "@/components/AudioPlayer";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  ["Home", "/"],
  ["Thumbnails", "/thumbnails"],
  ["Projects", "/projects"],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  if (pathname.startsWith("/thumbnails/view")) return null;

  return (
    <header className="site-navbar fixed top-0 left-0 right-0 z-[100] px-3 sm:px-4 md:px-5 pt-3">
      <div className="max-w-[1480px] mx-auto glass-nav h-[62px] md:h-[66px] px-3 sm:px-4 md:px-6 flex items-center justify-between gap-3">
        <Link href="/" className="font-mono text-lg md:text-xl font-black tracking-[-.06em] shrink-0">
          KRISHNA<span className="text-hot">.</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 p-1 bg-black/[.035] border border-black/[.06]">
          {navLinks.map(([label, href]) => (
            <Link key={href} href={href} className="nav-pill">{label}</Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="hidden xl:block"><AudioPlayer /></div>
          <a href="https://github.com/krishna3251" target="_blank" rel="noreferrer" className="hidden sm:block nav-link">GitHub ↗</a>
          <button
            onClick={() => setOpen((value) => !value)}
            className="md:hidden nav-link"
            aria-expanded={open}
            aria-controls="mobile-navigation"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-navigation" className="md:hidden max-w-[1480px] mx-auto mt-2 glass-nav p-2 flex flex-col gap-1">
          {navLinks.map(([label, href]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)} className="nav-mobile">{label}</Link>
          ))}
          <a href="https://github.com/krishna3251" target="_blank" rel="noreferrer" className="nav-mobile">GitHub ↗</a>
        </div>
      )}
    </header>
  );
}

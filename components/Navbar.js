"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links=[["Home","/"],["Thumbnails","/thumbnails"],["Projects","/projects"]];

export default function Navbar(){
  const pathname=usePathname();
  const [open,setOpen]=useState(false);
  if(pathname.startsWith("/thumbnails/view")) return null;

  return <header className="site-header">
    <div className="site-header-inner">
      <Link href="/" className="site-logo" aria-label="Krishna home">KRISHNA<span>.</span></Link>
      <nav className="site-nav" aria-label="Primary navigation">
        {links.map(([label,href])=><Link key={href} href={href} className={pathname===href?"active":""}>{label}</Link>)}
      </nav>
      <div className="site-header-right">
        <a href="https://github.com/krishna3251" target="_blank" rel="noreferrer">GitHub ↗</a>
        <button type="button" className="mobile-menu-button" onClick={()=>setOpen(v=>!v)} aria-expanded={open} aria-controls="mobile-navigation">{open?"Close":"Menu"}</button>
      </div>
    </div>
    {open&&<div id="mobile-navigation" className="mobile-menu">
      {links.map(([label,href])=><Link key={href} href={href} onClick={()=>setOpen(false)}>{label}</Link>)}
      <a href="https://github.com/krishna3251" target="_blank" rel="noreferrer">GitHub ↗</a>
    </div>}
  </header>;
}
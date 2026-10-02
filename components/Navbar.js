"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links=[["Home","/"],["Thumbnails","/thumbnails"],["Projects","/projects"]];

export default function Navbar(){
  const pathname=usePathname();
  const [open,setOpen]=useState(false);
  const [progress,setProgress]=useState(0);
  if(pathname.startsWith("/thumbnails/view")) return null;

  useEffect(()=>{
    const update=()=>{
      const doc=document.documentElement;
      const max=doc.scrollHeight-window.innerHeight;
      setProgress(max>0?Math.min(1,Math.max(0,window.scrollY/max)):0);
    };
    update();
    window.addEventListener("scroll",update,{passive:true});
    window.addEventListener("resize",update);
    return()=>{window.removeEventListener("scroll",update);window.removeEventListener("resize",update);};
  },[]);

  return <header className="site-header">
    <div className="site-header-inner">
      <Link href="/" className="site-logo" aria-label="Krishna home">KRISHNA<span>.</span></Link>
      <nav className="site-nav" aria-label="Primary navigation">
        {links.map(([label,href])=><Link key={href} href={href} className={pathname===href?"active":""}><span>{label}</span></Link>)}
      </nav>
      <div className="site-header-right">
        <span className="nav-status" aria-hidden="true">AVAILABLE / 2026</span>
        <a href="https://github.com/krishna3251" target="_blank" rel="noreferrer">GitHub ↗</a>
        <button type="button" className="mobile-menu-button" onClick={()=>setOpen(v=>!v)} aria-expanded={open} aria-controls="mobile-navigation">{open?"Close":"Menu"}</button>
      </div>
    </div>
    <div className="site-progress" aria-hidden="true"><span style={{transform:`scaleX(${progress})`}} /></div>
    {open&&<div id="mobile-navigation" className="mobile-menu">
      <div className="mobile-menu-meta">NAVIGATION / 2026</div>
      {links.map(([label,href])=><Link key={href} href={href} onClick={()=>setOpen(false)}>{label}<span>↗</span></Link>)}
      <a href="https://github.com/krishna3251" target="_blank" rel="noreferrer">GitHub ↗</a>
    </div>}
  </header>;
}
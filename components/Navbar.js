"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links=[["Home","/"],["Thumbnails","/thumbnails"],["Projects","/projects"]];

export default function Navbar(){
  const pathname=usePathname();
  const [open,setOpen]=useState(false);
  const [progress,setProgress]=useState(0);
  const [theme,setTheme]=useState("obsidian");
  const [themeOpen,setThemeOpen]=useState(false);

  const themes=[
    ["obsidian","Obsidian"],
    ["dark-red","Dark Red"],
    ["black-gold","Black Gold"],
    ["glassmorphia","Glassmorphia"],
    ["maximalism","Maximalism"],
    ["minimalism","Minimalism"]
  ];
  const viewer=pathname.startsWith("/thumbnails/view");

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
  },[pathname]);

  useEffect(()=>{
    setOpen(false);
  },[pathname]);

  useEffect(()=>{
    const saved=window.localStorage.getItem("krishna-theme")||"obsidian";
    setTheme(saved);
    document.documentElement.dataset.theme=saved;
  },[]);

  const changeTheme=(next)=>{
    setTheme(next);
    setThemeOpen(false);
    document.documentElement.dataset.theme=next;
    window.localStorage.setItem("krishna-theme",next);
  };

  if(viewer) return null;

  return <header className="site-header">
    <div className="site-header-inner">
      <Link href="/" className="site-logo" aria-label="Krishna home"><span className="site-logo-prompt">&gt;</span> KRISHNA<span>.</span></Link>
      <nav className="site-nav" aria-label="Primary navigation">
        {links.map(([label,href])=><Link key={href} href={href} className={pathname===href?"active":""} data-cursor={label.toUpperCase()}><span>{label}</span></Link>)}
      </nav>
      <div className="site-header-right">
        <span className="nav-status"><i/> [OK] AVAILABLE / 2026</span>
        <a href="https://github.com/krishna3251" target="_blank" rel="noreferrer" data-cursor="GITHUB">GitHub ↗</a>
        <div className="theme-switcher">
          <button type="button" className="theme-toggle" onClick={()=>setThemeOpen(v=>!v)} aria-expanded={themeOpen} aria-controls="theme-menu" aria-label="Change visual theme">
            <span className="theme-toggle-mark" aria-hidden="true">◈</span>
            <span className="theme-toggle-label">{theme}</span>
          </button>
          {themeOpen&&<div id="theme-menu" className="theme-menu" role="menu">
            <span className="theme-menu-title">VISUAL SYSTEM / THEME</span>
            {themes.map(([id,label])=><button key={id} type="button" role="menuitem" className={theme===id?"active":""} onClick={()=>changeTheme(id)}>
              <i aria-hidden="true"/><span>{label}</span>{theme===id?<b>✓</b>:<b>↗</b>}
            </button>)}
          </div>}
        </div>
        <button type="button" className="mobile-menu-button" onClick={()=>setOpen(v=>!v)} aria-expanded={open} aria-controls="mobile-navigation">{open?"Close":"Menu"}</button>
      </div>
    </div>
    <div className="site-progress" aria-hidden="true"><span style={{transform:`scaleX(${progress})`}} /></div>
    {open&&<div id="mobile-navigation" className="mobile-menu">
      <div className="mobile-menu-meta">NAVIGATION / 2026</div>
      {links.map(([label,href])=><Link key={href} href={href} onClick={()=>setOpen(false)} data-cursor={label.toUpperCase()}>{label}<span>↗</span></Link>)}
      <a href="https://github.com/krishna3251" target="_blank" rel="noreferrer" data-cursor="GITHUB">GitHub ↗</a>
    </div>}
  </header>;
}
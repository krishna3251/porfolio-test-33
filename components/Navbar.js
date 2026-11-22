"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { loadSiteMedia } from "@/hooks/useSiteMedia";
import { getPortfolioTheme, portfolioThemes, themeStorageKey } from "@/lib/portfolio-theme";

const navItems = [
  ["/", "Map"],
  ["/thumbnails", "Thumbnails"],
  ["/projects", "Projects"],
  ["/bots", "Bot Lab"],
  ["/#about", "About"],
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuPath, setMenuPath] = useState(null);
  const [themePath, setThemePath] = useState(null);
  const [theme, setTheme] = useState("atlas");
  const themeVersion = useRef(1);
  const root = useRef(null);
  const menuButton = useRef(null);
  const themeButton = useRef(null);
  const open = menuPath === pathname;
  const themeOpen = themePath === pathname;

  function closeMenus() {
    setMenuPath(null);
    setThemePath(null);
  }

  useEffect(() => {
    let alive = true;
    loadSiteMedia().then((config) => {
      if (!alive) return;
      themeVersion.current = Number(config.version) || 1;
      setTheme(getPortfolioTheme(config));
    });
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (!open && !themeOpen) return;
    const outside = (event) => {
      if (!root.current?.contains(event.target)) closeMenus();
    };
    const keydown = (event) => {
      if (event.key !== "Escape") return;
      closeMenus();
      (themeOpen ? themeButton : menuButton).current?.focus();
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", keydown);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", keydown);
    };
  }, [open, themeOpen]);

  function selectTheme(next) {
    setTheme(next);
    setThemePath(null);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(themeStorageKey, JSON.stringify({ version: themeVersion.current, theme: next }));
    } catch {}
  }

  if (pathname.startsWith("/admin") || pathname === "/thumbnails/view") return null;

  return (
    <header ref={root} className="atlas-site-header">
      <div className="atlas-nav-inner atlas-container">
        <Link className="atlas-brand" href="/" aria-label="Krishna home" onClick={closeMenus}>
          <span className="atlas-brand-mark" aria-hidden="true"><i /></span>
          <span>KRISHNA<span>.</span></span>
        </Link>
        <nav className="atlas-navigation" aria-label="Primary navigation">
          {navItems.map(([href, label]) => <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}>{label}</Link>)}
        </nav>
        <div className="atlas-nav-actions">
          <div className="atlas-theme-choice">
            <button ref={themeButton} type="button" aria-label="Change visual theme" className="atlas-icon-button"
              aria-expanded={themeOpen} aria-controls="atlas-theme-options" onClick={() => {
                setMenuPath(null);
                setThemePath(themeOpen ? null : pathname);
              }}>
              <span className="atlas-theme-icon" aria-hidden="true" />
            </button>
            {themeOpen && <div className="atlas-theme-options" id="atlas-theme-options" aria-label="Visual themes">
              {portfolioThemes.map(([id, label]) => <button key={id} type="button" aria-pressed={theme === id}
                onClick={() => selectTheme(id)}>{label}</button>)}
            </div>}
          </div>
          <Link href="/#contact" className="atlas-button atlas-button-small atlas-nav-contact">Contact</Link>
          <button ref={menuButton} type="button" className="atlas-icon-button atlas-menu-button" aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open} aria-controls="atlas-mobile-menu" onClick={() => {
              setThemePath(null);
              setMenuPath(open ? null : pathname);
            }}>
            <span className="atlas-menu-icon" aria-hidden="true" />
          </button>
        </div>
      </div>
      {open && <nav className="atlas-mobile-menu" id="atlas-mobile-menu" aria-label="Mobile navigation">
        {[...navItems, ["/#contact", "Contact"]].map(([href, label]) => <Link key={href} href={href}
          aria-current={pathname === href ? "page" : undefined} onClick={closeMenus}>{label}</Link>)}
      </nav>}
    </header>
  );
}

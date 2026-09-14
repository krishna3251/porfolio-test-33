"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function ContactFooter() {
  const [copied, setCopied] = useState(false);

  const copyBrief = () => {
    if (typeof navigator === "undefined") return;
    navigator.clipboard
      .writeText("Inquiry: Looking to collaborate with Krishna on Python systems, Discord bot development, or AI visual pipelines.")
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
  };

  const socialLinks = [
    { name: "GitHub", href: "https://github.com/krishna3251" },
    { name: "Discord", href: "https://discord.com" },
    { name: "Repositories", href: "https://github.com/krishna3251?tab=repositories" },
  ];

  return (
    <footer id="contact" className="w-full relative pt-24 pb-16 border-t border-foreground/5 bg-background/50">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        {/* Contact Invitation Card */}
        <div className="bg-surface/50 border border-foreground/10 p-8 md:p-14 rounded-3xl relative overflow-hidden mb-20 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
            <div className="md:col-span-8">
              <div className="mono-metadata text-primary mb-3 tracking-[0.25em] font-bold flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-primary" />
                07 // DIRECT COMMUNICATION
              </div>
              <h3 className="serif-display text-4xl md:text-5xl lg:text-6xl text-foreground font-semibold mb-4 leading-tight">
                Let&apos;s build something <span className="italic text-primary">remarkable.</span>
              </h3>
              <p className="font-sans text-muted text-sm md:text-base max-w-xl leading-relaxed">
                Available for Python application development, specialized Discord bot architectures, API integrations, and creative visual production.
              </p>
            </div>

            <div className="md:col-span-4 flex flex-col gap-4 items-start md:items-end">
              <button
                onClick={copyBrief}
                className="mono-metadata text-[10px] tracking-[0.25em] font-bold bg-primary text-background hover:bg-primary/90 px-8 py-4 rounded-full shadow-[0_0_25px_rgba(215,186,255,0.3)] hover:scale-105 transition-all duration-300 cursor-pointer flex items-center gap-3"
              >
                <span>{copied ? "BRIEF COPIED TO CLIPBOARD ✓" : "COPY PROJECT BRIEF"}</span>
                <span>↗</span>
              </button>
              <span className="mono-metadata text-[8px] text-muted">
                READY TO PASTE IN DISCORD OR EMAIL
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 pt-8 border-t border-foreground/5">
          <div className="flex flex-col gap-1">
            <span className="serif-display text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-primary">
              Krishna Studio<span className="text-primary italic font-sans">.</span>
            </span>
            <span className="mono-metadata text-[8px] text-muted">
              © 2026 EDITION // ALL RIGHTS RESERVED
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-8">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mono-metadata text-[9.5px] text-muted hover:text-primary transition-colors tracking-widest font-bold"
              >
                {link.name} ↗
              </a>
            ))}
          </div>

          <div className="text-left md:text-right">
            <span className="mono-metadata text-[8px] text-muted block">LOCATION / TIMEZONE</span>
            <span className="mono-metadata text-[9px] text-primary font-bold">INDIA // GMT+5:30 (IST)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

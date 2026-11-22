"use client";

import Image from "@/components/PortfolioImage";
import Link from "next/link";
import useSiteMedia from "@/hooks/useSiteMedia";
import { portfolioImage } from "@/lib/portfolio-media";

const projects = [
  {
    id: "lxeus", name: "Lxeus", stack: "Discord / AI",
    description: "A Discord moderation and AI assistant with opt-in memory and confirmation before the bot changes server settings.",
    url: "https://github.com/krishna3251/lexus_dc", slot: "botLxeus", fallback: "/images/bots/lexus.png",
  },
  {
    id: "rukiya", name: "Rukiya", stack: "Discord / YouTube",
    description: "A livestream chat assistant that answers viewers on YouTube and Discord, with separate short-term and saved memory.",
    url: "https://github.com/rukia3287-jpg/rukiya", slot: "botRukiya", fallback: "/images/bots/rukiya.png",
  },
  {
    id: "damu", name: "Damu", stack: "Python / Automation",
    description: "A Discord server builder that previews changes to channels, roles and permissions before applying them.",
    url: "https://github.com/krishnverma32/damu-server-builder", slot: "botDamu", fallback: "/images/bots/deku.png",
  },
  {
    id: "ai-chatbot", name: "AI Chatbot", stack: "Python / Experiment",
    description: "An experiment in remembering conversation context and returning structured responses.",
    slot: "heroPortrait", fallback: "/hero_krishna_vertical.jpg",
  },
];

export default function ProjectsSection() {
  const { media } = useSiteMedia();
  return (
    <section aria-label="Selected software projects">
      <div className="atlas-project-grid">
        {projects.map(({ id, name, stack, description, url, slot, fallback }) => {
          const settings = media.slots?.[slot];
          const image = portfolioImage(settings?.src || fallback, settings);
          return (
            <article key={id} id={id} className="atlas-project-card" data-atlas-reveal>
              <div className="atlas-project-media">
                {image && <Image {...image} fill alt="" sizes="(max-width:620px) 100vw, 52vw" quality={72} />}
              </div>
              <div className="atlas-project-copy">
                <span>{stack}</span><h2>{name}</h2><p>{description}</p>
                {url && <a className="atlas-button" href={url} target="_blank" rel="noreferrer" aria-label={`View ${name} on GitHub`}>View on GitHub</a>}
              </div>
            </article>
          );
        })}
      </div>
      <div className="atlas-actions atlas-project-footer">
        <Link className="atlas-button atlas-button-primary" href="/bots">Explore Bot Lab</Link>
        <a className="atlas-button" href="https://github.com/krishna3251?tab=repositories" target="_blank" rel="noreferrer">All repositories</a>
      </div>
    </section>
  );
}

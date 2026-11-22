"use client";

import { useState } from "react";
import AtlasSectionHero from "@/components/AtlasSectionHero";
import PortfolioImage from "@/components/PortfolioImage";
import { portfolioImage } from "@/lib/portfolio-media";
import r34Image from "@/lib/r34-image";
import useSiteMedia from "@/hooks/useSiteMedia";

const botsData = [
  {
    id: "lxeus",
    name: "Lxeus",
    tagline: "Elite Moderation & AI Chatbot System",
    version: "v.3.4.1",
    status: "Active",
    description: "An elite moderation and AI chatbot system. Lxeus learns server patterns to preemptively manage toxicity while providing intelligent conversational utility and server analysis.",
    tags: ["Auto-Mod", "AI Chat", "Analytics"],
    image: "https://cdn.jsdelivr.net/gh/krishna3251/porfolio-test-33@main/public/images/bots/lexus.png",
    color: "primary",
    links: [{ label: "Repository", url: "https://github.com/krishna3251/lexus_dc.git" }],
    commands: [
      {
        trigger: "lxeus analyze --user @target",
        output: [
          "SYS_CORE :: Reading server sentiment profile...",
          "> User activity logs retrieved (360 nodes)",
          "> Sentiment map: 87% positive / 13% neutral",
          "> Toxicity threat level: Minimal",
          "ACTION :: Trust score updated. Profile logged."
        ]
      },
      {
        trigger: "lxeus chat --ask 'what is antispam?'",
        output: [
          "SYS_AI :: Query received: 'what is antispam?'",
          "> Running LLM resolver...",
          "> Response: 'Antispam analyzes message repetition, patterns, and velocity.'",
          "> Flagging algorithm configured to 0.42 threshold."
        ]
      }
    ]
  },
  {
    id: "rukia",
    name: "Rukia",
    tagline: "Universal Discord Server Architect",
    version: "v.1.2.0",
    status: "Active",
    description: "The universal server builder. Rukia deploys complete, pre-configured Discord ecosystems in seconds, handling roles, permissions, and channel hierarchies instantly.",
    tags: ["Templating", "Role Sync", "Guild Builder"],
    image: "https://cdn.jsdelivr.net/gh/krishna3251/porfolio-test-33@main/public/images/bots/rukiya.png",
    color: "primary",
    links: [{ label: "Repository", url: "https://github.com/rukia3287-jpg/rukiya.git" }],
    commands: [
      {
        trigger: "rukia deploy --template 'Agency'",
        output: [
          "GUILD_CORE :: Compiling configuration mapping...",
          "> Initializing layout tree structure...",
          "> Creating channels: 28 text nodes, 14 voice nodes",
          "> Generating and syncing 15 modular roles...",
          "SUCCESS :: Guild deployment complete."
        ]
      }
    ]
  },
  {
    id: "r34",
    name: "R34",
    tagline: "Character-Personality Discord AI Bot",
    version: "v.1.0.0",
    status: "Active",
    description: "A personality-driven Discord AI bot built around character chat, playful interaction and configurable responses. The current persona uses Yae Miko-inspired wit and confidence.",
    tags: ["AI Chat", "Personality", "Discord"],
    image: r34Image,
    color: "primary",
    links: [{ label: "Repository", url: "https://github.com/krishna3251/rule-34-bot" }],
    commands: [
      {
        trigger: "r34 chat --persona 'Yae Miko'",
        output: [
          "AI_CORE :: Loading configured character profile...",
          "> Persona: Yae Miko-inspired",
          "> Tone: playful / teasing / confident",
          "> Memory layer: ready",
          "SUCCESS :: Character response engine online."
        ]
      },
      {
        trigger: "r34 status --system",
        output: [
          "SYS_CORE :: Checking bot services...",
          "> Discord gateway: connected",
          "> AI provider: ready",
          "> Persona engine: active",
          "STATUS :: All R34 systems operational."
        ]
      }
    ]
  },
  {
    id: "damu",
    name: "Damu",
    tagline: "Discord Guild Template Compiler",
    version: "v.2.0.4",
    status: "Active",
    description: "A high-performance guild template compiler. Damu reads structured JSON layouts to output fully compiled permission maps and channel configurations.",
    tags: ["Compiler Core", "JSON Templates"],
    image: "https://cdn.jsdelivr.net/gh/krishna3251/porfolio-test-33@main/public/images/bots/deku.png",
    color: "primary",
    links: [{ label: "Repository", url: "https://github.com/krishnverma32/damu-server-builder" }],
    commands: [
      {
        trigger: "damu compile --source ./template.json",
        output: [
          "COMPILER :: Loading remote configuration stream...",
          "> Validating structure against schema...",
          "> Resolving role dependency map...",
          "> Success: Ready for deployment nodes."
        ]
      }
    ]
  }
];

function BotLog({ bot }) {
  const [selected, setSelected] = useState(0);
  const command = bot.commands[selected];

  return (
    <section className="atlas-bot-demo" aria-label={`${bot.name} example commands`}>
      <h3>Example commands</h3>
      <div className="atlas-bot-demo-buttons">
        {bot.commands.map(({ trigger }, index) => (
          <button type="button" key={trigger} aria-pressed={index === selected} onClick={() => setSelected(index)}>
            {trigger}
          </button>
        ))}
      </div>
      <div className="atlas-bot-output" aria-live="polite">
        <span>Example output</span>
        <pre key={command.trigger}>{command.output.join("\n")}</pre>
      </div>
    </section>
  );
}

function BotEntry({ bot, imageSettings }) {
  const image = portfolioImage(imageSettings?.src || bot.image, imageSettings);
  return (
    <article className="atlas-bot-card" id={bot.id} data-atlas-reveal>
      <div className="atlas-bot-art">
        {image && <PortfolioImage {...image} fill alt={bot.name} sizes="(max-width:720px) 100vw, 38vw" quality={72} />}
      </div>
      <div className="atlas-bot-copy">
        <div className="atlas-bot-title"><h2>{bot.name}</h2><span>{bot.version}</span></div>
        <p>{bot.description}</p>
        <ul className="atlas-bot-tags">{bot.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
        <div className="atlas-actions">
          {bot.links.map(({ label, url }) => (
            <a key={label} href={url} target="_blank" rel="noreferrer" className="atlas-button atlas-button-small">{label}</a>
          ))}
        </div>
        <BotLog bot={bot} />
      </div>
    </article>
  );
}

const botSlots = { lxeus: "botLxeus", rukia: "botRukiya", r34: "botR34", damu: "botDamu" };

export default function Bots() {
  const { media } = useSiteMedia();
  return (
    <main id="main-content" tabIndex={-1} className="atlas-container atlas-destination-page atlas-bots-page">
      <AtlasSectionHero section="Bot Lab" title="Bot" accent="Lab."
        description="Explore the Discord bots I’ve built and run example commands to see what each one does." />
      <div className="atlas-bot-index">
        {botsData.map((bot) => (
          <BotEntry key={bot.id} bot={bot} imageSettings={media.slots?.[botSlots[bot.id]]} />
        ))}
      </div>
    </main>
  );
}

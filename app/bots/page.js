"use client";

import { useState, useSyncExternalStore } from "react";
import AtlasSectionHero from "@/components/AtlasSectionHero";
import PortfolioImage from "@/components/PortfolioImage";
import { portfolioImage } from "@/lib/portfolio-media";
import { resetSurface, tiltSurface } from "@/lib/surface-depth";
import r34Image from "@/lib/r34-image";
import useSiteMedia from "@/hooks/useSiteMedia";

const botsData = [
  {
    id: "lxeus",
    name: "Lxeus",
    tagline: "Discord moderation & AI",
    version: "v.3.4.1",
    description: "An elite moderation and AI chatbot system. Lxeus learns server patterns to preemptively manage toxicity while providing intelligent conversational utility and server analysis.",
    tags: ["Auto-Mod", "AI Chat", "Analytics"],
    image: "/images/bots/lexus.png",
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
    name: "Rukiya",
    tagline: "Livestream chat assistant",
    version: "v.1.2.0",
    description: "Rukiya helps with livestream chat on YouTube and Discord. It can respond with the context of the stream and keep longer-term memory separate.",
    tags: ["YouTube", "Discord", "Stream Memory"],
    image: "/images/bots/rukiya.png",
    links: [{ label: "Repository", url: "https://github.com/rukia3287-jpg/rukiya.git" }],
    commands: [
      {
        trigger: "rukiya reply --channel youtube",
        output: [
          "> Viewer: What are we playing tonight?",
          "> Context: The current YouTube stream is about Genshin Impact.",
          "> Rukiya: Genshin Impact tonight. We’re exploring Fontaine first!"
        ]
      }
    ]
  },
  {
    id: "r34",
    name: "R34",
    tagline: "Character chat",
    version: "v.1.0.0",
    description: "A personality-driven Discord AI bot built around character chat, playful interaction and configurable responses. The current persona uses Yae Miko-inspired wit and confidence.",
    tags: ["AI Chat", "Personality", "Discord"],
    image: r34Image,
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
    tagline: "Server setup & automation",
    version: "v.2.0.4",
    description: "A high-performance guild template compiler. Damu reads structured JSON layouts to output fully compiled permission maps and channel configurations.",
    tags: ["Compiler Core", "JSON Templates"],
    image: "/images/bots/deku.png",
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

const botSlots = { lxeus: "botLxeus", rukia: "botRukiya", r34: "botR34", damu: "botDamu" };
const botTones = { lxeus: "#b5e2a1", rukia: "#94dcd6", r34: "#c8b4eb", damu: "#e9c48c" };

function subscribeToBot(change) {
  window.addEventListener("hashchange", change);
  window.addEventListener("popstate", change);
  return () => {
    window.removeEventListener("hashchange", change);
    window.removeEventListener("popstate", change);
  };
}

function readBot() {
  const hash = window.location.hash.slice(1).toLowerCase();
  if (hash === "rukiya") return "rukia";
  return botsData.some((bot) => bot.id === hash) ? hash : botsData[0].id;
}

function serverBot() {
  return botsData[0].id;
}

function selectBot(id) {
  if (window.location.hash === `#${id}`) return;
  window.history.replaceState(null, "", `#${id}`);
  window.dispatchEvent(new Event("hashchange"));
}

function BotEntry({ bot, image }) {
  return (
    <article className="atlas-bot-card spatial-bot-card" id={bot.id} style={{ "--bot-light": botTones[bot.id] }}>
      <div className="spatial-bot-world" onPointerMove={tiltSurface} onPointerLeave={resetSurface}>
        <div className="spatial-bot-assembly">
          <div className="spatial-bot-halo" aria-hidden="true" />
          <div className="spatial-bot-plinth" aria-hidden="true" />
          <div className="spatial-bot-portrait" key={bot.id}>
            {image && <PortfolioImage {...image} fill alt={`${bot.name} artwork`} sizes="(max-width:720px) 64vw, 360px"
              quality={72} fetchPriority="high" />}
          </div>
        </div>
      </div>
      <div className="atlas-bot-copy spatial-bot-copy">
        <p className="spatial-bot-role">{bot.tagline}</p>
        <div className="atlas-bot-title"><h2 aria-live="polite">{bot.name}</h2><span>{bot.version}</span></div>
        <p>{bot.description}</p>
        <ul className="atlas-bot-tags">{bot.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
        <div className="atlas-actions">
          {bot.links.map(({ label, url }) => (
            <a key={label} href={url} target="_blank" rel="noreferrer" className="atlas-button atlas-button-small">{label}</a>
          ))}
        </div>
        <BotLog key={bot.id} bot={bot} />
      </div>
    </article>
  );
}

export default function Bots() {
  const { media } = useSiteMedia();
  const selectedId = useSyncExternalStore(subscribeToBot, readBot, serverBot);
  const selected = botsData.find((bot) => bot.id === selectedId) || botsData[0];
  const getImage = (bot) => {
    const settings = media.slots?.[botSlots[bot.id]];
    return portfolioImage(settings?.src || bot.image, settings);
  };

  return (
    <main id="main-content" tabIndex={-1} className="atlas-container atlas-destination-page atlas-bots-page">
      <AtlasSectionHero section="Bot Lab" title="Bot" accent="Lab."
        description="Choose a bot to explore its artwork, features and example commands." />
      <div role="group" aria-label="Choose a bot" className="spatial-bot-picker">
        {botsData.map((bot) => {
          const image = getImage(bot);
          return (
            <button type="button" key={bot.id} aria-pressed={bot.id === selectedId} onClick={() => selectBot(bot.id)}
              style={{ "--bot-light": botTones[bot.id] }}>
              <span className="spatial-bot-picker-image">
                {image && <PortfolioImage {...image} fill alt="" sizes="52px" quality={72} />}
              </span>
              <span><strong>{bot.name}</strong><small>{bot.tagline}</small></span>
            </button>
          );
        })}
      </div>
      <BotEntry bot={selected} image={getImage(selected)} />
    </main>
  );
}

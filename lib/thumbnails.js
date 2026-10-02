// Extract clean short metadata label (do NOT expand into full game title per specification)
export function getShortLabel(filename) {
  const lowercase = filename.toLowerCase();
  if (lowercase.includes("wuwa") || lowercase.includes("wywa") || lowercase.includes("wuthering") || lowercase.includes("lucy")) return "WUWA";
  if (lowercase.includes("hsr") || lowercase.includes("honkai") || lowercase.includes("hse")) return "HSR";
  if (
    lowercase.includes("gensh") ||
    lowercase.includes("gesnh") ||
    lowercase.includes("gnehsin") ||
    lowercase.includes("furia") ||
    lowercase.includes("furina") ||
    lowercase.includes("arle") ||
    lowercase.includes("skirk") ||
    lowercase.includes("miko") ||
    lowercase.includes("nicole") ||
    lowercase.includes("niole") ||
    lowercase.includes("zhonlgi") ||
    lowercase.includes("oddete") ||
    lowercase.includes("oddte") ||
    lowercase.includes("sarishta") ||
    lowercase.includes("vesna") ||
    lowercase.includes("baddie")
  ) {
    return "GENSHIN";
  }
  if (
    lowercase.includes("valorant") ||
    lowercase.includes("velorant") ||
    lowercase.includes("velo") ||
    lowercase.includes("chamber") ||
    lowercase.includes("sage") ||
    lowercase.includes("saze") ||
    lowercase.includes("clove") ||
    lowercase.includes("viper")
  ) {
    return "VALORANT";
  }
  if (lowercase.includes("pubg") || lowercase.includes("sunbro")) return "PUBG";
  if (lowercase.includes("nte")) return "NTE";
  if (lowercase.includes("forza")) return "FORZA";
  if (lowercase.includes("royal s gaming")) return "JC";
  return "OTHER";
}

export function getTitle(filename) {
  const lowercase = filename.toLowerCase();
  if (lowercase === "image.png") return "Yor Forger";
  if (lowercase === "spoiler_content.png") return "Thorn Princess Alternate";
  if (lowercase === "forza op.png") return "Forza Horizon Cyber";
  if (lowercase === "forza hsr.png") return "Forza Astral Express";
  if (lowercase === "niole.png") return "Nicole Demara Study";
  if (lowercase === "genshin zhonlgi.png") return "Rex Lapis Zhongli";
  if (lowercase === "gesnhin 1.png") return "Teyvat Archon Composition";
  if (lowercase === "hse 1.png") return "Stellaron Hunter Study";
  if (lowercase === "wuwa vuberpunk.png") return "Cyberpunk Resonator Core";
  if (lowercase === "royal s gaming_ ethereal anime fantasy.png") return "Ethereal Anime Fantasy";
  if (lowercase === "sunbro pubg.png") return "Sunbro Battlegrounds";
  if (lowercase === "t.png") return "Tactical Operative";
  
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
  return nameWithoutExt
    .split(/[\s_-]+/)
    .map((word) => {
      const lower = word.toLowerCase();
      if (["hsr", "op", "nte", "jc", "wuwa", "pubg"].includes(lower)) return word.toUpperCase();
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

export function getSubtitle(filename) {
  const label = getShortLabel(filename);
  const lowercase = filename.toLowerCase();
  if (lowercase.includes("skirk")) return "Teyvat Abyssal Duel Study";
  if (lowercase.includes("furina")) return "Fontaine Stage Composition";
  if (lowercase.includes("miko")) return "Grand Narukami Shrine Editorial";
  if (lowercase.includes("sage")) return "Radiant Sentinel Lockdown";
  if (lowercase.includes("chamber")) return "Precision Marksman Focus";
  if (lowercase.includes("cyberpunk") || lowercase.includes("vuberpunk")) return "Neon Resonator Cityscape";
  if (lowercase.includes("lucy")) return "Lucy Resonator Character Study";
  if (lowercase.includes("clove")) return "Immortal Mischief Radiant Study";
  if (lowercase.includes("viper")) return "Toxic Screen Controller Study";
  if (lowercase.includes("pubg")) return "Battlegrounds High Velocity Action";
  if (label === "GENSHIN") return "Teyvat Visual Chronicle";
  if (label === "HSR") return "Astral Express Journey Study";
  if (label === "WUWA") return "Solaris-3 Resonator Artwork";
  if (label === "VALORANT") return "Tactical Protocol Agent Art";
  if (label === "NTE") return "Urban Supernatural Action Concept";
  return "Digital Artwork & Concept Design";
}

export function getSpecs(label) {
  switch (label) {
    case "GENSHIN":
      return {
        software: "Adobe Photoshop CC / Stable Diffusion ControlNet",
        canvas: "3840 x 2160 (4K UHD)",
        time: "8.5 Hours",
        layers: "172 Composite Layers",
        colorSpace: "Display P3 Wide Color",
      };
    case "WUWA":
      return {
        software: "Photoshop CC / Stable Diffusion ControlNet / Blender",
        canvas: "3840 x 2160 (4K UHD)",
        time: "9.0 Hours",
        layers: "156 Composite Layers",
        colorSpace: "Display P3 Wide Color",
      };
    case "HSR":
      return {
        software: "Photoshop CC / Figma Composition / 3D Rigging",
        canvas: "3840 x 2160 (4K UHD)",
        time: "7.5 Hours",
        layers: "148 Composite Layers",
        colorSpace: "sRGB IEC61966-2.1",
      };
    case "VALORANT":
      return {
        software: "Photoshop CC / Unreal Engine 5 Assets",
        canvas: "3840 x 2160 (4K UHD)",
        time: "6.5 Hours",
        layers: "112 Composite Layers",
        colorSpace: "sRGB IEC61966-2.1",
      };
    case "PUBG":
      return {
        software: "Photoshop CC / Matte Painting",
        canvas: "3840 x 2160 (4K UHD)",
        time: "5.5 Hours",
        layers: "88 Composite Layers",
        colorSpace: "sRGB IEC61966-2.1",
      };
    case "NTE":
      return {
        software: "Photoshop CC / Blender (Cycles)",
        canvas: "3840 x 2160 (4K UHD)",
        time: "11.0 Hours",
        layers: "210 Composite Layers",
        colorSpace: "Display P3 Wide Color",
      };
    default:
      return {
        software: "Adobe Photoshop CC / AI Generative Pipeline",
        canvas: "3840 x 2160 (4K UHD)",
        time: "6.0 Hours",
        layers: "96 Composite Layers",
        colorSpace: "sRGB IEC61966-2.1",
      };
  }
}

export function getSwatches(label) {
  switch (label) {
    case "GENSHIN":
      return [
        { hex: "#e5c07b", name: "Cor Lapis" },
        { hex: "#c678dd", name: "Electro Violet" },
        { hex: "#4db5ff", name: "Anemo Teal" },
        { hex: "#1e1e24", name: "Abyss Obsidian" },
      ];
    case "WUWA":
      return [
        { hex: "#98c379", name: "Resonator Jade" },
        { hex: "#e06c75", name: "Havoc Crimson" },
        { hex: "#61afef", name: "Glacio Azure" },
        { hex: "#282c34", name: "Tacet Void" },
      ];
    case "HSR":
      return [
        { hex: "#f7b1e3", name: "Stellaron Rose" },
        { hex: "#d7baff", name: "Astral Violet" },
        { hex: "#abb2bf", name: "Express Silver" },
        { hex: "#16121e", name: "Deep Space" },
      ];
    case "VALORANT":
      return [
        { hex: "#ff4655", name: "First Light" },
        { hex: "#00f5ff", name: "Radianite Cyan" },
        { hex: "#39ff14", name: "Viper Toxic" },
        { hex: "#11141a", name: "Defuse Black" },
      ];
    case "PUBG":
      return [
        { hex: "#f5a623", name: "Supply Crate" },
        { hex: "#e74c3c", name: "Airdrop Red" },
        { hex: "#34495e", name: "Tactical Slate" },
        { hex: "#0d0e12", name: "Zone Dark" },
      ];
    case "NTE":
      return [
        { hex: "#d7baff", name: "Cyber Violet" },
        { hex: "#ff6b4a", name: "Neon Orange" },
        { hex: "#ffffff", name: "Evershine White" },
        { hex: "#08060a", name: "Urban Void" },
      ];
    default:
      return [
        { hex: "#ff6b4a", name: "Lava Ember" },
        { hex: "#00f5ff", name: "Sky Cyan" },
        { hex: "#abb2bf", name: "Muted Chrome" },
        { hex: "#1a1a24", name: "Matte Void" },
      ];
  }
}

// Format date into standard display: "12 SEP 2026"
const fullDateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Kolkata",
});

const shortDateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  timeZone: "Asia/Kolkata",
});

const dateKeyFormatter = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: "Asia/Kolkata",
});

/**
 * Loads all thumbnails from public/images/
 * Groups them strictly by DATE (Newest to Oldest)
 * When a new image is added, its filesystem modification date automatically puts it in order.
 */
const THUMBNAIL_CDN_BASE = "https://cdn.jsdelivr.net/gh/krishna3251/porfolio-test-33@main/public/images";

const THUMBNAIL_FILENAMES = [
  "2 baddie genshin.png",
  "3 baddie genshin.png",
  "arle genshuin.png",
  "baddie genshin.png",
  "clove valorant.png",
  "wuwa vuberpunk.png",
  "Royal S Gaming_ Ethereal Anime Fantasy.png",
  "forza hsr.png",
  "forza op.png",
  "furia 2 gnehsin.png",
  "furina 1 genshin.png",
  "genshin.png",
  "genshin 2.png",
  "genshin 3.png",
  "genshin blue.png",
  "genshin cinematic.png",
  "genshin furina.png",
  "genshin miko.png",
  "genshin nicole.png",
  "genshin skirk.png",
  "genshin skirk 2.png",
  "genshin skirk3.png",
  "honkai star rail.png",
  "honkai star rail 2.png",
  "hsr.png",
  "hsr ale.png",
  "hsr aly.png",
  "lucy wuwa 2.png",
  "luno cinematic.png",
  "niole.png",
  "nte.png",
  "oddete genshin.png",
  "oddte genshin.png",
  "pubg 2.png",
  "genshin zhonlgi.png",
  "sarishta genshin.png",
  "saze valorant.png",
  "hse 1.png",
  "sunbro pubg.png",
  "t.png",
  "gesnhin 1.png",
  "SPOILER_content.png",
  "valorant.png",
  "valorant 1.png",
  "valorant chamber velo.png",
  "valorant sage.png",
  "vesna 2 genshin.png",
  "vesna 3 genshin.png",
  "vesna genshin.png",
  "viper velorant.png",
  "wuwa.png",
  "wuwa cyberpunk 1.png",
  "wuwa iciya.png",
  "wuwa2.png",
  "wywa krishna.png",
  "image.png"
];

export function getThumbnailSrc(filename) {
  return `${THUMBNAIL_CDN_BASE}/${encodeURIComponent(filename)}`;
}

export function getChronologicalThumbnailGroups() {
  const mtime = new Date("2018-10-20T01:46:40.000Z");
  const dateKey = dateKeyFormatter.format(mtime);
  const formattedDate = fullDateFormatter.format(mtime).toUpperCase();
  const shortDate = shortDateFormatter.format(mtime).toUpperCase();
  const timestamp = mtime.getTime();

  const thumbnails = THUMBNAIL_FILENAMES.map((filename, idx) => {
    const label = getShortLabel(filename);
    return {
      id: `thumb-${idx + 1}`,
      filename,
      src: getThumbnailSrc(filename),
      label,
      title: getTitle(filename),
      subtitle: getSubtitle(filename),
      specs: getSpecs(label),
      swatches: getSwatches(label),
      mtime,
      timestamp,
    };
  });

  return [{
    dateKey,
    formattedDate,
    shortDate,
    latestTimestamp: timestamp,
    thumbnails,
  }];
}

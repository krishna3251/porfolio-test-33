import fs from "fs";
import path from "path";

// Extract clean short metadata label (do NOT expand into full game title per specification)
export function getShortLabel(filename) {
  const lowercase = filename.toLowerCase();
  if (lowercase.includes("wuwa") || lowercase.includes("wywa") || lowercase.includes("lucy")) return "WUWA";
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
  return "VISUAL";
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
export function getChronologicalThumbnailGroups() {
  const imagesDir = path.join(process.cwd(), "public", "images");
  let filenames = [];
  try {
    filenames = fs.readdirSync(imagesDir);
  } catch (err) {
    console.error("Failed to read images directory:", err);
    return [];
  }

  const validFiles = filenames.filter((file) => /\.(png|jpe?g|webp)$/i.test(file));

  // Map each file with stats
  const items = validFiles.map((filename, idx) => {
    const filePath = path.join(imagesDir, filename);
    let mtime = new Date();
    try {
      const stats = fs.statSync(filePath);
      mtime = stats.mtime;
    } catch {
      // fallback
    }

    const label = getShortLabel(filename);
    const title = getTitle(filename);
    const subtitle = getSubtitle(filename);
    const specs = getSpecs(label);
    const swatches = getSwatches(label);

    return {
      id: `thumb-${idx + 1}`,
      filename,
      src: `/images/${encodeURI(filename)}`,
      label,
      title,
      subtitle,
      specs,
      swatches,
      mtime,
      timestamp: mtime.getTime(),
    };
  });

  // Group by Date key YYYY-MM-DD
  const groupMap = new Map();

  for (const item of items) {
    const dateKey = dateKeyFormatter.format(item.mtime);
    if (!groupMap.has(dateKey)) {
      const formattedDate = fullDateFormatter.format(item.mtime).toUpperCase();
      const shortDate = shortDateFormatter.format(item.mtime).toUpperCase();
      groupMap.set(dateKey, {
        dateKey,
        formattedDate,
        shortDate,
        latestTimestamp: item.timestamp,
        thumbnails: [],
      });
    }

    const group = groupMap.get(dateKey);
    group.latestTimestamp = Math.max(group.latestTimestamp, item.timestamp);
    group.thumbnails.push(item);
  }

  // Sort groups: NEWEST DATE FIRST -> OLDEST LAST
  const sortedGroups = Array.from(groupMap.values()).sort(
    (a, b) => b.latestTimestamp - a.latestTimestamp
  );

  // Sort thumbnails within each group by mtime descending
  for (const group of sortedGroups) {
    group.thumbnails.sort(
      (a, b) => b.timestamp - a.timestamp || a.title.localeCompare(b.title)
    );
  }

  return sortedGroups;
}

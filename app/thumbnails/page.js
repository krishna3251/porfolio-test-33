import fs from "fs";
import path from "path";
import GalleryClient from "@/components/GalleryClient";

const getCategoryFromFilename = (filename) => {
  const lowercase = filename.toLowerCase();
  
  // Rule overrides:
  if (lowercase === "forza op.png" || lowercase === "forza hsr.png" || lowercase === "image.png") {
    return "Other Games";
  }
  if (lowercase === "niole.png" || lowercase === "spoiler_content.png") {
    return "Genshin Impact";
  }
  
  // Generic falls:
  if (lowercase.includes("gensh") || lowercase.includes("gesnh")) {
    return "Genshin Impact";
  }
  if (lowercase.includes("wuwa") || lowercase.includes("wywa") || lowercase.includes("luno")) {
    return "Wuthering Waves";
  }
  if (lowercase.includes("hsr") || lowercase.includes("hse")) {
    return "Honkai Star Rail";
  }
  if (lowercase.includes("valorant")) {
    return "Valorant";
  }
  if (lowercase.includes("nte")) {
    return "Neverness To Everness";
  }
  
  return "Other Games";
};

const getTitleFromFilename = (filename) => {
  const lowercase = filename.toLowerCase();
  if (lowercase === "image.png") return "Yor Forger";
  if (lowercase === "spoiler_content.png") return "Thorn Princess Alternate";
  if (lowercase === "forza op.png") return "Forza OP";
  if (lowercase === "forza hsr.png") return "Forza HSR";
  if (lowercase === "niole.png") return "Niole";
  
  // Remove extension
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
  
  // Format generic names
  return nameWithoutExt
    .split(/[\s_-]+/)
    .map(word => {
      if (word === "hsr" || word === "op" || word === "nte") return word.toUpperCase();
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
};

const getSubtitleFromFilename = (filename) => {
  const lowercase = filename.toLowerCase();
  if (lowercase === "image.png") return "Thorn Princess Concept";
  if (lowercase === "spoiler_content.png") return "Spy x Family Cinematic Alternate";
  if (lowercase === "forza op.png") return "One Piece Custom Art";
  if (lowercase === "forza hsr.png") return "Honkai Star Rail Custom Art";
  if (lowercase === "niole.png") return "Genshin Style Design";
  
  if (lowercase.includes("gensh")) return "Teyvat Archon Chronicles";
  if (lowercase.includes("wuwa") || lowercase.includes("wywa")) return "Rover Resonator Core";
  if (lowercase.includes("hsr") || lowercase.includes("hse")) return "Astral Express Star Rail";
  if (lowercase.includes("valorant")) return "Tactical Agent Strike";
  if (lowercase.includes("nte")) return "Urban Supernatural Action";
  return "Creative Visual Design";
};

export default function ThumbnailsPage() {
  const imagesDir = path.join(process.cwd(), "public", "images");
  let files = [];
  try {
    files = fs.readdirSync(imagesDir);
  } catch (err) {
    console.error("Failed to read images directory", err);
  }

  // Filter only images (png, jpg, jpeg, webp)
  const imageFiles = files.filter(file => /\.(png|jpe?g|webp)$/i.test(file));

  // Build items array
  const items = imageFiles.map((filename, index) => {
    const category = getCategoryFromFilename(filename);
    const title = getTitleFromFilename(filename);
    const info = getSubtitleFromFilename(filename);

    return {
      id: index + 1,
      title,
      category,
      image: `/images/${filename}`,
      layoutSize: "standard",
      info,
      filename,
    };
  });

  return (
    <main className="flex-grow pt-32 pb-24 px-6 md:px-12 lg:px-16 max-w-7xl mx-auto w-full relative z-10">
      {/* Header Section */}
      <header className="mb-20 md:mb-28 text-left relative flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[160px] -z-10 pointer-events-none"></div>
        
        {/* Left Side Title block */}
        <div className="relative">
          {/* Futuristic vertical title overlay */}
          <div className="absolute -left-8 -top-8 font-mono text-[9px] text-primary/30 tracking-[0.4em] uppercase [writing-mode:vertical-lr] hidden xl:block">
            EXHIBITION_NODE_04
          </div>
          
          <h1 className="font-display text-6xl md:text-8xl mb-6 text-on-surface/90 font-medium tracking-tight leading-none">
            Cinematic<br />
            <span className="text-on-surface/40 italic font-light">Visions.</span>
          </h1>
          <p className="font-sans text-xs md:text-sm text-on-surface-variant/80 max-w-lg font-light leading-relaxed pl-1 border-l border-primary/20">
            A curated interactive exhibition of high-impact thumbnail designs, blending detailed character compositions, atmospheric depth, and luxury digital art aesthetics.
          </p>
        </div>

        {/* Right Side Telemetry HUD Dashboard */}
        <div className="flex flex-col gap-2 font-mono text-[10px] text-on-surface-variant/50 border border-white/5 bg-white/[0.01] backdrop-blur-md p-4 rounded-xl max-w-xs w-full self-stretch md:self-auto justify-center">
          <div className="flex justify-between border-b border-white/5 pb-1">
            <span className="tracking-wider uppercase">Location:</span>
            <span className="text-primary font-bold">35.6762° N, 139.6503° E</span>
          </div>
          <div className="flex justify-between border-b border-white/5 pb-1">
            <span className="tracking-wider uppercase">System:</span>
            <span className="text-white/80">K_PORTFOLIO_V4.1</span>
          </div>
          <div className="flex justify-between border-b border-white/5 pb-1">
            <span className="tracking-wider uppercase">Active Nodes:</span>
            <span className="text-white/80">{items.length} Files Rendered</span>
          </div>
          <div className="flex justify-between">
            <span className="tracking-wider uppercase">Status:</span>
            <span className="text-[#10B981] flex items-center gap-1 font-bold">
              <span className="w-1.5 h-1.5 bg-[#10B981] rounded-full animate-ping"></span>
              EXHIBITING
            </span>
          </div>
        </div>
      </header>

      {/* Render the interactive next-gen client gallery */}
      <GalleryClient initialItems={items} />

      {/* Footer */}
      <footer className="mt-40 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-on-surface-variant/40">
        <div className="font-ui text-[10px] font-medium uppercase tracking-[0.2em]">
          © 2026 KRISHNA. DESIGNING DIGITAL EXPERIENCE.
        </div>
        <div className="flex gap-8 font-ui text-[10px] uppercase tracking-[0.2em]">
          <a href="#" className="hover:text-on-surface transition-colors duration-300">Instagram</a>
          <a href="#" className="hover:text-on-surface transition-colors duration-300">Twitter</a>
          <a href="#" className="hover:text-on-surface transition-colors duration-300">Discord</a>
        </div>
      </footer>
    </main>
  );
}

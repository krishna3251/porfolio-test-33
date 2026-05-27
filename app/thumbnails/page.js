import fs from "fs";
import path from "path";
import GalleryClient from "@/components/GalleryClient";

const getCategoryFromFilename = (filename) => {
  const lowercase = filename.toLowerCase();
  if (lowercase === "forza op.png" || lowercase === "forza hsr.png" || lowercase === "image.png") return "Other Games";
  if (lowercase === "niole.png" || lowercase === "spoiler_content.png") return "Genshin Impact";
  if (lowercase.includes("gensh") || lowercase.includes("gesnh")) return "Genshin Impact";
  if (lowercase.includes("wuwa") || lowercase.includes("wywa") || lowercase.includes("luno")) return "Wuthering Waves";
  if (lowercase.includes("hsr") || lowercase.includes("hse")) return "Honkai Star Rail";
  if (lowercase.includes("valorant")) return "Valorant";
  if (lowercase.includes("nte")) return "Neverness To Everness";
  return "Other Games";
};

const getTitleFromFilename = (filename) => {
  const lowercase = filename.toLowerCase();
  if (lowercase === "image.png") return "Yor Forger";
  if (lowercase === "spoiler_content.png") return "Thorn Princess Alternate";
  if (lowercase === "forza op.png") return "Forza OP";
  if (lowercase === "forza hsr.png") return "Forza HSR";
  if (lowercase === "niole.png") return "Niole";
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
  return nameWithoutExt.split(/[\s_-]+/).map(word => {
    if (word === "hsr" || word === "op" || word === "nte") return word.toUpperCase();
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(" ");
};

const getSubtitleFromFilename = (filename) => {
  const lowercase = filename.toLowerCase();
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

  const imageFiles = files.filter(file => /\.(png|jpe?g|webp)$/i.test(file));
  const items = imageFiles.map((filename, index) => ({
    id: index + 1,
    title: getTitleFromFilename(filename),
    category: getCategoryFromFilename(filename),
    image: `/images/${filename}`,
    info: getSubtitleFromFilename(filename),
    filename,
  }));

  return (
    <main className="flex-grow pt-40 pb-32 px-6 md:px-12 lg:px-16 max-w-7xl mx-auto w-full relative">
      {/* Header Section */}
      <header className="mb-24 flex flex-col md:flex-row justify-between items-baseline gap-12 border-b border-foreground/5 pb-16">
        <div className="max-w-2xl">
          <div className="mono-metadata text-primary mb-6">
            Archive // Collection 01
          </div>
          <h1 className="serif-display text-7xl md:text-8xl mb-8 text-foreground">
            Visual <span className="italic">Manifesto.</span>
          </h1>
          <p className="font-sans text-lg text-muted max-w-lg leading-relaxed">
            A curated interactive exhibition of high-impact thumbnail designs, blending detailed character compositions, atmospheric depth, and luxury digital art aesthetics.
          </p>
        </div>

        <div className="flex flex-col gap-4 text-right items-end">
          <span className="mono-metadata text-muted">Exhibiting</span>
          <span className="serif-display text-5xl tabular-nums">{items.length}</span>
          <span className="mono-metadata text-muted text-[9px] max-w-[140px]">
            LATEST COMPILATION OF NEXT-GEN ART ASSETS.
          </span>
        </div>
      </header>

      {/* Render the interactive next-gen client gallery */}
      <GalleryClient initialItems={items} />

      {/* Simple Editorial Footer */}
      <footer className="mt-48 pt-12 border-t border-foreground/5 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="mono-metadata text-muted">
          Studio Archive © 2026
        </div>
        <div className="flex gap-12 mono-metadata text-muted">
          <a href="#" className="hover:text-primary transition-colors">Instagram</a>
          <a href="#" className="hover:text-primary transition-colors">Twitter</a>
          <a href="#" className="hover:text-primary transition-colors">Discord</a>
        </div>
      </footer>
    </main>
  );
}

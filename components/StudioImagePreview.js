"use client";

import { useState } from "react";
import PortfolioImage from "@/components/PortfolioImage";
import { portfolioImage } from "@/lib/portfolio-media";
import { resetSurface, tiltSurface } from "@/lib/surface-depth";

const frames = [
  ["wide", "16:9", "Landscape preview"],
  ["square", "1:1", "Square preview"],
  ["portrait", "9:16", "Portrait preview"],
];

export default function StudioImagePreview({ name, draft, saved }) {
  const [frame, setFrame] = useState("wide");
  const [version, setVersion] = useState("draft");
  const [depth, setDepth] = useState(false);
  const shown = version === "draft" ? draft : saved;
  const image = portfolioImage(shown.src, shown.settings);
  const hidden = shown.settings.visible === false;

  return (
    <section className="studio-preview" aria-label="Image preview">
      <div className="studio-preview-controls">
        <div className="studio-segmented" role="group" aria-label="Preview version">
          <button type="button" aria-pressed={version === "draft"} onClick={() => setVersion("draft")}>Draft</button>
          <button type="button" aria-pressed={version === "saved"} onClick={() => setVersion("saved")}>Saved</button>
        </div>
        <div className="studio-segmented" role="group" aria-label="Preview aspect ratio">
          {frames.map(([id, label, title]) => <button key={id} type="button" title={title} aria-label={title}
            aria-pressed={frame === id} onClick={() => setFrame(id)}>{label}</button>)}
        </div>
        <button type="button" className="studio-depth-toggle" aria-pressed={depth} onClick={() => setDepth(!depth)}>
          3D preview
        </button>
      </div>
      <div className="studio-preview-world" onPointerMove={depth ? tiltSurface : undefined} onPointerLeave={resetSurface}>
        <div className="studio-preview-frame" data-frame={frame} data-depth={depth}>
          {image ? <PortfolioImage {...image} fill alt={name} sizes="(max-width:700px) 85vw, 480px" quality={72} /> :
            <span className="studio-preview-empty">{hidden ? "Hidden on the site" : "No image set"}</span>}
          {image && shown.settings.overlayOpacity > 0 && <span className="atlas-media-overlay"
            style={{ backgroundColor: shown.settings.overlayColor, opacity: shown.settings.overlayOpacity }} />}
        </div>
      </div>
      <div className="studio-preview-caption">
        <strong>{name}</strong>
        <span>{version === "draft" ? "Draft preview" : "Published version"}</span>
      </div>
    </section>
  );
}

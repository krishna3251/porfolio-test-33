// Shared with the studio: keep crop, visibility and scale settings intact.
export function mediaImageStyle(settings = {}) {
  return {
    objectFit: settings.fit === "contain" ? "contain" : "cover",
    objectPosition: `${settings.positionX ?? 50}% ${settings.positionY ?? 50}%`,
    transform: `scale(${Math.min(2.5, Math.max(0.5, Number(settings.scale) || 1))})`,
    opacity: settings.visible === false ? 0 : (settings.opacity ?? 1),
  };
}

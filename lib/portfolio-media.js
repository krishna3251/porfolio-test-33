export function portfolioImage(src, settings = {}, fallbackFit = "cover") {
  if (!src || settings.visible === false) return null;
  const scale = Math.min(2.5, Math.max(0.5, Number(settings.scale) || 1));
  return {
    src,
    unoptimized: !src.startsWith("/") && !src.startsWith("https://cdn.jsdelivr.net/gh/krishna3251/porfolio-test-33@main/public/"),
    style: {
      objectFit: settings.fit || fallbackFit,
      objectPosition: `${settings.positionX ?? 50}% ${settings.positionY ?? 50}%`,
      transform: `scale(${scale})`,
      opacity: settings.opacity ?? 1,
    },
  };
}

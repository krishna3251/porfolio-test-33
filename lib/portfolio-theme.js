export const themeStorageKey = "krishna-theme-v3";
export const portfolioThemes = [
  ["atlas", "Atlas"],
  ["editorial", "Editorial"],
  ["darkroom", "Darkroom"],
  ["sunset", "Sunset"],
  ["minimalism", "Minimalism"],
  ["maximalism", "Maximalism"],
];

export function getPortfolioTheme(config) {
  const isTheme = (value) => portfolioThemes.some(([id]) => id === value);
  const preset = config.design?.theme;
  try {
    const saved = JSON.parse(localStorage.getItem(themeStorageKey) || "null");
    if (saved?.version === (Number(config.version) || 1) && isTheme(saved.theme)) return saved.theme;
  } catch {}
  return isTheme(preset) ? preset : "atlas";
}

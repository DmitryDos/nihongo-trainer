// Доступные японские шрифты (переключаются в настройках).
// value — ключ в настройках, cssVar — CSS-переменная, заданная в layout.js.
export const FONT_OPTIONS = [
  { value: "noto", label: "Noto Sans JP · базовый", cssVar: "var(--font-noto)" },
  { value: "zen-kaku", label: "Zen Kaku Gothic · гротеск", cssVar: "var(--font-zen-kaku)" },
  { value: "mplus", label: "M PLUS Rounded · округлый", cssVar: "var(--font-mplus)" },
  { value: "kosugi", label: "Kosugi Maru · мягкий", cssVar: "var(--font-kosugi)" },
  { value: "shippori", label: "Shippori Mincho · минтё", cssVar: "var(--font-shippori)" },
];

export const FONT_MAP = Object.fromEntries(FONT_OPTIONS.map((f) => [f.value, f.cssVar]));

// Применить выбранный японский шрифт ко всему приложению.
export function applyFont(value) {
  if (typeof document === "undefined") return;
  const cssVar = FONT_MAP[value] || FONT_MAP.noto;
  document.documentElement.style.setProperty("--font-jp-active", cssVar);
}

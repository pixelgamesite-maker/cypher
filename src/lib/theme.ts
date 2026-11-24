export const color = {
  bg:         "#080E1A",
  surface:    "#0F1623",
  surfaceHi:  "#161E2E",
  border:     "#1E2A3B",
  borderSoft: "#253347",

  teal:       "#06B6D4",
  tealDim:    "#0891B2",
  tealGlow:   "rgba(6,182,212,0.12)",
  tealBorder: "rgba(6,182,212,0.35)",

  ink:        "#F0F4F8",
  inkSoft:    "#8FA3B8",
  inkMuted:   "#536270",

  success:    "#10B981",
  successGlow:"rgba(16,185,129,0.15)",
  error:      "#EF4444",
  errorGlow:  "rgba(239,68,68,0.15)",
};

export const font = {
  display: `"Space Grotesk", system-ui, sans-serif`,
  body:    `"Inter", system-ui, sans-serif`,
  mono:    `"JetBrains Mono", "Fira Code", monospace`,
};

export const radius = {
  sm:   "8px",
  md:   "12px",
  lg:   "16px",
  xl:   "24px",
  full: "9999px",
};

export function loadFonts() {
  if (document.getElementById("icrypter-fonts")) return;
  const link = document.createElement("link");
  link.id = "icrypter-fonts";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap";
  document.head.appendChild(link);
}

export interface FontDef {
  id: string;
  name: string;
  category: "handwriting" | "sans" | "mono" | "display" | "serif";
  googleFamily: string;
  cssFamily: string;
  previewClass?: string;
}

export const AVAILABLE_FONTS: FontDef[] = [
  // --- 22+ HANDWRITING / SCRIPT FONTS ---
  {
    id: "caveat",
    name: "Caveat",
    category: "handwriting",
    googleFamily: "Caveat:wght@400;700",
    cssFamily: "'Caveat', cursive, sans-serif",
  },
  {
    id: "kalam",
    name: "Kalam",
    category: "handwriting",
    googleFamily: "Kalam:wght@400;700",
    cssFamily: "'Kalam', cursive, sans-serif",
  },
  {
    id: "architect",
    name: "Architects Daughter",
    category: "handwriting",
    googleFamily: "Architects+Daughter",
    cssFamily: "'Architects Daughter', cursive, sans-serif",
  },
  {
    id: "indie-flower",
    name: "Indie Flower",
    category: "handwriting",
    googleFamily: "Indie+Flower",
    cssFamily: "'Indie Flower', cursive, sans-serif",
  },
  {
    id: "shadows",
    name: "Shadows Into Light",
    category: "handwriting",
    googleFamily: "Shadows+Into+Light",
    cssFamily: "'Shadows Into Light', cursive, sans-serif",
  },
  {
    id: "patrick-hand",
    name: "Patrick Hand",
    category: "handwriting",
    googleFamily: "Patrick+Hand",
    cssFamily: "'Patrick Hand', cursive, sans-serif",
  },
  {
    id: "gloria",
    name: "Gloria Hallelujah",
    category: "handwriting",
    googleFamily: "Gloria+Hallelujah",
    cssFamily: "'Gloria Hallelujah', cursive, sans-serif",
  },
  {
    id: "permanent-marker",
    name: "Permanent Marker",
    category: "handwriting",
    googleFamily: "Permanent+Marker",
    cssFamily: "'Permanent Marker', cursive, sans-serif",
  },
  {
    id: "rock-salt",
    name: "Rock Salt",
    category: "handwriting",
    googleFamily: "Rock+Salt",
    cssFamily: "'Rock Salt', cursive, sans-serif",
  },
  {
    id: "amatic",
    name: "Amatic SC",
    category: "handwriting",
    googleFamily: "Amatic+SC:wght@400;700",
    cssFamily: "'Amatic SC', cursive, sans-serif",
  },
  {
    id: "covered-grace",
    name: "Covered By Your Grace",
    category: "handwriting",
    googleFamily: "Covered+By+Your+Grace",
    cssFamily: "'Covered By Your Grace', cursive, sans-serif",
  },
  {
    id: "sacramento",
    name: "Sacramento",
    category: "handwriting",
    googleFamily: "Sacramento",
    cssFamily: "'Sacramento', cursive, sans-serif",
  },
  {
    id: "dancing-script",
    name: "Dancing Script",
    category: "handwriting",
    googleFamily: "Dancing+Script:wght@400;700",
    cssFamily: "'Dancing Script', cursive, sans-serif",
  },
  {
    id: "pacifico",
    name: "Pacifico",
    category: "handwriting",
    googleFamily: "Pacifico",
    cssFamily: "'Pacifico', cursive, sans-serif",
  },
  {
    id: "great-vibes",
    name: "Great Vibes",
    category: "handwriting",
    googleFamily: "Great+Vibes",
    cssFamily: "'Great Vibes', cursive, sans-serif",
  },
  {
    id: "satisfy",
    name: "Satisfy",
    category: "handwriting",
    googleFamily: "Satisfy",
    cssFamily: "'Satisfy', cursive, sans-serif",
  },
  {
    id: "courgette",
    name: "Courgette",
    category: "handwriting",
    googleFamily: "Courgette",
    cssFamily: "'Courgette', cursive, sans-serif",
  },
  {
    id: "homemade-apple",
    name: "Homemade Apple",
    category: "handwriting",
    googleFamily: "Homemade+Apple",
    cssFamily: "'Homemade Apple', cursive, sans-serif",
  },
  {
    id: "reenie-beanie",
    name: "Reenie Beanie",
    category: "handwriting",
    googleFamily: "Reenie+Beanie",
    cssFamily: "'Reenie Beanie', cursive, sans-serif",
  },
  {
    id: "just-another-hand",
    name: "Just Another Hand",
    category: "handwriting",
    googleFamily: "Just+Another+Hand",
    cssFamily: "'Just Another Hand', cursive, sans-serif",
  },
  {
    id: "marck-script",
    name: "Marck Script",
    category: "handwriting",
    googleFamily: "Marck+Script",
    cssFamily: "'Marck Script', cursive, sans-serif",
  },
  {
    id: "neucha",
    name: "Neucha",
    category: "handwriting",
    googleFamily: "Neucha",
    cssFamily: "'Neucha', cursive, sans-serif",
  },
  {
    id: "bad-script",
    name: "Bad Script",
    category: "handwriting",
    googleFamily: "Bad+Script",
    cssFamily: "'Bad Script', cursive, sans-serif",
  },
  {
    id: "gochi-hand",
    name: "Gochi Hand",
    category: "handwriting",
    googleFamily: "Gochi+Hand",
    cssFamily: "'Gochi Hand', cursive, sans-serif",
  },

  // --- MODERN SANS-SERIF FONTS ---
  {
    id: "jakarta",
    name: "Plus Jakarta Sans",
    category: "sans",
    googleFamily: "Plus+Jakarta+Sans:wght@400;600;700",
    cssFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
  },
  {
    id: "inter",
    name: "Inter",
    category: "sans",
    googleFamily: "Inter:wght@400;600;700",
    cssFamily: "'Inter', system-ui, sans-serif",
  },
  {
    id: "outfit",
    name: "Outfit",
    category: "sans",
    googleFamily: "Outfit:wght@400;600;700",
    cssFamily: "'Outfit', system-ui, sans-serif",
  },
  {
    id: "poppins",
    name: "Poppins",
    category: "sans",
    googleFamily: "Poppins:wght@400;600;700",
    cssFamily: "'Poppins', system-ui, sans-serif",
  },
  {
    id: "montserrat",
    name: "Montserrat",
    category: "sans",
    googleFamily: "Montserrat:wght@400;600;700",
    cssFamily: "'Montserrat', system-ui, sans-serif",
  },
  {
    id: "nunito",
    name: "Nunito",
    category: "sans",
    googleFamily: "Nunito:wght@400;600;700",
    cssFamily: "'Nunito', system-ui, sans-serif",
  },
  {
    id: "quicksand",
    name: "Quicksand",
    category: "sans",
    googleFamily: "Quicksand:wght@400;600;700",
    cssFamily: "'Quicksand', system-ui, sans-serif",
  },
  {
    id: "comfortaa",
    name: "Comfortaa",
    category: "sans",
    googleFamily: "Comfortaa:wght@400;700",
    cssFamily: "'Comfortaa', system-ui, sans-serif",
  },

  // --- MONOSPACE / CODING FONTS ---
  {
    id: "mono",
    name: "JetBrains Mono",
    category: "mono",
    googleFamily: "JetBrains+Mono:wght@400;700",
    cssFamily: "'JetBrains Mono', monospace",
  },
  {
    id: "fira-code",
    name: "Fira Code",
    category: "mono",
    googleFamily: "Fira+Code:wght@400;700",
    cssFamily: "'Fira Code', monospace",
  },
  {
    id: "space-mono",
    name: "Space Mono",
    category: "mono",
    googleFamily: "Space+Mono:wght@400;700",
    cssFamily: "'Space Mono', monospace",
  },
  {
    id: "courier-prime",
    name: "Courier Prime",
    category: "mono",
    googleFamily: "Courier+Prime:wght@400;700",
    cssFamily: "'Courier Prime', monospace",
  },
  {
    id: "vt323",
    name: "VT323 (Retro Terminal)",
    category: "mono",
    googleFamily: "VT323",
    cssFamily: "'VT323', monospace",
  },

  // --- DISPLAY & SERIF FONTS ---
  {
    id: "playfair",
    name: "Playfair Display",
    category: "serif",
    googleFamily: "Playfair+Display:ital,wght@0,400;0,700;1,400",
    cssFamily: "'Playfair Display', Georgia, serif",
  },
  {
    id: "cinzel",
    name: "Cinzel",
    category: "serif",
    googleFamily: "Cinzel:wght@400;700",
    cssFamily: "'Cinzel', Georgia, serif",
  },
  {
    id: "abril",
    name: "Abril Fatface",
    category: "display",
    googleFamily: "Abril+Fatface",
    cssFamily: "'Abril Fatface', cursive, serif",
  },
  {
    id: "bebas",
    name: "Bebas Neue",
    category: "display",
    googleFamily: "Bebas+Neue",
    cssFamily: "'Bebas Neue', sans-serif",
  },
  {
    id: "righteous",
    name: "Righteous",
    category: "display",
    googleFamily: "Righteous",
    cssFamily: "'Righteous', cursive, sans-serif",
  },
  {
    id: "bungee",
    name: "Bungee",
    category: "display",
    googleFamily: "Bungee",
    cssFamily: "'Bungee', cursive, sans-serif",
  },
];

// Cache of loaded font stylesheets in DOM
const loadedFontUrls = new Set<string>();

export function ensureFontLoaded(fontIdOrName: string) {
  if (typeof document === "undefined") return;

  const font = AVAILABLE_FONTS.find(
    (f) => f.id === fontIdOrName || f.name.toLowerCase() === fontIdOrName.toLowerCase()
  );

  if (!font) return;

  const url = `https://fonts.googleapis.com/css2?family=${font.googleFamily}&display=swap`;
  if (!loadedFontUrls.has(url)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    document.head.appendChild(link);
    loadedFontUrls.add(url);
  }

  // Pre-warm font with document.fonts API if available
  if ("fonts" in document) {
    try {
      document.fonts.load(`16px ${font.cssFamily}`).catch(() => {});
    } catch {}
  }
}

/**
 * Preload initial popular font batches
 */
export function preloadCommonFonts() {
  if (typeof document === "undefined") return;

  // Batch query for popular handwriting + sans fonts
  const initialBatches = [
    "Caveat:wght@400;700",
    "Kalam:wght@400;700",
    "Architects+Daughter",
    "Indie+Flower",
    "Shadows+Into+Light",
    "Patrick+Hand",
    "Gloria+Hallelujah",
    "Permanent+Marker",
    "Pacifico",
    "Dancing+Script:wght@400;700",
    "Plus+Jakarta+Sans:wght@400;600;700",
    "Inter:wght@400;600;700",
    "JetBrains+Mono:wght@400;700",
    "Playfair+Display:ital,wght@0,400;0,700;1,400",
  ];

  const url = `https://fonts.googleapis.com/css2?${initialBatches.map((b) => `family=${b}`).join("&")}&display=swap`;
  if (!loadedFontUrls.has(url)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    document.head.appendChild(link);
    loadedFontUrls.add(url);
  }

  if ("fonts" in document) {
    try {
      document.fonts.load("16px 'Caveat'").catch(() => {});
      document.fonts.load("16px 'Kalam'").catch(() => {});
    } catch {}
  }
}

/**
 * Resolves font definition by ID or fallback
 */
export function getFontDefinition(fontId: string): FontDef {
  const normalized = fontId.toLowerCase().replace(/['"]/g, "").trim();
  const match = AVAILABLE_FONTS.find(
    (f) =>
      f.id === normalized ||
      f.name.toLowerCase() === normalized ||
      (normalized === "handwriting" && f.id === "caveat") ||
      (normalized === "sans" && f.id === "jakarta")
  );
  return match || AVAILABLE_FONTS[0];
}

/**
 * Get CSS font family string for canvas rendering or CSS styles
 */
export function getCanvasFontCss(
  fontId: string = "caveat",
  fontSize: number = 20,
  fontWeight: "normal" | "bold" = "normal",
  fontStyle: "normal" | "italic" = "normal"
): string {
  const fontDef = getFontDefinition(fontId);
  const stylePrefix = fontStyle === "italic" ? "italic " : "";
  const weightPrefix = fontWeight === "bold" ? "bold " : "";
  return `${stylePrefix}${weightPrefix}${fontSize}px ${fontDef.cssFamily}`;
}

// ─── Tokens visuels « blueprint » (section Projets + Veille) ────────────────
// Palette clair = plan papier, sombre = plan cyanotype indigo

export interface BlueprintTokens {
  pageBg: string;
  gridLine: string;
  text: string;
  sub: string;
  faint: string;
  accent: string;
  titleGrad: string;
  cardBg: string;
  cardBorder: string;
  chipBg: string;
  chipText: string;
  chipBorder: string;
}

export const BP_DARK: BlueprintTokens = {
  pageBg: "radial-gradient(120% 95% at 50% 0%, #17306e 0%, #0d1d4a 50%, #050b22 100%)",
  gridLine: "rgba(96,165,250,0.13)",
  text: "#e8efff",
  sub: "#a5bdf0",
  faint: "#5f7cc0",
  accent: "#60a5fa",
  titleGrad: "linear-gradient(90deg,#60a5fa,#818cf8)",
  cardBg: "rgba(13,25,58,0.45)",
  cardBorder: "rgba(129,140,248,0.30)",
  chipBg: "rgba(96,165,250,0.10)",
  chipText: "#c7d8fa",
  chipBorder: "rgba(96,165,250,0.28)",
};

export const BP_LIGHT: BlueprintTokens = {
  pageBg: "radial-gradient(120% 95% at 50% 0%, #eef5ff 0%, #ddebfc 55%, #cfe1f7 100%)",
  gridLine: "rgba(29,78,216,0.11)",
  text: "#0f2b4a",
  sub: "#46628a",
  faint: "#8fadd2",
  accent: "#1d4ed8",
  titleGrad: "linear-gradient(90deg,#1e3a8a,#2563eb)",
  cardBg: "rgba(255,255,255,0.62)",
  cardBorder: "rgba(29,78,216,0.22)",
  chipBg: "rgba(29,78,216,0.07)",
  chipText: "#33517d",
  chipBorder: "rgba(29,78,216,0.20)",
};

export function useBlueprintTokens(isDark: boolean): BlueprintTokens {
  return isDark ? BP_DARK : BP_LIGHT;
}

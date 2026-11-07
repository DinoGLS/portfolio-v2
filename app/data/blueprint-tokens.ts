import { usePalette } from "@/app/lib/palette";
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
  pageBg: "radial-gradient(120% 95% at 50% 0%, #efeaf6 0%, #e5def0 55%, #dbd2e8 100%)",
  gridLine: "rgba(106,80,191,0.09)",
  text: "#2a2540",
  sub: "#5a5272",
  faint: "#9a90b3",
  accent: "#6a50bf",
  titleGrad: "linear-gradient(90deg,#4a3d8a,#7a5ab5)",
  cardBg: "rgba(246,243,250,0.72)",
  cardBorder: "rgba(110,90,160,0.24)",
  chipBg: "rgba(106,80,191,0.08)",
  chipText: "#4a3d7a",
  chipBorder: "rgba(106,80,191,0.22)",
};

export const BP_NEIGE: BlueprintTokens = {
  pageBg: "radial-gradient(120% 95% at 50% 0%, #ffffff 0%, #f4f5fb 55%, #eceef8 100%)",
  gridLine: "rgba(31,26,46,0.07)",
  text: "#1f1a2e",
  sub: "#5c5968",
  faint: "#8a8998",
  accent: "#aa0003",
  titleGrad: "linear-gradient(90deg,#aa0003,#7a0002)",
  cardBg: "rgba(255,255,255,0.82)",
  cardBorder: "rgba(31,26,46,0.16)",
  chipBg: "rgba(31,26,46,0.05)",
  chipText: "#3d3a4d",
  chipBorder: "rgba(31,26,46,0.18)",
};

export function useBlueprintTokens(isDark: boolean): BlueprintTokens {
  const palette = usePalette();
  if (isDark) return BP_DARK;
  return palette === "neige" ? BP_NEIGE : BP_LIGHT;
}

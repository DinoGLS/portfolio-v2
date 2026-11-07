"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "@/app/providers/ThemeProvider";
import { couleurNeige } from "@/app/lib/couleurs";

// Palette du mode clair : "neige" (blanc neige + rouge inferno, style ecole.gls, défaut) ou "aube" (lavande).
// ?palette=aube dans l'adresse (mémorisé) ; ?palette=neige revient au défaut.
export type Palette = "aube" | "neige";



function subscribe(cb: () => void) {
  const obs = new MutationObserver(cb);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-palette"] });
  return () => obs.disconnect();
}
const getSnapshot = (): Palette => (document.documentElement.dataset.palette === "aube" ? "aube" : "neige");
const getServerSnapshot = (): Palette => "neige";

export function usePalette(): Palette {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// Couleur de donnée adaptée au thème courant (voir lib/couleurs.ts)
export function useCouleur(): (c: string) => string {
  const { theme } = useTheme();
  const palette = usePalette();
  return (c: string) => (theme === "dark" || palette !== "neige" ? c : couleurNeige(c) ?? c);
}

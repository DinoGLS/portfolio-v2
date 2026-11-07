"use client";

import { STATUT, STATUTS } from "@/app/data/statut";
import { useTheme } from "@/app/providers/ThemeProvider";

// Point lumineux du statut (vert / rouge / bleu selon app/data/statut.ts).
// En clair, le bleu « ouvert » devient graphite : le rouge est réservé à « indisponible ».
export default function PastilleStatut({ taille = 10 }: { taille?: number }) {
  const { theme } = useTheme();
  const base = STATUTS[STATUT].couleur;
  const c = theme !== "dark" && base.toLowerCase() === "#3b82f6" ? "#5c5968" : base;
  return (
    <span
      aria-hidden
      className="statut-pastille inline-block rounded-full flex-none"
      style={{ width: taille, height: taille, background: c, ["--statut" as string]: c }}
    />
  );
}

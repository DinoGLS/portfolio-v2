import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import embarque from "@/app/data/apprentissage.json";

// Données de la section Apprentissage. Sur le serveur, un cron régénère toutes les 30 min le fichier pointé par
// APPRENTISSAGE_FILE (monté en lecture seule dans le conteneur) à partir du suivi de progression.
// Si le fichier manque ou est invalide, on sert la copie embarquée dans le site : la page ne casse jamais.
export const dynamic = "force-dynamic";

const FICHIER = process.env.APPRENTISSAGE_FILE;

function valide(x: unknown): x is typeof embarque {
  const d = x as typeof embarque | null;
  return !!d && Array.isArray(d.notions) && d.notions.length > 0 && !!d.heures && typeof d.heures.total === "number" && !!d.compteurs && typeof d.genere === "string";
}

export async function GET() {
  if (FICHIER) {
    try {
      const j = JSON.parse(await fs.readFile(FICHIER, "utf8"));
      if (valide(j)) return NextResponse.json(j, { headers: { "Cache-Control": "public, max-age=300" } });
    } catch {
      /* repli sur la copie embarquée */
    }
  }
  return NextResponse.json(embarque, { headers: { "Cache-Control": "public, max-age=300" } });
}

import { STATUT, STATUTS } from "@/app/data/statut";

// Point lumineux du statut (vert / rouge / bleu selon app/data/statut.ts).
export default function PastilleStatut({ taille = 10 }: { taille?: number }) {
  const c = STATUTS[STATUT].couleur;
  return (
    <span
      aria-hidden
      className="statut-pastille inline-block rounded-full flex-none"
      style={{ width: taille, height: taille, background: c, ["--statut" as string]: c }}
    />
  );
}

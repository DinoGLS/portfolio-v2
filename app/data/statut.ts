// Statut affiché sur le portfolio (point lumineux sous l'icône mail, et en haut de l'accueil sur téléphone).
// Pour le changer : modifier STATUT ci-dessous.
//   "disponible"   -> vert  : disponible stage / alternance
//   "indisponible" -> rouge : plus disponible
//   "ouvert"       -> bleu  : ouvert aux opportunités
export type Statut = "disponible" | "indisponible" | "ouvert";

export const STATUT: Statut = "disponible";

export const STATUTS: Record<Statut, { fr: string; en: string; couleur: string }> = {
  disponible: { fr: "Disponible — Stage / Alternance", en: "Available — Internship / Apprenticeship", couleur: "#22c55e" },
  indisponible: { fr: "Indisponible — Stage / Alternance", en: "Unavailable — Internship / Apprenticeship", couleur: "#ef4444" },
  ouvert: { fr: "Ouvert aux opportunités", en: "Open to opportunities", couleur: "#3b82f6" },
};

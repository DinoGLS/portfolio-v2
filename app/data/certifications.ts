// ─── Certifications ────────────────────────────────────────────────────────
// Source : profil LinkedIn de Garlens (lu le 07/11/2026) et images des attestations.
// Pour en ajouter une : déposer l'image (JPG, < 300 Ko) dans public/formation/ et ajouter une entrée ci-dessous
// (id, organisme, court, titre, date, appris, image). La grille s'agrandit toute seule.

export interface Loc { fr: string; en: string }

export interface Certification {
  id: string;
  organisme: string;
  /** Titre complet (affiché dans la fenêtre de détail) */
  titre: Loc;
  /** Titre court (affiché sur la carte) */
  court: Loc;
  date: Loc;
  appris: Loc;
  /** Image de l'attestation, chemin public (ex. /formation/attestation-cnil.jpg) */
  image?: string;
}

export const CERTIFICATIONS: Certification[] = [
  {
    id: "cnil",
    organisme: "CNIL",
    court: { fr: "Atelier RGPD · module 1", en: "GDPR Workshop · module 1" },
    titre: { fr: "MOOC « Atelier RGPD » : module 1, le RGPD et ses notions clés", en: "MOOC 'GDPR Workshop': module 1, the GDPR and its key notions" },
    date: { fr: "23 janv. 2026 · score 81 %", en: "23 Jan 2026 · score 81%" },
    image: "/formation/attestation-cnil.jpg",
    appris: {
      fr: "Les notions clés du RGPD, les principes de protection des données (minimisation, sécurité, durée de conservation), les responsabilités de chacun (responsable de traitement, sous-traitant), les bases de la mise en conformité et le rôle du DPO.",
      en: "Key GDPR notions, data protection principles (minimisation, security, retention), each party's responsibilities (controller, processor), the basics of compliance and the role of the DPO.",
    },
  },
  {
    id: "anssi",
    organisme: "ANSSI",
    court: { fr: "SecNumacadémie · 4 modules", en: "SecNumacadémie · 4 modules" },
    titre: { fr: "SecNumacadémie : initiation à la cybersécurité (4 modules)", en: "SecNumacadémie: introduction to cybersecurity (4 modules)" },
    date: { fr: "23 janv. 2026 · scores de 86 à 88 %", en: "23 Jan 2026 · scores 86 to 88%" },
    image: "/formation/attestation-anssi.jpg",
    appris: {
      fr: "Les bases de la sécurité des systèmes d'information, la protection des comptes (authentification, mots de passe), les bons réflexes sur Internet, et comment sécuriser un poste de travail et l'usage nomade (ordinateur, clés USB, Wi-Fi).",
      en: "The basics of information systems security, account protection (authentication, passwords), good habits online, and how to secure a workstation and mobile use (laptop, USB keys, Wi-Fi).",
    },
  },
];

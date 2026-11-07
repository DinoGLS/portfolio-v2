// ─── Formations et certifications ──────────────────────────────────────────
// Source : profil LinkedIn de Garlens (lu le 07/11/2026). Pour ajouter une pièce justificative :
// déposer l'image (JPG/PNG, < 300 Ko) dans public/formation/ et renseigner `image` ci-dessous.

export interface Loc { fr: string; en: string }

export interface Formation {
  id: string;
  ecole: string;
  titre: Loc;
  periode: Loc;
  statut?: Loc;
  note?: Loc;
  /** Image du diplôme ou de l'attestation, chemin public (ex. /formation/bts.jpg) */
  image?: string;
}

export interface Certification {
  id: string;
  organisme: string;
  titre: Loc;
  date: Loc;
  appris: Loc;
  /** Image de l'attestation, chemin public (ex. /formation/cnil.jpg) */
  image?: string;
}

export const FORMATIONS: Formation[] = [
  {
    id: "bts",
    ecole: "ESUP",
    titre: { fr: "BTS Services informatiques aux organisations, option SISR", en: "BTS in IT services for organisations, SISR option (systems and networks)" },
    periode: { fr: "sept. 2025 – juil. 2027", en: "Sep 2025 – Jul 2027" },
    statut: { fr: "en cours", en: "in progress" },
    note: { fr: "Systèmes, réseaux, cybersécurité. Projet de fin d'année : une infrastructure complète sur un serveur dédié.", en: "Systems, networks, cybersecurity. Final-year project: a complete infrastructure on a dedicated server." },
  },
  {
    id: "esiea",
    ecole: "ESIEA",
    titre: { fr: "Cycle préparatoire du diplôme d'ingénieur", en: "Preparatory cycle of the engineering degree" },
    periode: { fr: "sept. 2021 – juin 2022", en: "Sep 2021 – Jun 2022" },
    note: { fr: "Bases scientifiques, Python, ingénierie des réseaux.", en: "Scientific foundations, Python, network engineering." },
  },
  {
    id: "bac",
    ecole: "Lycée Jean Zay",
    titre: { fr: "Baccalauréat général, mathématiques et physique-chimie", en: "General baccalaureate, mathematics and physics-chemistry" },
    periode: { fr: "sept. 2018 – juil. 2021", en: "Sep 2018 – Jul 2021" },
  },
];

export const CERTIFICATIONS: Certification[] = [
  {
    id: "cnil",
    organisme: "CNIL",
    titre: { fr: "MOOC « Atelier RGPD »", en: "MOOC 'GDPR Workshop'" },
    date: { fr: "janv. 2026", en: "Jan 2026" },
    appris: {
      fr: "Les notions clés du RGPD, les principes de protection des données (minimisation, sécurité, durée de conservation), les responsabilités de chacun (responsable de traitement, sous-traitant), les bases de la mise en conformité et le rôle du DPO.",
      en: "Key GDPR notions, data protection principles (minimisation, security, retention), each party's responsibilities (controller, processor), the basics of compliance and the role of the DPO.",
    },
  },
  {
    id: "anssi",
    organisme: "ANSSI",
    titre: { fr: "SecNumacadémie : initiation à la cybersécurité", en: "SecNumacadémie: introduction to cybersecurity" },
    date: { fr: "janv. 2026", en: "Jan 2026" },
    appris: {
      fr: "Les bases de la sécurité des systèmes d'information, la protection des comptes (authentification, mots de passe), les bons réflexes sur Internet, et comment sécuriser un poste de travail et l'usage nomade (ordinateur, clés USB, Wi-Fi).",
      en: "The basics of information systems security, account protection (authentication, passwords), good habits online, and how to secure a workstation and mobile use (laptop, USB keys, Wi-Fi).",
    },
  },
];

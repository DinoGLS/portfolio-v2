// ─── Source unique des données projets ─────────────────────────────────────
// Importé par page.tsx (grille accueil) ET par chaque projects/*/page.tsx
// Modifier ici = mis à jour partout.

export interface Project {
  slug: string;
  tag: string;
  tagEn: string;
  title: string;
  titleEn: string;
  desc: string;
  descEn: string;
  stack: string;
  href: string;
  preview: string;
  badge: string;
  badgeEn: string;
  badgeColor: string;
  /** Mis en avant dans le bloc « Mes laboratoires » */
  featured?: boolean;
  /** Détails du bloc laboratoires (schéma, points clés, livrables) */
  lab?: LabInfo;
}

export interface LabInfo {
  schema: string;
  points: { fr: string; en: string }[];
  /** Livrables disponibles (fichiers publics) */
  livrables: { label: { fr: string; en: string }; href: string }[];
}

export interface ThemeGroup {
  id: string;
  labelFr: string;
  labelEn: string;
  color: string;
  projects: Project[];
}

export const THEMES_DATA: ThemeGroup[] = [
  {
    id: "infra",
    labelFr: "Infrastructure & Réseau",
    labelEn: "Infrastructure & Network",
    color: "#3b82f6",
    projects: [
      {
        slug: "lab-draken",
        tag: "HOMELAB · PROXMOX · IAC",
        tagEn: "HOMELAB · PROXMOX · IAC",
        title: "Lab Draken — mon homelab Proxmox",
        titleEn: "Lab Draken — my Proxmox homelab",
        desc: "Mon serveur personnel : Proxmox VE, pare-feu OPNsense, réseau segmenté, une vingtaine de services Docker, le tout piloté par Terraform + Ansible et déployé par une CI Gitea.",
        descEn: "My personal server: Proxmox VE, OPNsense firewall, segmented network, about twenty Docker services, all driven by Terraform + Ansible and deployed by a Gitea CI.",
        stack: "Proxmox VE · OPNsense · Terraform · Ansible · Docker · Traefik · Gitea",
        href: "/projects/lab-draken",
        preview: "/projects/lab-draken/schema-draken.svg",
        badge: "En production",
        badgeEn: "Live",
        badgeColor: "violet",
        featured: true,
        lab: {
          schema: "/projects/lab-draken/schema-draken.svg",
          points: [
            { fr: "3 VM et 4 conteneurs LXC actifs derrière OPNsense, 4 réseaux isolés (WAN, lab, AD, DMZ)", en: "3 VMs and 4 LXC containers behind OPNsense, 4 isolated networks (WAN, lab, AD, DMZ)" },
            { fr: "Reverse proxy Traefik en HTTPS local, DNS interne, supervision à 24 moniteurs", en: "Traefik reverse proxy with local HTTPS, internal DNS, 24 monitors" },
            { fr: "Déploiement automatique à chaque push (Gitea Actions) ; migration depuis l'ancien serveur terminée en juillet 2026", en: "Automatic deployment on every push (Gitea Actions); migration from the old server done in July 2026" },
          ],
          livrables: [
            { label: { fr: "Architecture réseau et OPNsense", en: "Network architecture and OPNsense" }, href: "/projects/lab-draken/OPNsense et architecture reseau.pdf" },
            { label: { fr: "Services hébergés et configuration", en: "Hosted services and configuration" }, href: "/projects/lab-draken/Services heberges et configuration.pdf" },
            { label: { fr: "Déploiement et transfert des serveurs", en: "Server deployment and migration" }, href: "/projects/lab-draken/Deploiement et transfert des serveurs.pdf" },
          ],
        },
      },
      {
        slug: "lab-ecole",
        tag: "ÉCOLE · SISR · PROXMOX",
        tagEn: "SCHOOL · SISR · PROXMOX",
        title: "Projet SISR — l'infrastructure de l'école",
        titleEn: "SISR project — the school infrastructure",
        desc: "Un serveur Proxmox dédié, 4 VM : pare-feu OPNsense, Active Directory, GLPI et Kanboard, supervision Zabbix. Construit pas à pas pour couvrir l'annexe II.E du BTS.",
        descEn: "A dedicated Proxmox server, 4 VMs: OPNsense firewall, Active Directory, GLPI and Kanboard, Zabbix monitoring. Built step by step to cover the BTS appendix II.E.",
        stack: "Proxmox VE · OPNsense · Active Directory · GLPI · Zabbix · Debian",
        href: "/projects/lab-ecole",
        preview: "/projects/lab-ecole/schema-serverecole.svg",
        badge: "En cours",
        badgeEn: "In progress",
        badgeColor: "amber",
        featured: true,
        lab: {
          schema: "/projects/lab-ecole/schema-serverecole.svg",
          points: [
            { fr: "Phases 0 à 2 faites : pare-feu, domaine AD avec politique de mot de passe, GLPI, Kanboard, PostgreSQL, Zabbix (4 hôtes, OPNsense en SNMP)", en: "Phases 0 to 2 done: firewall, AD domain with password policy, GLPI, Kanboard, PostgreSQL, Zabbix (4 hosts, OPNsense over SNMP)" },
            { fr: "DHCP en place sur le contrôleur de domaine (offre vérifiée le 07/11)", en: "DHCP running on the domain controller (offer verified on 07/11)" },
            { fr: "Reste : répartiteur de charge en DMZ, sauvegarde et plan de reprise (en attente d'un NAS), documentation finale", en: "Remaining: DMZ load balancer, backup and recovery plan (waiting for a NAS), final documentation" },
          ],
          livrables: [],
        },
      },
      {
        slug: "ad-proxmox",
        tag: "INFRA · ACTIVE DIRECTORY",
        tagEn: "INFRA · ACTIVE DIRECTORY",
        title: "Lab Active Directory sur mon Proxmox",
        titleEn: "Active Directory lab on my Proxmox",
        desc: "Un domaine complet sur un segment isolé de mon homelab. Les VM ont été supprimées : je le recrée de zéro pour le documenter proprement.",
        descEn: "A full domain on an isolated segment of my homelab. The VMs were deleted: I am rebuilding it from scratch to document it properly.",
        stack: "Windows Server · Proxmox · DNS · DHCP · GPO",
        href: "/projects/ad-proxmox",
        preview: "/projects/ad-proxmox/schema-ad.svg",
        badge: "À recréer",
        badgeEn: "To rebuild",
        badgeColor: "amber",
        featured: true,
        lab: {
          schema: "/projects/ad-proxmox/schema-ad.svg",
          points: [
            { fr: "Segment réseau dédié (vmbr2) déjà prêt derrière OPNsense", en: "Dedicated network segment (vmbr2) already in place behind OPNsense" },
            { fr: "Cible : contrôleur Windows Server 2022 + poste Windows 11 joint au domaine, utilisateurs, groupes et GPO", en: "Target: Windows Server 2022 controller + Windows 11 workstation joined to the domain, users, groups and GPOs" },
          ],
          livrables: [],
        },
      },
      {
        slug: "wan-simulation",
        tag: "SÉCURITÉ · RÉSEAUX · CISCO",
        tagEn: "SECURITY · NETWORKS · CISCO",
        title: "Simulation WAN — supervision & redondance Cisco",
        titleEn: "WAN Simulation — Cisco monitoring & redundancy",
        desc: "Réseau d'entreprise avec OSPF, HSRP, SNMP, VLANs et ACLs.",
        descEn: "Enterprise network with OSPF, HSRP, SNMP, VLANs and ACLs.",
        stack: "OSPF · HSRP · SNMP · VLAN · ACL · Cisco",
        href: "/projects/wan-simulation",
        preview: "/projects/wan-simulation/configwan.png",
        badge: "Terminé",
        badgeEn: "Done",
        badgeColor: "emerald",
      },
    ],
  },
  {
    id: "logiciel",
    labelFr: "Logiciel & Dev",
    labelEn: "Software & Dev",
    color: "#f59e0b",
    projects: [
      {
        slug: "ecole",
        tag: "DEV · PWA · BTS SISR",
        tagEn: "DEV · PWA · BTS SISR",
        title: "École : cours, révisions et épreuves",
        titleEn: "École: courses, revision and exams",
        desc: "Cours en sections, quiz, épreuves notées, suivi de révision et suivi du projet SISR (exigences, kanban, captures, livrables). Synchronisé depuis mes notes Obsidian.",
        descEn: "Sectioned courses, quizzes, graded exams, revision tracking and SISR project tracking (requirements, kanban, screenshots, deliverables). Synced from my Obsidian notes.",
        stack: "Node.js · PostgreSQL · PWA · Docker",
        href: "/projects/ecole",
        preview: "/projects/ecole/preview.jpg",
        badge: "En production",
        badgeEn: "Live",
        badgeColor: "violet",
      },
      {
        slug: "docforge",
        tag: "IA · DEVOPS · BTS SISR",
        tagEn: "AI · DEVOPS · BTS SISR",
        title: "DocForge — Générateur de livrables",
        titleEn: "DocForge — Document generator",
        desc: "Mes notes brutes deviennent un livrable PDF mis en page : Flask, modèles de langage, Pandoc et WeasyPrint, hébergé sur mon serveur Draken.",
        descEn: "My raw notes become a formatted PDF deliverable: Flask, language models, Pandoc and WeasyPrint, hosted on my Draken server.",
        stack: "Python · Flask · Groq · Gemini · Docker · Linux",
        href: "/projects/docforge",
        preview: "/projects/docforge/preview.jpg",
        badge: "En production",
        badgeEn: "Live",
        badgeColor: "violet",
      },
      {
        slug: "biblio",
        tag: "DEV · PWA · OBSIDIAN",
        tagEn: "DEV · PWA · OBSIDIAN",
        title: "Bibliothèque : mes notes lues comme des livres",
        titleEn: "Library: my notes read like books",
        desc: "Mes notes de connaissances publiées en livres lisibles et utilisables hors ligne, rangés par rayons.",
        descEn: "My knowledge notes published as readable books, usable offline, shelved by topic.",
        stack: "Python · PWA · nginx · Docker",
        href: "/projects/biblio",
        preview: "/projects/biblio/preview.jpg",
        badge: "En production",
        badgeEn: "Live",
        badgeColor: "violet",
      },
      {
        slug: "news",
        tag: "IA · VEILLE · AUTOMATISATION",
        tagEn: "AI · WATCH · AUTOMATION",
        title: "News : veille technologique triée par IA",
        titleEn: "News: AI-sorted tech watch",
        desc: "Flux d'actualité cyber et tech triés par un modèle de langage, avec un résumé quotidien sur Telegram.",
        descEn: "Cyber and tech news feeds sorted by a language model, with a daily Telegram digest.",
        stack: "Groq · RSS · Telegram · Docker",
        href: "/projects/news",
        preview: "/projects/news/preview.jpg",
        badge: "En production",
        badgeEn: "Live",
        badgeColor: "violet",
      },
      {
        slug: "generateur-cv",
        tag: "DEV · IA · OUTIL",
        tagEn: "DEV · AI · TOOL",
        title: "Générateur de CV",
        titleEn: "CV Generator",
        desc: "App Flask qui génère CV et lettres HTML/PDF adaptés à chaque offre (Playwright, Groq), avec une page de saisie des données.",
        descEn: "Flask app generating HTML/PDF resumes and cover letters tailored to each job offer (Playwright, Groq), with a data entry page.",
        stack: "Flask · Groq · Playwright · ColourThief",
        href: "/projects/generateur-cv",
        preview: "/projects/generateur-cv/logo-cv-generator-v2.png",
        badge: "Terminé",
        badgeEn: "Done",
        badgeColor: "emerald",
      },
      {
        slug: "automation-scripts",
        tag: "AUTOMATISATION · SCRIPTS",
        tagEn: "AUTOMATION · SCRIPTS",
        title: "USB Toolkit — Boîte à outils portable",
        titleEn: "USB Toolkit — Portable admin tools",
        desc: "Suite PowerShell/Python avec interface WPF sur clef USB.",
        descEn: "PowerShell/Python suite with WPF GUI on a USB key.",
        stack: "PowerShell · Python · Flask · Pandoc · Playwright",
        href: "/projects/automation-scripts",
        preview: "/projects/usb-toolkit/automat.png",
        badge: "Terminé",
        badgeEn: "Done",
        badgeColor: "emerald",
      },
    ],
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Tous les projets à plat */
export const ALL_PROJECTS = THEMES_DATA.flatMap((t) => t.projects);

/** Retrouve un projet par son slug */
export function getProjectBySlug(slug: string): Project | undefined {
  return ALL_PROJECTS.find((p) => p.slug === slug);
}

/** Styles des badges */
export const BADGE_STYLES: Record<string, string> = {
  emerald: "bg-blue-600/15 dark:bg-emerald-500/15 text-blue-600 border-blue-500/30 dark:text-blue-300",
  violet:  "bg-violet-500/15 text-violet-600 border-violet-500/30 dark:text-violet-300",
  amber:   "bg-amber-500/15 text-amber-600 border-amber-500/30 dark:text-amber-300",
};

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
    labelFr: "Infrastructure & Réseaux",
    labelEn: "Infrastructure & Networks",
    color: "#3b82f6",
    projects: [
      {
        slug: "ad-proxmox",
        tag: "INFRA · ACTIVE DIRECTORY",
        tagEn: "INFRA · ACTIVE DIRECTORY",
        title: "Lab Active Directory sous Proxmox",
        titleEn: "Active Directory lab on Proxmox",
        desc: "Domaine AD complet — utilisateurs, GPO, DNS/DHCP sous Proxmox VE.",
        descEn: "Full AD domain — users, GPOs, DNS/DHCP on Proxmox VE.",
        stack: "Windows Server · Proxmox · DNS · DHCP · GPO",
        href: "/projects/ad-proxmox",
        preview: "/projects/ad-proxmox/ad_proxmox.png",
        badge: "En cours",
        badgeEn: "In progress",
        badgeColor: "amber",
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
    id: "auto",
    labelFr: "Automatisation & Outils",
    labelEn: "Automation & Tools",
    color: "#10b981",
    projects: [
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
  {
    id: "ia",
    labelFr: "IA & DevOps",
    labelEn: "AI & DevOps",
    color: "#a855f7",
    projects: [
      {
        slug: "docforge",
        tag: "IA · DEVOPS · BTS SISR",
        tagEn: "AI · DEVOPS · BTS SISR",
        title: "DocForge — Générateur de livrables",
        titleEn: "DocForge — Document generator",
        desc: "Flask + Groq/Gemini + Pandoc + WeasyPrint déployé sur HP Server.",
        descEn: "Flask + Groq/Gemini + Pandoc + WeasyPrint on HP Server.",
        stack: "Python · Flask · Groq · Gemini · Docker · Linux",
        href: "/projects/docforge",
        preview: "/projects/docforge/placeholder.svg",
        badge: "En production",
        badgeEn: "Live",
        badgeColor: "violet",
      },
    ],
  },
  {
    id: "dev",
    labelFr: "Dev & DevSecOps",
    labelEn: "Dev & DevSecOps",
    color: "#f59e0b",
    projects: [
      {
        slug: "n-core",
        tag: "DEV · MOBILE · SÉCURITÉ",
        tagEn: "DEV · MOBILE · SECURITY",
        title: "N.C0re — App fitness chiffrée offline-first",
        titleEn: "N.C0re — Encrypted offline-first fitness app",
        desc: "App mobile React Native. Données de santé chiffrées AES-256-GCM, clé dans le trousseau natif, IA locale sans serveur.",
        descEn: "React Native mobile app. Health data encrypted with AES-256-GCM, key in the native keychain, on-device AI, no server.",
        stack: "React Native · Expo · TypeScript · AES-256-GCM · Zustand · WebGL",
        href: "/projects/n-core",
        preview: "/projects/n-core/programme.png",
        badge: "En cours",
        badgeEn: "In progress",
        badgeColor: "amber",
      },
      {
        slug: "generateur-cv",
        tag: "DEV · IA · OUTIL",
        tagEn: "DEV · AI · TOOL",
        title: "Générateur de CV",
        titleEn: "CV Generator",
        desc: "App Flask qui génère CV et lettres HTML/PDF personnalisés avec ColourThief, Playwright et Groq.",
        descEn: "Flask app generating custom HTML/PDF resumes and cover letters with ColourThief, Playwright and Groq.",
        stack: "Flask · Groq · Playwright · ColourThief",
        href: "/projects/generateur-cv",
        preview: "/projects/generateur-cv/placeholder.svg",
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
  emerald: "bg-emerald-500/15 text-blue-600 border-blue-500/30 dark:text-blue-300",
  violet:  "bg-violet-500/15 text-violet-600 border-violet-500/30 dark:text-violet-300",
  amber:   "bg-amber-500/15 text-amber-600 border-amber-500/30 dark:text-amber-300",
};

// Tableau de synthèse E5 (session 2027). Même contenu que le PDF public/documents/Tableau_synthese_E5_Charles_Garlens.pdf.
// c = numéros des compétences cochées (C1 à C6). Une période vide = pas encore renseignée.
export interface Realisation {
  bloc: "formation" | "perso";
  titre: string;
  contexte: string;
  periode: string;
  c: number[];
}

export const COMPETENCES = [
  { n: 1, fr: "Patrimoine", en: "Assets" },
  { n: 2, fr: "Incidents", en: "Incidents" },
  { n: 3, fr: "Présence en ligne", en: "Online presence" },
  { n: 4, fr: "Mode projet", en: "Project mode" },
  { n: 5, fr: "Service", en: "Service" },
  { n: 6, fr: "Développement pro", en: "Career growth" },
];

export const REALISATIONS: Realisation[] = [
  { bloc: "formation", titre: "Simulation réseau WAN Cisco avec redondance HSRP", contexte: "GNS3 / Packet Tracer, 2 entités, VLANs, OSPF", periode: "09/2025 – 06/2026", c: [1, 4, 5] },
  { bloc: "formation", titre: "Déploiement Active Directory", contexte: "Windows Server 2022, GPO, DNS/DHCP, 2 contrôleurs de domaine", periode: "10/2025 – 05/2026", c: [1, 2, 4, 5] },
  { bloc: "formation", titre: "Veille sécurité et ANSSI SecNumAcadémie", contexte: "Certifications ANSSI et CNIL-RGPD", periode: "09/2025 – 06/2026", c: [1, 6] },
  { bloc: "formation", titre: "Déploiement Proxmox VE", contexte: "Cluster 2 nœuds, ZFS, QDevice", periode: "", c: [1, 4, 5] },
  { bloc: "formation", titre: "Annuaire OpenLDAP centralisé", contexte: "Authentification GLPI, Kanboard, Nextcloud, LDAPS", periode: "", c: [1, 5] },
  { bloc: "formation", titre: "GLPI sous Docker", contexte: "Gestion de parc et helpdesk", periode: "", c: [1, 2, 5] },
  { bloc: "formation", titre: "Kanboard sous Docker", contexte: "Gestion de projet en Kanban, LDAP", periode: "", c: [1, 4, 5] },
  { bloc: "formation", titre: "Supervision Zabbix", contexte: "SNMP, triggers, tableaux de bord", periode: "", c: [1, 2, 5] },
  { bloc: "formation", titre: "Pare-feu pfSense", contexte: "VLAN, NAT, OpenVPN, portail captif RADIUS", periode: "", c: [1, 4, 5] },
  { bloc: "formation", titre: "Réseau Cisco sur matériel physique", contexte: "VLAN 802.1Q, OSPF/RIP, ACL", periode: "", c: [1, 4, 5] },
  { bloc: "formation", titre: "NAS TrueNAS Scale", contexte: "RAID-Z1, ACL liées à l'AD, réplication ZFS", periode: "", c: [1, 5] },
  { bloc: "formation", titre: "Serveur LAMP durci", contexte: "Apache, MySQL, PHP, fail2ban, UFW, TLS", periode: "", c: [1, 5] },
  { bloc: "formation", titre: "Laboratoires VirtualBox", contexte: "Zones LAN/DMZ/WAN, snapshots, clones", periode: "", c: [2, 4, 5] },
  { bloc: "formation", titre: "Durcissement Active Directory", contexte: "GPO, FGPP, délégation, nettoyage DNS", periode: "05/2026", c: [1, 2] },
  { bloc: "perso", titre: "Outil de diagnostic IT (Python)", contexte: "Clé USB autonome : système, réseau, sécurité, AD", periode: "11/2025 – 01/2026", c: [1, 2, 4, 5, 6] },
  { bloc: "perso", titre: "Générateur de CV et de lettre (Flask + Playwright)", contexte: "Application web, PDF, déploiement Docker", periode: "12/2025 – 03/2026", c: [3, 4, 5, 6] },
  { bloc: "perso", titre: "Portfolio en ligne (Next.js / TypeScript)", contexte: "Tailwind, Framer Motion, SEO", periode: "09/2025 – 06/2026", c: [3, 4, 5, 6] },
  { bloc: "perso", titre: "AutoDoc Agent", contexte: "Agent Python multi-LLM, export Markdown", periode: "01/2026 – 03/2026", c: [4, 5, 6] },
  { bloc: "perso", titre: "Automatisation vidéo YouTube", contexte: "MoviePy, API YouTube v3, OAuth2", periode: "02/2026 – 04/2026", c: [3, 4, 5] },
  { bloc: "perso", titre: "SysRev, révision BTS SIO SISR", contexte: "HTML/JS, Groq, 6 modes d'entraînement", periode: "03/2026 – 05/2026", c: [4, 5, 6] },
];

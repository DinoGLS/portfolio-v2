import BlueprintProject, { BPData } from "@/app/components/projects/BlueprintProject";

// Projet de fin d'année SISR sur « serverecole » (état au 07/11/2026, source : notes du projet).
// Aucune adresse IP ni mot de passe sur cette page : site public.
const data: BPData = {
  tag: { fr: "ÉCOLE · SISR · PROXMOX", en: "SCHOOL · SISR · PROXMOX" },
  title: { fr: "Projet SISR — l'infrastructure de l'école", en: "SISR project — the school infrastructure" },
  subtitle: {
    fr: "L'école a des problèmes informatiques récurrents : j'ai monté sur un serveur dédié (un Dell OptiPlex Micro sous Proxmox VE) une infrastructure complète, avec pare-feu, annuaire, gestion de parc, tickets et supervision. Chaque service tourne vraiment et je garde une preuve pour chaque exigence de l'annexe II.E.",
    en: "The school has recurring IT problems: on a dedicated server (a Dell OptiPlex Micro running Proxmox VE) I built a full infrastructure with firewall, directory, asset management, ticketing and monitoring. Every service really runs and I keep proof for each requirement of appendix II.E."
  },
  status: { fr: "En cours", en: "In progress" },
  img: "/projects/lab-ecole/schema-serverecole.svg",
  badges: [
    { label: "Proxmox VE 9" },
    { label: "OPNsense" },
    { label: "Active Directory" },
    { label: "GLPI" },
    { label: "Zabbix" },
  ],
  stats: [
    { k: { fr: "VM en service", en: "VMs running" }, v: "4" },
    { k: { fr: "Zones réseau", en: "Network zones" }, v: "3" },
    { k: { fr: "Hôtes supervisés", en: "Monitored hosts" }, v: "4" },
    { k: { fr: "Phases faites", en: "Phases done" }, v: "PH.0 → PH.2" },
  ],
  toc: [
    { fr: "PH.0 — Pare-feu et réseau", en: "PH.0 — Firewall and network" },
    { fr: "PH.1 — Active Directory", en: "PH.1 — Active Directory" },
    { fr: "PH.2 — Services et supervision", en: "PH.2 — Services and monitoring" },
    { fr: "DHCP", en: "DHCP" },
  ],
  planned: [
    { fr: "PH.3 — Répartiteur de charge HAProxy devant deux serveurs web en DMZ", en: "PH.3 — HAProxy load balancer in front of two DMZ web servers" },
    { fr: "PH.4 — Sauvegarde et plan de reprise (il me faut un NAS pour une vraie copie externe)", en: "PH.4 — Backup and recovery plan (I need a NAS for a real off-site copy)" },
    { fr: "PH.5 — Documentation finale et démontage propre", en: "PH.5 — Final documentation and clean teardown" },
    { fr: "Joindre un poste client au domaine et prouver l'ouverture de session", en: "Join a client workstation to the domain and prove the login" },
  ],
  steps: [
    {
      num: "01",
      title: { fr: "PH.0 — Pare-feu et réseau", en: "PH.0 — Firewall and network" },
      subtitle: { fr: "OPNsense et trois zones", en: "OPNsense and three zones" },
      desc: {
        fr: "Le serveur arrive vierge : aucune VM, un seul pont réseau. Je crée trois ponts (réseau de l'école, zone AD, DMZ) et je place OPNsense au milieu comme routeur et pare-feu. Règle de départ : tout est refusé et journalisé, puis j'ouvre seulement ce qui est nécessaire (DNS et NTP vers le pare-feu, web vers Internet).",
        en: "The server arrives empty: no VM, a single network bridge. I create three bridges (school network, AD zone, DMZ) and put OPNsense in the middle as router and firewall. Starting rule: everything is denied and logged, then I only open what is needed (DNS and NTP to the firewall, web to the Internet)."
      },
      features: ["3 ponts réseau", "Refus par défaut", "Règles journalisées", "AD ↔ DMZ refusé"],
      lang: "bash",
      code: "# vérifier les règles actives et le trafic refusé\npfctl -sr | head\nconfigctl filter list rules",
    },
    {
      num: "02",
      title: { fr: "PH.1 — Active Directory", en: "PH.1 — Active Directory" },
      subtitle: { fr: "AD-DC01, Windows Server 2022", en: "AD-DC01, Windows Server 2022" },
      desc: {
        fr: "Un contrôleur de domaine Windows Server 2022 avec les services AD DS et DNS. J'y mets une politique de mot de passe et de verrouillage de compte (tentatives limitées, déverrouillage prévu), et un compte de secours séparé. Le contrôle de santé du domaine (dcdiag) valide l'ensemble ; il reste à regarder le détail de la réplication DFSR.",
        en: "A Windows Server 2022 domain controller with AD DS and DNS. I set a password and account lockout policy (limited attempts, planned unlock) and a separate emergency account. The domain health check (dcdiag) validates everything; the DFSR replication detail is still to review."
      },
      lang: "powershell",
      code: "dcdiag /q\nGet-ADDefaultDomainPasswordPolicy\nGet-ADFineGrainedPasswordPolicy -Filter *",
    },
    {
      num: "03",
      title: { fr: "PH.2 — Services et supervision", en: "PH.2 — Services and monitoring" },
      subtitle: { fr: "GLPI, Kanboard, Zabbix", en: "GLPI, Kanboard, Zabbix" },
      desc: {
        fr: "Deux VM Debian 12 jointes au domaine : l'une héberge GLPI (parc et tickets, avec des règles qui affectent un ticket au bon groupe selon sa catégorie et lui donnent ses délais), Kanboard, PostgreSQL et CrowdSec ; l'autre porte Zabbix, qui surveille quatre hôtes, dont le pare-feu en SNMP en lecture seule. Seul le port de l'agent Zabbix traverse la DMZ.",
        en: "Two Debian 12 VMs joined to the domain: one hosts GLPI (assets and tickets, with rules that assign a ticket to the right group by category and give it its deadlines), Kanboard, PostgreSQL and CrowdSec; the other runs Zabbix, monitoring four hosts including the firewall over read-only SNMP. Only the Zabbix agent port crosses the DMZ."
      },
      features: ["GLPI + règles de tickets", "Kanboard", "Zabbix · 4 hôtes", "CrowdSec"],
    },
    {
      num: "04",
      title: { fr: "DHCP", en: "DHCP" },
      subtitle: { fr: "Sur le contrôleur de domaine", en: "On the domain controller" },
      desc: {
        fr: "Le rôle DHCP est installé sur AD-DC01, avec une étendue d'adresses et ses options. J'ai vérifié l'offre côté réseau en capturant l'échange complet (découverte, offre, demande, acquittement). Il reste à joindre un vrai poste client au domaine pour la preuve finale.",
        en: "The DHCP role is installed on AD-DC01, with an address scope and its options. I checked the offer on the wire by capturing the full exchange (discover, offer, request, acknowledge). A real client workstation still has to join the domain for the final proof."
      },
      lang: "powershell",
      code: "Get-DhcpServerv4Scope\nGet-DhcpServerv4OptionValue",
    },
  ],
};

export default function LabEcolePage() {
  return <BlueprintProject variant="datasheet" data={data} />;
}

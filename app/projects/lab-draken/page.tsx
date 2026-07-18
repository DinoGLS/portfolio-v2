import BlueprintProject, { BPData } from "@/app/components/projects/BlueprintProject";

const data: BPData = {
  tag: { fr: "INFRA · HYPERVISEUR · IAC", en: "INFRA · HYPERVISOR · IAC" },
  title: { fr: "Lab Draken — Proxmox, OPNsense & Infrastructure as Code", en: "Lab Draken — Proxmox, OPNsense & Infrastructure as Code" },
  subtitle: {
    fr: "Migration d'un ancien serveur physique vers un nœud Proxmox VE self-hébergé : pare-feu OPNsense qui route et filtre entre 4 segments réseau (WAN/LAN/AD/DMZ), le tout entièrement piloté par Terraform (provider bpg) et Ansible — y compris le réseau lui-même.",
    en: "Migration from an old physical server to a self-hosted Proxmox VE node: an OPNsense firewall routing and filtering across 4 network segments (WAN/LAN/AD/DMZ), all driven by Terraform (bpg provider) and Ansible — including the network itself.",
  },
  status: { fr: "Terminé", en: "Done" },
  img: "/projects/lab-draken/placeholder.svg",
  badges: [
    { label: "Proxmox VE 9.2" },
    { label: "OPNsense" },
    { label: "Terraform" },
    { label: "Ansible" },
    { label: "bpg/proxmox" },
    { label: "Docker" },
  ],
  stats: [
    { k: { fr: "Segments réseau", en: "Network segments" }, v: "4" },
    { k: { fr: "Nœud Proxmox", en: "Proxmox node" }, v: "16 vCPU / 15 Gio" },
    { k: { fr: "VM + LXC actifs", en: "Active VM + LXC" }, v: "6" },
    { k: { fr: "IaC", en: "IaC" }, v: "Terraform + Ansible" },
  ],
  toc: [
    { fr: "Hyperviseur & pare-feu", en: "Hypervisor & firewall" },
    { fr: "Bastion IaC", en: "IaC bastion" },
    { fr: "Modules Terraform", en: "Terraform modules" },
    { fr: "Segmentation réseau", en: "Network segmentation" },
    { fr: "Validation", en: "Validation" },
  ],
  planned: [
    { fr: "Règles de pare-feu OPNsense d'isolation stricte AD→LAN et DMZ→LAN", en: "Strict OPNsense firewall isolation rules AD→LAN and DMZ→LAN" },
    { fr: "VM du lab Active Directory (DC Windows + client) par clonage Terraform d'un template sysprep", en: "Active Directory lab VMs (Windows DC + client) via Terraform clone of a sysprep template" },
    { fr: "Cibles DMZ (service vulnérable, honeypot) pour exercices d'intrusion isolés", en: "DMZ targets (vulnerable service, honeypot) for isolated intrusion exercises" },
    { fr: "DHCP par segment sur OPNsense (actuellement IP statiques)", en: "Per-segment DHCP on OPNsense (currently static IPs)" },
  ],
  steps: [
    {
      num: "01",
      color: "#4cc4ff",
      title: { fr: "OPNsense comme routeur du lab", en: "OPNsense as the lab router" },
      subtitle: { fr: "pare-feu virtualisé, WAN + LAN", en: "virtualized firewall, WAN + LAN" },
      desc: {
        fr: "OPNsense (VM 101) route et filtre tout le trafic entre le lab et Internet. Deux interfaces au départ : WAN (vmbr0, carte physique dédiée) et LAN (vmbr1, bridge interne 192.168.2.0/24).",
        en: "OPNsense (VM 101) routes and filters all traffic between the lab and the Internet. Two interfaces to start: WAN (vmbr0, dedicated physical NIC) and LAN (vmbr1, internal bridge 192.168.2.0/24).",
      },
      features: ["vmbr0 WAN", "vmbr1 LAN 192.168.2.0/24", "Gateway .1 par segment", "Blocage par défaut"],
      lang: "bash",
      code: "qm set 101 -net0 virtio,bridge=vmbr0\nqm set 101 -net1 virtio,bridge=vmbr1",
    },
    {
      num: "02",
      color: "#bfe3ff",
      title: { fr: "Bastion IaC — Terraform & Ansible", en: "IaC bastion — Terraform & Ansible" },
      subtitle: { fr: "CT 102 draken-admin", en: "CT 102 draken-admin" },
      desc: {
        fr: "Un LXC dédié pilote toute l'infrastructure en Infrastructure as Code. Terraform utilise le provider bpg/proxmox, authentifié par un token API stocké dans l'environnement — jamais dans les fichiers .tf versionnés. Ansible configure ensuite ce que Terraform provisionne.",
        en: "A dedicated LXC drives the whole infrastructure as code. Terraform uses the bpg/proxmox provider, authenticated with an API token kept in the environment — never in versioned .tf files. Ansible then configures what Terraform provisions.",
      },
      features: ["Provider bpg/proxmox", "Secrets hors code (env)", ".tfstate/.tfvars gitignore", "Ansible post-provisioning"],
    },
    {
      num: "03",
      color: "#4cc4ff",
      title: { fr: "Modules Terraform réutilisables", en: "Reusable Terraform modules" },
      subtitle: { fr: "lxc & vm génériques", en: "generic lxc & vm modules" },
      desc: {
        fr: "Plutôt que de dupliquer du code pour chaque service, un module lxc générique (unprivileged, cpu/mémoire/disque configurables, IP statique) et un module vm (cloud-init Debian 13) couvrent tous les déploiements — edge, dns, git, db, apps.",
        en: "Rather than duplicating code per service, a generic lxc module (unprivileged, configurable cpu/memory/disk, static IP) and a vm module (Debian 13 cloud-init) cover every deployment — edge, dns, git, db, apps.",
      },
      features: ["Module lxc réutilisable", "Module vm cloud-init", "Nouveau service = quelques lignes", "Pas de copier-coller"],
      lang: "hcl",
      code: 'module "edge" {\n  source     = "./modules/lxc"\n  vm_id      = 110\n  bridge     = "vmbr1"\n  ip_address = "192.168.2.10/24"\n}',
    },
    {
      num: "04",
      color: "#bfe3ff",
      title: { fr: "Segmentation réseau AD / DMZ par Terraform", en: "AD / DMZ network segmentation via Terraform" },
      subtitle: { fr: "bridges isolés, ports = []", en: "isolated bridges, ports = []" },
      desc: {
        fr: "Un module network dédié crée les bridges vmbr2 (AD, 192.168.10.0/24) et vmbr3 (DMZ, 192.168.20.0/24) via la ressource proxmox_virtual_environment_network_linux_bridge du provider bpg — sans carte physique attachée. Terraform ne gère que le nouveau ; vmbr0/vmbr1, créés à la main avant Terraform, restent en gestion manuelle pour éviter un drift de state destructeur sur un lab qui doit rester joignable.",
        en: "A dedicated network module creates the vmbr2 (AD, 192.168.10.0/24) and vmbr3 (DMZ, 192.168.20.0/24) bridges via the bpg provider's proxmox_virtual_environment_network_linux_bridge resource — no physical NIC attached. Terraform only manages what's new; vmbr0/vmbr1, created by hand before Terraform, stay manually managed to avoid a destructive state drift on a lab that must stay reachable.",
      },
      features: ["vmbr2 AD isolé", "vmbr3 DMZ isolé", "ports = [] (sans NIC physique)", "vmbr0/vmbr1 hors state Terraform"],
      lang: "hcl",
      code: 'resource "proxmox_virtual_environment_network_linux_bridge" "ad" {\n  node_name = var.node_name\n  name      = "vmbr2"\n  ports     = []\n  autostart = true\n}',
    },
    {
      num: "05",
      color: "#4cc4ff",
      title: { fr: "Rattachement des segments à OPNsense", en: "Attaching the segments to OPNsense" },
      subtitle: { fr: "2 NIC virtuelles + réénumération PCI", en: "2 virtual NICs + PCI re-enumeration" },
      desc: {
        fr: "OPNsense reçoit deux nouvelles cartes réseau virtuelles pointant vers vmbr2/vmbr3, puis assignation et IP statique (.1) côté GUI. Un simple qm reboot n'a pas suffi à faire apparaître les cartes — un arrêt complet (qm stop / qm start) a été nécessaire pour forcer la réénumération PCI.",
        en: "OPNsense gets two new virtual NICs pointing to vmbr2/vmbr3, then interface assignment and a static .1 IP via the GUI. A plain qm reboot wasn't enough to surface the new NICs — a full stop/start (qm stop / qm start) was needed to force PCI re-enumeration.",
      },
      features: ["net2 → vmbr2, net3 → vmbr3", "Assignation GUI OPNsense", "IP statique .1 par segment", "qm stop/start (pas reboot)"],
      lang: "bash",
      code: "qm set 101 -net2 virtio,bridge=vmbr2\nqm set 101 -net3 virtio,bridge=vmbr3\nqm stop 101\nqm start 101",
    },
  ],
  skills: [
    { domain: { fr: "Virtualisation", en: "Virtualization" }, skills: { fr: "administration Proxmox VE en production (VM + LXC)", en: "production Proxmox VE administration (VM + LXC)" } },
    { domain: { fr: "Sécurité réseau", en: "Network security" }, skills: { fr: "pare-feu OPNsense, segmentation 4 zones, blocage par défaut", en: "OPNsense firewall, 4-zone segmentation, default-deny" } },
    { domain: { fr: "Infrastructure as Code", en: "Infrastructure as Code" }, skills: { fr: "Terraform (réseau inclus) + Ansible, secrets hors code", en: "Terraform (network included) + Ansible, secrets outside code" } },
    { domain: { fr: "Architecture modulaire", en: "Modular architecture" }, skills: { fr: "modules Terraform réutilisables (lxc, vm)", en: "reusable Terraform modules (lxc, vm)" } },
    { domain: { fr: "Diagnostic", en: "Troubleshooting" }, skills: { fr: "identification qu'un reboot logiciel ne suffit pas à une réénumération PCI", en: "identifying that a software reboot isn't enough for PCI re-enumeration" } },
    { domain: { fr: "Reverse proxy", en: "Reverse proxy" }, skills: { fr: "Traefik comme point d'entrée unique du lab", en: "Traefik as the lab's single entry point" } },
  ],
  documents: [
    { label: { fr: "Livrable — Lab Draken (Proxmox, OPNsense, IaC)", en: "Deliverable — Lab Draken (Proxmox, OPNsense, IaC)" }, file: "/projects/lab-draken/Lab Draken - Proxmox OPNsense IaC.pdf" },
  ],
};

export default function LabDrakenPage() {
  return <BlueprintProject variant="datasheet" data={data} />;
}

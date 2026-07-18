import BlueprintProject, { BPData } from "@/app/components/projects/BlueprintProject";

const data: BPData = {
  tag: { fr: "INFRA · HYPERVISEUR · IAC", en: "INFRA · HYPERVISOR · IAC" },
  title: { fr: "Lab Draken — Proxmox, OPNsense & Infrastructure as Code", en: "Lab Draken — Proxmox, OPNsense & Infrastructure as Code" },
  subtitle: {
    fr: "J'ai migré mon ancien serveur physique vers un nœud Proxmox VE que j'auto-héberge, avec un pare-feu OPNsense qui route et filtre entre 4 segments réseau (WAN/LAN/AD/DMZ). Objectif que je me suis fixé : tout piloter en Infrastructure as Code (Terraform + Ansible) — y compris le réseau lui-même, pas juste les VM.",
    en: "I migrated my old physical server to a self-hosted Proxmox VE node, with an OPNsense firewall routing and filtering across 4 network segments (WAN/LAN/AD/DMZ). My goal was to drive everything through Infrastructure as Code (Terraform + Ansible) — including the network itself, not just the VMs.",
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
        fr: "J'ai installé OPNsense en VM (101) pour qu'il devienne le routeur/pare-feu de tout le lab. Au départ il n'a que deux interfaces : WAN (vmbr0, la carte physique du serveur) et LAN (vmbr1, mon réseau interne 192.168.2.0/24).",
        en: "I installed OPNsense as a VM (101) to make it the router/firewall for the whole lab. At first it only has two interfaces: WAN (vmbr0, the server's physical NIC) and LAN (vmbr1, my internal network 192.168.2.0/24).",
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
        fr: "Pour ne pas tout faire à la main, j'ai créé un LXC dédié (draken-admin) qui me sert de poste de pilotage Terraform + Ansible. Terraform utilise le provider bpg/proxmox — j'ai fait attention à mettre le token API dans une variable d'environnement, jamais dans un fichier .tf que je commite. Ansible prend le relais ensuite pour configurer ce que Terraform a créé.",
        en: "Instead of doing everything by hand, I created a dedicated LXC (draken-admin) as my Terraform + Ansible control point. Terraform uses the bpg/proxmox provider — I made sure to keep the API token in an environment variable, never in a .tf file I commit. Ansible then takes over to configure what Terraform created.",
      },
      features: ["Provider bpg/proxmox", "Secrets hors code (env)", ".tfstate/.tfvars gitignore", "Ansible post-provisioning"],
    },
    {
      num: "03",
      color: "#4cc4ff",
      title: { fr: "Modules Terraform réutilisables", en: "Reusable Terraform modules" },
      subtitle: { fr: "lxc & vm génériques", en: "generic lxc & vm modules" },
      desc: {
        fr: "Au début je copiais-collais un fichier Terraform par service, ce qui devenait vite ingérable. J'ai donc écrit un module lxc générique (cpu/mémoire/disque configurables, IP statique) et un module vm (cloud-init Debian 13), que je réutilise pour tous mes déploiements — edge, dns, git, db, apps.",
        en: "At first I was copy-pasting a Terraform file per service, which quickly became unmanageable. So I wrote a generic lxc module (configurable cpu/memory/disk, static IP) and a vm module (Debian 13 cloud-init) that I reuse for every deployment — edge, dns, git, db, apps.",
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
        fr: "Je pensais au départ que Terraform ne pouvait gérer que des VM/LXC, pas le réseau lui-même — en creusant la doc du provider bpg j'ai trouvé la ressource qu'il fallait. J'ai écrit un module network qui crée les bridges vmbr2 (AD, 192.168.10.0/24) et vmbr3 (DMZ, 192.168.20.0/24), isolés (pas de carte physique). Par contre j'ai volontairement laissé vmbr0/vmbr1 hors de Terraform : ils existaient déjà avant que je m'en serve sur ce projet, et je ne voulais pas risquer de les casser avec un drift de state sur un lab qui doit rester joignable.",
        en: "I initially thought Terraform could only manage VMs/LXCs, not the network itself — digging into the bpg provider's docs I found the right resource. I wrote a network module that creates the vmbr2 (AD, 192.168.10.0/24) and vmbr3 (DMZ, 192.168.20.0/24) bridges, isolated (no physical NIC). I deliberately left vmbr0/vmbr1 out of Terraform though: they already existed before I started using it on this project, and I didn't want to risk breaking them with a state drift on a lab that has to stay reachable.",
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
        fr: "Il fallait ensuite donner à OPNsense deux nouvelles cartes réseau virtuelles vers vmbr2/vmbr3, puis les assigner et leur mettre une IP statique (.1) depuis l'interface OPNsense. Ça a été mon premier vrai blocage : un simple qm reboot ne faisait pas apparaître les nouvelles cartes. Il a fallu que je comprenne qu'un arrêt complet (qm stop puis qm start) était nécessaire pour forcer la réénumération PCI.",
        en: "I then had to give OPNsense two new virtual NICs pointing to vmbr2/vmbr3, then assign them and set a static .1 IP from the OPNsense interface. This was my first real blocker: a plain qm reboot wasn't surfacing the new NICs. I had to figure out that a full stop/start (qm stop then qm start) was needed to force PCI re-enumeration.",
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
    { label: { fr: "Services hébergés et leur configuration", en: "Hosted services and their configuration" }, file: "/projects/lab-draken/Services heberges et configuration.pdf" },
    { label: { fr: "Déploiement et transfert des serveurs", en: "Server deployment and transfer" }, file: "/projects/lab-draken/Deploiement et transfert des serveurs.pdf" },
    { label: { fr: "OPNsense et architecture réseau", en: "OPNsense and network architecture" }, file: "/projects/lab-draken/OPNsense et architecture reseau.pdf" },
  ],
};

export default function LabDrakenPage() {
  return <BlueprintProject variant="datasheet" data={data} />;
}

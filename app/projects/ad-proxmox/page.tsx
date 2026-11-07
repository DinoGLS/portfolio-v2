import BlueprintProject, { BPData } from "@/app/components/projects/BlueprintProject";

// Lab AD perso : les VM 170 (contrôleur) et 171 (client) ont été supprimées.
// La page décrit donc le plan de reconstruction, sans prétendre que le lab tourne.
const data: BPData = {
  tag: { fr: "INFRA · ACTIVE DIRECTORY", en: "INFRA · ACTIVE DIRECTORY" },
  title: { fr: "Lab Active Directory sur mon Proxmox", en: "Active Directory lab on my Proxmox" },
  subtitle: {
    fr: "Un domaine complet (contrôleur Windows Server, poste Windows 11, GPO) sur un segment isolé de mon homelab. J'ai monté une première version, puis supprimé les VM : je le refais de zéro pour le documenter proprement.",
    en: "A full domain (Windows Server controller, Windows 11 workstation, GPOs) on an isolated segment of my homelab. I built a first version, then deleted the VMs: I am redoing it from scratch to document it properly."
  },
  status: { fr: "À recréer", en: "To rebuild" },
  img: "/projects/ad-proxmox/schema-ad.svg",
  badges: [
    { label: "Proxmox VE" },
    { label: "Windows Server 2022" },
    { label: "Active Directory" },
    { label: "PowerShell" },
  ],
  stats: [
    { k: { fr: "VM à recréer", en: "VMs to rebuild" }, v: "2" },
    { k: { fr: "Segment réseau", en: "Network segment" }, v: "vmbr2 isolé" },
    { k: { fr: "Passerelle", en: "Gateway" }, v: "OPNsense" },
  ],
  toc: [
    { fr: "Le segment réseau", en: "The network segment" },
    { fr: "Les deux VM", en: "The two VMs" },
    { fr: "Le domaine", en: "The domain" },
    { fr: "Le poste client", en: "The client workstation" },
  ],
  planned: [
    { fr: "Recréer le contrôleur et le client, puis joindre le poste au domaine", en: "Rebuild the controller and the client, then join the workstation to the domain" },
    { fr: "Écrire le plan d'adressage, la liste des unités d'organisation et des GPO", en: "Write the addressing plan, the list of organizational units and GPOs" },
    { fr: "Prendre des captures nettes et rédiger la fiche de réalisation", en: "Take sharp screenshots and write the write-up" },
  ],
  steps: [
    {
      num: "01",
      title: { fr: "Le segment réseau", en: "The network segment" },
      subtitle: { fr: "Déjà en place", en: "Already in place" },
      desc: {
        fr: "Le pont vmbr2 existe déjà : c'est un segment réservé à l'AD, isolé du réseau du lab et de la DMZ, dont la passerelle est OPNsense. Il n'a pas de carte physique, il ne sort que par le pare-feu.",
        en: "The vmbr2 bridge already exists: a segment reserved for AD, isolated from the lab network and the DMZ, with OPNsense as its gateway. It has no physical NIC and only leaves through the firewall."
      },
    },
    {
      num: "02",
      title: { fr: "Les deux VM", en: "The two VMs" },
      subtitle: { fr: "Contrôleur et client", en: "Controller and client" },
      desc: {
        fr: "Un Windows Server 2022 (évaluation) pour le contrôleur de domaine et un Windows 11 Entreprise pour le poste. Disque et carte réseau en VirtIO, avec les pilotes montés à l'installation.",
        en: "A Windows Server 2022 (evaluation) for the domain controller and a Windows 11 Enterprise for the workstation. Disk and network card in VirtIO, with drivers mounted at install time."
      },
      lang: "bash",
      code: "# création de la VM du contrôleur (exemple)\nqm create <id> --name ad-dc --memory 4096 --cores 2 \\\n  --net0 virtio,bridge=vmbr2 --scsi0 local-lvm:60",
    },
    {
      num: "03",
      title: { fr: "Le domaine", en: "The domain" },
      subtitle: { fr: "AD DS, DNS, DHCP", en: "AD DS, DNS, DHCP" },
      desc: {
        fr: "Installer le rôle AD DS, promouvoir le serveur en contrôleur d'un nouveau domaine, puis ajouter le DHCP pour que les postes obtiennent leur adresse et trouvent le DNS du domaine.",
        en: "Install the AD DS role, promote the server to controller of a new domain, then add DHCP so workstations get their address and find the domain DNS."
      },
      lang: "powershell",
      code: "Install-WindowsFeature AD-Domain-Services -IncludeManagementTools\nInstall-ADDSForest -DomainName '<mon-domaine>' -InstallDns",
    },
    {
      num: "04",
      title: { fr: "Le poste client", en: "The client workstation" },
      subtitle: { fr: "Jonction et GPO", en: "Join and GPOs" },
      desc: {
        fr: "Joindre le Windows 11 au domaine, créer des unités d'organisation, des groupes et quelques GPO (sécurité, mots de passe), puis vérifier qu'un utilisateur du domaine ouvre bien une session.",
        en: "Join the Windows 11 to the domain, create organizational units, groups and a few GPOs (security, passwords), then check that a domain user can log in."
      },
      lang: "powershell",
      code: "New-ADOrganizationalUnit -Name 'IT' -Path 'DC=<mon-domaine>,DC=<ext>'\nNew-GPO -Name 'Base-securite'",
    },
  ],
};

export default function AdProxmoxPage() {
  return <BlueprintProject variant="datasheet" data={data} />;
}

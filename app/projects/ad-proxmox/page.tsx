import BlueprintProject, { BPData } from "@/app/components/projects/BlueprintProject";

const data: BPData = {
  tag: { fr: "INFRA · ACTIVE DIRECTORY", en: "INFRA · ACTIVE DIRECTORY" },
  title: { fr: "Lab Active Directory", en: "Active Directory Lab" },
  subtitle: {
    fr: "Lab AD sous Proxmox VE : DC Windows Server, forêt SISR.LOCAL, DNS/DHCP, GPO.",
    en: "AD Lab on Proxmox VE: Windows Server DC, SISR.LOCAL forest, DNS/DHCP, GPO."
  },
  status: { fr: "En cours", en: "In progress" },
  img: "/projects/ad-proxmox/ad_proxmox.png",
  badges: [
    { label: "Proxmox VE" },
    { label: "Windows Server" },
    { label: "Active Directory" },
    { label: "PowerShell" },
  ],
  stats: [
    { k: { fr: "VMs déployées", en: "Deployed VMs" }, v: "3" },
    { k: { fr: "Domaine", en: "Domain" }, v: "SISR.LOCAL" },
    { k: { fr: "Ressources Allouées", en: "Allocated Resources" }, v: "8 vCPU / 16GB RAM" },
  ],
  toc: [
    { fr: "Hyperviseur Proxmox", en: "Proxmox Hypervisor" },
    { fr: "Déploiement AD DS", en: "AD DS Deployment" },
    { fr: "Services DNS/DHCP", en: "DNS/DHCP Services" },
    { fr: "Configuration GPO", en: "GPO Configuration" }
  ],
  planned: [
    { fr: "Finaliser les GPO de sécurité", en: "Finalize security GPOs" },
    { fr: "Tests de bascule et de tolérance aux pannes", en: "Failover and fault tolerance tests" },
    { fr: "Documentation et livrable PDF", en: "Documentation and PDF deliverable" }
  ],
  steps: [
    {
      num: "01",
      title: { fr: "Hyperviseur Proxmox", en: "Proxmox Hypervisor" },
      subtitle: { fr: "Création des VMs", en: "VM Creation" },
      desc: {
        fr: "Déploiement de l'environnement virtuel sous Proxmox VE, création des machines virtuelles et configuration du pont réseau (bridge).",
        en: "Deployment of the virtual environment under Proxmox VE, creation of virtual machines and network bridge configuration."
      },
      lang: "bash",
      code: "qm create 100 --name dc01 --memory 4096 --cores 2 --net0 virtio,bridge=vmbr1"
    },
    {
      num: "02",
      title: { fr: "Déploiement AD DS", en: "AD DS Deployment" },
      subtitle: { fr: "Forêt SISR.LOCAL", en: "SISR.LOCAL Forest" },
      desc: {
        fr: "Installation du rôle Active Directory Domain Services et promotion du serveur en tant que contrôleur de domaine pour la nouvelle forêt SISR.LOCAL.",
        en: "Installation of the Active Directory Domain Services role and promotion of the server as a domain controller for the new SISR.LOCAL forest."
      },
      lang: "powershell",
      code: "Install-WindowsFeature AD-Domain-Services -IncludeManagementTools\nInstall-ADDSForest -DomainName 'SISR.LOCAL' -InstallDns"
    },
    {
      num: "03",
      title: { fr: "Services DNS/DHCP", en: "DNS/DHCP Services" },
      subtitle: { fr: "Résolution et adressage", en: "Resolution and addressing" },
      desc: {
        fr: "Configuration de la zone DNS intégrée à l'AD et mise en place d'une étendue DHCP pour les postes clients du réseau local.",
        en: "Configuration of the AD-integrated DNS zone and setup of a DHCP scope for the local network clients."
      },
      lang: "powershell",
      code: "Add-DhcpServerv4Scope -Name 'LAN-Clients' -StartRange 192.168.10.100 -EndRange 192.168.10.200 -SubnetMask 255.255.255.0"
    },
    {
      num: "04",
      title: { fr: "Configuration GPO", en: "GPO Configuration" },
      subtitle: { fr: "Stratégies de groupe", en: "Group Policies" },
      desc: {
        fr: "Création des Unités d'Organisation (OU) et application des premières stratégies de groupe (GPO) pour la sécurité et les paramètres utilisateurs.",
        en: "Creation of Organizational Units (OU) and application of the first group policies (GPO) for security and user settings."
      },
      lang: "powershell",
      code: "New-ADOrganizationalUnit -Name 'IT_Dept' -Path 'DC=SISR,DC=LOCAL'\nNew-GPO -Name 'Security_Base_Policy'\nNew-GPLink -Name 'Security_Base_Policy' -Target 'OU=IT_Dept,DC=SISR,DC=LOCAL'"
    }
  ]
};

export default function AdProxmoxPage() {
  return <BlueprintProject variant="datasheet" data={data} />;
}

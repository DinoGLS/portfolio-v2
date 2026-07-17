import BlueprintProject, { BPData } from "@/app/components/projects/BlueprintProject";

const data: BPData = {
  tag: "SÉCURITÉ · RÉSEAUX · CISCO",
  title: "Simulation WAN — supervision & redondance Cisco",
  subtitle:
    "Infrastructure réseau d'entreprise multi-LAN interconnectée via un WAN : haute disponibilité des routeurs (HSRP), supervision centralisée (SNMP) et sauvegarde des configurations (TFTP).",
  status: "Terminé",
  img: "/projects/wan-simulation/configwan.png",
  badges: [
    { label: "OSPF", color: "#4cc4ff" },
    { label: "HSRP", color: "#bfe3ff" },
    { label: "SNMP", color: "#4cc4ff" },
    { label: "VLAN 802.1Q", color: "#bfe3ff" },
    { label: "ACL", color: "#4cc4ff" },
    { label: "TFTP", color: "#bfe3ff" },
    { label: "DHCP", color: "#4cc4ff" },
    { label: "DNS", color: "#bfe3ff" },
  ],
  stats: [
    { k: "Routeurs Cisco", v: "4" },
    { k: "VLANs", v: "5" },
    { k: "Redondance", v: "HSRP" },
    { k: "Simulateur", v: "Packet Tracer" },
  ],
  toc: ["Architecture", "Interconnexion WAN", "Redondance HSRP", "Supervision SNMP", "Sauvegarde TFTP"],
  steps: [
    {
      num: "01",
      color: "#4cc4ff",
      title: "Architecture multi-LAN & segmentation",
      subtitle: "VLANs 802.1Q + routage inter-VLAN",
      desc:
        "Découpage du réseau en plusieurs LAN segmentés par VLANs (802.1Q), avec routage inter-VLAN et plans d'adressage par site. Chaque LAN dispose de son propre domaine de diffusion.",
      features: ["5 VLANs", "Trunks 802.1Q", "Routage inter-VLAN", "Plan d'adressage /24"],
      lang: "cisco-ios",
      code:
        "interface GigabitEthernet0/0.10\n encapsulation dot1Q 10\n ip address 192.168.10.1 255.255.255.0\n!\ninterface GigabitEthernet0/0.20\n encapsulation dot1Q 20\n ip address 192.168.20.1 255.255.255.0",
    },
    {
      num: "02",
      color: "#bfe3ff",
      title: "Interconnexion WAN & routage OSPF",
      subtitle: "liaisons inter-sites dynamiques",
      desc:
        "Interconnexion des sites via des liaisons WAN, avec routage dynamique OSPF pour la convergence automatique et l'apprentissage des routes entre les différents réseaux locaux.",
      features: ["Liens WAN série", "OSPF area 0", "Convergence auto", "Routes redistribuées"],
      lang: "cisco-ios",
      code:
        "router ospf 1\n network 10.0.0.0 0.0.0.3 area 0\n network 192.168.10.0 0.0.0.255 area 0\n passive-interface default\n no passive-interface Serial0/0/0",
    },
    {
      num: "03",
      color: "#4cc4ff",
      title: "Haute disponibilité — HSRP",
      subtitle: "redondance de passerelle",
      desc:
        "Mise en place de HSRP entre deux routeurs pour offrir une passerelle virtuelle redondante : si le routeur actif tombe, le routeur en standby prend le relais sans coupure de service.",
      features: ["Passerelle virtuelle", "Priorité + preempt", "Bascule < 10 s", "Continuité de service"],
      lang: "cisco-ios",
      code:
        "interface GigabitEthernet0/0.10\n standby 10 ip 192.168.10.254\n standby 10 priority 110\n standby 10 preempt",
    },
    {
      num: "04",
      color: "#bfe3ff",
      title: "Supervision SNMP & sauvegarde TFTP",
      subtitle: "observabilité + résilience",
      desc:
        "Supervision centralisée via SNMP (remontée d'état des équipements) et sauvegarde automatisée des configurations vers un serveur TFTP pour la reprise après incident.",
      features: ["SNMP community RO", "Traps d'alerte", "Backup config TFTP", "ACL de filtrage"],
      lang: "cisco-ios",
      code:
        "snmp-server community SISR_RO RO\nsnmp-server host 192.168.10.5 version 2c SISR_RO\n!\ncopy running-config tftp://192.168.10.5/R1-confg",
    },
  ],
  skills: [
    { domain: "Réseaux Cisco", skills: "IOS, VLANs 802.1Q, trunks, routage inter-VLAN" },
    { domain: "Routage dynamique", skills: "OSPF, convergence, redistribution de routes" },
    { domain: "Haute disponibilité", skills: "HSRP, passerelle virtuelle, bascule active/standby" },
    { domain: "Supervision", skills: "SNMP, traps, observabilité réseau" },
    { domain: "Résilience", skills: "sauvegarde TFTP, reprise après incident" },
    { domain: "Sécurité réseau", skills: "ACL, filtrage, segmentation" },
  ],
};

export default function WanSimulationPage() {
  return <BlueprintProject variant="datasheet" data={data} />;
}

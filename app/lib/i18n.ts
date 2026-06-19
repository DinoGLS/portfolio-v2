// ────────────────────────────────────────────────────────────────────────────
// Dictionnaire de traductions FR / EN
// Ajoute ici les clés de tes autres pages au fur et à mesure.
// Usage dans un composant client : const { t } = useLanguage(); t("wan.title")
// ────────────────────────────────────────────────────────────────────────────

export type Lang = "fr" | "en";

export const LANGS: Lang[] = ["fr", "en"];

// Le dictionnaire est une structure imbriquée. On accède aux valeurs par
// chemin pointé : t("contact.form.name").
export const dictionary = {
  fr: {
    common: {
      backToProjects: "Retour aux projets",
      langLabel: "Langue",
      themeLabel: "Thème",
      themeToDark: "Passer en mode sombre",
      themeToLight: "Passer en mode clair",
      enlarge: "cliquer pour agrandir",
    },
    wan: {
      eyebrow: "Sécurité · Réseaux",
      title: "Simulation WAN — supervision & redondance Cisco",
      subtitle:
        "Architecture réseau multi-LAN avec interconnexion WAN, haute disponibilité des routeurs et services de supervision centralisée.",
      breadcrumb: "Simulation WAN",
      techHeading: "Technologies — cliquez pour en savoir plus",
      galleryHeading: "Aperçu de l'architecture",
      descHeading: "Description du projet",
      descP1:
        "Ce projet simule une infrastructure réseau d'entreprise composée de plusieurs réseaux locaux interconnectés via un WAN. Une architecture de haute disponibilité est mise en œuvre via HSRP pour garantir la continuité de service en cas de défaillance d'un routeur actif.",
      descP2:
        "La supervision repose sur SNMP et la sauvegarde des configurations est centralisée via TFTP. Le projet est orienté exploitation, résilience et observabilité réseau.",
      learnedHeading: "Ce que j'ai appris",
      docsHeading: "Documents et livrables",
      stats: {
        routers: "Routeurs Cisco",
        vlans: "VLANs configurés",
        redundancy: "Server, Router, Switch",
        simulator: "Simulateur",
        redundancyValue: "Redondance",
      },
      learned: {
        convergence: {
          title: "Convergence réseau",
          desc: "Comprendre comment OSPF recalcule les routes automatiquement lors d'une panne de lien — et le temps de convergence réel en lab.",
        },
        gateway: {
          title: "Redondance de passerelle",
          desc: "Configurer HSRP avec priorité et preemption pour garantir une bascule propre sans interruption visible côté hôtes.",
        },
        debug: {
          title: "Débogage réseau",
          desc: "Utiliser les commandes show et debug sur IOS Cisco pour diagnostiquer des problèmes de routage et de trunk VLAN.",
        },
        supervision: {
          title: "Supervision et traçabilité",
          desc: "Mettre en place SNMP v2c, configurer les community strings et vérifier la remontée des traps vers un NMS.",
        },
      },
      tech: {
        ospf: "Routage dynamique à état de liens — assure la convergence automatique du réseau.",
        hsrp: "Redondance de passerelle — bascule automatique si le routeur actif tombe.",
        snmp: "Supervision réseau — collecte des métriques et alertes sur les équipements.",
        vlan: "Segmentation logique du réseau avec trunk inter-switchs.",
        acl: "Contrôle d'accès — filtrage du trafic entrant/sortant par règles.",
        tftp: "Sauvegarde et restauration des configs des équipements Cisco.",
        dhcp: "Attribution automatique des adresses IP par plage et par VLAN.",
        dns: "Résolution de noms — service local dédié à l'infrastructure.",
      },
      docs: {
        report: "Rapport technique",
        reco: "Recommandations d'exploitation",
        addressing: "Tableau d'adressage",
      },
    },
    contact: {
      eyebrow: "Contact",
      title: "Me contacter",
      subtitle:
        "Une question, une opportunité ou un projet ? Écris-moi, je réponds rapidement.",
      form: {
        firstName: "Prénom",
        lastName: "Nom",
        email: "E-mail",
        phone: "Téléphone",
        phoneOptional: "Téléphone (facultatif)",
        message: "Message",
        messagePlaceholder: "Dis-m'en plus sur ta demande…",
        send: "Envoyer le message",
        sending: "Envoi en cours…",
        successTitle: "Message envoyé",
        successBody: "Merci, ton message est bien parti. Je reviens vers toi très vite.",
        sendAnother: "Envoyer un autre message",
      },
      errors: {
        firstName: "Indique ton prénom.",
        lastName: "Indique ton nom.",
        email: "Saisis une adresse e-mail valide.",
        phone: "Ce numéro ne semble pas valide.",
        message: "Écris un message d'au moins 10 caractères.",
        network: "L'envoi a échoué. Vérifie ta connexion et réessaie.",
        server: "L'envoi a échoué côté serveur. Réessaie dans un instant.",
      },
    },
  },

  en: {
    common: {
      backToProjects: "Back to projects",
      langLabel: "Language",
      themeLabel: "Theme",
      themeToDark: "Switch to dark mode",
      themeToLight: "Switch to light mode",
      enlarge: "click to enlarge",
    },
    wan: {
      eyebrow: "Security · Networks",
      title: "WAN Simulation — Cisco monitoring & redundancy",
      subtitle:
        "Multi-LAN network architecture with WAN interconnection, router high availability and centralized monitoring services.",
      breadcrumb: "WAN Simulation",
      techHeading: "Technologies — click to learn more",
      galleryHeading: "Architecture overview",
      descHeading: "Project description",
      descP1:
        "This project simulates an enterprise network made of several local networks interconnected over a WAN. A high-availability design is implemented with HSRP to keep services running if the active router fails.",
      descP2:
        "Monitoring relies on SNMP and configuration backups are centralized through TFTP. The project focuses on operations, resilience and network observability.",
      learnedHeading: "What I learned",
      docsHeading: "Documents & deliverables",
      stats: {
        routers: "Cisco routers",
        vlans: "Configured VLANs",
        redundancy: "Server, Router, Switch",
        simulator: "Simulator",
        redundancyValue: "Redundancy",
      },
      learned: {
        convergence: {
          title: "Network convergence",
          desc: "Understanding how OSPF recalculates routes automatically when a link fails — and the real convergence time in the lab.",
        },
        gateway: {
          title: "Gateway redundancy",
          desc: "Configuring HSRP with priority and preemption for a clean failover with no visible interruption on the hosts.",
        },
        debug: {
          title: "Network debugging",
          desc: "Using show and debug commands on Cisco IOS to diagnose routing and VLAN trunk issues.",
        },
        supervision: {
          title: "Monitoring & traceability",
          desc: "Setting up SNMP v2c, configuring community strings and checking trap delivery to an NMS.",
        },
      },
      tech: {
        ospf: "Link-state dynamic routing — ensures automatic network convergence.",
        hsrp: "Gateway redundancy — automatic failover if the active router goes down.",
        snmp: "Network monitoring — collects metrics and alerts from devices.",
        vlan: "Logical network segmentation with inter-switch trunking.",
        acl: "Access control — filtering inbound/outbound traffic with rules.",
        tftp: "Backup and restore of Cisco device configurations.",
        dhcp: "Automatic IP assignment per range and per VLAN.",
        dns: "Name resolution — a local service dedicated to the infrastructure.",
      },
      docs: {
        report: "Technical report",
        reco: "Operational recommendations",
        addressing: "Addressing table",
      },
    },
    contact: {
      eyebrow: "Contact",
      title: "Get in touch",
      subtitle:
        "A question, an opportunity or a project? Drop me a line — I reply quickly.",
      form: {
        firstName: "First name",
        lastName: "Last name",
        email: "Email",
        phone: "Phone",
        phoneOptional: "Phone (optional)",
        message: "Message",
        messagePlaceholder: "Tell me more about your request…",
        send: "Send message",
        sending: "Sending…",
        successTitle: "Message sent",
        successBody: "Thanks, your message is on its way. I'll get back to you shortly.",
        sendAnother: "Send another message",
      },
      errors: {
        firstName: "Please enter your first name.",
        lastName: "Please enter your last name.",
        email: "Enter a valid email address.",
        phone: "This phone number doesn't look valid.",
        message: "Write a message of at least 10 characters.",
        network: "Sending failed. Check your connection and try again.",
        server: "Sending failed on the server. Try again in a moment.",
      },
    },
  },
} as const;

// Résout une clé pointée ("contact.form.name") dans le dictionnaire d'une langue.
export function translate(lang: Lang, key: string): string {
  const parts = key.split(".");
  let node: unknown = dictionary[lang];
  for (const part of parts) {
    if (node && typeof node === "object" && part in (node as Record<string, unknown>)) {
      node = (node as Record<string, unknown>)[part];
    } else {
      // Clé absente : on renvoie la clé pour la repérer facilement à l'écran.
      return key;
    }
  }
  return typeof node === "string" ? node : key;
}

// ────────────────────────────────────────────────────────────────────────────
// Contenu de la page d'accueil (typé), séparé pour gérer facilement les listes.
// Usage : const h = homeStrings[lang];
// ────────────────────────────────────────────────────────────────────────────
export interface HomeStrings {
  nav: { home: string; about: string; parcours: string; projects: string; contact: string };
  hero: { available: string; subtitle: string; intro: string; cv: string };
  about: {
    heading: string;
    p1: string;
    p2: string;
    skills: { title: string; items: string[] }[];
  };
  parcours: { heading: string; items: { year: string; title: string; desc: string }[] };
  projects: {
    heading: string;
    subtitle: string;
    soon: string;
    view: string;
    items: { tag: string; title: string; desc: string; stack: string }[];
  };
  contact: { heading: string; intro: string };
}

export const homeStrings: Record<Lang, HomeStrings> = {
  fr: {
    nav: { home: "Accueil", about: "À propos", parcours: "Parcours", projects: "Projets", contact: "Contact" },
    hero: {
      available: "Disponible — Stage / Alternance",
      subtitle: "Administration Systèmes & Réseaux · Cybersécurité · DevSecOps en formation",
      intro:
        "Je construis mes compétences en administration systèmes et réseaux, cybersécurité et environnements virtualisés, en combinant théorie et pratique à travers des projets personnels et académiques.",
      cv: "Curriculum Vitae",
    },
    about: {
      heading: "À propos de moi",
      p1: "Étudiant en BTS SIO option SISR, je me spécialise dans l'administration systèmes et réseaux, la cybersécurité et les environnements virtualisés.",
      p2: "Mon objectif est de devenir DevSecOps en intégrant la sécurité dès la conception et le déploiement des environnements techniques, en combinant pratiques DevOps, automatisation et bonnes pratiques de sécurité.",
      skills: [
        { title: "Systèmes", items: ["Windows Server (AD, DNS, DHCP, GPO)", "Windows 10 / 11", "Linux (Debian, Ubuntu, Kali)", "Installation & maintenance"] },
        { title: "Réseau & Virtualisation", items: ["VLAN, adressage IP, DNS, DHCP", "Proxmox, VMware Workstation", "Labs multi-VM", "Supervision & journaux"] },
        { title: "Sécurité & Automatisation", items: ["Hardening, pare-feu, GPO", "Logs, alertes", "Scripts d'automatisation", "Bonnes pratiques SecOps"] },
      ],
    },
    parcours: {
      heading: "Mon parcours",
      items: [
        { year: "2024 - Aujourd'hui", title: "BTS SIO option SISR", desc: "Spécialisation en systèmes, réseaux, cybersécurité et environnements virtualisés. Construction de labs techniques (AD, Proxmox, Cisco, supervision, automatisation)." },
        { year: "2023 - 2024", title: "Cycle préparatoire international (école d'ingénieur)", desc: "Renforcement des bases scientifiques, ouverture internationale, méthodologie d'ingénieur." },
        { year: "2021 - 2023", title: "Sûreté aéroportuaire — Securitas", desc: "Diplôme interne, responsabilités opérationnelles, gestion d'équipe, prise de décision en environnement critique." },
        { year: "2021", title: "Bac Général", desc: "Spécialités scientifiques, orientation vers l'informatique et les systèmes." },
      ],
    },
    projects: {
      heading: "Mes projets",
      subtitle: "Labs et projets illustrant mes compétences en systèmes, réseaux, automatisation et sécurité.",
      soon: "Bientôt disponible",
      view: "Cliquez pour voir le projet",
      items: [
        { tag: "INFRA · ACTIVE DIRECTORY", title: "Lab Active Directory sous Proxmox", desc: "Domaine Active Directory complet avec utilisateurs, GPO et services réseau.", stack: "Windows Server · Proxmox · DNS · DHCP · GPO" },
        { tag: "AUTOMATISATION · SCRIPTS", title: "Scripts d'automatisation systèmes", desc: "Scripts PowerShell et Bash pour tâches d'administration récurrentes.", stack: "PowerShell · Bash · Inventaire · Comptes" },
        { tag: "SÉCURITÉ · RÉSEAUX", title: "Simulation WAN avec supervision et redondance de routeurs (Cisco)", desc: "Mise en place d'un réseau d'entreprise orienté disponibilité, observabilité réseau et continuité de service.", stack: "Logs · Routing · Réseau Entreprise · Supervision" },
        { tag: "DEV · GESTION DE PROJETS (en cours)", title: "App Track Muscu — suivi d'entraînement et de performance", desc: "Application de suivi d'entraînement avec React, support d'expérimentation : sécurisation des accès et déploiement automatisé.", stack: "Base de données · API · Authentification · Déploiement" },
      ],
    },
    contact: {
      heading: "Me contacter",
      intro: "Ouvert aux opportunités de stage, alternance et projets en systèmes, réseaux et cybersécurité.",
    },
  },
  en: {
    nav: { home: "Home", about: "About", parcours: "Background", projects: "Projects", contact: "Contact" },
    hero: {
      available: "Available — Internship / Apprenticeship",
      subtitle: "Systems & Network Administration · Cybersecurity · DevSecOps in training",
      intro:
        "I'm building my skills in systems and network administration, cybersecurity and virtualized environments, combining theory and practice through personal and academic projects.",
      cv: "Resume (CV)",
    },
    about: {
      heading: "About me",
      p1: "A BTS SIO (SISR track) student, I specialize in systems and network administration, cybersecurity and virtualized environments.",
      p2: "My goal is to become a DevSecOps engineer by embedding security from the design and deployment of technical environments, combining DevOps practices, automation and security best practices.",
      skills: [
        { title: "Systems", items: ["Windows Server (AD, DNS, DHCP, GPO)", "Windows 10 / 11", "Linux (Debian, Ubuntu, Kali)", "Installation & maintenance"] },
        { title: "Network & Virtualization", items: ["VLAN, IP addressing, DNS, DHCP", "Proxmox, VMware Workstation", "Multi-VM labs", "Monitoring & logs"] },
        { title: "Security & Automation", items: ["Hardening, firewall, GPO", "Logs, alerts", "Automation scripts", "SecOps best practices"] },
      ],
    },
    parcours: {
      heading: "My background",
      items: [
        { year: "2024 - Present", title: "BTS SIO — SISR track", desc: "Specialization in systems, networks, cybersecurity and virtualized environments. Building technical labs (AD, Proxmox, Cisco, monitoring, automation)." },
        { year: "2023 - 2024", title: "International preparatory program (engineering school)", desc: "Strengthening scientific foundations, international exposure, engineering methodology." },
        { year: "2021 - 2023", title: "Airport security — Securitas", desc: "Internal certification, operational responsibilities, team management, decision-making in critical environments." },
        { year: "2021", title: "High school diploma (science track)", desc: "Science specializations, orientation toward IT and systems." },
      ],
    },
    projects: {
      heading: "My projects",
      subtitle: "Labs and projects showcasing my skills in systems, networks, automation and security.",
      soon: "Coming soon",
      view: "Click to view the project",
      items: [
        { tag: "INFRA · ACTIVE DIRECTORY", title: "Active Directory lab on Proxmox", desc: "Full Active Directory domain with users, GPOs and network services.", stack: "Windows Server · Proxmox · DNS · DHCP · GPO" },
        { tag: "AUTOMATION · SCRIPTS", title: "Systems automation scripts", desc: "PowerShell and Bash scripts for recurring administration tasks.", stack: "PowerShell · Bash · Inventory · Accounts" },
        { tag: "SECURITY · NETWORKS", title: "WAN simulation with monitoring and router redundancy (Cisco)", desc: "An availability-focused enterprise network with network observability and service continuity.", stack: "Logs · Routing · Enterprise network · Monitoring" },
        { tag: "DEV · PROJECT MANAGEMENT (in progress)", title: "Track Muscu app — training & performance tracking", desc: "A React training-tracking app used as a testbed: access security and automated deployment.", stack: "Database · API · Authentication · Deployment" },
      ],
    },
    contact: {
      heading: "Get in touch",
      intro: "Open to internship, apprenticeship and project opportunities in systems, networks and cybersecurity.",
    },
  },
};

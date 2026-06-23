"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const TECH_BADGES = [
  { label: "Windows Server 2022", color: "#0078d4" },
  { label: "Proxmox VE 8", color: "#e57000" },
  { label: "Active Directory", color: "#00a4ef" },
  { label: "DNS / DHCP", color: "#10b981" },
  { label: "GPO", color: "#8b5cf6" },
  { label: "PowerShell", color: "#3b82f6" },
  { label: "Windows 11", color: "#0078d4" },
];

const STEPS = [
  {
    id: "proxmox",
    color: "#e57000",
    num: "01",
    title: "Infrastructure Proxmox",
    subtitle: "Hyperviseur type 1 bare-metal",
    desc: "Déploiement de Proxmox VE sur le serveur physique. Création des VMs : un contrôleur de domaine (Windows Server 2022) et des postes clients Windows 11. Réseau virtuel dédié avec bridges internes.",
    features: [
      "VM DC principal — 4 vCPU / 8 Go RAM",
      "VM poste client Windows 11",
      "Bridges réseau internes isolés",
      "Snapshots avant chaque étape critique",
    ],
    code: "# Vérification des VMs depuis l'hyperviseur\nqm list\n# VMID  NAME         STATUS  MEM(MB)\n# 100   DC-Primary   running 8192\n# 101   WS-Client01  running 4096",
    lang: "bash",
  },
  {
    id: "ad",
    color: "#00a4ef",
    num: "02",
    title: "Active Directory",
    subtitle: "Forêt & domaine SISR.LOCAL",
    desc: "Installation du rôle AD DS, promotion du serveur en contrôleur de domaine. Création de la forêt SISR.LOCAL avec configuration DNS intégré. Structure d'OUs alignée sur le découpage organisationnel.",
    features: [
      "Forêt : SISR.LOCAL (niveau fonctionnel 2022)",
      "OUs : Direction, Informatique, RH, Élèves",
      "Comptes utilisateurs avec attributs complets",
      "Groupes de sécurité par département",
    ],
    code: 'Install-WindowsFeature -Name AD-Domain-Services -IncludeManagementTools\nInstall-ADDSForest `\n  -DomainName "SISR.LOCAL" `\n  -DomainNetbiosName "SISR" `\n  -ForestMode "WinThreshold" `\n  -InstallDns:$true `\n  -Force:$true',
    lang: "powershell",
  },
  {
    id: "dns-dhcp",
    color: "#10b981",
    num: "03",
    title: "DNS & DHCP",
    subtitle: "Résolution de noms + attribution IP",
    desc: "Configuration du serveur DNS avec zones de recherche directe et inverse pour SISR.LOCAL. Déploiement du rôle DHCP avec plages d'adresses par département et réservations pour les serveurs.",
    features: [
      "Zone directe : sisr.local (SOA + A records)",
      "Zone inverse : 192.168.10.x",
      "DHCP : 3 plages — RH, Info, Direction",
      "Réservations MAC pour les serveurs",
    ],
    code: 'Add-DnsServerResourceRecordA -Name "srv-web" `\n  -ZoneName "sisr.local" -IPv4Address "192.168.10.20"\n\nAdd-DhcpServerv4Scope -Name "VLAN-Info" `\n  -StartRange 192.168.10.50 `\n  -EndRange 192.168.10.150 `\n  -SubnetMask 255.255.255.0',
    lang: "powershell",
  },
  {
    id: "gpo",
    color: "#8b5cf6",
    num: "04",
    title: "GPO — Stratégies de groupe",
    subtitle: "Sécurité & configuration centralisée",
    desc: "Déploiement de stratégies de groupe pour sécuriser les postes et uniformiser leur configuration. Politique de mots de passe renforcée, restriction des applications non autorisées, mappage de lecteurs réseau par OU.",
    features: [
      "Politique de mots de passe (12 car., complexité)",
      "Restriction USB et applications",
      "Mappage lecteurs réseau par OU",
      "Déploiement fond d'écran entreprise",
    ],
    code: 'New-GPO -Name "Securite-Postes" | `\n  New-GPLink -Target "OU=Informatique,DC=sisr,DC=local"\n\nNew-ADFineGrainedPasswordPolicy `\n  -Name "PSO-Strict" `\n  -MinPasswordLength 12 `\n  -ComplexityEnabled $true `\n  -Precedence 10',
    lang: "powershell",
  },
];

const GALLERY: { src: string; alt: string }[] = [
  { src: "/projects/ad-proxmox/ad_proxmox.png", alt: "Infrastructure Proxmox — VMs" },
];

export default function AdProxmoxPage() {
  const [active, setActive] = useState<string | null>(null);
  const [zoom, setZoom] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 px-4 py-16 text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Link href="/#projects" className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          ← Retour aux projets
        </Link>
      </motion.div>

      <div className="max-w-5xl mx-auto">
        <motion.header className="mt-8 mb-10" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="px-3 py-1 text-xs rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-medium">Terminé</span>
            <span className="px-3 py-1 text-xs rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30 font-medium">INFRA · ACTIVE DIRECTORY</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4 leading-tight">
            Lab Active Directory<br />sous Proxmox VE
          </h1>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            Déploiement d&apos;un domaine Active Directory complet en environnement virtualisé Proxmox.
            Configuration de l&apos;infrastructure réseau (DNS, DHCP), des stratégies de groupe (GPO)
            et de la gestion centralisée des utilisateurs et ordinateurs.
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {TECH_BADGES.map((b) => (
              <span key={b.label} className="px-2.5 py-1 text-xs rounded-md bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/60">
                {b.label}
              </span>
            ))}
          </div>
        </motion.header>

        {/* Galerie */}
        <motion.section className="mb-12" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">Aperçu</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {GALLERY.map((img) => (
              <button key={img.src} className="relative overflow-hidden rounded-xl border border-slate-200/80 dark:border-slate-700/60 aspect-video group" onClick={() => setZoom(img.src)}>
                <Image src={img.src} alt={img.alt} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="(max-width: 640px) 100vw, 50vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <span className="text-xs text-slate-200">Cliquez pour agrandir</span>
                </div>
              </button>
            ))}
          </div>
        </motion.section>

        <AnimatePresence>
          {zoom && (
            <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setZoom(null)}>
              <div className="relative max-w-5xl w-full aspect-video">
                <Image src={zoom} alt="zoom" fill className="object-contain rounded-xl" sizes="100vw" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Architecture */}
        <motion.section className="mb-12" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-5">Architecture du lab</h2>
          <div className="bg-slate-100/60 dark:bg-slate-900/90 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/60 rounded-xl p-6 font-mono text-sm">
            <div className="text-slate-400 mb-2"><span className="text-orange-400">Proxmox VE</span> — SISR.LOCAL</div>
            {[
              { indent: 1, name: "DC-Primary", label: "Windows Server 2022 — PDC, AD DS, DNS, DHCP", color: "text-blue-400" },
              { indent: 2, name: "AD DS", label: "Forêt SISR.LOCAL, OUs, utilisateurs", color: "text-cyan-400" },
              { indent: 2, name: "DNS", label: "Zone sisr.local + zone inverse", color: "text-emerald-400" },
              { indent: 2, name: "DHCP", label: "3 plages par VLAN/département", color: "text-emerald-400" },
              { indent: 1, name: "WS-Client01", label: "Windows 11 — poste joint au domaine", color: "text-slate-300" },
              { indent: 2, name: "GPO", label: "Stratégies appliquées via OU", color: "text-violet-400" },
              { indent: 1, name: "Réseau virtuel", label: "Bridge interne Proxmox — 192.168.10.0/24", color: "text-slate-400" },
            ].map((item, i) => (
              <div key={i} className="flex items-baseline gap-2 leading-7" style={{ paddingLeft: `${item.indent * 20}px` }}>
                <span className="text-slate-600">{item.indent === 1 ? "├── " : "│   ├── "}</span>
                <span className={item.color}>{item.name}</span>
                <span className="text-slate-600 text-xs">← {item.label}</span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Étapes */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">Étapes de déploiement</h2>
          <div className="space-y-4">
            {STEPS.map((step, i) => (
              <motion.div key={step.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07 }}>
                <div className="rounded-xl border overflow-hidden transition-all duration-200"
                  style={{ borderColor: active === step.id ? step.color + "60" : "rgba(51,65,85,0.6)", background: "rgba(15,23,42,0.88)" }}>
                  <button className="w-full text-left p-5 flex items-start gap-4" onClick={() => setActive(active === step.id ? null : step.id)}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                      style={{ background: step.color + "20", color: step.color, border: `1px solid ${step.color}40` }}>
                      {step.num}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-slate-100">{step.title}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{step.subtitle}</p>
                    </div>
                    <span className="text-slate-500 text-lg mt-1 flex-shrink-0">{active === step.id ? "−" : "+"}</span>
                  </button>
                  {active === step.id && (
                    <div className="px-5 pb-5 border-t border-slate-700/40">
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-4 mb-4">{step.desc}</p>
                      <ul className="space-y-1.5 mb-5">
                        {step.features.map((f, fi) => (
                          <li key={fi} className="flex items-start gap-2 text-sm text-slate-300">
                            <span style={{ color: step.color }} className="mt-0.5 flex-shrink-0">▸</span>
                            {f}
                          </li>
                        ))}
                      </ul>
                      <div className="relative">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-slate-500 font-mono">{step.lang}</span>
                          <button onClick={() => handleCopy(step.code, step.id)} className="text-xs text-slate-400 hover:text-slate-800 dark:text-slate-200 transition-colors px-2 py-1 rounded border border-slate-200/80 dark:border-slate-700/60">
                            {copied === step.id ? "Copié ✓" : "Copier"}
                          </button>
                        </div>
                        <pre className="rounded-lg p-4 text-xs overflow-x-auto leading-relaxed"
                          style={{ background: "rgba(0,0,0,0.4)", border: `1px solid ${step.color}20`, color: "#cbd5e1" }}>
                          <code>{step.code}</code>
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Compétences */}
        <motion.section className="mb-12" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-5">Compétences mobilisées</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { domain: "Virtualisation", skills: "Proxmox VE, gestion VMs, bridges réseau, snapshots" },
              { domain: "Active Directory", skills: "AD DS, forêt/domaine, OUs, objets, délégation" },
              { domain: "Services réseau", skills: "DNS (zones directes/inverses), DHCP (plages, réservations)" },
              { domain: "PowerShell", skills: "AD cmdlets, RSAT, automatisation tâches AD" },
              { domain: "Stratégies de groupe", skills: "GPO, liaison OU, Fine-Grained Password Policy" },
              { domain: "Sécurité", skills: "Hardening comptes, restrictions, politiques de sécurité" },
            ].map((item) => (
              <div key={item.domain} className="flex gap-3 p-4 rounded-lg border border-slate-200/80 dark:border-slate-700/60 bg-slate-800/80 dark:bg-slate-800/40">
                <span className="text-blue-400 mt-0.5 flex-shrink-0 text-sm">▸</span>
                <div>
                  <p className="text-sm font-semibold text-slate-200">{item.domain}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.skills}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Documents */}
        <motion.section className="mb-10" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-5">Documentation & livrables</h2>
          <p className="text-sm text-slate-500 italic">
            Déposez vos PDFs dans <code className="text-slate-400">public/projects/ad-proxmox/livrables/</code> et ils apparaîtront ici.
          </p>
        </motion.section>
      </div>
    </main>
  );
}

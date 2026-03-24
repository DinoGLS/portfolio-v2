"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

// ── Badges technos avec couleurs sémantiques ────────────────────────────────
const TECH_BADGES: { label: string; color: string }[] = [
  { label: "OSPF",       color: "bg-blue-500/15 text-blue-300 border-blue-500/30" },
  { label: "HSRP",       color: "bg-violet-500/15 text-violet-300 border-violet-500/30" },
  { label: "SNMP",       color: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
  { label: "VLAN 802.1Q",color: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30" },
  { label: "ACL",        color: "bg-red-500/15 text-red-300 border-red-500/30" },
  { label: "TFTP",       color: "bg-slate-500/15 text-slate-300 border-slate-500/30" },
  { label: "DHCP",       color: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  { label: "DNS",        color: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
];

const gallery = [
  { src: "/projects/wan-simulation/configwan.png",               alt: "Topologie WAN" },
  { src: "/projects/wan-simulation/ReseauxVlanCmplet.drawio.png", alt: "Architecture VLAN" },
];

const documents = [
  { label: "Rapport technique",        file: "/projects/wan-simulation/Guide reseau wan.pdf" },
  { label: "Recommandations d'exploitation", file: "/projects/wan-simulation/Recommandation.pdf" },
  { label: "Tableau d'adressage",      file: "/projects/wan-simulation/Tableau_adressage.pdf" },
];

// ── Tooltip state par badge ──────────────────────────────────────────────────
const TECH_DESCRIPTIONS: Record<string, string> = {
  "OSPF":        "Routage dynamique à état de liens — assure la convergence automatique du réseau.",
  "HSRP":        "Redondance de passerelle — bascule automatique si le routeur actif tombe.",
  "SNMP":        "Supervision réseau — collecte des métriques et alertes sur les équipements.",
  "VLAN 802.1Q": "Segmentation logique du réseau avec trunk inter-switchs.",
  "ACL":         "Contrôle d'accès — filtrage du trafic entrant/sortant par règles.",
  "TFTP":        "Sauvegarde et restauration des configs des équipements Cisco.",
  "DHCP":        "Attribution automatique des adresses IP par plage et par VLAN.",
  "DNS":         "Résolution de noms — service local dédié à l'infrastructure.",
};

export default function WanSimulationPage() {
  const [openImage, setOpenImage]   = useState<string | null>(null);
  const [activeBadge, setActiveBadge] = useState<string | null>(null);
  const router = useRouter();

  const handleBack = () => {
    // Retour fluide : on repousse l'historique vers la section projets
    router.push("/#projects");
  };

  return (
    <main className="min-h-screen px-4 py-16 bg-slate-950 text-slate-200">

      {/* ── NAVBAR RETOUR ──────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center px-6 py-3 bg-slate-950/80 backdrop-blur border-b border-slate-800/60">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Retour aux projets
        </button>

        <span className="ml-4 text-slate-600 text-sm hidden sm:block">
          / Simulation WAN
        </span>
      </nav>

      <div className="max-w-5xl mx-auto pt-10">

        {/* ── TITRE ─────────────────────────────────────────────────────────── */}
        <motion.header
          className="mt-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-[0.2em]">
            Sécurité · Réseaux
          </span>
          <h1 className="text-3xl md:text-4xl font-bold mt-2">
            Simulation WAN — supervision & redondance Cisco
          </h1>
          <p className="mt-4 text-slate-300 max-w-3xl leading-relaxed">
            Architecture réseau multi-LAN avec interconnexion WAN, haute disponibilité
            des routeurs et services de supervision centralisée.
          </p>
        </motion.header>

        {/* ── BADGES TECHNOS ────────────────────────────────────────────────── */}
        <motion.section
          className="mt-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-[0.2em] mb-3">
            Technologies — cliquez pour en savoir plus
          </h2>
          <div className="flex flex-wrap gap-2">
            {TECH_BADGES.map((t) => (
              <button
                key={t.label}
                onClick={() =>
                  setActiveBadge(activeBadge === t.label ? null : t.label)
                }
                className={`px-3 py-1 rounded-full border text-xs font-medium transition-all duration-200 ${t.color}
                  ${activeBadge === t.label ? "ring-2 ring-offset-1 ring-offset-slate-950 ring-blue-400 scale-105" : "hover:scale-105"}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Tooltip description */}
          <AnimatePresence>
            {activeBadge && (
              <motion.div
                key={activeBadge}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="mt-3 px-4 py-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-sm text-slate-300 max-w-xl"
              >
                <span className="font-semibold text-slate-100">{activeBadge} — </span>
                {TECH_DESCRIPTIONS[activeBadge]}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* ── CONTEXTE CHIFFRÉ ──────────────────────────────────────────────── */}
        <motion.section
          className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {[
            { value: "4",     label: "Routeurs Cisco" },
            { value: "5",     label: "VLANs configurés" },
            { value: "Redondance",  label: "Server, Router, Switch" },
            { value: "CISCO Packet Tracer",  label: "Simulateur" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center"
            >
              <p className="text-xl font-bold text-blue-400">{stat.value}</p>
              <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.section>

        {/* ── GALERIE ───────────────────────────────────────────────────────── */}
        <motion.section
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold mb-4">Aperçu de l'architecture</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {gallery.map((img, i) => (
              <motion.button
                type="button"
                key={img.src}
                onClick={() => setOpenImage(img.src)}
                className="group relative aspect-video rounded-lg overflow-hidden border border-slate-800 bg-slate-900 text-left"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.15 }}
              >
                <Image src={img.src} alt={img.alt} fill className="object-contain p-3" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition" />
                <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 border border-slate-700/60 rounded-md px-3 py-1.5 text-xs text-slate-200 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition pointer-events-none">
                  {img.alt} — cliquer pour agrandir
                </div>
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* ── DESCRIPTION ───────────────────────────────────────────────────── */}
        <motion.section
          className="mt-12 max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold mb-4">Description du projet</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Ce projet simule une infrastructure réseau d'entreprise composée de plusieurs
            réseaux locaux interconnectés via un WAN. Une architecture de haute disponibilité
            est mise en œuvre via HSRP pour garantir la continuité de service en cas de
            défaillance d'un routeur actif.
          </p>
          <p className="text-sm text-slate-300 leading-relaxed mt-4">
            La supervision repose sur SNMP et la sauvegarde des configurations est centralisée
            via TFTP. Le projet est orienté exploitation, résilience et observabilité réseau.
          </p>
        </motion.section>

        {/* ── CE QUE J'AI APPRIS ────────────────────────────────────────────── */}
        <motion.section
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold mb-4">Ce que j'ai appris</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                title: "Convergence réseau",
                desc: "Comprendre comment OSPF recalcule les routes automatiquement lors d'une panne de lien — et le temps de convergence réel en lab.",
              },
              {
                title: "Redondance de passerelle",
                desc: "Configurer HSRP avec priorité et preemption pour garantir une bascule propre sans interruption visible côté hôtes.",
              },
              {
                title: "Débogage réseau",
                desc: "Utiliser les commandes show et debug sur IOS Cisco pour diagnostiquer des problèmes de routage et de trunk VLAN.",
              },
              {
                title: "Supervision et traçabilité",
                desc: "Mettre en place SNMP v2c, configurer les community strings et vérifier la remontée des traps vers un NMS.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-slate-900/60 border border-slate-800 rounded-xl p-5"
              >
                <h3 className="font-semibold text-slate-100 mb-1">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── DOCUMENTS ─────────────────────────────────────────────────────── */}
        <motion.section
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-semibold mb-4">Documents et livrables</h2>
          <div className="flex flex-col gap-3">
            {documents.map((doc) => (
              <a
                key={doc.file}
                href={doc.file}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 rounded-lg border border-slate-700 bg-slate-900/60 hover:border-blue-400 hover:text-blue-300 transition text-sm w-fit"
              >
                {doc.label}
              </a>
            ))}
          </div>
        </motion.section>

      </div>

      {/* ── LIGHTBOX ──────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {openImage && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-zoom-out"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenImage(null)}
          >
            <motion.img
              src={openImage}
              alt="Aperçu agrandi"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.92 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

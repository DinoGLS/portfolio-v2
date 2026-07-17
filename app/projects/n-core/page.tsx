"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// ── Technos (accent backend / sécurité mis en avant) ─────────────────────────
const TECH_BADGES = [
  { label: "React Native", color: "#61dafb" },
  { label: "Expo SDK 56", color: "#000020" },
  { label: "TypeScript", color: "#3178c6" },
  { label: "AES-256-GCM", color: "#ef4444" },
  { label: "expo-secure-store", color: "#f59e0b" },
  { label: "Zustand", color: "#764abc" },
  { label: "WebGL / 3D", color: "#10b981" },
];

// ── Fonctionnalités — l'accent est mis sur le backend & la sécurité ──────────
const FEATURES = [
  {
    id: "crypto",
    color: "#ef4444",
    icon: "🔐",
    title: "Chiffrement local des données de santé",
    subtitle: "AES-256-GCM · clé dans le trousseau natif",
    desc: "Tout le store (dont le suivi de cycle menstruel, donnée de santé sensible) est chiffré en AES-256-GCM (chiffrement authentifié). La clé maître 256 bits est générée par CSPRNG et stockée dans le Keychain iOS / Keystore Android via expo-secure-store, jamais dans AsyncStorage. Politique d'accès WHEN_UNLOCKED_THIS_DEVICE_ONLY : la clé n'existe que sur cet appareil, déverrouillé. IV aléatoire de 12 octets à chaque écriture (pas de réutilisation d'IV).",
    status: "Fait",
  },
  {
    id: "offline",
    color: "#10b981",
    icon: "📡",
    title: "IA locale, zéro API externe",
    subtitle: "Moteur de recommandation on-device",
    desc: "Le moteur d'IA (plans d'entraînement + nutrition) tourne entièrement sur l'appareil : aucune donnée de santé ne transite par un serveur tiers. Conception offline-first qui réduit la surface d'exposition — un choix de privacy/security by design plutôt qu'un simple confort hors-ligne.",
    status: "Fait",
  },
  {
    id: "migration",
    color: "#f59e0b",
    icon: "🗄️",
    title: "Migration de données sécurisée",
    subtitle: "Clair → chiffré, sans perte",
    desc: "Migration transparente de l'ancien store en clair (ncore-store-v2) vers le format chiffré (ncore-enc-v1:), avec sauvegarde conservée pendant la bascule. Encodeur/décodeur Base64 réimplémenté à la main (le runtime Hermes n'expose ni Buffer ni btoa fiable) pour manipuler clés et IV binaires.",
    status: "Fait",
  },
  {
    id: "anatomy",
    color: "#a3e635",
    icon: "🧬",
    title: "Anatomie 3D temps réel (WebGL)",
    subtitle: "Heatmap musculaire interactive",
    desc: "Un vrai corps 3D WebGL manipulable : les groupes musculaires travaillés s'illuminent selon la séance et le suivi hebdo. Trois vues — heatmap de la semaine, détail exercice (muscles ciblés), séance en direct où le corps se remplit série après série.",
    status: "Fait",
  },
  {
    id: "state",
    color: "#764abc",
    icon: "⚙️",
    title: "État & persistance",
    subtitle: "Zustand + AsyncStorage",
    desc: "Store unique typé (Zustand) persisté via AsyncStorage, derrière la couche de chiffrement. 21 sports, 13 types d'entraînement, 14 badges automatiques, suivi de cycle, social — tout sérialisé et chiffré de façon cohérente.",
    status: "Fait",
  },
];

// ── Compétences ciblées, orientées profil DevSecOps / SOC ────────────────────
const SKILLS = [
  { domain: "Cryptographie appliquée", skills: "AES-256-GCM authentifié, gestion de clé hors app (trousseau natif), CSPRNG, non-réutilisation d'IV" },
  { domain: "Sécurité mobile", skills: "Stockage sensible chiffré, politique d'accès au secret, données de santé (privacy by design)" },
  { domain: "Architecture offline-first", skills: "IA on-device, réduction de la surface d'exposition, aucune dépendance serveur pour le cœur" },
  { domain: "Backend / données", skills: "Modélisation d'un store typé, sérialisation, migration de données en production sans perte" },
  { domain: "React Native / Expo", skills: "Expo Router, dev client EAS, composants UI custom, thème tokenisé" },
  { domain: "3D / rendu", skills: "WebGL, mapping de groupes musculaires, animation d'état temps réel" },
];

// ── Galerie (mockups) ────────────────────────────────────────────────────────
// Pour ajouter les vrais écrans : déposer les PNG/JPG dans public/projects/n-core/
// avec ces noms exacts. Tant qu'un fichier manque, le placeholder SVG s'affiche.
const GALLERY = [
  { src: "/projects/n-core/mood.png", alt: "État du système — l'IA calibre l'intensité de la séance", label: "État du système · calibrage IA" },
  { src: "/projects/n-core/coach-ia.png", alt: "Coach IA — assistant conversationnel local", label: "Coach IA · assistant local" },
  { src: "/projects/n-core/seance.png", alt: "Séance active — logger des séries en direct", label: "Séance active · logger" },
  { src: "/projects/n-core/programme.png", alt: "Programme Push Pull Legs — séances et progression", label: "Programme · Push Pull Legs" },
  { src: "/projects/n-core/progres.png", alt: "Track & Progrès — volume d'entraînement et streak", label: "Track & Progrès · analytics" },
  { src: "/projects/n-core/perfs.png", alt: "Profil de performance — radar force/endurance/vitesse", label: "Profil de performance" },
];

// Vignette galerie : affiche la vraie capture si elle existe, sinon un placeholder
// inline (CSS pur, aucun chargement d'image — ne peut pas casser).
function Shot({ src, alt, label, onOpen }: { src: string; alt: string; label: string; onOpen: (s: string) => void }) {
  // "checking" au départ (placeholder affiché), puis "ok"/"broken" après sonde client.
  const [state, setState] = useState<"checking" | "ok" | "broken">("checking");
  useEffect(() => {
    const probe = new window.Image();
    probe.onload = () => setState("ok");
    probe.onerror = () => setState("broken");
    probe.src = src;
    return () => { probe.onload = null; probe.onerror = null; };
  }, [src]);
  const showImg = state === "ok";
  return (
    <button
      onClick={() => showImg && onOpen(src)}
      title={alt}
      className="relative aspect-[9/19] rounded-xl overflow-hidden border border-slate-200/80 dark:border-slate-700/60 bg-slate-900/40 hover:border-lime-400/50 transition-colors"
    >
      {showImg ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={src} alt={alt} className="absolute inset-0 h-full w-full object-contain" />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 text-center"
          style={{ background: "radial-gradient(ellipse at 50% 35%, rgba(163,230,53,0.10), transparent 70%), linear-gradient(#0a0b0d,#111417)" }}>
          <span className="text-lime-400 text-3xl">🔒</span>
          <span className="font-bold text-slate-100 tracking-wide">N.C0re</span>
          <span className="text-[11px] font-mono text-lime-400/90 tracking-widest">CAPTURE À VENIR</span>
          <span className="text-[11px] text-slate-400 leading-snug">{label}</span>
        </div>
      )}
    </button>
  );
}

export default function NCorePage() {
  const [active, setActive] = useState<string | null>("crypto");
  const [openImage, setOpenImage] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 px-4 py-16 text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Link href="/#projects" className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          ← Retour aux projets
        </Link>
      </motion.div>

      <div className="max-w-5xl mx-auto">
        {/* ── HEADER ─────────────────────────────────────────────────────── */}
        <motion.header className="mt-8 mb-10" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="px-3 py-1 text-xs rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium animate-pulse">En cours</span>
            <span className="px-3 py-1 text-xs rounded-full bg-red-500/20 text-red-300 border border-red-500/30 font-medium">DEV · MOBILE · SÉCURITÉ</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4 leading-tight">
            N.C0re<br />
            <span className="text-2xl md:text-3xl text-slate-400">App fitness chiffrée, offline-first</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            Application mobile React Native de suivi fitness universel — développée en solo, installée sur mon
            téléphone au quotidien. Au-delà du sport, c&apos;est mon terrain concret de{" "}
            <strong className="text-slate-900 dark:text-slate-100">sécurité applicative mobile</strong> : les données de
            santé sont chiffrées localement en AES-256-GCM, la clé vit dans le trousseau natif de l&apos;OS, et l&apos;IA
            de recommandation tourne <strong className="text-slate-900 dark:text-slate-100">entièrement sur l&apos;appareil</strong>, sans jamais
            envoyer une donnée personnelle à un serveur.
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {TECH_BADGES.map((b) => (
              <span key={b.label} className="px-2.5 py-1 text-xs rounded-md bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/60">
                {b.label}
              </span>
            ))}
          </div>
        </motion.header>

        {/* ── ANGLE SÉCURITÉ ─────────────────────────────────────────────── */}
        <motion.section className="mb-12" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
          <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-red-300 mb-3">L&apos;angle qui m&apos;intéresse : la sécurité du backend mobile</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Une app fitness basique pose les données en clair dans le stockage local. Ici, j&apos;ai traité le
              stockage comme en production : chiffrement <strong className="text-slate-900 dark:text-slate-100">authentifié</strong> (GCM,
              pas juste AES-CBC), clé gérée hors du stockage applicatif, génération aléatoire sécurisée, IV unique
              par écriture, et une migration de données maîtrisée. C&apos;est exactement le type de réflexe —
              identifier une donnée sensible et la protéger par défaut — que je veux apporter en poste DevSecOps / SOC.
            </p>
          </div>
        </motion.section>

        {/* ── GALERIE MOCKUPS ────────────────────────────────────────────── */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">Aperçu de l&apos;app</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {GALLERY.map((img) => (
              <Shot key={img.src} src={img.src} alt={img.alt} label={img.label} onOpen={setOpenImage} />
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-3">Écrans de l&apos;app — vrai corps 3D WebGL avec heatmap musculaire (thème Volt).</p>
        </section>

        {/* ── FONCTIONNALITÉS / MODULES ──────────────────────────────────── */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">Ce que j&apos;ai construit</h2>
          <div className="space-y-4">
            {FEATURES.map((feat, i) => (
              <motion.div key={feat.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.06 }}>
                <div className="rounded-xl border overflow-hidden transition-all duration-200"
                  style={{ borderColor: active === feat.id ? feat.color + "60" : "rgba(51,65,85,0.6)", background: "rgba(15,23,42,0.88)" }}>
                  <button className="w-full text-left p-5 flex items-start gap-4" onClick={() => setActive(active === feat.id ? null : feat.id)}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                      style={{ background: feat.color + "15", border: `1px solid ${feat.color}40` }}>
                      {feat.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-base font-semibold text-slate-100">{feat.title}</h3>
                        <span className="px-2 py-0.5 text-xs rounded-full border"
                          style={{ color: feat.color, borderColor: feat.color + "40", background: feat.color + "15" }}>
                          {feat.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{feat.subtitle}</p>
                    </div>
                    <span className="text-slate-500 text-lg mt-1 flex-shrink-0">{active === feat.id ? "−" : "+"}</span>
                  </button>
                  {active === feat.id && (
                    <div className="px-5 pb-5 border-t border-slate-700/40">
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-4">{feat.desc}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── COMPÉTENCES ────────────────────────────────────────────────── */}
        <motion.section className="mb-10" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-5">Compétences mobilisées</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {SKILLS.map((item) => (
              <div key={item.domain} className="flex gap-3 p-4 rounded-lg border border-slate-200/80 dark:border-slate-700/60 bg-slate-800/80 dark:bg-slate-800/40">
                <span className="text-red-400 mt-0.5 flex-shrink-0 text-sm">▸</span>
                <div>
                  <p className="text-sm font-semibold text-slate-200">{item.domain}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.skills}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      </div>

      {/* ── LIGHTBOX ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {openImage && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOpenImage(null)}
          >
            <div className="relative h-[80vh] w-full max-w-md" onClick={(e) => e.stopPropagation()}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={openImage} alt="Aperçu N.C0re" className="h-full w-full object-contain" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const TECH_BADGES = [
  { label: "React / Next.js", color: "#61dafb" },
  { label: "TypeScript", color: "#3178c6" },
  { label: "PostgreSQL", color: "#336791" },
  { label: "Docker", color: "#2496ed" },
  { label: "API REST", color: "#10b981" },
  { label: "JWT Auth", color: "#f59e0b" },
  { label: "CI/CD", color: "#ef4444" },
];

const FEATURES = [
  {
    id: "auth",
    color: "#f59e0b",
    icon: "🔐",
    title: "Authentification sécurisée",
    subtitle: "JWT + refresh tokens",
    desc: "Système d'authentification complet avec tokens JWT, refresh automatique et sessions persistantes. Hashage des mots de passe via bcrypt. Protection des routes API.",
    status: "En cours",
  },
  {
    id: "tracking",
    color: "#10b981",
    icon: "📊",
    title: "Suivi d'entraînement",
    subtitle: "Séances, exercices, séries",
    desc: "Enregistrement des séances d'entraînement avec historique complet : exercices, séries, répétitions, poids. Visualisation de la progression sur des graphiques interactifs.",
    status: "En cours",
  },
  {
    id: "db",
    color: "#336791",
    icon: "🗄️",
    title: "Base de données",
    subtitle: "PostgreSQL + schéma relationnel",
    desc: "Modélisation d'un schéma relationnel : utilisateurs, programmes, séances, exercices, séries. Migrations versionnées, requêtes optimisées avec index.",
    status: "En cours",
  },
  {
    id: "deploy",
    color: "#2496ed",
    icon: "🚀",
    title: "Déploiement automatisé",
    subtitle: "Docker + CI/CD pipeline",
    desc: "Containerisation via Docker Compose (app + base de données). Pipeline CI/CD pour les tests automatisés et le déploiement continu. Reverse proxy avec Nginx.",
    status: "Planifié",
  },
];

const ROADMAP = [
  { phase: "Phase 1", title: "Auth & architecture", done: false, tasks: ["Modèle utilisateur PostgreSQL", "API auth (register/login/refresh)", "Frontend auth avec persistance"] },
  { phase: "Phase 2", title: "Core tracking", done: false, tasks: ["CRUD séances & exercices", "Interface saisie entraînement", "Historique & consultation"] },
  { phase: "Phase 3", title: "Analytics & UI", done: false, tasks: ["Graphiques progression", "Dashboard personnalisé", "Mode hors-ligne (PWA)"] },
  { phase: "Phase 4", title: "DevSecOps", done: false, tasks: ["Docker Compose production", "Pipeline CI/CD GitHub Actions", "Tests E2E Playwright"] },
];

export default function AppTrackMuscuPage() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 px-4 py-16 text-slate-800 dark:text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Link href="/#projects" className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          ← Retour aux projets
        </Link>
      </motion.div>

      <div className="max-w-5xl mx-auto">
        <motion.header className="mt-8 mb-10" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="px-3 py-1 text-xs rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium animate-pulse">En cours</span>
            <span className="px-3 py-1 text-xs rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-medium">DEV · DEVSECOPS</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4 leading-tight">
            App Track Muscu<br />
            <span className="text-2xl md:text-3xl text-slate-400">Suivi d&apos;entraînement & performance</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            Application web full-stack de suivi d&apos;entraînement. Ce projet sert de terrain d&apos;expérimentation
            pour les pratiques DevSecOps : authentification sécurisée, architecture API, containerisation Docker
            et déploiement automatisé via CI/CD.
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {TECH_BADGES.map((b) => (
              <span key={b.label} className="px-2.5 py-1 text-xs rounded-md bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/60">
                {b.label}
              </span>
            ))}
          </div>
        </motion.header>

        {/* Objectif DevSecOps */}
        <motion.section className="mb-12" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-blue-300 mb-3">Pourquoi ce projet ?</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Au-delà du suivi sportif, ce projet est un support concret pour expérimenter les pratiques
              <strong className="text-slate-900 dark:text-slate-100"> DevSecOps</strong> : intégration de la sécurité dès la conception
              (Auth JWT, hashage, validation des entrées), gestion des secrets (variables d&apos;environnement),
              containerisation et pipeline CI/CD. Chaque fonctionnalité est traitée comme en production.
            </p>
          </div>
        </motion.section>

        {/* Fonctionnalités */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">Fonctionnalités & modules</h2>
          <div className="space-y-4">
            {FEATURES.map((feat, i) => (
              <motion.div key={feat.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07 }}>
                <div className="rounded-xl border overflow-hidden transition-all duration-200"
                  style={{ borderColor: active === feat.id ? feat.color + "60" : "rgba(51,65,85,0.6)", background: "rgba(15,23,42,0.88)" }}>
                  <button className="w-full text-left p-5 flex items-start gap-4" onClick={() => setActive(active === feat.id ? null : feat.id)}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                      style={{ background: feat.color + "15", border: `1px solid ${feat.color}40` }}>
                      {feat.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
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

        {/* Roadmap */}
        <motion.section className="mb-12" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">Roadmap</h2>
          <div className="relative border-l border-slate-200/80 dark:border-slate-700/60 ml-4 space-y-8">
            {ROADMAP.map((phase, i) => (
              <div key={i} className="relative pl-8">
                <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-slate-900 ${phase.done ? "bg-emerald-500" : "bg-slate-600"}`} />
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{phase.phase}</span>
                  <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">{phase.title}</h3>
                  {!phase.done && <span className="text-xs text-amber-400 border border-amber-400/30 px-2 py-0.5 rounded-full">En cours</span>}
                </div>
                <ul className="space-y-1">
                  {phase.tasks.map((task, ti) => (
                    <li key={ti} className="flex items-center gap-2 text-sm text-slate-400">
                      <span className={phase.done ? "text-emerald-400" : "text-slate-600"}>
                        {phase.done ? "✓" : "○"}
                      </span>
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Compétences */}
        <motion.section className="mb-10" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-5">Compétences ciblées</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { domain: "Sécurité applicative", skills: "JWT, bcrypt, validation, CORS, headers sécurité" },
              { domain: "Base de données", skills: "PostgreSQL, schéma relationnel, migrations, index" },
              { domain: "API REST", skills: "Design RESTful, gestion erreurs, documentation" },
              { domain: "React / Next.js", skills: "App Router, Server Components, état global" },
              { domain: "DevOps", skills: "Docker Compose, CI/CD GitHub Actions, Nginx" },
              { domain: "Qualité", skills: "Tests unitaires, E2E Playwright, code review" },
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
      </div>
    </main>
  );
}

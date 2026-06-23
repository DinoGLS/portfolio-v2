"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const TECH_BADGES = [
  { label: "Flask", color: "#10b981" },
  { label: "Python", color: "#3b82f6" },
  { label: "Groq / Gemini", color: "#a855f7" },
  { label: "Pandoc", color: "#f59e0b" },
  { label: "WeasyPrint", color: "#ef4444" },
  { label: "Docker", color: "#2496ed" },
  { label: "Linux / SSH", color: "#64748b" },
];

const PIPELINE_STEPS = [
  { step: "01", label: "Notes brutes", desc: "Fichier .txt ou .md structuré selon le template BTS SISR", color: "#3b82f6", icon: "📝" },
  { step: "02", label: "LLM Cascade", desc: "Groq (llama-3.3-70b) ou Gemini génère le contenu structuré Markdown", color: "#a855f7", icon: "🤖" },
  { step: "03", label: "Post-traitement", desc: "Injection images, nettoyage anti-slop, wrapping smart", color: "#f59e0b", icon: "⚙️" },
  { step: "04", label: "Pandoc → HTML", desc: "Conversion MD → HTML stylisé avec thème CSS choisi", color: "#10b981", icon: "🎨" },
  { step: "05", label: "WeasyPrint → PDF", desc: "Rendu PDF de qualité print, table des matières automatique", color: "#ef4444", icon: "📄" },
];

const FEATURES = [
  {
    id: "pipeline",
    color: "#a855f7",
    title: "Pipeline LLM intelligent",
    subtitle: "Groq / Gemini avec fallback",
    desc: "Le pipeline tente Groq (llama-3.3-70b) en premier pour sa vitesse, puis bascule sur Gemini en cas d'erreur. Les notes sont transformées en livrables professionnels en moins d'une minute.",
    features: ["Groq llama-3.3-70b (primaire)", "Google Gemini (fallback)", "Prompt système optimisé BTS SISR", "Règles anti-slop intégrées"],
    code: 'def generate_doc(notes: str, provider: str = "groq") -> str:\n    client = Groq(api_key=os.environ["GROQ_API_KEY"])\n    response = client.chat.completions.create(\n        model="llama-3.3-70b-versatile",\n        messages=[\n            {"role": "system", "content": SYSTEM_PROMPT},\n            {"role": "user", "content": notes}\n        ]\n    )\n    return response.choices[0].message.content',
    lang: "python",
  },
  {
    id: "docker",
    color: "#2496ed",
    title: "Déploiement Docker",
    subtitle: "HP Server — port 5000",
    desc: "DocForge tourne en production sur mon HP Server (Tailscale) dans un conteneur Docker avec Gunicorn. Déploiement géré via docker-compose, logs centralisés, reverse proxy Nginx.",
    features: ["Docker Compose + Gunicorn", "Reverse proxy Nginx", "Variables d'environnement sécurisées", "Accès Tailscale (réseau privé)"],
    code: "# docker-compose.yml\nservices:\n  doc-forge:\n    build: .\n    ports:\n      - '5000:5000'\n    environment:\n      - GROQ_API_KEY=${GROQ_API_KEY}\n    restart: unless-stopped",
    lang: "yaml",
  },
  {
    id: "pdf",
    color: "#ef4444",
    title: "Rendu PDF professionnel",
    subtitle: "Pandoc + WeasyPrint",
    desc: "Pipeline de rendu : Pandoc convertit le Markdown en HTML, WeasyPrint génère le PDF avec support CSS complet (flexbox, variables, media print). Table des matières automatique.",
    features: ["Support CSS3 complet via WeasyPrint", "Table des matières automatique", "Images embarquées en base64", "Styles BTS SISR personnalisés"],
    code: "def render_pdf(md_content: str, theme: str = 'pro') -> bytes:\n    html = md_to_html(md_content, theme)\n    pdf = weasyprint.HTML(string=html).write_pdf()\n    return pdf",
    lang: "python",
  },
];

export default function DocForgePage() {
  const [active, setActive] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

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
            <span className="px-3 py-1 text-xs rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">En production</span>
            <span className="px-3 py-1 text-xs rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 font-medium">IA · DEVOPS · BTS SISR</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4 leading-tight">
            DocForge<br />
            <span className="text-2xl md:text-3xl text-slate-400">Générateur de livrables BTS SISR</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            Application Flask déployée sur mon HP Server qui transforme des notes techniques brutes en
            livrables professionnels Markdown + PDF via un pipeline LLM (Groq/Gemini) et un rendu
            Pandoc + WeasyPrint. Projet actif utilisé pour mes rendus BTS.
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {TECH_BADGES.map((b) => (
              <span key={b.label} className="px-2.5 py-1 text-xs rounded-md bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/60">
                {b.label}
              </span>
            ))}
          </div>
        </motion.header>

        {/* Pipeline visuel */}
        <motion.section className="mb-12" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">Pipeline de génération</h2>
          <div className="flex flex-col sm:flex-row gap-3 items-stretch">
            {PIPELINE_STEPS.map((step, i) => (
              <div key={step.step} className="flex sm:flex-col items-center gap-3 flex-1">
                <div className="flex sm:flex-col items-center gap-2 flex-1 w-full">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xl"
                    style={{ background: step.color + "20", border: `1px solid ${step.color}40` }}>
                    {step.icon}
                  </div>
                  <div className="text-center flex-1">
                    <p className="text-xs font-bold mb-1" style={{ color: step.color }}>{step.step}</p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">{step.label}</p>
                    <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
                {i < PIPELINE_STEPS.length - 1 && (
                  <div className="hidden sm:block text-slate-600 text-xl flex-shrink-0">→</div>
                )}
              </div>
            ))}
          </div>
        </motion.section>

        {/* Fonctionnalités */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">Fonctionnalités techniques</h2>
          <div className="space-y-4">
            {FEATURES.map((feat, i) => (
              <motion.div key={feat.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07 }}>
                <div className="rounded-xl border overflow-hidden transition-all duration-200"
                  style={{ borderColor: active === feat.id ? feat.color + "60" : "rgba(51,65,85,0.6)", background: "rgba(15,23,42,0.88)" }}>
                  <button className="w-full text-left p-5 flex items-start gap-4" onClick={() => setActive(active === feat.id ? null : feat.id)}>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-slate-100">{feat.title}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{feat.subtitle}</p>
                    </div>
                    <span className="text-slate-500 text-lg mt-1 flex-shrink-0">{active === feat.id ? "−" : "+"}</span>
                  </button>
                  {active === feat.id && (
                    <div className="px-5 pb-5 border-t border-slate-700/40">
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-4 mb-4">{feat.desc}</p>
                      <ul className="space-y-1.5 mb-5">
                        {feat.features.map((f, fi) => (
                          <li key={fi} className="flex items-start gap-2 text-sm text-slate-300">
                            <span style={{ color: feat.color }} className="mt-0.5 flex-shrink-0">▸</span>
                            {f}
                          </li>
                        ))}
                      </ul>
                      <div className="relative">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-slate-500 font-mono">{feat.lang}</span>
                          <button onClick={() => handleCopy(feat.code, feat.id)} className="text-xs text-slate-400 hover:text-slate-800 dark:text-slate-200 transition-colors px-2 py-1 rounded border border-slate-200/80 dark:border-slate-700/60">
                            {copied === feat.id ? "Copié ✓" : "Copier"}
                          </button>
                        </div>
                        <pre className="rounded-lg p-4 text-xs overflow-x-auto leading-relaxed"
                          style={{ background: "rgba(0,0,0,0.4)", border: `1px solid ${feat.color}20`, color: "#cbd5e1" }}>
                          <code>{feat.code}</code>
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Stats déploiement */}
        <motion.section className="mb-12" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-5">Déploiement HP Server</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Conteneur Docker", value: "Gunicorn", color: "#2496ed" },
              { label: "Accès réseau", value: "Tailscale", color: "#10b981" },
              { label: "Port production", value: "5000", color: "#f59e0b" },
              { label: "Uptime", value: "24/7", color: "#a855f7" },
            ].map((stat) => (
              <div key={stat.label} className="bg-slate-100/70 dark:bg-slate-800/85 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 rounded-xl p-4 text-center">
                <p className="text-xl font-bold mb-1" style={{ color: stat.color }}>{stat.value}</p>
                <p className="text-xs text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Compétences */}
        <motion.section className="mb-10" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-5">Compétences mobilisées</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { domain: "Python / Flask", skills: "API REST, routing, gestion des fichiers, Gunicorn" },
              { domain: "IA / LLM", skills: "Groq API, Gemini API, prompt engineering, fallback" },
              { domain: "Génération documents", skills: "Pandoc, WeasyPrint, CSS print, Markdown" },
              { domain: "Docker", skills: "Dockerfile, docker-compose, volumes, variables d'env" },
              { domain: "Administration Linux", skills: "SSH, services systemd, logs, Nginx reverse proxy" },
              { domain: "Sécurité", skills: "Secrets env vars, isolation réseau Tailscale" },
            ].map((item) => (
              <div key={item.domain} className="flex gap-3 p-4 rounded-lg border border-slate-200/80 dark:border-slate-700/60 bg-slate-800/80 dark:bg-slate-800/40">
                <span className="text-violet-400 mt-0.5 flex-shrink-0 text-sm">▸</span>
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

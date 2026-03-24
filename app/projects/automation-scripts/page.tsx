"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const modules = [
  {
    id: "menu",
    tag: "POWERSHELL · WPF",
    color: "blue",
    accent: "#3b82f6",
    bg: "rgba(59,130,246,0.08)",
    border: "rgba(59,130,246,0.25)",
    dot: "#3b82f6",
    title: "Menu principal",
    subtitle: "Interface graphique WPF",
    desc: "Fenêtre graphique native Windows construite avec WPF. Chaque outil se lance en un clic, les dépendances sont vérifiées automatiquement, et le menu se réaffiche après chaque opération.",
    features: [
      "Interface WPF sans installation requise",
      "Vérification des dépendances Python/pip",
      "Popups d'erreur si fichier manquant",
      "Retour automatique au menu",
    ],
    code: `# Vérification dépendance avant lancement
$pypdfCheck = python -c "import pypdf" 2>&1
if ($LASTEXITCODE -ne 0) {
    $rep = [System.Windows.MessageBox]::Show(
        "pypdf manquant. Installer ?",
        "Module manquant", "YesNo"
    )
    if ($rep -eq "Yes") {
        python -m pip install pypdf
    }
}`,
    lang: "powershell",
  },
  {
    id: "convertmd",
    tag: "PANDOC · PRINCE XML · CSS",
    color: "cyan",
    accent: "#06b6d4",
    bg: "rgba(6,182,212,0.08)",
    border: "rgba(6,182,212,0.25)",
    dot: "#06b6d4",
    title: "Convertisseur MD → PDF",
    subtitle: "10 thèmes CSS, mode watch",
    desc: "Pipeline Markdown → HTML stylisé → PDF via Pandoc et Prince XML. 10 thèmes visuels disponibles, table des matières automatique, vérification des images, versioning PDF et mode watch.",
    features: [
      "10 thèmes : Pro, Cyber, Dark, Minimal, Corporate...",
      "Table des matières automatique",
      "Mode WATCH — régénération live",
      "Versioning automatique (_v1, _v2...)",
    ],
    code: `function Build-PDF($md, $css) {
    $mdDir = Split-Path $md -Parent
    Set-Location $mdDir  # résout les images

    $version = 1
    $pdf = "$pdfBase\_v$version.pdf"
    while (Test-Path $pdf) {
        $version++
        $pdf = "$pdfBase\_v$version.pdf"
    }

    pandoc $md -o $html --standalone \\
        --css="$css" --toc --toc-depth=3
    prince $html -o $pdf
}`,
    lang: "powershell",
  },
  {
    id: "rapport",
    tag: "WMI · POWERSHELL · HTML",
    color: "emerald",
    accent: "#10b981",
    bg: "rgba(16,185,129,0.08)",
    border: "rgba(16,185,129,0.25)",
    dot: "#10b981",
    title: "Rapport PC",
    subtitle: "Diagnostique système complet",
    desc: "Collecte via WMI l'ensemble des informations d'une machine Windows (CPU, RAM, disques, réseau, ports, processus) et génère un rapport HTML horodaté sauvegardé dans un dossier Rapports/.",
    features: [
      "CPU, RAM, Disques, Réseau, BIOS, OS",
      "Ports TCP en écoute (gestion droits admin)",
      "Top 20 processus par mémoire",
      "Export HTML interactif horodaté",
    ],
    code: `# Collecte via WMI
$cpu = Get-CimInstance Win32_Processor |
    Select-Object Name, LoadPercentage,
    NumberOfCores, MaxClockSpeed

# Gestion erreur droits admin
try {
    $ports = Get-NetTCPConnection -State Listen
} catch {
    $ports = @([PSCustomObject]@{
        LocalAddress = "Droits admin requis"
        LocalPort = "-"
    })
}`,
    lang: "powershell",
  },
  {
    id: "cv",
    tag: "FLASK · PLAYWRIGHT · COLORTHIEF",
    color: "violet",
    accent: "#8b5cf6",
    bg: "rgba(139,92,246,0.08)",
    border: "rgba(139,92,246,0.25)",
    dot: "#8b5cf6",
    title: "Générateur de CV adaptatif",
    subtitle: "Couleurs automatiques par entreprise",
    desc: "Scrape le logo d'une entreprise depuis son URL, extrait la couleur dominante et génère un CV PDF aux couleurs de l'entreprise. Rendu via Playwright/Chromium pour un CSS moderne parfait.",
    features: [
      "Extraction couleur via ColorThief",
      "Filtrage luminance (évite blanc/noir)",
      "Rendu Chromium headless — CSS complet",
      "Génération de lettres de motivation",
    ],
    code: `def get_dominant_color(logo_url):
    ct = ColorThief(png_path)
    r, g, b = ct.get_color(quality=1)

    # Filtre couleurs trop claires/sombres
    luminance = r*0.299 + g*0.587 + b*0.114
    if luminance > 200 or luminance < 30:
        return "#1a4d8f"  # fallback bleu

    return "#{:02x}{:02x}{:02x}".format(r,g,b)`,
    lang: "python",
  },
];

const themes = [
  { name: "Pro", color: "#1a4d8f", bg: "#eef3f8" },
  { name: "Cyber", color: "#00eaff", bg: "#0a0f14" },
  { name: "Dark", color: "#4da3ff", bg: "#121212" },
  { name: "Minimal", color: "#000", bg: "#fff" },
  { name: "Corporate", color: "#1a4d8f", bg: "#f4f6f9" },
  { name: "Terminal", color: "#00ff88", bg: "#001b33" },
  { name: "Ubuntu", color: "#e95420", bg: "#300a24" },
  { name: "PowerShell", color: "#0078d4", bg: "#012456" },
];

const colorMap: Record<string, string> = {
  blue: "text-blue-400",
  cyan: "text-cyan-400",
  emerald: "text-emerald-400",
  amber: "text-amber-400",
  violet: "text-violet-400",
};

export default function UsbToolkitPage() {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <main className="min-h-screen px-4 py-16 text-slate-200">
      <div className="max-w-5xl mx-auto">

        {/* Retour */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            href="/#projects"
            className="text-sm text-slate-400 hover:text-blue-400 transition-colors"
          >
            ← Retour aux projets
          </Link>
        </motion.div>

        {/* Header */}
        <motion.header
          className="mt-8 mb-10"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 text-xs rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-medium">
              Terminé
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4 leading-tight">
            USB Toolkit — Boîte à outils<br />
            d'administration Windows portable
          </h1>

          <p className="text-slate-300 max-w-2xl leading-relaxed">
            Une suite d'outils d'administration système regroupés sur clef USB,
            accessibles via une interface graphique WPF sans installation. Conçue
            pour l'intervention terrain et la documentation technique.
          </p>

          {/* Stack pills */}
          <div className="flex flex-wrap gap-2 mt-6">
            {["PowerShell", "Python", "Flask", "WPF", "Pandoc", "Prince XML", "Playwright", "ColorThief", "BeautifulSoup"].map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 text-xs rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.header>

        {/* Architecture USB */}
        <motion.section
          className="mb-14"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-xl font-semibold text-slate-100 mb-5">
            Architecture de la clef USB
          </h2>

          <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-6 font-mono text-sm">
            <div className="text-slate-400 mb-1">
              <span className="text-blue-400">USB:/</span>
            </div>
            {[
              { indent: 1, name: "Menu.ps1", label: "Interface graphique principale (WPF)", color: "text-blue-400" },
              { indent: 1, name: "ConvertMD/", label: "", color: "text-slate-300", folder: true },
              { indent: 2, name: "buil.ps1", label: "Convertisseur Markdown → PDF", color: "text-cyan-400" },
              { indent: 2, name: "[10 thèmes CSS]", label: "Pro, Cyber, Dark, Minimal...", color: "text-slate-500" },
              { indent: 1, name: "Script_Bash_Powershell/", label: "", color: "text-slate-300", folder: true },
              { indent: 2, name: "rapportpc.ps1", label: "Rapport système complet", color: "text-emerald-400" },
              { indent: 2, name: "Lancer_RapportPC.bat", label: "Lanceur BAT", color: "text-slate-500" },
              { indent: 1, name: "Generateur_CV/", label: "", color: "text-slate-300", folder: true },
              { indent: 2, name: "server.py", label: "Serveur Flask générateur de CV", color: "text-violet-400" },
              { indent: 2, name: "data.json", label: "Données du CV", color: "text-slate-500" },
              { indent: 2, name: "lettre.json", label: "Données lettre de motivation", color: "text-slate-500" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-baseline gap-2 leading-7"
                style={{ paddingLeft: `${item.indent * 20}px` }}
              >
                <span className="text-slate-600">
                  {item.indent === 1 ? "├── " : "│   ├── "}
                </span>
                <span className={item.color}>{item.name}</span>
                {item.label && (
                  <span className="text-slate-600 text-xs">← {item.label}</span>
                )}
              </div>
            ))}
          </div>
        </motion.section>

        {/* Modules */}
        <section className="mb-14">
          <h2 className="text-xl font-semibold text-slate-100 mb-6">
            Les 5 modules
          </h2>

          <div className="space-y-5">
            {modules.map((mod, i) => (
              <motion.div
                key={mod.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <div
                  className="rounded-xl border overflow-hidden"
                  style={{
                    borderColor: activeModule === mod.id ? mod.accent + "60" : "rgba(51,65,85,0.6)",
                    background: activeModule === mod.id ? mod.bg : "rgba(15,23,42,0.5)",
                    transition: "all 0.2s ease",
                  }}
                >
                  {/* Header du module */}
                  <button
                    className="w-full text-left p-5 flex items-start gap-4"
                    onClick={() => setActiveModule(activeModule === mod.id ? null : mod.id)}
                  >
                    {/* Numéro */}
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                      style={{ background: mod.accent + "20", color: mod.accent, border: `1px solid ${mod.accent}40` }}
                    >
                      {i + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-xs font-medium tracking-wider uppercase"
                          style={{ color: mod.accent }}
                        >
                          {mod.tag}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold text-slate-100">
                        {mod.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">{mod.subtitle}</p>
                    </div>

                    <span className="text-slate-500 text-lg mt-1 flex-shrink-0">
                      {activeModule === mod.id ? "−" : "+"}
                    </span>
                  </button>

                  {/* Contenu expandé */}
                  {activeModule === mod.id && (
                    <div className="px-5 pb-5 border-t border-slate-700/40">
                      <p className="text-sm text-slate-300 leading-relaxed mt-4 mb-4">
                        {mod.desc}
                      </p>

                      {/* Features */}
                      <ul className="space-y-1.5 mb-5">
                        {mod.features.map((f, fi) => (
                          <li key={fi} className="flex items-start gap-2 text-sm text-slate-300">
                            <span style={{ color: mod.accent }} className="mt-0.5 flex-shrink-0">▸</span>
                            {f}
                          </li>
                        ))}
                      </ul>

                      {/* Code */}
                      <div className="relative">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-slate-500 font-mono">{mod.lang}</span>
                          <button
                            onClick={() => handleCopy(mod.code, mod.id)}
                            className="text-xs text-slate-400 hover:text-slate-200 transition-colors px-2 py-1 rounded border border-slate-700/60 hover:border-slate-500"
                          >
                            {copiedId === mod.id ? "Copié ✓" : "Copier"}
                          </button>
                        </div>
                        <pre
                          className="rounded-lg p-4 text-xs overflow-x-auto leading-relaxed"
                          style={{
                            background: "rgba(0,0,0,0.4)",
                            border: `1px solid ${mod.accent}20`,
                            color: "#cbd5e1",
                          }}
                        >
                          <code>{mod.code}</code>
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Thèmes CSS */}
        <motion.section
          className="mb-14"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-xl font-semibold text-slate-100 mb-2">
            Thèmes PDF disponibles
          </h2>
          <p className="text-sm text-slate-400 mb-5">
            10 thèmes CSS pour adapter le rendu PDF au contexte de la documentation.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {themes.map((theme) => (
              <div
                key={theme.name}
                className="rounded-lg border border-slate-700/60 overflow-hidden"
              >
                <div
                  className="h-10 flex items-center justify-center"
                  style={{ background: theme.bg }}
                >
                  <span
                    className="text-xs font-bold tracking-wider uppercase"
                    style={{ color: theme.color }}
                  >
                    {theme.name}
                  </span>
                </div>
                <div className="px-3 py-2 bg-slate-900/60">
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: theme.color }}
                    />
                    <span className="text-xs text-slate-400">{theme.name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Points techniques */}
        <motion.section
          className="mb-14"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-xl font-semibold text-slate-100 mb-5">
            Points techniques notables
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                title: "Portabilité clef USB",
                desc: "Tous les chemins utilisent $PSScriptRoot et Join-Path. La clef fonctionne quelle que soit la lettre de lecteur assignée par Windows.",
                color: "#3b82f6",
              },
              {
                title: "Playwright vs wkhtmltopdf",
                desc: "wkhtmltopdf (2012) ne supporte pas le CSS moderne. Playwright utilise Chromium headless — rendu identique au navigateur, flexbox et grid inclus.",
                color: "#8b5cf6",
              },
              {
                title: "Résolution images Pandoc",
                desc: "Un Set-Location vers le dossier du .md avant Pandoc garantit la résolution correcte des images, même pour des fichiers externes à la clef.",
                color: "#06b6d4",
              },
            ].map((point) => (
              <div
                key={point.title}
                className="rounded-xl border border-slate-700/60 bg-slate-800/40 p-5"
              >
                <div
                  className="w-1 h-5 rounded-full mb-3"
                  style={{ background: point.color }}
                />
                <h3 className="text-sm font-semibold text-slate-100 mb-2">
                  {point.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {point.desc}
                </p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Compétences */}
        <motion.section
          className="mb-14"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-xl font-semibold text-slate-100 mb-5">
            Compétences mobilisées
          </h2>

          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { domain: "PowerShell", skills: "WMI/CIM, WPF, paramètres, fonctions, gestion d'erreurs" },
              { domain: "Python", skills: "Flask, scraping web, traitement image, PDF, API REST" },
              { domain: "Administration Windows", skills: "Inventaire matériel, ports réseau, processus, diagnostique" },
              { domain: "CSS Print", skills: "@page, print-color-adjust, mise en page PDF, thèmes" },
              { domain: "Automatisation", skills: "Pipeline MD→PDF, mode watch, versioning automatique" },
              { domain: "Portabilité", skills: "Chemins relatifs/absolus, dépendances dynamiques, USB" },
            ].map((item) => (
              <div
                key={item.domain}
                className="flex gap-3 p-4 rounded-lg border border-slate-700/60 bg-slate-800/40"
              >
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
        <motion.section
          className="mb-10"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-xl font-semibold text-slate-100 mb-5">
            Documentation
          </h2>

          <div className="flex flex-col gap-3">
            {[
              {
                label: "Livrable technique — USB Toolkit",
                file: "/projects/usb-toolkit/USB_Toolkit_Livrable.pdf",
              },
            ].map((doc) => (
              <a
                key={doc.file}
                href={doc.file}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-4 py-3 rounded-lg border border-slate-700/60 bg-slate-800/40 hover:border-blue-400/60 hover:text-blue-300 transition-all text-sm w-fit"
              >
                <span className="text-blue-400">↓</span>
                {doc.label}
              </a>
            ))}
          </div>
        </motion.section>

      </div>
    </main>
  );
}

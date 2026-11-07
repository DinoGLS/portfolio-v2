"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { useTheme } from "@/app/providers/ThemeProvider";
import { homeStrings } from "@/app/lib/i18n";

interface HeroReseauProps {
  onNavigate: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}

// Accueil en carte réseau : le nom est le commutateur central, chaque section une unité de baie
// reliée par un câble. La carte sert de menu. Sur téléphone, la même chose en liste verticale.
// Plan de 1000 x 560. Équipements : 220 de large, centre à (x, y). Commutateur central : x 330 à 670, y 195 à 365.
interface Noeud {
  id: string;
  href: string;
  fr: string;
  en: string;
  x: number;
  y: number;
  cable: string;
  couleur: string;
}

const NOEUDS: Noeud[] = [
  { id: "projects", href: "#projects", fr: "Projets", en: "Projects", x: 130, y: 100, cable: "M330 250 C285 250 285 100 241 100", couleur: "#60a5fa" },
  { id: "infra", href: "#infra", fr: "Infrastructure", en: "Infrastructure", x: 130, y: 280, cable: "M330 280 H241", couleur: "#38bdf8" },
  { id: "about", href: "#about", fr: "À propos", en: "About", x: 130, y: 460, cable: "M330 310 C285 310 285 460 241 460", couleur: "#818cf8" },
  { id: "veille", href: "#veille", fr: "Veille cyber", en: "Cyber watch", x: 870, y: 100, cable: "M670 250 C715 250 715 100 759 100", couleur: "#a78bfa" },
  { id: "competences", href: "#competences", fr: "Compétences", en: "Skills", x: 870, y: 280, cable: "M670 280 H759", couleur: "#22d3ee" },
  { id: "synthese", href: "#synthese", fr: "Tableau de synthèse", en: "Summary table", x: 870, y: 460, cable: "M670 310 C715 310 715 460 759 460", couleur: "#6366f1" },
  { id: "contact", href: "#contact", fr: "Contact", en: "Contact", x: 500, y: 500, cable: "M500 365 V468", couleur: "#93c5fd" },
];

// Vis de fixation d'une baie
const Vis = ({ className }: { className: string }) => (
  <span className={`absolute rounded-full border border-slate-400/70 bg-slate-300 dark:border-slate-500/60 dark:bg-slate-700 ${className}`} style={{ width: "0.7cqw", height: "0.7cqw" }} />
);

// Rangée de ports réseau (carrés creux, certains allumés)
const Ports = ({ n, allumes, couleur }: { n: number; allumes: number[]; couleur: string }) => (
  <span className="flex" style={{ gap: "0.35cqw" }}>
    {Array.from({ length: n }).map((_, i) => (
      <span
        key={i}
        className="block rounded-[1.5px] border border-[#c5cdd6] bg-[#f8f9fb] dark:border-slate-600/70 dark:bg-slate-900"
        style={{ width: "1cqw", height: "0.9cqw", boxShadow: allumes.includes(i) ? `inset 0 -0.3cqw 0 ${couleur}` : undefined }}
      />
    ))}
  </span>
);

// Mode clair : mêmes teintes, plus foncées et moins vives pour rester lisibles sur fond pâle
const CABLE_CLAIR: Record<string, string> = {
  "#60a5fa": "#3f6fb5", "#38bdf8": "#3b86ab", "#818cf8": "#5b57b0", "#a78bfa": "#7a5ab5",
  "#22d3ee": "#2f8191", "#6366f1": "#4d4aa0", "#93c5fd": "#5b86c0",
};

export default function HeroReseau({ onNavigate }: HeroReseauProps) {
  const { lang } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const fr = lang === "fr";
  const h = homeStrings[lang];
  const reduit = useReducedMotion();
  const [actif, setActif] = useState<string | null>(null);

  const sousTitre = fr ? "Systèmes & réseaux · Cybersécurité" : "Systems & networks · Cybersecurity";
  // Dégradé d'origine du nom
  const degrade = isDark ? "linear-gradient(to right, #60a5fa, #818cf8)" : "linear-gradient(to right, #2f5c99, #5457b0)";
  const nomStyle = { backgroundImage: degrade, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" } as const;

  return (
    <section className="relative px-4 pt-16 pb-4">
      <div className="max-w-4xl mx-auto w-full">
        {/* ── Carte réseau (ordinateur) ── */}
        <div className="hidden md:block [container-type:inline-size]">
          <div className="relative w-full" style={{ aspectRatio: "1000 / 560" }}>
            {/* Câbles */}
            <svg viewBox="0 0 1000 560" className="absolute inset-0 w-full h-full" aria-hidden>
              {NOEUDS.map((n, i) => {
                const on = actif === n.id;
                const cc = isDark ? n.couleur : CABLE_CLAIR[n.couleur] ?? n.couleur;
                return (
                  <g key={n.id}>
                    <path d={n.cable} fill="none" stroke={cc} strokeWidth={on ? 12 : 7} strokeOpacity={on ? (isDark ? 0.28 : 0.2) : isDark ? 0.1 : 0.07} strokeLinecap="round" />
                    <motion.path
                      id={`cable-${n.id}`}
                      d={n.cable}
                      fill="none"
                      stroke={cc}
                      strokeWidth={on ? 3.2 : 2.2}
                      strokeLinecap="round"
                      strokeOpacity={on ? 1 : isDark ? 0.8 : 0.55}
                      initial={reduit ? false : { pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.9, delay: 0.5 + i * 0.1, ease: "easeInOut" }}
                    />
                    {!reduit && (
                      <>
                        <circle r={on ? 9 : 6} fill={cc} opacity={isDark ? 0.22 : 0.18}>
                          <animateMotion dur={`${3 + (i % 3) * 0.8}s`} begin={`${1.6 + i * 0.3}s`} repeatCount="indefinite">
                            <mpath href={`#cable-${n.id}`} />
                          </animateMotion>
                        </circle>
                        <circle r={on ? 4.5 : 3.2} fill={isDark ? "#fff" : cc} opacity={0.95}>
                          <animateMotion dur={`${3 + (i % 3) * 0.8}s`} begin={`${1.6 + i * 0.3}s`} repeatCount="indefinite">
                            <mpath href={`#cable-${n.id}`} />
                          </animateMotion>
                        </circle>
                      </>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Commutateur central : le nom */}
            <motion.div
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-[0.8cqw] border bg-gradient-to-b from-[#f6f7f9] to-[#eceff2] border-[#c5cdd6] dark:from-[#0f1a33] dark:to-[#08101f] dark:border-blue-400/40 flex flex-col items-center justify-center text-center"
              style={{
                left: "50%",
                top: "50%",
                width: "34%",
                height: `${(170 / 560) * 100}%`,
                boxShadow: isDark ? "0 0 3cqw rgba(96,165,250,0.18), inset 0 0 0 1px rgba(96,165,250,0.08)" : "0 0.5cqw 2cqw rgba(51,65,100,0.08)",
              }}
              initial={reduit ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Vis className="left-[1cqw] top-[1cqw]" />
              <Vis className="right-[1cqw] top-[1cqw]" />
              <Vis className="left-[1cqw] bottom-[1cqw]" />
              <Vis className="right-[1cqw] bottom-[1cqw]" />
              <div className="absolute top-[1.1cqw] left-1/2 -translate-x-1/2">
                <Ports n={8} allumes={[0, 1, 2, 4, 5, 7]} couleur="#22c55e" />
              </div>
              <h1 className="font-extrabold leading-[1.02] tracking-tight" style={{ fontSize: "3.7cqw", marginTop: "1.4cqw" }}>
                <span className="block"><span className="inline-block" style={nomStyle}>Garlens</span></span>
                <span className="block"><span className="inline-block" style={nomStyle}>Charles</span></span>
              </h1>
              <p className="font-mono uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400" style={{ fontSize: "0.95cqw", marginTop: "1cqw" }}>
                {sousTitre}
              </p>
            </motion.div>

            {/* Unités de baie = sections */}
            {NOEUDS.map((n, i) => {
              const on = actif === n.id;
              return (
                <motion.a
                  key={n.id}
                  href={n.href}
                  onClick={(e) => onNavigate(e, n.href)}
                  onMouseEnter={() => setActif(n.id)}
                  onMouseLeave={() => setActif(null)}
                  onFocus={() => setActif(n.id)}
                  onBlur={() => setActif(null)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-between rounded-[0.5cqw] border text-left bg-gradient-to-b ${
                    on
                      ? "from-[#eef2f7] to-[#e2e9f1] border-[#7d9cc0] dark:from-[#14264d] dark:to-[#0c1a38] dark:border-blue-400"
                      : "from-[#f6f7f9] to-[#eceff2] border-[#c5cdd6] dark:from-[#0f1a33] dark:to-[#08101f] dark:border-blue-400/30"
                  }`}
                  style={{
                    left: `${n.x / 10}%`,
                    top: `${(n.y / 560) * 100}%`,
                    width: "22%",
                    padding: "1.15cqw 2.4cqw",
                    boxShadow: on ? (isDark ? `0 0 2cqw ${n.couleur}55` : `0 0.4cqw 1.6cqw ${CABLE_CLAIR[n.couleur] ?? n.couleur}33`) : undefined,
                  }}
                  initial={reduit ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 + i * 0.1 }}
                >
                  {/* oreilles de fixation */}
                  <span className="absolute inset-y-0 left-0 border-r border-slate-400/40 dark:border-slate-600/50" style={{ width: "1.6cqw" }}>
                    <Vis className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </span>
                  <span className="absolute inset-y-0 right-0 border-l border-slate-400/40 dark:border-slate-600/50" style={{ width: "1.6cqw" }}>
                    <Vis className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </span>

                  <span className="min-w-0">
                    <span className="block font-semibold leading-tight text-slate-900 dark:text-slate-100" style={{ fontSize: "1.4cqw" }}>
                      {fr ? n.fr : n.en}
                    </span>
                    <span className="flex items-center font-mono text-slate-500 dark:text-slate-400" style={{ fontSize: "0.95cqw", gap: "0.5cqw", marginTop: "0.3cqw" }}>
                      <span className="rounded-full bg-green-500 flex-none" style={{ width: "0.6cqw", height: "0.6cqw" }} />
                      <span className={`rounded-full flex-none led-clignote`} style={{ width: "0.6cqw", height: "0.6cqw", background: n.couleur, animationDelay: `${i * 0.35}s` }} />
                      {`port ${String(i + 1).padStart(2, "0")}`}
                    </span>
                  </span>
                  <Ports n={4} allumes={on ? [0, 1, 2, 3] : [0, 2]} couleur={on ? n.couleur : "#22c55e"} />
                </motion.a>
              );
            })}
          </div>
        </div>

        {/* ── Téléphone : le même réseau en liste verticale ── */}
        <div className="md:hidden">
          <h1 className="mt-2 text-[3rem] font-extrabold leading-[0.95] tracking-tight">
            <span className="block"><span className="inline-block" style={nomStyle}>Garlens</span></span>
            <span className="block"><span className="inline-block" style={nomStyle}>Charles</span></span>
          </h1>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">{sousTitre}</p>
          <ul className="mt-8 ml-1 border-l border-slate-400/50 dark:border-blue-300/30">
            {NOEUDS.map((n, i) => (
              <li key={n.id} className="relative pl-6 py-1.5">
                <span className="absolute left-0 top-1/2 w-4 border-t border-slate-400/50 dark:border-blue-300/30" />
                <a
                  href={n.href}
                  onClick={(e) => onNavigate(e, n.href)}
                  className="flex items-center gap-3 rounded-[5px] border border-slate-400/60 bg-white/65 px-3 py-2.5 dark:border-blue-400/30 dark:bg-slate-950/65"
                >
                  <span className="h-2 w-2 rounded-full bg-green-500 flex-none" />
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{fr ? n.fr : n.en}</span>
                  <span className="ml-auto font-mono text-[11px] text-slate-500 dark:text-slate-400">{`port ${String(i + 1).padStart(2, "0")}`}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <motion.div
          className="mt-6 md:mt-8 flex flex-col items-center gap-5 text-center"
          initial={reduit ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
        >
          <div className="flex flex-wrap items-center justify-start md:justify-center gap-3 w-full">
            <a
              href="/documents/Tableau_synthese_E5_Charles_Garlens.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-2.5 rounded-full border border-slate-300/80 text-sm font-semibold text-slate-700 hover:border-blue-400 hover:text-blue-700 dark:border-slate-600/60 dark:text-slate-200 dark:hover:text-blue-300"
            >
              {h.hero.cv}
            </a>
            <Link href="/veille-cyber" className="inline-flex items-center px-3 py-2.5 text-sm font-semibold text-slate-600 hover:text-blue-700 dark:text-slate-300 dark:hover:text-blue-300">
              {fr ? "Veille cyber" : "Cyber news"} →
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

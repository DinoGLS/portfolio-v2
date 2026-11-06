"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { homeStrings } from "@/app/lib/i18n";

interface HeroReseauProps {
  onNavigate: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}

// Accueil en carte réseau : le nom est le routeur central, chaque section est un équipement
// relié par un câble. La carte sert de menu. Sur téléphone, la même chose en liste verticale.
// Coordonnées en unités d'un plan de 1000 x 560.
interface Noeud {
  id: string;
  href: string;
  fr: string;
  en: string;
  x: number;
  y: number;
  cable: string;
}

const NOEUDS: Noeud[] = [
  { id: "projects", href: "#projects", fr: "Projets", en: "Projects", x: 130, y: 100, cable: "M350 280 H290 V100 H240" },
  { id: "infra", href: "#infra", fr: "Infrastructure", en: "Infrastructure", x: 130, y: 280, cable: "M350 280 H240" },
  { id: "about", href: "#about", fr: "À propos", en: "About", x: 130, y: 460, cable: "M350 280 H290 V460 H240" },
  { id: "veille", href: "#veille", fr: "Veille cyber", en: "Cyber watch", x: 870, y: 100, cable: "M650 280 H710 V100 H760" },
  { id: "competences", href: "#competences", fr: "Compétences", en: "Skills", x: 870, y: 280, cable: "M650 280 H760" },
  { id: "synthese", href: "#synthese", fr: "Tableau de synthèse", en: "Summary table", x: 870, y: 460, cable: "M650 280 H710 V460 H760" },
  { id: "contact", href: "#contact", fr: "Contact", en: "Contact", x: 500, y: 500, cable: "M500 340 V468" },
];

export default function HeroReseau({ onNavigate }: HeroReseauProps) {
  const { lang } = useLanguage();
  const fr = lang === "fr";
  const h = homeStrings[lang];
  const reduit = useReducedMotion();
  const [actif, setActif] = useState<string | null>(null);

  const sousTitre = fr ? "Systèmes & réseaux · Cybersécurité" : "Systems & networks · Cybersecurity";

  return (
    <section className="relative min-h-dvh flex flex-col justify-center px-4 pt-24 pb-12">
      <div className="max-w-4xl mx-auto w-full">
        {/* ── Carte réseau (tablette et plus) ── */}
        <div className="hidden md:block [container-type:inline-size]">
          <div className="relative w-full" style={{ aspectRatio: "1000 / 560" }}>
            <svg viewBox="0 0 1000 560" className="absolute inset-0 w-full h-full" aria-hidden>
              {NOEUDS.map((n, i) => {
                const on = actif === n.id;
                return (
                  <g key={n.id}>
                    <motion.path
                      id={`cable-${n.id}`}
                      d={n.cable}
                      fill="none"
                      strokeLinejoin="round"
                      className={on ? "stroke-blue-500 dark:stroke-blue-400" : "stroke-slate-400/70 dark:stroke-blue-300/30"}
                      strokeWidth={on ? 2.5 : 1.5}
                      initial={reduit ? false : { pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.9, delay: 0.5 + i * 0.1, ease: "easeInOut" }}
                    />
                    {!reduit && (
                      <circle r={on ? 4.5 : 3} className="fill-blue-500 dark:fill-blue-300" opacity={on ? 1 : 0.75}>
                        <animateMotion dur={`${3.2 + (i % 3) * 0.9}s`} begin={`${1.6 + i * 0.3}s`} repeatCount="indefinite">
                          <mpath href={`#cable-${n.id}`} />
                        </animateMotion>
                      </circle>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Routeur central : le nom */}
            <motion.div
              className="absolute -translate-x-1/2 -translate-y-1/2 text-center rounded-[6px] border border-slate-400/60 bg-white/70 backdrop-blur-sm dark:border-blue-400/35 dark:bg-slate-950/70"
              style={{ left: "50%", top: "50%", width: "30%", padding: "2.2cqw 1.5cqw" }}
              initial={reduit ? false : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <p className="font-mono text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5" style={{ fontSize: "1.15cqw" }}>
                <span className="inline-block rounded-full bg-emerald-500" style={{ width: "0.8cqw", height: "0.8cqw" }} />
                {h.hero.available}
              </p>
              <h1 className="font-extrabold leading-[1.02] tracking-tight text-slate-900 dark:text-slate-50 mt-[1cqw]" style={{ fontSize: "3.6cqw" }}>
                Garlens
                <br />
                <span className="text-blue-600 dark:text-blue-400">Charles</span>
              </h1>
              <p className="font-mono uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400 mt-[1cqw]" style={{ fontSize: "1cqw" }}>
                {sousTitre}
              </p>
            </motion.div>

            {/* Équipements = sections */}
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
                  className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center rounded-[5px] border text-left ${
                    on
                      ? "border-blue-500 bg-blue-500/15 dark:border-blue-400"
                      : "border-slate-400/60 bg-white/65 dark:border-blue-400/30 dark:bg-slate-950/65"
                  }`}
                  style={{ left: `${n.x / 10}%`, top: `${(n.y / 560) * 100}%`, width: "22%", gap: "1cqw", padding: "1.1cqw 1.3cqw" }}
                  initial={reduit ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 + i * 0.1 }}
                >
                  <span className="rounded-full bg-emerald-500 flex-none" style={{ width: "0.8cqw", height: "0.8cqw" }} />
                  <span className="min-w-0">
                    <span className="block font-semibold text-slate-900 dark:text-slate-100 leading-tight" style={{ fontSize: "1.45cqw" }}>
                      {fr ? n.fr : n.en}
                    </span>
                    <span className="block font-mono text-slate-500 dark:text-slate-400" style={{ fontSize: "1cqw" }}>
                      {`port ${String(i + 1).padStart(2, "0")}`}
                    </span>
                  </span>
                </motion.a>
              );
            })}
          </div>
        </div>

        {/* ── Téléphone : le même réseau en liste verticale ── */}
        <div className="md:hidden">
          <p className="font-mono text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            {h.hero.available}
          </p>
          <h1 className="mt-4 text-[3rem] font-extrabold leading-[0.95] tracking-tight text-slate-900 dark:text-slate-50">
            Garlens
            <br />
            <span className="text-blue-600 dark:text-blue-400">Charles</span>
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
                  <span className="h-2 w-2 rounded-full bg-emerald-500 flex-none" />
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">{fr ? n.fr : n.en}</span>
                  <span className="ml-auto font-mono text-[11px] text-slate-500 dark:text-slate-400">{`port ${String(i + 1).padStart(2, "0")}`}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <motion.div
          className="mt-8 md:mt-10 flex flex-col items-center md:items-center gap-5 text-center"
          initial={reduit ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
        >
          <p className="max-w-2xl text-sm md:text-base leading-relaxed text-slate-600 dark:text-slate-300 text-left md:text-center">{h.hero.intro}</p>
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

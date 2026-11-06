"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { homeStrings } from "@/app/lib/i18n";

interface HeroV2Props {
  onNavigate: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}

export default function HeroV2({ onNavigate }: HeroV2Props) {
  const { lang } = useLanguage();
  const fr = lang === "fr";
  const h = homeStrings[lang];
  const reduit = useReducedMotion();

  const sommaire = [
    { href: "#projects", label: fr ? "Projets" : "Projects" },
    { href: "#veille", label: fr ? "Veille cyber" : "Cyber watch" },
    { href: "#infra", label: "Infrastructure" },
    { href: "#about", label: fr ? "À propos" : "About" },
    { href: "#parcours", label: fr ? "Parcours" : "Background" },
    { href: "#competences", label: fr ? "Compétences" : "Skills" },
    { href: "#synthese", label: fr ? "Tableau de synthèse" : "Summary table" },
    { href: "#contact", label: "Contact" },
  ];

  const apparition = (delay: number) => ({
    initial: reduit ? false : ({ opacity: 0, y: 22 } as const),
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  });

  return (
    <section className="relative min-h-dvh flex items-center px-4 pt-28 pb-16">
      <div className="max-w-6xl mx-auto w-full grid gap-12 lg:grid-cols-[1.3fr_1fr] items-center">
        <div>
          <motion.p
            {...apparition(0.1)}
            className="font-mono text-xs tracking-wide text-slate-500 dark:text-slate-400 mb-6 flex items-center gap-2"
          >
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            {h.hero.available}
          </motion.p>

          <h1 className="font-extrabold leading-[0.95] tracking-tight text-slate-900 dark:text-slate-50 text-[3rem] sm:text-[4.2rem] lg:text-[5.4rem]">
            <motion.span {...apparition(0.2)} className="block">
              Garlens
            </motion.span>
            <motion.span {...apparition(0.32)} className="block text-blue-600 dark:text-blue-400">
              Charles
            </motion.span>
          </h1>

          <motion.p
            {...apparition(0.5)}
            className="mt-6 font-mono text-xs md:text-sm uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400"
          >
            {h.hero.subtitle}
          </motion.p>

          <motion.p
            {...apparition(0.62)}
            className="mt-5 max-w-xl text-sm md:text-base leading-relaxed text-slate-600 dark:text-slate-300"
          >
            {h.hero.intro}
          </motion.p>

          <motion.div {...apparition(0.76)} className="mt-9 flex flex-wrap items-center gap-3">
            <a
              href="#projects"
              onClick={(e) => onNavigate(e, "#projects")}
              className="inline-flex items-center px-7 py-3 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500"
            >
              {fr ? "Voir les projets" : "See projects"}
            </a>
            <a
              href="/documents/Tableau_synthese_E5_Charles_Garlens.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-7 py-3 rounded-full border border-slate-300/80 text-sm font-semibold text-slate-700 hover:border-blue-400 hover:text-blue-700 dark:border-slate-600/60 dark:text-slate-200 dark:hover:text-blue-300"
            >
              {h.hero.cv}
            </a>
            <Link
              href="/veille-cyber"
              className="inline-flex items-center px-3 py-3 text-sm font-semibold text-slate-600 hover:text-blue-700 dark:text-slate-300 dark:hover:text-blue-300"
            >
              {fr ? "Veille cyber" : "Cyber news"} →
            </Link>
          </motion.div>
        </div>

        {/* Sommaire façon cartouche de plan */}
        <motion.nav
          {...apparition(0.5)}
          aria-label={fr ? "Sommaire" : "Contents"}
          className="rounded-[6px] border border-slate-300/70 bg-white/55 backdrop-blur-sm dark:border-blue-400/25 dark:bg-slate-900/45"
        >
          <p className="px-5 py-3 border-b border-slate-300/70 dark:border-blue-400/25 font-mono text-[11px] tracking-[0.2em] text-slate-500 dark:text-slate-400">
            {fr ? "// SOMMAIRE" : "// CONTENTS"}
          </p>
          <ul>
            {sommaire.map((s, i) => (
              <motion.li
                key={s.href}
                initial={reduit ? false : { opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: 0.7 + i * 0.05, ease: "easeOut" }}
              >
                <a
                  href={s.href}
                  onClick={(e) => onNavigate(e, s.href)}
                  className="flex items-baseline gap-4 px-5 py-2.5 border-b last:border-b-0 border-slate-200/70 dark:border-slate-700/40 text-slate-700 hover:bg-blue-500/10 hover:text-blue-700 dark:text-slate-200 dark:hover:text-blue-300"
                >
                  <span className="font-mono text-xs text-blue-600/80 dark:text-blue-400/80 w-5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm font-medium">{s.label}</span>
                  <span className="ml-auto font-mono text-xs text-slate-400">→</span>
                </a>
              </motion.li>
            ))}
          </ul>
        </motion.nav>
      </div>
    </section>
  );
}

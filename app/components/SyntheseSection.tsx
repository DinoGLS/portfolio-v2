"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { COMPETENCES, REALISATIONS } from "@/app/data/synthese";

const PDF = "/documents/Tableau_synthese_E5_Charles_Garlens.pdf";

export default function SyntheseSection() {
  const { lang } = useLanguage();
  const fr = lang === "fr";
  const reduit = useReducedMotion();
  const [actif, setActif] = useState<number | null>(null);

  const visibles = REALISATIONS.filter((r) => actif === null || r.c.includes(actif));
  const blocs: { cle: "formation" | "perso"; titre: string }[] = [
    { cle: "formation", titre: fr ? "En formation" : "During training" },
    { cle: "perso", titre: fr ? "Projets personnels" : "Personal projects" },
  ];

  return (
    <section id="synthese" className="px-4 pb-16 mt-20 scroll-mt-20">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-8"
          initial={reduit ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 mb-2">E5</p>
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
            {fr ? "Tableau de synthèse" : "Summary table"}
          </h2>
          <a
            href={PDF}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-blue-500/40 bg-blue-500/10 text-sm font-semibold text-blue-700 hover:bg-blue-500/20 dark:text-blue-300"
          >
            <ArrowDownTrayIcon className="w-4 h-4" />
            PDF
          </a>
        </motion.div>

        {/* Filtre : une compétence allume les lignes qui la cochent */}
        <div className="flex flex-wrap justify-center gap-2 mb-8" role="group" aria-label={fr ? "Filtrer par compétence" : "Filter by skill"}>
          {COMPETENCES.map((k) => {
            const on = actif === k.n;
            return (
              <button
                key={k.n}
                type="button"
                aria-pressed={on}
                onClick={() => setActif(on ? null : k.n)}
                className={`px-3 py-1.5 rounded-full border text-xs font-mono ${
                  on
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "border-slate-300/70 bg-white/60 text-slate-600 hover:border-blue-400 hover:text-blue-700 dark:border-slate-600/50 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:text-blue-300"
                }`}
              >
                <b>C{k.n}</b> {fr ? k.fr : k.en}
              </button>
            );
          })}
        </div>

        {blocs.map((b) => {
          const lignes = visibles.filter((r) => r.bloc === b.cle);
          if (lignes.length === 0) return null;
          return (
            <div key={b.cle} className="mb-8">
              <h3 className="font-mono text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-3">{b.titre}</h3>
              <ul className="grid gap-2">
                {lignes.map((r, i) => (
                  <motion.li
                    key={r.titre}
                    layout={!reduit}
                    initial={reduit ? false : { opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.35, delay: reduit ? 0 : Math.min(i, 5) * 0.04, ease: "easeOut" }}
                    className="grid md:grid-cols-[1fr_auto] gap-x-6 gap-y-2 items-center px-4 py-3 rounded-xl border border-slate-200/80 bg-white/70 hover:border-blue-400/70 dark:border-slate-700/60 dark:bg-slate-900/50 dark:hover:border-blue-500/60"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{r.titre}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {r.contexte}
                        {r.periode && <span className="font-mono text-blue-600/80 dark:text-blue-400/80"> · {r.periode}</span>}
                      </p>
                    </div>
                    <div className="flex gap-1" aria-label={r.c.map((n) => "C" + n).join(", ")}>
                      {COMPETENCES.map((k) => {
                        const coche = r.c.includes(k.n);
                        const surligne = actif === k.n;
                        return (
                          <motion.span
                            key={k.n}
                            initial={reduit || !coche ? false : { scale: 0.6, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 500, damping: 22, delay: reduit ? 0 : 0.1 + k.n * 0.03 }}
                            className={`w-8 h-6 inline-flex items-center justify-center rounded text-[10px] font-mono font-bold ${
                              coche
                                ? surligne
                                  ? "bg-blue-600 text-white"
                                  : "bg-blue-500/15 text-blue-700 dark:text-blue-300"
                                : "bg-slate-200/50 text-slate-400/70 dark:bg-slate-800/60 dark:text-slate-600"
                            }`}
                          >
                            C{k.n}
                          </motion.span>
                        );
                      })}
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}

"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { useTheme } from "@/app/providers/ThemeProvider";
import { THEMES_DATA, BADGE_STYLES, type Project } from "@/app/data/projects";
import { useBlueprintTokens } from "@/app/data/blueprint-tokens";

type Vue = "index" | "grille";

// Projets, deux façons de les voir :
//  - Index : une liste numérotée, le projet survolé s'affiche à droite (ordinateur) ;
//  - Grille : des cartes avec la capture toujours visible.
export default function ProjectsExplorer() {
  const { lang } = useLanguage();
  const fr = lang === "fr";
  const { theme } = useTheme();
  const bp = useBlueprintTokens(theme === "dark");
  const reduit = useReducedMotion();

  const [vue, setVue] = useState<Vue>("index");
  const [groupe, setGroupe] = useState<string | null>(null);
  const [survol, setSurvol] = useState(0);

  const projets: Project[] = useMemo(
    () => (groupe ? THEMES_DATA.find((t) => t.id === groupe)?.projects ?? [] : THEMES_DATA.flatMap((t) => t.projects)),
    [groupe],
  );
  const courant = projets[Math.min(survol, projets.length - 1)];
  const total = THEMES_DATA.reduce((s, t) => s + t.projects.length, 0);

  const chip = (actif: boolean, couleur: string) =>
    actif
      ? { background: `${couleur}22`, color: theme === "dark" ? "#e8f4ff" : couleur, borderColor: couleur }
      : { background: bp.chipBg, color: bp.sub, borderColor: bp.chipBorder };

  return (
    <section id="projects" className="relative mt-16 pt-20 md:pt-24 px-4 scroll-mt-20">
      <div className="relative max-w-6xl mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-7">
          <div>
            <p className="font-mono text-[11px] tracking-[0.2em] font-medium mb-3" style={{ color: bp.accent }}>
              {fr ? "// PROJETS" : "// PROJECTS"}
            </p>
            <h2 className="text-3xl md:text-[2.5rem] font-bold tracking-tight" style={{ color: bp.text }}>
              {fr ? "Mes projets" : "My projects"}
            </h2>
          </div>

          {/* Index / grille */}
          <div className="flex rounded-[4px] border overflow-hidden font-mono text-xs" style={{ borderColor: bp.chipBorder }} role="group" aria-label={fr ? "Affichage" : "View"}>
            {(["index", "grille"] as Vue[]).map((v) => (
              <button
                key={v}
                type="button"
                aria-pressed={vue === v}
                onClick={() => setVue(v)}
                className="px-3.5 py-1.5 font-semibold"
                style={vue === v ? { background: `${bp.accent}22`, color: bp.accent } : { color: bp.sub }}
              >
                {v === "index" ? "Index" : fr ? "Grille" : "Grid"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5 mb-8">
          <button
            onClick={() => { setGroupe(null); setSurvol(0); }}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-[4px] font-mono text-xs font-semibold border"
            style={chip(groupe === null, bp.accent)}
          >
            {fr ? "Tous" : "All"} <span className="opacity-70">{total}</span>
          </button>
          {THEMES_DATA.map((t) => (
            <button
              key={t.id}
              onClick={() => { setGroupe(groupe === t.id ? null : t.id); setSurvol(0); }}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-[4px] font-mono text-xs font-semibold border"
              style={chip(groupe === t.id, t.color)}
            >
              <span className="w-2 h-2 rounded-[2px] inline-block" style={{ background: t.color }} />
              {fr ? t.labelFr : t.labelEn} <span className="opacity-70">{t.projects.length}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {vue === "index" ? (
            <motion.div
              key={`index-${groupe ?? "tous"}`}
              initial={reduit ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid gap-8 lg:grid-cols-[1.2fr_1fr]"
            >
              <ol className="border-t" style={{ borderColor: bp.cardBorder }}>
                {projets.map((p, i) => (
                  <motion.li
                    key={p.href}
                    initial={reduit ? false : { opacity: 0, x: -14 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.4, delay: Math.min(i, 6) * 0.04, ease: "easeOut" }}
                    className="border-b"
                    style={{ borderColor: bp.cardBorder }}
                  >
                    <Link
                      href={p.href}
                      onMouseEnter={() => setSurvol(i)}
                      onFocus={() => setSurvol(i)}
                      className="flex items-start gap-4 px-2 py-4 group"
                      style={{ background: survol === i ? `${bp.accent}14` : "transparent" }}
                    >
                      <span className="font-mono text-sm w-7 pt-0.5" style={{ color: survol === i ? bp.accent : bp.faint }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold leading-snug" style={{ color: bp.text }}>
                          {fr ? p.title : p.titleEn}
                        </span>
                        <span className="block font-mono text-[0.68rem] tracking-wide mt-1" style={{ color: bp.sub }}>
                          {p.stack}
                        </span>
                        {/* Téléphone : pas de panneau à droite, la description reste sous le titre */}
                        <span className="block text-[0.85rem] leading-relaxed mt-2 lg:hidden" style={{ color: bp.sub }}>
                          {fr ? p.desc : p.descEn}
                        </span>
                      </span>
                      <span className={`hidden sm:inline-block px-2 py-0.5 text-[0.6rem] rounded-[4px] border font-medium flex-shrink-0 ${BADGE_STYLES[p.badgeColor]}`}>
                        {fr ? p.badge : p.badgeEn}
                      </span>
                      <span className="font-mono text-sm pt-0.5" style={{ color: survol === i ? bp.accent : bp.faint }}>→</span>
                    </Link>
                  </motion.li>
                ))}
              </ol>

              {/* Aperçu du projet survolé */}
              {courant && (
                <div className="hidden lg:block">
                  <div className="sticky top-28">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={courant.href}
                        initial={reduit ? false : { opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="rounded-[5px] border overflow-hidden"
                        style={{ background: bp.cardBg, borderColor: bp.cardBorder }}
                      >
                        <div className="relative w-full h-56 bg-black/25">
                          <Image
                            src={courant.preview}
                            alt={fr ? courant.title : courant.titleEn}
                            fill
                            className="object-contain"
                            sizes="(max-width: 1024px) 0px, 40vw"
                          />
                        </div>
                        <div className="p-5">
                          <p className="font-mono text-[0.65rem] tracking-[0.14em]" style={{ color: bp.accent }}>
                            {fr ? courant.tag : courant.tagEn}
                          </p>
                          <p className="mt-2 text-sm leading-relaxed" style={{ color: bp.sub }}>
                            {fr ? courant.desc : courant.descEn}
                          </p>
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {courant.stack.split(" · ").map((s) => (
                              <span key={s} className="font-mono text-[0.65rem] px-2 py-0.5 rounded-[3px] border" style={{ background: bp.chipBg, color: bp.chipText, borderColor: bp.chipBorder }}>
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key={`grille-${groupe ?? "tous"}`}
              initial={reduit ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
            >
              {projets.map((p, i) => (
                <motion.div
                  key={p.href}
                  initial={reduit ? false : { opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.45, delay: Math.min(i % 3, 2) * 0.06 }}
                >
                  <Link href={p.href} className="block h-full">
                    <article className="flex flex-col h-full overflow-hidden rounded-[5px] border hover:-translate-y-1 hover:shadow-lg transition-transform duration-100" style={{ background: bp.cardBg, borderColor: bp.cardBorder }}>
                      <div className="relative w-full h-40 bg-black/25">
                        <Image src={p.preview} alt={fr ? p.title : p.titleEn} fill className="object-contain" sizes="(max-width: 768px) 100vw, 33vw" />
                      </div>
                      <div className="flex flex-col gap-2 p-4 flex-1">
                        <p className="font-mono text-[0.65rem] tracking-[0.14em]" style={{ color: bp.accent }}>{fr ? p.tag : p.tagEn}</p>
                        <h3 className="text-base font-semibold leading-snug" style={{ color: bp.text }}>{fr ? p.title : p.titleEn}</h3>
                        <p className="text-[0.85rem] leading-relaxed" style={{ color: bp.sub }}>{fr ? p.desc : p.descEn}</p>
                      </div>
                    </article>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

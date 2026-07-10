"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { useTheme } from "@/app/providers/ThemeProvider";
import { THEMES_DATA, BADGE_STYLES } from "@/app/data/projects";
import { useBlueprintTokens } from "@/app/data/blueprint-tokens";

interface ProjectsSectionProps {
  isMobile: boolean;
}

export default function ProjectsSection({ isMobile }: ProjectsSectionProps) {
  const { lang } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const bp = useBlueprintTokens(isDark);
  const [activeTheme, setActiveTheme] = useState<string | null>(null);

  const visibleProjects = activeTheme
    ? THEMES_DATA.find((t) => t.id === activeTheme)?.projects ?? []
    : THEMES_DATA.flatMap((t) => t.projects);

  return (
    <section id="projects" className="relative mt-16 pt-20 md:pt-24 px-4">
      <div className="relative max-w-6xl mx-auto">
        {/* Cartouche d'en-tête façon plan */}
        <div className="text-center max-w-xl mx-auto mb-7">
          <p
            className="font-mono text-[11px] tracking-[0.2em] font-medium mb-3"
            style={{ color: bp.accent }}
          >
            {lang === "fr" ? "// PROJETS — 04" : "// PROJECTS — 04"}
          </p>
          <h2
            className="text-3xl md:text-[2.5rem] font-bold tracking-tight inline-block bg-clip-text text-transparent mb-2.5"
            style={{ backgroundImage: bp.titleGrad }}
          >
            {lang === "fr" ? "Mes projets" : "My projects"}
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: bp.sub }}>
            {lang === "fr"
              ? "Sélectionne un thème pour filtrer, ou parcours l'ensemble des réalisations."
              : "Select a theme to filter, or browse all projects."}
          </p>
        </div>

        {/* Chips de filtre */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-8">
          <button
            onClick={() => setActiveTheme(null)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-[4px] font-mono text-xs font-semibold border transition-all backdrop-blur-sm"
            style={
              activeTheme === null
                ? { background: `${bp.accent}22`, color: bp.accent, borderColor: bp.accent }
                : { background: bp.chipBg, color: bp.sub, borderColor: bp.chipBorder }
            }
          >
            <span
              className="w-2 h-2 rounded-[2px] flex-shrink-0 inline-block"
              style={{ background: bp.accent }}
            />
            {lang === "fr" ? "Tous" : "All"}
            <span
              className="text-[0.68rem] rounded-[4px] px-1.5 py-0.5"
              style={{ background: bp.chipBg, color: bp.sub }}
            >
              {THEMES_DATA.reduce((s, t) => s + t.projects.length, 0)}
            </span>
          </button>
          {THEMES_DATA.map((theme) => (
            <button
              key={theme.id}
              onClick={() => setActiveTheme(activeTheme === theme.id ? null : theme.id)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-[4px] font-mono text-xs font-semibold border transition-all backdrop-blur-sm"
              style={
                activeTheme === theme.id
                  ? {
                      background: `${theme.color}22`,
                      color: isDark ? "#e8f4ff" : theme.color,
                      borderColor: theme.color,
                    }
                  : { background: bp.chipBg, color: bp.sub, borderColor: bp.chipBorder }
              }
            >
              <span
                className="w-2 h-2 rounded-[2px] flex-shrink-0 inline-block"
                style={{ background: theme.color }}
              />
              {lang === "fr" ? theme.labelFr : theme.labelEn}
              <span
                className="text-[0.68rem] rounded-[4px] px-1.5 py-0.5"
                style={{ background: bp.chipBg, color: bp.sub }}
              >
                {theme.projects.length}
              </span>
            </button>
          ))}
        </div>

        {/* Grille projets */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTheme ?? "all"}
            className="grid gap-5 md:grid-cols-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28 }}
          >
            {visibleProjects.map((p, idx) => (
              <motion.div
                key={p.href}
                initial={{ opacity: 0, y: 24 }}
                animate={isMobile ? { opacity: 1, y: 0 } : undefined}
                whileInView={isMobile ? undefined : { opacity: 1, y: 0 }}
                viewport={isMobile ? undefined : { once: true, amount: 0.15 }}
                transition={{
                  duration: isMobile ? 0 : 0.45,
                  delay: isMobile ? 0 : idx * 0.06,
                }}
              >
                <Link href={p.href} className="block h-full">
                  <article
                    className="group relative flex flex-col h-full overflow-hidden rounded-[5px] border backdrop-blur-[8px] transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                    style={{ background: bp.cardBg, borderColor: bp.cardBorder }}
                  >
                    {/* Numéro de plan */}
                    <span
                      className="absolute top-2 right-4 font-mono text-[40px] font-extrabold leading-none z-[2] pointer-events-none select-none"
                      style={{ color: bp.faint, opacity: 0.3 }}
                    >
                      {String(idx + 1).padStart(2, "0")}
                    </span>

                    <div
                      className="relative overflow-hidden max-h-0 group-hover:max-h-40 transition-all duration-300"
                      style={{ borderColor: bp.cardBorder }}
                    >
                      <div className="relative w-full h-40">
                        <Image
                          src={p.preview}
                          alt={lang === "fr" ? p.title : p.titleEn}
                          fill
                          className="object-cover object-[50%_20%] transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 33vw"
                          style={{ filter: "saturate(0.92) hue-rotate(-6deg)" }}
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <span className="absolute bottom-2 left-2 text-xs text-white">
                        {lang === "fr" ? "Voir le projet" : "View project"}
                      </span>
                    </div>

                    <div className="flex flex-col gap-2.5 p-4 pt-4 flex-1">
                      <div className="flex items-center gap-2">
                        <p
                          className="font-mono text-[0.65rem] font-medium tracking-[0.14em]"
                          style={{ color: bp.accent }}
                        >
                          {lang === "fr" ? p.tag : p.tagEn}
                        </p>
                        <span
                          className={`ml-auto mr-7 px-2 py-0.5 text-[0.6rem] rounded-[4px] border font-medium flex-shrink-0 ${BADGE_STYLES[p.badgeColor]}`}
                        >
                          {lang === "fr" ? p.badge : p.badgeEn}
                        </span>
                      </div>
                      <h3
                        className="text-base font-semibold leading-snug transition-colors"
                        style={{ color: bp.text }}
                      >
                        {lang === "fr" ? p.title : p.titleEn}
                      </h3>
                      <p className="text-[0.85rem] leading-relaxed" style={{ color: bp.sub }}>
                        {lang === "fr" ? p.desc : p.descEn}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-auto pt-1.5">
                        {p.stack.split(" · ").map((s) => (
                          <span
                            key={s}
                            className="font-mono text-[0.65rem] px-2 py-0.5 rounded-[3px] border"
                            style={{
                              background: bp.chipBg,
                              color: bp.chipText,
                              borderColor: bp.chipBorder,
                            }}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

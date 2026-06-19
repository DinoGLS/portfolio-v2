"use client";

import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useTheme } from "@/app/providers/ThemeProvider";
import { useLanguage, LANGS } from "@/app/providers/LanguageProvider";

// Dock flottant en haut à droite : bascule de thème + bascule de langue.
// Volontairement compact pour ne pas gêner la navbar existante.
export default function ControlsDock() {
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang, t } = useLanguage();
  const isDark = theme === "dark";

  return (
    <div className="fixed top-3 right-3 z-[60] flex items-center gap-2">
      {/* Sélecteur de langue : segmenté FR / EN */}
      <div
        role="group"
        aria-label={t("common.langLabel")}
        className="flex items-center rounded-full border border-slate-300/70 bg-white/80 p-0.5 backdrop-blur
                   dark:border-slate-700/70 dark:bg-slate-900/70"
      >
        {LANGS.map((l) => {
          const active = l === lang;
          return (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              aria-pressed={active}
              className={`relative rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wider transition-colors
                ${active ? "text-slate-950 dark:text-slate-950" : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100"}`}
            >
              {active && (
                <motion.span
                  layoutId="lang-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-emerald-400 dark:bg-emerald-400"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              {l}
            </button>
          );
        })}
      </div>

      {/* Bascule de thème */}
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={isDark ? t("common.themeToLight") : t("common.themeToDark")}
        title={isDark ? t("common.themeToLight") : t("common.themeToDark")}
        className="grid h-8 w-8 place-items-center rounded-full border border-slate-300/70 bg-white/80 text-slate-700 backdrop-blur
                   transition-colors hover:border-emerald-400 hover:text-emerald-500
                   dark:border-slate-700/70 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-emerald-400 dark:hover:text-emerald-300"
      >
        {isDark ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
      </button>
    </div>
  );
}

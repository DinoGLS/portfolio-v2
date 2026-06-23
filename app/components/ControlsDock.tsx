"use client";

import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useTheme } from "@/app/providers/ThemeProvider";
import { useLanguage, LANGS } from "@/app/providers/LanguageProvider";
import { usePathname } from "next/navigation";

export default function ControlsDock() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang, t } = useLanguage();
  const isDark = theme === "dark";

  if (isHome) {
    return (
      <>
        {/* DESKTOP home — vertical top-left, style sidebar */}
        <div className="hidden md:flex lg:hidden fixed bottom-8 left-2 z-40 flex-col items-center gap-4">
          <div className="w-px h-8 bg-slate-400/40 dark:bg-slate-600/40 mb-1" />
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? t("common.themeToLight") : t("common.themeToDark")}
            className="text-slate-500 hover:text-blue-500 dark:text-slate-400 dark:hover:text-blue-300 transition-all duration-200 hover:-translate-y-0.5"
          >
            {isDark ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
          </button>
          <button
            type="button"
            onClick={() => setLang(lang === "fr" ? "en" : "fr")}
            aria-label={t("common.langLabel")}
            className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-blue-500 dark:text-slate-400 dark:hover:text-blue-300 transition-all duration-200 hover:-translate-y-0.5"
          >
            {lang}
          </button>
        </div>

        {/* MOBILE home — bottom-left */}
        <div className="md:hidden fixed bottom-6 left-6 z-[60] flex items-center gap-2">
          <div
            role="group"
            aria-label={t("common.langLabel")}
            className="flex items-center rounded-full border border-slate-300/70 bg-white/80 p-0.5 backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/70"
          >
            {LANGS.map((l) => {
              const active = l === lang;
              return (
                <button key={l} type="button" onClick={() => setLang(l)} aria-pressed={active}
                  className={`relative rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wider transition-colors
                    ${active ? "text-slate-950 dark:text-slate-950" : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100"}`}
                >
                  {active && (
                    <motion.span layoutId="dock-lang-pill-mobile"
                      className="absolute inset-0 -z-10 rounded-full bg-emerald-400"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                  )}
                  {l}
                </button>
              );
            })}
          </div>
          <button type="button" onClick={toggleTheme}
            aria-label={isDark ? t("common.themeToLight") : t("common.themeToDark")}
            className="grid h-8 w-8 place-items-center rounded-full border border-slate-300/70 bg-white/80 text-slate-700 backdrop-blur transition-colors hover:border-emerald-400 hover:text-emerald-500 dark:border-slate-700/70 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-emerald-400 dark:hover:text-emerald-300"
          >
            {isDark ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
          </button>
        </div>
      </>
    );
  }

  // Autres pages — top-right
  return (
    <div className="fixed top-3 right-3 z-[60] flex items-center gap-2">
      <div role="group" aria-label={t("common.langLabel")}
        className="flex items-center rounded-full border border-slate-300/70 bg-white/80 p-0.5 backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/70"
      >
        {LANGS.map((l) => {
          const active = l === lang;
          return (
            <button key={l} type="button" onClick={() => setLang(l)} aria-pressed={active}
              className={`relative rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wider transition-colors
                ${active ? "text-slate-950 dark:text-slate-950" : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100"}`}
            >
              {active && (
                <motion.span layoutId="dock-lang-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-emerald-400"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }} />
              )}
              {l}
            </button>
          );
        })}
      </div>
      <button type="button" onClick={toggleTheme}
        aria-label={isDark ? t("common.themeToLight") : t("common.themeToDark")}
        className="grid h-8 w-8 place-items-center rounded-full border border-slate-300/70 bg-white/80 text-slate-700 backdrop-blur transition-colors hover:border-emerald-400 hover:text-emerald-500 dark:border-slate-700/70 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:border-emerald-400 dark:hover:text-emerald-300"
      >
        {isDark ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
      </button>
    </div>
  );
}

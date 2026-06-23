"use client";

import { EnvelopeIcon, SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { useTheme } from "@/app/providers/ThemeProvider";
import { useLanguage } from "@/app/providers/LanguageProvider";

const GitHubSVG = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"/>
  </svg>
);

const LinkedInSVG = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

export default function SocialSidebar() {
  const { theme, toggleTheme } = useTheme();
  const { lang, setLang } = useLanguage();
  const isDark = theme === "dark";

  return (
    <div className="hidden lg:flex fixed bottom-0 left-2 z-40 flex-col items-center gap-5 pb-0">
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
        className="text-slate-500 hover:text-blue-500 dark:text-slate-400 dark:hover:text-blue-300 transition-all duration-200 hover:-translate-y-0.5"
      >
        {isDark ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
      </button>
      <button
        type="button"
        onClick={() => setLang(lang === "fr" ? "en" : "fr")}
        className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-blue-500 dark:text-slate-400 dark:hover:text-blue-300 transition-all duration-200 hover:-translate-y-0.5"
      >
        {lang}
      </button>
      <a href="https://github.com/DinoGLS" target="_blank" rel="noopener noreferrer" aria-label="GitHub"
         className="text-slate-500 hover:text-blue-500 dark:text-slate-400 dark:hover:text-blue-300 transition-all duration-200 hover:-translate-y-0.5">
        <GitHubSVG />
      </a>
      <a href="https://www.linkedin.com/in/garlens-charles-29a6b3351/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
         className="text-slate-500 hover:text-blue-500 dark:text-slate-400 dark:hover:text-blue-300 transition-all duration-200 hover:-translate-y-0.5">
        <LinkedInSVG />
      </a>
      <div className="group relative flex items-center">
        <span className="pointer-events-none absolute left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-1 group-hover:translate-x-0 text-xs font-mono whitespace-nowrap text-blue-400 px-2.5 py-1 rounded border border-blue-500/30 bg-slate-900/90 dark:bg-slate-950/90 backdrop-blur-sm">
          garlenscharles10@gmail.com
        </span>
        <a href="mailto:garlenscharles10@gmail.com" aria-label="Email"
           className="text-slate-500 hover:text-blue-500 dark:text-slate-400 dark:hover:text-blue-300 transition-all duration-200 hover:-translate-y-0.5">
          <EnvelopeIcon className="w-5 h-5" />
        </a>
      </div>
      <div className="w-px h-24 bg-slate-400/40 dark:bg-slate-600/40 mt-1" />
    </div>
  );
}

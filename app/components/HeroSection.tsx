"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { useTheme } from "@/app/providers/ThemeProvider";
import { homeStrings } from "@/app/lib/i18n";

export default function HeroSection() {
  const { lang } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const h = homeStrings[lang];

  return (
    <section className="relative min-h-dvh flex flex-col items-center justify-center px-4 text-center overflow-hidden">
      {/* Backdrop animé d'entrée */}
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.15, scale: 1.5 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        style={{
          background: isDark
            ? "radial-gradient(ellipse at center, rgba(59, 130, 246, 0.15) 0%, transparent 70%)"
            : "radial-gradient(ellipse at center, rgba(29, 78, 216, 0.1) 0%, transparent 70%)",
        }}
      />

      {/* Glow subtil supplémentaire */}
      <motion.div
        className="absolute inset-0 -z-10 blur-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 2, ease: "easeOut", delay: 0.2 }}
        style={{
          background: isDark
            ? "radial-gradient(ellipse at center, rgba(168, 85, 247, 0.08) 0%, transparent 60%)"
            : "radial-gradient(ellipse at center, rgba(168, 85, 247, 0.05) 0%, transparent 60%)",
        }}
      />

      <motion.div
        className="flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-700 text-xs font-medium tracking-wide dark:text-blue-400 backdrop-blur-sm"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        {h.hero.available}
      </motion.div>

      <motion.h1
        className="text-[2.2rem] sm:text-[3rem] md:text-[4rem] lg:text-[4.5rem] font-extrabold bg-clip-text text-transparent mb-4"
        style={{
          backgroundImage: isDark
            ? "linear-gradient(to right, #60a5fa, #818cf8)"
            : "linear-gradient(to right, #1d4ed8, #4338ca)",
        }}
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
      >
        GARLENS&nbsp;CHARLES
      </motion.h1>

      <motion.p
        className="text-sm md:text-base tracking-[0.22em] text-slate-500 uppercase mb-8 dark:text-slate-300"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.7, ease: "easeOut" }}
      >
        {h.hero.subtitle}
      </motion.p>

      <motion.p
        className="text-sm md:text-base text-slate-600 max-w-xl mb-10 dark:text-slate-300"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.7, ease: "easeOut" }}
      >
        {h.hero.intro}
      </motion.p>

      <motion.div
        className="flex flex-wrap items-center justify-center gap-3"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 0.7, ease: "easeOut" }}
      >
        <a
          href="/documents/CV_GarlensCharles-Apprenti.pdf"
          rel="noopener noreferrer"
          target="_blank"
          className="inline-flex items-center px-8 py-3 rounded-full border border-slate-300/70 bg-white/60 text-slate-700 font-semibold hover:border-blue-400 hover:text-blue-700 transition-all backdrop-blur-sm shadow-sm dark:border-slate-600/40 dark:bg-slate-800/50 dark:text-slate-200 dark:hover:border-blue-400 dark:hover:text-blue-300"
        >
          {h.hero.cv}
        </a>
        <Link
          href="/veille-cyber"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-red-400/30 bg-red-50/60 text-red-600 font-semibold hover:border-red-400 hover:bg-red-50 transition-all backdrop-blur-sm text-sm dark:text-red-300 dark:border-red-500/30 dark:bg-red-950/20"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </span>
          {lang === "fr" ? "Veille Cyber" : "Cyber News"}
        </Link>
      </motion.div>
    </section>
  );
}

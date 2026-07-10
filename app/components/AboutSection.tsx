"use client";

import { useLanguage } from "@/app/providers/LanguageProvider";
import { homeStrings } from "@/app/lib/i18n";

export default function AboutSection() {
  const { lang } = useLanguage();
  const h = homeStrings[lang];

  return (
    <section id="about" className="px-4 pb-16 mt-6">
      <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-[1.1fr_1.4fr]">
        <div className="rounded-2xl border border-white/60 bg-white/40 dark:bg-slate-900/40 dark:border-slate-700/50 p-6 md:p-7 md:backdrop-blur-md shadow-sm">
          <h2 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
            {h.about.heading}
          </h2>
          <p className="text-sm md:text-[0.95rem] text-slate-700 dark:text-slate-300 leading-relaxed">
            {h.about.p1}
          </p>
          <p className="text-sm md:text-[0.95rem] text-slate-700 dark:text-slate-300 leading-relaxed mt-3">
            {h.about.p2}
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {h.about.skills.map((block) => (
            <div
              key={block.title}
              className="border border-white/60 bg-white/40 dark:bg-slate-900/40 dark:border-slate-700/50 rounded-xl p-4 md:backdrop-blur-md shadow-sm"
            >
              <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-[0.16em]">
                {block.title}
              </h3>
              <ul className="text-[0.85rem] text-slate-700 dark:text-slate-300 space-y-1.5">
                {block.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

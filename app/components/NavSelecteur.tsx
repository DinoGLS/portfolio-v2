"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/app/providers/LanguageProvider";

export interface SectionNav { id: string; label: string; href: string }

interface NavSelecteurProps {
  sections: SectionNav[];
  /** id de la section affichée à l'écran (suivi du défilement) */
  actifId: string;
  /** déclenche le défilement vers une section (avec compensation de la barre) */
  onAller: (href: string) => void;
  /** masquée tant qu'on est sur l'accueil */
  cachee: boolean;
}

// Barre du haut : un seul bouton compact. Les flèches font défiler les sections une par une,
// un clic sur le nom ouvre la liste complète pour choisir directement celle qu'on cherche.
export default function NavSelecteur({ sections, actifId, onAller, cachee }: NavSelecteurProps) {
  const { lang } = useLanguage();
  const fr = lang === "fr";
  const [ouvert, setOuvert] = useState(false);
  const racine = useRef<HTMLDivElement>(null);
  const liste = useRef<HTMLUListElement>(null);

  const idx = Math.max(0, sections.findIndex((s) => s.id === (actifId || "top")));
  const courante = sections[idx];
  const aller = (i: number) => {
    const s = sections[(i + sections.length) % sections.length];
    onAller(s.href);
  };

  // Fermeture : Échap ou clic en dehors
  useEffect(() => {
    if (!ouvert) return;
    const clic = (e: MouseEvent) => { if (racine.current && !racine.current.contains(e.target as Node)) setOuvert(false); };
    const touche = (e: KeyboardEvent) => { if (e.key === "Escape") setOuvert(false); };
    document.addEventListener("mousedown", clic);
    window.addEventListener("keydown", touche);
    return () => { document.removeEventListener("mousedown", clic); window.removeEventListener("keydown", touche); };
  }, [ouvert]);

  // Quand la liste s'ouvre, la section courante est amenée dans la zone visible
  useEffect(() => {
    if (!ouvert) return;
    liste.current?.querySelector<HTMLElement>("[aria-current=true]")?.scrollIntoView({ block: "center" });
  }, [ouvert]);

  // La barre se referme dès qu'elle est masquée
  useEffect(() => { if (cachee) setOuvert(false); }, [cachee]);

  const flecheCls =
    "grid h-8 w-8 place-items-center rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 dark:text-slate-300 dark:hover:text-blue-300 dark:hover:bg-blue-500/10";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 px-4 pt-4 flex justify-center pointer-events-none transition-transform duration-150 ${cachee ? "-translate-y-24" : ""}`}
      aria-label={fr ? "Navigation par section" : "Section navigation"}
      aria-hidden={cachee}
    >
      <div ref={racine} className="relative pointer-events-auto">
        <div className="flex items-center gap-1 rounded-full border backdrop-blur-md shadow-lg border-slate-200/70 bg-white/90 dark:border-blue-400/25 dark:bg-slate-950/80 px-1.5 py-1">
          <button type="button" onClick={() => aller(idx - 1)} aria-label={fr ? "Section précédente" : "Previous section"} className={flecheCls}>
            <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12.5 4.5 7 10l5.5 5.5" /></svg>
          </button>

          <button
            type="button"
            onClick={() => setOuvert((o) => !o)}
            aria-haspopup="listbox"
            aria-expanded={ouvert}
            className="flex items-center gap-2.5 rounded-full px-3 py-1.5 min-w-[11.5rem] justify-center font-mono text-sm tracking-wide text-slate-900 dark:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-blue-500/10"
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400" style={{ boxShadow: "0 0 5px var(--glow-accent)" }} aria-hidden />
            <span className="truncate">{courante?.label}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 tabular-nums">{String(idx + 1).padStart(2, "0")}/{String(sections.length).padStart(2, "0")}</span>
            <svg viewBox="0 0 20 20" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-150 ${ouvert ? "rotate-180" : ""}`} aria-hidden><path d="M5 7.5 10 12.5 15 7.5" /></svg>
          </button>

          <button type="button" onClick={() => aller(idx + 1)} aria-label={fr ? "Section suivante" : "Next section"} className={flecheCls}>
            <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M7.5 4.5 13 10l-5.5 5.5" /></svg>
          </button>
        </div>

        {ouvert && (
          <ul
            ref={liste}
            role="listbox"
            aria-label={fr ? "Choisir une section" : "Choose a section"}
            className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[min(18rem,calc(100vw-2rem))] max-h-[70vh] overflow-y-auto rounded-2xl border backdrop-blur-md shadow-xl p-1.5 border-slate-200/70 bg-white/95 dark:border-blue-400/25 dark:bg-slate-950/90"
          >
            {sections.map((s, i) => {
              const actif = i === idx;
              return (
                <li key={s.id} role="option" aria-selected={actif} aria-current={actif}>
                  <a
                    href={s.href}
                    onClick={(e) => { e.preventDefault(); onAller(s.href); setOuvert(false); }}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2 font-mono text-sm ${
                      actif
                        ? "bg-blue-500/10 border border-blue-500/30 text-blue-700 dark:text-blue-300"
                        : "border border-transparent text-slate-700 hover:bg-slate-100/70 dark:text-slate-200 dark:hover:bg-blue-500/10"
                    }`}
                  >
                    <span className="w-5 text-[10px] tabular-nums text-slate-400 dark:text-slate-500">{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex-1">{s.label}</span>
                    {actif && <span className="w-1.5 h-1.5 rounded-full bg-blue-400" style={{ boxShadow: "0 0 5px var(--glow-accent)" }} aria-hidden />}
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </nav>
  );
}

"use client";

import Image from "next/image";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { useTheme } from "@/app/providers/ThemeProvider";
import { useBlueprintTokens } from "@/app/data/blueprint-tokens";
import { FORMATIONS, CERTIFICATIONS, type Loc } from "@/app/data/formations";

// Formation et certifications. Les données sont dans app/data/formations.ts ;
// une pièce justificative apparaît dès qu'un champ `image` est renseigné.
export default function FormationSection() {
  const { lang } = useLanguage();
  const { theme } = useTheme();
  const bp = useBlueprintTokens(theme === "dark");
  const fr = lang === "fr";
  const L = (x: Loc) => (fr ? x.fr : x.en);
  const carte = { background: bp.cardBg, borderColor: bp.cardBorder } as const;

  return (
    <section id="formation" className="relative px-4 mt-16 pb-16 scroll-mt-20">
      <div className="max-w-5xl mx-auto">
        <div className="max-w-2xl mx-auto text-center mb-9">
          <p className="font-mono text-[11px] tracking-[0.2em] font-medium mb-3" style={{ color: bp.accent }}>
            {fr ? "// FORMATION & CERTIFICATIONS" : "// EDUCATION & CERTIFICATIONS"}
          </p>
          <h2 className="text-3xl md:text-[2.6rem] font-extrabold tracking-tight leading-tight" style={{ color: bp.text }}>
            {fr ? "Mon parcours de formation" : "My education"}
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Formations */}
          <div className="rounded-[6px] border p-5" style={carte}>
            <h3 className="font-mono text-xs font-semibold tracking-[0.14em] mb-4" style={{ color: bp.faint }}>
              {fr ? "FORMATION" : "EDUCATION"}
            </h3>
            <ul className="space-y-5">
              {FORMATIONS.map((f) => (
                <li key={f.id} className="flex gap-4">
                  {f.image && (
                    <a href={f.image} target="_blank" rel="noopener noreferrer" className="shrink-0 relative w-24 h-16 rounded-[4px] overflow-hidden border" style={{ borderColor: bp.chipBorder }}>
                      <Image src={f.image} alt={`${L(f.titre)} — ${f.ecole}`} fill className="object-cover" sizes="96px" />
                    </a>
                  )}
                  <div>
                    <div className="flex flex-wrap items-baseline gap-x-3">
                      <span className="font-mono text-[11px] font-semibold" style={{ color: bp.accent }}>{f.ecole}</span>
                      <span className="font-mono text-[10px]" style={{ color: bp.faint }}>
                        {L(f.periode)}{f.statut ? ` · ${L(f.statut)}` : ""}
                      </span>
                    </div>
                    <p className="text-[0.95rem] font-semibold leading-snug mt-0.5" style={{ color: bp.text }}>{L(f.titre)}</p>
                    {f.note && <p className="text-[0.82rem] mt-1 leading-relaxed" style={{ color: bp.sub }}>{L(f.note)}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Certifications */}
          <div className="rounded-[6px] border p-5" style={carte}>
            <h3 className="font-mono text-xs font-semibold tracking-[0.14em] mb-4" style={{ color: bp.faint }}>
              CERTIFICATIONS
            </h3>
            <ul className="space-y-5">
              {CERTIFICATIONS.map((c) => (
                <li key={c.id} className="flex gap-4">
                  <div className="shrink-0 w-24">
                    {c.image ? (
                      <a href={c.image} target="_blank" rel="noopener noreferrer" className="block relative w-24 h-16 rounded-[4px] overflow-hidden border" style={{ borderColor: bp.chipBorder }}>
                        <Image src={c.image} alt={`${L(c.titre)} — ${c.organisme}`} fill className="object-cover object-top" sizes="96px" />
                      </a>
                    ) : (
                      <div className="w-24 h-16 rounded-[4px] border flex items-center justify-center font-mono text-sm font-bold" style={{ borderColor: bp.chipBorder, background: bp.chipBg, color: bp.accent }} aria-hidden>
                        {c.organisme}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-baseline gap-x-3">
                      <span className="font-mono text-[11px] font-semibold" style={{ color: bp.accent }}>{c.organisme}</span>
                      <span className="font-mono text-[10px]" style={{ color: bp.faint }}>{L(c.date)}</span>
                    </div>
                    <p className="text-[0.95rem] font-semibold leading-snug mt-0.5" style={{ color: bp.text }}>{L(c.titre)}</p>
                    <p className="text-[0.82rem] mt-1 leading-relaxed" style={{ color: bp.sub }}>{L(c.appris)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { useTheme } from "@/app/providers/ThemeProvider";
import { useBlueprintTokens } from "@/app/data/blueprint-tokens";
import { CERTIFICATIONS, type Certification, type Loc } from "@/app/data/certifications";

// Certifications : une grille de petites « unités de baie » (même esprit que la carte réseau de l'accueil).
// Une carte = un voyant, un numéro de port, la miniature de l'attestation, un titre court. Un clic ouvre le détail.
// Les données sont dans app/data/certifications.ts : ajouter une entrée suffit, la grille s'adapte toute seule.
const CARTE = "border border-white/60 bg-white/40 dark:bg-slate-900/40 dark:border-slate-700/50 md:backdrop-blur-md shadow-sm";

export default function CertificationsSection() {
  const { lang } = useLanguage();
  const { theme } = useTheme();
  const bp = useBlueprintTokens(theme === "dark");
  const fr = lang === "fr";
  const L = (x: Loc) => (fr ? x.fr : x.en);
  const [ouvert, setOuvert] = useState<Certification | null>(null);
  const fermer = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!ouvert) return;
    fermer.current?.focus();
    const surTouche = (e: KeyboardEvent) => { if (e.key === "Escape") setOuvert(null); };
    window.addEventListener("keydown", surTouche);
    return () => window.removeEventListener("keydown", surTouche);
  }, [ouvert]);

  const vis = (cls: string) => (
    <span
      aria-hidden
      className={`absolute top-1/2 -translate-y-1/2 w-[7px] h-[7px] rounded-full ${cls}`}
      style={{ background: "radial-gradient(circle at 35% 30%, #b6c1d6, #6b7794 60%, #3a4666)", boxShadow: "0 0 0 1px rgba(10,17,36,.45)" }}
    />
  );

  return (
    <section id="certifications" className="lisible relative px-4 mt-16 pb-16 scroll-mt-20">
      <div className="max-w-5xl mx-auto">
        <div className="max-w-2xl mx-auto text-center mb-8">
          <p className="font-mono text-[11px] tracking-[0.2em] font-medium mb-3" style={{ color: bp.accent }}>
            // CERTIFICATIONS
          </p>
          <h2 className="text-3xl md:text-[2.6rem] font-extrabold tracking-tight leading-tight" style={{ color: bp.text }}>
            {fr ? "Mes certifications" : "My certifications"}
          </h2>
        </div>

        <ul className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {CERTIFICATIONS.map((c, i) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => setOuvert(c)}
                aria-haspopup="dialog"
                className={`group relative w-full text-left rounded-[6px] overflow-hidden transition-colors hover:border-[color:var(--sq-acc)] focus-visible:outline-2 focus-visible:outline-offset-2 ${CARTE}`}
                style={{ ["--sq-acc" as string]: bp.accent, outlineColor: bp.accent }}
              >
                {/* oreilles de fixation, comme une unité de baie */}
                {vis("left-[7px]")}
                {vis("right-[7px]")}
                <div className="px-6 pt-3 pb-4">
                  <div className="flex items-center gap-1.5 font-mono text-[10px]" style={{ color: bp.faint }}>
                    <i className="inline-block w-[6px] h-[6px] rounded-full bg-green-500" style={{ boxShadow: "0 0 5px rgba(34,197,94,.6)" }} aria-hidden />
                    {`CERT ${String(i + 1).padStart(2, "0")}`}
                  </div>

                  <div
                    className="relative w-full mt-2.5 rounded-[3px] overflow-hidden border bg-white"
                    style={{ borderColor: bp.chipBorder, aspectRatio: "1116 / 791" }}
                  >
                    {c.image ? (
                      <Image src={c.image} alt={`${fr ? "Attestation" : "Certificate"} : ${L(c.titre)} — ${c.organisme}`} fill className="object-contain transition-transform duration-300 group-hover:scale-[1.03]" sizes="(max-width: 640px) 90vw, 300px" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center font-mono text-lg font-bold" style={{ color: bp.accent }} aria-hidden>{c.organisme}</div>
                    )}
                  </div>

                  <p className="mt-2.5 text-[0.9rem] font-semibold leading-snug" style={{ color: bp.text }}>{L(c.court)}</p>
                  <p className="mt-0.5 font-mono text-[11px]" style={{ color: bp.accent }}>
                    {c.organisme}
                    <span className="ml-2" style={{ color: bp.faint }}>{fr ? "voir le détail ▸" : "view details ▸"}</span>
                  </p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Détail d'une certification */}
      {ouvert && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={L(ouvert.titre)}
          className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-950/70"
          onClick={() => setOuvert(null)}
        >
          <div
            className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-[8px] border p-5 md:p-6"
            style={{ background: theme === "dark" ? "#0b1430" : "#fafbfd", borderColor: bp.cardBorder, color: bp.text }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              ref={fermer}
              type="button"
              onClick={() => setOuvert(null)}
              aria-label={fr ? "Fermer" : "Close"}
              className="absolute top-3 right-3 w-8 h-8 rounded-full border flex items-center justify-center text-sm"
              style={{ borderColor: bp.chipBorder, color: bp.sub }}
            >
              ✕
            </button>
            <p className="font-mono text-[11px] font-semibold" style={{ color: bp.accent }}>
              {ouvert.organisme}
              <span className="ml-3" style={{ color: bp.faint }}>{L(ouvert.date)}</span>
            </p>
            <h3 className="mt-1 pr-10 text-lg md:text-xl font-bold leading-snug">{L(ouvert.titre)}</h3>
            {ouvert.image && (
              <div className="relative w-full mt-4 rounded-[4px] overflow-hidden border bg-white" style={{ borderColor: bp.chipBorder, aspectRatio: "1116 / 791" }}>
                <Image src={ouvert.image} alt={`${fr ? "Attestation" : "Certificate"} : ${L(ouvert.titre)}`} fill className="object-contain" sizes="(max-width: 768px) 92vw, 760px" />
              </div>
            )}
            <p className="mt-4 text-[0.9rem] leading-relaxed" style={{ color: bp.sub }}>{L(ouvert.appris)}</p>
          </div>
        </div>
      )}
    </section>
  );
}

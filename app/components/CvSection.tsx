"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { useTheme } from "@/app/providers/ThemeProvider";
import { useBlueprintTokens } from "@/app/data/blueprint-tokens";

// Mon CV : une carte encadrée comme celles des certifications (unité de baie), avec l'aperçu de la page,
// un bouton pour l'agrandir et un bouton de téléchargement. Pour le mettre à jour : remplacer
// public/documents/CV_Garlens_Charles.pdf et public/formation/apercu-cv.jpg (aperçu de la page 1, ~1100 px de large).
const PDF = "/documents/CV_Garlens_Charles.pdf";
const APERCU = "/formation/apercu-cv.jpg";
const CARTE = "border border-white/60 bg-white/40 dark:bg-slate-900/40 dark:border-slate-700/50 md:backdrop-blur-md shadow-sm";

export default function CvSection() {
  const { lang } = useLanguage();
  const { theme } = useTheme();
  const bp = useBlueprintTokens(theme === "dark");
  const fr = lang === "fr";
  const [ouvert, setOuvert] = useState(false);
  const fermer = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!ouvert) return;
    fermer.current?.focus();
    const surTouche = (e: KeyboardEvent) => { if (e.key === "Escape") setOuvert(false); };
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
    <section id="cv" className="lisible relative px-4 mt-16 pb-6 scroll-mt-20">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <p className="font-mono text-[11px] tracking-[0.2em] font-medium mb-3" style={{ color: bp.accent }}>// CV</p>
          <h2 className="text-3xl md:text-[2.6rem] font-extrabold tracking-tight leading-tight" style={{ color: bp.text }}>
            {fr ? "Mon CV" : "My résumé"}
          </h2>
        </div>

        <div className={`relative rounded-[6px] overflow-hidden ${CARTE}`}>
          {vis("left-[7px]")}
          {vis("right-[7px]")}
          <div className="px-8 py-6 grid gap-6 sm:grid-cols-[210px_1fr] items-center">
            <button
              type="button"
              onClick={() => setOuvert(true)}
              aria-haspopup="dialog"
              title={fr ? "Voir le CV en grand" : "View the résumé full size"}
              className="group relative w-full max-w-[230px] mx-auto rounded-[3px] overflow-hidden border bg-white shadow-sm hover:opacity-90 transition-opacity"
              style={{ borderColor: bp.chipBorder, aspectRatio: "1100 / 1556" }}
            >
              <Image src={APERCU} alt={fr ? "Aperçu de mon CV (page 1)" : "Preview of my résumé (page 1)"} fill className="object-contain transition-transform duration-300 group-hover:scale-[1.03]" sizes="230px" />
            </button>

            <div>
              <p className="font-mono text-[11px] font-semibold" style={{ color: bp.accent }}>CV · PDF</p>
              <h3 className="mt-1 text-xl font-bold leading-snug" style={{ color: bp.text }}>
                {fr ? "Charles Garlens, alternant ingénieur DevSecOps" : "Charles Garlens, DevSecOps engineering apprentice"}
              </h3>
              <p className="mt-2 text-[0.9rem] leading-relaxed" style={{ color: bp.sub }}>
                {fr
                  ? "BTS SIO option SISR. Je recherche une alternance de 3 ans à partir de septembre 2027. Mon CV d'une page : projets de homelab, labs réseau, formation et certifications."
                  : "BTS in IT services, systems and networks option. I am looking for a 3-year apprenticeship starting September 2027. My one-page résumé: homelab projects, network labs, education and certifications."}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setOuvert(true)}
                  className="inline-flex items-center px-5 py-2 rounded-full border text-sm font-semibold transition-colors hover:opacity-80"
                  style={{ borderColor: bp.accent, color: bp.accent }}
                >
                  {fr ? "Voir en grand" : "View full size"}
                </button>
                <a
                  href={PDF}
                  download
                  className="inline-flex items-center px-5 py-2 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ background: bp.accent }}
                >
                  {fr ? "Télécharger le PDF" : "Download the PDF"}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {ouvert && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={fr ? "Mon CV" : "My résumé"}
          className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-950/70"
          onClick={() => setOuvert(false)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-[8px] border p-4 md:p-5"
            style={{ background: theme === "dark" ? "#0b1430" : "#fafbfd", borderColor: bp.cardBorder, color: bp.text }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              ref={fermer}
              type="button"
              onClick={() => setOuvert(false)}
              aria-label={fr ? "Fermer" : "Close"}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full border flex items-center justify-center text-sm bg-white/80"
              style={{ borderColor: bp.chipBorder, color: bp.sub }}
            >
              ✕
            </button>
            <div className="relative w-full rounded-[4px] overflow-hidden border bg-white" style={{ borderColor: bp.chipBorder, aspectRatio: "1100 / 1556" }}>
              <Image src={APERCU} alt={fr ? "Mon CV (page 1)" : "My résumé (page 1)"} fill className="object-contain" sizes="(max-width: 768px) 92vw, 640px" />
            </div>
            <div className="mt-3 flex justify-end">
              <a href={PDF} download className="inline-flex items-center px-5 py-2 rounded-full text-sm font-semibold text-white" style={{ background: bp.accent }}>
                {fr ? "Télécharger le PDF" : "Download the PDF"}
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

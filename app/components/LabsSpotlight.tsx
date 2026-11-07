"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { useTheme } from "@/app/providers/ThemeProvider";
import { ALL_PROJECTS, BADGE_STYLES } from "@/app/data/projects";
import { useBlueprintTokens } from "@/app/data/blueprint-tokens";

// Bloc « Mes laboratoires » : les projets marqués `featured` (homelab, lab de l'école, lab AD), avec leur schéma,
// l'état réel, les points clés et les livrables disponibles.
export default function LabsSpotlight() {
  const { lang } = useLanguage();
  const { theme } = useTheme();
  const bp = useBlueprintTokens(theme === "dark");
  const fr = lang === "fr";
  const labs = ALL_PROJECTS.filter((p) => p.featured && p.lab);

  return (
    <section id="labs" className="lisible relative mt-16 pt-20 md:pt-24 px-4 scroll-mt-20">
      <div className="relative max-w-6xl mx-auto">
        <div className="max-w-2xl mx-auto text-center mb-9">
          <p className="font-mono text-[11px] tracking-[0.2em] font-medium mb-3" style={{ color: bp.accent }}>
            {fr ? "// LABORATOIRES — 03" : "// LABS — 03"}
          </p>
          <h2 className="text-3xl md:text-[2.6rem] font-extrabold tracking-tight leading-tight" style={{ color: bp.text }}>
            {fr ? "Mes labs Proxmox" : "My Proxmox labs"}
          </h2>
          <p className="mt-3 text-sm md:text-base" style={{ color: bp.sub }}>
            {fr
              ? "Trois environnements, trois états : mon homelab qui tourne en production, le projet de l'école en construction, et un lab Active Directory que je recrée."
              : "Three environments, three states: my homelab running in production, the school project under construction, and an Active Directory lab I am rebuilding."}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {labs.map((p) => {
            const lab = p.lab!;
            return (
              <article
                key={p.slug}
                className="flex flex-col overflow-hidden rounded-[6px] border"
                style={{ background: bp.cardBg, borderColor: bp.cardBorder }}
              >
                <Link href={p.href} className="block relative w-full aspect-[5/3] bg-slate-100 dark:bg-slate-900/60 border-b" style={{ borderColor: bp.cardBorder }}>
                  <Image src={lab.schema} alt={fr ? `Schéma : ${p.title}` : `Diagram: ${p.titleEn}`} fill className="object-contain p-1" sizes="(max-width: 768px) 100vw, 33vw" unoptimized />
                </Link>
                <div className="flex flex-col gap-3 p-5 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-bold leading-snug" style={{ color: bp.text }}>
                      {fr ? p.title : p.titleEn}
                    </h3>
                    <span className={`shrink-0 font-mono text-[10px] px-2 py-0.5 rounded-full border ${BADGE_STYLES[p.badgeColor]}`}>
                      {fr ? p.badge : p.badgeEn}
                    </span>
                  </div>
                  <ul className="space-y-1.5 text-[0.85rem] leading-relaxed" style={{ color: bp.sub }}>
                    {lab.points.map((pt, i) => (
                      <li key={i} className="flex gap-2">
                        <span aria-hidden style={{ color: bp.accent }}>▸</span>
                        <span>{fr ? pt.fr : pt.en}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-2 flex flex-wrap items-center gap-2">
                    <Link href={p.href} className="font-mono text-xs font-semibold px-3 py-1.5 rounded-[4px] border" style={{ color: bp.accent, borderColor: bp.cardBorder }}>
                      {fr ? "Voir le projet →" : "View project →"}
                    </Link>
                    {lab.livrables.map((l, i) => (
                      <a
                        key={i}
                        href={encodeURI(l.href)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-[11px] px-2.5 py-1.5 rounded-[4px] border"
                        style={{ color: bp.sub, borderColor: bp.chipBorder, background: bp.chipBg }}
                      >
                        PDF · {fr ? l.label.fr : l.label.en}
                      </a>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

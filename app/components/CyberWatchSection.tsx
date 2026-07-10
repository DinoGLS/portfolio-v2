"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { useTheme } from "@/app/providers/ThemeProvider";
import { useBlueprintTokens } from "@/app/data/blueprint-tokens";

interface CyberItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  sourceColor: string;
  tag: string;
}

function timeAgo(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 3600) return `${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} h`;
  return `${Math.floor(diff / 86400)} j`;
}

interface CyberWatchSectionProps {
  isMobile: boolean;
}

export default function CyberWatchSection({ isMobile }: CyberWatchSectionProps) {
  const { lang } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const bp = useBlueprintTokens(isDark);
  const [cyberItems, setCyberItems] = useState<CyberItem[]>([]);
  const [cyberLoading, setCyberLoading] = useState(true);

  const fetchCyber = useCallback(async () => {
    try {
      const res = await fetch("/api/cyber-watch");
      if (!res.ok) return;
      const data = await res.json();
      setCyberItems((data.items as CyberItem[]).slice(0, 6));
    } catch {
      /* silencieux */
    } finally {
      setCyberLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCyber();
  }, [fetchCyber]);

  return (
    <section id="veille" className="relative px-4 pb-24 mt-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div>
            <p
              className="font-mono text-[11px] tracking-[0.2em] font-medium mb-2"
              style={{ color: bp.accent }}
            >
              {lang === "fr" ? "// VEILLE — 05" : "// NEWS — 05"}
            </p>
            <h2
              className="text-2xl md:text-3xl font-bold tracking-tight inline-block bg-clip-text text-transparent"
              style={{ backgroundImage: bp.titleGrad }}
            >
              {lang === "fr" ? "Veille Cyber & IT" : "Cyber & IT News"}
            </h2>
            <p className="text-sm mt-1" style={{ color: bp.sub }}>
              {lang === "fr"
                ? "CERT-FR · The Hacker News · BleepingComputer — mis à jour toutes les 30 min"
                : "CERT-FR · The Hacker News · BleepingComputer — updated every 30 min"}
            </p>
          </div>
          <Link
            href="/veille-cyber"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-[4px] border font-mono text-sm text-red-500 border-red-400/40 bg-red-500/10 hover:bg-red-500/15 transition-all dark:text-red-300 backdrop-blur-sm"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-[2px] bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-[2px] h-1.5 w-1.5 bg-red-500" />
            </span>
            {lang === "fr" ? "Voir tout" : "See all"}
          </Link>
        </div>

        {cyberLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="rounded-[5px] border p-4 animate-pulse backdrop-blur-[8px]"
                  style={{ background: bp.cardBg, borderColor: bp.cardBorder }}
                >
                  <div className="h-3 rounded-[3px] w-16 mb-3" style={{ background: bp.chipBg }} />
                  <div className="h-4 rounded-[3px] w-full mb-1" style={{ background: bp.chipBg }} />
                  <div className="h-4 rounded-[3px] w-3/4" style={{ background: bp.chipBg }} />
                </div>
              ))}
          </div>
        ) : cyberItems.length === 0 ? (
          <div
            className="text-center py-10 text-sm border rounded-[5px] backdrop-blur-sm"
            style={{ background: bp.cardBg, borderColor: bp.cardBorder, color: bp.sub }}
          >
            {lang === "fr" ? "Actualités indisponibles." : "News unavailable."}{" "}
            <Link href="/veille-cyber" className="hover:underline" style={{ color: bp.accent }}>
              Rafraîchir
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cyberItems.map((item, i) => (
              <motion.a
                key={`${item.link}-${i}`}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-[5px] border p-4 transition-all group backdrop-blur-[8px] hover:-translate-y-0.5 hover:shadow-md border-[color:var(--bp-border)] hover:border-[color:var(--bp-accent)]"
                style={
                  {
                    background: bp.cardBg,
                    "--bp-border": bp.cardBorder,
                    "--bp-accent": bp.accent,
                    "--bp-text": bp.text,
                  } as React.CSSProperties
                }
                initial={{ opacity: 0, y: 16 }}
                animate={isMobile ? { opacity: 1, y: 0 } : undefined}
                whileInView={isMobile ? undefined : { opacity: 1, y: 0 }}
                viewport={isMobile ? undefined : { once: true, amount: 0.25 }}
                transition={{ duration: isMobile ? 0 : 0.4, delay: isMobile ? 0 : i * 0.07 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="px-2 py-0.5 font-mono text-xs font-medium rounded-[4px] border"
                    style={{
                      color: item.sourceColor,
                      borderColor: item.sourceColor + "40",
                      background: item.sourceColor + "15",
                    }}
                  >
                    {item.tag}
                  </span>
                  {item.pubDate && (
                    <span className="font-mono text-xs ml-auto" style={{ color: bp.faint }}>
                      {timeAgo(item.pubDate)}
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-semibold transition-colors leading-snug line-clamp-2 text-[color:var(--bp-text)] group-hover:text-[color:var(--bp-accent)]">
                  {item.title}
                </h3>
              </motion.a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

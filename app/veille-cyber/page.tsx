"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "@/app/providers/ThemeProvider";
import { BP_DARK, BP_LIGHT } from "@/app/data/blueprint-tokens";

interface FeedItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  sourceColor: string;
  tag: string;
  description: string;
}

const SOURCE_FILTERS = ["Tous", "CERT-FR", "The Hacker News", "BleepingComputer"];

function timeAgo(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)} h`;
  return `Il y a ${Math.floor(diff / 86400)} j`;
}

export default function VeilleCyberPage() {
  const { theme } = useTheme();
  const dark = theme !== "light";
  const bp = dark ? BP_DARK : BP_LIGHT;
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("Tous");
  const [fetchedAt, setFetchedAt] = useState<string>("");

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/cyber-watch");
      if (!res.ok) throw new Error("Erreur de chargement");
      const data = await res.json();
      setItems(data.items);
      setFetchedAt(data.fetchedAt);
    } catch {
      setError("Impossible de charger les actualités. Vérifiez votre connexion.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchNews]);

  const filtered = filter === "Tous" ? items : items.filter((i) => i.source === filter);

  return (
    <main
      className="min-h-screen px-4 py-16 text-slate-800 dark:text-slate-200 transition-colors duration-300"
      style={{ background: bp.pageBg }}
    >
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Link href="/" className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          ← Retour au portfolio
        </Link>
      </motion.div>

      <div className="max-w-4xl mx-auto">
        <motion.header className="mt-8 mb-10" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="relative flex h-2 w-2 mr-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            <span className="px-3 py-1 text-xs rounded-full bg-red-500/20 text-red-300 border border-red-500/30 font-medium">Live — mis à jour toutes les 30 min</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-3">Veille Cyber & IT</h1>
          <p className="text-slate-400 max-w-2xl leading-relaxed text-sm">
            Agrégation en temps réel des dernières actualités cybersécurité depuis CERT-FR,
            The Hacker News et BleepingComputer. Sources suivies quotidiennement dans le cadre du BTS SIO SISR.
          </p>
          {fetchedAt && (
            <p className="text-xs text-slate-600 mt-2">
              Dernière mise à jour : {new Date(fetchedAt).toLocaleString("fr-FR")}
            </p>
          )}
        </motion.header>

        {/* Filtres sources */}
        <div className="flex flex-wrap gap-2 mb-8">
          {SOURCE_FILTERS.map((src) => (
            <button
              key={src}
              onClick={() => setFilter(src)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                filter === src
                  ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                  : "text-slate-400 border-slate-200/80 dark:border-slate-700/60 hover:text-slate-800 dark:text-slate-200 hover:border-slate-500"
              }`}
            >
              {src}
              {src !== "Tous" && (
                <span className="ml-2 text-xs opacity-60">
                  {items.filter((i) => i.source === src).length}
                </span>
              )}
            </button>
          ))}
          <button
            onClick={fetchNews}
            className="ml-auto px-4 py-1.5 rounded-full text-sm font-medium border border-slate-200/80 dark:border-slate-700/60 text-slate-400 hover:text-slate-800 dark:text-slate-200 hover:border-slate-500 transition-all flex items-center gap-2"
          >
            ↻ Actualiser
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="space-y-4">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="rounded-xl border border-slate-200/80 dark:border-slate-700/60 bg-slate-800/40 p-5 animate-pulse">
                <div className="h-3 bg-slate-700 rounded w-20 mb-3" />
                <div className="h-4 bg-slate-700 rounded w-3/4 mb-2" />
                <div className="h-3 bg-slate-700 rounded w-full" />
                <div className="h-3 bg-slate-700 rounded w-2/3 mt-1" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-center">
            <p className="text-red-300 text-sm">{error}</p>
            <button onClick={fetchNews} className="mt-3 text-xs text-slate-400 hover:text-slate-800 dark:text-slate-200 underline">
              Réessayer
            </button>
          </div>
        )}

        {/* Articles */}
        {!loading && !error && (
          <div className="space-y-4">
            {filtered.length === 0 && (
              <p className="text-center text-slate-500 py-12">Aucun article disponible pour cette source.</p>
            )}
            {filtered.map((item, i) => (
              <motion.a
                key={`${item.link}-${i}`}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl border border-slate-200/80 dark:border-slate-700/60 bg-slate-800/40 p-5 hover:border-slate-500 hover:bg-slate-100/70 dark:bg-slate-800/60 transition-all group"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.5) }}
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className="px-2 py-0.5 text-xs font-medium rounded-full border"
                      style={{ color: item.sourceColor, borderColor: item.sourceColor + "40", background: item.sourceColor + "15" }}
                    >
                      {item.tag}
                    </span>
                    {item.pubDate && (
                      <span className="text-xs text-slate-500">{timeAgo(item.pubDate)}</span>
                    )}
                  </div>
                  <span className="text-slate-600 group-hover:text-slate-400 transition-colors text-sm flex-shrink-0">↗</span>
                </div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-300 transition-colors leading-snug mb-2">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                )}
              </motion.a>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-xs text-slate-600">
            Sources : <a href="https://www.cert.ssi.gouv.fr" target="_blank" rel="noopener noreferrer" className="hover:text-slate-400">CERT-FR</a>
            {" · "}
            <a href="https://thehackernews.com" target="_blank" rel="noopener noreferrer" className="hover:text-slate-400">The Hacker News</a>
            {" · "}
            <a href="https://www.bleepingcomputer.com" target="_blank" rel="noopener noreferrer" className="hover:text-slate-400">BleepingComputer</a>
          </p>
          <Link href="/" className="text-xs text-slate-500 hover:text-blue-400 transition-colors mt-2 inline-block">
            ← Portfolio de Garlens Charles
          </Link>
        </div>
      </div>
    </main>
  );
}

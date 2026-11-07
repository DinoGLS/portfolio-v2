"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { useTheme } from "@/app/providers/ThemeProvider";
import { useBlueprintTokens } from "@/app/data/blueprint-tokens";
import data from "@/app/data/apprentissage.json";

// Section « Apprentissage » : ce que j'apprends, pourquoi, comment, où j'en suis et ce qui vient après.
// Les chiffres (heures, séances, notions) viennent de app/data/apprentissage.json, généré par
// scripts/build-apprentissage.mjs à partir du suivi tenu par mon professeur d'apprentissage.
// Le plan (phases et projets) est écrit ici ; son statut se déduit de la date du jour.

type Etat = "acquis" | "fragile" | "non-acquis";
interface Loc { fr: string; en: string }

const PHASES: { id: string; debut: string; fin: string; titre: Loc; contenu: Loc }[] = [
  { id: "1", debut: "2026-09-20", fin: "2026-10-24", titre: { fr: "Bases de Python", en: "Python basics" }, contenu: { fr: "variables, conditions, boucles, listes, dictionnaires, fonctions, fichiers, JSON", en: "variables, conditions, loops, lists, dictionaries, functions, files, JSON" } },
  { id: "2", debut: "2026-11-23", fin: "2026-12-19", titre: { fr: "Structures et rigueur", en: "Structure and rigor" }, contenu: { fr: "classes, tests avec pytest, modules, SQL, git propre", en: "classes, pytest tests, modules, SQL, clean git" } },
  { id: "3", debut: "2027-01-04", fin: "2027-03-31", titre: { fr: "Python pour la sécurité et l'IA", en: "Python for security and AI" }, contenu: { fr: "décorateurs, API sécurisées, Docker, pandas, bases de scikit-learn, validation des entrées", en: "decorators, secured APIs, Docker, pandas, scikit-learn basics, input validation" } },
  { id: "4", debut: "2027-04-01", fin: "2027-08-31", titre: { fr: "C, maths, Python d'entretien", en: "C, maths, interview Python" }, contenu: { fr: "pointeurs, mémoire, buffer overflows, maths pour l'ingénierie", en: "pointers, memory, buffer overflows, engineering maths" } },
];

const PROJETS: { id: string; periode: Loc; titre: Loc; prouve: Loc }[] = [
  { id: "P1", periode: { fr: "sept-oct", en: "Sep-Oct" }, titre: { fr: "Dépôt public « un défi par jour »", en: "Public repo, one challenge a day" }, prouve: { fr: "la régularité", en: "consistency" } },
  { id: "P2", periode: { fr: "novembre", en: "November" }, titre: { fr: "Lecteur de logs en ligne de commande, sur les vrais logs de mon homelab", en: "Command-line log parser on my homelab's real logs" }, prouve: { fr: "lire des données réelles, tester", en: "reading real data, testing" } },
  { id: "P3", periode: { fr: "décembre", en: "December" }, titre: { fr: "API Flask : base d'indicateurs de menace avec vérification de réputation", en: "Flask API: threat indicator database with reputation checks" }, prouve: { fr: "un backend propre", en: "a clean backend" } },
  { id: "P4", periode: { fr: "janv-févr", en: "Jan-Feb" }, titre: { fr: "Détection d'anomalies sur les logs du homelab, alimentée par un SIEM", en: "Anomaly detection on homelab logs, fed by a SIEM" }, prouve: { fr: "l'IA au service de la défense", en: "AI serving defence" } },
  { id: "P8", periode: { fr: "janv-févr", en: "Jan-Feb" }, titre: { fr: "Auto-audit ISO 27001 de mon lab Draken", en: "ISO 27001 self-audit of my Draken lab" }, prouve: { fr: "la conformité (GRC)", en: "compliance (GRC)" } },
  { id: "P5", periode: { fr: "mars", en: "March" }, titre: { fr: "Banc de test d'injection de prompt sur une appli LLM à moi", en: "Prompt-injection test bench on an LLM app of mine" }, prouve: { fr: "la sécurité des systèmes d'IA", en: "AI systems security" } },
  { id: "P6", periode: { fr: "avr-juin", en: "Apr-Jun" }, titre: { fr: "Petits outils en C et notes sur les buffer overflows", en: "Small C tools and notes on buffer overflows" }, prouve: { fr: "le bas niveau, la mémoire", en: "low level, memory" } },
  { id: "P7", periode: { fr: "juil-août", en: "Jul-Aug" }, titre: { fr: "Démonstration post-quantique avec une bibliothèque existante", en: "Post-quantum demo with an existing library" }, prouve: { fr: "le cap quantique", en: "the quantum horizon" } },
];

const METHODE: Loc[] = [
  { fr: "Au moins une heure par jour, et toutes les heures sont comptées dans un fichier de suivi.", en: "At least an hour a day, and every hour is logged in a tracking file." },
  { fr: "J'écris le code seul avant toute correction. Une notion n'est « acquise » que si je la réussis seul, sans indice, deux jours différents.", en: "I write the code alone before any correction. A topic is only 'acquired' if I get it right alone, with no hint, on two different days." },
  { fr: "Un professeur (une session Claude sur mon ordinateur portable) me donne les exercices et corrige. Un directeur règle le plan et les priorités.", en: "A tutor (a Claude session on my laptop) gives me exercises and corrects them. A director adjusts the plan and priorities." },
  { fr: "Des tests de niveau en début et en fin de séance, en fin de mois, et une « colle » mensuelle de 30 minutes sans aucune aide.", en: "Level tests at the start and end of sessions, at month end, and a monthly 30-minute 'colle' with no help at all." },
  { fr: "Un bot Telegram me pose une question chaque soir.", en: "A Telegram bot asks me a question every evening." },
];

interface CommitsReponse { commits: { repo: string; message: string; date: string; url: string }[]; depots: { repo: string; existe: boolean }[] }

const fmtDate = (iso: string | null, lang: string) =>
  iso ? new Date(iso + (iso.length === 10 ? "T00:00:00" : "")).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", { day: "numeric", month: "long", year: "numeric" }) : "—";

export default function ApprentissageSection() {
  const { lang } = useLanguage();
  const { theme } = useTheme();
  const bp = useBlueprintTokens(theme === "dark");
  const fr = lang === "fr";
  const L = (x: Loc) => (fr ? x.fr : x.en);

  const [git, setGit] = useState<CommitsReponse | null>(null);
  useEffect(() => {
    let vivant = true;
    fetch("/api/apprentissage/git").then((r) => (r.ok ? r.json() : null)).then((j) => { if (vivant) setGit(j); }).catch(() => {});
    return () => { vivant = false; };
  }, []);

  const aujourdhui = new Date().toISOString().slice(0, 10);
  const statutPhase = (p: (typeof PHASES)[number]) => (aujourdhui > p.fin ? "fait" : aujourdhui >= p.debut ? "en-cours" : "a-venir");
  const libStatut = { fait: fr ? "terminée" : "done", "en-cours": fr ? "en cours" : "in progress", "a-venir": fr ? "à venir" : "upcoming" };

  const { compteurs, heures, notions } = data;
  const maxSem = Math.max(1, ...heures.parSemaine.map((s) => s.heures));
  const groupes: { etat: Etat; titre: string }[] = [
    { etat: "acquis", titre: fr ? "Acquis" : "Acquired" },
    { etat: "fragile", titre: fr ? "Fragile : à consolider" : "Fragile: to consolidate" },
    { etat: "non-acquis", titre: fr ? "Pas encore acquis" : "Not yet acquired" },
  ];

  const carte = { background: bp.cardBg, borderColor: bp.cardBorder } as const;

  return (
    <section id="apprentissage" className="relative px-4 mt-16 pb-16 scroll-mt-20">
      <div className="max-w-5xl mx-auto">
        <div className="max-w-2xl mx-auto text-center mb-9">
          <p className="font-mono text-[11px] tracking-[0.2em] font-medium mb-3" style={{ color: bp.accent }}>
            {fr ? "// APPRENTISSAGE" : "// LEARNING"}
          </p>
          <h2 className="text-3xl md:text-[2.6rem] font-extrabold tracking-tight leading-tight" style={{ color: bp.text }}>
            {fr ? "Ce que j'apprends" : "What I'm learning"}
          </h2>
          <p className="mt-3 text-sm md:text-base" style={{ color: bp.sub }}>
            {fr
              ? "Mon fil conducteur : défendre des systèmes avec l'IA face aux attaques automatisées, et me préparer à l'arrivée possible de l'ordinateur quantique. Pour ça il me faut du vrai code : Python d'abord, puis du C pour comprendre comment les failles mémoire fonctionnent."
              : "My common thread: defending systems with AI against automated attacks, and getting ready for the possible arrival of quantum computers. For that I need real code: Python first, then C to understand how memory flaws work."}
          </p>
          <p className="mt-2 font-mono text-xs" style={{ color: bp.faint }}>
            {fr ? "Cible : Python intermédiaire-avancé à la rentrée 2027" : "Target: intermediate-to-advanced Python by September 2027"}
          </p>
        </div>

        {/* Chiffres lus dans le suivi */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { v: `${heures.total} h`, k: fr ? "d'apprentissage comptées" : "of learning logged" },
            { v: String(heures.seances), k: fr ? "séances" : "sessions" },
            { v: `${compteurs.acquis} / ${compteurs.total}`, k: fr ? "notions acquises" : "topics acquired" },
            { v: fmtDate(heures.derniereSeance, lang), k: fr ? "dernière séance" : "last session" },
          ].map((t) => (
            <div key={t.k} className="rounded-[6px] border p-4" style={carte}>
              <div className="text-xl md:text-2xl font-extrabold leading-tight" style={{ color: bp.accent }}>{t.v}</div>
              <div className="mt-1 text-xs" style={{ color: bp.sub }}>{t.k}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-5">
          {/* Où j'en suis */}
          <div className="md:col-span-3 rounded-[6px] border p-5" style={carte}>
            <h3 className="font-mono text-xs font-semibold tracking-[0.14em] mb-4" style={{ color: bp.faint }}>
              {fr ? "OÙ J'EN SUIS" : "WHERE I AM"}
            </h3>
            <div className="space-y-4">
              {groupes.map((g) => {
                const liste = notions.filter((n) => n.etat === g.etat);
                if (liste.length === 0) return null;
                return (
                  <div key={g.etat}>
                    <p className="text-xs font-semibold mb-1.5" style={{ color: bp.sub }}>{g.titre} · {liste.length}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {liste.map((n) => (
                        <span
                          key={n.nom}
                          className="font-mono text-[11px] px-2 py-1 rounded-[4px] border"
                          style={
                            g.etat === "acquis"
                              ? { background: `${bp.accent}1f`, color: bp.text, borderColor: `${bp.accent}66` }
                              : g.etat === "fragile"
                                ? { background: bp.chipBg, color: bp.chipText, borderColor: bp.chipBorder }
                                : { color: bp.faint, borderColor: bp.chipBorder, borderStyle: "dashed" }
                          }
                        >
                          {n.nom}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Heures par semaine */}
            {heures.parSemaine.length > 0 && (
              <div className="mt-6">
                <p className="text-xs font-semibold mb-2" style={{ color: bp.sub }}>{fr ? "Heures par semaine" : "Hours per week"}</p>
                <div className="flex items-end gap-1.5 h-20" role="img" aria-label={fr ? "Heures d'apprentissage par semaine" : "Learning hours per week"}>
                  {heures.parSemaine.map((s) => (
                    <div key={s.debut} className="flex-1 flex flex-col items-center justify-end h-full">
                      <span className="font-mono text-[10px] mb-0.5" style={{ color: bp.faint }}>{s.heures}</span>
                      <div className="w-full rounded-t-[3px]" style={{ height: `${Math.max((s.heures / maxSem) * 100, 4)}%`, background: bp.accent, opacity: 0.85 }} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Comment j'apprends */}
          <div className="md:col-span-2 rounded-[6px] border p-5" style={carte}>
            <h3 className="font-mono text-xs font-semibold tracking-[0.14em] mb-4" style={{ color: bp.faint }}>
              {fr ? "COMMENT J'APPRENDS" : "HOW I LEARN"}
            </h3>
            <ul className="space-y-3 text-[0.85rem] leading-relaxed" style={{ color: bp.sub }}>
              {METHODE.map((m, i) => (
                <li key={i} className="flex gap-2">
                  <span aria-hidden style={{ color: bp.accent }}>▸</span>
                  <span>{L(m)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Ce qui vient après */}
        <div className="mt-6 rounded-[6px] border p-5" style={carte}>
          <h3 className="font-mono text-xs font-semibold tracking-[0.14em] mb-4" style={{ color: bp.faint }}>
            {fr ? "CE QUI VIENT APRÈS" : "WHAT COMES NEXT"}
          </h3>
          <div className="grid gap-4 md:grid-cols-4">
            {PHASES.map((p) => {
              const st = statutPhase(p);
              return (
                <div key={p.id} className="rounded-[5px] border p-3" style={{ borderColor: st === "en-cours" ? bp.accent : bp.chipBorder, background: bp.chipBg }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[11px] font-semibold" style={{ color: bp.accent }}>{fr ? "Phase" : "Phase"} {p.id}</span>
                    <span className="font-mono text-[10px]" style={{ color: st === "fait" ? bp.accent : bp.faint }}>
                      {st === "fait" ? "✓ " : ""}{libStatut[st]}
                    </span>
                  </div>
                  <p className="text-sm font-semibold" style={{ color: bp.text }}>{L(p.titre)}</p>
                  <p className="text-xs mt-1 leading-relaxed" style={{ color: bp.sub }}>{L(p.contenu)}</p>
                </div>
              );
            })}
          </div>

          <h4 className="font-mono text-xs font-semibold tracking-[0.14em] mt-6 mb-3" style={{ color: bp.faint }}>
            {fr ? "LES PROJETS QUI LE PROUVENT" : "THE PROJECTS THAT PROVE IT"}
          </h4>
          <ul className="grid gap-2 md:grid-cols-2">
            {PROJETS.map((p) => (
              <li key={p.id} className="flex gap-3 text-[0.85rem] leading-snug">
                <span className="font-mono text-[11px] font-semibold shrink-0 w-7" style={{ color: bp.accent }}>{p.id}</span>
                <span style={{ color: bp.sub }}>
                  <span style={{ color: bp.text }}>{L(p.titre)}</span>
                  <span className="font-mono text-[10px] ml-2" style={{ color: bp.faint }}>{L(p.periode)} · {fr ? "prouve" : "proves"} {L(p.prouve)}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Activité git publique */}
        <div className="mt-6 rounded-[6px] border p-5" style={carte}>
          <h3 className="font-mono text-xs font-semibold tracking-[0.14em] mb-3" style={{ color: bp.faint }}>
            {fr ? "ACTIVITÉ PUBLIQUE SUR GITHUB" : "PUBLIC ACTIVITY ON GITHUB"}
          </h3>
          {git && git.commits.length > 0 ? (
            <ul className="space-y-1.5">
              {git.commits.map((c, i) => (
                <li key={i} className="flex flex-wrap items-baseline gap-x-3 text-[0.82rem]">
                  <span className="font-mono text-[10px]" style={{ color: bp.faint }}>{fmtDate(c.date.slice(0, 10), lang)}</span>
                  <a href={c.url} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: bp.text }}>{c.message}</a>
                  <span className="font-mono text-[10px]" style={{ color: bp.faint }}>{c.repo.split("/")[1]}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm" style={{ color: bp.sub }}>{fr ? "Activité en cours de chargement." : "Activity loading."}</p>
          )}
          {git && git.depots.some((d) => !d.existe && d.repo.endsWith("python-journey")) && (
            <p className="mt-3 text-xs" style={{ color: bp.faint }}>
              {fr ? "Le dépôt « python-journey » (un défi par jour) n'est pas encore publié : il apparaîtra ici dès son premier commit." : "The 'python-journey' repository (one challenge a day) is not published yet: it will show up here as soon as it has a first commit."}
            </p>
          )}
        </div>

        <p className="mt-5 text-center font-mono text-[11px]" style={{ color: bp.faint }}>
          {fr ? "Chiffres lus dans mon suivi de progression, mis à jour le " : "Figures read from my progress log, updated on "}
          {fmtDate(data.genere.slice(0, 10), lang)}
        </p>
      </div>
    </section>
  );
}

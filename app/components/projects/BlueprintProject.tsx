"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Page projet — thème BLUEPRINT (schéma technique cyan). Compatible :
//   • clair / sombre  (via useTheme du site)
//   • FR / EN          (champs texte = string ou { fr, en })
// Deux variantes :
//   • "datasheet" → infra système / réseau (grille technique, sommaire + cartes)
//   • "ide"       → dev logiciel (barre titre, explorateur, onglets, code)
// Pas de pop-up "infra map" (retiré volontairement).
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "@/app/providers/ThemeProvider";
import { useLanguage } from "@/app/providers/LanguageProvider";

// ── Localisation ────────────────────────────────────────────────────────────
export type Loc = string | { fr: string; en: string };
function tx(v: Loc | undefined, lang: string): string {
  if (v == null) return "";
  if (typeof v === "string") return v;
  return (lang === "en" ? v.en : v.fr) ?? v.fr;
}

// ── Tokens blueprint (clair + sombre) ───────────────────────────────────────
function buildBP(dark: boolean) {
  const mono = "var(--font-geist-mono), ui-monospace, monospace";
  const sans = "var(--font-geist-sans), system-ui, sans-serif";
  if (dark) {
    return {
      mono, sans,
      pageBg: "radial-gradient(110% 80% at 50% 0%, #11436f 0%, #0a2a49 50%, #061a30 100%)",
      text: "#e8f4ff", sub: "#a9cdef", faint: "#5d89b6", accent: "#4cc4ff", accent2: "#bfe3ff",
      cardBg: "rgba(13,42,71,0.42)", cardBorder: "rgba(120,180,235,0.34)",
      chipBg: "rgba(120,180,235,0.12)", chipText: "#cfe6fb", chipBorder: "rgba(120,180,235,0.30)",
      codeBg: "rgba(4,18,34,0.72)", codeBorder: "rgba(120,180,235,0.22)", codeText: "#cfe6fb",
      gridLine: "rgba(140,195,240,0.12)",
      titleGrad: "linear-gradient(90deg,#dbeeff,#7fd0ff)",
      imgFilter: "saturate(0.92) hue-rotate(-6deg)",
      ideBar: "#0a2a49", idePage: "#061a30", ideSide: "#081f38", ideBorder: "rgba(120,180,235,0.18)", ideCard: "rgba(120,180,235,0.04)",
      statusText: "#04121f",
    };
  }
  // Blueprint clair : plan technique sur papier bleuté
  return {
    mono, sans,
    pageBg: "radial-gradient(110% 80% at 50% 0%, #f4f9ff 0%, #e6f0fb 55%, #d8e8f7 100%)",
    text: "#0c2740", sub: "#39597a", faint: "#7ba0c4", accent: "#1f7fc4", accent2: "#2b9fe0",
    cardBg: "rgba(255,255,255,0.72)", cardBorder: "rgba(31,127,196,0.24)",
    chipBg: "rgba(31,127,196,0.08)", chipText: "#1a4a70", chipBorder: "rgba(31,127,196,0.22)",
    // code blocks restent sombres pour le contraste (comme la datasheet claire du design)
    codeBg: "#0b2138", codeBorder: "rgba(31,127,196,0.35)", codeText: "#cfe6fb",
    gridLine: "rgba(31,127,196,0.10)",
    titleGrad: "linear-gradient(90deg,#0c3a5e,#1f7fc4)",
    imgFilter: "none",
    ideBar: "#e4eef8", idePage: "#f4f9ff", ideSide: "#eaf2fb", ideBorder: "rgba(31,127,196,0.18)", ideCard: "rgba(31,127,196,0.04)",
    statusText: "#ffffff",
  };
}
type BP = ReturnType<typeof buildBP>;

// ── Types de données ────────────────────────────────────────────────────────
export interface BPStep {
  num: string;
  color?: string;
  title: Loc;
  subtitle: Loc;
  desc: Loc;
  features?: Loc[];
  code?: string;
  lang?: string;
}
export interface BPData {
  tag: Loc;
  title: Loc;
  subtitle: Loc;
  status: Loc;
  statusColor?: string;
  img?: string;
  badges: { label: string; color?: string }[];
  stats?: { k: Loc; v: Loc }[];
  toc?: Loc[];
  steps: BPStep[];
  skills?: { domain: Loc; skills: Loc }[];
  planned?: Loc[];
  breadcrumb?: string;
  files?: { name: string; icon: string; indent: number; kind?: string }[];
  tabs?: string[];
  statusBar?: Loc[];
}

const STATUS_COLORS: Record<string, string> = {
  Terminé: "#22c55e", Done: "#22c55e",
  "En cours": "#1f7fc4", "In progress": "#1f7fc4",
  "À venir": "#7ba0c4", "Upcoming": "#7ba0c4",
  "En production": "#8b5cf6", Live: "#8b5cf6",
};

function StatusChip({ label, color, bp }: { label: string; color?: string; bp: BP }) {
  const c = color || STATUS_COLORS[label] || bp.accent;
  return (
    <span style={{ fontFamily: bp.mono, fontSize: 11, padding: "4px 10px", borderRadius: 4, background: c + "1f", color: c, border: `1px solid ${c}55` }}>
      ● {label}
    </span>
  );
}

function CodeBlock({ code, lang, bp, terminalDots = false }: { code: string; lang?: string; bp: BP; terminalDots?: boolean }) {
  return (
    <div style={{ background: bp.codeBg, border: `1px solid ${bp.codeBorder}`, borderRadius: 4, overflow: "hidden" }}>
      {(terminalDots || lang) && (
        <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "8px 13px", borderBottom: `1px solid ${bp.codeBorder}` }}>
          {terminalDots && (<>
            <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#ff5f56" }} />
            <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#ffbd2e" }} />
            <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#27c93f" }} />
          </>)}
          {lang && <span style={{ fontFamily: bp.mono, fontSize: 11, color: "#7fa8cc", marginLeft: terminalDots ? 5 : 0 }}>{lang}</span>}
        </div>
      )}
      <pre style={{ margin: 0, padding: "14px 16px", fontFamily: bp.mono, fontSize: 12, lineHeight: 1.7, color: bp.codeText, overflowX: "auto", whiteSpace: "pre" }}>{code}</pre>
    </div>
  );
}

// ── DATASHEET (infra système / réseau) ──────────────────────────────────────
function Datasheet({ data, bp, lang }: { data: BPData; bp: BP; lang: string }) {
  return (
    <div style={{ position: "relative", padding: "38px 20px 60px", minHeight: "100vh", background: bp.pageBg, color: bp.text, fontFamily: bp.sans }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${bp.gridLine} 1px, transparent 1px), linear-gradient(90deg, ${bp.gridLine} 1px, transparent 1px)`, backgroundSize: "30px 30px", pointerEvents: "none", WebkitMaskImage: "linear-gradient(to bottom, black, transparent 60%)", maskImage: "linear-gradient(to bottom, black, transparent 60%)" }} />
      <div style={{ position: "relative", maxWidth: 1000, margin: "0 auto" }}>
        <Link href="/#projects" style={{ fontFamily: bp.mono, fontSize: 13, color: bp.sub, textDecoration: "none" }}>{lang === "en" ? "← back to projects" : "← retour aux projets"}</Link>

        <div style={{ marginTop: 26, display: "grid", gridTemplateColumns: "1fr", gap: 24 }} className="bp-header-grid">
          <div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14, alignItems: "center" }}>
              <StatusChip label={tx(data.status, lang)} color={data.statusColor} bp={bp} />
              <span style={{ fontFamily: bp.mono, fontSize: 12, letterSpacing: "0.2em", color: bp.accent }}>{tx(data.tag, lang)} · 2025</span>
            </div>
            <h1 style={{ fontSize: 40, fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1.05, margin: "0 0 16px", color: bp.text }}>{tx(data.title, lang)}</h1>
            <p style={{ fontSize: 15, color: bp.sub, lineHeight: 1.6, margin: 0, maxWidth: 560 }}>{tx(data.subtitle, lang)}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 22 }}>
              {data.badges.map((b) => (
                <span key={b.label} style={{ fontFamily: bp.mono, fontSize: 11.5, padding: "5px 11px", borderRadius: 4, background: bp.chipBg, border: `1px solid ${bp.chipBorder}`, color: bp.chipText }}>
                  <span style={{ color: b.color || bp.accent }}>●</span> {b.label}
                </span>
              ))}
            </div>
          </div>
          {data.stats && data.stats.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {data.stats.map((st, i) => (
                <div key={i} style={{ border: `1px solid ${bp.cardBorder}`, borderRadius: 5, padding: 16, background: bp.cardBg }}>
                  <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em", color: bp.accent }}>{tx(st.v, lang)}</div>
                  <div style={{ fontFamily: bp.mono, fontSize: 11, color: bp.faint, marginTop: 4, textTransform: "uppercase", letterSpacing: "0.1em" }}>{tx(st.k, lang)}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {data.img && (
          <div style={{ marginTop: 34, borderRadius: 5, overflow: "hidden", border: `1px solid ${bp.cardBorder}` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.img} alt="Aperçu" style={{ display: "block", width: "100%", height: 300, objectFit: "cover", objectPosition: "50% 14%", filter: bp.imgFilter }} />
          </div>
        )}

        <div style={{ marginTop: 44, display: "grid", gridTemplateColumns: "1fr", gap: 24 }} className="bp-body-grid">
          {data.toc && data.toc.length > 0 && (
            <div className="bp-toc" style={{ position: "sticky", top: 24, alignSelf: "start" }}>
              <div style={{ fontFamily: bp.mono, fontSize: 10.5, letterSpacing: "0.14em", color: bp.faint, textTransform: "uppercase", marginBottom: 14 }}>{lang === "en" ? "Contents" : "Sommaire"}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {data.toc.map((label, i) => (
                  <span key={i} style={{ fontFamily: bp.mono, fontSize: 13, padding: "7px 0 7px 14px", borderLeft: `2px solid ${i === 0 ? bp.accent : bp.cardBorder}`, color: i === 0 ? bp.accent : bp.sub }}>{tx(label, lang)}</span>
                ))}
              </div>
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {data.steps.map((s) => {
              const c = s.color || bp.accent;
              return (
                <div key={s.num} style={{ border: `1px solid ${bp.cardBorder}`, borderRadius: 5, background: bp.cardBg, overflow: "hidden" }}>
                  <div style={{ height: 3, background: c }} />
                  <div style={{ padding: "20px 22px 22px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 11 }}>
                      <span style={{ width: 34, height: 34, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: bp.mono, fontSize: 13, fontWeight: 700, background: c + "22", color: c, border: `1px solid ${c}55` }}>{s.num}</span>
                      <div>
                        <h3 style={{ fontSize: 17, fontWeight: 600, margin: 0 }}>{tx(s.title, lang)}</h3>
                        <div style={{ fontFamily: bp.mono, fontSize: 11.5, color: c, marginTop: 2 }}>{tx(s.subtitle, lang)}</div>
                      </div>
                    </div>
                    <p style={{ fontSize: 13.5, color: bp.sub, lineHeight: 1.6, margin: "0 0 13px" }}>{tx(s.desc, lang)}</p>
                    {s.features && s.features.length > 0 && (
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7, marginBottom: 14 }}>
                        {s.features.map((f, i) => (
                          <div key={i} style={{ display: "flex", gap: 8, fontSize: 12.5, color: bp.chipText }}><span style={{ color: c }}>▸</span>{tx(f, lang)}</div>
                        ))}
                      </div>
                    )}
                    {s.code && <CodeBlock code={s.code} lang={s.lang} bp={bp} />}
                  </div>
                </div>
              );
            })}

            {data.planned && data.planned.length > 0 && (
              <div style={{ border: `1px dashed ${bp.cardBorder}`, borderRadius: 5, background: bp.chipBg, padding: "18px 22px" }}>
                <div style={{ fontFamily: bp.mono, fontSize: 11, letterSpacing: "0.14em", color: bp.faint, textTransform: "uppercase", marginBottom: 10 }}>{lang === "en" ? "Upcoming" : "À venir"}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {data.planned.map((p, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: bp.sub }}><span style={{ color: bp.faint }}>○</span>{tx(p, lang)}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {data.skills && data.skills.length > 0 && (
          <div style={{ marginTop: 40 }}>
            <h2 style={{ fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase", color: bp.sub, margin: "0 0 18px" }}>{lang === "en" ? "Skills demonstrated" : "Compétences mobilisées"}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }} className="bp-skills-grid">
              {data.skills.map((sk, i) => (
                <div key={i} style={{ display: "flex", gap: 13, padding: "16px 18px", borderRadius: 5, border: `1px solid ${bp.cardBorder}`, background: bp.cardBg }}>
                  <span style={{ color: bp.accent }}>▸</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{tx(sk.domain, lang)}</div>
                    <div style={{ fontSize: 12.5, color: bp.sub, marginTop: 3, lineHeight: 1.5 }}>{tx(sk.skills, lang)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (min-width: 860px) {
          .bp-header-grid { grid-template-columns: 1fr 340px !important; gap: 40px !important; align-items: start; }
          .bp-body-grid { grid-template-columns: 200px 1fr !important; gap: 44px !important; align-items: start; }
          .bp-skills-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 859px) { .bp-toc { display: none !important; } }
      `}</style>
    </div>
  );
}

// ── IDE (dev logiciel) ──────────────────────────────────────────────────────
function IDE({ data, bp, lang }: { data: BPData; bp: BP; lang: string }) {
  const [open, setOpen] = useState<Record<number, boolean>>(() => {
    const o: Record<number, boolean> = {};
    data.steps.forEach((_, i) => (o[i] = i < 2));
    return o;
  });
  const accent = data.statusColor || bp.accent;
  return (
    <div style={{ minHeight: "100vh", background: bp.pageBg, padding: "24px 16px 48px", fontFamily: bp.sans }}>
      <div style={{ maxWidth: 1040, margin: "0 auto" }}>
        <Link href="/#projects" style={{ fontFamily: bp.mono, fontSize: 13, color: bp.sub, textDecoration: "none", display: "inline-block", marginBottom: 16 }}>{lang === "en" ? "← back to projects" : "← retour aux projets"}</Link>
        <div style={{ borderRadius: 6, overflow: "hidden", border: `1px solid ${bp.ideBorder}`, boxShadow: "0 18px 44px rgba(2,10,20,0.28)", background: bp.idePage, color: bp.text }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "11px 16px", background: bp.ideBar, borderBottom: `1px solid ${bp.ideBorder}` }}>
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f56" }} />
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#ffbd2e" }} />
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#27c93f" }} />
            <span style={{ fontFamily: bp.mono, fontSize: 12, color: bp.faint, marginLeft: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{data.breadcrumb || "garlens — portfolio"}</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr" }} className="bp-ide-grid">
            {data.files && (
              <div className="bp-ide-explorer" style={{ background: bp.ideSide, borderRight: `1px solid ${bp.ideBorder}`, padding: "14px 0" }}>
                <div style={{ fontFamily: bp.mono, fontSize: 10.5, letterSpacing: "0.14em", color: bp.faint, padding: "0 16px 10px" }}>EXPLORER</div>
                {data.files.map((f) => {
                  const active = f.kind === "active";
                  const iconColor = f.kind === "folder" ? bp.accent : (f.name.endsWith(".png") || f.name.endsWith(".jpg")) ? "#22c55e" : f.name.endsWith(".md") ? bp.faint : bp.accent2;
                  return (
                    <div key={f.name} style={{ display: "flex", alignItems: "center", gap: 9, padding: `5px 16px 5px ${16 + f.indent * 16}px`, fontFamily: bp.mono, fontSize: 13, color: active ? bp.text : bp.sub, background: active ? bp.chipBg : "transparent" }}>
                      <span style={{ color: iconColor }}>{f.icon}</span>{f.name}
                    </div>
                  );
                })}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
              {data.tabs && data.tabs.length > 0 && (
                <div style={{ display: "flex", background: bp.ideBar, borderBottom: `1px solid ${bp.ideBorder}`, overflowX: "auto" }}>
                  {data.tabs.map((tb, i) => (
                    <div key={tb} style={{ fontFamily: bp.mono, fontSize: 12.5, padding: "10px 16px", color: i === 0 ? bp.text : bp.faint, background: i === 0 ? bp.idePage : "transparent", borderRight: `1px solid ${bp.ideBorder}`, borderTop: `2px solid ${i === 0 ? accent : "transparent"}`, whiteSpace: "nowrap" }}>{tb}</div>
                  ))}
                </div>
              )}
              <div style={{ padding: "30px 28px 40px", minWidth: 0, color: bp.text }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 18 }}>
                  <StatusChip label={tx(data.status, lang)} color={data.statusColor} bp={bp} />
                  <span style={{ fontFamily: bp.mono, fontSize: 11, padding: "4px 10px", borderRadius: 4, background: bp.chipBg, color: bp.chipText, border: `1px solid ${bp.chipBorder}` }}>{tx(data.tag, lang)}</span>
                </div>
                <h1 style={{ fontFamily: bp.mono, fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em", margin: "0 0 6px", lineHeight: 1.15 }}>
                  <span style={{ color: accent }}>#</span> {tx(data.title, lang)}
                </h1>
                <p style={{ fontSize: 14.5, color: bp.sub, lineHeight: 1.6, margin: "14px 0 0", maxWidth: 660 }}>{tx(data.subtitle, lang)}</p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 18 }}>
                  {data.badges.map((b) => (
                    <span key={b.label} style={{ fontFamily: bp.mono, fontSize: 11, padding: "4px 10px", borderRadius: 4, background: bp.chipBg, border: `1px solid ${bp.chipBorder}`, color: bp.chipText }}>
                      <span style={{ color: b.color || accent }}>●</span> {b.label}
                    </span>
                  ))}
                </div>

                {data.img && (
                  <div style={{ marginTop: 24, borderRadius: 5, overflow: "hidden", border: `1px solid ${bp.ideBorder}`, maxWidth: 680 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={data.img} alt="Aperçu" style={{ display: "block", width: "100%", maxHeight: 360, objectFit: "cover", objectPosition: "50% 14%" }} />
                  </div>
                )}

                <div style={{ fontFamily: bp.mono, fontSize: 14, margin: "34px 0 14px", color: bp.text }}><span style={{ color: bp.faint }}>##</span> {lang === "en" ? "What I built" : "Ce que j'ai construit"}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {data.steps.map((s, i) => {
                    const c = s.color || accent;
                    const isOpen = open[i];
                    return (
                      <div key={s.num} style={{ border: `1px solid ${bp.ideBorder}`, borderRadius: 5, background: bp.ideCard, overflow: "hidden" }}>
                        <button onClick={() => setOpen((o) => ({ ...o, [i]: !o[i] }))} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", color: bp.text }}>
                          <span style={{ color: c, fontFamily: bp.mono, fontSize: 12 }}>{isOpen ? "▾" : "▸"}</span>
                          <span style={{ fontFamily: bp.mono, fontSize: 12, fontWeight: 600, color: c }}>{s.num}</span>
                          <span style={{ fontSize: 14.5, fontWeight: 600 }}>{tx(s.title, lang)}</span>
                          <span style={{ marginLeft: "auto", fontFamily: bp.mono, fontSize: 11.5, color: bp.faint }}>{tx(s.subtitle, lang)}</span>
                        </button>
                        {isOpen && (
                          <div style={{ padding: "0 16px 16px 40px" }}>
                            <p style={{ fontSize: 13.5, color: bp.sub, lineHeight: 1.6, margin: "0 0 12px" }}>{tx(s.desc, lang)}</p>
                            {s.code && <CodeBlock code={s.code} lang={s.lang} bp={bp} />}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {data.planned && data.planned.length > 0 && (
                  <>
                    <div style={{ fontFamily: bp.mono, fontSize: 14, margin: "30px 0 14px", color: bp.text }}><span style={{ color: bp.faint }}>##</span> {lang === "en" ? "Upcoming" : "À venir"} <span style={{ color: bp.faint, fontSize: 12 }}>{lang === "en" ? "// planned, not done yet" : "// prévu, pas encore fait"}</span></div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                      {data.planned.map((p, i) => (
                        <div key={i} style={{ display: "flex", gap: 8, fontSize: 13.5, color: bp.sub, fontFamily: bp.mono }}><span style={{ color: bp.faint }}>- [ ]</span>{tx(p, lang)}</div>
                      ))}
                    </div>
                  </>
                )}

                {data.skills && data.skills.length > 0 && (
                  <>
                    <div style={{ fontFamily: bp.mono, fontSize: 14, margin: "30px 0 14px", color: bp.text }}><span style={{ color: bp.faint }}>##</span> {lang === "en" ? "Skills" : "Compétences"}</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }} className="bp-skills-grid">
                      {data.skills.map((sk, i) => (
                        <div key={i} style={{ display: "flex", gap: 12, padding: "14px 16px", borderRadius: 5, border: `1px solid ${bp.ideBorder}`, background: bp.ideCard }}>
                          <span style={{ color: accent }}>▸</span>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 600 }}>{tx(sk.domain, lang)}</div>
                            <div style={{ fontSize: 12.5, color: bp.sub, marginTop: 3, lineHeight: 1.5 }}>{tx(sk.skills, lang)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "7px 16px", background: accent, color: bp.statusText, fontFamily: bp.mono, fontSize: 11.5, flexWrap: "wrap" }}>
            {(data.statusBar && data.statusBar.length > 0 ? data.statusBar.map((s) => tx(s, lang)) : ["⎇ main", `● ${data.steps.length} ${lang === "en" ? "steps" : "étapes"}`, "UTF-8"]).map((s, i, arr) => (
              <span key={i} style={i === arr.length - 1 ? { marginLeft: "auto" } : undefined}>{s}</span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 820px) {
          .bp-ide-grid { grid-template-columns: 236px 1fr !important; }
          .bp-skills-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 819px) { .bp-ide-explorer { display: none !important; } }
      `}</style>
    </div>
  );
}

export default function BlueprintProject({ variant, data }: { variant: "datasheet" | "ide"; data: BPData }) {
  const { theme } = useTheme();
  const { lang } = useLanguage();
  const bp = buildBP(theme !== "light");
  return variant === "ide" ? <IDE data={data} bp={bp} lang={lang} /> : <Datasheet data={data} bp={bp} lang={lang} />;
}

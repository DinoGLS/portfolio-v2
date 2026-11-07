"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { useTheme } from "@/app/providers/ThemeProvider";
import { usePalette } from "@/app/lib/palette";
import { homeStrings } from "@/app/lib/i18n";
import { CLAIR, CLAIR_NEIGE } from "@/app/components/ReseauSequence";

interface ParcoursProps {
  isMobile: boolean;
}

// Parcours : le MÊME câble que la carte réseau de l'accueil (gaine colorée, ombre, halo, reflet, prises métalliques,
// signaux qui circulent). Un câble par étape, d'une prise à la suivante, d'un côté puis de l'autre.
// Les câbles s'allument avec le défilement (ligne de lecture à 62 % de l'écran) ; quand un câble atteint une étape,
// sa prise se branche et la carte glisse depuis son côté. Rien ne recule quand on remonte.
const LIGNE_LECTURE = 0.62;
const ECH = 120; // points d'échantillonnage par câble
const COULEURS = ["#60a5fa", "#38bdf8", "#818cf8", "#a78bfa", "#22d3ee", "#6366f1"]; // mêmes teintes que les ports de la carte

interface Seg { d: string; L: number; ys: number[]; pts: { x: number; y: number }[]; debut: number }
interface Sig { halo: SVGCircleElement | null; pulse: SVGCircleElement | null }

export default function ParcoursSection({ isMobile }: ParcoursProps) {
  void isMobile;
  const { lang } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const palette = usePalette();
  const h = homeStrings[lang];
  const items = h.parcours.items;
  const reduit = useReducedMotion();

  const zone = useRef<HTMLDivElement>(null);
  const calc = useRef<SVGPathElement>(null);
  const nodes = useRef<(HTMLDivElement | null)[]>([]);
  const segs = useRef<Seg[]>([]);
  const couches = useRef<(SVGPathElement | null)[][]>([]); // 5 tracés par câble
  const sigs = useRef<Sig[]>([]);
  const atteint = useRef(0);
  const enVue = useRef(true);
  const [taille, setTaille] = useState({ w: 0, h: 0 });
  const [pts, setPts] = useState<{ x: number; y: number }[]>([]);
  const [ds, setDs] = useState<string[]>([]);
  const [shown, setShown] = useState(0);
  const [compact, setCompact] = useState(false); // téléphone : une seule colonne, câble le long du bord gauche

  const col = useCallback((c: string) => (isDark ? c : (palette === "aube" ? CLAIR : CLAIR_NEIGE)[c] ?? c), [isDark, palette]);

  // Allume chaque câble selon la longueur atteinte
  const maj = useCallback(() => {
    const z = zone.current;
    const S = segs.current;
    if (!z || S.length === 0) return;
    const lu = window.innerHeight * LIGNE_LECTURE - z.getBoundingClientRect().top;
    let len = 0;
    for (let i = 0; i < S.length; i++) {
      const s = S[i];
      if (lu >= s.ys[ECH]) { len = s.debut + s.L; continue; }
      let k = -1;
      for (let j = 0; j <= ECH; j++) { if (s.ys[j] <= lu) k = j; else break; }
      len = s.debut + (k < 0 ? 0 : (k / ECH) * s.L);
      break;
    }
    if (len > atteint.current) atteint.current = len;
    S.forEach((s, i) => {
      const lit = Math.min(Math.max(atteint.current - s.debut, 0), s.L);
      couches.current[i]?.forEach((p) => { if (p) { p.style.strokeDasharray = String(s.L); p.style.strokeDashoffset = String(s.L - lit); } });
    });
    const combien = S.filter((s) => s.debut + s.L <= atteint.current + 70).length;
    setShown((n) => (combien > n ? combien : n));
  }, []);

  const mesurer = useCallback(() => {
    const z = zone.current, c = calc.current;
    if (!z || !c) return;
    const zr = z.getBoundingClientRect();
    const p = nodes.current.map((e) => {
      if (!e) return { x: 0, y: 0 };
      const r = e.getBoundingClientRect();
      return { x: r.left - zr.left + r.width / 2, y: r.top - zr.top + r.height / 2 };
    });
    if (p.length === 0) return;
    const cx = zr.width / 2;
    setCompact(window.innerWidth < 768);
    const y0 = Math.max(6, p[0].y - 90);
    const defs: string[] = [];
    defs.push(`M${cx} ${y0} C${cx} ${y0 + (p[0].y - y0) * 0.6} ${p[0].x + (cx - p[0].x) * 0.6} ${p[0].y} ${p[0].x} ${p[0].y}`);
    for (let i = 1; i < p.length; i++) {
      const a = p[i - 1], b = p[i];
      defs.push(`M${a.x} ${a.y} C${a.x + (b.x - a.x) * 0.62} ${a.y} ${b.x - (b.x - a.x) * 0.62} ${b.y} ${b.x} ${b.y}`);
    }
    let cumul = 0;
    segs.current = defs.map((d) => {
      c.setAttribute("d", d);
      const L = c.getTotalLength();
      const ys: number[] = [], pp: { x: number; y: number }[] = [];
      for (let k = 0; k <= ECH; k++) { const q = c.getPointAtLength((L * k) / ECH); ys.push(q.y); pp.push({ x: q.x, y: q.y }); }
      const s = { d, L, ys, pts: pp, debut: cumul };
      cumul += L;
      return s;
    });
    setPts(p);
    setDs(defs);
    setTaille({ w: zr.width, h: zr.height });
  }, []);

  useLayoutEffect(() => {
    mesurer();
    const z = zone.current;
    if (!z || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(mesurer);
    ro.observe(z);
    return () => ro.disconnect();
  }, [mesurer, items.length]);

  // Une fois les câbles dessinés, on applique l'état d'allumage et on suit le défilement
  useEffect(() => {
    if (ds.length === 0) return;
    if (reduit) {
      atteint.current = Infinity;
      segs.current.forEach((s, i) => couches.current[i]?.forEach((p) => { if (p) { p.style.strokeDasharray = String(s.L); p.style.strokeDashoffset = "0"; } }));
      setShown(items.length);
      return;
    }
    let raf = 0;
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; maj(); }); };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    maj();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ds, maj, reduit, items.length, isDark, palette]);

  // Signaux lumineux : une seule boucle, active seulement si la section est visible
  useEffect(() => {
    if (ds.length === 0 || reduit) return;
    const z = zone.current;
    let io: IntersectionObserver | undefined;
    if (z && typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver((es) => { enVue.current = es[es.length - 1].isIntersecting; }, { threshold: 0.02 });
      io.observe(z);
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!enVue.current || document.hidden) return;
      segs.current.forEach((s, i) => {
        const allume = atteint.current - s.debut >= s.L - 0.5;
        for (let k = 0; k < 2; k++) {
          const sg = sigs.current[i * 2 + k];
          if (!sg || !sg.pulse || !sg.halo) continue;
          if (!allume) { sg.pulse.setAttribute("opacity", "0"); sg.halo.setAttribute("opacity", "0"); continue; }
          const per = 2600 + (i % 6) * 250;
          const t = ((((now - t0 + k * 0.5 * per) % per) + per) % per) / per; // toujours entre 0 et 1, même si now < t0
          const q = s.pts[Math.min(ECH, Math.floor(t * ECH))];
          sg.pulse.setAttribute("cx", String(q.x)); sg.pulse.setAttribute("cy", String(q.y));
          sg.halo.setAttribute("cx", String(q.x)); sg.halo.setAttribute("cy", String(q.y));
          const o = Math.sin(Math.PI * t);
          sg.pulse.setAttribute("opacity", String((isDark ? 0.95 : 0.8) * o));
          sg.halo.setAttribute("opacity", String((isDark ? 0.35 : 0.2) * o));
        }
      });
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); io?.disconnect(); };
  }, [ds, reduit, isDark]);

  const prise = isDark ? "#cbd5e1" : "#c9d2de";
  const priseBord = isDark ? "#475569" : "#8d9bb0";

  return (
    <section id="parcours" className="lisible px-4 pb-16 mt-16">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 dark:text-slate-100 text-center mb-12">
          {h.parcours.heading}
        </h2>
        <div ref={zone} className="parcours-zone relative">
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            width={taille.w}
            height={taille.h}
            viewBox={`0 0 ${taille.w || 1} ${taille.h || 1}`}
            style={{ overflow: "visible" }}
            aria-hidden
          >
            <path ref={calc} d="M0 0" fill="none" stroke="none" style={{ visibility: "hidden" }} />
            {ds.map((d, i) => {
              const cc = col(COULEURS[i % COULEURS.length]);
              const setRef = (k: number) => (el: SVGPathElement | null) => {
                if (!couches.current[i]) couches.current[i] = [];
                couches.current[i][k] = el;
              };
              // mêmes couches que les câbles de la carte : ombre, halos, gaine, reflet
              return (
                <g key={`${d}-${isDark}-${palette}`}>
                  <path d={d} fill="none" strokeLinecap="round" stroke="#000" strokeWidth={6} strokeOpacity={isDark ? 0.3 : 0.06} transform="translate(0,3)" ref={setRef(0)} />
                  <path d={d} fill="none" strokeLinecap="round" stroke={cc} strokeWidth={13} strokeOpacity={isDark ? 0.07 : 0.03} ref={setRef(1)} />
                  <path d={d} fill="none" strokeLinecap="round" stroke={cc} strokeWidth={8} strokeOpacity={isDark ? 0.14 : 0.05} ref={setRef(2)} />
                  <path d={d} fill="none" strokeLinecap="round" stroke={cc} strokeWidth={isDark ? 3.4 : 2.8} strokeOpacity={isDark ? 1 : 0.85} ref={setRef(3)} />
                  <path d={d} fill="none" strokeLinecap="round" stroke="#fff" strokeWidth={1} strokeOpacity={isDark ? 0.35 : 0.5} transform="translate(0,-.9)" ref={setRef(4)} />
                  {[0, 1].map((k) => (
                    <g key={k}>
                      <circle r={8} fill={cc} opacity={0} ref={(el) => { sigs.current[i * 2 + k] = { pulse: sigs.current[i * 2 + k]?.pulse ?? null, halo: el }; }} />
                      <circle r={3.2} fill={isDark ? "#fff" : cc} opacity={0} ref={(el) => { sigs.current[i * 2 + k] = { halo: sigs.current[i * 2 + k]?.halo ?? null, pulse: el }; }} />
                    </g>
                  ))}
                </g>
              );
            })}
            {/* prises métalliques, branchées quand le câble arrive */}
            {pts.map((p, i) => {
              const left = i % 2 === 0;
              const on = i < shown;
              const x = compact ? p.x - 9 : left ? p.x : p.x - 9;
              return (
                <g key={i} style={{ opacity: on ? 1 : 0.35, transition: "opacity .5s" }}>
                  <rect x={x} y={p.y - 4} width={9} height={8} rx={1.5} fill={prise} stroke={priseBord} strokeWidth={1} />
                  <rect x={x} y={p.y - 4} width={9} height={2} fill="#fff" fillOpacity={0.5} />
                </g>
              );
            })}
          </svg>

          {items.map((item, i) => {
            const isLeft = i % 2 === 0;
            const visible = i < shown;
            return (
              <div key={i} className="relative grid grid-cols-1 md:grid-cols-2 md:gap-x-[120px] pb-16 md:pb-36 last:pb-4">
                <div
                  ref={(el) => { nodes.current[i] = el; }}
                  className="absolute top-8 w-0 h-0"
                  style={{ left: isLeft ? "var(--nxa)" : "var(--nxb)" }}
                />
                <motion.div
                  initial={false}
                  animate={visible ? { opacity: 1, x: 0 } : { opacity: 0, x: isLeft ? -22 : 22 }}
                  transition={{ duration: reduit ? 0 : 1.1, ease: [0.22, 1, 0.36, 1] }}
                  className={isLeft ? "md:col-start-1" : "md:col-start-2"}
                >
                  <div className={`py-1 pl-12 ${isLeft ? "md:pl-0 md:text-right md:pr-6" : "md:pl-6"}`}>
                    <span className="font-mono text-xs text-blue-500 dark:text-blue-400 block mb-0.5">{item.year}</span>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{item.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { useTheme } from "@/app/providers/ThemeProvider";
import { homeStrings } from "@/app/lib/i18n";
import { usePalette } from "@/app/lib/palette";

interface ReseauSequenceProps {
  onNavigate: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}

// Accueil : le nom est le commutateur, « À propos » s'ouvre au milieu comme une fenêtre de terminal,
// puis les sections arrivent comme des ports branchés un par un (voyant orange puis vert, câble, signal).
// Un clic sur « À propos » l'agrandit. La séquence ne se joue qu'une fois par visite.
//
// Performance : aucun filtre SVG (flou, ombre portée) ; une seule boucle d'animation pour tous les signaux,
// arrêtée quand la carte est hors écran ou l'onglet caché ; trajectoires pré-échantillonnées.

interface PortDef {
  fr: string;
  en: string;
  href: string;
  c: string;
  x: number;
  y: number;
  left: boolean;
}

const PORTS: PortDef[] = [
  { fr: "Projets", en: "Projects", href: "#projects", c: "#60a5fa", x: 14.5, y: 27, left: true },
  { fr: "Infrastructure", en: "Infrastructure", href: "#infra", c: "#38bdf8", x: 12.5, y: 47, left: true },
  { fr: "Parcours", en: "Background", href: "#parcours", c: "#818cf8", x: 11.5, y: 67, left: true },
  { fr: "Certifications", en: "Certifications", href: "#certifications", c: "#22d3ee", x: 12.5, y: 87, left: true },
  { fr: "Veille cyber", en: "Cyber watch", href: "#veille", c: "#a78bfa", x: 85.5, y: 27, left: false },
  { fr: "Compétences", en: "Skills", href: "#competences", c: "#22d3ee", x: 87.5, y: 47, left: false },
  { fr: "Synthèse", en: "Summary", href: "#synthese", c: "#6366f1", x: 88.5, y: 67, left: false },
  { fr: "Apprentissage", en: "Learning", href: "#apprentissage", c: "#60a5fa", x: 87.5, y: 87, left: false },
];

// Mode clair : mêmes teintes, plus foncées pour rester lisibles sur fond pâle
export const CLAIR: Record<string, string> = {
  "#60a5fa": "#7e9fd0", "#38bdf8": "#7fb1c9", "#818cf8": "#9391c9", "#a78bfa": "#aa97cd", "#22d3ee": "#7ab4be", "#6366f1": "#8b8ac2",
};

export const CLAIR_NEIGE: Record<string, string> = {
  "#60a5fa": "#aa0003", "#38bdf8": "#5c5968", "#818cf8": "#c43b3f", "#a78bfa": "#3d3a4d", "#22d3ee": "#d4565a", "#6366f1": "#8a1214",
};
const NS = "http://www.w3.org/2000/svg";
const ECH = 120; // points par trajectoire
let sequenceJouee = false;

interface Pt { x: number; y: number }
interface Signal { pts: Pt[]; pulse: SVGCircleElement; halo: SVGCircleElement; per: number; t0: number; on: boolean }
interface Cable {
  all: SVGPathElement[];
  plugs: SVGRectElement[];
  gaine: SVGPathElement;
  pts: Pt[];
  signals: Signal[];
  kind: "about" | "port";
  i: number;
  c: string;
}
type Mesure = SVGPathElement & { _L: number };

export default function ReseauSequence({ onNavigate }: ReseauSequenceProps) {
  const { lang } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const palette = usePalette();
  const fr = lang === "fr";
  const h = homeStrings[lang];

  const scene = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const gc = useRef<SVGGElement>(null);
  const sw = useRef<HTMLDivElement>(null);
  const about = useRef<HTMLDivElement>(null);
  const portEls = useRef<(HTMLAnchorElement | null)[]>([]);
  const [ouvert, setOuvert] = useState(false);
  const ouvertRef = useRef(false);
  const rebuildEnAttente = useRef<(() => void) | null>(null);

  const changer = useCallback((v: boolean) => {
    ouvertRef.current = v;
    setOuvert(v);
    if (!v && rebuildEnAttente.current) {
      const f = rebuildEnAttente.current;
      rebuildEnAttente.current = null;
      window.setTimeout(f, 380); // après la fin de la transition de fermeture
    }
  }, []);

  useEffect(() => {
    if (!ouvert) return;
    const surTouche = (e: KeyboardEvent) => { if (e.key === "Escape") changer(false); };
    window.addEventListener("keydown", surTouche);
    return () => window.removeEventListener("keydown", surTouche);
  }, [ouvert, changer]);

  const degrade = isDark ? "linear-gradient(to right, #60a5fa, #818cf8)" : palette === "aube" ? "linear-gradient(to right, #5b72b5, #8b6cc0)" : "linear-gradient(to right, #aa0003, #7a0002)";
  const textes = {
    horsLigne: fr ? "hors ligne" : "offline",
    negocie: fr ? "négociation…" : "negotiating…",
    lien: fr ? "lien 1 Gbit/s" : "link 1 Gbit/s",
    sous: fr ? "Systèmes & réseaux · Cybersécurité" : "Systems & networks · Cybersecurity",
  };

  useEffect(() => {
    const sceneEl = scene.current, svgEl = svg.current, g = gc.current, swEl = sw.current, abEl = about.current;
    if (!sceneEl || !svgEl || !g || !swEl || !abEl) return;
    const animer = !sequenceJouee;
    const timers: number[] = [];
    const rafs: number[] = [];
    let cables: Cable[] = [];
    let fini = false;
    const at = (ms: number, fn: () => void) => { timers.push(window.setTimeout(fn, ms)); };
    const cc = (c: string) => (isDark ? c : (palette === "aube" ? CLAIR : CLAIR_NEIGE)[c] ?? c);

    const nomTxt = swEl.querySelector<HTMLElement>("[data-nom]")!;
    const caret = swEl.querySelector<HTMLElement>("[data-caret]")!;
    const sub = swEl.querySelector<HTMLElement>("[data-sub]")!;
    const swJacks = Array.from(swEl.querySelectorAll<HTMLElement>("[data-swjack]"));
    const abBlocs = Array.from(abEl.querySelectorAll<HTMLElement>("[data-bloc]"));
    const ports = portEls.current.filter((p): p is HTMLAnchorElement => !!p);
    const NOM = "Garlens Charles";

    const pos = (el: HTMLElement) => {
      const s = sceneEl.getBoundingClientRect(), r = el.getBoundingClientRect();
      return { l: r.left - s.left, r: r.right - s.left, t: r.top - s.top, b: r.bottom - s.top, cx: (r.left + r.right) / 2 - s.left, cy: (r.top + r.bottom) / 2 - s.top };
    };
    const mk = <K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string | number>, parent: Element) => {
      const e = document.createElementNS(NS, tag);
      for (const k in attrs) e.setAttribute(k, String(attrs[k]));
      parent.appendChild(e);
      return e;
    };

    // ── Signaux : une seule boucle pour tous, active seulement si la carte est visible ──
    let enVue = true, boucle = 0;
    const tick = (now: number) => {
      boucle = requestAnimationFrame(tick);
      for (const c of cables) {
        for (const s of c.signals) {
          if (!s.on || now < s.t0) continue;
          const t = ((now - s.t0) % s.per) / s.per;
          const p = s.pts[Math.min(ECH, Math.floor(t * ECH))];
          s.pulse.setAttribute("cx", String(p.x)); s.pulse.setAttribute("cy", String(p.y));
          s.halo.setAttribute("cx", String(p.x)); s.halo.setAttribute("cy", String(p.y));
          const o = Math.sin(Math.PI * t);
          s.pulse.setAttribute("opacity", String((isDark ? 0.95 : 0.8) * o));
          s.halo.setAttribute("opacity", String((isDark ? 0.35 : 0.2) * o));
        }
      }
    };
    const majBoucle = () => {
      const veut = enVue && !document.hidden;
      if (veut && !boucle) boucle = requestAnimationFrame(tick);
      else if (!veut && boucle) { cancelAnimationFrame(boucle); boucle = 0; }
    };
    const surVisibilite = () => majBoucle();
    document.addEventListener("visibilitychange", surVisibilite);
    let io: IntersectionObserver | undefined;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver((es) => { enVue = es[es.length - 1].isIntersecting; majBoucle(); }, { threshold: 0.05 });
      io.observe(sceneEl);
    }

    const build = (): Cable[] => {
      const s = pos(swEl), W = sceneEl.clientWidth, H = sceneEl.clientHeight, a = pos(abEl);
      svgEl.setAttribute("viewBox", `0 0 ${W} ${H}`);
      g.innerHTML = "";
      const defs: { d: string; c: string; kind: "about" | "port"; i: number; sx: number; sy: number; ex: number; ey: number; left: boolean }[] = [
        { d: `M${s.cx} ${s.b} V${a.t}`, c: "#60a5fa", kind: "about", i: -1, sx: s.cx, sy: s.b, ex: s.cx, ey: a.t, left: true },
      ];
      const nb = { l: 0, r: 0 };
      PORTS.forEach((p, i) => {
        const el = ports[i];
        if (!el) return;
        const pe = pos(el);
        const k = p.left ? nb.l++ : nb.r++;
        const sy = s.t + (s.b - s.t) * (0.2 + 0.19 * k);
        const sx = p.left ? s.l : s.r;
        const ex = p.left ? pe.r : pe.l;
        const ey = pe.cy;
        const dx = Math.abs(ex - sx) * 0.55 + W * 0.025 * (3 - k);
        const d = p.left ? `M${sx} ${sy} C${sx - dx} ${sy} ${ex + dx} ${ey} ${ex} ${ey}` : `M${sx} ${sy} C${sx + dx} ${sy} ${ex - dx} ${ey} ${ex} ${ey}`;
        defs.push({ d, c: p.c, kind: "port", i, sx, sy, ex, ey, left: p.left });
      });
      return defs.map((p) => {
        const col = cc(p.c);
        const grp = mk("g", {}, g);
        // Ombre et lueur sans filtre : traits superposés (bien moins coûteux qu'un flou SVG)
        const ombre = mk("path", { d: p.d, class: "cab", stroke: "#000", "stroke-width": 6, "stroke-opacity": isDark ? 0.3 : 0.06, transform: "translate(0,3)" }, grp);
        const lueur2 = mk("path", { d: p.d, class: "cab", stroke: col, "stroke-width": 13, "stroke-opacity": isDark ? 0.07 : 0.03 }, grp);
        const lueur = mk("path", { d: p.d, class: "cab", stroke: col, "stroke-width": 8, "stroke-opacity": isDark ? 0.14 : 0.05 }, grp);
        const gaine = mk("path", { d: p.d, class: "cab", stroke: col, "stroke-width": isDark ? 3.4 : 2.8, "stroke-opacity": isDark ? 1 : 0.85 }, grp);
        const reflet = mk("path", { d: p.d, class: "cab", stroke: "#fff", "stroke-width": 1, "stroke-opacity": isDark ? 0.35 : 0.5, transform: "translate(0,-.9)" }, grp);
        const all = [ombre, lueur2, lueur, gaine, reflet] as Mesure[];
        all.forEach((x) => {
          const L = x.getTotalLength();
          x.style.strokeDasharray = String(L);
          x.style.strokeDashoffset = String(L);
          x._L = L;
        });
        const L = all[3]._L;
        const pts: Pt[] = [];
        for (let k = 0; k <= ECH; k++) { const q = gaine.getPointAtLength((L * k) / ECH); pts.push({ x: q.x, y: q.y }); }
        const plugs: SVGRectElement[] = [];
        if (p.kind === "port") {
          const prise = (x: number, y: number, dir: number) => {
            const r = mk("rect", { x: dir < 0 ? x - 9 : x, y: y - 4, width: 9, height: 8, rx: 1.5, fill: isDark ? "#cbd5e1" : "#c9d2de", stroke: isDark ? "#475569" : "#8d9bb0", "stroke-width": 1, class: "plug" }, grp);
            mk("rect", { x: dir < 0 ? x - 9 : x, y: y - 4, width: 9, height: 2, fill: "#fff", "fill-opacity": 0.5, class: "plug" }, grp);
            return r;
          };
          plugs.push(prise(p.sx, p.sy, p.left ? -1 : 1), prise(p.ex, p.ey, p.left ? 1 : -1));
        }
        // Deux signaux par câble, décalés d'une demi-période
        const signals: Signal[] = [0, 0.5].map((dec) => {
          const halo = mk("circle", { r: 8, fill: col, opacity: 0 }, grp) as SVGCircleElement;
          const pulse = mk("circle", { r: 3.2, fill: isDark ? "#fff" : col, opacity: 0 }, grp) as SVGCircleElement;
          const per = p.kind === "about" ? 1800 : 2600 + Math.max(p.i, 0) * 250;
          return { pts, pulse, halo, per, t0: performance.now() - dec * per, on: false };
        });
        return { all, plugs, gaine, pts, signals, kind: p.kind, i: p.i, c: p.c };
      });
    };

    const tracer = (c: Cable, dur: number, fin?: () => void) => {
      const t0 = performance.now();
      const f = (now: number) => {
        const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
        c.all.forEach((x) => { x.style.strokeDashoffset = String((x as Mesure)._L * (1 - e)); });
        if (k < 1) rafs.push(requestAnimationFrame(f)); else fin?.();
      };
      rafs.push(requestAnimationFrame(f));
    };
    const allumer = (c: Cable) => { const t = performance.now(); c.signals.forEach((s, i) => { s.t0 = t - i * 0.5 * s.per; s.on = true; }); majBoucle(); };

    const setPortEtat = (el: HTMLAnchorElement, etat: "hors" | "amber" | "green", c: string) => {
      const led = el.querySelector<HTMLElement>("[data-led]")!;
      const em = el.querySelector<HTMLElement>("[data-etat]")!;
      led.className = `led ${etat === "hors" ? "" : etat}`;
      em.textContent = etat === "green" ? textes.lien : etat === "amber" ? textes.negocie : textes.horsLigne;
      el.querySelectorAll<HTMLElement>(".jack").forEach((j, k) => j.classList.toggle("lit", etat === "green" && k !== 2));
      el.style.setProperty("--glow", etat === "green" ? c + (isDark ? "22" : "14") : "transparent");
    };
    PORTS.forEach((p, i) => ports[i]?.style.setProperty("--c", cc(p.c)));

    const etatFinal = () => {
      swEl.style.opacity = "1"; abEl.style.opacity = "1";
      nomTxt.textContent = NOM; caret.style.display = "none"; sub.style.opacity = "1";
      swJacks.forEach((j) => j.classList.add("lit"));
      swEl.style.setProperty("--glow", isDark ? "rgba(96,165,250,.22)" : "rgba(96,130,190,.08)");
      abBlocs.forEach((b) => { b.style.opacity = "1"; b.style.transform = "none"; });
      cables.forEach((c) => {
        c.all.forEach((x) => { x.style.strokeDashoffset = "0"; });
        c.plugs.forEach((p) => { p.style.opacity = "1"; });
        if (c.kind === "port") { const el = ports[c.i]; if (el) { el.style.opacity = "1"; setPortEtat(el, "green", c.c); } }
        allumer(c);
      });
      fini = true;
    };

    cables = build();

    if (!animer) {
      etatFinal();
    } else {
      sceneEl.classList.add("sq-joue");
      swEl.style.opacity = "0"; abEl.style.opacity = "0";
      nomTxt.textContent = ""; sub.style.opacity = "0";
      ports.forEach((p) => { p.style.opacity = "0"; setPortEtat(p, "hors", "#000"); });
      abBlocs.forEach((b) => { b.style.opacity = "0"; b.style.transform = "translateY(.4cqw)"; });
      swJacks.forEach((j) => j.classList.remove("lit"));

      at(100, () => { swEl.style.opacity = "1"; swEl.style.setProperty("--glow", isDark ? "rgba(96,165,250,.22)" : "rgba(96,130,190,.08)"); });
      swJacks.forEach((j, i) => at(300 + i * 45, () => j.classList.add("lit")));
      at(600, () => {
        let i = 0;
        const iv = window.setInterval(() => {
          nomTxt.textContent = NOM.slice(0, ++i);
          if (i >= NOM.length) { clearInterval(iv); sub.style.opacity = "1"; at(300, () => { caret.style.display = "none"; }); }
        }, 40);
        timers.push(iv);
      });
      at(1300, () => tracer(cables[0], 350));
      at(1500, () => { abEl.style.opacity = "1"; });
      abBlocs.forEach((b, i) => at(1800 + i * 200, () => { b.style.opacity = "1"; b.style.transform = "none"; }));
      at(1700, () => allumer(cables[0]));
      PORTS.forEach((p, i) => {
        const el = ports[i], c = cables[i + 1];
        if (!el || !c) return;
        const t = 2000 + i * 330;
        at(t, () => { el.style.opacity = "1"; setPortEtat(el, "amber", p.c); });
        at(t + 120, () => {
          c.plugs[0].style.opacity = "1";
          tracer(c, 340, () => {
            c.plugs[1].style.opacity = "1";
            setPortEtat(el, "green", p.c);
            allumer(c);
          });
        });
      });
      at(2000 + PORTS.length * 330 + 600, () => { fini = true; sequenceJouee = true; });
    }

    // Redimensionnement : on recalcule les câbles et on affiche l'état final
    // (si « À propos » est agrandi, on attend sa fermeture pour mesurer sa vraie place)
    const refaire = () => { cables = build(); etatFinal(); };
    let rz: number | undefined;
    const ro = new ResizeObserver(() => {
      if (!fini) return;
      window.clearTimeout(rz);
      rz = window.setTimeout(() => {
        if (ouvertRef.current) { rebuildEnAttente.current = refaire; return; }
        refaire();
      }, 150);
    });
    ro.observe(sceneEl);
    majBoucle();

    return () => {
      timers.forEach((t) => { clearTimeout(t); clearInterval(t); });
      rafs.forEach((r) => cancelAnimationFrame(r));
      if (boucle) cancelAnimationFrame(boucle);
      window.clearTimeout(rz);
      document.removeEventListener("visibilitychange", surVisibilite);
      io?.disconnect();
      ro.disconnect();
      rebuildEnAttente.current = null;
      sceneEl.classList.remove("sq-joue");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDark, fr, palette]);

  const IDE = <><div className="ear l"><span className="vis" /></div><div className="ear r"><span className="vis" /></div><div className="shine" /></>;

  return (
    <div
      ref={scene}
      className={`sq sq-taille ${isDark ? "" : "sq-clair"} ${ouvert ? "sq-ouvert" : ""} relative mx-auto`}
    >
      {/* Halo derrière le commutateur : donne de la profondeur à la carte */}
      <div className="sq-halo" aria-hidden />

      <svg ref={svg} aria-hidden>
        <g ref={gc} />
      </svg>

      {/* Commutateur = le nom */}
      <div ref={sw} className="abs rack switch" style={{ opacity: 0, transition: "opacity .5s" }}>
        {IDE}
        <div className="labels"><span><b />PWR</span><span><b />SYS</span></div>
        <div className="vents"><i /><i /><i /><i /><i /><i /></div>
        <div className="swrow">{Array.from({ length: 8 }).map((_, i) => <i key={i} data-swjack className="jack" />)}</div>
        <h1 className="nom" style={{ backgroundImage: degrade }}>
          <span data-nom />
          <span data-caret className="caret" />
        </h1>
        <p data-sub className="sub" style={{ opacity: 0 }}>{textes.sous}</p>
      </div>

      {/* Voile : assombrit la carte quand « À propos » est agrandi ; un clic dessus referme */}
      <div className="sq-voile" onClick={() => changer(false)} aria-hidden />

      {/* À propos : fenêtre de terminal, cliquable pour l'agrandir */}
      <div
        ref={about}
        className="abs about"
        style={{ opacity: 0 }}
        role={ouvert ? "dialog" : "button"}
        aria-label={fr ? "À propos de moi" : "About me"}
        aria-expanded={ouvert}
        tabIndex={ouvert ? -1 : 0}
        onClick={() => { if (!ouvert) changer(true); }}
        onKeyDown={(e) => { if (!ouvert && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); changer(true); } }}
      >
        <div className="bar">
          <i style={{ background: "#ef4444" }} /><i style={{ background: "#f59e0b" }} /><i style={{ background: "#22c55e" }} />
          <span>~/garlens/{fr ? "a-propos" : "about"}</span>
          <button
            type="button"
            className="sq-agrandir"
            aria-label={ouvert ? (fr ? "Fermer" : "Close") : (fr ? "Agrandir" : "Expand")}
            onClick={(e) => { e.stopPropagation(); changer(!ouvert); }}
          >
            {ouvert ? "✕" : <>{fr ? "agrandir" : "expand"} ⤢</>}
          </button>
        </div>
        <div className="corps">
          <h2 data-bloc>{h.about.heading}</h2>
          <p data-bloc>{h.about.p1}</p>
          <p data-bloc>{h.about.p2}</p>
          <div data-bloc className="tags"><span>Proxmox</span><span>Docker</span><span>OPNsense</span><span>Linux</span></div>
          <div className="plus" aria-hidden={!ouvert}>
            <div className="plus-in">
              {h.about.skills.map((b) => (
                <div key={b.title} className="comp">
                  <h3>{b.title}</h3>
                  <ul>{b.items.map((it) => <li key={it}>{it}</li>)}</ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sections = ports */}
      {PORTS.map((p, i) => (
        <a
          key={p.href}
          ref={(el) => { portEls.current[i] = el; }}
          href={p.href}
          onClick={(e) => onNavigate(e, p.href)}
          className="abs rack port"
          style={{ left: `${p.x}%`, top: `${p.y}%`, opacity: 0, transition: "opacity .4s, box-shadow .3s, border-color .1s" }}
        >
          {IDE}
          <span>
            <b>{fr ? p.fr : p.en}</b>
            <small><i data-led className="led" />{`${String(i + 1).padStart(2, "0")} · `}<em data-etat style={{ fontStyle: "normal" }}>{textes.horsLigne}</em></small>
          </span>
          <span className="jacks"><i className="jack" /><i className="jack" /><i className="jack" /><i className="jack" /></span>
        </a>
      ))}
    </div>
  );
}

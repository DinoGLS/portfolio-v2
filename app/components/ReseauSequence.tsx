"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { useTheme } from "@/app/providers/ThemeProvider";
import { homeStrings } from "@/app/lib/i18n";

interface ReseauSequenceProps {
  onNavigate: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}

// Accueil « Les deux » : le nom est le commutateur, « À propos » s'ouvre au milieu comme une fenêtre de terminal,
// puis les sections arrivent comme des ports branchés un par un (voyant orange puis vert, câble, signal).
// La séquence ne se joue qu'une fois par visite : ensuite l'état final s'affiche directement.

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
  { fr: "Projets", en: "Projects", href: "#projects", c: "#60a5fa", x: 15, y: 33, left: true },
  { fr: "Infrastructure", en: "Infrastructure", href: "#infra", c: "#38bdf8", x: 13, y: 56, left: true },
  { fr: "Parcours", en: "Background", href: "#parcours", c: "#818cf8", x: 12, y: 79, left: true },
  { fr: "Veille cyber", en: "Cyber watch", href: "#veille", c: "#a78bfa", x: 85, y: 33, left: false },
  { fr: "Compétences", en: "Skills", href: "#competences", c: "#22d3ee", x: 87, y: 56, left: false },
  { fr: "Synthèse", en: "Summary", href: "#synthese", c: "#6366f1", x: 88, y: 79, left: false },
];

// Mode clair : mêmes teintes, plus foncées pour rester lisibles sur fond pâle
const CLAIR: Record<string, string> = {
  "#60a5fa": "#3f6fb5", "#38bdf8": "#3b86ab", "#818cf8": "#5b57b0", "#a78bfa": "#7a5ab5", "#22d3ee": "#2f8191", "#6366f1": "#4d4aa0",
};

const NS = "http://www.w3.org/2000/svg";
let sequenceJouee = false;

interface Cable {
  all: SVGPathElement[];
  gaine: SVGPathElement;
  plugs: SVGRectElement[];
  pulse: SVGCircleElement;
  halo: SVGCircleElement;
  kind: "about" | "port";
  i: number;
  c: string;
  raf?: number;
}

export default function ReseauSequence({ onNavigate }: ReseauSequenceProps) {
  const { lang } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const fr = lang === "fr";
  const h = homeStrings[lang];

  const scene = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const gc = useRef<SVGGElement>(null);
  const sw = useRef<HTMLDivElement>(null);
  const about = useRef<HTMLDivElement>(null);
  const portEls = useRef<(HTMLAnchorElement | null)[]>([]);

  const degrade = isDark ? "linear-gradient(to right, #60a5fa, #818cf8)" : "linear-gradient(to right, #2f5c99, #5457b0)";
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
    const cc = (c: string) => (isDark ? c : CLAIR[c] ?? c);

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
        const sy = s.t + (s.b - s.t) * (0.3 + 0.2 * k);
        const sx = p.left ? s.l : s.r;
        const ex = p.left ? pe.r : pe.l;
        const ey = pe.cy;
        const dx = Math.abs(ex - sx) * 0.55 + W * 0.03 * (2 - k);
        const d = p.left ? `M${sx} ${sy} C${sx - dx} ${sy} ${ex + dx} ${ey} ${ex} ${ey}` : `M${sx} ${sy} C${sx + dx} ${sy} ${ex - dx} ${ey} ${ex} ${ey}`;
        defs.push({ d, c: p.c, kind: "port", i, sx, sy, ex, ey, left: p.left });
      });
      return defs.map((p) => {
        const col = cc(p.c);
        const grp = mk("g", {}, g);
        const ombre = mk("path", { d: p.d, class: "cab", stroke: "#000", "stroke-width": 6, "stroke-opacity": isDark ? 0.35 : 0.12, filter: "url(#sq-ombre)" }, grp);
        const lueur = mk("path", { d: p.d, class: "cab", stroke: col, "stroke-width": 9, "stroke-opacity": isDark ? 0.22 : 0.14, filter: "url(#sq-lueur)" }, grp);
        const gaine = mk("path", { d: p.d, class: "cab", stroke: col, "stroke-width": 3.4 }, grp);
        const reflet = mk("path", { d: p.d, class: "cab", stroke: "#fff", "stroke-width": 1, "stroke-opacity": 0.35, transform: "translate(0,-.9)" }, grp);
        const all = [ombre, lueur, gaine, reflet];
        all.forEach((x) => {
          const L = x.getTotalLength();
          x.style.strokeDasharray = String(L);
          x.style.strokeDashoffset = String(L);
          (x as unknown as { _L: number })._L = L;
        });
        const plugs: SVGRectElement[] = [];
        if (p.kind === "port") {
          const prise = (x: number, y: number, dir: number) => {
            const r = mk("rect", { x: dir < 0 ? x - 9 : x, y: y - 4, width: 9, height: 8, rx: 1.5, fill: isDark ? "#cbd5e1" : "#94a3b8", stroke: "#475569", "stroke-width": 1, class: "plug" }, grp);
            mk("rect", { x: dir < 0 ? x - 9 : x, y: y - 4, width: 9, height: 2, fill: "#fff", "fill-opacity": 0.5, class: "plug" }, grp);
            return r;
          };
          plugs.push(prise(p.sx, p.sy, p.left ? -1 : 1), prise(p.ex, p.ey, p.left ? 1 : -1));
        }
        const pulse = mk("circle", { r: 3.2, fill: isDark ? "#fff" : col, opacity: 0 }, grp);
        const halo = mk("circle", { r: 7, fill: col, opacity: 0, filter: "url(#sq-lueur)" }, grp);
        return { all, gaine, plugs, pulse, halo, kind: p.kind, i: p.i, c: p.c };
      });
    };

    const tracer = (c: Cable, dur: number, fin?: () => void) => {
      const t0 = performance.now();
      const f = (now: number) => {
        const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3);
        c.all.forEach((x) => { x.style.strokeDashoffset = String((x as unknown as { _L: number })._L * (1 - e)); });
        if (k < 1) rafs.push(requestAnimationFrame(f)); else fin?.();
      };
      rafs.push(requestAnimationFrame(f));
    };
    const signal = (c: Cable, vitesse: number) => {
      const L = c.gaine.getTotalLength(), t0 = performance.now() + vitesse * Math.random() * 0.4;
      const f = (now: number) => {
        c.raf = requestAnimationFrame(f);
        if (now < t0) return;
        const t = ((now - t0) % vitesse) / vitesse;
        const pt = c.gaine.getPointAtLength(L * t);
        [c.pulse, c.halo].forEach((x) => { x.setAttribute("cx", String(pt.x)); x.setAttribute("cy", String(pt.y)); });
        const o = Math.sin(Math.PI * t);
        c.pulse.setAttribute("opacity", String(0.95 * o));
        c.halo.setAttribute("opacity", String(0.8 * o));
      };
      c.raf = requestAnimationFrame(f);
    };

    const setPortEtat = (el: HTMLAnchorElement, etat: "hors" | "amber" | "green", c: string) => {
      const led = el.querySelector<HTMLElement>("[data-led]")!;
      const em = el.querySelector<HTMLElement>("[data-etat]")!;
      led.className = `led ${etat === "hors" ? "" : etat}`;
      em.textContent = etat === "green" ? textes.lien : etat === "amber" ? textes.negocie : textes.horsLigne;
      el.querySelectorAll<HTMLElement>(".jack").forEach((j, k) => j.classList.toggle("lit", etat === "green" && k !== 2));
      el.style.setProperty("--glow", etat === "green" ? c + "22" : "transparent");
    };
    const couleurs = () => PORTS.forEach((p, i) => ports[i]?.style.setProperty("--c", cc(p.c)));
    couleurs();

    const etatFinal = () => {
      swEl.style.opacity = "1"; abEl.style.opacity = "1";
      nomTxt.textContent = NOM; caret.style.display = "none"; sub.style.opacity = "1";
      swJacks.forEach((j) => j.classList.add("lit"));
      swEl.style.setProperty("--glow", "rgba(96,165,250,.22)");
      abBlocs.forEach((b) => { b.style.opacity = "1"; b.style.transform = "none"; });
      cables.forEach((c) => {
        c.all.forEach((x) => { x.style.strokeDashoffset = "0"; });
        c.plugs.forEach((p) => { p.style.opacity = "1"; });
        if (c.kind === "port") { const el = ports[c.i]; if (el) { el.style.opacity = "1"; setPortEtat(el, "green", c.c); } }
        signal(c, c.kind === "about" ? 1800 : 2600 + Math.max(c.i, 0) * 250);
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

      at(100, () => { swEl.style.opacity = "1"; swEl.style.setProperty("--glow", "rgba(96,165,250,.22)"); });
      swJacks.forEach((j, i) => at(450 + i * 70, () => j.classList.add("lit")));
      at(900, () => {
        let i = 0;
        const iv = window.setInterval(() => {
          nomTxt.textContent = NOM.slice(0, ++i);
          if (i >= NOM.length) { clearInterval(iv); sub.style.opacity = "1"; at(500, () => { caret.style.display = "none"; }); }
        }, 70);
        timers.push(iv);
      });
      at(2300, () => tracer(cables[0], 600));
      at(2800, () => { abEl.style.opacity = "1"; });
      abBlocs.forEach((b, i) => at(3200 + i * 450, () => { b.style.opacity = "1"; b.style.transform = "none"; }));
      at(3000, () => signal(cables[0], 1800));
      PORTS.forEach((p, i) => {
        const el = ports[i], c = cables[i + 1];
        if (!el || !c) return;
        const t = 4800 + i * 900;
        at(t, () => { el.style.opacity = "1"; setPortEtat(el, "amber", p.c); });
        at(t + 250, () => {
          c.plugs[0].style.opacity = "1";
          tracer(c, 520, () => {
            c.plugs[1].style.opacity = "1";
            setPortEtat(el, "green", p.c);
            signal(c, 2600 + i * 250);
          });
        });
      });
      at(4800 + PORTS.length * 900 + 800, () => { fini = true; sequenceJouee = true; });
    }

    // Redimensionnement : on recalcule les câbles et on affiche l'état final
    let rz: number | undefined;
    const ro = new ResizeObserver(() => {
      if (!fini) return;
      window.clearTimeout(rz);
      rz = window.setTimeout(() => {
        cables.forEach((c) => c.raf && cancelAnimationFrame(c.raf));
        cables = build();
        etatFinal();
      }, 150);
    });
    ro.observe(sceneEl);

    return () => {
      timers.forEach((t) => { clearTimeout(t); clearInterval(t); });
      rafs.forEach((r) => cancelAnimationFrame(r));
      cables.forEach((c) => c.raf && cancelAnimationFrame(c.raf));
      window.clearTimeout(rz);
      ro.disconnect();
      sceneEl.classList.remove("sq-joue");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDark, fr]);

  const IDE = <><div className="ear l"><span className="vis" /></div><div className="ear r"><span className="vis" /></div><div className="shine" /></>;

  return (
    <div
      ref={scene}
      className={`sq ${isDark ? "" : "sq-clair"} relative mx-auto [container-type:inline-size]`}
      style={{ width: "min(1100px, 100%, calc((100dvh - 7rem) * 1.6667))", aspectRatio: "1000 / 600" }}
    >
      <svg ref={svg} aria-hidden>
        <defs>
          <filter id="sq-ombre" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000" floodOpacity=".6" /></filter>
          <filter id="sq-lueur" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="3" /></filter>
        </defs>
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

      {/* À propos : fenêtre de terminal */}
      <div ref={about} className="abs about" style={{ opacity: 0 }}>
        <div className="bar"><i style={{ background: "#ef4444" }} /><i style={{ background: "#f59e0b" }} /><i style={{ background: "#22c55e" }} /><span>~/garlens/{fr ? "a-propos" : "about"}</span></div>
        <div className="corps">
          <h2 data-bloc>{h.about.heading}</h2>
          <p data-bloc>{h.about.p1}</p>
          <p data-bloc>{h.about.p2}</p>
          <div data-bloc className="tags"><span>Proxmox</span><span>Docker</span><span>OPNsense</span><span>Linux</span></div>
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

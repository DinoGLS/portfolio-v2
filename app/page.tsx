"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { SunIcon, MoonIcon, ArrowUpIcon, XMarkIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";
import ContactForm from "@/app/components/ContactForm";
import SocialSidebar from "@/app/components/SocialSidebar";
import { useLanguage, LANGS } from "@/app/providers/LanguageProvider";
import { homeStrings } from "@/app/lib/i18n";
import { useTheme } from "@/app/providers/ThemeProvider";

// ─── Données projets ─────────────────────────────────────────────────────────
const THEMES_DATA = [
  {
    id: "infra",
    labelFr: "Infrastructure & Réseaux",
    labelEn: "Infrastructure & Networks",
    color: "#3b82f6",
    projects: [
      {
        tag: "INFRA · ACTIVE DIRECTORY",
        tagEn: "INFRA · ACTIVE DIRECTORY",
        title: "Lab Active Directory sous Proxmox",
        titleEn: "Active Directory lab on Proxmox",
        desc: "Domaine AD complet — utilisateurs, GPO, DNS/DHCP sous Proxmox VE.",
        descEn: "Full AD domain — users, GPOs, DNS/DHCP on Proxmox VE.",
        stack: "Windows Server · Proxmox · DNS · DHCP · GPO",
        href: "/projects/ad-proxmox",
        preview: "/projects/ad-proxmox/ad_proxmox.png",
        badge: "Terminé",       badgeEn: "Done",        badgeColor: "emerald",
      },
      {
        tag: "SÉCURITÉ · RÉSEAUX · CISCO",
        tagEn: "SECURITY · NETWORKS · CISCO",
        title: "Simulation WAN — supervision & redondance Cisco",
        titleEn: "WAN Simulation — Cisco monitoring & redundancy",
        desc: "Réseau d'entreprise avec OSPF, HSRP, SNMP, VLANs et ACLs.",
        descEn: "Enterprise network with OSPF, HSRP, SNMP, VLANs and ACLs.",
        stack: "OSPF · HSRP · SNMP · VLAN · ACL · Cisco",
        href: "/projects/wan-simulation",
        preview: "/projects/wan-simulation/configwan.png",
        badge: "Terminé",       badgeEn: "Done",        badgeColor: "emerald",
      },
    ],
  },
  {
    id: "auto",
    labelFr: "Automatisation & Outils",
    labelEn: "Automation & Tools",
    color: "#10b981",
    projects: [
      {
        tag: "AUTOMATISATION · SCRIPTS",
        tagEn: "AUTOMATION · SCRIPTS",
        title: "USB Toolkit — Boîte à outils portable",
        titleEn: "USB Toolkit — Portable admin tools",
        desc: "Suite PowerShell/Python avec interface WPF sur clef USB.",
        descEn: "PowerShell/Python suite with WPF GUI on a USB key.",
        stack: "PowerShell · Python · Flask · Pandoc · Playwright",
        href: "/projects/automation-scripts",
        preview: "/projects/usb-toolkit/automat.png",
        badge: "Terminé",       badgeEn: "Done",        badgeColor: "emerald",
      },
    ],
  },
  {
    id: "ia",
    labelFr: "IA & DevOps",
    labelEn: "AI & DevOps",
    color: "#a855f7",
    projects: [
      {
        tag: "IA · DEVOPS · BTS SISR",
        tagEn: "AI · DEVOPS · BTS SISR",
        title: "DocForge — Générateur de livrables",
        titleEn: "DocForge — Document generator",
        desc: "Flask + Groq/Gemini + Pandoc + WeasyPrint déployé sur HP Server.",
        descEn: "Flask + Groq/Gemini + Pandoc + WeasyPrint on HP Server.",
        stack: "Python · Flask · Groq · Gemini · Docker · Linux",
        href: "/projects/docforge",
        preview: "/projects/wan-simulation/configwan.png",
        badge: "En production",  badgeEn: "Live",        badgeColor: "violet",
      },
    ],
  },
  {
    id: "dev",
    labelFr: "Dev & DevSecOps",
    labelEn: "Dev & DevSecOps",
    color: "#f59e0b",
    projects: [
      {
        tag: "DEV · DEVSECOPS",
        tagEn: "DEV · DEVSECOPS",
        title: "App Track Muscu — Suivi d'entraînement",
        titleEn: "Track Muscu App — Training tracker",
        desc: "Full-stack React/API REST. Support DevSecOps : auth JWT, Docker, CI/CD.",
        descEn: "Full-stack React/REST API. DevSecOps: JWT auth, Docker, CI/CD.",
        stack: "React · TypeScript · PostgreSQL · Docker · CI/CD",
        href: "/projects/app-track-muscu",
        preview: "/projects/usb-toolkit/automat.png",
        badge: "En cours",       badgeEn: "In progress", badgeColor: "amber",
      },
    ],
  },
];

const BADGE_STYLES: Record<string, string> = {
  emerald: "bg-emerald-500/15 text-blue-600 border-blue-500/30 dark:text-blue-300",
  violet:  "bg-violet-500/15 text-violet-600 border-violet-500/30 dark:text-violet-300",
  amber:   "bg-amber-500/15 text-amber-600 border-amber-500/30 dark:text-amber-300",
};

interface CyberItem {
  title: string; link: string; pubDate: string;
  source: string; sourceColor: string; tag: string;
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

// ─── Composant principal ─────────────────────────────────────────────────────
export default function Home() {
  const { lang, setLang } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const h = homeStrings[lang];

  const [activeSection, setActiveSection]   = useState<string>("");
  const [activeTheme, setActiveTheme]       = useState<string | null>(null);
  const [cyberItems, setCyberItems]         = useState<CyberItem[]>([]);
  const [cyberLoading, setCyberLoading]     = useState(true);
  const [showTop, setShowTop]               = useState(false);
  const isScrolling                         = useRef(false);
  const parcoursRef                         = useRef<HTMLDivElement>(null);
  const { scrollYProgress: parcoursProgress } = useScroll({
    target: parcoursRef,
    offset: ["start 85%", "end 30%"],
  });
  const [showContact, setShowContact]       = useState(false);
  const [isMobile, setIsMobile]             = useState(false);
  const contactTimer                        = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const NAV_LINKS = [
    { label: lang === "fr" ? "Accueil"  : "Home",     href: "#top" },
    { label: lang === "fr" ? "À propos" : "About",    href: "#about" },
    { label: lang === "fr" ? "Projets"  : "Projects", href: "#projects" },
    { label: lang === "fr" ? "Veille"   : "News",     href: "#veille" },
    { label: "Contact",                                 href: "#contact" },
  ];

  // ── Cyber news ────────────────────────────────────────────────────────────
  const fetchCyber = useCallback(async () => {
    try {
      const res = await fetch("/api/cyber-watch");
      if (!res.ok) return;
      const data = await res.json();
      setCyberItems((data.items as CyberItem[]).slice(0, 6));
    } catch { /* silencieux */ } finally { setCyberLoading(false); }
  }, []);

  useEffect(() => { fetchCyber(); }, [fetchCyber]);

  // ── Scroll actif — throttlé RAF (1 update / frame, pas 60+ setState/sec) ──
  useEffect(() => {
    let rafId: number | null = null;

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const scrollY = window.scrollY;
        setShowTop(scrollY > 100);
        if (isScrolling.current) return;
        const atBottom = window.innerHeight + scrollY >= document.body.scrollHeight - 10;
        if (atBottom) { setActiveSection("contact"); return; }
        const ids = NAV_LINKS.map((l) => l.href.replace("#", ""));
        let current = "";
        for (const id of ids) {
          const el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top <= 100) current = id;
        }
        if (current) setActiveSection(current);
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const id = href.replace("#", "");
    setActiveSection(id);
    isScrolling.current = true;
    const navbarHeight = id === "top" ? 0 : 72;
    const el = id === "top" ? null : document.getElementById(id);
    const target = id === "top" ? 0 : (el ? el.getBoundingClientRect().top + window.scrollY - navbarHeight : window.scrollY);
    window.scrollTo(0, target);
    requestAnimationFrame(() => { isScrolling.current = false; });
  };

  // Empêche le scroll de la page lorsque la popup Contact est ouverte.
  // On verrouille aussi `html` et on compense la largeur de la scrollbar
  // pour éviter le 'layout shift' quand elle disparaît.
  const contactScrollSave = useRef<{ bodyOverflow: string; htmlOverflow: string; bodyPaddingRight: string } | null>(null);
  useEffect(() => {
    if (typeof document === "undefined") return;
    const html = document.documentElement;
    const body = document.body;

    if (showContact) {
      // sauvegarde
      contactScrollSave.current = {
        bodyOverflow: body.style.overflow,
        htmlOverflow: html.style.overflow,
        bodyPaddingRight: body.style.paddingRight || "",
      };
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      body.style.overflow = "hidden";
      html.style.overflow = "hidden";
      if (scrollBarWidth > 0) body.style.paddingRight = `${scrollBarWidth}px`;
    } else {
      if (contactScrollSave.current) {
        body.style.overflow = contactScrollSave.current.bodyOverflow || "";
        html.style.overflow = contactScrollSave.current.htmlOverflow || "";
        body.style.paddingRight = contactScrollSave.current.bodyPaddingRight || "";
        contactScrollSave.current = null;
      } else {
        body.style.overflow = "";
        html.style.overflow = "";
        body.style.paddingRight = "";
      }
    }
    return () => {
      if (contactScrollSave.current) {
        body.style.overflow = contactScrollSave.current.bodyOverflow || "";
        html.style.overflow = contactScrollSave.current.htmlOverflow || "";
        body.style.paddingRight = contactScrollSave.current.bodyPaddingRight || "";
        contactScrollSave.current = null;
      } else {
        body.style.overflow = "";
        html.style.overflow = "";
        body.style.paddingRight = "";
      }
    };
  }, [showContact]);


  // ── Projets filtrés ───────────────────────────────────────────────────────
  const visibleProjects = activeTheme
    ? THEMES_DATA.find((t) => t.id === activeTheme)?.projects ?? []
    : THEMES_DATA.flatMap((t) => t.projects);

  // ── Palette « blueprint » de la section projets (clair = plan papier, sombre = plan cyanotype) ──
  const bp = isDark
    ? {
        // Bleu indigo profond aligné sur la palette sombre du site (#020617, accents #60a5fa/#818cf8)
        pageBg: "radial-gradient(120% 95% at 50% 0%, #17306e 0%, #0d1d4a 50%, #050b22 100%)",
        gridLine: "rgba(96,165,250,0.13)",
        text: "#e8efff", sub: "#a5bdf0", faint: "#5f7cc0",
        accent: "#60a5fa",
        titleGrad: "linear-gradient(90deg,#60a5fa,#818cf8)",
        cardBg: "rgba(13,25,58,0.45)", cardBorder: "rgba(129,140,248,0.30)",
        chipBg: "rgba(96,165,250,0.10)", chipText: "#c7d8fa", chipBorder: "rgba(96,165,250,0.28)",
      }
    : {
        pageBg: "radial-gradient(120% 95% at 50% 0%, #eef5ff 0%, #ddebfc 55%, #cfe1f7 100%)",
        gridLine: "rgba(29,78,216,0.11)",
        text: "#0f2b4a", sub: "#46628a", faint: "#8fadd2",
        accent: "#1d4ed8",
        titleGrad: "linear-gradient(90deg,#1e3a8a,#2563eb)",
        cardBg: "rgba(255,255,255,0.62)", cardBorder: "rgba(29,78,216,0.22)",
        chipBg: "rgba(29,78,216,0.07)", chipText: "#33517d", chipBorder: "rgba(29,78,216,0.20)",
      };

  // ── Rendu ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── NAVBAR — haut de page, style matrix, mobile + desktop ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 pt-4 flex justify-center">
        <div className="flex items-center justify-center md:justify-between w-full max-w-4xl px-3 md:px-5 py-2 rounded-full border backdrop-blur-md shadow-lg border-slate-200/70 bg-white/90 dark:border-blue-500/25 dark:bg-slate-900/90">
          {/* Brand */}
          <a
            href="#"
            onClick={(e) => scrollToSection(e, "#top")}
            className="hidden md:inline-flex font-mono text-sm font-bold text-blue-700 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors duration-200 select-none whitespace-nowrap"
          >
            <span className="text-blue-700/50 dark:text-blue-500/50 text-xs">{"<"}</span>Dino<span className="text-blue-700/50 dark:text-blue-500/50 text-xs">{"/>"}</span>
          </a>
          <div className="flex items-center gap-0.5 md:gap-1 overflow-x-auto no-scrollbar">
            {NAV_LINKS.map((link) => {
              const id = link.href.replace("#", "");
              const isActive = activeSection === id;
              const isContact = link.href === "#contact";
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onMouseEnter={() => {
                    if (isContact) {
                      if (contactTimer.current) clearTimeout(contactTimer.current);
                      setShowContact(true);
                    }
                  }}
                  onMouseLeave={() => {
                    if (isContact) {
                      contactTimer.current = setTimeout(() => setShowContact(false), 350);
                    }
                  }}
                  onClick={(e) => {
                    scrollToSection(e, link.href);
                  }}
                  className={`relative px-2 md:px-4 py-1.5 rounded-full text-xs md:text-sm font-mono tracking-wide transition-all duration-200 whitespace-nowrap
                    ${isActive || (isContact && showContact)
                      ? "text-blue-700 bg-blue-500/10 border border-blue-500/30 dark:text-blue-300"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 border border-transparent dark:text-slate-300 dark:hover:text-blue-300 dark:hover:bg-blue-500/10"
                    }`}
                >
                  {link.label}
                  {(isActive || (isContact && showContact)) && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-400"
                      style={{ boxShadow: "0 0 4px #60a5fa" }} />
                  )}
                </a>
              );
            })}
          </div>
        </div>
      </nav>
      {/* ── POPUP CONTACT (desktop) ── */}
      <AnimatePresence>
        {showContact && (
          <>
            <div className="hidden md:block fixed inset-0 z-30" onClick={() => setShowContact(false)} />
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 60 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              onMouseEnter={() => { if (contactTimer.current) clearTimeout(contactTimer.current); }}
              onMouseLeave={() => { contactTimer.current = setTimeout(() => setShowContact(false), 350); }}
              className="hidden md:block fixed right-14 top-1/2 -translate-y-1/2 z-40 w-[400px] max-h-[88vh] overflow-y-auto rounded-2xl border border-slate-200/60 dark:border-slate-700/60 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl p-6"
            >
              <button
                type="button"
                onClick={() => setShowContact(false)}
                aria-label="Fermer"
                className="absolute top-3 right-3 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
                {lang === "fr" ? "Me contacter" : "Get in touch"}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                {lang === "fr" ? "Stage · Alternance · Systèmes, réseaux & cybersécurité" : "Internship · Apprenticeship · Systems, networks & cybersecurity"}
              </p>
              <div className="flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400 mb-5">
                <a href="mailto:garlenscharles10@gmail.com" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">garlenscharles10@gmail.com</a>
                <a href="https://github.com/DinoGLS" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">GitHub</a>
                <a href="https://www.linkedin.com/in/garlens-charles-29a6b3351/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">LinkedIn</a>
              </div>
              <ContactForm />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── SIDEBAR RÉSEAUX SOCIAUX (desktop gauche) ── */}
      <SocialSidebar />



      <main id="top" className="relative">
      {/* ── CONTENU ── */}
      <div className="relative z-10">

        {/* ── HERO ── */}
        <section className="relative min-h-dvh flex flex-col items-center justify-center px-4 text-center overflow-hidden">
          {/* Backdrop animé d'entrée */}
          <motion.div
            className="absolute inset-0 -z-10 bg-gradient-radial from-blue-500/20 via-transparent to-transparent"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0.15, scale: 1.5 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            style={{ background: isDark ? "radial-gradient(ellipse at center, rgba(59, 130, 246, 0.15) 0%, transparent 70%)" : "radial-gradient(ellipse at center, rgba(29, 78, 216, 0.1) 0%, transparent 70%)" }}
          />
          
          {/* Glow subtil supplémentaire */}
          <motion.div
            className="absolute inset-0 -z-10 blur-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ duration: 2, ease: "easeOut", delay: 0.2 }}
            style={{ background: isDark ? "radial-gradient(ellipse at center, rgba(168, 85, 247, 0.08) 0%, transparent 60%)" : "radial-gradient(ellipse at center, rgba(168, 85, 247, 0.05) 0%, transparent 60%)" }}
          />

          <motion.div
            className="flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-700 text-xs font-medium tracking-wide dark:text-blue-400 backdrop-blur-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            {h.hero.available}
          </motion.div>

          <motion.h1
            className="text-[2.2rem] sm:text-[3rem] md:text-[4rem] lg:text-[4.5rem] font-extrabold bg-clip-text text-transparent mb-4"
            style={{ backgroundImage: isDark ? "linear-gradient(to right, #60a5fa, #818cf8)" : "linear-gradient(to right, #1d4ed8, #4338ca)" }}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
          >
            GARLENS&nbsp;CHARLES
          </motion.h1>

          <motion.p
            className="text-sm md:text-base tracking-[0.22em] text-slate-500 uppercase mb-8 dark:text-slate-300"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7, ease: "easeOut" }}
          >
            {h.hero.subtitle}
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-slate-600 max-w-xl mb-10 dark:text-slate-300"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.7, ease: "easeOut" }}
          >
            {h.hero.intro}
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center justify-center gap-3"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.7, ease: "easeOut" }}
          >
            <a
              href="/documents/CV_GarlensCharles-Apprenti.pdf"
              rel="noopener noreferrer" target="_blank"
              className="inline-flex items-center px-8 py-3 rounded-full border border-slate-300/70 bg-white/60 text-slate-700 font-semibold hover:border-blue-400 hover:text-blue-700 transition-all backdrop-blur-sm shadow-sm dark:border-slate-600/40 dark:bg-slate-800/50 dark:text-slate-200 dark:hover:border-blue-400 dark:hover:text-blue-300"
            >
              {h.hero.cv}
            </a>
            <Link
              href="/veille-cyber"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-red-400/30 bg-red-50/60 text-red-600 font-semibold hover:border-red-400 hover:bg-red-50 transition-all backdrop-blur-sm text-sm dark:text-red-300 dark:border-red-500/30 dark:bg-red-950/20"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              {lang === "fr" ? "Veille Cyber" : "Cyber News"}
            </Link>
          </motion.div>
        </section>

        {/* ── À PROPOS ── */}
        <section id="about" className="px-4 pb-16 mt-6">
          <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-[1.1fr_1.4fr]">
            <div className="rounded-2xl border border-white/60 bg-white/40 dark:bg-slate-900/40 dark:border-slate-700/50 p-6 md:p-7 md:backdrop-blur-md shadow-sm">
              <h2 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-3">{h.about.heading}</h2>
              <p className="text-sm md:text-[0.95rem] text-slate-700 dark:text-slate-300 leading-relaxed">{h.about.p1}</p>
              <p className="text-sm md:text-[0.95rem] text-slate-700 dark:text-slate-300 leading-relaxed mt-3">{h.about.p2}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {h.about.skills.map((block) => (
                <div key={block.title} className="border border-white/60 bg-white/40 dark:bg-slate-900/40 dark:border-slate-700/50 rounded-xl p-4 md:backdrop-blur-md shadow-sm">
                  <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-[0.16em]">{block.title}</h3>
                  <ul className="text-[0.85rem] text-slate-700 dark:text-slate-300 space-y-1.5">
                    {block.items.map((i) => <li key={i}>{i}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PARCOURS ── */}
        <section id="parcours" className="px-4 pb-16 mt-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 dark:text-slate-100 text-center mb-10">{h.parcours.heading}</h2>
            <div ref={parcoursRef} className="relative">
              <div className="absolute left-1/2 -translate-x-px w-px bg-slate-400/40 dark:bg-slate-600/30"
                   style={{ top: "55px", bottom: "55px" }} />
              <motion.div
                className="absolute left-1/2 -translate-x-px w-px bg-blue-400 origin-top"
                style={{
                  top: "55px",
                  scaleY: parcoursProgress,
                  height: "calc(100% - 110px)",
                  boxShadow: "0 0 8px #60a5fa, 0 0 20px #60a5fa",
                }}
              />
              {h.parcours.items.map((item, i) => {
                const isLeft = i % 2 === 0;
                return (
                  <motion.div
                    key={i}
                    className="relative grid grid-cols-2 gap-x-10 pb-10"
                    initial={{ opacity: 0, y: 30 }}
                    animate={isMobile ? { opacity: 1, y: 0 } : undefined}
                    whileInView={isMobile ? undefined : { opacity: 1, y: 0 }}
                    viewport={isMobile ? undefined : { once: true, amount: 0.45 }}
                    transition={{ duration: isMobile ? 0 : 0.55, ease: "easeOut" }}
                  >
                    <div
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-blue-400 border-2 border-[#edf1fc] dark:border-[#020617] z-10"
                      style={{ boxShadow: "0 0 6px #60a5fa, 0 0 14px #60a5fa" }}
                    />
                    <div className={isLeft ? "text-right pr-6 py-1" : ""}>
                      {isLeft && (
                        <>
                          <span className="font-mono text-xs text-blue-500 dark:text-blue-400 block mb-0.5">{item.year}</span>
                          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{item.title}</h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                        </>
                      )}
                    </div>
                    <div className={!isLeft ? "pl-6 py-1" : ""}>
                      {!isLeft && (
                        <>
                          <span className="font-mono text-xs text-blue-500 dark:text-blue-400 block mb-0.5">{item.year}</span>
                          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{item.title}</h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                        </>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── ZONE BLUEPRINT : Projets + Veille cyber ──
            Le fond plan technique apparaît en fondu par-dessus le canvas matrix,
            couvre les deux sections, puis le canvas reprend avant le contact. */}
        <div className="relative">
          {/* Fond dégradé blueprint, fondu d'entrée/sortie (px fixes : indépendant de la hauteur) */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background: bp.pageBg,
              // Entrée adoucie (courbe ease sur ~380px) pour un fondu progressif depuis le canvas
              maskImage: "linear-gradient(to bottom, transparent 0, rgba(0,0,0,0.12) 90px, rgba(0,0,0,0.45) 190px, rgba(0,0,0,0.8) 290px, black 380px, black calc(100% - 190px), transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0, rgba(0,0,0,0.12) 90px, rgba(0,0,0,0.45) 190px, rgba(0,0,0,0.8) 290px, black 380px, black calc(100% - 190px), transparent 100%)",
            }}
          />
          {/* Grille technique 30px, fondue un peu plus court que le dégradé */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(${bp.gridLine} 1px, transparent 1px), linear-gradient(90deg, ${bp.gridLine} 1px, transparent 1px)`,
              backgroundSize: "30px 30px",
              // La grille se dessine en second, après le dégradé — effet plan qui « s'imprime »
              maskImage: "linear-gradient(to bottom, transparent 140px, rgba(0,0,0,0.35) 320px, black 470px, black calc(100% - 260px), transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 140px, rgba(0,0,0,0.35) 320px, black 470px, black calc(100% - 260px), transparent 100%)",
            }}
          />

        <section id="projects" className="relative mt-16 pt-20 md:pt-24 px-4">
          <div className="relative max-w-6xl mx-auto">
            {/* Cartouche d'en-tête façon plan */}
            <div className="text-center max-w-xl mx-auto mb-7">
              <p className="font-mono text-[11px] tracking-[0.2em] font-medium mb-3" style={{ color: bp.accent }}>
                {lang === "fr" ? "// PROJETS — 04" : "// PROJECTS — 04"}
              </p>
              <h2
                className="text-3xl md:text-[2.5rem] font-bold tracking-tight inline-block bg-clip-text text-transparent mb-2.5"
                style={{ backgroundImage: bp.titleGrad }}
              >
                {lang === "fr" ? "Mes projets" : "My projects"}
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: bp.sub }}>
                {lang === "fr" ? "Sélectionne un thème pour filtrer, ou parcours l'ensemble des réalisations."
                               : "Select a theme to filter, or browse all projects."}
              </p>
            </div>

            {/* Chips de filtre — style blueprint (angles techniques, mono) */}
            <div className="flex flex-wrap justify-center gap-2.5 mb-8">
              <button
                onClick={() => setActiveTheme(null)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-[4px] font-mono text-xs font-semibold border transition-all backdrop-blur-sm"
                style={activeTheme === null
                  ? { background: `${bp.accent}22`, color: bp.accent, borderColor: bp.accent }
                  : { background: bp.chipBg, color: bp.sub, borderColor: bp.chipBorder }}
              >
                <span className="w-2 h-2 rounded-[2px] flex-shrink-0 inline-block" style={{ background: bp.accent }} />
                {lang === "fr" ? "Tous" : "All"}
                <span className="text-[0.68rem] rounded-[4px] px-1.5 py-0.5" style={{ background: bp.chipBg, color: bp.sub }}>
                  {THEMES_DATA.reduce((s, t) => s + t.projects.length, 0)}
                </span>
              </button>
              {THEMES_DATA.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setActiveTheme(activeTheme === theme.id ? null : theme.id)}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-[4px] font-mono text-xs font-semibold border transition-all backdrop-blur-sm"
                  style={activeTheme === theme.id
                    ? { background: `${theme.color}22`, color: isDark ? "#e8f4ff" : theme.color, borderColor: theme.color }
                    : { background: bp.chipBg, color: bp.sub, borderColor: bp.chipBorder }}
                >
                  <span className="w-2 h-2 rounded-[2px] flex-shrink-0 inline-block" style={{ background: theme.color }} />
                  {lang === "fr" ? theme.labelFr : theme.labelEn}
                  <span className="text-[0.68rem] rounded-[4px] px-1.5 py-0.5" style={{ background: bp.chipBg, color: bp.sub }}>
                    {theme.projects.length}
                  </span>
                </button>
              ))}
            </div>

            {/* Grille projets — cartes numérotées façon plan technique */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTheme ?? "all"}
                className="grid gap-5 md:grid-cols-3"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }}
              >
                {visibleProjects.map((p, idx) => (
                  <motion.div
                    key={p.href}
                    initial={{ opacity: 0, y: 24 }}
                    animate={isMobile ? { opacity: 1, y: 0 } : undefined}
                    whileInView={isMobile ? undefined : { opacity: 1, y: 0 }}
                    viewport={isMobile ? undefined : { once: true, amount: 0.15 }}
                    transition={{ duration: isMobile ? 0 : 0.45, delay: isMobile ? 0 : idx * 0.06 }}
                  >
                    <Link href={p.href} className="block h-full">
                      <article
                        className="group relative flex flex-col h-full overflow-hidden rounded-[5px] border backdrop-blur-[8px] transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                        style={{ background: bp.cardBg, borderColor: bp.cardBorder }}
                      >
                        {/* Numéro de plan */}
                        <span
                          className="absolute top-2 right-4 font-mono text-[40px] font-extrabold leading-none z-[2] pointer-events-none select-none"
                          style={{ color: bp.faint, opacity: 0.3 }}
                        >
                          {String(idx + 1).padStart(2, "0")}
                        </span>

                        <div className="relative overflow-hidden max-h-0 group-hover:max-h-40 transition-all duration-300" style={{ borderColor: bp.cardBorder }}>
                          <div className="relative w-full h-40">
                            <Image src={p.preview} alt={lang === "fr" ? p.title : p.titleEn} fill className="object-cover object-[50%_20%] transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" style={{ filter: "saturate(0.92) hue-rotate(-6deg)" }} />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <span className="absolute bottom-2 left-2 text-xs text-white">{lang === "fr" ? "Voir le projet" : "View project"}</span>
                        </div>

                        <div className="flex flex-col gap-2.5 p-4 pt-4 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-mono text-[0.65rem] font-medium tracking-[0.14em]" style={{ color: bp.accent }}>
                              {lang === "fr" ? p.tag : p.tagEn}
                            </p>
                            <span className={`ml-auto mr-7 px-2 py-0.5 text-[0.6rem] rounded-[4px] border font-medium flex-shrink-0 ${BADGE_STYLES[p.badgeColor]}`}>
                              {lang === "fr" ? p.badge : p.badgeEn}
                            </span>
                          </div>
                          <h3 className="text-base font-semibold leading-snug transition-colors" style={{ color: bp.text }}>
                            {lang === "fr" ? p.title : p.titleEn}
                          </h3>
                          <p className="text-[0.85rem] leading-relaxed" style={{ color: bp.sub }}>
                            {lang === "fr" ? p.desc : p.descEn}
                          </p>
                          <div className="flex flex-wrap gap-1.5 mt-auto pt-1.5">
                            {p.stack.split(" · ").map((s) => (
                              <span
                                key={s}
                                className="font-mono text-[0.65rem] px-2 py-0.5 rounded-[3px] border"
                                style={{ background: bp.chipBg, color: bp.chipText, borderColor: bp.chipBorder }}
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      </article>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* ── VEILLE CYBER — toujours dans la zone blueprint ── */}
        <section id="veille" className="relative px-4 pb-24 mt-16">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <div>
                <p className="font-mono text-[11px] tracking-[0.2em] font-medium mb-2" style={{ color: bp.accent }}>
                  {lang === "fr" ? "// VEILLE — 05" : "// NEWS — 05"}
                </p>
                <h2
                  className="text-2xl md:text-3xl font-bold tracking-tight inline-block bg-clip-text text-transparent"
                  style={{ backgroundImage: bp.titleGrad }}
                >
                  {lang === "fr" ? "Veille Cyber & IT" : "Cyber & IT News"}
                </h2>
                <p className="text-sm mt-1" style={{ color: bp.sub }}>
                  {lang === "fr" ? "CERT-FR · The Hacker News · BleepingComputer — mis à jour toutes les 30 min"
                                 : "CERT-FR · The Hacker News · BleepingComputer — updated every 30 min"}
                </p>
              </div>
              <Link href="/veille-cyber" className="inline-flex items-center gap-2 px-4 py-2 rounded-[4px] border font-mono text-sm text-red-500 border-red-400/40 bg-red-500/10 hover:bg-red-500/15 transition-all dark:text-red-300 backdrop-blur-sm">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-[2px] bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-[2px] h-1.5 w-1.5 bg-red-500" />
                </span>
                {lang === "fr" ? "Voir tout" : "See all"}
              </Link>
            </div>

            {cyberLoading ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="rounded-[5px] border p-4 animate-pulse backdrop-blur-[8px]" style={{ background: bp.cardBg, borderColor: bp.cardBorder }}>
                    <div className="h-3 rounded-[3px] w-16 mb-3" style={{ background: bp.chipBg }} />
                    <div className="h-4 rounded-[3px] w-full mb-1" style={{ background: bp.chipBg }} />
                    <div className="h-4 rounded-[3px] w-3/4" style={{ background: bp.chipBg }} />
                  </div>
                ))}
              </div>
            ) : cyberItems.length === 0 ? (
              <div className="text-center py-10 text-sm border rounded-[5px] backdrop-blur-sm" style={{ background: bp.cardBg, borderColor: bp.cardBorder, color: bp.sub }}>
                {lang === "fr" ? "Actualités indisponibles." : "News unavailable."}{" "}
                <Link href="/veille-cyber" className="hover:underline" style={{ color: bp.accent }}>Rafraîchir</Link>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {cyberItems.map((item, i) => (
                  <motion.a
                    key={`${item.link}-${i}`} href={item.link} target="_blank" rel="noopener noreferrer"
                    className="block rounded-[5px] border p-4 transition-all group backdrop-blur-[8px] hover:-translate-y-0.5 hover:shadow-md border-[color:var(--bp-border)] hover:border-[color:var(--bp-accent)]"
                    style={{ background: bp.cardBg, "--bp-border": bp.cardBorder, "--bp-accent": bp.accent, "--bp-text": bp.text } as React.CSSProperties}
                    initial={{ opacity: 0, y: 16 }} animate={isMobile ? { opacity: 1, y: 0 } : undefined} whileInView={isMobile ? undefined : { opacity: 1, y: 0 }}
                    viewport={isMobile ? undefined : { once: true, amount: 0.25 }} transition={{ duration: isMobile ? 0 : 0.4, delay: isMobile ? 0 : i * 0.07 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 font-mono text-xs font-medium rounded-[4px] border" style={{ color: item.sourceColor, borderColor: item.sourceColor + "40", background: item.sourceColor + "15" }}>
                        {item.tag}
                      </span>
                      {item.pubDate && <span className="font-mono text-xs ml-auto" style={{ color: bp.faint }}>{timeAgo(item.pubDate)}</span>}
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
        </div>{/* ── fin zone blueprint ── */}



        {/* ── CONTACT ── */}
        <section id="contact" className="px-4 pb-24 mt-20">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 mb-2">Contact</p>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                {lang === "fr" ? "Me contacter" : "Get in touch"}
              </h2>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-400">
                {lang === "fr"
                  ? "Ouvert aux opportunités de stage, alternance et projets en systèmes, réseaux et cybersécurité."
                  : "Open to internship, apprenticeship and project opportunities in systems, networks and cybersecurity."}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-sm text-slate-500 dark:text-slate-400">
                <a href="mailto:garlenscharles10@gmail.com" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">garlenscharles10@gmail.com</a>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <a href="https://github.com/DinoGLS" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">GitHub</a>
                <span className="text-slate-300 dark:text-slate-700">·</span>
                <a href="https://www.linkedin.com/in/garlens-charles-29a6b3351/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">LinkedIn</a>
              </div>
            </div>
            <ContactForm />
          </div>
        </section>
      </div>
      </main>

      {/* ── BOUTON RETOUR HAUT (hors <main> aussi) ── */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Retour en haut"
        className={`fixed bottom-6 right-6 z-50 p-3 rounded-full border backdrop-blur shadow-lg
          border-slate-300/60 bg-white/80 text-slate-600 hover:text-blue-600 hover:border-blue-400
          dark:border-slate-700/60 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:text-blue-300
          transition-all duration-300
          ${showTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
      >
        <ArrowUpIcon className="w-5 h-5" />
      </button>
    </>
  );
}

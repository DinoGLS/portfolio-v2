"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ArrowUpIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import ContactForm from "@/app/components/ContactForm";
import SocialSidebar from "@/app/components/SocialSidebar";
import AccueilScene from "@/app/components/AccueilScene";
import Reveal from "@/app/components/Reveal";
import ParcoursSection from "@/app/components/ParcoursSection";
import ProjectsExplorer from "@/app/components/ProjectsExplorer";
import CyberWatchSection from "@/app/components/CyberWatchSection";
import BlueprintZone from "@/app/components/BlueprintZone";
import LabsSpotlight from "@/app/components/LabsSpotlight";
import ApprentissageSection from "@/app/components/ApprentissageSection";
import CertificationsSection from "@/app/components/CertificationsSection";
import CvSection from "@/app/components/CvSection";
import InfraSection from "@/app/components/InfraSection";
import CompetencesSection from "@/app/components/CompetencesSection";
import SyntheseSection from "@/app/components/SyntheseSection";
import { SANS_SYNTHESE } from "@/app/lib/version";
import { useLanguage } from "@/app/providers/LanguageProvider";

// ─── Composant principal ─────────────────────────────────────────────────────
export default function Home() {
  const { lang } = useLanguage();

  const [activeSection, setActiveSection] = useState<string>("");
  const [showTop, setShowTop] = useState(false);
  const isScrolling = useRef(false);
  const [isMobile, setIsMobile] = useState(false);
  // La barre du haut reste cachée tant qu'on est sur l'accueil (le hero)
  const [navCachee, setNavCachee] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const NAV_LINKS = [
    { label: lang === "fr" ? "Accueil" : "Home", href: "#top" },
    { label: lang === "fr" ? "Parcours" : "Background", href: "#parcours" },
    { label: lang === "fr" ? "Apprentissage" : "Learning", href: "#apprentissage" },
    { label: lang === "fr" ? "Projets" : "Projects", href: "#projects" },
    { label: lang === "fr" ? "Compétences" : "Skills", href: "#competences" },
    { label: lang === "fr" ? "Synthèse" : "Summary", href: "#synthese" },
    { label: "Contact", href: "#contact" },
  ].filter((l) => !(SANS_SYNTHESE && l.href === "#synthese"));

  // ── Scroll actif — throttlé RAF ──────────────────────────────────────────
  useEffect(() => {
    let rafId: number | null = null;

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const scrollY = window.scrollY;
        setShowTop(scrollY > 100);
        const hero = document.getElementById("hero");
        setNavCachee(!!hero && hero.getBoundingClientRect().bottom > 160);
        if (isScrolling.current) return;
        const atBottom = window.innerHeight + scrollY >= document.body.scrollHeight - 10;
        if (atBottom) {
          setActiveSection("contact");
          return;
        }
        // Sections sans lien dans la barre : rattachées à la section dont elles font partie
        const RATTACHE: Record<string, string> = { cv: "apprentissage", certifications: "apprentissage", labs: "projects" };
        const ids = [...NAV_LINKS.map((l) => l.href.replace("#", "")), ...Object.keys(RATTACHE)];
        let current = "";
        let meilleur = -Infinity;
        for (const id of ids) {
          const el = document.getElementById(id);
          if (!el) continue;
          const top = el.getBoundingClientRect().top;
          if (top <= 100 && top > meilleur) { meilleur = top; current = RATTACHE[id] ?? id; }
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
    // « À propos » vit dans la scène épinglée de l'accueil : on vise la fin de la scène
    const scene = document.getElementById("hero");
    const dansScene = id === "about" && scene?.dataset.scene === "1";
    const target = dansScene
      ? scene!.getBoundingClientRect().top + window.scrollY
      : id === "top"
        ? 0
        : el
          ? el.getBoundingClientRect().top + window.scrollY - navbarHeight
          : window.scrollY;
    window.scrollTo(0, target);
    requestAnimationFrame(() => {
      isScrolling.current = false;
    });
  };

  // ── Rendu ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── NAVBAR ── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 px-4 md:px-8 pt-4 flex justify-center transition-transform duration-150 ${navCachee ? "-translate-y-24 pointer-events-none" : ""}`}
        aria-hidden={navCachee}
      >
        <div className="flex items-center justify-center md:justify-between w-full max-w-4xl px-3 md:px-5 py-2 rounded-full border backdrop-blur-md shadow-lg border-slate-200/70 bg-white/90 dark:border-blue-500/25 dark:bg-slate-900/90">
          {/* Brand */}
          <a
            href="#"
            onClick={(e) => scrollToSection(e, "#top")}
            className="hidden md:inline-flex font-mono text-sm font-bold text-blue-700 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors duration-200 select-none whitespace-nowrap"
          >
            <span className="text-blue-700/50 dark:text-blue-500/50 text-xs">{"<"}</span>Dino
            <span className="text-blue-700/50 dark:text-blue-500/50 text-xs">{"/>"}</span>
          </a>
          <div className="flex items-center gap-0.5 md:gap-1 overflow-x-auto no-scrollbar">
            {NAV_LINKS.map((link) => {
              const id = link.href.replace("#", "");
              const isActive = activeSection === id;
              // Pas de `transition` sur ces liens : le survol et le changement de
              // section actif doivent être instantanés, sans effet qui traîne.
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    if (!link.href.startsWith("/")) {
                      scrollToSection(e, link.href);
                    }
                  }}
                  className={`relative px-2 md:px-4 py-1.5 rounded-full text-xs md:text-sm font-mono tracking-wide whitespace-nowrap
                    ${
                      isActive
                        ? "text-blue-700 bg-blue-500/10 border border-blue-500/30 dark:text-blue-300"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 border border-transparent dark:text-slate-300 dark:hover:text-blue-300 dark:hover:bg-blue-500/10"
                    }`}
                >
                  {link.label}
                  {isActive && (
                    <span
                      className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-400"
                      style={{ boxShadow: "0 0 4px var(--glow-accent)" }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* ── SIDEBAR RÉSEAUX SOCIAUX ── */}
      <SocialSidebar />

      <main id="top" className="relative">
        <div className="relative z-10">
          {/* ── ACCUEIL : carte réseau + À propos dans une seule scène ── */}
          <AccueilScene isMobile={isMobile} onNavigate={scrollToSection} />
          <ParcoursSection isMobile={isMobile} />

          {/* ── APPRENTISSAGE : ce que j apprends, pourquoi, comment, où j en suis ── */}
          <ApprentissageSection />

          {/* ── MON CV ── */}
          <CvSection />

          {/* ── CERTIFICATIONS ── */}
          <CertificationsSection />

          {/* ── ZONE BLUEPRINT : Projets + Veille cyber + Infra ── */}
          <BlueprintZone>
            <LabsSpotlight />
            <ProjectsExplorer />
            <CyberWatchSection isMobile={isMobile} />
            <InfraSection isMobile={isMobile} />
          </BlueprintZone>

          {/* ── COMPÉTENCES ── */}
          <Reveal>
            <CompetencesSection />
          </Reveal>

          {/* ── TABLEAU DE SYNTHÈSE E5 ── */}
          {!SANS_SYNTHESE && <SyntheseSection />}

          {/* ── CONTACT ── */}
          <section id="contact" className="px-4 pb-24 mt-20">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-400 mb-2">
                  Contact
                </p>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                  {lang === "fr" ? "Me contacter" : "Get in touch"}
                </h2>
                <p className="text-sm md:text-base text-slate-600 dark:text-slate-400">
                  {lang === "fr"
                    ? "Ouvert aux opportunités de stage, alternance et projets en systèmes, réseaux et cybersécurité."
                    : "Open to internship, apprenticeship and project opportunities in systems, networks and cybersecurity."}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-sm text-slate-500 dark:text-slate-400">
                  <a
                    href="mailto:garlenscharles10@gmail.com"
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    garlenscharles10@gmail.com
                  </a>
                  <span className="text-slate-300 dark:text-slate-700">·</span>
                  <a
                    href="/documents/CV_Garlens_Charles.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {lang === "fr" ? "Mon CV (PDF)" : "My CV (PDF)"}
                  </a>
                  <span className="text-slate-300 dark:text-slate-700">·</span>
                  <a
                    href="https://github.com/DinoGLS"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    GitHub
                  </a>
                  <span className="text-slate-300 dark:text-slate-700">·</span>
                  <a
                    href="https://www.linkedin.com/in/garlens-charles-29a6b3351/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
              <ContactForm />
            </div>
          </section>
        </div>
      </main>

      {/* ── BOUTON RETOUR HAUT ── */}
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

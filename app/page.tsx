"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import ContactForm from "@/app/components/ContactForm";
import SocialSidebar from "@/app/components/SocialSidebar";
import HeroSection from "@/app/components/HeroSection";
import AboutSection from "@/app/components/AboutSection";
import ParcoursSection from "@/app/components/ParcoursSection";
import ProjectsSection from "@/app/components/ProjectsSection";
import CyberWatchSection from "@/app/components/CyberWatchSection";
import BlueprintZone from "@/app/components/BlueprintZone";
import InfraSection from "@/app/components/InfraSection";
import { useLanguage } from "@/app/providers/LanguageProvider";

// ─── Composant principal ─────────────────────────────────────────────────────
export default function Home() {
  const { lang } = useLanguage();

  const [activeSection, setActiveSection] = useState<string>("");
  const [showTop, setShowTop] = useState(false);
  const isScrolling = useRef(false);
  const [showContact, setShowContact] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const contactTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const NAV_LINKS = [
    { label: lang === "fr" ? "Accueil" : "Home", href: "#top" },
    { label: lang === "fr" ? "À propos" : "About", href: "#about" },
    { label: lang === "fr" ? "Projets" : "Projects", href: "#projects" },
    { label: lang === "fr" ? "Veille" : "News", href: "#veille" },
    { label: "Infra", href: "#infra" },
    { label: lang === "fr" ? "Compétences" : "Skills", href: "/competences" },
    { label: "Contact", href: "#contact" },
  ];

  // ── Scroll actif — throttlé RAF ──────────────────────────────────────────
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
        if (atBottom) {
          setActiveSection("contact");
          return;
        }
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
    const target =
      id === "top"
        ? 0
        : el
          ? el.getBoundingClientRect().top + window.scrollY - navbarHeight
          : window.scrollY;
    window.scrollTo(0, target);
    requestAnimationFrame(() => {
      isScrolling.current = false;
    });
  };

  // ── Scroll lock quand popup Contact ouverte ──────────────────────────────
  const contactScrollSave = useRef<{
    bodyOverflow: string;
    htmlOverflow: string;
    bodyPaddingRight: string;
  } | null>(null);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const html = document.documentElement;
    const body = document.body;

    if (showContact) {
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

  // ── Rendu ────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 pt-4 flex justify-center">
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
              const isContact = link.href === "#contact";
              return (
                <Link
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
                    if (!link.href.startsWith("/")) {
                      scrollToSection(e, link.href);
                    }
                  }}
                  className={`relative px-2 md:px-4 py-1.5 rounded-full text-xs md:text-sm font-mono tracking-wide transition-all duration-200 whitespace-nowrap
                    ${
                      isActive || (isContact && showContact)
                        ? "text-blue-700 bg-blue-500/10 border border-blue-500/30 dark:text-blue-300"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 border border-transparent dark:text-slate-300 dark:hover:text-blue-300 dark:hover:bg-blue-500/10"
                    } ${id === "/competences" || id === "contact" ? "hidden md:inline-flex" : ""}`}
                >
                  {link.label}
                  {(isActive || (isContact && showContact)) && (
                    <span
                      className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-400"
                      style={{ boxShadow: "0 0 4px #60a5fa" }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* ── POPUP CONTACT (desktop) ── */}
      <AnimatePresence>
        {showContact && (
          <>
            <div
              className="hidden md:block fixed inset-0 z-30"
              onClick={() => setShowContact(false)}
            />
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 60 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              onMouseEnter={() => {
                if (contactTimer.current) clearTimeout(contactTimer.current);
              }}
              onMouseLeave={() => {
                contactTimer.current = setTimeout(() => setShowContact(false), 350);
              }}
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
                {lang === "fr"
                  ? "Stage · Alternance · Systèmes, réseaux & cybersécurité"
                  : "Internship · Apprenticeship · Systems, networks & cybersecurity"}
              </p>
              <div className="flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400 mb-5">
                <a
                  href="mailto:garlenscharles10@gmail.com"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  garlenscharles10@gmail.com
                </a>
                <a
                  href="https://github.com/DinoGLS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/garlens-charles-29a6b3351/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  LinkedIn
                </a>
              </div>
              <ContactForm />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── SIDEBAR RÉSEAUX SOCIAUX ── */}
      <SocialSidebar />

      <main id="top" className="relative">
        <div className="relative z-10">
          <HeroSection />
          <AboutSection />
          <ParcoursSection isMobile={isMobile} />

          {/* ── ZONE BLUEPRINT : Projets + Veille cyber ── */}
          <BlueprintZone>
            <ProjectsSection isMobile={isMobile} />
            <CyberWatchSection isMobile={isMobile} />
            <InfraSection isMobile={isMobile} />
          </BlueprintZone>

          {/* ── CTA COMPÉTENCES ── */}
          <section className="px-4 py-20 relative">
            <div className="max-w-4xl mx-auto flex flex-col items-center justify-center text-center p-8 md:p-12 rounded-3xl border border-slate-200/60 dark:border-slate-700/60 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                {lang === "fr" ? "Compétences" : "Skills"}
              </h2>
              <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
                {lang === "fr" ? "Ce que mon homelab m'a appris → métiers visés" : "What my homelab taught me → target roles"}
              </p>
              <Link 
                href="/competences"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/25"
              >
                {lang === "fr" ? "Voir mes compétences" : "View my skills"}
              </Link>
            </div>
          </section>

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

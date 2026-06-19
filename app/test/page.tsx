"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { homeStrings } from "@/app/lib/i18n";
import ContactForm from "@/app/components/ContactForm";

// Sections (les libellés viennent de la traduction).
const NAV_IDS = ["top", "about", "parcours", "projects", "contact"] as const;

// Métadonnées des projets (non traduisibles) — alignées par index avec
// homeStrings[lang].projects.items.
const PROJECT_META = [
  { href: "/projects/ad-proxmox", preview: "/projects/ad-proxmox/preview.png", ready: false },
  { href: "/projects/automation-scripts", preview: "/projects/usb-toolkit/automat.png", ready: true },
  { href: "/projects/wan-simulation", preview: "/projects/wan-simulation/Configurationwan.png", ready: true },
  { href: "/projects/app-track-muscu", preview: "/projects/app-track-muscu/preview.png", ready: false },
];

const CV_FILE = "/documents/CV GarlensCharles-Apprenti Technicien réseau.pdf";

export default function Home() {
  const { lang } = useLanguage();
  const h = homeStrings[lang];

  const [activeSection, setActiveSection] = useState<string>("");
  const [showTop, setShowTop] = useState(false);
  const isScrolling = useRef(false);

  const navLinks = [
    { label: h.nav.home, href: "#top" },
    { label: h.nav.about, href: "#about" },
    { label: h.nav.parcours, href: "#parcours" },
    { label: h.nav.projects, href: "#projects" },
    { label: h.nav.contact, href: "#contact" },
  ];

  // ── Scroll spy + bouton retour haut ────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      setShowTop(window.scrollY > 300);
      if (isScrolling.current) return;

      const atBottom =
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 10;
      if (atBottom) {
        setActiveSection("contact");
        return;
      }

      let current = "";
      for (const id of NAV_IDS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 100) current = id;
      }
      if (current) setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (!el) return;

    setActiveSection(id);
    isScrolling.current = true;

    const navbarHeight = id === "top" ? 0 : 72;
    const start = window.scrollY;
    const target = id === "top" ? 0 : el.getBoundingClientRect().top + window.scrollY - navbarHeight;
    const delta = target - start;
    const duration = 700;
    let startTime: number | null = null;

    const easeInOutQuart = (t: number) =>
      t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, start + delta * easeInOutQuart(progress));
      if (progress < 1) requestAnimationFrame(step);
      else isScrolling.current = false;
    };
    requestAnimationFrame(step);
  };

  // ── TON effet Matrix — rendu identique, simplement OPTIMISÉ ────────────────
  //   • throttle ~30 FPS  • pause si l'onglet est masqué  • reduced-motion
  //   (couleurs, glyphes, opacité et blend volontairement INCHANGÉS)
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const chars = "01∆ΛΞΣΠΦΨΩ≡≠</>[]{}$#*@GARLENSCHARLESBIENVENUEDANSMONPORTFOLIO";
    let drops: number[] = [];
    let speeds: number[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const cols = Math.floor(canvas.width / 18) + 1;
      drops = Array(cols).fill(1);
      speeds = Array(cols).fill(0).map(() => Math.random() * 1.5 + 0.5);
    };

    const draw = () => {
      ctx.fillStyle = "rgba(15, 23, 42, 0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#94a3b8");
      gradient.addColorStop(1, "#334155");
      ctx.font = "14px monospace";

      drops.forEach((y, i) => {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.shadowColor = "#2c334b";
        ctx.shadowBlur = 6;
        ctx.fillStyle = "#e2e8f03b";
        ctx.fillText(text, i * 18, y * 18);
        ctx.fillStyle = gradient;
        ctx.shadowBlur = 0;
        if (y * 18 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        else drops[i] += speeds[i];
      });
    };

    resize();
    draw();
    const onResize = () => {
      resize();
      if (reduce) draw();
    };
    window.addEventListener("resize", onResize);

    if (reduce) {
      return () => window.removeEventListener("resize", onResize);
    }

    let animationId = 0;
    let last = 0;
    const interval = 1000 / 30;
    const loop = (now: number) => {
      animationId = requestAnimationFrame(loop);
      if (document.hidden) return;
      if (now - last < interval) return;
      last = now;
      draw();
      ctx.fillStyle = "rgba(10, 15, 25, 0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };
    animationId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <main id="top" className="relative min-h-screen overflow-x-hidden text-slate-900 dark:text-slate-200">

      {/* ── FOND FIXE (clair/sombre) ──────────────────────────────────────── */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-slate-100 dark:bg-slate-900" />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-white to-slate-200 opacity-90 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" />
        <div
          className="absolute inset-0 opacity-[0.05] dark:opacity-[0.06]"
          style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(100,116,139,0.5) 1px, transparent 1px),
              linear-gradient(180deg, rgba(100,116,139,0.5) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 opacity-10 dark:opacity-25 mix-blend-screen pointer-events-none will-change-transform"
        />
      </div>

      {/* ── NAVBAR ───────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
        <div className="flex items-center gap-1 px-4 py-2 rounded-full border border-slate-300/70 bg-white/80 backdrop-blur-md shadow-lg dark:border-slate-700/60 dark:bg-slate-900/70">
          {navLinks.map((link) => {
            const id = link.href.replace("#", "");
            const isActive = activeSection === id;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                  ${isActive
                    ? "text-blue-600 bg-slate-200/70 dark:text-blue-300 dark:bg-slate-700/60"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/60"}`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500 dark:bg-blue-400" />
                )}
              </a>
            );
          })}
        </div>
      </nav>

      {/* ── BOUTON RETOUR HAUT ───────────────────────────────────────────── */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label={lang === "fr" ? "Retour en haut" : "Back to top"}
        className={`fixed bottom-6 right-6 z-50 p-3 rounded-full border bg-white/80 text-slate-600 backdrop-blur shadow-lg transition-all duration-300
          border-slate-300/70 hover:text-blue-600 hover:border-blue-400
          dark:border-slate-700/60 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:text-blue-300
          ${showTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
      >
        <ArrowUpIcon className="w-5 h-5" />
      </button>

      {/* ── CONTENU ──────────────────────────────────────────────────────── */}
      <div className="relative z-20">

        {/* HERO */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
          <motion.div
            className="flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium tracking-wide"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            {h.hero.available}
          </motion.div>

          <motion.h1
            className="text-[2.2rem] sm:text-[3rem] md:text-[4rem] lg:text-[4.5rem] font-extrabold bg-clip-text text-transparent mb-4"
            style={{ backgroundImage: "linear-gradient(to right, #00209F, #525563)" }}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9 }}
          >
            GARLENS&nbsp;CHARLES
          </motion.h1>

          <motion.p
            className="text-sm md:text-base tracking-[0.28em] text-slate-600 dark:text-slate-300 uppercase mb-8"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            {h.hero.subtitle}
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-slate-600 dark:text-slate-300 max-w-xl mb-10"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
          >
            {h.hero.intro}
          </motion.p>

          <motion.a
            href={CV_FILE}
            rel="noopener noreferrer"
            target="_blank"
            className="inline-flex items-center space-x-3 px-8 py-3 rounded-full border bg-white/70 text-slate-700 font-semibold transition-all backdrop-blur border-slate-400/50 hover:border-blue-400 hover:text-blue-600 dark:bg-slate-800/60 dark:text-slate-200 dark:border-slate-500/40 dark:hover:text-blue-300"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.7 }}
          >
            <span>{h.hero.cv}</span>
          </motion.a>
        </section>

        {/* À PROPOS + COMPÉTENCES */}
        <motion.section
          id="about"
          className="relative mt-16 px-4 pb-12"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="max-w-6xl mx-auto grid gap-10 md:grid-cols-[1.1fr_1.4fr]">
            <div className="rounded-2xl border p-6 md:p-7 backdrop-blur border-slate-200 bg-white/70 dark:border-slate-700/60 dark:bg-slate-800/60">
              <h2 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-3">
                {h.about.heading}
              </h2>
              <p className="text-sm md:text-[0.95rem] text-slate-600 dark:text-slate-300 leading-relaxed">
                {h.about.p1}
              </p>
              <p className="text-sm md:text-[0.95rem] text-slate-600 dark:text-slate-300 leading-relaxed mt-3">
                {h.about.p2}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {h.about.skills.map((block) => (
                <div
                  key={block.title}
                  className="rounded-xl border p-4 backdrop-blur border-slate-200 bg-white/70 dark:border-slate-700/60 dark:bg-slate-800/60"
                >
                  <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-[0.16em]">
                    {block.title}
                  </h3>
                  <ul className="text-[0.85rem] text-slate-600 dark:text-slate-300 space-y-1.5">
                    {block.items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* PARCOURS */}
        <motion.section
          id="parcours"
          className="relative mt-24 px-4 pb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 dark:text-slate-100 text-center mb-10">
              {h.parcours.heading}
            </h2>
            <div className="relative border-l ml-4 space-y-10 border-slate-300 dark:border-slate-700/60">
              {h.parcours.items.map((item, i) => (
                <div key={i} className="relative pl-8">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-slate-100 dark:border-slate-900" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{item.year}</h3>
                  <p className="text-slate-700 dark:text-slate-300 font-medium">{item.title}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* PROJETS */}
        <motion.section
          id="projects"
          className="relative mt-20 px-4 pb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 dark:text-slate-100 text-center mb-3">
              {h.projects.heading}
            </h2>
            <p className="text-sm md:text-[0.95rem] text-slate-500 dark:text-slate-400 text-center mb-8 max-w-2xl mx-auto">
              {h.projects.subtitle}
            </p>

            <div className="grid gap-6 md:grid-cols-3">
              {h.projects.items.map((p, idx) => {
                const meta = PROJECT_META[idx];
                const Card = (
                  <article
                    className={`group relative rounded-xl p-4 border border-slate-200 bg-white/70 dark:border-slate-700/60 dark:bg-slate-800/60 ${
                      meta.ready === false
                        ? "opacity-60 cursor-not-allowed"
                        : "hover:shadow-lg hover:-translate-y-0.5 transition-all"
                    }`}
                  >
                    <div className="relative mb-3 overflow-hidden rounded-lg border border-slate-200 bg-slate-100/70 dark:border-slate-700/60 dark:bg-slate-900/70 max-h-0 group-hover:max-h-40 transition-all duration-300">
                      <div className="relative w-full h-40">
                        <Image
                          src={meta.preview}
                          alt={`${p.title} preview`}
                          fill
                          className={`object-cover object-[50%_20%] ${meta.ready ? "" : "grayscale opacity-70"}`}
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                      <span className="absolute bottom-2 left-2 text-xs text-slate-200 font-medium uppercase tracking-[0.12em] opacity-0 group-hover:opacity-100 transition-opacity">
                        {meta.ready === false ? h.projects.soon : h.projects.view}
                      </span>
                    </div>

                    <p className="text-[0.7rem] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-[0.18em] mb-2">
                      {p.tag}
                    </p>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-2">{p.title}</h3>
                    <p className="text-[0.85rem] text-slate-600 dark:text-slate-300 mb-3">{p.desc}</p>
                    <p className="text-[0.75rem] text-slate-500 dark:text-slate-400">{p.stack}</p>
                  </article>
                );

                if (meta.ready === false) {
                  return <div key={p.title} className="relative block">{Card}</div>;
                }
                return (
                  <Link key={p.title} href={meta.href} className="relative block">
                    {Card}
                  </Link>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* CONTACT — fiche contact intégrée */}
        <motion.section
          id="contact"
          className="relative mt-24 px-4 pb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                {h.contact.heading}
              </h2>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
                {h.contact.intro}
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-slate-600 dark:text-slate-300">
                <a href="mailto:garlenscharles10@gmail.com" className="hover:text-blue-600 dark:hover:text-blue-300 transition-colors">
                  garlenscharles10@gmail.com
                </a>
                <a href="https://github.com/DinoGLS" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-300 transition-colors">
                  GitHub
                </a>
                <a href="https://www.linkedin.com/in/garlens-charles-29a6b3351/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-300 transition-colors">
                  LinkedIn
                </a>
              </div>
            </div>

            <ContactForm />
          </div>
        </motion.section>
      </div>
    </main>
  );
}

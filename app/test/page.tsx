"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";

// ─── Navbar links ────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Accueil",   href: "#top"       },
  { label: "À propos",  href: "#about"    },
  { label: "Parcours",  href: "#parcours"  },
  { label: "Projets",   href: "#projects"  },
  { label: "Contact",   href: "#contact"   },
];

export default function Home() {
  const [openImage, setOpenImage] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>("");
  const [showTop, setShowTop] = useState(false);
  const isScrolling = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTop(window.scrollY > 300);


      // Ne pas mettre a jour la section active pendant un scroll programme (clic navbar)
      if (isScrolling.current) return;

      // Si on est en bas de page => contact actif quoi qu'il arrive
      const atBottom =
        window.innerHeight + window.scrollY >= document.body.scrollHeight - 10;
      if (atBottom) {
        setActiveSection("contact");
        return;
      }

      // Sinon : section dont le top est la plus proche du haut du viewport
      const ids = NAV_LINKS.map((l) => l.href.replace("#", ""));
      let current = "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 100) {
          current = id;
        }
      }
      if (current) setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // appel immediat pour initialiser l etat au chargement
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (!el) return;

    // Forcer immediatement la section cible comme active et bloquer la detection
    setActiveSection(id);
    isScrolling.current = true;

    const navbarHeight = id === "top" ? 0 : 72;
    const start    = window.scrollY;
    const target   = id === "top" ? 0 : el.getBoundingClientRect().top + window.scrollY - navbarHeight;
    const delta    = target - start;
    const duration = 700;
    let startTime: number | null = null;

    const easeInOutQuart = (t: number) =>
      t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed  = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, start + delta * easeInOutQuart(progress));
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        // Scroll termine : on relache la detection
        isScrolling.current = false;
      }
    };

    requestAnimationFrame(step);
  };

  const documents = [
    { label: "Curriculum Vitae",
      file: "/documents/CV GarlensCharles-Apprenti Technicien réseau.pdf" },
  ];

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const cols  = Math.floor(canvas.width / 18) + 1;
    const drops = Array(cols).fill(1);
    const speeds = Array(cols).fill(0).map(() => Math.random() * 1.5 + 0.5);
    const chars =
      "01∆ΛΞΣΠΦΨΩ≡≠</>[]{}$#*@GARLENSCHARLESBIENVENUEDANSMONPORTFOLIO";

    const draw = () => {
      ctx.fillStyle = "rgba(15, 23, 42, 0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#94a3b8");
      gradient.addColorStop(1, "#334155");

      ctx.fillStyle = gradient;
      ctx.font = "14px monospace";

      drops.forEach((y, i) => {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.shadowColor = "#2c334b";
        ctx.shadowBlur  = 6;
        const x    = i * 18;
        const yPos = y * 18;
        ctx.fillStyle = "#e2e8f03b";
        ctx.fillText(text, x, yPos);
        ctx.fillStyle = gradient;
        ctx.shadowBlur = 0;

        if (y * 18 > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        } else {
          drops[i] += speeds[i];
        }
      });
    };

    let animationId: number;
    const loop = () => {
      draw();
      ctx.fillStyle = "rgba(10, 15, 25, 0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      animationId = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <main id="top" className="relative min-h-screen overflow-x-hidden">

      {/* ── FIXED BACKGROUND ──────────────────────────────────────────────── */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-slate-900" />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 opacity-90" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(39,36,36,0.6) 1px, transparent 1px),
              linear-gradient(180deg, rgba(58,58,58,0.6) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 opacity-25 mix-blend-screen pointer-events-none will-change-transform"
        />
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          STICKY NAVBAR  (AJOUT)
      ══════════════════════════════════════════════════════════════════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
        <div className="flex items-center gap-1 px-4 py-2 rounded-full border border-slate-700/60 bg-slate-900/70 backdrop-blur-md shadow-lg">
          {NAV_LINKS.map((link) => {
            const id = link.href.replace("#", "");
            const isActive = activeSection === id;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200
                  ${isActive
                    ? "text-blue-300 bg-slate-700/60"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                  }`}
              >
                {link.label}
                {/* Active indicator dot */}
                {isActive && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-400" />
                )}
              </a>
            );
          })}
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════════════════════════
          BACK TO TOP BUTTON  (AJOUT)
      ══════════════════════════════════════════════════════════════════════ */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Retour en haut"
        className={`fixed bottom-6 right-6 z-50 p-3 rounded-full border border-slate-700/60 bg-slate-800/80 text-slate-300
          hover:text-blue-300 hover:border-blue-400 backdrop-blur shadow-lg
          transition-all duration-300
          ${showTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
      >
        <ArrowUpIcon className="w-5 h-5" />
      </button>

      {/* ── PAGE CONTENT ──────────────────────────────────────────────────── */}
      <div className="relative z-20">

        {/* HERO */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
          {/* Indicateur Open to Work */}
          <motion.div
            className="flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-medium tracking-wide"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Disponible — Stage / Alternance
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
            className="text-sm md:text-base tracking-[0.28em] text-slate-300 uppercase mb-8"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            Administration Systèmes & Réseaux · Cybersécurité · DevSecOps en formation
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-slate-300 max-w-xl mb-10"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
          >
            Je construis mes compétences en administration systèmes et réseaux, cybersécurité
            et environnements virtualisés, en combinant théorie et pratique à travers des
            projets personnels et académiques.
          </motion.p>

          <motion.a
            href={documents[0].file}
            rel="noopener noreferrer"
            target="blank"
            className="inline-flex items-center space-x-3 px-8 py-3 rounded-full border border-slate-500/40 bg-slate-800/60 text-slate-200 font-semibold hover:border-blue-400 hover:text-blue-300 transition-all backdrop-blur"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.7 }}
          >
            <span>Curriculum Vitae</span>
          </motion.a>
        </section>

        {/* A PROPOS + COMPETENCES — id ajouté */}
        <motion.section
          id="about"
          className="relative mt-16 px-4 pb-12"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="max-w-6xl mx-auto grid gap-10 md:grid-cols-[1.1fr_1.4fr]">
            <div className="bg-slate-800/60 rounded-2xl border border-slate-700/60 p-6 md:p-7 backdrop-blur">
              <h2 className="text-xl md:text-2xl font-semibold text-slate-100 mb-3">
                À propos de moi
              </h2>
              <p className="text-sm md:text-[0.95rem] text-slate-300 leading-relaxed">
                Étudiant en <span className="font-semibold">BTS SIO option SISR</span>,
                je me spécialise dans l'administration systèmes et réseaux, la
                cybersécurité et les environnements virtualisés.
              </p>
              <p className="text-sm md:text-[0.95rem] text-slate-300 leading-relaxed mt-3">
                Mon objectif est de devenir <span className="font-semibold">DevSecOps</span> en
                intégrant la sécurité dès la conception et le déploiement des environnements
                techniques, en combinant pratiques <span className="font-semibold">DevOps</span>,
                automatisation et bonnes pratiques de sécurité.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  title: "Systèmes",
                  items: [
                    "Windows Server (AD, DNS, DHCP, GPO)",
                    "Windows 10 / 11",
                    "Linux (Debian, Ubuntu, Kali)",
                    "Installation & maintenance",
                  ],
                },
                {
                  title: "Réseau & Virtualisation",
                  items: [
                    "VLAN, adressage IP, DNS, DHCP",
                    "Proxmox, VMware Workstation",
                    "Labs multi-VM",
                    "Supervision & journaux",
                  ],
                },
                {
                  title: "Sécurité & Automatisation",
                  items: [
                    "Hardening, pare-feu, GPO",
                    "Logs, alertes",
                    "Scripts d'automatisation",
                    "Bonnes pratiques SecOps",
                  ],
                },
              ].map((block) => (
                <div
                  key={block.title}
                  className="border border-slate-700/60 bg-slate-800/60 rounded-xl p-4 backdrop-blur"
                >
                  <h3 className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-[0.16em]">
                    {block.title}
                  </h3>
                  <ul className="text-[0.85rem] text-slate-300 space-y-1.5">
                    {block.items.map((i) => (
                      <li key={i}>{i}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* PARCOURS — id ajouté */}
        <motion.section
          id="parcours"
          className="relative mt-24 px-4 pb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-100 text-center mb-10">
              Mon parcours
            </h2>
            <div className="relative border-l border-slate-700/60 ml-4 space-y-10">
              {[
                {
                  year: "2024 - Aujourd'hui",
                  title: "BTS SIO option SISR",
                  desc: "Spécialisation en systèmes, réseaux, cybersécurité et environnements virtualisés. Construction de labs techniques (AD, Proxmox, Cisco, supervision, automatisation).",
                },
                {
                  year: "2023 - 2024",
                  title: "Cycle préparatoire international (école d'ingénieur)",
                  desc: "Renforcement des bases scientifiques, ouverture internationale, méthodologie d'ingénieur.",
                },
                {
                  year: "2021 - 2023",
                  title: "Sûreté aéroportuaire — Securitas",
                  desc: "Diplôme interne, responsabilités opérationnelles, gestion d'équipe, prise de décision en environnement critique.",
                },
                {
                  year: "2021",
                  title: "Bac Général",
                  desc: "Spécialités scientifiques, orientation vers l'informatique et les systèmes.",
                },
              ].map((item, i) => (
                <div key={i} className="relative pl-8">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-slate-900" />
                  <h3 className="text-lg font-semibold text-slate-100">{item.year}</h3>
                  <p className="text-slate-300 font-medium">{item.title}</p>
                  <p className="text-slate-400 text-sm mt-1 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* PROJETS — id existait déjà */}
        <motion.section
          id="projects"
          className="relative mt-20 px-4 pb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-100 text-center mb-3">
              Mes projets
            </h2>
            <p className="text-sm md:text-[0.95rem] text-slate-400 text-center mb-8 max-w-2xl mx-auto">
              Labs et projets illustrant mes compétences en systèmes, réseaux,
              automatisation et sécurité.
            </p>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  tag: "INFRA · ACTIVE DIRECTORY",
                  title: "Lab Active Directory sous Proxmox",
                  desc: "Domaine Active Directory complet avec utilisateurs, GPO et services réseau.",
                  stack: "Windows Server · Proxmox · DNS · DHCP · GPO",
                  href: "/projects/ad-proxmox",
                  preview: "/projects/ad-proxmox/preview.png",
                  ready: false,
                },
                {
                  tag: "AUTOMATISATION · SCRIPTS",
                  title: "Scripts d'automatisation systèmes",
                  desc: "Scripts PowerShell et Bash pour tâches d'administration récurrentes.",
                  stack: "PowerShell · Bash · Inventaire · Comptes",
                  href: "/projects/automation-scripts",
                  preview: "/projects/automation-scripts/preview.png",
                  ready: false,
                },
                {
                  tag: "SÉCURITÉ · RESEAUX",
                  title: "Simulation WAN avec supervision et redondance de routeurs (CISCO)",
                  desc: "Mise en place d'un réseau d'entreprise orienté disponibilité, observabilité réseau et continuité de service.",
                  stack: "Logs · Routing · Reseau Entreprise · Supervision",
                  href: "/projects/wan-simulation",
                  preview: "/projects/wan-simulation/Configurationwan.png",
                  ready: true,
                },
                {
                  tag: "DEV · GESTION DE PROJETS (en cours)",
                  title: "App Track Muscu - application de suivi d'entraînement et de performance.",
                  desc: "Création d'une application de suivi d'entraînement et de performance avec React. Le projet sert de support pour l'expérimentation, sécurisation des accès et deploiement automatisé",
                  stack: "Base données · API · Authentification · Déploiement",
                  href: "/projects/app-track-muscu",
                  preview: "/projects/app-track-muscu/preview.png",
                  ready: false,
                },
              ].map((p) => {
                const Card = (
                  <article
                    className={`group relative border border-slate-700/60 bg-slate-800/60 rounded-xl p-4 ${
                      p.ready === false
                        ? "opacity-60 cursor-not-allowed"
                        : "hover:shadow-lg hover:translate-y-0.5 transition-all"
                    }`}
                  >
                    <div className="relative mb-3 overflow-hidden rounded-lg border border-slate-700/60 bg-slate-900/70 max-h-0 group-hover:max-h-40 transition-all duration-300">
                      <div className="relative w-full h-40">
                        <Image
                          src={p.preview}
                          alt={`${p.title} preview`}
                          fill
                          className={`object-cover object-[50%_20%] ${p.ready ? "" : "grayscale opacity-70"}`}
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                      <span className="absolute bottom-2 left-2 text-xs text-slate-300 font-harded uppercase tracking-[0.12em] opacity-0 group-hover:opacity-100 transition-opacity">
                        {p.ready === false ? "Bientôt disponible" : "Cliquez pour voir le projet"}
                      </span>
                    </div>

                    <p className="text-[0.7rem] font-medium text-slate-400 uppercase tracking-[0.18em] mb-2">
                      {p.tag}
                    </p>
                    <h3 className="text-base font-semibold text-slate-100 mb-2">{p.title}</h3>
                    <p className="text-[0.85rem] text-slate-300 mb-3">{p.desc}</p>
                    <p className="text-[0.75rem] text-slate-400">{p.stack}</p>
                  </article>
                );

                if (p.ready === false) {
                  return (
                    <div key={p.title} className="relative block">
                      {Card}
                    </div>
                  );
                }
                return (
                  <Link key={p.title} href={p.href} className="relative block">
                    {Card}
                  </Link>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* CONTACT — id ajouté */}
        <motion.section
          id="contact"
          className="relative mt-24 px-4 pb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="max-w-3xl mx-auto text-center bg-slate-800/60 rounded-2xl border border-slate-700/60 p-6 backdrop-blur">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mb-4">
              Me contacter
            </h2>
            <p className="text-sm md:text-base text-slate-300 mb-6">
              Ouvert aux opportunités de stage, alternance et projets en systèmes,
              réseaux et cybersécurité.
            </p>
            <div className="flex flex-col items-center gap-3 text-sm md:text-base text-slate-200">
              <a href="mailto:garlenscharles10@gmail.com" className="hover:text-blue-300 transition-colors">
                garlenscharles10@gmail.com
              </a>
              <a href="https://github.com/DinoGLS" target="_blank" className="hover:text-blue-300 transition-colors" rel="noopener noreferrer">
                GitHub
              </a>
              <a href="https://www.linkedin.com/in/garlens-charles-29a6b3351/" target="_blank" className="hover:text-blue-300 transition-colors" rel="noopener noreferrer">
                LinkedIn
              </a>
            </div>
          </div>
        </motion.section>

      </div>
    </main>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowDownIcon } from "@heroicons/react/24/outline";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Matrix cyber violet
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const cols = Math.floor(canvas.width / 18) + 1;
    const drops = Array(cols).fill(1);
    const chars =
      "01∆ΛΞΣΠΦΨΩ≡≠</>[]{}$#*@ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    const draw = () => {
      ctx.fillStyle = "rgba(2, 6, 23, 0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "#7c3aed");
      gradient.addColorStop(1, "#38bdf8");
      ctx.fillStyle = gradient;
      ctx.font = "14px monospace";

      drops.forEach((y, i) => {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * 18, y * 18);

        if (y * 18 > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        } else {
          drops[i]++;
        }
      });
    };

    const interval = setInterval(draw, 40);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      {/* Matrix global, fixe */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 pointer-events-none"
      />

      {/* Overlay sombre pour lisibilité */}
      <div className="fixed inset-0 z-10 bg-gradient-to-br from-slate-900/80 via-slate-950/90 to-black/95" />

      {/* Tout le contenu qui scroll */}
      <div className="relative z-20">
        {/* HERO */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
          <motion.h1
            className="cyber-title text-[2.5rem] md:text-[4rem] lg:text-[4.5rem] font-extrabold bg-clip-text text-transparent mb-4"
            style={{
              backgroundImage:
                "linear-gradient(to right, #00209F, #D21034)", // Haïti
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
          >
            CHARLES&nbsp;GARLENS
          </motion.h1>

          <motion.p
            className="cyber-subtitle text-sm md:text-base tracking-[0.25em] text-slate-300 uppercase mb-8"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            APPRENTI DEVSECOPS · TECHNICIEN SUPPORT INFORMATIQUE
          </motion.p>

          <motion.p
            className="text-sm md:text-base text-slate-300 max-w-xl mb-10"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            Je conçois et sécurise des environnements systèmes et réseaux en
            combinant pratiques DevOps, cybersécurité et support.
          </motion.p>

          <motion.a
            href="#projects"
            className="btn-cyber inline-flex items-center space-x-3 px-8 py-3 rounded-full border border-slate-500/70 bg-slate-900/70 text-slate-100 font-semibold hover:border-violet-400 hover:text-violet-200 transition-all"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
          >
            <span>Découvrir mes projets</span>
            <ArrowDownIcon className="w-5 h-5" />
          </motion.a>
        </section>

        {/* À PROPOS */}
        <section className="relative z-20 mt-24 px-4 pb-8">
          <div className="max-w-3xl mx-auto text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mb-4">
              À propos de moi
            </h2>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              Je suis étudiant en <span className="font-semibold">BTS SIO option SISR</span>,
              passionné par l&apos;administration systèmes et réseaux, la
              cybersécurité et les labs virtualisés.
            </p>
            <p className="text-sm md:text-base text-slate-300 leading-relaxed mt-3">
              Mon objectif est de devenir <span className="font-semibold">DevSecOps</span> :
              automatiser, sécuriser et superviser les systèmes tout en restant
              proche des utilisateurs.
            </p>
          </div>
        </section>

        {/* COMPÉTENCES */}
        <section className="relative z-20 mt-12 px-4 pb-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-100 text-center mb-8">
              Compétences
            </h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Systèmes */}
              <div className="border border-slate-700/60 bg-slate-900/60 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-slate-100 mb-2 uppercase tracking-[0.18em]">
                  Systèmes
                </h3>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>Windows Server (AD, DNS, DHCP, GPO)</li>
                  <li>Windows 10 / 11</li>
                  <li>Linux (Debian, Ubuntu, Kali)</li>
                  <li>Installation, maintenance, sauvegardes</li>
                </ul>
              </div>

              {/* Réseau & Virtualisation */}
              <div className="border border-slate-700/60 bg-slate-900/60 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-slate-100 mb-2 uppercase tracking-[0.18em]">
                  Réseau & Virtualisation
                </h3>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>VLAN, adressage IP, DHCP, DNS</li>
                  <li>Proxmox, VMware Workstation</li>
                  <li>Labs virtualisés multi-VM</li>
                  <li>Supervision et journaux de base</li>
                </ul>
              </div>

              {/* Sécurité & Automation */}
              <div className="border border-slate-700/60 bg-slate-900/60 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-slate-100 mb-2 uppercase tracking-[0.18em]">
                  Sécurité & Automation
                </h3>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>Bonnes pratiques de durcissement</li>
                  <li>Scripts PowerShell & Bash</li>
                  <li>Gestion des comptes & droits</li>
                  <li>Veille cybersécurité</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* PROJETS */}
        <section
          id="projects"
          className="min-h-[60vh] w-full relative z-20 mt-24 px-4 pb-16"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-slate-100 text-center mb-10">
            Mes projets
          </h2>

          <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-2">
            {/* Projet 1 */}
            <div className="border border-slate-700/60 bg-slate-900/60 rounded-xl p-5 shadow-lg shadow-black/40 hover:border-violet-400/80 transition-all">
              <h3 className="text-lg font-semibold text-slate-50 mb-2">
                Lab Active Directory sous Proxmox
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                Mise en place d&apos;un domaine Active Directory complet dans un
                environnement virtualisé pour m&apos;entraîner à
                l&apos;administration systèmes et réseau.
              </p>
              <p className="text-xs text-slate-400 mb-3">
                Windows Server, Proxmox, DNS, DHCP, GPO, OU, comptes utilisateurs.
              </p>
            </div>

            {/* Projet 2 */}
            <div className="border border-slate-700/60 bg-slate-900/60 rounded-xl p-5 shadow-lg shadow-black/40 hover:border-violet-400/80 transition-all">
              <h3 className="text-lg font-semibold text-slate-50 mb-2">
                Scripts d&apos;automatisation systèmes
              </h3>
              <p className="text-sm text-slate-300 mb-3">
                Scripts PowerShell et Bash pour automatiser des tâches de
                déploiement, de création d&apos;utilisateurs et de collecte d&apos;infos.
              </p>
              <p className="text-xs text-slate-400 mb-3">
                PowerShell, Bash, gestion utilisateurs, inventaire, maintenance.
              </p>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section className="relative z-20 mt-24 px-4 pb-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mb-4">
              Me contacter
            </h2>
            <p className="text-sm md:text-base text-slate-300 mb-6">
              Ouvert aux opportunités de stage, alternance et projets en systèmes,
              réseaux et cybersécurité.
            </p>

            <div className="flex flex-col items-center gap-3 text-sm md:text-base text-slate-200">
              <a
                href="mailto:ton.email@exemple.com"
                className="hover:text-violet-300 transition-colors"
              >
                ton.email@exemple.com
              </a>
              <a
                href="https://github.com/ton-github"
                target="_blank"
                className="hover:text-violet-300 transition-colors"
              >
                GitHub · ton-github
              </a>
              <a
                href="https://www.linkedin.com/in/ton-linkedin"
                target="_blank"
                className="hover:text-violet-300 transition-colors"
              >
                LinkedIn · ton-linkedin
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

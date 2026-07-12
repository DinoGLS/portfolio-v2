"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { useTheme } from "@/app/providers/ThemeProvider";
import { useBlueprintTokens } from "@/app/data/blueprint-tokens";
import RackPopup from "@/app/components/RackPopup";

// ─── Données infra ──────────────────────────────────────────────────────────

interface ServerSpec {
  label: string;
  value: string;
}

interface Service {
  name: string;
  desc: string;
  descEn: string;
  port: string;
  status: "up" | "migrating" | "planned";
  icon: string;
  stack: string;
}

interface Server {
  id: string;
  name: string;
  codename: string;
  role: string;
  roleEn: string;
  color: string;
  statusColor: string;
  status: string;
  statusEn: string;
  specs: ServerSpec[];
  services: Service[];
}

const SERVERS: Server[] = [
  {
    id: "hp",
    name: "Serveur HP (gls)",
    codename: "gls",
    role: "Serveur legacy — production & CI/CD",
    roleEn: "Legacy server — production & CI/CD",
    color: "#3b82f6",
    statusColor: "#10b981",
    status: "En ligne",
    statusEn: "Online",
    specs: [
      { label: "CPU", value: "Intel i3-7020U @ 2.30GHz" },
      { label: "RAM", value: "3.7 Go DDR4" },
      { label: "Stockage", value: "453 Go SSD" },
      { label: "OS", value: "Debian 13 (Trixie)" },
      { label: "Réseau", value: "Tailscale + LAN" },
    ],
    services: [
      { name: "Portfolio", desc: "Ce site — Next.js 16 / Turbopack", descEn: "This site — Next.js 16 / Turbopack", port: "3001", status: "up", icon: "🌐", stack: "Next.js · Docker" },
      { name: "Gitea", desc: "Forge Git auto-hébergée + CI runner", descEn: "Self-hosted Git forge + CI runner", port: "3000", status: "up", icon: "📦", stack: "Gitea · act_runner" },
      { name: "DocForge", desc: "Générateur de livrables BTS via IA", descEn: "BTS deliverables generator with AI", port: "5000", status: "up", icon: "📄", stack: "Flask · Groq · Pandoc" },
      { name: "Générateur CV", desc: "Création de CV assistée par IA", descEn: "AI-assisted CV builder", port: "8080", status: "up", icon: "📝", stack: "Node.js · Groq API" },
      { name: "Nginx Proxy Manager", desc: "Reverse proxy + certificats SSL", descEn: "Reverse proxy + SSL certificates", port: "80/443", status: "up", icon: "🔀", stack: "NPM · Let's Encrypt" },
      { name: "Portainer", desc: "Dashboard de gestion Docker", descEn: "Docker management dashboard", port: "9000", status: "up", icon: "🐳", stack: "Portainer CE" },
      { name: "Hub Dashboard", desc: "Tableau de bord de monitoring", descEn: "Monitoring dashboard", port: "7777", status: "up", icon: "📊", stack: "Node.js" },
      { name: "HP Bot", desc: "Bot Telegram de supervision serveur", descEn: "Server monitoring Telegram bot", port: "—", status: "up", icon: "🤖", stack: "Python · Telegram" },
    ],
  },
  {
    id: "dino",
    name: "HP 705 G5",
    codename: "dino",
    role: "Nouveau serveur — hyperviseur & lab réseau",
    roleEn: "New server — hypervisor & network lab",
    color: "#a855f7",
    statusColor: "#f59e0b",
    status: "Migration en cours",
    statusEn: "Migration in progress",
    specs: [
      { label: "CPU", value: "AMD Ryzen 7 PRO 3700 (8c/16t)" },
      { label: "GPU", value: "AMD Radeon 540/550 (4 Go VRAM)" },
      { label: "RAM", value: "16 Go" },
      { label: "Stockage", value: "500 Go NVMe" },
      { label: "OS", value: "Proxmox VE 9.2" },
      { label: "Réseau", value: "Tailscale + lab segmenté (LAN/AD/DMZ)" },
    ],
    services: [
      { name: "OPNsense", desc: "Firewall/routeur du lab Draken", descEn: "Draken lab firewall/router", port: "VM 101", status: "up", icon: "🛡️", stack: "FreeBSD · OPNsense" },
      { name: "draken-admin", desc: "Bastion IaC — Terraform & Ansible", descEn: "IaC bastion — Terraform & Ansible", port: "CT 102", status: "up", icon: "⚙️", stack: "Terraform · Ansible" },
      { name: "Edge (reverse proxy)", desc: "Reverse proxy + tunnel Cloudflare", descEn: "Reverse proxy + Cloudflare tunnel", port: "LXC 110", status: "planned", icon: "🌍", stack: "Caddy · cloudflared" },
      { name: "DNS (Pi-hole)", desc: "Résolution DNS locale *.gls / *.home", descEn: "Local DNS *.gls / *.home", port: "LXC 111", status: "planned", icon: "🔎", stack: "Pi-hole" },
      { name: "Git (Gitea)", desc: "Migration de la forge Git", descEn: "Git forge migration", port: "LXC 112", status: "planned", icon: "📦", stack: "Gitea" },
      { name: "DB (PostgreSQL)", desc: "Base de données centralisée", descEn: "Centralized database", port: "LXC 113", status: "planned", icon: "🗄️", stack: "PostgreSQL 16" },
      { name: "Apps (Docker)", desc: "Tous les services HP migrés", descEn: "All HP services migrated", port: "VM 120", status: "planned", icon: "🐳", stack: "Docker · Compose" },
      { name: "IA (Ollama)", desc: "LLM local pour automatisations", descEn: "Local LLM for automations", port: "LXC 130", status: "planned", icon: "🧠", stack: "Ollama · Open WebUI" },
      { name: "Lab AD (Windows)", desc: "Domaine Active Directory isolé", descEn: "Isolated Active Directory domain", port: "vmbr2", status: "planned", icon: "🪟", stack: "Windows Server 2022" },
      { name: "DMZ", desc: "Réseau isolé — cibles exposées", descEn: "Isolated network — exposed targets", port: "vmbr3", status: "planned", icon: "🎯", stack: "Réseau isolé" },
    ],
  },
];

const STATUS_LABELS = {
  up: { fr: "Actif", en: "Active", color: "#10b981" },
  migrating: { fr: "Migration", en: "Migrating", color: "#f59e0b" },
  planned: { fr: "Planifié", en: "Planned", color: "#6b7280" },
};

// ─── Hook animation terminal ────────────────────────────────────────────────

function useTerminalLines(server: Server, lang: "fr" | "en") {
  const [lines, setLines] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const prevId = useRef<string>("");

  useEffect(() => {
    // Reset when server changes
    if (prevId.current === server.id && done) return;
    prevId.current = server.id;
    setLines([]);
    setDone(false);

    const allLines = [
      `$ ssh ${server.codename}@${server.id === "hp" ? "10.0.0.10" : "10.0.0.1"}`,
      `Welcome to ${server.name}`,
      ``,
      `$ neofetch --short`,
      `  OS      : ${server.specs.find((s) => s.label === "OS")?.value}`,
      `  CPU     : ${server.specs.find((s) => s.label === "CPU")?.value}`,
      `  RAM     : ${server.specs.find((s) => s.label === "RAM")?.value}`,
      `  Disk    : ${server.specs.find((s) => s.label === "Stockage")?.value}`,
      `  Network : ${server.specs.find((s) => s.label === "Réseau")?.value}`,
      ``,
      server.id === "hp" ? `$ docker ps --format "{{.Names}} ({{.Status}})"` : `$ qm list && pct list`,
      ...server.services
        .filter((s) => s.status === "up")
        .map((s) => `  ✓ ${s.name.padEnd(22)} ${s.port.padEnd(10)} ${s.stack}`),
      ...(server.services.some((s) => s.status === "planned")
        ? [
            ``,
            `$ cat /etc/plan.d/pending.conf`,
            ...server.services
              .filter((s) => s.status === "planned")
              .map((s) => `  ○ ${s.name.padEnd(22)} ${s.port.padEnd(10)} ${lang === "fr" ? "planifié" : "planned"}`),
          ]
        : []),
      ``,
      `${server.codename}@${server.id} ~ $  █`,
    ];

    let i = 0;
    const timer = setInterval(() => {
      if (i < allLines.length) {
        const currentLine = allLines[i];
        setLines((prev) => [...prev, currentLine]);
        i++;
      } else {
        clearInterval(timer);
        setDone(true);
      }
    }, 65);

    return () => clearInterval(timer);
  }, [server, lang, done]);

  return { lines, done };
}

// ─── Composant ──────────────────────────────────────────────────────────────

interface InfraSectionProps {
  isMobile: boolean;
}

export default function InfraSection({ isMobile }: InfraSectionProps) {
  const { lang } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const bp = useBlueprintTokens(isDark);
  const [activeServer, setActiveServer] = useState<string>("hp");
  const termRef = useRef<HTMLDivElement>(null);

  const server = SERVERS.find((s) => s.id === activeServer)!;
  const { lines } = useTerminalLines(server, lang as "fr" | "en");

  // Auto-scroll terminal
  useEffect(() => {
    if (termRef.current) {
      termRef.current.scrollTop = termRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <section id="infra" className="relative px-4 pb-24 mt-16">
      <div className="max-w-6xl mx-auto">
        {/* En-tête */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <p
            className="font-mono text-[11px] tracking-[0.2em] font-medium mb-3"
            style={{ color: bp.accent }}
          >
            {lang === "fr" ? "// INFRASTRUCTURE — 06" : "// INFRASTRUCTURE — 06"}
          </p>
          <h2
            className="text-3xl md:text-[2.5rem] font-bold tracking-tight inline-block bg-clip-text text-transparent mb-2.5"
            style={{ backgroundImage: bp.titleGrad }}
          >
            {lang === "fr" ? "Mon homelab" : "My homelab"}
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: bp.sub }}>
            {lang === "fr"
              ? "Deux serveurs, une migration en cours — de l'ancien HP vers Proxmox."
              : "Two servers, one ongoing migration — from legacy HP to Proxmox."}
          </p>
          <div className="mt-4 flex justify-center">
            <RackPopup lang={lang as "fr" | "en"} />
          </div>
        </div>

        {/* Sélecteur de serveur */}
        <div className="flex justify-center gap-3 mb-8">
          {SERVERS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveServer(s.id)}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-[5px] border font-mono text-xs font-semibold transition-all backdrop-blur-sm"
              style={
                activeServer === s.id
                  ? { background: `${s.color}18`, color: isDark ? "#e8f4ff" : s.color, borderColor: s.color }
                  : { background: bp.chipBg, color: bp.sub, borderColor: bp.chipBorder }
              }
            >
              <span className="relative flex h-2 w-2">
                <span
                  className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${activeServer === s.id ? "animate-ping" : ""}`}
                  style={{ background: s.statusColor }}
                />
                <span
                  className="relative inline-flex rounded-full h-2 w-2"
                  style={{ background: s.statusColor }}
                />
              </span>
              <span>{s.codename}</span>
              <span
                className="text-[0.65rem] px-1.5 py-0.5 rounded-[3px]"
                style={{ background: bp.chipBg, color: bp.faint }}
              >
                {lang === "fr" ? s.status : s.statusEn}
              </span>
            </button>
          ))}
        </div>

        {/* Contenu du serveur sélectionné */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeServer}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28 }}
          >
            {/* ── Terminal animé ── */}
            <div
              className="rounded-[6px] border overflow-hidden mb-6"
              style={{ borderColor: bp.cardBorder }}
            >
              {/* Barre de titre du terminal */}
              <div
                className="flex items-center gap-2 px-4 py-2.5 border-b"
                style={{
                  background: isDark ? "rgba(10,15,30,0.9)" : "rgba(30,41,59,0.95)",
                  borderColor: bp.cardBorder,
                }}
              >
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500/80" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <span className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="font-mono text-[0.7rem] text-slate-400 ml-2">
                  {server.codename}@{server.id} — bash
                </span>
                <span className="ml-auto font-mono text-[0.6rem] text-slate-500">
                  {server.name}
                </span>
              </div>

              {/* Corps du terminal */}
              <div
                ref={termRef}
                className="p-4 overflow-y-auto font-mono text-[0.75rem] leading-[1.65] no-scrollbar"
                style={{
                  background: isDark ? "rgba(8,12,24,0.95)" : "rgba(15,23,42,0.97)",
                  maxHeight: "340px",
                  minHeight: "280px",
                }}
              >
                {lines.map((line, i) => {
                  if (line == null) return null;
                  // Coloration syntaxique basique
                  const lineStr = String(line);
                  const isCommand = lineStr.startsWith("$");
                  const isSuccess = lineStr.trimStart().startsWith("✓");
                  const isPending = lineStr.trimStart().startsWith("○");
                  const isWelcome = lineStr.startsWith("Welcome");
                  const isLabel = /^\s{2}\w+\s+:/.test(lineStr);
                  const isCursor = lineStr.includes("█");

                  let color = "#94a3b8"; // default slate-400
                  if (isCommand) color = "#10b981"; // green
                  if (isSuccess) color = "#60a5fa"; // blue
                  if (isPending) color = "#6b7280"; // gray
                  if (isWelcome) color = "#f59e0b"; // amber
                  if (isLabel) color = "#818cf8"; // indigo
                  if (isCursor) color = "#10b981"; // green cursor

                  return (
                    <motion.div
                      key={`${activeServer}-${i}`}
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.08 }}
                      style={{ color, minHeight: "1.1em" }}
                    >
                      {lineStr || "\u00A0"}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* ── Grille des services ── */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {server.services.map((svc, i) => {
                const st = STATUS_LABELS[svc.status];
                return (
                  <motion.div
                    key={svc.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isMobile ? { opacity: 1, y: 0 } : undefined}
                    whileInView={isMobile ? undefined : { opacity: 1, y: 0 }}
                    viewport={isMobile ? undefined : { once: true, amount: 0.15 }}
                    transition={{
                      duration: isMobile ? 0 : 0.35,
                      delay: isMobile ? 0 : i * 0.05,
                    }}
                    className="group rounded-[5px] border p-4 backdrop-blur-[8px] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                    style={{ background: bp.cardBg, borderColor: bp.cardBorder }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xl">{svc.icon}</span>
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: st.color }}
                        />
                        <span className="font-mono text-[0.6rem]" style={{ color: st.color }}>
                          {lang === "fr" ? st.fr : st.en}
                        </span>
                      </div>
                    </div>

                    <h4
                      className="text-sm font-bold mb-0.5 transition-colors"
                      style={{ color: bp.text }}
                    >
                      {svc.name}
                    </h4>
                    <p className="text-xs leading-relaxed mb-2" style={{ color: bp.sub }}>
                      {lang === "fr" ? svc.desc : svc.descEn}
                    </p>

                    <div
                      className="flex items-center justify-between mt-auto pt-2 border-t"
                      style={{ borderColor: bp.chipBorder }}
                    >
                      <span
                        className="font-mono text-[0.6rem] px-1.5 py-0.5 rounded-[3px] border"
                        style={{
                          background: bp.chipBg,
                          color: bp.chipText,
                          borderColor: bp.chipBorder,
                        }}
                      >
                        {svc.port}
                      </span>
                      <span className="font-mono text-[0.6rem]" style={{ color: bp.faint }}>
                        {svc.stack}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Ligne migration */}
            {activeServer === "hp" && (
              <div className="mt-6 flex items-center justify-center gap-3">
                <div className="h-px flex-1 max-w-24" style={{ background: bp.chipBorder }} />
                <span
                  className="font-mono text-[0.65rem] px-3 py-1 rounded-[4px] border"
                  style={{
                    color: bp.faint,
                    borderColor: bp.chipBorder,
                    background: bp.chipBg,
                  }}
                >
                  {lang === "fr" ? "migration vers dino →" : "migrating to dino →"}
                </span>
                <div className="h-px flex-1 max-w-24" style={{ background: bp.chipBorder }} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

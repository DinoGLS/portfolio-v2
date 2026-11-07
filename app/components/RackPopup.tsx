"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/app/providers/ThemeProvider";
import { usePalette } from "@/app/lib/palette";

// ─── Données rack ───────────────────────────────────────────────────────────

interface RackNode {
  host: string;
  ip: string;
  role: string;
  roleFr: string;
  services: string[];
  status: "online" | "planned";
}

const RACK_NODES: RackNode[] = [
  {
    host: "PVE-DINO",
    ip: "192.168.1.50",
    role: "Proxmox VE 9.2 hypervisor",
    roleFr: "Hyperviseur Proxmox VE 9.2",
    status: "online",
    services: ["OPNsense (VM101)", "apps (VM120)", "draken-admin (CT102)", "edge (CT110)", "git (CT112)", "db (CT113)"],
  },
  {
    host: "OPNSENSE",
    ip: "192.168.2.1",
    role: "Lab firewall & DNS resolver",
    roleFr: "Firewall & résolveur DNS du lab",
    status: "online",
    services: ["Firewall", "DNS (Unbound)", "Routage inter-VLAN"],
  },
  {
    host: "DRAKEN-ADM",
    ip: "192.168.2.101",
    role: "IaC bastion — Terraform & Ansible",
    roleFr: "Bastion IaC — Terraform & Ansible",
    status: "online",
    services: ["Terraform bpg", "Ansible", "SSH bastion"],
  },
  {
    host: "EDGE",
    ip: "192.168.2.10",
    role: "Reverse proxy — Traefik",
    roleFr: "Reverse proxy — Traefik",
    status: "online",
    services: ["Traefik :80/:443", "Dashboard :8080", "*.gls routing"],
  },
  {
    host: "GIT",
    ip: "192.168.2.12",
    role: "Self-hosted Git forge — Gitea",
    roleFr: "Forge Git auto-hébergée — Gitea",
    status: "online",
    services: ["Gitea :3000", "Actions (CI/CD)"],
  },
  {
    host: "DB",
    ip: "192.168.2.13",
    role: "Centralized database",
    roleFr: "Base de données centralisée",
    status: "online",
    services: ["PostgreSQL 17 :5432"],
  },
  {
    host: "APPS",
    ip: "192.168.2.20",
    role: "Docker host — most production services",
    roleFr: "Hôte Docker — quasi tous les services",
    status: "online",
    services: [
      "portfolio:3001", "forge:5000", "cv-app:8080", "news:4000", "brain:3010",
      "hub-dash:7777", "ncore:7788", "ecole:7790", "vault:8082",
      "uptime-kuma:3002", "adminer:8081", "notes-sync:4300",
    ],
  },
  {
    host: "HP-GLS",
    ip: "100.121.13.37",
    role: "Legacy server — backups only (PBS)",
    roleFr: "Ancien serveur — sauvegardes uniquement (PBS)",
    status: "online",
    services: ["Proxmox Backup Server", "Backups hebdo"],
  },
];

// ─── Composant ──────────────────────────────────────────────────────────────

interface RackPopupProps {
  lang: "fr" | "en";
}

export default function RackPopup({ lang }: RackPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();
  const clair = theme !== "dark";
  const neige = usePalette() === "neige";
  // Mode clair : mêmes éléments, palette gris-bleu douce
  const c = (s: string) => {
    if (!clair) return s;
    const P = neige
      ? { fond: "rgba(255,255,255,0.98)", ombre1: "rgba(31,26,46,0.18)", ombre2: "rgba(31,26,46,0.14)", ligne: "rgba(236,238,248,0.9)", acc: "rgba(170,0,3,", a1: "#aa0003", a2: "#8a8998", a3: "#5c1a1c", a4: "#1f1a2e", a5: "#3d3a4d", a6: "#6d6b77" }
      : { fond: "rgba(238,232,246,0.97)", ombre1: "rgba(90,70,130,0.28)", ombre2: "rgba(70,50,110,0.22)", ligne: "rgba(224,216,238,0.85)", acc: "rgba(106,80,191,", a1: "#6a50bf", a2: "#85799a", a3: "#4a3d7a", a4: "#2a2540", a5: "#3e3558", a6: "#6a6088" };
    return s
      .replaceAll("rgba(8,28,49,0.92)", P.fond)
      .replaceAll("rgba(2,10,20,0.5)", P.ombre1)
      .replaceAll("rgba(2,10,20,0.6)", P.ombre2)
      .replaceAll("rgba(4,14,26,0.5)", P.ligne)
      .replaceAll("rgba(76,196,255,", P.acc)
      .replace(/#4cc4ff/g, P.a1)
      .replace(/#5d89b6/g, P.a2)
      .replace(/#bfe3ff/g, P.a3)
      .replace(/#e8f4ff/g, P.a4)
      .replace(/#cfe6fb/g, P.a5)
      .replace(/#7fa8cc/g, P.a6);
  };
  const [openDrawer, setOpenDrawer] = useState<number>(0);

  return (
    <>
      {/* Keyframe pour la LED pulse */}
      <style>{`@keyframes infraPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(.7)}}`}</style>

      {/* Icone flottante fixe a droite - ouvre le rack */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label={lang === "fr" ? "Ouvrir le rack infra" : "Open infra rack"}
          className="fixed right-0 top-1/2 -translate-y-1/2 z-[60] flex flex-col items-center gap-[7px] transition-all hover:pr-1"
          style={{
            background: clair ? (neige ? "rgba(255,255,255,0.96)" : "rgba(228,221,238,0.94)") : "rgba(8,28,49,0.85)",
            border: clair ? (neige ? "1px solid rgba(31,26,46,0.2)" : "1px solid rgba(110,90,160,0.3)") : "1px solid rgba(76,196,255,0.32)",
            borderRight: "none",
            borderRadius: "8px 0 0 8px",
            padding: "12px 9px",
            backdropFilter: "blur(8px)",
            boxShadow: clair ? "0 6px 18px rgba(51,65,100,0.14)" : "0 8px 24px rgba(2,10,20,0.5), 0 0 16px rgba(76,196,255,0.08)",
            cursor: "pointer",
          }}
        >
          <span
            className="w-[7px] h-[7px] rounded-full"
            style={{ background: clair ? (neige ? "#aa0003" : "#7a5ab5") : "#4cc4ff", boxShadow: clair ? "0 0 6px rgba(61,106,158,0.45)" : "0 0 8px #4cc4ff", animation: "infraPulse 1.8s ease-in-out infinite" }}
          />
          <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {[0, 1, 2].map((k) => (
              <span key={k} style={{ width: "15px", height: "3px", borderRadius: "1px", background: clair ? (neige ? "#aa0003" : "#7a5ab5") : "#4cc4ff", opacity: 0.85 }} />
            ))}
          </span>
          <span
            style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: "9.5px",
              letterSpacing: "0.2em",
              color: clair ? (neige ? "#5c1a1c" : "#4a3d7a") : "#bfe3ff",
              textTransform: "uppercase",
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
            }}
          >
            Rack
          </span>
          <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "9px", color: clair ? (neige ? "#6d6b77" : "#7a6f94") : "#5d89b6" }}>
            {RACK_NODES.length}U
          </span>
        </button>
      )}

      {/* Popup rack */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[70]"
              style={{ background: c("rgba(2,10,20,0.5)"), backdropFilter: "blur(4px)" }}
              onClick={() => setIsOpen(false)}
            />

            {/* Panneau rack */}
            <motion.div
              initial={{ opacity: 0, x: 80, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.95 }}
              transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
              className="fixed right-6 top-1/2 -translate-y-1/2 z-[80] w-[320px] max-h-[80vh] overflow-y-auto no-scrollbar"
              style={{
                background: c("rgba(8,28,49,0.92)"),
                border: c("1px solid rgba(76,196,255,0.32)"),
                borderRadius: "8px",
                padding: "14px",
                boxShadow: c("0 20px 50px rgba(2,10,20,0.6), 0 0 30px rgba(76,196,255,0.08)"),
                backdropFilter: "blur(16px)",
              }}
            >
              {/* Titre rack */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className="w-[7px] h-[7px] rounded-full"
                    style={{
                      background: c("#4cc4ff"),
                      boxShadow: c("0 0 8px #4cc4ff"),
                      animation: "infraPulse 1.8s ease-in-out infinite",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "'Geist Mono', monospace",
                      fontSize: "10.5px",
                      letterSpacing: "0.14em",
                      color: c("#bfe3ff"),
                      textTransform: "uppercase",
                    }}
                  >
                    Rack — {RACK_NODES.length}U
                  </span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  style={{
                    fontFamily: "'Geist Mono', monospace",
                    fontSize: "14px",
                    color: c("#5d89b6"),
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "2px 6px",
                    lineHeight: 1,
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Tiroirs du rack */}
              <div className="flex flex-col gap-[6px]">
                {RACK_NODES.map((node, i) => {
                  const isDrawerOpen = openDrawer === i;
                  return (
                    <div
                      key={node.host}
                      style={{
                        borderRadius: "5px",
                        overflow: "hidden",
                        border: `1px solid ${isDrawerOpen ? c("rgba(76,196,255,0.5)") : c("rgba(76,196,255,0.2)")}`,
                        transition: "border-color 0.2s ease",
                      }}
                    >
                      {/* En-tête du tiroir */}
                      <button
                        onClick={() => setOpenDrawer(isDrawerOpen ? -1 : i)}
                        className="w-full text-left flex items-center gap-2 transition-colors"
                        style={{
                          padding: "9px 11px",
                          background: isDrawerOpen ? c("rgba(76,196,255,0.1)") : c("rgba(76,196,255,0.04)"),
                          cursor: "pointer",
                          border: "none",
                        }}
                      >
                        {/* LED status */}
                        <span
                          className="w-[7px] h-[7px] rounded-full flex-shrink-0"
                          style={{
                            background: node.status === "online" ? c("#4cc4ff") : "#6b7280",
                            boxShadow: node.status === "online" ? c("0 0 6px #4cc4ff") : "none",
                          }}
                        />
                        {/* Host */}
                        <span
                          style={{
                            fontFamily: "'Geist Mono', monospace",
                            fontSize: "11.5px",
                            color: c("#e8f4ff"),
                            flex: 1,
                          }}
                        >
                          {node.host}
                        </span>
                        {/* IP */}
                        <span
                          style={{
                            fontFamily: "'Geist Mono', monospace",
                            fontSize: "9px",
                            color: c("#5d89b6"),
                          }}
                        >
                          {node.ip}
                        </span>
                        {/* Chevron */}
                        <span
                          style={{
                            fontFamily: "'Geist Mono', monospace",
                            fontSize: "10px",
                            color: c("#4cc4ff"),
                            display: "inline-block",
                            transform: isDrawerOpen ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.2s ease",
                          }}
                        >
                          ▾
                        </span>
                      </button>

                      {/* Contenu du tiroir */}
                      <AnimatePresence>
                        {isDrawerOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
                            style={{ overflow: "hidden" }}
                          >
                            <div
                              style={{
                                padding: "9px 11px 11px",
                                background: c("rgba(4,14,26,0.5)"),
                              }}
                            >
                              {/* Rôle */}
                              <div
                                style={{
                                  fontFamily: "'Geist Mono', monospace",
                                  fontSize: "10px",
                                  color: c("#7fa8cc"),
                                  marginBottom: "8px",
                                }}
                              >
                                {lang === "fr" ? node.roleFr : node.role}
                              </div>

                              {/* Services */}
                              <div className="flex flex-wrap gap-[5px]">
                                {node.services.map((svc) => (
                                  <span
                                    key={svc}
                                    style={{
                                      fontFamily: "'Geist Mono', monospace",
                                      fontSize: "9.5px",
                                      padding: "3px 8px",
                                      borderRadius: "3px",
                                      background: c("rgba(76,196,255,0.12)"),
                                      border: c("1px solid rgba(76,196,255,0.3)"),
                                      color: c("#cfe6fb"),
                                    }}
                                  >
                                    {svc}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              {/* Footer migration */}
              <div
                className="flex items-center justify-center gap-2 mt-3 pt-3"
                style={{ borderTop: c("1px solid rgba(76,196,255,0.15)") }}
              >
                <span
                  className="w-[5px] h-[5px] rounded-full"
                  style={{ background: c("#4cc4ff"), boxShadow: c("0 0 4px #4cc4ff") }}
                />
                <span
                  style={{
                    fontFamily: "'Geist Mono', monospace",
                    fontSize: "9px",
                    color: c("#5d89b6"),
                  }}
                >
                  {lang === "fr" ? "migration HP → dino terminée" : "HP → dino migration complete"}
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

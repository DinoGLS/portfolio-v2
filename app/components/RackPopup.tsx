"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
    host: "HP-GLS",
    ip: "10.0.0.10",
    role: "Legacy server — Docker production",
    roleFr: "Serveur legacy — production Docker",
    status: "online",
    services: ["Portfolio:3001", "Gitea:3000", "DocForge:5000", "CV-App:8080", "Portainer:9000", "NPM:443", "HP-Bot"],
  },
  {
    host: "PVE-DINO",
    ip: "10.0.0.1",
    role: "Proxmox VE 9.2 hypervisor",
    roleFr: "Hyperviseur Proxmox VE 9.2",
    status: "online",
    services: ["OPNsense (VM101)", "draken-admin (CT102)"],
  },
  {
    host: "OPNSENSE",
    ip: "10.0.10.1",
    role: "Lab firewall & router",
    roleFr: "Firewall & routeur du lab",
    status: "online",
    services: ["DHCP", "DNS", "Firewall", "WireGuard"],
  },
  {
    host: "DRAKEN-ADM",
    ip: "10.0.10.11",
    role: "IaC bastion — Terraform & Ansible",
    roleFr: "Bastion IaC — Terraform & Ansible",
    status: "online",
    services: ["Terraform bpg", "Ansible", "SSH bastion"],
  },
];

// ─── Composant ──────────────────────────────────────────────────────────────

interface RackPopupProps {
  lang: "fr" | "en";
}

export default function RackPopup({ lang }: RackPopupProps) {
  const [isOpen, setIsOpen] = useState(false);
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
            background: "rgba(8,28,49,0.85)",
            border: "1px solid rgba(76,196,255,0.32)",
            borderRight: "none",
            borderRadius: "8px 0 0 8px",
            padding: "12px 9px",
            backdropFilter: "blur(8px)",
            boxShadow: "0 8px 24px rgba(2,10,20,0.5), 0 0 16px rgba(76,196,255,0.08)",
            cursor: "pointer",
          }}
        >
          <span
            className="w-[7px] h-[7px] rounded-full"
            style={{ background: "#4cc4ff", boxShadow: "0 0 8px #4cc4ff", animation: "infraPulse 1.8s ease-in-out infinite" }}
          />
          <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {[0, 1, 2].map((k) => (
              <span key={k} style={{ width: "15px", height: "3px", borderRadius: "1px", background: "#4cc4ff", opacity: 0.85 }} />
            ))}
          </span>
          <span
            style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: "9.5px",
              letterSpacing: "0.2em",
              color: "#bfe3ff",
              textTransform: "uppercase",
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
            }}
          >
            Rack
          </span>
          <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: "9px", color: "#5d89b6" }}>
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
              style={{ background: "rgba(2,10,20,0.5)", backdropFilter: "blur(4px)" }}
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
                background: "rgba(8,28,49,0.92)",
                border: "1px solid rgba(76,196,255,0.32)",
                borderRadius: "8px",
                padding: "14px",
                boxShadow: "0 20px 50px rgba(2,10,20,0.6), 0 0 30px rgba(76,196,255,0.08)",
                backdropFilter: "blur(16px)",
              }}
            >
              {/* Titre rack */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className="w-[7px] h-[7px] rounded-full"
                    style={{
                      background: "#4cc4ff",
                      boxShadow: "0 0 8px #4cc4ff",
                      animation: "infraPulse 1.8s ease-in-out infinite",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "'Geist Mono', monospace",
                      fontSize: "10.5px",
                      letterSpacing: "0.14em",
                      color: "#bfe3ff",
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
                    color: "#5d89b6",
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
                        border: `1px solid ${isDrawerOpen ? "rgba(76,196,255,0.5)" : "rgba(76,196,255,0.2)"}`,
                        transition: "border-color 0.2s ease",
                      }}
                    >
                      {/* En-tête du tiroir */}
                      <button
                        onClick={() => setOpenDrawer(isDrawerOpen ? -1 : i)}
                        className="w-full text-left flex items-center gap-2 transition-colors"
                        style={{
                          padding: "9px 11px",
                          background: isDrawerOpen ? "rgba(76,196,255,0.1)" : "rgba(76,196,255,0.04)",
                          cursor: "pointer",
                          border: "none",
                        }}
                      >
                        {/* LED status */}
                        <span
                          className="w-[7px] h-[7px] rounded-full flex-shrink-0"
                          style={{
                            background: node.status === "online" ? "#4cc4ff" : "#6b7280",
                            boxShadow: node.status === "online" ? "0 0 6px #4cc4ff" : "none",
                          }}
                        />
                        {/* Host */}
                        <span
                          style={{
                            fontFamily: "'Geist Mono', monospace",
                            fontSize: "11.5px",
                            color: "#e8f4ff",
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
                            color: "#5d89b6",
                          }}
                        >
                          {node.ip}
                        </span>
                        {/* Chevron */}
                        <span
                          style={{
                            fontFamily: "'Geist Mono', monospace",
                            fontSize: "10px",
                            color: "#4cc4ff",
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
                                background: "rgba(4,14,26,0.5)",
                              }}
                            >
                              {/* Rôle */}
                              <div
                                style={{
                                  fontFamily: "'Geist Mono', monospace",
                                  fontSize: "10px",
                                  color: "#7fa8cc",
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
                                      background: "rgba(76,196,255,0.12)",
                                      border: "1px solid rgba(76,196,255,0.3)",
                                      color: "#cfe6fb",
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
                style={{ borderTop: "1px solid rgba(76,196,255,0.15)" }}
              >
                <span
                  className="w-[5px] h-[5px] rounded-full"
                  style={{ background: "#f59e0b", boxShadow: "0 0 4px #f59e0b" }}
                />
                <span
                  style={{
                    fontFamily: "'Geist Mono', monospace",
                    fontSize: "9px",
                    color: "#5d89b6",
                  }}
                >
                  {lang === "fr" ? "migration HP → dino en cours" : "HP → dino migration in progress"}
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

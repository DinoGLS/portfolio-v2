// Génère les schémas d'architecture des labs (SVG, sans adresse IP : site public).
// Usage : node scripts/gen-schemas.mjs   (écrit dans public/projects/*/schema-*.svg)
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const C = { bg: "#fafbfd", ink: "#1f1a2e", mut: "#5c5968", faint: "#8a8998", red: "#aa0003", redBg: "#fbeaea", line: "#c9cce3", zone: "#f4f5fb", ok: "#2eb872", card: "#ffffff" };
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

class Svg {
  constructor(w, h, title) { this.w = w; this.h = h; this.o = []; this.title = title; }
  rect(x, y, w, h, o = {}) {
    this.o.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 8}" fill="${o.fill ?? "none"}" stroke="${o.stroke ?? C.line}" stroke-width="${o.sw ?? 1.5}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ""}/>`);
  }
  text(x, y, s, o = {}) {
    this.o.push(`<text x="${x}" y="${y}" font-size="${o.size ?? 13}" font-weight="${o.weight ?? 400}" fill="${o.fill ?? C.ink}" text-anchor="${o.anchor ?? "start"}"${o.mono ? ` font-family="ui-monospace,Consolas,monospace"` : ""}${o.ls ? ` letter-spacing="${o.ls}"` : ""}>${esc(s)}</text>`);
  }
  line(x1, y1, x2, y2, o = {}) {
    this.o.push(`<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${o.stroke ?? C.mut}" stroke-width="${o.sw ?? 2}" fill="none"${o.dash ? ` stroke-dasharray="${o.dash}"` : ""} stroke-linecap="round"/>`);
  }
  path(d, o = {}) {
    this.o.push(`<path d="${d}" stroke="${o.stroke ?? C.mut}" stroke-width="${o.sw ?? 2}" fill="none"${o.dash ? ` stroke-dasharray="${o.dash}"` : ""} stroke-linecap="round"/>`);
  }
  dot(x, y, state) {
    const fill = state === "ok" ? C.ok : "#fff";
    const stroke = state === "ok" ? C.ok : C.faint;
    this.o.push(`<circle cx="${x}" cy="${y}" r="5" fill="${fill}" stroke="${stroke}" stroke-width="1.6"/>`);
  }
  // Équipement : carte blanche, titre, sous-titre, pastille d'état
  node(x, y, w, h, title, lines, o = {}) {
    this.rect(x, y, w, h, { fill: o.fill ?? C.card, stroke: o.stroke ?? C.line, dash: o.dash });
    this.text(x + 14, y + 24, title, { size: 14, weight: 700, fill: o.dim ? C.faint : C.ink });
    lines.forEach((l, i) => this.text(x + 14, y + 44 + i * 17, l, { size: 12, fill: o.dim ? C.faint : C.mut }));
    if (o.state) this.dot(x + w - 16, y + 18, o.state);
  }
  zone(x, y, w, h, label, o = {}) {
    this.rect(x, y, w, h, { fill: o.fill ?? C.zone, stroke: o.stroke ?? C.line, dash: o.dash ?? "7 5", rx: 14 });
    this.text(o.right ? x + w - 16 : x + 16, y + 24, label, { size: 12, weight: 700, fill: o.color ?? C.mut, ls: "0.08em", anchor: o.right ? "end" : "start" });
  }
  chips(x, y, items, o = {}) {
    let cx = x;
    for (const it of items) {
      const w = it.length * 6.6 + 18;
      this.rect(cx, y, w, 22, { rx: 11, fill: o.fill ?? "#fff", stroke: o.stroke ?? C.line, sw: 1 });
      this.text(cx + w / 2, y + 15, it, { size: 11, anchor: "middle", fill: o.color ?? C.mut, mono: true });
      cx += w + 6;
    }
  }
  legend(y) {
    this.dot(40, y, "ok"); this.text(52, y + 4, "en place", { size: 11, fill: C.mut });
    this.dot(130, y, "todo"); this.text(142, y + 4, "à faire / éteint", { size: 11, fill: C.mut });
    this.line(260, y, 290, y, { stroke: C.red, sw: 2.5 }); this.text(298, y + 4, "flux routé par le pare-feu", { size: 11, fill: C.mut });
  }
  save(file) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${this.w} ${this.h}" width="${this.w}" height="${this.h}" font-family="system-ui,-apple-system,Segoe UI,Roboto,sans-serif" role="img" aria-label="${esc(this.title)}">
<rect width="${this.w}" height="${this.h}" fill="${C.bg}"/>
${this.o.join("\n")}
</svg>
`;
    const p = path.join(ROOT, "public", "projects", file);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, svg);
    console.log("écrit", file, Math.round(svg.length / 1024) + " Ko");
  }
}

// ── 1) Lab Draken (homelab perso) ──────────────────────────────────────────
{
  const s = new Svg(1000, 620, "Architecture du lab Draken");
  s.text(40, 38, "Lab Draken — homelab personnel", { size: 20, weight: 800 });
  s.text(40, 58, "Hyperviseur Proxmox VE « dino » · réseau segmenté derrière OPNsense · état au 07/11/2026", { size: 12, fill: C.mut });
  s.zone(30, 76, 940, 500, "DINO — HÔTE PROXMOX VE", { dash: "0", stroke: C.mut, right: true });
  // Internet
  s.text(150, 108, "Internet / box", { size: 12, fill: C.mut, anchor: "middle" });
  s.line(150, 114, 150, 134, { stroke: C.red, sw: 2.5 });
  // OPNsense
  s.node(50, 134, 200, 150, "OPNsense · VM 101", ["pare-feu · routeur", "DNS Unbound (*.gls)", "4 interfaces :"], { state: "ok", stroke: C.red });
  s.chips(64, 220, ["WAN", "lab", "AD", "DMZ"], { color: C.red, stroke: "#e8b3b3" });
  s.text(64, 262, "vmbr0 · vmbr1 · vmbr2 · vmbr3", { size: 10.5, fill: C.faint, mono: true });
  // Lien OPNsense -> zone lab
  s.line(250, 190, 292, 190, { stroke: C.red, sw: 2.5 });
  // Zone lab
  s.zone(292, 100, 660, 318, "RÉSEAU LAB — DERRIÈRE OPNSENSE", { stroke: C.red, fill: "#fdf6f6" });
  s.node(310, 128, 190, 82, "draken-admin · CT 102", ["bastion IaC", "Terraform + Ansible"], { state: "ok" });
  s.node(514, 128, 190, 82, "edge · CT 110", ["Traefik : reverse proxy", "HTTPS local (mkcert)"], { state: "ok" });
  s.node(718, 128, 220, 82, "git · CT 112", ["Gitea + Actions (CI/CD)", "déploiement à chaque push"], { state: "ok" });
  s.node(310, 224, 190, 82, "db · CT 113", ["PostgreSQL 17", "bases dédiées par appli"], { state: "ok" });
  s.node(514, 224, 424, 178, "apps · VM 120 — Docker", [], { state: "ok" });
  s.chips(528, 262, ["portfolio", "école", "biblio", "news"]);
  s.chips(528, 292, ["DocForge", "CV", "finance", "open-webui"]);
  s.chips(528, 322, ["Uptime Kuma", "Vaultwarden", "Ollama"]);
  s.text(528, 362, "≈ 20 conteneurs · watchdog mémoire · supervision 24 moniteurs", { size: 11.5, fill: C.mut });
  s.text(310, 332, "Sauvegardes : pg_dump", { size: 11.5, fill: C.mut });
  s.text(310, 349, "quotidien + script hebdo", { size: 11.5, fill: C.mut });
  s.text(310, 366, "(même disque physique)", { size: 11.5, fill: C.faint });
  s.text(310, 383, "copie externe à prévoir", { size: 11.5, fill: C.faint });
  // Zones AD et DMZ
  s.line(150, 284, 150, 312, { stroke: C.red, sw: 2.5 });
  s.node(50, 312, 200, 92, "VM 100 · GLPI", ["parc informatique", "LAN domestique, hors pare-feu"], { state: "ok" });
  s.zone(292, 438, 320, 120, "ZONE AD · VMBR2", { dash: "6 5" });
  s.text(308, 478, "Lab Active Directory", { size: 13, weight: 700, fill: C.faint });
  s.text(308, 496, "VM supprimées : à recréer de zéro", { size: 12, fill: C.faint });
  s.dot(590, 454, "todo");
  s.zone(632, 438, 320, 120, "DMZ · VMBR3", { dash: "6 5" });
  s.text(648, 478, "Réseau isolé, aucune VM", { size: 13, weight: 700, fill: C.faint });
  s.text(648, 496, "prévu pour des cibles exposées", { size: 12, fill: C.faint });
  s.dot(930, 454, "todo");
  s.text(50, 440, "Accès à distance", { size: 12, weight: 700 });
  s.text(50, 458, "Tailscale (mesh) + route du lab", { size: 11.5, fill: C.mut });
  s.text(50, 500, "Ancien serveur HP : éteint,", { size: 11.5, fill: C.faint });
  s.text(50, 517, "migration terminée en juillet 2026", { size: 11.5, fill: C.faint });
  s.legend(598);
  s.save("lab-draken/schema-draken.svg");
}

// ── 2) Projet SISR sur serverecole (labo de l'école) ──────────────────────
{
  const s = new Svg(1000, 600, "Architecture du projet SISR sur serverecole");
  s.text(40, 38, "Projet SISR — serverecole", { size: 20, weight: 800 });
  s.text(40, 58, "Serveur dédié (Dell OptiPlex Micro, Proxmox VE 9) · 4 VM · état au 07/11/2026", { size: 12, fill: C.mut });
  s.zone(30, 76, 940, 480, "SERVERECOLE — HÔTE PROXMOX VE", { dash: "0", stroke: C.mut, right: true });
  s.text(150, 108, "Internet / box de l'école", { size: 12, fill: C.mut, anchor: "middle" });
  s.line(150, 114, 150, 134, { stroke: C.red, sw: 2.5 });
  s.node(50, 134, 200, 130, "OPNsense · VM 100", ["pare-feu · routeur", "règles journalisées", "SNMP lecture seule"], { state: "ok", stroke: C.red });
  s.chips(64, 232, ["WAN", "AD", "DMZ"], { color: C.red, stroke: "#e8b3b3" });
  s.text(50, 300, "Réseau local de l'école", { size: 12, weight: 700 });
  s.text(50, 318, "vmbr0 : hôte + WAN du pare-feu", { size: 11.5, fill: C.mut });
  // Zone AD
  s.line(250, 190, 292, 190, { stroke: C.red, sw: 2.5 });
  s.zone(292, 100, 660, 232, "ZONE AD · VMBR1 · DOMAINE DU PROJET", { stroke: C.red, fill: "#fdf6f6" });
  s.node(310, 128, 200, 112, "AD-DC01 · VM 101", ["Windows Server 2022", "AD DS · DNS · DHCP", "politique de mot de passe"], { state: "ok" });
  s.node(524, 128, 200, 112, "LINUX-SRV01 · VM 102", ["Debian 12, membre du domaine", "GLPI · Kanboard", "PostgreSQL · CrowdSec"], { state: "ok" });
  s.node(738, 128, 200, 112, "SUPERVISION · VM 103", ["Debian 12, membre du domaine", "Zabbix (4 hôtes)", "OPNsense en SNMP"], { state: "ok" });
  s.text(310, 270, "Authentification AD pour GLPI (LDAP) · règles de tickets par catégorie · SLA", { size: 11.5, fill: C.mut });
  s.text(310, 290, "DHCP : étendue 100-200 sur AD-DC01 (offre vérifiée, poste client à joindre)", { size: 11.5, fill: C.mut });
  s.text(310, 310, "Exposition : seul le port d'agent Zabbix traverse la DMZ vers l'AD", { size: 11.5, fill: C.mut });
  // DMZ
  s.line(150, 264, 150, 366, { stroke: C.red, sw: 2.5 });
  s.line(150, 366, 292, 366, { stroke: C.red, sw: 2.5 });
  s.zone(292, 348, 660, 190, "DMZ · VMBR2", { dash: "6 5" });
  s.node(310, 376, 200, 82, "LB-demo", ["HAProxy (répartiteur)", "PH.3 : à faire"], { state: "todo", dash: "5 4", dim: true });
  s.node(524, 376, 200, 82, "web-a", ["serveur web de démo", "à créer"], { state: "todo", dash: "5 4", dim: true });
  s.node(738, 376, 200, 82, "web-b", ["serveur web de démo", "à créer"], { state: "todo", dash: "5 4", dim: true });
  s.text(310, 488, "AD ↔ DMZ refusé par défaut · tout le reste journalisé", { size: 11.5, fill: C.mut });
  s.text(310, 508, "PH.4 sauvegarde / PRA : en attente d'un NAS · PH.5 documentation : au fil de l'eau", { size: 11.5, fill: C.faint });
  s.legend(578);
  s.save("lab-ecole/schema-serverecole.svg");
}

// ── 3) Lab Active Directory perso (à recréer) ──────────────────────────────
{
  const s = new Svg(1000, 420, "Lab Active Directory personnel sur Proxmox");
  s.text(40, 38, "Lab Active Directory — Proxmox perso", { size: 20, weight: 800 });
  s.text(40, 58, "Segment dédié et isolé (vmbr2) derrière OPNsense · VM supprimées, à recréer · état au 07/11/2026", { size: 12, fill: C.mut });
  s.node(50, 100, 220, 110, "OPNsense · VM 101", ["passerelle de la zone AD", "filtrage entre segments"], { state: "ok", stroke: C.red });
  s.line(270, 155, 340, 155, { stroke: C.red, sw: 2.5 });
  s.zone(340, 90, 620, 240, "ZONE AD · VMBR2 · ISOLÉE DU LAN ET DE LA DMZ", { dash: "6 5" });
  s.node(364, 128, 270, 130, "ad-dc · ancienne VM 170", ["Windows Server 2022", "contrôleur de domaine :", "AD DS · DNS · DHCP · GPO"], { state: "todo", dash: "5 4", dim: true });
  s.node(660, 128, 270, 130, "ad-client · ancienne VM 171", ["Windows 11 Entreprise", "poste joint au domaine", "test des GPO"], { state: "todo", dash: "5 4", dim: true });
  s.text(364, 292, "Pilotes VirtIO · disque et carte réseau paravirtualisés", { size: 11.5, fill: C.faint });
  s.text(50, 250, "À ne pas confondre avec le lab AD de l'école", { size: 12, weight: 700 });
  s.text(50, 268, "(domaine pédagogique, déjà réalisé en formation)", { size: 11.5, fill: C.mut });
  s.text(50, 360, "Objectif : refaire un domaine complet de zéro (utilisateurs, groupes, GPO, DHCP)", { size: 12, fill: C.mut });
  s.text(50, 378, "et le documenter, pas seulement le suivre dans un tutoriel.", { size: 12, fill: C.mut });
  s.legend(404);
  s.save("ad-proxmox/schema-ad.svg");
}

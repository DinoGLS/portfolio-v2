"use client";

import { useLanguage } from "@/app/providers/LanguageProvider";

const COMPETENCES = [
  {
    domain: { fr: "Virtualisation & hyperviseur", en: "Virtualization & hypervisor" },
    tech: { fr: "(Proxmox VE, VMs/LXC, snapshots)", en: "(Proxmox VE, VMs/LXC, snapshots)" },
    job: { fr: "Administration systèmes", en: "Systems administration" },
  },
  {
    domain: { fr: "Infrastructure as Code", en: "Infrastructure as Code" },
    tech: { fr: "(Terraform + Ansible, modules réutilisables)", en: "(Terraform + Ansible, reusable modules)" },
    job: { fr: "DevSecOps / automatisation", en: "DevSecOps / automation" },
  },
  {
    domain: { fr: "Segmentation réseau & pare-feu", en: "Network segmentation & firewall" },
    tech: { fr: "(OPNsense, VLANs, WAN/LAN/AD/DMZ)", en: "(OPNsense, VLANs, WAN/LAN/AD/DMZ)" },
    job: { fr: "Sécurité réseau / SOC", en: "Network security / SOC" },
  },
  {
    domain: { fr: "Reverse proxy & TLS", en: "Reverse proxy & TLS" },
    tech: { fr: "(Traefik, certificats mkcert)", en: "(Traefik, mkcert certificates)" },
    job: { fr: "Exposition sécurisée de services", en: "Secure service exposure" },
  },
  {
    domain: { fr: "Conteneurisation & self-hosting", en: "Containerization & self-hosting" },
    tech: { fr: "(Docker, 10+ services)", en: "(Docker, 10+ services)" },
    job: { fr: "Exploitation / Ops", en: "Operations / Ops" },
  },
  {
    domain: { fr: "CI/CD auto-hébergé", en: "Self-hosted CI/CD" },
    tech: { fr: "(Gitea Actions, déploiement automatique)", en: "(Gitea Actions, automatic deployment)" },
    job: { fr: "DevSecOps", en: "DevSecOps" },
  },
  {
    domain: { fr: "DNS & filtrage", en: "DNS & filtering" },
    tech: { fr: "(Pi-hole)", en: "(Pi-hole)" },
    job: { fr: "Administration réseau", en: "Network administration" },
  },
  {
    domain: { fr: "Diagnostic & résilience", en: "Diagnostics & resilience" },
    tech: { fr: "(incidents résolus, sauvegardes)", en: "(resolved incidents, backups)" },
    job: { fr: "Capacité de dépannage (astreinte)", en: "Troubleshooting capability (on-call)" },
  },
];

export default function CompetencesSection() {
  const { lang } = useLanguage();

  return (
    <section id="competences" className="px-4 pb-24 mt-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-3">
            {lang === "fr" ? "Compétences" : "Skills"}
          </h2>
          <p className="text-sm md:text-[0.95rem] text-slate-700 dark:text-slate-300 leading-relaxed">
            {lang === "fr"
              ? "Ce que mon homelab m'a appris — et à quoi ça sert en poste."
              : "What my homelab taught me — and how it applies on the job."}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {COMPETENCES.map((comp, i) => {
            const domainText = comp.domain[lang as "fr" | "en"];
            const techText = comp.tech[lang as "fr" | "en"];
            const jobText = comp.job[lang as "fr" | "en"];

            return (
              <div
                key={i}
                className="border border-white/60 bg-white/40 dark:bg-slate-900/40 dark:border-slate-700/50 rounded-xl p-5 md:backdrop-blur-md shadow-sm flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-sm md:text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">
                    {domainText}
                  </h3>
                  <p className="text-[0.85rem] text-slate-600 dark:text-slate-400 mb-4">
                    {techText}
                  </p>
                </div>
                <div className="flex items-center gap-2 pt-3 border-t border-slate-200/60 dark:border-slate-700/50">
                  <span className="text-blue-500 dark:text-blue-400 font-bold">→</span>
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    {jobText}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

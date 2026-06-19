"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/providers/LanguageProvider";

// ── Badges technos ───────────────────────────────────────────────────────────
// `id`   = clé de traduction (sans point) ; `label` = affichage (protocole) ;
// `tone` = jeu de couleurs adapté clair + sombre.
const TONE: Record<string, string> = {
  blue: "bg-blue-500/10 text-blue-700 border-blue-500/30 dark:bg-blue-500/15 dark:text-blue-300",
  violet: "bg-violet-500/10 text-violet-700 border-violet-500/30 dark:bg-violet-500/15 dark:text-violet-300",
  amber: "bg-amber-500/10 text-amber-700 border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-300",
  cyan: "bg-cyan-500/10 text-cyan-700 border-cyan-500/30 dark:bg-cyan-500/15 dark:text-cyan-300",
  red: "bg-red-500/10 text-red-700 border-red-500/30 dark:bg-red-500/15 dark:text-red-300",
  slate: "bg-slate-500/10 text-slate-700 border-slate-500/30 dark:bg-slate-500/15 dark:text-slate-300",
  emerald: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300",
};

const TECH_BADGES: { id: string; label: string; tone: keyof typeof TONE }[] = [
  { id: "ospf", label: "OSPF", tone: "blue" },
  { id: "hsrp", label: "HSRP", tone: "violet" },
  { id: "snmp", label: "SNMP", tone: "amber" },
  { id: "vlan", label: "VLAN 802.1Q", tone: "cyan" },
  { id: "acl", label: "ACL", tone: "red" },
  { id: "tftp", label: "TFTP", tone: "slate" },
  { id: "dhcp", label: "DHCP", tone: "emerald" },
  { id: "dns", label: "DNS", tone: "emerald" },
];

const gallery = [
  { src: "/projects/wan-simulation/configwan.png", alt: "Topologie WAN" },
  { src: "/projects/wan-simulation/ReseauxVlanCmplet.drawio.png", alt: "Architecture VLAN" },
];

const documents = [
  { key: "report", file: "/projects/wan-simulation/Guide reseau wan.pdf" },
  { key: "reco", file: "/projects/wan-simulation/Recommandation.pdf" },
  { key: "addressing", file: "/projects/wan-simulation/Tableau_adressage.pdf" },
];

const learnedItems = ["convergence", "gateway", "debug", "supervision"] as const;

export default function WanSimulationPage() {
  const { t } = useLanguage();
  const [openImage, setOpenImage] = useState<string | null>(null);
  const [activeBadge, setActiveBadge] = useState<string | null>(null);
  const router = useRouter();

  const handleBack = () => router.push("/#projects");

  return (
    <main className="min-h-screen bg-white px-4 py-16 text-slate-800 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-200">

      {/* ── NAVBAR RETOUR ──────────────────────────────────────────────────── */}
      <nav className="fixed inset-x-0 top-0 z-40 flex items-center border-b border-slate-200/70 bg-white/80 px-6 py-3 backdrop-blur dark:border-slate-800/60 dark:bg-slate-950/80">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          {t("common.backToProjects")}
        </button>
        <span className="ml-4 hidden text-sm text-slate-400 dark:text-slate-600 sm:block">
          / {t("wan.breadcrumb")}
        </span>
      </nav>

      <div className="mx-auto max-w-5xl pt-10">

        {/* ── TITRE ───────────────────────────────────────────────────────── */}
        <motion.header
          className="mt-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            {t("wan.eyebrow")}
          </span>
          <h1 className="mt-2 text-3xl font-bold md:text-4xl">{t("wan.title")}</h1>
          <p className="mt-4 max-w-3xl leading-relaxed text-slate-600 dark:text-slate-300">
            {t("wan.subtitle")}
          </p>
        </motion.header>

        {/* ── BADGES TECHNOS ──────────────────────────────────────────────── */}
        <motion.section
          className="mt-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            {t("wan.techHeading")}
          </h2>
          <div className="flex flex-wrap gap-2">
            {TECH_BADGES.map((badge) => (
              <button
                key={badge.id}
                onClick={() => setActiveBadge(activeBadge === badge.id ? null : badge.id)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-all duration-200 ${TONE[badge.tone]}
                  ${activeBadge === badge.id ? "scale-105 ring-2 ring-blue-400 ring-offset-1 ring-offset-white dark:ring-offset-slate-950" : "hover:scale-105"}`}
              >
                {badge.label}
              </button>
            ))}
          </div>

          <AnimatePresence>
            {activeBadge && (
              <motion.div
                key={activeBadge}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="mt-3 max-w-xl rounded-lg border border-slate-200 bg-slate-100/80 px-4 py-2.5 text-sm text-slate-700 dark:border-slate-700/60 dark:bg-slate-800/80 dark:text-slate-300"
              >
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {TECH_BADGES.find((b) => b.id === activeBadge)?.label} —{" "}
                </span>
                {t(`wan.tech.${activeBadge}`)}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* ── CONTEXTE CHIFFRÉ ────────────────────────────────────────────── */}
        <motion.section
          className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {[
            { value: "4", label: t("wan.stats.routers") },
            { value: "5", label: t("wan.stats.vlans") },
            { value: t("wan.stats.redundancyValue"), label: t("wan.stats.redundancy") },
            { value: "Cisco Packet Tracer", label: t("wan.stats.simulator") },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-center dark:border-slate-800 dark:bg-slate-900/60"
            >
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{stat.value}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
            </div>
          ))}
        </motion.section>

        {/* ── GALERIE ─────────────────────────────────────────────────────── */}
        <motion.section
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-4 text-xl font-semibold">{t("wan.galleryHeading")}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {gallery.map((img, i) => (
              <motion.button
                type="button"
                key={img.src}
                onClick={() => setOpenImage(img.src)}
                className="group relative aspect-video overflow-hidden rounded-lg border border-slate-200 bg-slate-100 text-left dark:border-slate-800 dark:bg-slate-900"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.15 }}
              >
                <Image src={img.src} alt={img.alt} fill className="object-contain p-3" />
                <div className="absolute inset-0 bg-black/40 opacity-0 transition group-hover:opacity-100" />
                <div className="pointer-events-none absolute inset-x-3 bottom-3 translate-y-2 rounded-md border border-slate-700/60 bg-slate-900/90 px-3 py-1.5 text-xs text-slate-200 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                  {img.alt} — {t("common.enlarge")}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* ── DESCRIPTION ─────────────────────────────────────────────────── */}
        <motion.section
          className="mt-12 max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-4 text-xl font-semibold">{t("wan.descHeading")}</h2>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {t("wan.descP1")}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {t("wan.descP2")}
          </p>
        </motion.section>

        {/* ── CE QUE J'AI APPRIS ──────────────────────────────────────────── */}
        <motion.section
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-4 text-xl font-semibold">{t("wan.learnedHeading")}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {learnedItems.map((item) => (
              <div
                key={item}
                className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 dark:border-slate-800 dark:bg-slate-900/60"
              >
                <h3 className="mb-1 font-semibold text-slate-900 dark:text-slate-100">
                  {t(`wan.learned.${item}.title`)}
                </h3>
                <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  {t(`wan.learned.${item}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── DOCUMENTS ───────────────────────────────────────────────────── */}
        <motion.section
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="mb-4 text-xl font-semibold">{t("wan.docsHeading")}</h2>
          <div className="flex flex-col gap-3">
            {documents.map((doc) => (
              <a
                key={doc.file}
                href={doc.file}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-fit items-center rounded-lg border border-slate-300 bg-slate-50/70 px-4 py-2 text-sm transition hover:border-blue-400 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-900/60 dark:hover:border-blue-400 dark:hover:text-blue-300"
              >
                {t(`wan.docs.${doc.key}`)}
              </a>
            ))}
          </div>
        </motion.section>
      </div>

      {/* ── LIGHTBOX ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {openImage && (
          <motion.div
            className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-black/80 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenImage(null)}
          >
            <motion.img
              src={openImage}
              alt=""
              className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.92 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

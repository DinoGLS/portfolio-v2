"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function WanSimulationPage() {
  const [openImage, setOpenImage] = useState<string | null>(null);

  const cards = [
    {
      title: "Objectifs techniques",
      items: [
        "Interconnexion de plusieurs LAN",
        "Redondance de routeurs",
        "Simulation de liens WAN",
        "Supervision réseau",
        "Services réseau dédiés",
      ],
    },
    {
      title: "Technologies",
      items: [
        "HSRP",
        "SNMP",
        "ACL et sécurité réseau",
        "TFTP",
        "Routage dynamique (OSPF)",
        "Encapsulation 802.1Q",
        "DHCP et DNS",
      ],
    },
  ];

  const gallery = [
    {
      src: "/projects/wan-simulation/configwan.png",
      alt: "Topologie WAN",
    },
    {
      src: "/projects/wan-simulation/ReseauxVlanCmplet.drawio.png",
      alt: "Croquis de l’architecture",
    },
  ];

  const documents = [
    {
      label: "Rapport technique – Simulation WAN",
      file: "/projects/wan-simulation/Guide reseau wan.pdf",
    },
    {
      label:"Recommandations d’exploitation – Simulation WAN",
      file:"/projects/wan-simulation/Recommandation.pdf",
    },
    {
      label:"Tableau d'adressage – Simulation WAN",
      file:"/projects/wan-simulation/Tableau_adressage.pdf",
    }
  ];

  return (
    <main className="min-h-screen px-4 py-16 bg-slate-950 text-slate-200">
      <div className="max-w-5xl mx-auto">

        {/* Retour */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href="/#projects"
            className="text-sm text-slate-400 hover:text-blue-400 transition"
          >
            ← Retour aux projets
          </Link>
        </motion.div>

        {/* Titre */}
        <motion.header
          className="mt-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold">
            Simulation WAN avec supervision et redondance de routeurs
          </h1>

          <p className="mt-4 text-slate-300 max-w-3xl">
            Mise en place d’une architecture réseau multi-LAN avec interconnexion WAN,
            haute disponibilité des routeurs et services de supervision.
          </p>
        </motion.header>

        {/* Cartes */}
        <motion.section
          className="mt-8 grid sm:grid-cols-2 gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              className="bg-slate-900/60 border border-slate-800 rounded-xl p-5"
              variants={{
                hidden: { opacity: 0, y: 18 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.4, delay: i * 0.15 }}
            >
              <h3 className="font-semibold mb-2">{card.title}</h3>
              <ul className="text-sm text-slate-300 space-y-1 list-disc list-inside">
                {card.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.section>

        {/* Galerie */}
        <section className="mt-12">
          <motion.h2
            className="text-xl font-semibold mb-4"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            Aperçu de l’architecture
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-4">
            {gallery.map((img, i) => (
              <motion.button
                type="button"
                key={img.src}
                onClick={() => setOpenImage(img.src)}
                className="group relative aspect-video rounded-lg overflow-hidden border border-slate-800 bg-slate-900 text-left"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.15 }}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-contain p-3"
                />

                {/* voile */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition" />

                {/* label */}
                <div
                  className="
                    absolute bottom-3 left-3 right-3
                    bg-slate-900/90
                    border border-slate-700/60
                    rounded-md
                    px-3 py-1.5
                    text-xs text-slate-200
                    opacity-0 translate-y-2
                    group-hover:opacity-100
                    group-hover:translate-y-0
                    transition
                    pointer-events-none
                  "
                >
                  {img.alt} – cliquer pour agrandir
                </div>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Description */}
        <motion.section
          className="mt-12 max-w-3xl"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-xl font-semibold mb-4">
            Description du projet
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            Ce projet simule une infrastructure réseau d’entreprise composée de
            plusieurs réseaux locaux interconnectés via un WAN. Une architecture
            de haute disponibilité est mise en œuvre afin de garantir la continuité
            de service en cas de défaillance d’un équipement critique.
          </p>

          <p className="text-sm text-slate-300 leading-relaxed mt-4">
            La supervision repose sur SNMP et l’exploitation est facilitée par
            la centralisation et la sauvegarde des configurations via TFTP.
            Le projet est orienté exploitation, résilience et observabilité réseau.
          </p>
        </motion.section>

        {/* Documents */}
        <motion.section
          className="mt-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-xl font-semibold mb-4">
            Documents et livrables
          </h2>

          <div className="flex flex-col gap-3">
            {documents.map((doc) => (
              <a
                key={doc.file}
                href={doc.file}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-flex items-center
                  px-4 py-2 rounded-lg
                  border border-slate-700
                  bg-slate-900/60
                  hover:border-blue-400
                  hover:text-blue-300
                  transition
                  text-sm
                  w-fit
                "
              >
                {doc.label}
              </a>
            ))}
          </div>
        </motion.section>

      </div>

      {/* Lightbox image */}
      <AnimatePresence>
        {openImage && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 cursor-zoom-out"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenImage(null)}
          >
            <motion.img
              src={openImage}
              alt="Aperçu agrandi"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
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

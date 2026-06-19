"use client";

import { motion } from "framer-motion";
import ContactForm from "@/app/components/ContactForm";
import { useLanguage } from "@/app/providers/LanguageProvider";

export default function ContactPage() {
  const { t } = useLanguage();
  return (
    <main className="min-h-screen bg-white px-4 py-20 text-slate-800 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-200">
      <div className="mx-auto max-w-2xl">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
            {t("contact.eyebrow")}
          </span>
          <h1 className="mt-2 text-3xl font-bold md:text-4xl">{t("contact.title")}</h1>
          <p className="mt-3 max-w-xl text-slate-600 dark:text-slate-400">
            {t("contact.subtitle")}
          </p>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <ContactForm />
        </motion.div>
      </div>
    </main>
  );
}

"use client";

import Link from "next/link";
import CompetencesSection from "@/app/components/CompetencesSection";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useLanguage } from "@/app/providers/LanguageProvider";

export default function CompetencesPage() {
  const { lang } = useLanguage();
  return (
    <main className="relative min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-8">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          {lang === "fr" ? "Retour à l'accueil" : "Back to home"}
        </Link>
      </div>
      <CompetencesSection />
    </main>
  );
}

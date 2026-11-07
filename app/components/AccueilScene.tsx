"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import HeroReseau from "@/app/components/HeroReseau";
import AboutSection from "@/app/components/AboutSection";
import ReseauSequence from "@/app/components/ReseauSequence";
import Reveal from "@/app/components/Reveal";
import { useLanguage } from "@/app/providers/LanguageProvider";

interface AccueilSceneProps {
  isMobile: boolean;
  onNavigate: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}

type Vue = "reseau" | "deux" | "apropos";

// Largeurs des deux colonnes (carte | À propos) selon la vue : même plan, seules les proportions changent.
const COLONNES: Record<Vue, string> = {
  reseau: "1fr 0fr",
  deux: "1.15fr 1fr",
  apropos: "0.7fr 1.3fr",
};

// L'accueil = la carte réseau + À propos sur un seul plan, avec un interrupteur à trois positions.
// Réseau : la carte seule. Les deux : séquence animée (nom, À propos au milieu, ports branchés un par un). À propos : la carte se réduit, le texte prend la place.
// Vue de départ : « Les deux » ; ?vue=reseau ou ?vue=apropos dans l'adresse pour forcer une autre vue.
// Téléphone ou animations réduites : les deux blocs se suivent, sans interrupteur.
export default function AccueilScene({ isMobile, onNavigate }: AccueilSceneProps) {
  const reduit = useReducedMotion();
  const { lang } = useLanguage();
  const fr = lang === "fr";
  const [vue, setVue] = useState<Vue>("deux");

  useEffect(() => {
    try {
      const v = new URLSearchParams(window.location.search).get("vue");
      if (v === "reseau" || v === "deux" || v === "apropos") setVue(v);
    } catch {}
    const surEvenement = (e: Event) => setVue((e as CustomEvent<Vue>).detail);
    const surTouche = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (window.scrollY > window.innerHeight * 0.6) return;
      if (e.key === "1") setVue("reseau");
      else if (e.key === "2") setVue("deux");
      else if (e.key === "3") setVue("apropos");
    };
    window.addEventListener("accueil-vue", surEvenement);
    window.addEventListener("keydown", surTouche);
    return () => {
      window.removeEventListener("accueil-vue", surEvenement);
      window.removeEventListener("keydown", surTouche);
    };
  }, []);

  if (isMobile || reduit) {
    return (
      <div id="hero">
        <HeroReseau onNavigate={onNavigate} />
        <Reveal>
          <AboutSection />
        </Reveal>
      </div>
    );
  }

  const choix: { id: Vue; label: string; touche: string }[] = [
    { id: "reseau", label: fr ? "Réseau" : "Network", touche: "1" },
    { id: "deux", label: fr ? "Les deux" : "Both", touche: "2" },
    { id: "apropos", label: fr ? "À propos" : "About", touche: "3" },
  ];
  const aboutVisible = vue !== "reseau";

  // Clic sur « À propos » dans la carte : on bascule la vue au lieu de défiler
  const surNavigation = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href === "#about") {
      e.preventDefault();
      setVue("apropos");
      return;
    }
    onNavigate(e, href);
  };

  return (
    <div id="hero" data-scene="1" className="relative flex flex-col justify-center min-h-dvh pb-10">
      {/* Interrupteur à trois positions */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 z-20">
        <div
          role="tablist"
          aria-label={fr ? "Vue de l'accueil" : "Home view"}
          className="flex items-center gap-1 rounded-full border border-slate-300/80 bg-white/70 p-1 shadow-sm backdrop-blur-md dark:border-slate-600/60 dark:bg-slate-900/70"
        >
          {choix.map((c) => {
            const actif = vue === c.id;
            return (
              <button
                key={c.id}
                role="tab"
                aria-selected={actif}
                onClick={() => setVue(c.id)}
                className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors duration-100 ${
                  actif
                    ? "bg-slate-900 text-white dark:bg-blue-500 dark:text-white"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                }`}
              >
                {c.label}
                <kbd className={`font-mono text-[10px] ${actif ? "opacity-70" : "opacity-40"}`}>{c.touche}</kbd>
              </button>
            );
          })}
        </div>
      </div>

      {vue === "deux" ? (
        <div className="w-full px-4 pt-12">
          <ReseauSequence onNavigate={surNavigation} />
        </div>
      ) : (
      <div
        className="grid items-center w-full max-w-[96rem] mx-auto px-4"
        style={{
          gridTemplateColumns: COLONNES[vue],
          columnGap: aboutVisible ? "2rem" : "0rem",
          transition: "grid-template-columns 0.25s ease, column-gap 0.25s ease",
        }}
      >
        <div className="min-w-0">
          <HeroReseau onNavigate={surNavigation} />
        </div>
        <div
          className="min-w-0 overflow-hidden"
          style={{
            opacity: aboutVisible ? 1 : 0,
            pointerEvents: aboutVisible ? "auto" : "none",
            transition: "opacity 0.15s ease",
          }}
          aria-hidden={!aboutVisible}
        >
          <AboutSection empile />
        </div>
      </div>
      )}
    </div>
  );
}

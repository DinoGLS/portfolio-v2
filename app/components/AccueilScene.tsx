"use client";

import { useReducedMotion } from "framer-motion";
import HeroReseau from "@/app/components/HeroReseau";
import AboutSection from "@/app/components/AboutSection";
import ReseauSequence from "@/app/components/ReseauSequence";
import Reveal from "@/app/components/Reveal";

interface AccueilSceneProps {
  isMobile: boolean;
  onNavigate: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}

// L'accueil = une grande carte réseau (le nom est le commutateur, « À propos » au milieu, les sections en ports branchés).
// Ordinateur : un clic sur « À propos » l'agrandit (voir ReseauSequence).
// Téléphone ou animations réduites : la carte en liste verticale, puis À propos, sans effet.
export default function AccueilScene({ isMobile, onNavigate }: AccueilSceneProps) {
  const reduit = useReducedMotion();

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

  return (
    <div id="hero" data-scene="1" className="relative flex flex-col justify-center min-h-screen min-h-dvh px-4 pt-4 pb-6">
      <ReseauSequence onNavigate={onNavigate} />
    </div>
  );
}

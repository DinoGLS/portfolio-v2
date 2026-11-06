"use client";

import { useRef, useState } from "react";
import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";
import HeroReseau from "@/app/components/HeroReseau";
import AboutSection from "@/app/components/AboutSection";
import Reveal from "@/app/components/Reveal";

interface AccueilSceneProps {
  isMobile: boolean;
  onNavigate: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}

// L'accueil = la carte réseau + À propos, dans une seule scène.
// Ordinateur : la scène reste épinglée pendant le défilement. Au début, la carte est devant et
// « À propos » se lit en fond (flou, atténué) ; en défilant, la carte recule et « À propos » passe devant.
// Téléphone ou animations réduites : les deux blocs se suivent, sans effet.
export default function AccueilScene({ isMobile, onNavigate }: AccueilSceneProps) {
  const reduit = useReducedMotion();
  const scene = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: scene, offset: ["start start", "end end"] });
  // Valeur recopiée : évite que framer lie opacité/flou à une animation de défilement native (mauvaise plage avec le sticky)
  const p = useMotionValue(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => p.set(v));
  const [carteActive, setCarteActive] = useState(true);

  // Carte : devant, puis recule
  const carteOpacite = useTransform(p, [0.28, 0.68], [1, 0.12]);
  const carteEchelle = useTransform(p, [0, 0.7], [1, 0.82]);
  const carteY = useTransform(p, [0, 0.7], ["0%", "-6%"]);
  const carteFlou = useTransform(p, [0.4, 0.7], ["blur(0px)", "blur(2.5px)"]);
  // À propos : en fond, puis passe devant
  const aproposOpacite = useTransform(p, [0, 0.3, 0.68], [0.22, 0.3, 1]);
  const aproposEchelle = useTransform(p, [0, 0.7], [0.95, 1]);
  const aproposFlou = useTransform(p, [0, 0.4, 0.7], ["blur(3px)", "blur(3px)", "blur(0px)"]);

  useMotionValueEvent(p, "change", (v) => setCarteActive(v < 0.5));

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
    <div id="hero" data-scene="1" ref={scene} className="relative" style={{ height: "230vh" }}>
      <div className="sticky top-0 h-dvh overflow-hidden">
        {/* Fond : À propos */}
        <motion.div
          className="absolute inset-0 flex items-center"
          style={{ opacity: aproposOpacite, scale: aproposEchelle, filter: aproposFlou }}
          aria-hidden={carteActive}
        >
          <div className="w-full">
            <AboutSection />
          </div>
        </motion.div>

        {/* Devant : carte réseau */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            opacity: carteOpacite,
            scale: carteEchelle,
            y: carteY,
            filter: carteFlou,
            pointerEvents: carteActive ? "auto" : "none",
          }}
        >
          <div className="w-full">
            <HeroReseau onNavigate={onNavigate} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

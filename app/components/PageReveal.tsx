"use client";

import { useEffect, useState } from "react";
import { SPLASH_FADE_EVENT } from "@/app/components/LoadingSplash";

const REVEAL_MS = 900;

// Fait apparaitre le contenu en fondu pendant que LoadingSplash disparait,
// pour eviter le "flash" d'une page deja entierement affichee derriere
// le splash au moment ou celui-ci se retire.
export default function PageReveal({ children }: { children: React.ReactNode }) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (document.readyState === "complete") {
      // navigation retour / cache : rien a cacher, on affiche direct
      setRevealed(true);
      return;
    }
    const onFade = () => setRevealed(true);
    window.addEventListener(SPLASH_FADE_EVENT, onFade);
    return () => window.removeEventListener(SPLASH_FADE_EVENT, onFade);
  }, []);

  return (
    <div
      style={{
        opacity: revealed ? 1 : 0,
        transform: revealed ? "translateY(0)" : "translateY(6px)",
        transition: `opacity ${REVEAL_MS}ms cubic-bezier(0.22, 1, 0.36, 1), transform ${REVEAL_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
      }}
    >
      {children}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// Le "load" du navigateur ne couvre que les ressources reseau : il se
// declenche avant que le canvas anime et l'hydratation React lourde de la
// page aient fini de s'afficher. On ajoute donc une duree minimum genereuse
// + un buffer apres le "load" pour laisser le temps au rendu de se stabiliser.
const MIN_VISIBLE_MS = 1200;
const POST_LOAD_BUFFER_MS = 500;
const FADE_MS = 450;

export default function LoadingSplash() {
  const [visible, setVisible] = useState(true);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    const shownAt = performance.now();

    const startHide = () => {
      const elapsed = performance.now() - shownAt;
      const wait = Math.max(POST_LOAD_BUFFER_MS, MIN_VISIBLE_MS - elapsed);
      window.setTimeout(() => {
        setFadingOut(true);
        window.setTimeout(() => setVisible(false), FADE_MS);
      }, wait);
    };

    if (document.readyState === "complete") {
      startHide();
      return;
    }

    window.addEventListener("load", startHide);
    return () => window.removeEventListener("load", startHide);
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#edf1fc] dark:bg-[#020617] transition-opacity"
      style={{
        opacity: fadingOut ? 0 : 1,
        transitionDuration: `${FADE_MS}ms`,
        pointerEvents: fadingOut ? "none" : "auto",
      }}
    >
      <style>{`
        @keyframes splashBreathe {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(0.88); opacity: 0.55; }
        }
      `}</style>
      <div
        style={{
          width: 104,
          height: 104,
          borderRadius: "50%",
          overflow: "hidden",
          animation: "splashBreathe 1.4s ease-in-out infinite",
        }}
      >
        <Image
          src="/favicons/portfolio-192.png"
          alt=""
          width={104}
          height={104}
          priority
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    </div>
  );
}

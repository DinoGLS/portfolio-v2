"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const MIN_VISIBLE_MS = 500;
const FADE_MS = 400;

export default function LoadingSplash() {
  const [visible, setVisible] = useState(true);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    if (document.readyState === "complete") {
      // deja charge (cache, navigation retour) : on ne montre rien
      setVisible(false);
      return;
    }

    const shownAt = performance.now();

    const hide = () => {
      const elapsed = performance.now() - shownAt;
      const wait = Math.max(0, MIN_VISIBLE_MS - elapsed);
      window.setTimeout(() => {
        setFadingOut(true);
        window.setTimeout(() => setVisible(false), FADE_MS);
      }, wait);
    };

    window.addEventListener("load", hide);
    return () => window.removeEventListener("load", hide);
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
      <Image
        src="/favicons/portfolio-192.png"
        alt=""
        width={72}
        height={72}
        priority
        style={{ animation: "splashBreathe 1.4s ease-in-out infinite" }}
      />
    </div>
  );
}

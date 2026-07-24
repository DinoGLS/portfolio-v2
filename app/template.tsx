"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";

// Dans l'App Router, `template.tsx` se remonte à CHAQUE navigation
// (contrairement à `layout.tsx`). C'est l'endroit idéal pour une
// transition d'entrée. On reste sur transform + opacity (GPU, pas de
// reflow) pour que ce soit fluide sur mobile comme sur desktop.
export default function Template({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  if (reduce || isMobile) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Balayage vert façon Matrix, joué une seule fois à l'arrivée. */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0.5, scaleY: 0 }}
        animate={{ opacity: 0, scaleY: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ transformOrigin: "top" }}
        className="pointer-events-none fixed inset-x-0 top-0 z-[55] h-px
                   bg-gradient-to-b from-emerald-400/70 to-transparent"
      />
      {children}
    </motion.div>
  );
}

"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}

// Apparition au défilement : léger glissement + fondu, une seule fois.
// Aucun effet si l'utilisateur a demandé moins d'animations.
export default function Reveal({ children, delay = 0, y = 24, className }: RevealProps) {
  const reduit = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduit ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

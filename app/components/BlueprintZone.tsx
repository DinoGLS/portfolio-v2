"use client";

import type { ReactNode } from "react";
import { useTheme } from "@/app/providers/ThemeProvider";
import { useBlueprintTokens } from "@/app/data/blueprint-tokens";

interface BlueprintZoneProps {
  children: ReactNode;
}

export default function BlueprintZone({ children }: BlueprintZoneProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const bp = useBlueprintTokens(isDark);

  return (
    <div className="relative">
      {/* Fond dégradé blueprint */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: bp.pageBg,
          maskImage:
            "linear-gradient(to bottom, transparent 0, rgba(0,0,0,0.12) 90px, rgba(0,0,0,0.45) 190px, rgba(0,0,0,0.8) 290px, black 380px, black calc(100% - 190px), transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0, rgba(0,0,0,0.12) 90px, rgba(0,0,0,0.45) 190px, rgba(0,0,0,0.8) 290px, black 380px, black calc(100% - 190px), transparent 100%)",
        }}
      />
      {/* Grille technique 30px */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${bp.gridLine} 1px, transparent 1px), linear-gradient(90deg, ${bp.gridLine} 1px, transparent 1px)`,
          backgroundSize: "30px 30px",
          maskImage:
            "linear-gradient(to bottom, transparent 140px, rgba(0,0,0,0.35) 320px, black 470px, black calc(100% - 260px), transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 140px, rgba(0,0,0,0.35) 320px, black 470px, black calc(100% - 260px), transparent 100%)",
        }}
      />
      {children}
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/app/providers/ThemeProvider";

export default function MatrixCanvas() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const isMobile = window.innerWidth < 768;
    const COL_W   = isMobile ? 26 : 18;
    const TRAIL   = isMobile ? 2  : 4;
    const FONT_SZ = isMobile ? 11 : 13;
    // 30fps sur mobile (économie CPU pour le scroll), 60fps bureau
    const FRAME_MS = isMobile ? 1000 / 30 : 0;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    let cols   = Math.ceil(canvas.width / COL_W) + 1;
    let drops  = Array.from({ length: cols }, () => Math.random() * -50);
    let speeds = Array.from({ length: cols }, () => Math.random() * 0.6 + 0.35);
    const chars = "01∆ΛΞΣΠΦΨΩ≡</>[]{}$#GARLENS";

    const handleResize = () => {
      resize();
      cols   = Math.ceil(canvas.width / COL_W) + 1;
      drops  = Array.from({ length: cols }, () => Math.random() * -50);
      speeds = Array.from({ length: cols }, () => Math.random() * 0.6 + 0.35);
    };
    window.addEventListener("resize", handleResize, { passive: true });

    // Pause quand onglet caché
    let paused = false;
    const onVisibility = () => { paused = document.hidden; };
    document.addEventListener("visibilitychange", onVisibility);

    // Sur mobile : pause pendant le scroll (libère le CPU pour les gestes)
    let scrollTimer = 0;
    let scrollPaused = false;
    const onScroll = () => {
      if (!isMobile) return;
      scrollPaused = true;
      clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(() => { scrollPaused = false; }, 180);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    let animId: number;
    let lastDraw = 0;

    const loop = (time: number) => {
      animId = requestAnimationFrame(loop);

      if (paused || scrollPaused) return;
      // Limiter le frame rate sur mobile
      if (isMobile && time - lastDraw < FRAME_MS) return;
      lastDraw = time;

      ctx.fillStyle = isDark
        ? "rgba(7, 12, 28, 0.07)"
        : "rgba(234, 240, 255, 0.09)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${FONT_SZ}px monospace`;

      for (let i = 0; i < cols; i++) {
        const yPos  = drops[i] * COL_W;
        const waveX = Math.sin(time / 1400 + i * 0.35) * 1.6;
        const x     = i * COL_W + waveX;
        const bri   = 0.28 + 0.22 * Math.sin(time / 900 + i * 0.55);
        const head  = Math.min(bri * 2.3, 1.0);

        ctx.fillStyle = isDark
          ? `rgba(110, 190, 255, ${head})`
          : `rgba(0, 50, 170, ${head * 0.85})`;
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], x, yPos);

        ctx.fillStyle = isDark
          ? `rgba(50, 130, 210, ${bri * 0.5})`
          : `rgba(0, 65, 190, ${bri * 0.38})`;
        for (let t = 1; t <= TRAIL; t++) {
          const ty = yPos - t * COL_W;
          if (ty > 0) ctx.fillText(chars[Math.floor(Math.random() * chars.length)], x, ty);
        }

        const ws = speeds[i] + 0.2 * Math.sin(time / 1600 + i * 0.5);
        if (yPos > canvas.height && Math.random() > 0.978) {
          drops[i] = Math.random() * -30 / COL_W;
        } else {
          drops[i] += ws;
        }
      }
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(scrollTimer);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDark]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        opacity: isDark ? 0.42 : 0.28,
        filter: "blur(1px)",
        willChange: "transform",
      }}
    />
  );
}

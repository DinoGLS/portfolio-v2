import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Version publique (Vercel) : sans le tableau de synthèse. Voir app/lib/version.ts
  env: {
    NEXT_PUBLIC_SANS_SYNTHESE: process.env.VERCEL ? "1" : (process.env.SANS_SYNTHESE ?? "0"),
  },
  // Dev uniquement : autorise l accès au serveur next dev via l IP Tailscale
  allowedDevOrigins: ["100.121.13.37"],
  images: {
    // Autorise les SVG servis par next/image (placeholders internes de confiance),
    // avec une CSP qui interdit tout script/objet embarqué dans le SVG.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;

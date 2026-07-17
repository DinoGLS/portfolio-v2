import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
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

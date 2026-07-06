import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Dev uniquement : autorise l accès au serveur next dev via l IP Tailscale
  allowedDevOrigins: ["100.121.13.37"],
};

export default nextConfig;

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Garlens Charles — Portfolio",
  description: "Portfolio de Garlens Charles, étudiant BTS SIO SISR spécialisé en administration systèmes & réseaux, cybersécurité et DevSecOps.",
  keywords: ["BTS SIO", "SISR", "réseau", "cybersécurité", "DevSecOps", "PowerShell", "Cisco", "Proxmox"],
  authors: [{ name: "Garlens Charles" }],
  openGraph: {
    title: "Garlens Charles — Portfolio",
    description: "Administration Systèmes & Réseaux · Cybersécurité · DevSecOps en formation",
    url: "https://portfolio-charles-garlens.vercel.app/",  // ← remplace par ton vrai domaine
    siteName: "Portfolio Garlens Charles",
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
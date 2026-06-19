import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider, THEME_INIT_SCRIPT } from "@/app/providers/ThemeProvider";
import { LanguageProvider } from "@/app/providers/LanguageProvider";
import ControlsDock from "@/app/components/ControlsDock";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Garlens Charles — Portfolio",
  description:
    "Portfolio de Garlens Charles, étudiant BTS SIO SISR spécialisé en administration systèmes & réseaux, cybersécurité et DevSecOps.",
  keywords: ["BTS SIO", "SISR", "réseau", "cybersécurité", "DevSecOps", "PowerShell", "Cisco", "Proxmox"],
  authors: [{ name: "Garlens Charles" }],
  openGraph: {
    title: "Garlens Charles — Portfolio",
    description: "Administration Systèmes & Réseaux · Cybersécurité · DevSecOps en formation",
    url: "https://portfolio-charles-garlens.vercel.app/",
    siteName: "Portfolio Garlens Charles",
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // className="dark" => dark-first même sans JS ; le script anti-flash ajuste
    // avant le 1er rendu si l'utilisateur préfère le clair.
    <html lang="fr" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          <LanguageProvider>
            <ControlsDock />
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

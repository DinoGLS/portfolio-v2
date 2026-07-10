import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider, THEME_INIT_SCRIPT } from "@/app/providers/ThemeProvider";
import { LanguageProvider } from "@/app/providers/LanguageProvider";
import ControlsDock from "@/app/components/ControlsDock";
import MatrixCanvas from "@/app/components/MatrixCanvas";

const geistSans = localFont({
  src: "../public/fonts/Geist-Variable.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../public/fonts/GeistMono-Variable.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
});

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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#edf1fc] dark:bg-[#020617]`}>
        <ThemeProvider>
          <LanguageProvider>
            <MatrixCanvas />
            <ControlsDock />
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

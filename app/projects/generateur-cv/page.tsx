import BlueprintProject, { BPData } from "@/app/components/projects/BlueprintProject";

const data: BPData = {
  tag: { fr: "DEV · IA · OUTIL", en: "DEV · AI · TOOL" },
  title: { fr: "Générateur de CV", en: "CV Generator" },
  subtitle: { 
    fr: "Application Flask générant CV et lettre de motivation HTML/PDF personnalisés. Récupère le logo, extrait les couleurs de marque (ColourThief), génère le texte via Groq (llama-3.3-70b), et rend le PDF via Playwright (Chromium headless).",
    en: "Flask app generating custom HTML/PDF resumes and cover letters. Fetches logo, extracts brand colors (ColourThief), generates text via Groq (llama-3.3-70b), and renders PDF via Playwright (headless Chromium)."
  },
  status: { fr: "Terminé", en: "Done" },
  statusColor: "#10b981",
  badges: [
    { label: "Flask", color: "#10b981" },
    { label: "Python", color: "#10b981" },
    { label: "Groq", color: "#10b981" },
    { label: "Playwright", color: "#10b981" },
    { label: "ColourThief", color: "#10b981" },
    { label: "Pillow", color: "#10b981" },
  ],
  breadcrumb: "garlens — portfolio/projets/generateur-cv",
  files: [
    { name: "README.md", icon: "📄", indent: 0, kind: "file" },
    { name: "server.py", icon: "🐍", indent: 0, kind: "active" },
    { name: "utils.py", icon: "🐍", indent: 0, kind: "file" },
    { name: "data.json", icon: "📝", indent: 0, kind: "file" },
    { name: "lettre.json", icon: "📝", indent: 0, kind: "file" },
  ],
  tabs: ["README.md", "server.py", "utils.py"],
  steps: [
    {
      num: "01",
      title: { fr: "Récupération logo & couleurs", en: "Logo & Colors extraction" },
      subtitle: { fr: "ColourThief & Pillow", en: "ColourThief & Pillow" },
      desc: { 
        fr: "Scraping du logo de l'entreprise ciblée et extraction de ses couleurs dominantes pour adapter automatiquement le thème du CV.",
        en: "Scraping the targeted company's logo and extracting its dominant colors to automatically adapt the resume's theme."
      },
      lang: "python",
      code: "from colour_thief import ColourThief\n\ncolor_thief = ColourThief('logo.png')\ndominant_color = color_thief.get_color(quality=1)\npalette = color_thief.get_palette(color_count=3)",
    },
    {
      num: "02",
      title: { fr: "Génération de texte ciblé", en: "Targeted text generation" },
      subtitle: { fr: "Groq API (llama-3.3-70b)", en: "Groq API (llama-3.3-70b)" },
      desc: {
        fr: "Appel à l'API Groq pour générer une accroche et une lettre de motivation sur mesure, optimisées pour le poste visé.",
        en: "Calling the Groq API to generate a custom hook and cover letter, optimized for the targeted position."
      },
      lang: "python",
      code: "response = client.chat.completions.create(\n    messages=[{'role': 'user', 'content': prompt}],\n    model='llama-3.3-70b-versatile'\n)"
    },
    {
      num: "03",
      title: { fr: "Rendu HTML vers PDF", en: "HTML to PDF rendering" },
      subtitle: { fr: "Playwright Headless", en: "Playwright Headless" },
      desc: {
        fr: "Conversion des templates HTML (7 styles CSS) en fichiers PDF pixel-perfect à l'aide d'une instance Chromium headless via Playwright.",
        en: "Conversion of HTML templates (7 CSS styles) to pixel-perfect PDF files using a headless Chromium instance via Playwright."
      },
      lang: "python",
      code: "from playwright.sync_api import sync_playwright\n\nwith sync_playwright() as p:\n    browser = p.chromium.launch()\n    page = browser.new_page()\n    page.goto('file://cv.html')\n    page.pdf(path='cv_output.pdf')"
    },
    {
      num: "04",
      title: { fr: "Sortie et Distribution", en: "Output and Distribution" },
      subtitle: { fr: "CV & Lettre par entreprise", en: "CV & Cover Letter by company" },
      desc: {
        fr: "Génération du package complet prêt à être envoyé pour chaque candidature, incluant le CV et la lettre stylisés.",
        en: "Generation of the complete package ready to be sent for each application, including the stylized resume and cover letter."
      },
      lang: "bash",
      code: "ls outputs/entreprise_cible/\n- cv_garlens_charles.pdf\n- lettre_motivation.pdf"
    }
  ]
};

export default function GenerateurCVPage() {
  return <BlueprintProject variant="ide" data={data} />;
}

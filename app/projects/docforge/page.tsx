import BlueprintProject, { BPData } from "@/app/components/projects/BlueprintProject";

const data: BPData = {
  tag: { fr: "IA · DEVOPS · BTS SISR", en: "AI · DEVOPS · BTS SISR" },
  title: { fr: "DocForge", en: "DocForge" },
  subtitle: { 
    fr: "Générateur de livrables BTS : Flask + cascade LLM (Claude/Groq/Gemini) + Pandoc + WeasyPrint, déployé en Docker (forge.gls). Notes brutes -> Markdown structuré -> PDF thémé (11 thèmes CSS).",
    en: "BTS deliverable generator: Flask + LLM cascade (Claude/Groq/Gemini) + Pandoc + WeasyPrint, deployed in Docker (forge.gls). Raw notes -> Structured Markdown -> Themed PDF (11 CSS themes)."
  },
  status: { fr: "En production", en: "Live" },
  statusColor: "#8b5cf6",
  badges: [
    { label: "Flask", color: "#8b5cf6" },
    { label: "LLM API", color: "#8b5cf6" },
    { label: "Docker", color: "#8b5cf6" },
    { label: "Pandoc", color: "#8b5cf6" },
  ],
  breadcrumb: "garlens — portfolio/projets/docforge",
  files: [
    { name: "README.md", icon: "📄", indent: 0, kind: "file" },
    { name: "app.py", icon: "🐍", indent: 0, kind: "active" },
    { name: "pipeline.py", icon: "🐍", indent: 0, kind: "file" },
    { name: "prompt_system.txt", icon: "📝", indent: 0, kind: "file" },
    { name: "themes", icon: "📁", indent: 0, kind: "folder" },
    { name: "Dockerfile", icon: "🐳", indent: 0, kind: "file" },
  ],
  tabs: ["README.md", "app.py", "pipeline.py"],
  steps: [
    {
      num: "01",
      title: { fr: "Pipeline Flask", en: "Flask Pipeline" },
      subtitle: { fr: "Routes /generate et /render", en: "Routes /generate and /render" },
      desc: { 
        fr: "Création d'une API backend avec Flask gérant la réception des notes brutes, l'orchestration des appels LLM et le déclenchement de la compilation PDF.",
        en: "Creation of a backend API with Flask managing the receipt of raw notes, orchestration of LLM calls and triggering the PDF compilation."
      },
      lang: "python",
      code: "@app.route('/generate', methods=['POST'])\ndef generate():\n    data = request.json\n    return run_pipeline(data)",
    },
    {
      num: "02",
      title: { fr: "Cascade LLM", en: "LLM Cascade" },
      subtitle: { fr: "Orchestration multi-modèles", en: "Multi-model orchestration" },
      desc: {
        fr: "Utilisation d'une cascade d'APIs LLM (Claude, Groq, Gemini) pour transformer les notes en Markdown structuré en cas de fallback.",
        en: "Use of an LLM API cascade (Claude, Groq, Gemini) to transform notes into structured Markdown with fallback mechanisms."
      },
      lang: "python",
      code: "def call_llm(prompt):\n    try:\n        return claude_api.generate(prompt)\n    except:\n        return groq_api.generate(prompt)"
    },
    {
      num: "03",
      title: { fr: "Rendu PDF", en: "PDF Rendering" },
      subtitle: { fr: "Pandoc & WeasyPrint", en: "Pandoc & WeasyPrint" },
      desc: {
        fr: "Conversion du Markdown structuré en PDF final thémé avec Pandoc et WeasyPrint (choix parmi 11 thèmes CSS).",
        en: "Conversion of structured Markdown into a themed final PDF with Pandoc and WeasyPrint (choice of 11 CSS themes)."
      },
      lang: "bash",
      code: "pandoc input.md -f markdown -t html -o temp.html\nweasyprint temp.html output.pdf -s theme.css"
    },
    {
      num: "04",
      title: { fr: "Déploiement Docker", en: "Docker Deployment" },
      subtitle: { fr: "Conteneurisation (forge.gls)", en: "Containerization (forge.gls)" },
      desc: {
        fr: "Déploiement de l'application sous forme de conteneur Docker pour simplifier l'installation et garantir la reproductibilité.",
        en: "Deployment of the application as a Docker container to simplify installation and ensure reproducibility."
      },
      lang: "dockerfile",
      code: "FROM python:3.10-slim\nRUN apt-get update && apt-get install -y pandoc weasyprint\nCOPY requirements.txt .\nRUN pip install -r requirements.txt\nCMD [\"python\", \"app.py\"]"
    }
  ]
};

export default function DocForgePage() {
  return <BlueprintProject variant="ide" data={data} />;
}

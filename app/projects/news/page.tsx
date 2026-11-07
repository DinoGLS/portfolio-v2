import BlueprintProject, { BPData } from "@/app/components/projects/BlueprintProject";

const data: BPData = {
  tag: { fr: "IA · VEILLE · AUTOMATISATION", en: "AI · WATCH · AUTOMATION" },
  title: { fr: "News : veille technologique triée par IA", en: "News: AI-sorted tech watch" },
  subtitle: {
    fr: "Outil de veille pour le BTS : il collecte des flux d'actualité, fait trier les articles par un modèle de langage et m'envoie un résumé quotidien sur Telegram.",
    en: "Watch tool for the BTS: it collects news feeds, has a language model sort the articles and sends me a daily digest on Telegram.",
  },
  status: { fr: "En production", en: "Live" },
  img: "/projects/news/preview.jpg",
  statusColor: "#16a34a",
  badges: [
    { label: "Groq", color: "#16a34a" },
    { label: "RSS", color: "#16a34a" },
    { label: "Telegram", color: "#16a34a" },
    { label: "Docker", color: "#16a34a" },
  ],
  breadcrumb: "garlens — portfolio/projets/news",
  steps: [
    {
      num: "01",
      title: { fr: "Collecte des flux", en: "Feed collection" },
      subtitle: { fr: "Sources d'actualité", en: "News sources" },
      desc: {
        fr: "L'outil lit des flux d'actualité. Quand une source meurt (un flux Yahoo a disparu), je la remplace par une autre.",
        en: "The tool reads news feeds. When a source dies (a Yahoo feed disappeared), I replace it with another.",
      },
    },
    {
      num: "02",
      title: { fr: "Tri par IA", en: "AI sorting" },
      subtitle: { fr: "Un onglet « Aujourd'hui »", en: "A 'Today' tab" },
      desc: {
        fr: "Un modèle de langage (Groq) classe les articles : les cinq premiers sont mis en avant, le reste est replié par thème. Je peux garder des articles pour ma veille.",
        en: "A language model (Groq) ranks the articles: the top five are highlighted, the rest folded by theme. I can keep articles for my watch notes.",
      },
    },
    {
      num: "03",
      title: { fr: "Digest quotidien", en: "Daily digest" },
      subtitle: { fr: "Telegram à 7 h 30", en: "Telegram at 7:30" },
      desc: {
        fr: "Chaque matin à 7 h 30 (heure de Paris), un résumé part sur Telegram. Il est envoyé par un processus interne au service, sans tâche planifiée supplémentaire.",
        en: "Every morning at 7:30 (Paris time), a digest goes out on Telegram. It is sent by a thread inside the service, with no extra scheduled task.",
      },
    },
  ],
};

export default function NewsPage() {
  return <BlueprintProject variant="ide" data={data} />;
}

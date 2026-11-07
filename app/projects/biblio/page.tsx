import BlueprintProject, { BPData } from "@/app/components/projects/BlueprintProject";

const data: BPData = {
  tag: { fr: "DEV · PWA · OBSIDIAN", en: "DEV · PWA · OBSIDIAN" },
  title: { fr: "Bibliothèque : mes notes lues comme des livres", en: "Library: my notes read like books" },
  subtitle: {
    fr: "Mes notes de connaissances (Obsidian) sont publiées en livres lisibles, installables sur téléphone et utilisables hors ligne.",
    en: "My knowledge notes (Obsidian) are published as readable books, installable on a phone and usable offline.",
  },
  status: { fr: "En production", en: "Live" },
  img: "/projects/biblio/preview.jpg",
  statusColor: "#ea580c",
  badges: [
    { label: "Python", color: "#ea580c" },
    { label: "PWA", color: "#ea580c" },
    { label: "nginx", color: "#ea580c" },
    { label: "Docker", color: "#ea580c" },
  ],
  breadcrumb: "garlens — portfolio/projets/biblio",
  steps: [
    {
      num: "01",
      title: { fr: "Génération des livres", en: "Building the books" },
      subtitle: { fr: "Un script Python lit le coffre", en: "A Python script reads the vault" },
      desc: {
        fr: "Un script Python transforme les notes en données de lecture. Il est relancé automatiquement toutes les quinze minutes, après la synchronisation du coffre.",
        en: "A Python script turns the notes into reading data. It reruns automatically every fifteen minutes, after the vault sync.",
      },
      lang: "bash",
      code: "# toutes les 15 minutes\n5,20,35,50 * * * *  regen-and-sync.sh",
    },
    {
      num: "02",
      title: { fr: "Application hors ligne", en: "Offline app" },
      subtitle: { fr: "PWA installable", en: "Installable PWA" },
      desc: {
        fr: "Le site est statique, servi par nginx. Un service worker garde les livres en cache pour les lire sans réseau, y compris avec leurs traductions en anglais.",
        en: "The site is static, served by nginx. A service worker caches the books to read them without a network, including their English translations.",
      },
    },
    {
      num: "03",
      title: { fr: "Déploiement", en: "Deployment" },
      subtitle: { fr: "CI Gitea Actions", en: "Gitea Actions CI" },
      desc: {
        fr: "Le code est dans un dépôt Gitea ; les données générées sont dans un volume séparé, jamais dans git. Un push sur main redéploie le conteneur.",
        en: "The code lives in a Gitea repository; the generated data sits in a separate volume, never in git. A push to main redeploys the container.",
      },
    },
  ],
};

export default function BiblioPage() {
  return <BlueprintProject variant="ide" data={data} />;
}

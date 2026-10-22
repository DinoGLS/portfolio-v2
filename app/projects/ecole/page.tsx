import BlueprintProject, { BPData } from "@/app/components/projects/BlueprintProject";

const data: BPData = {
  tag: { fr: "DEV · PWA · BTS SISR", en: "DEV · PWA · BTS SISR" },
  title: { fr: "École : cours, révisions et épreuves", en: "École: courses, revision and exams" },
  subtitle: {
    fr: "Application web installable pour réviser le BTS : cours en sections, quiz, épreuves notées, suivi de révision et semaine type. Les cours viennent de mes notes Obsidian, synchronisées vers une base PostgreSQL.",
    en: "Installable web app to revise for the BTS: sectioned courses, quizzes, graded exams, revision tracking and a weekly plan. Courses come from my Obsidian notes, synced into a PostgreSQL database.",
  },
  status: { fr: "En production", en: "Live" },
  statusColor: "#3b82f6",
  badges: [
    { label: "Node.js", color: "#3b82f6" },
    { label: "PostgreSQL", color: "#3b82f6" },
    { label: "PWA", color: "#3b82f6" },
    { label: "Docker", color: "#3b82f6" },
  ],
  breadcrumb: "garlens — portfolio/projets/ecole",
  steps: [
    {
      num: "01",
      title: { fr: "Synchro depuis Obsidian", en: "Sync from Obsidian" },
      subtitle: { fr: "Notes de cours vers la base", en: "Course notes into the database" },
      desc: {
        fr: "Un script planifié lit le coffre Obsidian, découpe chaque cours en sections et met la base à jour. Une sauvegarde est faite avant chaque passage et une suppression n'est appliquée qu'après un délai de sécurité.",
        en: "A scheduled script reads the Obsidian vault, splits each course into sections and updates the database. A backup is taken before each run and a deletion is only applied after a safety delay.",
      },
      lang: "bash",
      code: "# dimanche et mercredi, 5 h (Europe/Paris)\n0 5 * * 0,3  ecole-cours-sync.sh",
    },
    {
      num: "02",
      title: { fr: "Suivi de révision", en: "Revision tracking" },
      subtitle: { fr: "Activer le suivi section par section", en: "Track revision section by section" },
      desc: {
        fr: "Chaque section peut être suivie : l'application affiche ce qui est en retard. Un bogue empêchait l'activation dans les cours importés par la synchro : la requête est devenue un upsert.",
        en: "Each section can be tracked and the app shows what is overdue. A bug prevented activation in courses imported by the sync: the query is now an upsert.",
      },
      lang: "sql",
      code: "INSERT INTO revision_state (section_id, activee)\nVALUES ($2, $1)\nON CONFLICT (section_id)\nDO UPDATE SET activee = EXCLUDED.activee;",
    },
    {
      num: "03",
      title: { fr: "Quiz et épreuves", en: "Quizzes and exams" },
      subtitle: { fr: "QCM, textes à trous, notes", en: "MCQ, fill-in-the-blank, grades" },
      desc: {
        fr: "Quiz de cours (QCM et textes à trous) avec un lien « Revoir ce passage » vers le chapitre concerné, et épreuves notées à une seule tentative, avec courbe des notes.",
        en: "Course quizzes (MCQ and fill-in-the-blank) with a 'Review this passage' link to the relevant chapter, and graded single-attempt exams with a grade curve.",
      },
    },
    {
      num: "04",
      title: { fr: "Déploiement", en: "Deployment" },
      subtitle: { fr: "CI Gitea Actions, hébergement perso", en: "Gitea Actions CI, self-hosted" },
      desc: {
        fr: "L'API (Express + PostgreSQL) tourne en Docker sur mon serveur ; la partie visible est un site statique servi par nginx. Chaque push sur main déclenche le déploiement.",
        en: "The API (Express + PostgreSQL) runs in Docker on my server; the front end is a static site served by nginx. Every push to main triggers the deployment.",
      },
    },
  ],
};

export default function EcolePage() {
  return <BlueprintProject variant="ide" data={data} />;
}

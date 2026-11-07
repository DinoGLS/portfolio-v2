// Génère app/data/apprentissage.json à partir du suivi de progression tenu par le professeur d'apprentissage.
//
//   node scripts/build-apprentissage.mjs [suivi.md] [sortie.json]
//   (ou variables d'environnement SUIVI_PATH et SORTIE_PATH)
//   Sans 2e argument : écrit app/data/apprentissage.json (copie embarquée dans le site, utilisée en secours).
//   Sur le serveur apps, un cron l'exécute toutes les 30 min avec une sortie lue par le conteneur (voir README).
//
// DÉPENDANCE AU FORMAT — le professeur ne doit pas casser ces deux tableaux de « 02 - Suivi de progression.md » :
//   1. « ## Niveau par notion »       colonnes : | Notion | Statut | Dernier test | Remarque |
//      Statut : acquis · fragile · non acquis (la mise en gras et un complément entre parenthèses sont tolérés)
//   2. « ## Heures réelles par rapport au plan »   colonnes : | Date | Matière | Durée |
//      Durée : « 1 h 30 », « ≈ 2 h 35 », « 27 min » ; « non mesurée » est comptée comme séance sans durée.
// Les remarques, le détail des exercices et les horaires ne sont JAMAIS écrits dans le JSON (site public).
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const DEFAUT = "C:/Users/Asus/Documents/Obsidian Vault/01 Etudiant/Apprentissage Python/02 - Suivi de progression.md";
const source = process.argv[2] || process.env.SUIVI_PATH || DEFAUT;
const sortieArg = process.argv[3] || process.env.SORTIE_PATH || null;
const txt = fs.readFileSync(source, "utf8").replace(/\r\n/g, "\n");

const nettoie = (s) => s.replace(/\*\*/g, "").replace(/`/g, "").replace(/\[\[([^\]|]+)(\|[^\]]+)?\]\]/g, "$1").replace(/\s+/g, " ").trim();

// Retourne les lignes de données du tableau qui suit le titre `titre` (sans en-tête ni séparateur)
function tableau(titre) {
  const i = txt.indexOf(titre);
  if (i < 0) throw new Error(`Section introuvable : ${titre}`);
  const lignes = txt.slice(i).split("\n").slice(1);
  const out = [];
  let dedans = false;
  for (const l of lignes) {
    if (l.startsWith("## ") && dedans) break;
    if (!l.startsWith("|")) { if (dedans && out.length) break; continue; }
    const cellules = l.split("|").slice(1, -1).map((c) => c.trim());
    if (!dedans) { dedans = true; continue; } // en-tête
    if (/^[-: ]+$/.test(cellules[0])) continue; // séparateur
    out.push(cellules);
  }
  return out;
}

// ── Notions ────────────────────────────────────────────────────────────────
const notions = tableau("## Niveau par notion").map(([nom, statut, dernier]) => {
  const st = nettoie(statut).toLowerCase();
  const etat = st.startsWith("acquis") ? "acquis" : st.startsWith("fragile") ? "fragile" : "non-acquis";
  return { nom: nettoie(nom), etat, dernierTest: nettoie(dernier || "") };
});

// ── Heures ─────────────────────────────────────────────────────────────────
const duree = (s) => {
  const t = nettoie(s).replace(/≈/g, "");
  let m = t.match(/(\d+)\s*h\s*(\d+)?/);
  if (m) return Number(m[1]) + (m[2] ? Number(m[2]) / 60 : 0);
  m = t.match(/(\d+)\s*min/);
  if (m) return Number(m[1]) / 60;
  return null;
};
const dateFin = (s) => {
  const t = nettoie(s);
  const annee = (t.match(/\/(\d{4})/) || [])[1];
  const ms = [...t.matchAll(/(\d{1,2})\/(\d{2})(?:\/(\d{4}))?/g)];
  if (!ms.length || !annee) return null;
  const d = ms[ms.length - 1];
  return new Date(Date.UTC(Number(d[3] || annee), Number(d[2]) - 1, Number(d[1])));
};
const seances = tableau("## Heures réelles par rapport au plan").map(([date, , dur]) => ({ fin: dateFin(date), h: duree(dur || "") }));
const mesurees = seances.filter((s) => s.h != null && s.fin);
const heures = mesurees.reduce((a, s) => a + s.h, 0);
const derniere = seances.map((s) => s.fin).filter(Boolean).sort((a, b) => b - a)[0];

// Heures par semaine (lundi de la semaine), les 10 dernières semaines
const lundi = (d) => { const x = new Date(d); const j = (x.getUTCDay() + 6) % 7; x.setUTCDate(x.getUTCDate() - j); return x.toISOString().slice(0, 10); };
const parSemaine = new Map();
for (const s of mesurees) parSemaine.set(lundi(s.fin), (parSemaine.get(lundi(s.fin)) || 0) + s.h);
const semaines = [...parSemaine.entries()].sort(([a], [b]) => (a < b ? -1 : 1)).slice(-10).map(([debut, h]) => ({ debut, heures: Math.round(h * 10) / 10 }));

const compte = (e) => notions.filter((n) => n.etat === e).length;
const sortie = {
  genere: new Date().toISOString(),
  notions: notions.map(({ nom, etat }) => ({ nom, etat })), // pas de remarque, pas de date de test : public
  compteurs: { acquis: compte("acquis"), fragile: compte("fragile"), nonAcquis: compte("non-acquis"), total: notions.length },
  heures: { total: Math.round(heures * 10) / 10, seances: seances.length, seancesMesurees: mesurees.length, derniereSeance: derniere ? derniere.toISOString().slice(0, 10) : null, parSemaine: semaines },
};

// Garde-fou : si le format du suivi a changé et que rien n'est lu, on n'écrase PAS le fichier existant
if (notions.length === 0 || seances.length === 0) {
  console.error("ERREUR : aucune notion ou aucune séance lue : le format de « 02 - Suivi de progression.md » a-t-il changé ? Fichier de sortie inchangé.");
  process.exit(1);
}
const dest = sortieArg ? path.resolve(sortieArg) : path.join(ROOT, "app", "data", "apprentissage.json");
// Écriture atomique : fichier temporaire puis renommage, pour qu'un lecteur ne voie jamais un fichier à moitié écrit
const tmp = dest + ".tmp";
fs.writeFileSync(tmp, JSON.stringify(sortie, null, 2) + "\n");
fs.renameSync(tmp, dest);
console.log(`${new Date().toISOString()} écrit ${sortieArg ? dest : path.relative(ROOT, dest)} : ${notions.length} notions (${sortie.compteurs.acquis} acquises, ${sortie.compteurs.fragile} fragiles), ${sortie.heures.total} h sur ${seances.length} séances, dernière séance ${sortie.heures.derniereSeance}`);

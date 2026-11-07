// Couleurs de données (catégories, statuts, badges) adaptées au mode clair.
// Neige & inferno : les bleus deviennent rouge inferno, les bleus/violets secondaires graphite, l'ambre est assombri.
// Lavande (aube) et mode sombre : couleur d'origine.
const ROUGE = ["#3b82f6", "#4cc4ff", "#60a5fa", "#38bdf8", "#22d3ee", "#2563eb", "#1f7fc4", "#2b9fe0", "#0ea5e9", "#06b6d4"];
const GRAPHITE = ["#bfe3ff", "#818cf8", "#6366f1", "#a5b4fc", "#93c5fd", "#8b5cf6", "#a78bfa", "#a855f7"];

export function couleurNeige(c: string | undefined): string | undefined {
  if (!c) return c;
  const l = c.toLowerCase();
  if (ROUGE.includes(l)) return "#aa0003";
  if (GRAPHITE.includes(l)) return "#5c5968";
  if (l === "#f59e0b") return "#b45309";
  return c;
}

import { NextResponse } from "next/server";

// Activité publique des dépôts GitHub liés à l'apprentissage (aucun jeton : API publique, 60 requêtes/h/IP,
// donc mise en cache 1 h). Si un dépôt n'existe pas encore (python-journey), il est simplement ignoré.
// Seuls la 1re ligne du message, la date et le lien sont renvoyés.
export const revalidate = 3600;

const DEPOTS = ["DinoGLS/python-journey", "DinoGLS/portfolio-v2"];

interface Commit { repo: string; message: string; date: string; url: string }

export async function GET() {
  const commits: Commit[] = [];
  const depots: { repo: string; existe: boolean }[] = [];
  for (const repo of DEPOTS) {
    try {
      const r = await fetch(`https://api.github.com/repos/${repo}/commits?per_page=6`, {
        headers: { Accept: "application/vnd.github+json", "User-Agent": "portfolio-apprentissage" },
        next: { revalidate: 3600 },
      });
      if (!r.ok) { depots.push({ repo, existe: false }); continue; }
      const data = (await r.json()) as { html_url: string; commit: { message: string; author: { date: string } } }[];
      depots.push({ repo, existe: true });
      for (const c of data) {
        commits.push({ repo, message: c.commit.message.split("\n")[0].slice(0, 110), date: c.commit.author.date, url: c.html_url });
      }
    } catch {
      depots.push({ repo, existe: false });
    }
  }
  commits.sort((a, b) => (a.date < b.date ? 1 : -1));
  return NextResponse.json({ commits: commits.slice(0, 8), depots });
}

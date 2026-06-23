import { NextResponse } from "next/server";

const FEEDS = [
  { name: "CERT-FR", url: "https://www.cert.ssi.gouv.fr/feed/", color: "#3b82f6", tag: "CERT-FR" },
  { name: "The Hacker News", url: "https://feeds.feedburner.com/TheHackersNews", color: "#ef4444", tag: "THN" },
  { name: "BleepingComputer", url: "https://www.bleepingcomputer.com/feed/", color: "#8b5cf6", tag: "Bleeping" },
];

interface FeedItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  sourceColor: string;
  tag: string;
  description: string;
}

function extractText(xml: string, tag: string): string {
  const patterns = [
    new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`, "i"),
    new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"),
  ];
  for (const re of patterns) {
    const m = xml.match(re);
    if (m) return m[1].trim();
  }
  return "";
}

function parseItems(xml: string, source: string, color: string, tag: string): FeedItem[] {
  const itemPattern = /<item>([\s\S]*?)<\/item>/gi;
  const items: FeedItem[] = [];
  let match;
  while ((match = itemPattern.exec(xml)) !== null) {
    const block = match[1];
    const title = extractText(block, "title");
    const link = extractText(block, "link") || extractText(block, "guid");
    const pubDate = extractText(block, "pubDate") || extractText(block, "dc:date");
    const description = extractText(block, "description").replace(/<[^>]+>/g, "").slice(0, 180);
    if (title && link) {
      items.push({ title, link, pubDate, source, sourceColor: color, tag, description });
    }
  }
  return items;
}

export async function GET() {
  const results = await Promise.allSettled(
    FEEDS.map(async (feed) => {
      const res = await fetch(feed.url, {
        next: { revalidate: 1800 },
        headers: { "User-Agent": "Mozilla/5.0 Portfolio/1.0" },
      });
      if (!res.ok) throw new Error(`${feed.name}: ${res.status}`);
      const xml = await res.text();
      return parseItems(xml, feed.name, feed.color, feed.tag);
    })
  );

  const all: FeedItem[] = [];
  for (const r of results) {
    if (r.status === "fulfilled") all.push(...r.value.slice(0, 8));
  }

  all.sort((a, b) => {
    const da = a.pubDate ? new Date(a.pubDate).getTime() : 0;
    const db = b.pubDate ? new Date(b.pubDate).getTime() : 0;
    return db - da;
  });

  return NextResponse.json(
    { items: all.slice(0, 20), fetchedAt: new Date().toISOString() },
    { headers: { "Cache-Control": "s-maxage=1800, stale-while-revalidate=3600" } }
  );
}

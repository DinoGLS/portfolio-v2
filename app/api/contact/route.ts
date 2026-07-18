import { NextResponse } from "next/server";

// ────────────────────────────────────────────────────────────────────────────
// POST /api/contact
// 1. Honeypot   : si le champ piège est rempli => on ignore silencieusement.
// 2. Validation : champs obligatoires + format.
// 3. Triage IA  : Groq classe le message (spam / légitime). IMPORTANT : la clé
//                 GROQ_API_KEY reste côté serveur, jamais exposée au navigateur.
//                 On ne BLOQUE jamais sur l'IA (fail-open) pour ne pas perdre un
//                 vrai message — on se contente d'ÉTIQUETER les spams probables.
// 3. Envoi      : transmission à Web3Forms (gratuit, sans backend mail à gérer).
//
// Variables d'environnement requises (Vercel → Settings → Environment Variables) :
//   WEB3FORMS_ACCESS_KEY   (obligatoire)
//   GROQ_API_KEY           (facultatif : si absent, on saute le triage IA)
// ────────────────────────────────────────────────────────────────────────────

export const runtime = "nodejs";

type Payload = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  message?: string;
  company?: string; // honeypot
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clamp(s: unknown, max: number): string {
  return typeof s === "string" ? s.trim().slice(0, max) : "";
}

// Demande à Groq de classer le message. Renvoie true si spam probable.
// Ne lève jamais : en cas d'erreur/timeout, on renvoie false (fail-open).
async function isLikelySpam(text: string): Promise<boolean> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return false; // pas de clé => pas de triage

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);
  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        temperature: 0,
        max_tokens: 10,
        messages: [
          {
            role: "system",
            content:
              "You are a strict spam filter for a personal portfolio contact form. " +
              "Reply with a single word: SPAM if the message is clearly promotional, " +
              "a scam, SEO/link spam, or gibberish; otherwise HAM. When unsure, answer HAM.",
          },
          { role: "user", content: text },
        ],
      }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    const verdict: string =
      data?.choices?.[0]?.message?.content?.toString().toUpperCase() ?? "";
    return verdict.includes("SPAM");
  } catch {
    return false; // réseau / timeout => on ne bloque pas
  } finally {
    clearTimeout(timeout);
  }
}

export async function POST(req: Request) {
  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  // 1. Honeypot : on répond OK pour ne pas renseigner le bot, mais on n'envoie rien.
  if (clamp(body.company, 100).length > 0) {
    return NextResponse.json({ ok: true });
  }

  // 2. Validation serveur (ne jamais faire confiance au client).
  const firstName = clamp(body.firstName, 80);
  const lastName = clamp(body.lastName, 80);
  const email = clamp(body.email, 160);
  const phone = clamp(body.phone, 30);
  const message = clamp(body.message, 4000);

  if (!firstName || !lastName || !EMAIL_RE.test(email) || message.length < 10) {
    return NextResponse.json({ error: "validation" }, { status: 422 });
  }

  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  if (!accessKey) {
    // Mauvaise config serveur : on le log côté serveur, message générique au client.
    console.error("WEB3FORMS_ACCESS_KEY manquante.");
    return NextResponse.json({ error: "server_config" }, { status: 500 });
  }

  // 3. Triage IA (étiquetage, jamais blocage).
  const spam = await isLikelySpam(`${firstName} ${lastName} <${email}>\n${message}`);
  const subject = `${spam ? "[Spam probable] " : ""}Portfolio — message de ${firstName} ${lastName}`;

  // 4. On renvoie au client la clé d'accès et le sujet pour qu'il poste directement
  // à Web3Forms (qui bloque les requêtes serveur sur le plan gratuit).
  return NextResponse.json({
    ok: true,
    spam,
    subject,
    accessKey,
  });
}

// Version publique (Vercel) : sans le tableau de synthèse E5.
// Vercel définit la variable VERCEL pendant le build (voir next.config.ts) ; pour tester en local :
//   SANS_SYNTHESE=1 npm run dev
// La version auto-hébergée (portfolio.gls) garde le tableau de synthèse.
export const SANS_SYNTHESE = process.env.NEXT_PUBLIC_SANS_SYNTHESE === "1";

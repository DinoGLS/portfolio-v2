import BlueprintProject, { BPData } from "@/app/components/projects/BlueprintProject";

const data: BPData = {
  tag: { fr: "DEV · MOBILE · SÉCURITÉ", en: "DEV · MOBILE · SECURITY" },
  title: { fr: "N.C0re — app fitness chiffrée, offline-first", en: "N.C0re — encrypted, offline-first fitness app" },
  subtitle: {
    fr: "App mobile React Native de suivi fitness — développée en solo, installée sur mon téléphone. Les données de santé sont chiffrées localement en AES-256-GCM (clé dans le trousseau natif) et l'IA de recommandation tourne entièrement sur l'appareil, sans serveur.",
    en: "React Native fitness-tracking mobile app — built solo, installed on my own phone. Health data is encrypted locally with AES-256-GCM (key in the native keychain) and the recommendation AI runs fully on-device, no server.",
  },
  status: { fr: "En cours", en: "In progress" },
  breadcrumb: "garlens — portfolio/projets/n-core",
  badges: [
    { label: "React Native", color: "#4cc4ff" },
    { label: "Expo SDK 56", color: "#bfe3ff" },
    { label: "TypeScript", color: "#4cc4ff" },
    { label: "AES-256-GCM", color: "#ff8f6b" },
    { label: "expo-secure-store", color: "#bfe3ff" },
    { label: "Zustand", color: "#4cc4ff" },
    { label: "WebGL / 3D", color: "#bfe3ff" },
  ],
  files: [
    { name: "n-core", icon: "▾", indent: 0, kind: "folder" },
    { name: "README.md", icon: "≡", indent: 1, kind: "active" },
    { name: "secure-storage.ts", icon: "⌘", indent: 1 },
    { name: "ai-engine.ts", icon: "⌘", indent: 1 },
    { name: "store/index.ts", icon: "⌘", indent: 1 },
    { name: "AnatomyBody.tsx", icon: "⌘", indent: 1 },
    { name: "app-intro.png", icon: "▣", indent: 1 },
  ],
  tabs: ["README.md", "secure-storage.ts", "ai-engine.ts"],
  gallery: [
    { src: "/projects/n-core/mood.png", label: { fr: "Calibrage IA", en: "AI calibration" } },
    { src: "/projects/n-core/coach-ia.png", label: { fr: "Coach IA local", en: "Local AI coach" } },
    { src: "/projects/n-core/seance.png", label: { fr: "Séance / logger", en: "Session / logger" } },
    { src: "/projects/n-core/programme.png", label: { fr: "Programme PPL", en: "PPL program" } },
    { src: "/projects/n-core/progres.png", label: { fr: "Progrès", en: "Progress" } },
    { src: "/projects/n-core/perfs.png", label: { fr: "Perfs", en: "Performance" } },
  ],
  steps: [
    {
      num: "01",
      color: "#ff8f6b",
      title: { fr: "Chiffrement local des données de santé", en: "Local health-data encryption" },
      subtitle: { fr: "AES-256-GCM · clé dans le trousseau natif", en: "AES-256-GCM · key in native keychain" },
      desc: {
        fr: "Tout le store (dont le suivi de cycle menstruel, donnée sensible) est chiffré en AES-256-GCM. La clé maître 256 bits est générée par CSPRNG et vit dans le Keychain iOS / Keystore Android via expo-secure-store, jamais dans AsyncStorage. IV aléatoire de 12 octets à chaque écriture.",
        en: "The whole store (including menstrual-cycle tracking, sensitive data) is AES-256-GCM encrypted. The 256-bit master key is CSPRNG-generated and lives in the iOS Keychain / Android Keystore via expo-secure-store, never in AsyncStorage. Fresh 12-byte IV on every write.",
      },
      lang: "typescript",
      code:
        "const getMasterKey = async () => {\n  const stored = await SecureStore.getItemAsync(MASTER_KEY_ID);\n  if (stored) return b64ToBytes(stored);\n  const fresh = Crypto.getRandomBytes(32); // 256-bit CSPRNG\n  await SecureStore.setItemAsync(MASTER_KEY_ID, bytesToB64(fresh), {\n    keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,\n  });\n  return fresh;\n};",
    },
    {
      num: "02",
      color: "#4cc4ff",
      title: { fr: "IA locale, zéro API externe", en: "On-device AI, zero external API" },
      subtitle: { fr: "moteur de recommandation offline-first", en: "offline-first recommendation engine" },
      desc: {
        fr: "Le moteur d'IA (plans d'entraînement + nutrition) tourne entièrement sur l'appareil : aucune donnée de santé ne transite par un serveur tiers. Un choix de privacy/security by design qui réduit la surface d'exposition.",
        en: "The AI engine (workout + nutrition plans) runs fully on-device: no health data ever leaves for a third-party server. A privacy/security-by-design choice that shrinks the attack surface.",
      },
      lang: "typescript",
      code:
        "const ct = gcm(key, iv).encrypt(utf8ToBytes(plain)); // ciphertext||tag\nawait AsyncStorage.setItem(name, ENC_PREFIX + bytesToB64(concat(iv, ct)));",
    },
    {
      num: "03",
      color: "#bfe3ff",
      title: { fr: "Migration de données sécurisée", en: "Secure data migration" },
      subtitle: { fr: "clair → chiffré, sans perte", en: "plaintext → encrypted, lossless" },
      desc: {
        fr: "Migration transparente de l'ancien store en clair (ncore-store-v2) vers le format chiffré (ncore-enc-v1:), avec sauvegarde conservée pendant la bascule. Base64 réimplémenté à la main (Hermes n'expose ni Buffer ni btoa fiable).",
        en: "Transparent migration from the old plaintext store (ncore-store-v2) to the encrypted format (ncore-enc-v1:), keeping a backup during the switch. Base64 hand-rolled (Hermes exposes neither Buffer nor a reliable btoa).",
      },
    },
    {
      num: "04",
      color: "#4cc4ff",
      title: { fr: "Anatomie 3D temps réel (WebGL)", en: "Real-time 3D anatomy (WebGL)" },
      subtitle: { fr: "heatmap musculaire interactive", en: "interactive muscle heatmap" },
      desc: {
        fr: "Un vrai corps 3D WebGL manipulable : les groupes musculaires travaillés s'illuminent selon la séance et le suivi hebdo. Trois vues — heatmap de la semaine, détail exercice, séance en direct.",
        en: "A real, draggable WebGL 3D body: worked muscle groups light up based on the session and weekly tracking. Three views — weekly heatmap, exercise detail, live session.",
      },
    },
  ],
  planned: [
    { fr: "Synchronisation chiffrée multi-appareils (bout-en-bout)", en: "End-to-end encrypted multi-device sync" },
    { fr: "Export / import chiffré des données perso", en: "Encrypted export / import of personal data" },
    { fr: "Publication sur les stores (build de release EAS)", en: "Store publishing (EAS release build)" },
    { fr: "Durcissement : détection root/jailbreak, verrou biométrique", en: "Hardening: root/jailbreak detection, biometric lock" },
  ],
  skills: [
    { domain: { fr: "Cryptographie appliquée", en: "Applied cryptography" }, skills: { fr: "AES-256-GCM authentifié, clé hors app (trousseau natif), CSPRNG, IV unique", en: "authenticated AES-256-GCM, key outside the app (native keychain), CSPRNG, unique IV" } },
    { domain: { fr: "Sécurité mobile", en: "Mobile security" }, skills: { fr: "stockage sensible chiffré, données de santé, privacy by design", en: "encrypted sensitive storage, health data, privacy by design" } },
    { domain: { fr: "Architecture offline-first", en: "Offline-first architecture" }, skills: { fr: "IA on-device, réduction de la surface d'exposition", en: "on-device AI, reduced attack surface" } },
    { domain: { fr: "Backend / données", en: "Backend / data" }, skills: { fr: "store typé, sérialisation, migration en prod sans perte", en: "typed store, serialization, lossless production migration" } },
    { domain: { fr: "React Native / Expo", en: "React Native / Expo" }, skills: { fr: "Expo Router, dev client EAS, UI custom, thème tokenisé", en: "Expo Router, EAS dev client, custom UI, tokenized theme" } },
    { domain: { fr: "3D / rendu", en: "3D / rendering" }, skills: { fr: "WebGL, mapping musculaire, animation d'état temps réel", en: "WebGL, muscle mapping, real-time state animation" } },
  ],
  statusBar: [
    "⎇ main",
    "React Native · Expo SDK 56",
    { fr: "chiffré AES-256-GCM", en: "AES-256-GCM encrypted" },
    "TypeScript",
  ],
};

export default function NCorePage() {
  return <BlueprintProject variant="ide" data={data} />;
}

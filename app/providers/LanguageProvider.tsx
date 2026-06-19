"use client";

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { type Lang, LANGS, translate } from "@/app/lib/i18n";

const STORAGE_KEY = "portfolio-lang";

const listeners = new Set<() => void>();
function emit() {
  listeners.forEach((l) => l());
}
function subscribe(cb: () => void) {
  listeners.add(cb);
  if (typeof window !== "undefined") window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    if (typeof window !== "undefined") window.removeEventListener("storage", cb);
  };
}
function getSnapshot(): Lang {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved === "fr" || saved === "en") return saved;
  const nav = window.navigator.language?.toLowerCase() ?? "fr";
  return nav.startsWith("en") ? "en" : "fr";
}
function getServerSnapshot(): Lang {
  return "fr";
}

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const lang = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Synchronise <html lang="…"> (DOM only, pas de setState).
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    window.localStorage.setItem(STORAGE_KEY, next);
    emit();
  }, []);

  const toggleLang = useCallback(() => {
    setLang(getSnapshot() === "fr" ? "en" : "fr");
  }, [setLang]);

  const t = useCallback((key: string) => translate(lang, key), [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage doit être utilisé dans <LanguageProvider>.");
  return ctx;
}

export { LANGS };

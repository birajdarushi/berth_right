"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { translations, type Language } from "./translations";

// The hi/mr dictionaries have the same shape as en but different string
// literals, which TypeScript would otherwise reject as "not assignable" to
// `typeof translations.en`. Widen every leaf to `string` so any dictionary
// with matching keys satisfies the type.
type Widen<T> = { [K in keyof T]: T[K] extends string ? string : Widen<T[K]> };
type TranslationDict = Widen<typeof translations.en>;

interface I18nContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: TranslationDict;
}

const LANGUAGE_STORAGE_KEY = "berth-right-language";

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLang = (localStorage.getItem(LANGUAGE_STORAGE_KEY) ||
      sessionStorage.getItem(LANGUAGE_STORAGE_KEY)) as Language | null;
    if (savedLang === "en" || savedLang === "hi" || savedLang === "mr") {
      setLangState(savedLang);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
      sessionStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
    } catch {
      // ignore storage errors
    }
  };

  const toggleLang = () => {
    const next: Language = lang === "en" ? "hi" : lang === "hi" ? "mr" : "en";
    setLang(next);
  };

  // During SSR or before client mount, default to 'en', otherwise use selected language dictionary
  const currentTranslations = translations[mounted ? lang : "en"] || translations.en;

  return (
    <I18nContext.Provider
      value={{
        lang,
        setLang,
        toggleLang,
        t: currentTranslations,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return ctx;
}

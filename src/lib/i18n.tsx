"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { ScrollTrigger } from "@/lib/gsap";
import { revealInView } from "@/lib/useReveal";
import {
  DEFAULT_LANG,
  DICTIONARIES,
  type Dictionary,
  type Lang,
} from "@/lib/dictionary";

const STORAGE_KEY = "nunforge:lang";

type Ctx = {
  lang: Lang;
  setLang: (next: Lang) => void;
  t: Dictionary;
};

const LanguageContext = createContext<Ctx>({
  lang: DEFAULT_LANG,
  setLang: () => {},
  t: DICTIONARIES[DEFAULT_LANG],
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  const apply = useCallback((next: Lang) => {
    const root = document.documentElement;
    root.lang = DICTIONARIES[next].locale;
    root.dir = DICTIONARIES[next].dir;
  }, []);

  // Restore a previous choice. English is the default, so a first-time
  // visitor keeps exactly what the server rendered.
  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      stored = null;
    }
    if (stored === "ar" || stored === "en") {
      setLangState(stored);
      apply(stored);
      requestAnimationFrame(() => revealInView());
    }
  }, [apply]);

  const setLang = useCallback(
    (next: Lang) => {
      setLangState(next);
      apply(next);
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        /* private mode — the choice just won't persist */
      }
      // Copy length changes section heights, so every scroll trigger and the
      // orb's journey need to re-measure — and any element React rebuilt for
      // the new language has to be shown again.
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        revealInView();
      });
    },
    [apply]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: DICTIONARIES[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}

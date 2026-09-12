"use client";

import { useLang } from "@/lib/i18n";
import type { Lang } from "@/lib/dictionary";
import styles from "./LanguageToggle.module.css";

const OPTIONS: { code: Lang; key: "en" | "ar" }[] = [
  { code: "en", key: "en" },
  { code: "ar", key: "ar" },
];

export default function LanguageToggle({ large = false }: { large?: boolean }) {
  const { lang, setLang, t } = useLang();

  return (
    <div
      className={`${styles.toggle} ${large ? styles.large : ""}`}
      role="group"
      aria-label={t.lang.toggle}
    >
      {OPTIONS.map(({ code, key }) => (
        <button
          key={code}
          type="button"
          className={styles.option}
          aria-pressed={lang === code}
          lang={code}
          onClick={() => setLang(code)}
        >
          {t.lang[key]}
        </button>
      ))}
    </div>
  );
}

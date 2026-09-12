"use client";

import { useReveal } from "@/lib/useReveal";
import { useLang } from "@/lib/i18n";
import Bidi from "./Bidi";
import styles from "./Concept.module.css";

export default function Concept() {
  const revealRef = useReveal<HTMLElement>();
  const { t } = useLang();

  return (
    <section
      id="concept"
      ref={revealRef}
      className={`section ${styles.section}`}
    >
      <div className={`shell ${styles.grid}`}>
        <div className={styles.copy}>
          <span className="eyebrow reveal">{t.concept.eyebrow}</span>
          <h2 className="h2 reveal">{t.concept.heading}</h2>

          {t.concept.body.map((paragraph, i) => (
            <p key={i} className={`${styles.body} reveal`}>
              <Bidi text={paragraph} />
            </p>
          ))}

          <blockquote className={`${styles.quote} amiri reveal`}>
            {t.concept.quote}
          </blockquote>
        </div>

        {/* Left column is deliberately empty: the background orb drifts into
            it as this section scrolls in. */}
        <div className={styles.stage} aria-hidden />
      </div>
    </section>
  );
}

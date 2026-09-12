"use client";

import { useReveal } from "@/lib/useReveal";
import { useLang } from "@/lib/i18n";
import { STACK } from "@/lib/dictionary";
import styles from "./Expertise.module.css";

export default function Expertise() {
  // Calmer than the hero on purpose: a short stagger, nothing else.
  const ref = useReveal<HTMLElement>(0.045);
  const { t } = useLang();

  return (
    <section id="expertise" ref={ref} className="section">
      <div className="shell">
        <span className="eyebrow reveal">{t.expertise.eyebrow}</span>
        <h2 className="h2 reveal">{t.expertise.heading}</h2>
        <p className="lede reveal">{t.expertise.sub}</p>

        <div className={styles.chips}>
          {STACK.map((item) => (
            <span key={item} className={`${styles.chip} reveal`}>
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

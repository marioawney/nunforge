"use client";

import { useReveal } from "@/lib/useReveal";
import { useLang } from "@/lib/i18n";
import styles from "./Contact.module.css";

export default function Contact() {
  const ref = useReveal<HTMLElement>();
  const { t } = useLang();

  return (
    <section id="contact" ref={ref} className={`section ${styles.section}`}>
      <div className={`shell ${styles.inner}`}>
        <span className="eyebrow reveal">{t.contact.eyebrow}</span>
        <h2 className={`${styles.heading} reveal`}>{t.contact.heading}</h2>
        <p className="lede reveal">{t.contact.sub}</p>

        <div className={`${styles.buttons} reveal`}>
          <a
            href="https://wa.me/201277444422"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-gold"
          >
            {t.contact.whatsapp}
          </a>
          <a href="mailto:peroalbert@gmail.com" className="btn btn-ghost">
            {t.contact.email}
          </a>
        </div>
      </div>
    </section>
  );
}

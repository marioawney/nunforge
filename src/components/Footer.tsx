"use client";

import { useLang } from "@/lib/i18n";
import styles from "./Footer.module.css";

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className={styles.footer}>
      <div className={`shell ${styles.inner}`}>
        <span>
          <span dir="ltr">{t.footer.brand}</span> {t.footer.rights}
        </span>
        <span className={styles.credit}>{t.footer.credit}</span>
      </div>
    </footer>
  );
}

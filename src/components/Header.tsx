"use client";

import { useEffect, useState } from "react";
import { lockScroll } from "@/lib/scrollLock";
import { useLang } from "@/lib/i18n";
import LanguageToggle from "./LanguageToggle";
import BrandMark from "./BrandMark";
import styles from "./Header.module.css";

export default function Header() {
  const { t } = useLang();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > window.innerHeight * 0.72);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    lockScroll(open);
    return () => lockScroll(false);
  }, [open]);

  return (
    <>
      <header className={styles.header} data-solid={solid}>
        <div className={styles.inner}>
          <a href="#top" className={styles.mark} aria-label="Nunforge">
            <BrandMark className={styles.markIcon} />
            <span className={styles.markText}>
              NUN<span>forge</span>
            </span>
          </a>

          <nav className={styles.nav} aria-label={t.a11y.nav}>
            {t.nav.map((l) => (
              <a key={l.href} href={l.href} className={styles.link}>
                {l.label}
              </a>
            ))}
            <LanguageToggle />
          </nav>

          <div className={styles.compact}>
            <LanguageToggle />
            <button
              type="button"
              className={styles.burger}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? t.a11y.closeMenu : t.a11y.openMenu}
              onClick={() => setOpen((v) => !v)}
            >
              <i />
            </button>
          </div>
        </div>
      </header>

      <div id="mobile-menu" className={styles.overlay} data-open={open}>
        {t.nav.map((l, i) => (
          <a
            key={l.href}
            href={l.href}
            className={styles.overlayLink}
            style={{ transitionDelay: open ? `${0.08 + i * 0.06}s` : "0s" }}
            onClick={() => setOpen(false)}
          >
            {l.label}
          </a>
        ))}
      </div>
    </>
  );
}

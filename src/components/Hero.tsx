"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useMotionMode } from "@/lib/useMotionMode";
import { useLang } from "@/lib/i18n";
import Bidi from "./Bidi";
import styles from "./Hero.module.css";

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const { mode, ready, animate } = useMotionMode();
  const { t } = useLang();

  const isStatic = ready && mode === "reduced";

  useLayoutEffect(() => {
    if (!ready) return;
    const el = root.current;
    if (!el) return;

    if (!animate) {
      el.dataset.ready = "true";
      return;
    }

    const ctx = gsap.context(() => {
      const intro = gsap.utils.toArray<HTMLElement>(`.${styles.intro}`);
      el.dataset.ready = "true";

      // `from`, not `to`: the copy is already on screen at full strength and
      // merely settles into place, so nothing is ever waiting to appear.
      gsap.from(intro, {
        opacity: 0.45,
        y: 12,
        duration: 0.8,
        stagger: 0.06,
        ease: "power2.out",
      });

      // Scrolling hands the hero over to the next section.
      const scrub = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.7,
          invalidateOnRefresh: true,
        },
      });

      scrub
        .to(`.${styles.content}`, { opacity: 0, y: -70, ease: "none" }, 0)
        .to(`.${styles.rings}`, { opacity: 0, scale: 1.22, ease: "none" }, 0)
        .to(
          `.${styles.scrollHint}`,
          { opacity: 0, ease: "none", duration: 0.25 },
          0
        );

      ScrollTrigger.refresh();
    }, el);

    return () => ctx.revert();
  }, [ready, animate]);

  return (
    <section id="top" ref={root} className={styles.hero} data-static={isStatic}>
      <div className={styles.sticky}>
        <div className={styles.rings} aria-hidden />
        <div className={styles.scrim} aria-hidden />

        <div className={styles.content}>
          <p className={`${styles.kicker} ${styles.intro}`}>{t.hero.kicker}</p>
          <h1 className={`${styles.wordmark} ${styles.intro}`}>Nunforge</h1>
          <p className={`${styles.tagline} ${styles.intro}`}>
            <Bidi text={t.hero.tagline} />
          </p>
          <div className={`${styles.ctas} ${styles.intro}`}>
            <a href="#projects" className="btn btn-gold">
              {t.hero.primary}
            </a>
            <a href="#contact" className="btn btn-ghost">
              {t.hero.ghost}
            </a>
          </div>
        </div>

        <div className={styles.scrollHint} aria-hidden>
          <span>Scroll</span>
          <i />
        </div>
      </div>
    </section>
  );
}

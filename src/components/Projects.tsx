"use client";

import { useReveal } from "@/lib/useReveal";
import { useLang } from "@/lib/i18n";
import Bidi from "./Bidi";
import styles from "./Projects.module.css";

export default function Projects() {
  const ref = useReveal<HTMLElement>(0.05);
  const { t } = useLang();

  return (
    <section id="projects" ref={ref} className="section">
      <div className="shell">
        <span className="eyebrow reveal">{t.projects.eyebrow}</span>
        <h2 className="h2 reveal">{t.projects.heading}</h2>
        <p className="lede reveal">{t.projects.sub}</p>

        <ol className={styles.list}>
          {t.projects.items.map((project, i) => (
            <li key={project.title} className={`${styles.row} reveal`}>
              <span className={`${styles.num} amiri`} aria-hidden>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className={styles.title}>
                  <bdi>{project.title}</bdi>
                </h3>
                <p className={styles.desc}>
                  <Bidi text={project.desc} />
                </p>
                <div className={styles.tags}>
                  {project.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

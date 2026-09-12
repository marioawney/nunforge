"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Reveals every `.reveal` element that is already at or above the fold.
 *
 * Switching language remounts some elements, and a fresh node does not carry
 * the `.is-in` class its predecessor was given — it would sit at opacity 0
 * forever, because its section's one-shot trigger has already fired. This
 * sweep catches them.
 */
export function revealInView(root: ParentNode = document) {
  const limit = window.innerHeight * 0.95;
  root.querySelectorAll<HTMLElement>(".reveal:not(.is-in)").forEach((node) => {
    if (node.getBoundingClientRect().top < limit) node.classList.add("is-in");
  });
}

/**
 * Adds `.is-in` to every `.reveal` descendant once the section enters view,
 * with a small stagger. The transition itself lives in CSS so the
 * reduced-motion media query can flatten it for free.
 */
export function useReveal<T extends HTMLElement>(stagger = 0.09) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.utils
        .toArray<HTMLElement>(".reveal", el)
        .forEach((n) => n.classList.add("is-in"));
      return;
    }

    const timers: number[] = [];
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 80%",
      once: true,
      onEnter: () => {
        // Queried here, not at mount: the nodes may have been replaced since
        // (a language switch rebuilds the copy).
        gsap.utils.toArray<HTMLElement>(".reveal", el).forEach((node, i) => {
          timers.push(
            window.setTimeout(() => node.classList.add("is-in"), i * stagger * 1000)
          );
        });
      },
    });

    return () => {
      timers.forEach(clearTimeout);
      trigger.kill();
    };
  }, [stagger]);

  return ref;
}

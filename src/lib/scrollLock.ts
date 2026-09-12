"use client";

import type Lenis from "lenis";

let instance: Lenis | null = null;

export function registerLenis(lenis: Lenis | null) {
  instance = lenis;
}

/** Freezes both native scrolling and Lenis' inertia (mobile menu overlay). */
export function lockScroll(locked: boolean) {
  document.body.style.overflow = locked ? "hidden" : "";
  if (locked) instance?.stop();
  else instance?.start();
}

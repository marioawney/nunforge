"use client";

import { useEffect, useState } from "react";

/**
 * full    — desktop-class device: full particle field, highest DPR.
 * lite    — mid-range / narrow desktop: WebGL stays, particle count and DPR drop.
 * flat    — phones: no WebGL (it makes scrolling stutter), but the scroll
 *           choreography still runs over the CSS stand-ins.
 * reduced — prefers-reduced-motion or no WebGL: nothing moves on scroll at all.
 */
export type MotionMode = "full" | "lite" | "flat" | "reduced";

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

function detect(): MotionMode {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return "reduced";
  }
  if (!supportsWebGL()) return "reduced";

  const nav = navigator as Navigator & { deviceMemory?: number };
  const cores = nav.hardwareConcurrency ?? 8;
  const memory = nav.deviceMemory ?? 8;
  const coarse = window.matchMedia("(pointer: coarse)").matches;

  // A full-bleed particle canvas is the main cause of janky scrolling on
  // phones, so they get the CSS composition instead.
  if (coarse && window.innerWidth < 820) return "flat";
  if (cores <= 4 || memory <= 4 || window.innerWidth < 820) return "lite";
  return "full";
}

export function useMotionMode() {
  // SSR and the first paint assume "reduced" so nothing heavy is ever
  // rendered before we know what the device can take.
  const [mode, setMode] = useState<MotionMode>("reduced");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const update = () => setMode(detect());
    update();
    setReady(true);

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    mq.addEventListener("change", update);
    window.addEventListener("resize", update);
    return () => {
      mq.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return {
    mode,
    ready,
    /** WebGL scenes render at all. */
    canvasOn: ready && (mode === "full" || mode === "lite"),
    /** Scroll-driven animation runs (everything except `reduced`). */
    animate: ready && mode !== "reduced",
    quality: mode === "full" ? ("full" as const) : ("lite" as const),
  };
}

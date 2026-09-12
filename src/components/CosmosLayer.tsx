"use client";

import dynamic from "next/dynamic";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { cosmos } from "@/lib/cosmos";
import { useMotionMode } from "@/lib/useMotionMode";
import styles from "./CosmosLayer.module.css";

const CosmosScene = dynamic(() => import("./three/CosmosScene"), { ssr: false });

/**
 * The one visual that carries the whole story: Ra's disc rising out of Nun.
 * It lives in a single fixed layer behind every section rather than inside
 * any one of them, so it is on screen the instant the page opens and simply
 * travels as the visitor scrolls.
 */
export default function CosmosLayer() {
  const layer = useRef<HTMLDivElement>(null);
  const orb = useRef<HTMLDivElement>(null);
  const { canvasOn, animate, quality, ready } = useMotionMode();
  const [sceneUp, setSceneUp] = useState(false);
  const onSceneReady = useCallback(() => setSceneUp(true), []);

  // Load: the disc is already alight, then the waters finish arriving.
  useLayoutEffect(() => {
    if (!ready) return;
    if (!animate) {
      cosmos.form = 1;
      return;
    }
    // Opens already lit — what is left to animate is the last of the water
    // arriving, not the disc appearing.
    cosmos.form = 0.8;
    const tween = gsap.to(cosmos, {
      form: 1,
      duration: 2.2,
      ease: "power2.out",
    });
    return () => {
      tween.kill();
    };
  }, [ready, animate]);

  // The CSS stand-in makes the same journey, in broad strokes.
  useLayoutEffect(() => {
    if (!ready || canvasOn || !animate) return;
    const el = orb.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const scrubbed = (
        trigger: string,
        start: string,
        end: string,
        vars: gsap.TweenVars
      ) => {
        const target = document.querySelector(trigger);
        if (!target) return;
        gsap.to(el, {
          ...vars,
          ease: "none",
          scrollTrigger: { trigger: target, start, end, scrub: 0.6 },
        });
      };

      const side = document.documentElement.dir === "rtl" ? -1 : 1;
      gsap.set(el, { yPercent: 0 });
      scrubbed("#concept", "top bottom", "center center", {
        xPercent: 26 * side,
        yPercent: 0,
        scale: 0.92,
      });
      scrubbed("#expertise", "top bottom", "top center", { opacity: 0.28 });
      scrubbed("#contact", "top bottom", "center center", {
        opacity: 0.85,
        xPercent: 0,
        yPercent: 26,
        scale: 1.05,
      });
      ScrollTrigger.refresh();
    }, el);

    return () => ctx.revert();
  }, [ready, canvasOn, animate]);

  return (
    <div className={styles.layer} ref={layer} aria-hidden>
      {/* Pure CSS, so the glow is in the very first paint — before the
          bundle, before WebGL. The canvas cross-fades over it. */}
      <div
        className={styles.orb}
        ref={orb}
        data-base={canvasOn}
        data-hidden={canvasOn && sceneUp}
      />
      {canvasOn && <CosmosScene quality={quality} onReady={onSceneReady} />}
    </div>
  );
}

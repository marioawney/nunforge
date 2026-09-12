"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { registerLenis } from "@/lib/scrollLock";

/**
 * Global inertia scrolling (Lenis) driven off the GSAP ticker so that every
 * ScrollTrigger scrub in the page stays in lockstep with the smoothed
 * scroll position instead of the raw browser one.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let lenis: Lenis | null = null;
    let raf: ((time: number) => void) | null = null;

    if (!reduced) {
      lenis = new Lenis({
        // lerp reads lighter under the finger than a fixed duration, which
        // made the first screen feel heavy.
        lerp: 0.11,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
        smoothWheel: true,
        // Native scrolling on touch: smoothing it is what stutters on phones.
        syncTouch: false,
      });

      lenis.on("scroll", ScrollTrigger.update);
      registerLenis(lenis);
      (window as Window & { __lenis?: Lenis }).__lenis = lenis;

      raf = (time: number) => lenis?.raf(time * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
    }

    // In-page links: let Lenis own the jump so it can't fight the native one
    // (which was landing on the wrong section), and clear the fixed header.
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey) {
        return;
      }
      const anchor = (event.target as HTMLElement | null)?.closest?.(
        'a[href^="#"]'
      ) as HTMLAnchorElement | null;
      if (!anchor) return;

      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;
      const target = document.querySelector(hash);
      if (!target) return;

      event.preventDefault();

      if (lenis) {
        // Resolve the destination ourselves: passing the element leaves the
        // header offset up to whether Lenis reads scroll-margin, which it
        // does inconsistently across versions.
        const header =
          parseInt(
            getComputedStyle(document.documentElement).getPropertyValue(
              "--header-h"
            ),
            10
          ) || 76;
        const top =
          target.getBoundingClientRect().top +
          window.scrollY -
          (hash === "#top" ? 0 : header);
        lenis.scrollTo(top, { duration: 1.1 });
      } else {
        (target as HTMLElement).scrollIntoView();
      }

      history.replaceState(null, "", hash);
    };

    document.addEventListener("click", onClick);

    // react-use-measure occasionally misses its first read (the canvas then
    // renders into a 300x150 buffer stretched over the section). One resize
    // tick after paint forces every observer to re-read.
    const nudge = window.setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
      ScrollTrigger.refresh();
    }, 350);

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    ScrollTrigger.refresh();

    return () => {
      window.clearTimeout(nudge);
      document.removeEventListener("click", onClick);
      window.removeEventListener("load", onLoad);
      if (raf) gsap.ticker.remove(raf);
      registerLenis(null);
      delete (window as Window & { __lenis?: Lenis }).__lenis;
      lenis?.destroy();
    };
  }, []);

  return null;
}

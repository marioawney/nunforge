"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// registerPlugin is idempotent, so re-importing this module is safe.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

if (process.env.NODE_ENV !== "production" && typeof window !== "undefined") {
  // Dev-only handles for inspecting timelines from the console.
  Object.assign(window, { gsap, ScrollTrigger });
}

export { gsap, ScrollTrigger };

"use client";

/**
 * Shared state for the one background scene. It is a module singleton because
 * exactly one <CosmosLayer /> exists per page, and both the load timeline
 * (GSAP) and the render loop (R3F) need to write/read it every frame without
 * going through React.
 */
export type CosmosState = {
  /** 0 = formless water, 1 = the disc has fully coalesced. Driven on load. */
  form: number;
};

export const cosmos: CosmosState = { form: 0.5 };

export type Keyframe = {
  /** Scroll position, in px, at which this pose is reached. */
  at: number;
  pos: [number, number, number];
  scale: number;
  /** Ring visibility, 0..1. */
  rings: number;
  /** Overall brightness, 0..1. */
  dim: number;
};

export function smoothstep(t: number) {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/** Piecewise-interpolates the orb's pose for a scroll position. */
export function poseAt(frames: Keyframe[], y: number): Omit<Keyframe, "at"> {
  if (!frames.length) {
    return { pos: [0, 0, 0], scale: 1, rings: 0, dim: 1 };
  }
  if (y <= frames[0].at) return frames[0];
  const last = frames[frames.length - 1];
  if (y >= last.at) return last;

  let i = 0;
  while (i < frames.length - 1 && y > frames[i + 1].at) i++;
  const a = frames[i];
  const b = frames[i + 1];
  const t = smoothstep((y - a.at) / Math.max(1, b.at - a.at));

  return {
    pos: [
      lerp(a.pos[0], b.pos[0], t),
      lerp(a.pos[1], b.pos[1], t),
      lerp(a.pos[2], b.pos[2], t),
    ],
    scale: lerp(a.scale, b.scale, t),
    rings: lerp(a.rings, b.rings, t),
    dim: lerp(a.dim, b.dim, t),
  };
}

/**
 * Builds the orb's journey from the real section offsets: it sits behind the
 * wordmark, drifts to the empty column in الفكرة, sinks far back and dim
 * through the list sections, then returns low and centred for تواصل.
 */
export function buildJourney(): Keyframe[] {
  const vh = window.innerHeight;
  // +1 puts the orb on the right. The empty column of the الفكرة / The Idea
  // section is on the left in RTL and on the right in LTR, so the whole
  // journey mirrors with the writing direction.
  const side = document.documentElement.dir === "rtl" ? -1 : 1;
  const top = (id: string) => {
    const el = document.querySelector(id);
    if (!el) return 0;
    return el.getBoundingClientRect().top + window.scrollY;
  };
  const height = (id: string) =>
    document.querySelector(id)?.getBoundingClientRect().height ?? vh;

  const heroEnd = Math.max(1, top("#concept") - vh);
  const conceptMid = top("#concept") + height("#concept") * 0.5 - vh * 0.5;
  const expertise = top("#expertise") - vh * 0.4;
  const projectsEnd = top("#projects") + height("#projects") - vh;
  const contactMid = top("#contact") + height("#contact") * 0.5 - vh * 0.55;

  return [
    { at: 0, pos: [0, 1.05, 0], scale: 1, rings: 0, dim: 1 },
    { at: heroEnd, pos: [0.6 * side, 1.5, -1.4], scale: 0.86, rings: 0.55, dim: 0.9 },
    { at: conceptMid, pos: [1.95 * side, 0, 0], scale: 0.96, rings: 1, dim: 1 },
    { at: expertise, pos: [1.1 * side, 0.7, -3], scale: 0.72, rings: 0.5, dim: 0.16 },
    {
      at: projectsEnd,
      pos: [-1.3 * side, -0.5, -4.2],
      scale: 0.62,
      rings: 0.35,
      dim: 0.1,
    },
    { at: contactMid, pos: [0, -1.5, -0.6], scale: 1.06, rings: 0.5, dim: 0.62 },
  ];
}

# Nunforge

Marketing site for **Nunforge**, a software studio in Egypt.

The whole page is built on one metaphor: **Nun**, the primordial dark waters of
Egyptian myth, and **Ra** rising out of them. Black is the formless idea, gold
is the finished product — and the page performs that transformation rather than
just describing it.

## Stack

- **Next.js 15** (App Router) + TypeScript
- **Three.js** via **@react-three/fiber** / **@react-three/drei** — the hero
  emergence and the concept rings
- **GSAP + ScrollTrigger** — scroll-scrubbed timelines
- **Lenis** — inertia smooth scrolling, driven off the GSAP ticker so scrubs
  stay in lockstep
- CSS Modules + a token layer in `src/app/globals.css` (no Tailwind)

## Running it

```bash
npm run dev     # http://localhost:3000
npm run build
npm start
```

## How the story is wired

| Section | File | What the motion does |
| --- | --- | --- |
| Background | `src/components/CosmosLayer.tsx`, `three/CosmosScene.tsx`, `lib/cosmos.ts` | **One** fixed scene behind the entire page: the particle field (the waters) and Ra's disc. It is already alight on first paint, the field finishes arriving over ~2.6 s, and from then on scroll position alone moves it — `lib/cosmos.ts` holds the keyframed journey, built from the real section offsets. Because it is fixed and full-bleed it can never show a clipped edge. |
| Hero | `src/components/Hero.tsx` | Owns only type and CTAs; the disc behind the wordmark belongs to the background layer. The name resolves 0.25 s after load rather than after the emergence. |
| Concept | `src/components/Concept.tsx` | Text right, and an empty left column the background orb drifts into as the section scrolls in. Ring rotation is bound to **scroll position**, not elapsed time — the visitor turns it. |
| Expertise | `src/components/Expertise.tsx` | Deliberately calm: a short staggered reveal on the chips, nothing more. |
| Projects | `src/components/Projects.tsx` | The "monument list" — large faint Amiri numerals, hairline rules that light up left-to-right on hover. |
| Contact | `src/components/Contact.tsx` | The orb returns, low and centred, so the page ends where it began. |
| Everywhere | `src/components/FloatingContact.tsx` | A floating WhatsApp shortcut that fades in once past the hero. |

## Languages

**English is the default** — it is what the server renders (`lang="en" dir="ltr"`)
and what search engines and first-time visitors get. A toggle in the header
switches to Arabic; the choice is remembered in `localStorage` and applies
`lang`/`dir` to the document root.

- All copy lives in `src/lib/dictionary.ts`, one object per language. The
  Arabic side is the client-approved original, verbatim.
- The layout mirrors on its own because it is built on CSS logical properties;
  the background orb's journey mirrors too (`side` in `lib/cosmos.ts`), since
  the empty column it drifts into swaps sides with the writing direction.
- `src/components/Bidi.tsx` isolates quoted Latin runs inside Arabic text.
  Without it, bidi reordering detaches the quote marks from the word — the
  tagline's `ونـ"forge" منها` and the Key project's
  `"Knowledge Empowers You"` both need it. Product names and the copyright
  line are isolated the same way.

## Design system

Tokens live in `src/app/globals.css` (`--black`, `--panel`, `--gold`,
`--gold-bright`, `--gold-dim`, `--teal`, `--ink`, `--ink-dim`, `--ink-faint`,
`--line`). Type is **Cairo** for everything and **Amiri italic** for the
pull-quote and the project numerals only — both carry Arabic and Latin.

## Performance & accessibility fallbacks

`src/lib/useMotionMode.ts` classifies each visitor into one of three modes:

- **full** — desktop-class: 6 000 particles, DPR up to 1.75.
- **lite** — narrow desktop / ≤4 cores / ≤4 GB: 2 600 particles, DPR capped at
  1.3, antialiasing off.
- **flat** — phones (coarse pointer under 820 px): **no WebGL at all** — a
  full-bleed particle canvas is what makes phone scrolling stutter. The CSS
  radial-gradient disc and ripples stand in, and the scroll choreography
  (parallax, spill, reveals) still runs over them.
- **reduced** — `prefers-reduced-motion: reduce` or no WebGL: nothing moves on
  scroll. The hero drops its sticky section and every reveal shows immediately.

Lenis is `lerp`-based rather than duration-based (lighter under the wheel) and
leaves touch scrolling native. In-page links are resolved by `SmoothScroll`
itself — it computes the destination and clears the fixed header — because
letting the native jump and Lenis both act was landing on the wrong section.

There is exactly **one** WebGL context for the whole site — the background
layer — loaded through `next/dynamic({ ssr: false })`.

`next.config.ts` reads `NEXT_BUILD_DIR`, so a verification build can run
against `.next-verify` without clobbering the `.next` a live `next dev` is
serving:

```bash
NEXT_BUILD_DIR=.next-verify npm run build
```

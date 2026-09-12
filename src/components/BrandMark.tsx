"use client";

import { useId } from "react";

/**
 * The story in one glyph: Ra's disc rising out of the ripples of Nun.
 * Drawn on a 32-unit grid so it stays crisp next to the wordmark.
 */
export default function BrandMark({ className }: { className?: string }) {
  const id = useId();
  const disc = `${id}-disc`;
  const glow = `${id}-glow`;

  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      role="img"
      aria-hidden
      focusable="false"
    >
      <defs>
        <linearGradient id={disc} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f6e7b8" />
          <stop offset="55%" stopColor="#e8c766" />
          <stop offset="100%" stopColor="#c9a227" />
        </linearGradient>
        <radialGradient id={glow}>
          <stop offset="0%" stopColor="#e8c766" stopOpacity="0.55" />
          <stop offset="60%" stopColor="#c9a227" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#c9a227" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="16" cy="12" r="12" fill={`url(#${glow})`} />
      <circle cx="16" cy="12" r="6.4" fill={`url(#${disc})`} />

      {/* the waters, receding as they go */}
      <g fill="none" stroke="#c9a227" strokeLinecap="round">
        <path d="M3.5 21.4Q16 26.6 28.5 21.4" strokeWidth="1.6" opacity="0.85" />
        <path d="M6.5 25.8Q16 30 25.5 25.8" strokeWidth="1.4" opacity="0.5" />
        <path d="M10 29.6Q16 31.9 22 29.6" strokeWidth="1.2" opacity="0.26" />
      </g>
    </svg>
  );
}

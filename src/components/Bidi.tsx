import { Fragment } from "react";

/**
 * Isolates quoted Latin runs inside Arabic text.
 *
 * Bidi reordering treats the quote marks as neutral, so a phrase like
 * ونـ"forge" منها comes out with its quotes detached from the word they
 * belong to. Wrapping the run in <bdi dir="ltr"> pins them. Harmless no-op
 * in the English copy.
 */
const QUOTED_LATIN = /"[^"؀-ۿ]*[A-Za-z][^"؀-ۿ]*"/g;

export default function Bidi({ text }: { text: string }) {
  const parts = text.split(QUOTED_LATIN);
  const matches = text.match(QUOTED_LATIN);
  if (!matches) return <>{text}</>;

  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>
          {part}
          {matches[i] && <bdi dir="ltr">{matches[i]}</bdi>}
        </Fragment>
      ))}
    </>
  );
}

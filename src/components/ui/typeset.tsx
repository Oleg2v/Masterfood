import { Fragment } from "react";
import { Num } from "./num";

/* A figure: optional ₪ or sign, digits with separators, optional % or °. */
const FIGURE = /(₪?[−+]?\d[\d.,:–]*[%°]?)/g;

/**
 * Plain strings with figures in them (concept lines, decisions, notes): every
 * figure becomes an isolated LTR <Num> in Plex Mono, and a figure that follows a
 * maqaf (כ־20) hugs it. Text stays text; nothing else is touched.
 */
export function Typeset({ text }: { text: string }) {
  const parts = text.split(FIGURE);
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <Num key={i} joined={parts[i - 1]?.endsWith("־")}>
            {p}
          </Num>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        ),
      )}
    </>
  );
}

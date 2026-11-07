import { Fragment, type ReactNode } from "react";

/** Page container: 1440 max, 16 / 32 / 48px gutters — all on the 4px grid. */
export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[90rem] px-4 sm:px-8 xl:px-12 ${className}`}>{children}</div>;
}

/**
 * The parts of a " · "-joined Latin label ("Invoice · estimated / actual · frost thaws"), each
 * kept whole: the label wraps between parts, not inside one (a part wraps inside itself only if
 * it is wider than the whole line). Each "·" ends the part before it, so a wrapped line starts on
 * a word, never on a separator. Set it inside a lang="en" isolate, on a block that balances its
 * lines (text-balance), so a short last part is never left alone.
 */
export function LabelParts({ text }: { text: string }) {
  const parts = text.split(" · ");
  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>
          {i > 0 ? " " : null}
          <span className="inline-block">{i < parts.length - 1 ? `${part} ·` : part}</span>
        </Fragment>
      ))}
    </>
  );
}

/**
 * A bilingual label: the Latin half in tracked mono (lang="en"), the Hebrew half
 * in Heebo, never letter-spaced. Use instead of label-latin on mixed text.
 * The "·" between them stands in the gap, just outside the Hebrew half, and the
 * label clips its inline overflow: when the Hebrew wraps onto its own line, the
 * separator falls past the edge, so no line ends on a "·" and none starts with one.
 */
export function BiLabel({ en, he, as: Tag = "p", className = "" }: { en: string; he?: string; as?: "p" | "h2" | "h3" | "span"; className?: string }) {
  return (
    <Tag className={`flex flex-wrap items-baseline gap-x-5 gap-y-1 overflow-x-clip text-frost-3 ${className}`}>
      <bdi dir="ltr" lang="en" className="label-latin text-balance">
        <LabelParts text={en} />
      </bdi>
      {he ? (
        <span className="relative text-caption">
          {/* the gap's width, centred in it: on one line it reads "LATIN · עברית" */}
          <span aria-hidden="true" className="absolute end-full top-0 w-5 text-center">
            ·
          </span>
          {he}
        </span>
      ) : null}
    </Tag>
  );
}

export function Section({
  id,
  index,
  en,
  he,
  lede,
  children,
}: {
  id: string;
  index: string;
  en: string;
  he: string;
  lede: ReactNode;
  children: ReactNode;
}) {
  return (
    /* The rule is full-bleed (the section's own border), and the title hangs from it at every width.
       The title leads the header, on screen below lg and in the reading order always, and the code
       reads under it; from lg the code moves into the first three columns and the title hangs
       beside it. Anchors land clear of the sticky rail through html's scroll-padding-top alone
       (globals.css), so a section adds no margin of its own. */
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-6 border-t border-hairline pb-16 sm:pb-24">
      <Container className="flex flex-col gap-12 sm:gap-16">
        <header className="grid grid-cols-1 gap-x-6 gap-y-4 lg:grid-cols-12">
          <h2 id={`${id}-title`} className="type-section hang-section text-balance text-frost lg:col-span-5">
            {he}
          </h2>
          <p lang="en" className="label-latin text-balance text-frost-3 lg:order-first lg:col-span-3 lg:pt-4">
            <bdi dir="ltr">
              <LabelParts text={`${index} — ${en}`} />
            </bdi>
          </p>
          <p className="max-w-[46ch] text-body text-pretty text-frost-2 lg:col-span-4 lg:pt-4">{lede}</p>
        </header>
        {children}
      </Container>
    </section>
  );
}

/**
 * A specimen plate: a titled Steel panel that holds one component and its states. The Latin
 * label follows the title at a fixed gap, so it lands in the same place on every plate; the
 * note, when there is one, takes its own line.
 */
export function Plate({
  id,
  title,
  en,
  note,
  children,
  className = "",
}: {
  id?: string;
  title: string;
  en: string;
  note?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <article id={id} className={`flex flex-col gap-6 rounded-edge bg-steel/60 p-4 shadow-rim inset-ring inset-ring-hairline sm:p-8 ${className}`}>
      <header className="flex flex-col gap-2 border-b border-hairline pb-4">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h3 className="type-title text-frost">{title}</h3>
          <p lang="en" className="label-latin text-balance text-frost-3">
            <bdi dir="ltr">
              <LabelParts text={en} />
            </bdi>
          </p>
        </div>
        {note ? <p className="max-w-[72ch] text-caption text-pretty text-frost-2">{note}</p> : null}
      </header>
      {children}
    </article>
  );
}

/**
 * Caption of a pinned state: Latin, isolated LTR so "2 · hover" never reorders. A " · "-joined
 * string wraps only between its parts (see LabelParts); other children are set as given.
 */
export function StateLabel({ children }: { children: ReactNode }) {
  return (
    <bdi dir="ltr" lang="en" className="label-latin text-balance text-frost-3">
      {typeof children === "string" ? <LabelParts text={children} /> : children}
    </bdi>
  );
}

import type { ReactNode } from "react";

/** Page container: 1440 max, 16 / 32 / 48px gutters — all on the 4px grid. */
export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[90rem] px-4 sm:px-8 xl:px-12 ${className}`}>{children}</div>;
}

/**
 * A bilingual label: the Latin half in tracked mono (lang="en"), the Hebrew half
 * in Heebo, never letter-spaced. Use instead of label-latin on mixed text.
 */
export function BiLabel({ en, he, as: Tag = "p", className = "" }: { en: string; he?: string; as?: "p" | "h2" | "h3" | "span"; className?: string }) {
  return (
    <Tag className={`flex flex-wrap items-baseline gap-x-2 gap-y-1 text-frost-3 ${className}`}>
      <bdi dir="ltr" lang="en" className="label-latin">
        {en}
      </bdi>
      {he ? (
        <>
          <span aria-hidden="true">·</span>
          <span className="text-caption">{he}</span>
        </>
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
    /* the rule is full-bleed (the section's own border), and the title hangs from it */
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-28 border-t border-hairline pb-16 sm:pb-24">
      <Container className="flex flex-col gap-12 sm:gap-16">
        <header className="grid grid-cols-1 gap-x-6 gap-y-4 lg:grid-cols-12">
          <p className="label-latin pt-4 text-frost-3 lg:col-span-3">
            <bdi dir="ltr" lang="en">
              {index} — {en}
            </bdi>
          </p>
          <h2 id={`${id}-title`} className="type-section hang-section text-balance text-frost lg:col-span-5">
            {he}
          </h2>
          <p className="max-w-[46ch] text-body text-pretty text-frost-2 lg:col-span-4 lg:pt-4">{lede}</p>
        </header>
        {children}
      </Container>
    </section>
  );
}

/** A specimen plate: a titled Steel panel that holds one component and its states. */
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
    <article id={id} className={`flex scroll-mt-28 flex-col gap-6 rounded-edge bg-steel/60 p-4 shadow-rim inset-ring inset-ring-hairline sm:p-8 ${className}`}>
      <header className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-hairline pb-4">
        <h3 className="type-title text-frost">{title}</h3>
        <p className="label-latin text-frost-3">
          <bdi dir="ltr" lang="en">
            {en}
          </bdi>
        </p>
        {note ? <p className="w-full max-w-[72ch] text-caption text-pretty text-frost-2">{note}</p> : null}
      </header>
      {children}
    </article>
  );
}

/** Caption of a pinned state: Latin, isolated LTR so "2 · hover" never reorders. */
export function StateLabel({ children }: { children: ReactNode }) {
  return (
    <bdi dir="ltr" lang="en" className="label-latin text-frost-3">
      {children}
    </bdi>
  );
}

import type { ReactNode } from "react";

/** Page container: 1440 max, 16 / 32 / 48px gutters — all on the 4px grid. */
export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[90rem] px-4 sm:px-8 xl:px-12 ${className}`}>{children}</div>;
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
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-20 py-16 sm:py-24">
      <Container className="flex flex-col gap-12 sm:gap-16">
        <header className="grid grid-cols-1 gap-4 border-t border-hairline pt-6 lg:grid-cols-12 lg:gap-6">
          <p className="label-latin text-fog lg:col-span-3">
            <bdi dir="ltr">
              {index} — {en}
            </bdi>
          </p>
          <h2 id={`${id}-title`} className="type-headline text-balance text-frost lg:col-span-5">
            {he}
          </h2>
          <p className="max-w-[46ch] text-body text-mist lg:col-span-4">{lede}</p>
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
    <article id={id} className={`flex scroll-mt-20 flex-col gap-6 rounded-md bg-steel/60 p-4 shadow-rim sm:p-8 ${className}`}>
      <header className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-b border-hairline pb-4">
        <h3 className="type-heading text-frost">{title}</h3>
        <p className="label-latin text-fog">
          <bdi dir="ltr">{en}</bdi>
        </p>
        {note ? <p className="w-full text-small text-mist">{note}</p> : null}
      </header>
      {children}
    </article>
  );
}

/** Caption under a pinned state. */
export function StateLabel({ children }: { children: ReactNode }) {
  return <span className="label-latin text-fog">{children}</span>;
}

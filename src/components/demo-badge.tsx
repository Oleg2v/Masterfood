/**
 * Demo hygiene badge. Always visible, never dismissible: this is a pitch
 * concept, not Masterfood's official site, and every price is a demo price.
 *
 * Phones: an in-flow strip above everything, so it never covers content.
 * sm and up: a quiet fixed pill in the bottom inline-end corner.
 */
const COPY = (
  <>
    קונספט של <span lang="en">Kikkey</span> – לא האתר הרשמי של מאסטרפוד
  </>
);

export function DemoBadge() {
  return (
    <>
      <aside aria-label="הבהרה" className="demo-strip border-b border-hairline bg-steel px-4 py-2 sm:hidden">
        <p className="flex items-center justify-center gap-2 text-small text-mist">
          <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-salmon" />
          <span>{COPY}</span>
        </p>
      </aside>
      <aside
        aria-label="הבהרה"
        className="demo-badge pointer-events-none fixed bottom-[max(1rem,env(safe-area-inset-bottom))] end-4 z-badge hidden sm:block"
      >
        <p className="pointer-events-auto flex items-center gap-2 rounded-pill bg-deep-ice py-2 ps-3 pe-4 text-small leading-none text-mist shadow-[inset_0_0_0_1px_var(--color-boundary),0_12px_32px_-12px_rgb(2_8_12/0.9)]">
          <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-salmon" />
          <span>{COPY}</span>
        </p>
      </aside>
    </>
  );
}

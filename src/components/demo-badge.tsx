import type { ReactNode } from "react";

/**
 * Demo hygiene, set into the top rail: this is a pitch concept, not Masterfood's
 * official site, and every price is a demo price. It lives in the sticky rail (and
 * the footer), never in a floating corner badge: on a phone nothing floats.
 * Not dismissible. No accent dot: the four accents carry data only.
 * The note (children: "מחירי דמו · לפני מע״מ") sits at the inline end. Where the two
 * do not fit on one line, as on a phone, it wraps under the disclaimer rather than
 * being dropped, so the strip says both things at every width. On the narrowest
 * screens the disclaimer itself breaks only at its dash, never inside a phrase.
 */
export function DemoStrip({ children }: { children?: ReactNode }) {
  return (
    <div className="border-b border-hairline bg-steel">
      <div className="mx-auto flex min-h-8 w-full max-w-[90rem] flex-wrap items-center justify-between gap-x-6 px-4 py-1 sm:px-8 xl:px-12">
        <p className="text-caption text-frost-2">
          <span className="whitespace-nowrap">
            קונספט של <span lang="en">Kikkey</span> –
          </span>{" "}
          <span className="whitespace-nowrap">לא האתר הרשמי של מאסטרפוד</span>
        </p>
        {children}
      </div>
    </div>
  );
}

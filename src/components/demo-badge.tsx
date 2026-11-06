import type { ReactNode } from "react";

/**
 * Demo hygiene, set into the top rail: this is a pitch concept, not Masterfood's
 * official site, and every price is a demo price. It lives in the sticky rail (and
 * the footer), never in a floating corner badge: on a phone nothing floats.
 * Not dismissible. No accent dot: the four accents carry data only.
 */
export function DemoStrip({ children }: { children?: ReactNode }) {
  return (
    <div className="border-b border-hairline bg-steel">
      <div className="mx-auto flex min-h-8 w-full max-w-[90rem] items-center justify-between gap-x-6 px-4 py-1 sm:px-8 xl:px-12">
        <p className="text-caption text-frost-2">
          קונספט של <span lang="en">Kikkey</span> – לא האתר הרשמי של מאסטרפוד
        </p>
        {children}
      </div>
    </div>
  );
}

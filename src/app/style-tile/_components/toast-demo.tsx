"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Money } from "@/components/ui/money";
import { Num } from "@/components/ui/num";
import { Route } from "@/components/ui/route";
import { Toast } from "@/components/ui/toast";
import { durations } from "@/design/tokens";
import { KG } from "@/lib/format";
import { isStill, useStill } from "@/lib/use-motion";

const EXIT_MS = durations.find((d) => d.id === "exit")!.ms;
/** Toasts waiting behind the one on screen; a burst of presses never builds an endless line. */
const MAX_WAITING = 2;

/* Escape inside a text field belongs to the field (revert, clear), not to the toast. */
const TEXT_ENTRY =
  "textarea, select, [contenteditable]:not([contenteditable='false']), " +
  "input:not([type=checkbox], [type=radio], [type=button], [type=submit], [type=reset], [type=range], [type=color], [type=file], [type=image])";

type Kind = "added" | "landed";
interface Item {
  id: number;
  kind: Kind;
  leaving: boolean;
}

/* A toast's facts never break inside a figure and its unit, and never leave a stray "·" at a
   line end: in a narrow toast (a phone) they settle on two lines at their natural seam. */
const facts = "inline-flex items-center gap-x-2 whitespace-nowrap";

/**
 * Live toasts, one at a time: a new one waits its turn until the one on screen is
 * closed or melts. They share one persistent polite region, which announces each
 * toast as it appears and never re-reads an old one. On a phone the region spans the
 * bottom inside the 16px gutters; from sm up it sits in the bottom inline-end corner
 * (left), 64px from the edges.
 * - A toast with an action ("ביטול") stays until closed. One without an action melts
 *   in 6s, paused under the pointer or focus; while motion is stopped it never melts.
 * - Esc closes the toast on screen, from anywhere but a text field.
 * - Closing a toast that holds focus hands focus back to the control that opened it.
 * - While a toast is up, <html> gets a matching scroll-padding-bottom, so a control that
 *   Tab reaches under it scrolls clear of it (WCAG 2.4.11, technique C43).
 */
export function ToastDemo() {
  const still = useStill();
  const [queue, setQueue] = useState<Item[]>([]);
  const seq = useRef(0);
  const origin = useRef(new Map<number, { opener: HTMLElement; kind: Kind }>());
  const closing = useRef(new Set<number>());
  const pending = useRef(new Set<number>());
  const addButton = useRef<HTMLButtonElement>(null);
  const landButton = useRef<HTMLButtonElement>(null);
  const region = useRef<HTMLDivElement>(null);
  const current = queue[0];
  const showing = current !== undefined;

  const add = (kind: Kind, opener: HTMLElement) => {
    const id = ++seq.current;
    origin.current.set(id, { opener, kind });
    setQueue((q) => {
      const next = [...q, { id, kind, leaving: false }];
      // the one on screen stays; past the cap, the oldest waiting toast gives way
      return next.length > MAX_WAITING + 1 ? [next[0]!, ...next.slice(-MAX_WAITING)] : next;
    });
  };

  const dismiss = useCallback((id: number) => {
    if (closing.current.has(id)) return;
    closing.current.add(id);
    const node = region.current?.querySelector(`[data-toast="${id}"]`);
    if (node?.contains(document.activeElement)) {
      // hand focus back before the toast goes inert, so it never drops to <body>
      const from = origin.current.get(id);
      const own = from?.kind === "landed" ? landButton.current : addButton.current;
      (from?.opener.isConnected ? from.opener : own)?.focus();
    }
    setQueue((q) => q.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
    const t = window.setTimeout(
      () => {
        pending.current.delete(t);
        closing.current.delete(id);
        origin.current.delete(id);
        setQueue((q) => q.filter((x) => x.id !== id));
      },
      isStill() ? 0 : EXIT_MS,
    );
    pending.current.add(t);
  }, []);

  useEffect(() => {
    const timers = pending.current;
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);

  // Esc closes the toast on screen, wherever focus is (it may sit on the control the toast covers).
  useEffect(() => {
    if (!current || current.leaving) return;
    const { id } = current;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || e.defaultPrevented || e.isComposing) return;
      const el = e.target instanceof Element ? e.target : null;
      if (el && !el.closest("[data-toast]") && el.matches(TEXT_ENTRY)) return;
      dismiss(id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, dismiss]);

  // While a toast is up, the band it covers (plus 16px) is scroll padding: focus never hides under it.
  useEffect(() => {
    const el = region.current;
    if (!showing || !el) return;
    const html = document.documentElement;
    const clear = () => {
      const covered = window.innerHeight - el.getBoundingClientRect().top;
      html.style.scrollPaddingBottom = `${Math.ceil(Math.max(0, covered)) + 16}px`;
    };
    clear();
    const ro = new ResizeObserver(clear);
    ro.observe(el);
    window.addEventListener("resize", clear);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", clear);
      html.style.removeProperty("scroll-padding-bottom");
    };
  }, [showing]);

  return (
    <div className="flex flex-col items-start gap-4">
      <div className="flex flex-wrap gap-3">
        <Button
          ref={addButton}
          variant="primary"
          onClick={(e) => add("added", e.currentTarget)}
          meta={
            <>
              כ־<Num joined>20</Num> {KG}
            </>
          }
        >
          הוספת פיקנייה להזמנה
        </Button>
        <Button ref={landButton} variant="secondary" onClick={(e) => add("landed", e.currentTarget)}>
          הדמיית נחיתה
        </Button>
      </div>
      <p className="max-w-[60ch] text-caption text-pretty text-frost-2">
        הודעה עם פעולה נשארת עד שסוגרים אותה. הודעה בלי פעולה נמסה אחרי{" "}
        <span className="whitespace-nowrap">
          <Num>6</Num> שניות
        </span>
        , ונעצרת כשהסמן עליה או כשהמיקוד בתוכה; כשהתנועה עצורה היא לא נמסה בכלל. ההודעות מופיעות אחת־אחת, ו־
        <kbd lang="en" className="num rounded-hair px-1 text-[0.9em] text-frost inset-ring inset-ring-edge">
          Esc
        </kbd>{" "}
        סוגר את זו שעל המסך.
      </p>

      <div
        ref={region}
        role="status"
        aria-live="polite"
        aria-atomic="false"
        aria-relevant="additions"
        className="pointer-events-none fixed inset-x-4 bottom-[calc(--spacing(4)+env(safe-area-inset-bottom,0px))] z-toast sm:start-auto sm:end-16 sm:bottom-16 sm:w-full sm:max-w-toast"
      >
        {current ? (
          <div
            key={current.id}
            data-toast={current.id}
            inert={current.leaving}
            className={`pointer-events-auto ${current.leaving ? "toast-leave" : "toast-enter"}`}
          >
            {current.kind === "added" ? (
              <Toast
                tone="success"
                title="נוסף להזמנה של מחר"
                detail={
                  <>
                    פיקנייה ·{" "}
                    <span className="whitespace-nowrap">
                      כ־<Num joined>20</Num> {KG}
                    </span>
                    <span className="@max-[14rem]:hidden"> · </span>
                    <span className="whitespace-nowrap @max-[14rem]:block">
                      כ־<Money joined value={1780} round />
                    </span>
                  </>
                }
                action={
                  <Button variant="quiet" size="sm" onClick={() => dismiss(current.id)}>
                    ביטול
                  </Button>
                }
                onClose={() => dismiss(current.id)}
              />
            ) : (
              <Toast
                tone="info"
                title="נחת: סלמון נורבגי טרי"
                timer={!still}
                onTimeout={() => dismiss(current.id)}
                detail={
                  <span className="flex flex-col flex-wrap @min-[18rem]:flex-row @min-[18rem]:items-center @min-[18rem]:gap-x-2">
                    <span className={facts}>
                      <Route from="OSL" to="TLV" mode="air" />·<Num>05:40</Num>
                    </span>
                    <span className="hidden @min-[18rem]:inline">·</span>
                    <span className={facts}>
                      <span className="whitespace-nowrap">
                        <Num>312</Num> {KG}
                      </span>
                      ·<Num className="text-ice">1.8°</Num>
                    </span>
                  </span>
                }
                onClose={() => dismiss(current.id)}
              />
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

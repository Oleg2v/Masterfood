"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Money } from "@/components/ui/money";
import { Num } from "@/components/ui/num";
import { Route } from "@/components/ui/route";
import { Toast } from "@/components/ui/toast";
import { KG } from "@/lib/format";

type Kind = "added" | "landed";
interface Item {
  id: number;
  kind: Kind;
  leaving: boolean;
}

/**
 * Live toasts in one persistent polite region (announces additions only, never
 * re-reads the stack). A toast with an action ("ביטול") stays until closed; an
 * informational one melts after 6s, paused while hovered or focused. Closing a
 * toast from the keyboard hands focus to the next toast, or back to the trigger.
 */
export function ToastDemo() {
  const [items, setItems] = useState<Item[]>([]);
  const seq = useRef(0);
  const timers = useRef(new Map<number, number>());
  const trigger = useRef<HTMLButtonElement>(null);

  const dismiss = useCallback((id: number) => {
    const hadFocus = Boolean(document.activeElement?.closest(`[data-toast="${id}"]`));
    window.clearTimeout(timers.current.get(id));
    setItems((list) => list.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
    window.setTimeout(() => {
      setItems((list) => list.filter((t) => t.id !== id));
      if (hadFocus) {
        const next = document.querySelector<HTMLButtonElement>(`[data-toast]:not([data-toast="${id}"]) button[aria-label="סגירת ההודעה"]`);
        (next ?? trigger.current)?.focus();
      }
    }, 240);
  }, []);

  const arm = useCallback(
    (id: number) => {
      window.clearTimeout(timers.current.get(id));
      timers.current.set(id, window.setTimeout(() => dismiss(id), 6000));
    },
    [dismiss],
  );
  const hold = (id: number) => window.clearTimeout(timers.current.get(id));

  useEffect(() => {
    const all = timers.current;
    return () => all.forEach((t) => window.clearTimeout(t));
  }, []);

  const add = (kind: Kind) => {
    const id = ++seq.current;
    setItems((list) => [...list.slice(-2), { id, kind, leaving: false }]);
    if (kind === "landed") arm(id); // only toasts without an action time out
  };

  return (
    <div className="flex flex-col items-start gap-4">
      <div className="flex flex-wrap gap-3">
        <Button ref={trigger} variant="primary" onClick={() => add("added")} meta={<>כ־<Num>20</Num> {KG}</>}>
          הוספת פיקנייה להזמנה
        </Button>
        <Button variant="secondary" onClick={() => add("landed")}>
          הדמיית נחיתה
        </Button>
      </div>
      <p className="max-w-[60ch] text-small text-pretty text-mist">
        הודעה עם פעולה נשארת עד שסוגרים אותה. הודעה בלי פעולה נמסה אחרי <Num>6</Num> שניות, ונעצרת כשמרחפים או מתמקדים
        בה.
      </p>

      <div
        role="status"
        aria-live="polite"
        aria-atomic="false"
        aria-relevant="additions"
        className="pointer-events-none fixed bottom-16 start-3 z-toast flex w-[min(var(--container-toast),calc(100vw-1.5rem))] flex-col gap-2 sm:start-4"
      >
        {items.map((t) => (
          <div
            key={t.id}
            data-toast={t.id}
            className={`pointer-events-auto ${t.leaving ? "toast-leave" : "toast-enter"}`}
            onMouseEnter={() => t.kind === "landed" && hold(t.id)}
            onMouseLeave={() => t.kind === "landed" && arm(t.id)}
            onFocus={() => t.kind === "landed" && hold(t.id)}
            onBlur={() => t.kind === "landed" && arm(t.id)}
          >
            {t.kind === "added" ? (
              <Toast
                tone="success"
                title="נוסף להזמנה של מחר"
                detail={
                  <>
                    פיקנייה · כ־<Num>20</Num> {KG} · כ־<Money value={1780} round />
                  </>
                }
                action={
                  <Button variant="quiet" size="sm" onClick={() => dismiss(t.id)}>
                    ביטול
                  </Button>
                }
                onClose={() => dismiss(t.id)}
              />
            ) : (
              <Toast
                tone="info"
                title="נחת: סלמון נורבגי טרי"
                detail={
                  <span className="inline-flex flex-wrap items-center gap-x-2">
                    <Route from="OSL" to="TLV" mode="air" />· <Num>05:40</Num> · <Num>312</Num> {KG} ·{" "}
                    <Num className="text-ice">1.8°</Num>
                  </span>
                }
                onClose={() => dismiss(t.id)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

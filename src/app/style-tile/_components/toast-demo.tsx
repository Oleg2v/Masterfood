"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Money } from "@/components/ui/money";
import { Num } from "@/components/ui/num";
import { Toast } from "@/components/ui/toast";
import { KG } from "@/lib/format";

interface Item {
  id: number;
  leaving: boolean;
}

/**
 * Live toast: one persistent polite live region (so screen readers reliably
 * announce), toasts enter with --dur-slow on ease-glide and leave with --dur-base.
 * Auto-dismiss after 6s; the timer pauses while hovered or focused.
 */
export function ToastDemo() {
  const [items, setItems] = useState<Item[]>([]);
  const seq = useRef(0);
  const timers = useRef(new Map<number, number>());

  const dismiss = useCallback((id: number) => {
    setItems((list) => list.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
    window.setTimeout(() => setItems((list) => list.filter((t) => t.id !== id)), 240);
  }, []);

  const arm = useCallback(
    (id: number) => {
      window.clearTimeout(timers.current.get(id));
      timers.current.set(id, window.setTimeout(() => dismiss(id), 6000));
    },
    [dismiss],
  );

  useEffect(() => {
    const all = timers.current;
    return () => all.forEach((t) => window.clearTimeout(t));
  }, []);

  const add = () => {
    const id = ++seq.current;
    setItems((list) => [...list.slice(-2), { id, leaving: false }]);
    arm(id);
  };

  return (
    <div className="flex flex-col items-start gap-4">
      <Button variant="primary" onClick={add} meta={<>כ־<Num>20</Num> {KG}</>}>
        הוספת פיקנייה להזמנה
      </Button>
      <p className="text-small text-mist">ההודעה נכנסת מלמטה, נשארת 6 שניות, ונעצרת כשמרחפים או מתמקדים בה.</p>

      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed bottom-16 start-3 z-40 flex w-[min(26rem,calc(100vw-1.5rem))] flex-col gap-2 sm:start-4"
      >
        {items.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto ${t.leaving ? "toast-leave" : "toast-enter"}`}
            onMouseEnter={() => window.clearTimeout(timers.current.get(t.id))}
            onMouseLeave={() => arm(t.id)}
            onFocus={() => window.clearTimeout(timers.current.get(t.id))}
            onBlur={() => arm(t.id)}
          >
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
          </div>
        ))}
      </div>
    </div>
  );
}

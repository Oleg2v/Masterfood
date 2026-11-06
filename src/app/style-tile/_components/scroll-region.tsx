"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

/**
 * A horizontally scrollable region that joins the tab order only when it
 * actually overflows (so keyboard users can scroll it), and stays out of the
 * way when everything fits.
 */
export function ScrollRegion({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scrollable, setScrollable] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => setScrollable(el.scrollWidth > el.clientWidth + 1);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={ref} role="region" aria-label={label} tabIndex={scrollable ? 0 : undefined} className={className}>
      {children}
    </div>
  );
}

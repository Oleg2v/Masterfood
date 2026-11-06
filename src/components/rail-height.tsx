"use client";

import { useEffect, useRef } from "react";

/**
 * Publishes the sticky rail's height as --rail-h on <html>, so html's scroll-padding-top
 * (globals.css) always clears it: a focused control or an #anchor never lands under the rail,
 * however the demo strip wraps, at any width or zoom. Render it as a direct child of the rail;
 * it draws nothing. Until it has run, the stylesheet assumes the rail's usual 92px.
 */
export function RailHeight() {
  const probe = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const rail = probe.current?.parentElement;
    if (!rail) return;
    const root = document.documentElement;
    const publish = () => root.style.setProperty("--rail-h", `${Math.ceil(rail.getBoundingClientRect().height)}px`);
    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(rail);
    return () => {
      observer.disconnect();
      root.style.removeProperty("--rail-h");
    };
  }, []);

  return <span ref={probe} hidden />;
}

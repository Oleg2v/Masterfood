"use client";

import { useEffect, useRef, useState } from "react";
import { fluidClamp, typeScale, VIEWPORT } from "@/design/tokens";

const familyName = { display: "Frank Ruhl Libre", ui: "Heebo", mono: "IBM Plex Mono" } as const;

/**
 * The nine fluid steps set as a carte: the specimen is the dish, a dot leader
 * runs to the "price" — the px range and the size it renders at right now.
 * Resizing the window updates the live readout, so clamp() can be watched.
 */
export function TypeScaleTable() {
  const refs = useRef<(HTMLElement | null)[]>([]);
  const [now, setNow] = useState<{ vw: number; px: number[] } | null>(null);

  useEffect(() => {
    const measure = () =>
      setNow({
        vw: window.innerWidth,
        px: refs.current.map((el) => (el ? parseFloat(getComputedStyle(el).fontSize) : 0)),
      });
    measure();
    window.addEventListener("resize", measure, { passive: true });
    return () => window.removeEventListener("resize", measure);
  }, []);

  const steps = [...typeScale].reverse();

  return (
    <div className="flex flex-col">
      <div className="flex items-baseline justify-between gap-4 border-b border-boundary pb-3">
        <h3 className="label-latin text-fog">
          <bdi dir="ltr">Type scale · 9 steps · clamp() {VIEWPORT.minPx}→{VIEWPORT.maxPx}</bdi>
        </h3>
        <p className="text-small text-mist">
          עכשיו ברוחב{" "}
          <bdi dir="ltr" className="num text-frost">
            {now ? `${now.vw}px` : "—"}
          </bdi>
        </p>
      </div>
      <ol>
        {steps.map((t, i) => {
          const isLatin = t.family === "mono" || t.id === "monument";
          return (
            <li key={t.id} className="flex flex-col gap-2 border-b border-hairline py-5">
              {/* dish …… price */}
              <div className="flex items-baseline gap-3">
                <bdi dir="ltr" className="num w-7 shrink-0 text-small text-fog">
                  {t.step > 0 ? `+${t.step}` : t.step === 0 ? "0" : `−${Math.abs(t.step)}`}
                </bdi>
                <p
                  ref={(el) => {
                    refs.current[i] = el;
                  }}
                  className={`type-${t.id} min-w-0 shrink truncate text-frost ${t.family === "mono" ? "label-latin" : ""} ${t.id === "monument" ? "tracking-numerals [font-variant-numeric:tabular-nums_lining-nums]" : ""}`}
                >
                  {isLatin ? <bdi dir="ltr">{t.sample}</bdi> : t.sample}
                </p>
                <span aria-hidden="true" className="leader hidden min-w-8 flex-1 sm:block" />
                <span className="hidden shrink-0 items-baseline gap-3 sm:flex">
                  <bdi dir="ltr" className="num text-small text-mist">
                    {t.minPx}→{t.maxPx}
                  </bdi>
                  <bdi dir="ltr" className="num w-16 text-end text-small text-frost">
                    {now ? `${now.px[i]?.toFixed(1)}px` : "—"}
                  </bdi>
                </span>
              </div>
              {/* the menu's small print */}
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 ps-10">
                <span className="num text-small text-frost">
                  <bdi dir="ltr">type-{t.id}</bdi>
                </span>
                <span className="text-small text-mist">
                  {familyName[t.family]} · <bdi dir="ltr" className="num">{t.weight}</bdi> · {t.usage}
                </span>
                <bdi dir="ltr" className="num text-small text-mist sm:hidden">
                  {t.minPx}→{t.maxPx}px
                </bdi>
                <code dir="ltr" className="num w-full truncate text-start text-micro text-fog lg:w-auto lg:ms-auto">
                  {fluidClamp(t.minPx, t.maxPx)} · lh {t.lineHeight}
                </code>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

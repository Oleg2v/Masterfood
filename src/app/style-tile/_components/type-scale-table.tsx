"use client";

import { useEffect, useRef, useState } from "react";
import { fluidClamp, typeScale, VIEWPORT } from "@/design/tokens";

/**
 * The nine fluid steps, each set at its real size. The "עכשיו" column measures
 * the rendered font-size, so resizing the window shows clamp() working.
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
      <div className="hidden grid-cols-[3rem_8rem_1fr_7rem_5rem] items-end gap-6 border-b border-boundary pb-3 text-micro text-fog lg:grid">
        <span className="label-latin">Step</span>
        <span className="label-latin">Token</span>
        <span className="label-latin">Specimen</span>
        <span className="label-latin text-end">
          <bdi dir="ltr">
            {VIEWPORT.minPx}→{VIEWPORT.maxPx}
          </bdi>
        </span>
        <span className="label-latin text-end">
          עכשיו
          {now ? (
            <bdi dir="ltr" className="ms-1 text-mist">
              @{now.vw}
            </bdi>
          ) : null}
        </span>
      </div>
      {steps.map((t, i) => {
        const family = t.family === "display" ? "Frank Ruhl Libre" : t.family === "ui" ? "Heebo" : "IBM Plex Mono";
        return (
          <div
            key={t.id}
            className="grid grid-cols-[2.5rem_1fr] items-baseline gap-x-4 gap-y-2 border-b border-hairline py-5 lg:grid-cols-[3rem_8rem_1fr_7rem_5rem] lg:gap-6"
          >
            <bdi dir="ltr" className="num text-small text-fog lg:text-start">
              {t.step > 0 ? `+${t.step}` : t.step === 0 ? "0" : `−${Math.abs(t.step)}`}
            </bdi>
            <div className="flex flex-col gap-1">
              <span className="num text-small text-frost">
                <bdi dir="ltr">type-{t.id}</bdi>
              </span>
              <span className="text-micro text-mist">
                {family} · <bdi dir="ltr" className="num">{t.weight}</bdi>
              </span>
            </div>
            <div className="col-span-2 min-w-0 lg:col-span-1">
              <p
                ref={(el) => {
                  refs.current[i] = el;
                }}
                className={`type-${t.id} truncate text-frost ${t.family === "mono" ? "label-latin" : ""} ${t.id === "monument" ? "tracking-numerals [font-variant-numeric:tabular-nums_lining-nums]" : ""}`}
              >
                {t.family === "mono" || t.id === "monument" ? <bdi dir="ltr">{t.sample}</bdi> : t.sample}
              </p>
              <p className="mt-2 text-small text-mist">{t.usage}</p>
              <code dir="ltr" className="num mt-1 block truncate text-start text-micro text-fog lg:hidden">
                {fluidClamp(t.minPx, t.maxPx)}
              </code>
            </div>
            <div className="hidden flex-col items-end gap-1 lg:flex">
              <bdi dir="ltr" className="num text-small text-frost">
                {t.minPx}→{t.maxPx}px
              </bdi>
              <bdi dir="ltr" className="num text-micro text-mist">
                lh {t.lineHeight}
              </bdi>
            </div>
            <bdi dir="ltr" className="num hidden text-end text-small text-frost lg:block">
              {now ? `${now.px[i]?.toFixed(1)}px` : "—"}
            </bdi>
            <code
              dir="ltr"
              className="num col-span-full hidden truncate text-start text-micro text-fog lg:col-start-3 lg:col-end-6 lg:block"
            >
              --text-{t.id}: {fluidClamp(t.minPx, t.maxPx)}
            </code>
          </div>
        );
      })}
    </div>
  );
}

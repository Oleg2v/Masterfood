"use client";

import { useEffect, useRef, useState } from "react";
import { Typeset } from "@/components/ui/typeset";
import { fluidClamp, typeScale, VIEWPORT } from "@/design/tokens";
import { LabelParts } from "./frame";

const NB = " ";

const familyName = { display: "Frank Ruhl Libre", ui: "Heebo", mono: "IBM Plex Mono" } as const;

/**
 * The nine fluid steps set as a carte: the specimen is the dish, a dot leader
 * runs to the "price" — the px range and the size it renders at right now.
 * Resizing the window updates the live readout, so clamp() can be watched.
 * Nothing is cut off: a specimen or a clamp() that does not fit wraps.
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
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-edge pb-3">
        <h3 lang="en" className="label-latin text-balance text-frost-3">
          <bdi dir="ltr">
            <LabelParts text={`Type scale · 9 steps · clamp() ${VIEWPORT.minPx}–${VIEWPORT.maxPx}`} />
          </bdi>
        </h3>
        <p className="text-caption text-frost-2">
          עכשיו ברוחב{" "}
          <bdi dir="ltr" className="num text-frost">
            {now ? `${now.vw}px` : "—"}
          </bdi>
        </p>
      </div>
      <ol>
        {steps.map((t, i) => {
          const isLatin = t.family === "mono" || t.id === "display";
          return (
            <li key={t.id} className="flex flex-col gap-2 border-b border-hairline py-5">
              {/* dish …… price */}
              <div className="flex items-baseline gap-3">
                {/* the step number sits at the start (right) of its column, units stacked */}
                <bdi dir="ltr" className="num w-7 shrink-0 text-end text-caption text-frost-3">
                  {t.step > 0 ? `+${t.step}` : t.step === 0 ? "0" : `−${Math.abs(t.step)}`}
                </bdi>
                <p
                  ref={(el) => {
                    refs.current[i] = el;
                  }}
                  lang={t.family === "mono" ? "en" : undefined}
                  className={`type-${t.id} min-w-0 shrink text-balance text-frost ${t.id === "micro" ? "label-latin" : ""} ${t.id === "display" ? "tracking-numerals [font-variant-numeric:tabular-nums_lining-nums]" : ""}`}
                >
                  {/* a ₪ in a sample takes the one shekel treatment, through Typeset */}
                  {isLatin ? <bdi dir="ltr">{t.sample.includes("₪") ? <Typeset text={t.sample} /> : t.sample}</bdi> : t.sample}
                </p>
                <span aria-hidden="true" className="leader hidden min-w-8 flex-1 sm:block" />
                <span className="hidden shrink-0 items-baseline gap-3 sm:flex">
                  <bdi dir="ltr" className="num text-caption text-frost-2">
                    {t.minPx}–{t.maxPx}
                  </bdi>
                  <bdi dir="ltr" className="num w-16 text-end text-caption text-frost">
                    {now ? `${now.px[i]?.toFixed(1)}px` : "—"}
                  </bdi>
                </span>
              </div>
              {/* the menu's small print; every "·" ends a line rather than starting one */}
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 ps-10">
                <span className="num text-caption text-frost">
                  <bdi dir="ltr">type-{t.id}</bdi>
                </span>
                <span className="text-caption text-frost-2">
                  <bdi dir="ltr" lang="en">
                    {familyName[t.family]}
                  </bdi>
                  {NB}· <bdi dir="ltr" className="num">{t.weight}</bdi>
                  {NB}· <Typeset text={t.usage} />
                </span>
                <bdi dir="ltr" className="num text-caption text-frost-2 sm:hidden">
                  {t.minPx}–{t.maxPx}px
                </bdi>
                {/* wraps at its spaces when the line is narrow (.num alone would not), and "lh" keeps its value */}
                <code
                  dir="ltr"
                  className="num w-full text-start text-micro whitespace-normal text-frost-3 [overflow-wrap:anywhere] lg:ms-auto lg:w-auto"
                >
                  {fluidClamp(t.minPx, t.maxPx)}
                  {NB}· <span className="whitespace-nowrap">lh {t.lineHeight}</span>
                </code>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

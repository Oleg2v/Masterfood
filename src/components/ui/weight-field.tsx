"use client";

import { type ReactNode, useEffect, useId, useRef, useState } from "react";
import { formatILS, KG } from "@/lib/format";
import { Icon } from "./icon";
import { Money } from "./money";
import { Num } from "./num";

/**
 * Variable-weight quantity: the customer orders "about 20 kg"; the estimate is
 * shown with its ± band, because the invoice will use the actual weighed kilos.
 *
 * Focus: steppers and input each show their own ring; the field's outer ring
 * means "the input has keyboard focus". An error keeps its Thaw stroke while it
 * is being fixed. Screen readers hear one sentence, not a string of numbers.
 */
export function WeightField({
  label = "כמות",
  product = "פיקנייה",
  pricePerKg = 89,
  defaultKg = 20,
  minKg = 5,
  maxKg = 140,
  stepKg = 1,
  variance = 0.05,
  error,
  disabled = false,
  force,
}: {
  label?: string;
  product?: string;
  pricePerKg?: number;
  defaultKg?: number;
  minKg?: number;
  maxKg?: number;
  stepKg?: number;
  /** Expected weighing variance (±5% → 19–21 kg for 20 kg). */
  variance?: number;
  error?: ReactNode;
  disabled?: boolean;
  /** Style-tile only: "focus" pins the field-focus state. */
  force?: string;
}) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [kg, setKg] = useState(defaultKg);
  const [spoken, setSpoken] = useState("");
  const typing = useRef(false);
  const touched = useRef(false); // nothing is announced until the buyer changes the value
  const clamp = (n: number) => Math.min(maxKg, Math.max(minKg, Math.round(n * 10) / 10));
  const estimate = kg * pricePerKg;
  const low = kg * (1 - variance) * pricePerKg;
  const high = kg * (1 + variance) * pricePerKg;
  const invalid = Boolean(error);
  const atMin = kg <= minKg;
  const atMax = kg >= maxKg;

  // One atomic sentence for assistive tech: at once after a step, 400ms after the last keystroke.
  const sentence = `כ־${kg} ${KG}, מחיר משוער כ־${formatILS(estimate, { round: true })}, טווח ${formatILS(low, { round: true })} עד ${formatILS(high, { round: true })}`;
  useEffect(() => {
    if (!touched.current) return;
    if (!typing.current) {
      setSpoken(sentence);
      return;
    }
    const t = window.setTimeout(() => setSpoken(sentence), 400);
    return () => window.clearTimeout(t);
  }, [sentence]);

  const step = (dir: 1 | -1) => {
    if (disabled || (dir < 0 ? atMin : atMax)) return;
    typing.current = false;
    touched.current = true;
    setKg((v) => clamp(v + dir * stepKg));
  };

  const stepBtn =
    "grid size-12 shrink-0 place-items-center text-frost transition-[background-color,color] duration-fast ease-glide " +
    "hover:bg-hairline active:bg-boundary/40 aria-disabled:cursor-not-allowed aria-disabled:text-fog aria-disabled:hover:bg-transparent " +
    "disabled:text-fog disabled:pointer-events-none";

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-small font-medium text-frost">
          {label} <span className="text-mist">· {product}</span>
          <span className="sr-only">, ב{KG}</span>
        </label>
        <span className="text-small text-mist">
          <Money value={pricePerKg} /> ל{KG}
        </span>
      </div>

      <div
        data-force={force === "focus" ? "within" : force}
        className={
          "flex h-12 items-stretch rounded-sm bg-deep-ice transition-shadow duration-fast ease-glide " +
          "field-focus:outline-2 field-focus:outline-offset-2 field-focus:outline-frost " +
          (disabled
            ? "inset-ring inset-ring-hairline "
            : invalid
              ? "inset-ring inset-ring-thaw field-focus:inset-ring-2 "
              : "inset-ring inset-ring-boundary hover:inset-ring-mist field-focus:inset-ring-frost ")
        }
      >
        <button
          type="button"
          className={`${stepBtn} rounded-s-sm`}
          aria-label={`פחות ${stepKg} ${KG}`}
          aria-controls={id}
          disabled={disabled}
          aria-disabled={!disabled && atMin ? true : undefined}
          onClick={() => step(-1)}
        >
          <Icon name="minus" size={18} />
        </button>
        {/* the whole cell focuses the input, so the tap target is the cell, not the digits */}
        <div
          className="flex flex-1 cursor-text items-center justify-center border-x border-hairline"
          onClick={() => inputRef.current?.focus()}
        >
          <span aria-hidden="true" className={disabled ? "text-fog" : "text-mist"}>
            כ־
          </span>
          <input
            ref={inputRef}
            id={id}
            type="text"
            inputMode="decimal"
            dir="ltr"
            disabled={disabled}
            value={String(kg)}
            aria-invalid={invalid || undefined}
            aria-describedby={`${id}-estimate ${id}-note${invalid ? ` ${id}-error` : ""}`}
            onChange={(e) => {
              const n = Number(e.target.value.replace(/[^\d.]/g, ""));
              if (!Number.isNaN(n)) {
                typing.current = true;
                touched.current = true;
                setKg(Math.min(maxKg, n));
              }
            }}
            onBlur={() => setKg((v) => clamp(v))}
            className="num w-[4ch] bg-transparent text-right text-lead font-medium text-frost outline-none! disabled:text-fog"
          />
          <span className={`ms-2 ${disabled ? "text-fog" : "text-mist"}`}>{KG}</span>
        </div>
        <button
          type="button"
          className={`${stepBtn} rounded-e-sm`}
          aria-label={`עוד ${stepKg} ${KG}`}
          aria-controls={id}
          disabled={disabled}
          aria-disabled={!disabled && atMax ? true : undefined}
          onClick={() => step(1)}
        >
          <Icon name="plus" size={18} />
        </button>
      </div>

      {/* The estimate and its band, drawn as a confidence interval. */}
      <div id={`${id}-estimate`} className="flex flex-col gap-1.5">
        <div className="flex items-baseline justify-between gap-3 text-small">
          <span className="text-mist">מחיר משוער</span>
          <span className="text-frost">
            כ־<Money value={estimate} round className="text-body font-medium" />
          </span>
        </div>
        <div aria-hidden="true" className="relative h-1.5">
          <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-hairline" />
          <span className="absolute inset-y-0 start-[18%] end-[18%] rounded-pill bg-frost/10 inset-ring inset-ring-frost/40" />
          <span className="absolute inset-y-[-3px] start-1/2 w-px bg-frost" />
        </div>
        <div className="flex justify-between text-micro text-fog">
          <Money value={low} round />
          <span className="font-sans text-small text-mist">
            טווח <Num>±{Math.round(variance * 100)}%</Num>
          </span>
          <Money value={high} round />
        </div>
      </div>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {spoken}
      </p>

      {invalid ? (
        <p id={`${id}-error`} className="flex items-center gap-2 text-small text-thaw">
          <Icon name="alert" size={16} />
          <span>{error}</span>
        </p>
      ) : null}
      <p id={`${id}-note`} className="text-small text-mist">
        מוצרים במשקל משתנה יחויבו לפי שקילה בפועל
      </p>
    </div>
  );
}

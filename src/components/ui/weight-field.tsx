"use client";

import { useId, useState } from "react";
import { KG } from "@/lib/format";
import { Icon } from "./icon";
import { Money } from "./money";
import { Num } from "./num";

/**
 * Variable-weight quantity: the customer orders "about 20 kg"; the estimate is
 * shown with its ± band, because the invoice will use the actual weighed kilos.
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
  error?: string;
  disabled?: boolean;
  force?: string;
}) {
  const id = useId();
  const [kg, setKg] = useState(defaultKg);
  const clamp = (n: number) => Math.min(maxKg, Math.max(minKg, Math.round(n * 10) / 10));
  const estimate = kg * pricePerKg;
  const low = kg * (1 - variance) * pricePerKg;
  const high = kg * (1 + variance) * pricePerKg;
  const invalid = Boolean(error);

  const stepBtn =
    "grid size-12 shrink-0 place-items-center text-frost transition-[background-color,color] duration-fast ease-glide " +
    "hover:bg-hairline active:bg-boundary/40 disabled:text-fog disabled:pointer-events-none";

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-small font-medium text-frost">
          {label} <span className="text-mist">· {product}</span>
        </label>
        <span className="text-small text-mist">
          <Money value={pricePerKg} /> ל{KG}
        </span>
      </div>

      <div
        data-force={force === "focus" ? "within" : force}
        className={
          "flex h-12 items-stretch overflow-hidden rounded-sm bg-deep-ice transition-shadow duration-fast ease-glide " +
          (invalid
            ? "shadow-[inset_0_0_0_1px_var(--color-thaw)] "
            : "shadow-[inset_0_0_0_1px_var(--color-boundary)] hover:shadow-[inset_0_0_0_1px_var(--color-mist)] ") +
          "focus-within:shadow-[inset_0_0_0_1px_var(--color-frost)] focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-frost " +
          (disabled ? "shadow-[inset_0_0_0_1px_var(--color-hairline)]! " : "")
        }
      >
        <button
          type="button"
          className={stepBtn}
          aria-label={`פחות ${stepKg} ${KG}`}
          aria-controls={id}
          disabled={disabled || kg <= minKg}
          onClick={() => setKg((v) => clamp(v - stepKg))}
        >
          <Icon name="minus" size={18} />
        </button>
        <div className="flex flex-1 items-center justify-center gap-2 border-x border-hairline">
          <span aria-hidden="true" className={disabled ? "text-fog" : "text-mist"}>כ־</span>
          <input
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
              if (!Number.isNaN(n)) setKg(Math.min(maxKg, n));
            }}
            onBlur={() => setKg((v) => clamp(v))}
            className="num w-[4ch] bg-transparent text-center text-lead font-medium text-frost outline-none! disabled:text-fog"
          />
          <span className={disabled ? "text-fog" : "text-mist"}>{KG}</span>
        </div>
        <button
          type="button"
          className={stepBtn}
          aria-label={`עוד ${stepKg} ${KG}`}
          aria-controls={id}
          disabled={disabled || kg >= maxKg}
          onClick={() => setKg((v) => clamp(v + stepKg))}
        >
          <Icon name="plus" size={18} />
        </button>
      </div>

      {/* The estimate and its band, drawn as a confidence interval. */}
      <div id={`${id}-estimate`} className="flex flex-col gap-1.5" aria-live="polite">
        <div className="flex items-baseline justify-between gap-3 text-small">
          <span className="text-mist">מחיר משוער</span>
          <span className="text-frost">
            כ־<Money value={estimate} className="text-body font-medium" />
          </span>
        </div>
        <div aria-hidden="true" className="relative h-1.5">
          <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-hairline" />
          <span className="absolute inset-y-0 start-[18%] end-[18%] rounded-pill bg-frost/10 shadow-[inset_0_0_0_1px_rgb(232_243_247/0.4)]" />
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

      {invalid ? (
        <p id={`${id}-error`} className="flex items-center gap-2 text-small text-thaw">
          <Icon name="alert" size={16} />
          {error}
        </p>
      ) : null}
      <p id={`${id}-note`} className="text-small text-mist">
        מוצרים במשקל משתנה יחויבו לפי שקילה בפועל
      </p>
    </div>
  );
}

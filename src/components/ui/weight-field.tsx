"use client";

import { type KeyboardEvent, type ReactNode, useEffect, useId, useRef, useState } from "react";
import { formatILS, KG } from "@/lib/format";
import { Button } from "./button";
import { Icon } from "./icon";
import { Money } from "./money";
import { Num } from "./num";

/* What the buyer may type: up to four digits and one decimal (0.1 kg). A comma counts as the point. */
const DRAFT = /^\d{0,4}(?:\.\d?)?$/;
/** PageUp / PageDown move this many kilos. */
const PAGE_KG = 5;
/** The estimate is read once typing pauses this long, never per keystroke. */
const SAY_AFTER_MS = 500;

type Problem = "low" | "over" | null;

/**
 * Variable-weight quantity: the customer orders "about 20 kg"; the estimate is
 * shown with its ± band, because the invoice will use the actual weighed kilos.
 *
 * A spinbutton the buyer can also type into: ↑↓ by one step, PageUp/PageDown by 5,
 * Home/End to the minimum and the day's stock, Enter commits, Esc takes back what
 * was typed. A typed value is never rewritten: below the minimum it is kept and
 * marked invalid; above the stock it is kept with a warning and a one-press fix.
 * Either is said once, when the value is committed (blur or Enter), never per
 * keystroke. The steppers and keys always land inside the range.
 *
 * Focus: steppers and input each show their own ring; the field's outer ring
 * means "the input has keyboard focus". A problem keeps its Thaw stroke until the
 * value is fixed. Screen readers hear one sentence, not a string of numbers.
 * Disabled (sold out) drops the steppers and the estimate: the field stays
 * focusable, dashed, and says why.
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
  disabled = false,
  reason = "אזל להיום",
  force,
}: {
  label?: string;
  product?: string;
  pricePerKg?: number;
  defaultKg?: number;
  /** The order minimum. */
  minKg?: number;
  /** Today's stock: more can be typed, and gets a warning. */
  maxKg?: number;
  stepKg?: number;
  /** Expected weighing variance (±5% → 19–21 kg for 20 kg). */
  variance?: number;
  /** Nothing can be ordered today: no steppers, no estimate, the reason in words. */
  disabled?: boolean;
  /** Why it is disabled: shown under the field and read with it. */
  reason?: ReactNode;
  /** Style-tile only: "focus" pins the field-focus state. */
  force?: string;
}) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const problemOf = (n: number): Problem => (n < minKg ? "low" : n > maxKg ? "over" : null);
  const clamp = (n: number) => Math.min(maxKg, Math.max(minKg, Math.round(n * 10) / 10));

  const [kg, setKg] = useState(defaultKg);
  /** The text while the buyer types; null shows kg itself. */
  const [draft, setDraft] = useState<string | null>(null);
  /** What the last commit found. A prefilled value is checked as if it had just been committed. */
  const [problem, setProblem] = useState<Problem>(() => (disabled ? null : problemOf(defaultKg)));
  const [spoken, setSpoken] = useState("");
  const committed = useRef(defaultKg); // what Esc returns to
  const typed = useRef(false); // keystrokes since the last commit
  const pending = useRef<number | undefined>(undefined); // the debounced estimate sentence

  useEffect(() => () => window.clearTimeout(pending.current), []);

  const estimate = kg * pricePerKg;
  const low = kg * (1 - variance) * pricePerKg;
  const high = kg * (1 + variance) * pricePerKg;
  const invalid = problem !== null;
  const atMin = kg <= minKg;
  const atMax = kg >= maxKg;
  const value = draft ?? String(kg);

  // One atomic sentence for assistive tech: at once after a step or a commit, after a pause in typing.
  const sentence = (n: number) =>
    `כ־${n} ${KG}, מחיר משוער כ־${formatILS(n * pricePerKg, { round: true })}, טווח ${formatILS(n * (1 - variance) * pricePerKg, { round: true })} עד ${formatILS(n * (1 + variance) * pricePerKg, { round: true })}`;
  const problemText = (p: "low" | "over") => (p === "low" ? `המינימום להזמנה הוא ${minKg} ${KG}` : `במלאי היום ${maxKg} ${KG} בלבד`);
  const say = (text: string, after = 0) => {
    window.clearTimeout(pending.current);
    if (after) pending.current = window.setTimeout(() => setSpoken(text), after);
    else setSpoken(text);
  };

  /** A step, a key or the stock fix: the value lands inside the range and counts as committed. */
  const set = (n: number) => {
    const next = clamp(n);
    typed.current = false;
    committed.current = next;
    setDraft(null);
    setKg(next);
    setProblem(null);
    say(sentence(next));
  };

  const step = (by: number) => {
    if (disabled || (by < 0 ? atMin : atMax)) return;
    set(kg + by);
  };

  /** Blur or Enter: keep what was typed, and say once what (if anything) is wrong with it. */
  const commit = () => {
    if (disabled || !typed.current) return;
    typed.current = false;
    committed.current = kg;
    setDraft(null);
    const p = problemOf(kg);
    setProblem(p);
    say(p ? problemText(p) : sentence(kg));
  };

  /** Esc: back to the last committed value. False when nothing was typed, so Esc can mean something else. */
  const revert = () => {
    if (draft === null) return false;
    typed.current = false;
    setDraft(null);
    setKg(committed.current);
    say(sentence(committed.current));
    return true;
  };

  const keys: Record<string, () => void> = {
    ArrowUp: () => step(stepKg),
    ArrowDown: () => step(-stepKg),
    PageUp: () => step(PAGE_KG),
    PageDown: () => step(-PAGE_KG),
    Home: () => set(minKg),
    End: () => set(maxKg),
  };
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    const act = keys[e.key];
    if (act) {
      e.preventDefault();
      act();
    } else if (e.key === "Enter") {
      commit();
    } else if (e.key === "Escape" && revert()) {
      e.preventDefault();
    }
  };

  const stepBtn = "grid size-14 shrink-0 place-items-center transition-[background-color,color,box-shadow] duration-hover ease-glide";
  const stepLive =
    "text-frost hover:bg-hairline active:bg-steel-2 active:shadow-pressed active:duration-tap [&:active>svg]:translate-y-px";
  const ink = disabled ? "text-frost-3" : "text-frost-2";
  const describedBy = [disabled ? `${id}-reason` : `${id}-estimate`, invalid ? `${id}-problem` : null, `${id}-note`]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-caption font-medium text-frost">
          {label} <span className="text-frost-2">· {product}</span>{" "}
          <span className="ms-1 whitespace-nowrap rounded-hair px-1.5 py-0.5 text-frost-3 inset-ring inset-ring-hairline">משקל משתנה</span>
          <span className="sr-only">, ב{KG}</span>
        </label>
        <span className="whitespace-nowrap text-caption text-frost-2">
          <Money value={pricePerKg} /> ל{KG}
        </span>
      </div>

      <div
        data-force={force === "focus" ? "within" : force}
        className={
          "flex h-14 items-stretch rounded-edge bg-deep-ice transition-shadow duration-hover ease-glide " +
          "field-focus:outline-2 field-focus:outline-offset-2 field-focus:outline-frost " +
          (disabled
            ? "outline-1 outline-dashed outline-edge -outline-offset-1 field-focus:outline-solid"
            : invalid
              ? "inset-ring inset-ring-thaw field-focus:inset-ring-2"
              : "inset-ring inset-ring-edge hover:inset-ring-frost-2 field-focus:inset-ring-frost")
        }
      >
        {/* + at the inline start (right): the side of the number line's maximum */}
        {disabled ? null : (
          <button
            type="button"
            className={`${stepBtn} rounded-s-edge ${atMax ? "cursor-not-allowed text-frost-3" : stepLive}`}
            aria-label={`עוד ${stepKg} ${KG}`}
            aria-controls={id}
            aria-disabled={atMax || undefined}
            onClick={() => step(stepKg)}
          >
            <Icon name="plus" size={18} />
          </button>
        )}
        {/* the whole cell focuses the input, so the tap target is the cell, not the digits */}
        <div
          className={`flex flex-1 cursor-text items-center justify-center ${disabled ? "" : "border-x border-hairline"}`}
          onClick={() => inputRef.current?.focus()}
        >
          <span aria-hidden="true" className={ink}>
            כ־
          </span>
          {/* sized to its figure (field-sizing where supported, `size` elsewhere), so ק״ג sits a space away */}
          <input
            ref={inputRef}
            id={id}
            type="text"
            role="spinbutton"
            inputMode="decimal"
            enterKeyHint="done"
            autoComplete="off"
            spellCheck={false}
            dir="ltr"
            size={Math.max(1, value.length)}
            value={value}
            readOnly={disabled}
            aria-disabled={disabled || undefined}
            aria-valuemin={minKg}
            aria-valuemax={maxKg}
            aria-valuenow={kg}
            aria-valuetext={kg === 1 ? "בערך קילוגרם אחד" : `בערך ${kg} קילוגרם`}
            aria-invalid={invalid || undefined}
            aria-describedby={describedBy}
            onChange={(e) => {
              if (disabled) return;
              const raw = e.target.value.replace(/,/g, ".").replace(/[^\d.]/g, "");
              if (!DRAFT.test(raw)) return; // a second point or a second decimal is refused, never rewritten
              typed.current = true;
              setDraft(raw);
              const n = Number.parseFloat(raw);
              if (Number.isFinite(n)) {
                setKg(n);
                say(sentence(n), SAY_AFTER_MS);
              } else {
                // an empty field estimates nothing new: the committed value stands until something is typed
                setKg(committed.current);
                window.clearTimeout(pending.current);
              }
            }}
            onKeyDown={onKeyDown}
            onBlur={commit}
            className={`num min-w-[1ch] bg-transparent text-right text-data font-medium outline-none! [field-sizing:content] ${disabled ? "text-frost-3" : "text-frost"}`}
          />
          <span className={`ms-1 ${ink}`}>{KG}</span>
        </div>
        {disabled ? null : (
          <button
            type="button"
            className={`${stepBtn} rounded-e-edge ${atMin ? "cursor-not-allowed text-frost-3" : stepLive}`}
            aria-label={`פחות ${stepKg} ${KG}`}
            aria-controls={id}
            aria-disabled={atMin || undefined}
            onClick={() => step(-stepKg)}
          >
            <Icon name="minus" size={18} />
          </button>
        )}
      </div>

      {disabled ? (
        <p id={`${id}-reason`} className="flex items-center gap-2 text-caption text-frost-2">
          <span aria-hidden="true" className="size-2 shrink-0 rounded-full inset-ring-[1.5px] inset-ring-frost-3" />
          <span>{reason}</span>
        </p>
      ) : (
        /* The estimate and its band, drawn as a confidence interval. */
        <div id={`${id}-estimate`} className="frost-band flex flex-col gap-1.5 rounded-edge px-3 py-2.5 shadow-frost">
          <div className="flex items-baseline justify-between gap-3 text-caption">
            <span className="text-frost-2">משוער</span>
            <span className="text-frost">
              כ־<Money joined value={estimate} round className="text-body font-medium" />
            </span>
          </div>
          {/* A number line reads left to right, as on the scale: the low end on the left under −,
              the high end on the right under +. The Hebrew label inside keeps its own direction. */}
          <div dir="ltr" className="flex flex-col gap-1.5">
            <div aria-hidden="true" className="relative h-1.5">
              <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-hairline" />
              <span className="absolute inset-y-0 start-[18%] end-[18%] rounded-round bg-frost/10 inset-ring inset-ring-frost/40" />
              <span className="absolute inset-y-[-3px] start-1/2 w-px bg-frost" />
            </div>
            <div className="flex justify-between text-micro text-frost-2">
              <Money value={low} round />
              <span dir="rtl" className="font-sans text-caption">
                טווח <Num>±{Math.round(variance * 100)}%</Num>
              </span>
              <Money value={high} round />
            </div>
          </div>
        </div>
      )}
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {spoken}
      </p>

      {problem ? (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <p id={`${id}-problem`} className="flex items-center gap-2 text-caption text-thaw">
            <Icon name="alert" size={16} />
            {problem === "low" ? (
              <span>
                המינימום להזמנה הוא{" "}
                <span className="whitespace-nowrap">
                  <Num>{minKg}</Num> {KG}
                </span>
              </span>
            ) : (
              <span>
                במלאי היום{" "}
                <span className="whitespace-nowrap">
                  <Num>{maxKg}</Num> {KG}
                </span>{" "}
                בלבד
              </span>
            )}
          </p>
          {problem === "over" ? (
            <Button
              variant="quiet"
              size="sm"
              onClick={() => {
                set(maxKg);
                inputRef.current?.focus(); // the fix unmounts with the warning: focus stays on the field
              }}
            >
              עדכון ל־<Num joined>{maxKg}</Num> {KG}
            </Button>
          ) : null}
        </div>
      ) : null}
      <p id={`${id}-note`} className="text-caption text-frost-2">
        מוצרים במשקל משתנה יחויבו לפי שקילה בפועל
      </p>
    </div>
  );
}

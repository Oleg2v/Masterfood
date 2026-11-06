import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Icon } from "./icon";

/**
 * One chip family, one base: 28px plate, 12px inline padding, 8px gap, a 1px
 * inset ring (its own shadow layer, so it never fights elevation).
 *  - StatusChip: a shipment's state. The lamp's FILL carries it (ring · half · ¾ · solid).
 *  - Tag: category, kashrut, temperature. A small rectangle, never a pill.
 *  - FilterChip: a toggle with aria-pressed and a 44px hit area. With no results it is
 *    aria-disabled, never natively disabled: it stays focusable and its reason is read.
 */
const chipBase = "inline-flex h-7 items-center gap-2 px-3 text-caption font-medium leading-none";

/* ── Status chips: the airport-board status lamps ─────────────────────────── */

/**
 * In real order: בדרך → נחת → בשחרור → במלאי. The lamp FILLS as the goods get
 * closer to the buyer (ring · half · three-quarters · solid), so status reads in
 * greyscale and for colour-blind buyers. Only "in stock" is green.
 */
export type ShipmentStatus = "transit" | "landed" | "release" | "stock";

const statusCopy: Record<ShipmentStatus, string> = {
  transit: "בדרך",
  landed: "נחת",
  release: "בשחרור",
  stock: "במלאי",
};

const lamp: Record<ShipmentStatus, string> = {
  transit: "inset-ring-[1.5px] inset-ring-frost",
  landed: "bg-[linear-gradient(to_left,var(--color-frost)_50%,transparent_50%)] inset-ring-[1.5px] inset-ring-frost",
  release: "bg-[conic-gradient(var(--color-frost)_0_75%,transparent_0)] inset-ring-[1.5px] inset-ring-frost",
  stock: "bg-fresh",
};

export function StatusChip({ status, className = "" }: { status: ShipmentStatus; className?: string }) {
  return (
    <span className={`${chipBase} rounded-hair bg-deep-ice/60 text-frost inset-ring inset-ring-hairline ${className}`}>
      <span aria-hidden="true" className={`size-2 rounded-full ${lamp[status]}`} />
      {statusCopy[status]}
    </span>
  );
}

/* ── Tags: category, kashrut, temperature ─────────────────────────────────── */

type TagTone = "meat" | "fish" | "rabbinate" | "mehadrin" | "chilled" | "frozen" | "demo" | "neutral";

const tagTones: Record<TagTone, string> = {
  meat: "bg-deep-ice/85 text-frost inset-ring inset-ring-hairline",
  fish: "bg-deep-ice/85 text-frost inset-ring inset-ring-hairline",
  rabbinate: "text-frost-2 inset-ring inset-ring-edge",
  // Kashrut is text, never a drawn seal (this is an unofficial demo of a real brand).
  mehadrin: "text-frost inset-ring inset-ring-frost-2",
  chilled: "bg-deep-ice/85 text-ice inset-ring inset-ring-ice/45",
  frozen: "bg-deep-ice/85 text-ice inset-ring inset-ring-ice/45",
  demo: "text-frost-3 inset-ring inset-ring-hairline",
  neutral: "bg-deep-ice/85 text-frost inset-ring inset-ring-hairline",
};

export function Tag({ tone, children, className = "" }: { tone: TagTone; children: ReactNode; className?: string }) {
  return (
    <span className={`${chipBase} rounded-hair ${tagTones[tone]} ${className}`}>
      {tone === "meat" ? <span aria-hidden="true" className="size-2.5 rounded-hair bg-bordeaux inset-ring inset-ring-frost/25" /> : null}
      {tone === "fish" ? <span aria-hidden="true" className="size-2.5 rounded-hair bg-salmon" /> : null}
      {tone === "chilled" || tone === "frozen" ? <Icon name="thermometer" size={14} /> : null}
      {children}
    </span>
  );
}

/* ── Filter chips: toggles with aria-pressed ──────────────────────────────── */

/**
 * `disabled` (no results) is said with aria-disabled and a dashed Edge outline: the chip
 * stays in the tab order and does nothing when pressed. Wire its reason, as visible
 * text, with aria-describedby.
 */
export function FilterChip({
  pressed = false,
  count,
  children,
  force,
  disabled = false,
  onClick,
  className = "",
  ...rest
}: { pressed?: boolean; count?: number; force?: string } & ButtonHTMLAttributes<HTMLButtonElement>) {
  const state = disabled
    ? "cursor-not-allowed text-frost-3 outline-1 outline-dashed outline-edge -outline-offset-1 " +
      "focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-frost focus-visible:outline-offset-2 "
    : (pressed
        ? "bg-frost text-deep-ice hover:bg-frost-hover "
        : "text-frost inset-ring inset-ring-edge hover:bg-steel hover:inset-ring-frost-2 ") +
      // the press: one pixel down into the pressed shadow, within the 80ms tap
      "active:translate-y-px active:shadow-pressed active:duration-tap ";
  return (
    <button
      type="button"
      aria-pressed={pressed}
      aria-disabled={disabled || undefined}
      data-force={force}
      onClick={disabled ? (e) => e.preventDefault() : onClick}
      className={
        "relative inline-flex h-9 items-center gap-2 rounded-hair px-4 text-caption font-medium " +
        "transition-[background-color,color,box-shadow,translate] duration-hover ease-glide " +
        "after:absolute after:-inset-y-1 after:inset-x-0 after:content-[''] " + // 44px hit area
        state +
        className
      }
      {...rest}
    >
      {pressed ? <Icon name="check" size={14} /> : null}
      {children}
      {typeof count === "number" ? (
        <bdi dir="ltr" className={`num text-micro ${pressed && !disabled ? "text-deep-ice/70" : "text-frost-3"}`}>
          {count}
        </bdi>
      ) : null}
    </button>
  );
}

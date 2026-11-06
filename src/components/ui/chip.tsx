import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Icon } from "./icon";

/* ── Status chips: the airport-board status lights ─────────────────────────── */

export type ShipmentStatus = "landed" | "transit" | "release";

const statusCopy: Record<ShipmentStatus, string> = {
  landed: "נחת",
  transit: "בדרך",
  release: "בשחרור",
};

export function StatusChip({ status, className = "" }: { status: ShipmentStatus; className?: string }) {
  return (
    <span
      className={`inline-flex h-7 items-center gap-2 rounded-pill bg-deep-ice/60 ps-2.5 pe-3 text-small font-medium leading-none text-frost shadow-[inset_0_0_0_1px_var(--color-hairline)] ${className}`}
    >
      <span aria-hidden="true" className="relative grid size-2 place-items-center">
        {status === "landed" ? <span className="size-2 rounded-full bg-fresh" /> : null}
        {status === "transit" ? (
          <span className="size-2 rounded-full shadow-[inset_0_0_0_1.5px_var(--color-frost)] motion-ok:animate-breath" />
        ) : null}
        {status === "release" ? (
          <span className="size-2 rounded-full bg-[linear-gradient(to_left,var(--color-mist)_50%,transparent_50%)] shadow-[inset_0_0_0_1.5px_var(--color-mist)]" />
        ) : null}
      </span>
      {statusCopy[status]}
    </span>
  );
}

/* ── Tags: category, kashrut, temperature ─────────────────────────────────── */

type TagTone = "meat" | "fish" | "rabbinate" | "mehadrin" | "chilled" | "frozen" | "demo";

export function Tag({ tone, children, className = "" }: { tone: TagTone; children: ReactNode; className?: string }) {
  const tones: Record<TagTone, string> = {
    meat: "text-frost",
    fish: "text-frost",
    rabbinate: "text-mist shadow-[inset_0_0_0_1px_var(--color-boundary)]",
    // Mehadrin: a double hairline, like a stricter seal.
    mehadrin: "text-frost shadow-[inset_0_0_0_1px_var(--color-mist),inset_0_0_0_3px_var(--color-deep-ice),inset_0_0_0_4px_var(--color-boundary)]",
    chilled: "text-ice shadow-[inset_0_0_0_1px_rgb(127_209_255/0.45)]",
    frozen: "text-ice shadow-[inset_0_0_0_1px_rgb(127_209_255/0.45)]",
    demo: "label-latin text-fog shadow-[inset_0_0_0_1px_var(--color-hairline)]",
  };
  return (
    <span
      className={`inline-flex h-7 items-center gap-1.5 rounded-xs px-2.5 text-small font-medium leading-none ${tones[tone]} ${className}`}
    >
      {tone === "meat" ? <span aria-hidden="true" className="size-2.5 rounded-[1px] bg-bordeaux shadow-[0_0_0_1px_rgb(232_243_247/0.25)]" /> : null}
      {tone === "fish" ? <span aria-hidden="true" className="size-2.5 rounded-[1px] bg-salmon" /> : null}
      {tone === "chilled" || tone === "frozen" ? <Icon name="thermometer" size={14} /> : null}
      {children}
    </span>
  );
}

/* ── Filter chips: toggles with aria-pressed ──────────────────────────────── */

export function FilterChip({
  pressed = false,
  count,
  children,
  force,
  className = "",
  ...rest
}: { pressed?: boolean; count?: number; force?: string } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      data-force={force}
      className={
        "relative inline-flex h-9 items-center gap-2 rounded-pill px-4 text-small font-medium " +
        "transition-[background-color,color,box-shadow,transform] duration-fast ease-glide active:scale-[0.97] " +
        "after:absolute after:-inset-y-1 after:inset-x-0 after:content-[''] " + // 44px hit area
        (pressed
          ? "bg-frost text-deep-ice hover:shadow-frost "
          : "text-frost shadow-[inset_0_0_0_1px_var(--color-boundary)] hover:bg-steel hover:shadow-[inset_0_0_0_1px_var(--color-mist)] ") +
        "disabled:text-fog disabled:shadow-[inset_0_0_0_1px_var(--color-hairline)] " +
        className
      }
      {...rest}
    >
      {pressed ? <Icon name="check" size={14} /> : null}
      {children}
      {typeof count === "number" ? (
        <bdi dir="ltr" className={`num text-micro ${pressed ? "text-deep-ice/70" : "text-fog"}`}>
          {count}
        </bdi>
      ) : null}
    </button>
  );
}

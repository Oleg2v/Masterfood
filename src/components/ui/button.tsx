import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "quiet";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn relative isolate inline-flex select-none items-center justify-center gap-3 overflow-hidden whitespace-nowrap rounded-sm font-medium " +
  "transition-[background-color,color,box-shadow,transform,opacity] duration-fast ease-glide " +
  "active:scale-[0.98] disabled:pointer-events-none aria-busy:pointer-events-none";

const variants: Record<Variant, string> = {
  // Ice-white is the only primary colour: category accents stay semantic.
  primary:
    "bg-frost text-deep-ice shadow-[inset_0_-1px_0_0_rgb(7_20_28/0.18)] hover:shadow-frost " +
    "active:bg-mist disabled:bg-steel disabled:text-fog disabled:shadow-rim",
  secondary:
    "bg-transparent text-frost shadow-[inset_0_0_0_1px_var(--color-boundary)] " +
    "hover:bg-steel hover:shadow-[inset_0_0_0_1px_var(--color-mist)] active:bg-hairline " +
    "disabled:text-fog disabled:shadow-[inset_0_0_0_1px_var(--color-hairline)]",
  quiet:
    "px-1! text-frost underline decoration-boundary decoration-1 underline-offset-[0.4em] " +
    "hover:decoration-frost active:text-mist disabled:text-fog disabled:decoration-hairline",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-small",
  md: "h-12 px-5 text-body",
  lg: "h-14 px-6 text-lead",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  /** Trailing data in mono, after a hairline divider: the order total, a weight. */
  meta?: ReactNode;
  icon?: ReactNode;
  loading?: boolean;
  /** Style-tile only: pin a state ("hover", "focus", "active"). */
  force?: string;
}

export function Button({
  variant = "primary",
  size = "md",
  meta,
  icon,
  loading = false,
  force,
  className = "",
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      data-force={force}
      aria-busy={loading || undefined}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {variant === "primary" ? (
        /* Light crossing a block of ice: a specular sheen that travels start → end on hover. */
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 translate-x-[110%] bg-[linear-gradient(100deg,transparent_30%,rgb(255_255_255/0.75)_50%,transparent_70%)] opacity-0 transition-[translate,opacity] duration-calm ease-glide group-hover/btn:-translate-x-[110%] group-hover/btn:opacity-100 ltr:-translate-x-[110%] ltr:group-hover/btn:translate-x-[110%]"
        />
      ) : null}
      {icon}
      <span className={loading ? "opacity-70" : undefined}>{children}</span>
      {meta ? (
        <>
          <span aria-hidden="true" className="h-4 w-px bg-current opacity-25" />
          <bdi className="num text-[0.9em] font-medium">{meta}</bdi>
        </>
      ) : null}
      {loading ? (
        /* No spinners: a hairline of progress along the bottom edge. */
        <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-0.5 overflow-hidden">
          <span className="block h-full w-1/3 animate-hairline bg-current opacity-60" />
        </span>
      ) : null}
    </button>
  );
}

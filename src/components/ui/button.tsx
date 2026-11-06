import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";

type Variant = "primary" | "secondary" | "quiet";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn relative isolate inline-flex shrink-0 select-none items-center justify-center gap-3 whitespace-nowrap rounded-sm font-medium " +
  "transition-[background-color,color,box-shadow,scale,opacity] duration-fast ease-glide " +
  "active:scale-press disabled:pointer-events-none aria-disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  // Ice-white is the only primary colour: category accents stay semantic.
  primary:
    "bg-frost text-deep-ice shadow-[inset_0_-1px_0_0_rgb(7_20_28/0.18)] hover:shadow-frost " +
    "active:bg-mist disabled:bg-steel disabled:text-fog disabled:shadow-none disabled:inset-ring disabled:inset-ring-hairline",
  secondary:
    "bg-transparent text-frost inset-ring inset-ring-boundary " +
    "hover:bg-steel hover:inset-ring-mist active:bg-hairline " +
    "disabled:text-fog disabled:inset-ring-hairline",
  quiet:
    "min-w-11 px-1! text-frost underline decoration-boundary decoration-1 underline-offset-[0.4em] " +
    "hover:decoration-frost active:text-mist disabled:text-fog disabled:decoration-hairline",
};

/* sm keeps a dense 40px plate but answers to a 44px hit area (::after reaches 2px past each edge). */
const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-small after:absolute after:inset-x-0 after:-inset-y-0.5 after:content-['']",
  md: "h-12 px-5 text-body",
  lg: "h-14 px-6 text-lead",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  /** Trailing data after a hairline divider: the order total, a weight. Put figures in <Num>/<Money>. */
  meta?: ReactNode;
  icon?: ReactNode;
  /** While true the button stays focusable but inert (no double submit from the keyboard). */
  loading?: boolean;
  /** Style-tile only: pin a state ("hover", "focus", "active"). */
  force?: string;
  ref?: Ref<HTMLButtonElement>;
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
  onClick,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      data-force={force}
      aria-disabled={loading || undefined}
      onClick={loading && onClick ? (e) => e.preventDefault() : onClick}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {variant === "primary" ? (
        /* Light crossing a block of ice: one sweep, start → end, each time the pointer arrives. */
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[inherit]">
          <span className="sheen absolute inset-0 translate-x-[110%] bg-[linear-gradient(100deg,transparent_30%,rgb(232_243_247/0.9)_50%,transparent_70%)] opacity-0 group-hover/btn:motion-ok:animate-sheen" />
        </span>
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
        <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-0.5 overflow-hidden rounded-b-[inherit]">
          <span className="block h-full w-1/3 bg-current opacity-60 motion-ok:animate-hairline" />
        </span>
      ) : null}
    </button>
  );
}

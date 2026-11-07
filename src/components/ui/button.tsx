import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";

type Variant = "primary" | "secondary" | "quiet";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn relative isolate inline-flex shrink-0 select-none items-center justify-center gap-3 whitespace-nowrap rounded-edge font-medium " +
  "transition-[background-color,color,text-decoration-color,box-shadow,translate] duration-hover ease-glide";

/* The press: one pixel down into the pressed shadow within the 80ms tap; the release eases back at hover speed. */
const press = "active:translate-y-px active:shadow-pressed active:duration-tap";

/* Unavailable is drawn dashed (buttons, filter chips, the sold-out field). Focus still draws the solid Frost ring. */
const dashed =
  "outline-1 outline-dashed outline-edge -outline-offset-1 " +
  "focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-frost focus-visible:outline-offset-2";

interface Look {
  /** Box and type every state shares. */
  frame?: string;
  /** At rest, and while busy. */
  idle: string;
  /** Pointer feedback, only while the button can act. */
  live: string;
  /** Disabled: still focusable, its reason beside it. */
  off: string;
}

const looks: Record<Variant, Look> = {
  // Ice-white is the only primary colour: category accents stay semantic.
  primary: {
    // inset-ring-transparent: invisible here, but it gives forced colours a solid edge
    idle: "bg-frost text-deep-ice inset-ring inset-ring-transparent shadow-[inset_0_-1px_0_0_rgb(7_20_28/0.18)]",
    live: "hover:bg-frost-hover active:bg-frost-press",
    off: `bg-steel-2 text-frost-3 ${dashed}`,
  },
  secondary: {
    idle: "text-frost inset-ring inset-ring-edge",
    live: "hover:bg-steel hover:inset-ring-frost-2 active:bg-hairline",
    off: `text-frost-3 ${dashed}`,
  },
  quiet: {
    frame: "min-w-11 px-1! underline decoration-1 underline-offset-4",
    idle: "text-frost decoration-edge",
    live: "hover:decoration-frost active:text-frost-2",
    off: "text-frost-3 decoration-dashed decoration-edge",
  },
};

/* sm keeps a dense 40px plate but answers to a 44px hit area (::after reaches 2px past each edge). */
const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-caption after:absolute after:inset-x-0 after:-inset-y-0.5 after:content-['']",
  md: "h-12 px-5 text-body",
  lg: "h-14 px-6 text-body",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  /** Trailing data after a hairline divider: the order total, a weight. Put figures in <Num>/<Money>. */
  meta?: ReactNode;
  icon?: ReactNode;
  /** Sending: aria-busy, repeat presses ignored, a static hairline under the label. No spinner, no loop. */
  loading?: boolean;
  /**
   * Unavailable. Set as aria-disabled, never the native attribute: the button stays in the tab
   * order, so its reason (visible text, wired with aria-describedby) is read; a press does nothing.
   */
  disabled?: boolean;
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
  disabled = false,
  force,
  className = "",
  children,
  type = "button",
  onClick,
  "aria-disabled": ariaDisabled,
  ...rest
}: ButtonProps) {
  const look = looks[variant];
  // A caller's own aria-disabled (a control busy for a moment) is honoured too: the press does nothing.
  const inert = disabled || loading || ariaDisabled === true || ariaDisabled === "true";
  const state = disabled
    ? `${look.off} cursor-not-allowed`
    : inert
      ? `${look.idle} ${loading ? "cursor-progress" : "cursor-not-allowed"}`
      : `${look.idle} ${look.live} ${press}`;

  return (
    <button
      // Inert, the press does nothing without a handler of its own: the caller's onClick is withheld and
      // the button cannot submit a form. So a server component can render a disabled or busy button too.
      type={inert ? "button" : type}
      data-force={force}
      aria-disabled={inert || undefined}
      aria-busy={loading || undefined}
      onClick={inert ? undefined : onClick}
      className={`${base} ${look.frame ?? ""} ${state} ${sizes[size]} ${className}`}
      {...rest}
    >
      {icon}
      {/* Busy: the label dims over a still hairline, the way a skeleton is drawn. */}
      <span
        className={
          loading ? "relative opacity-70 after:absolute after:inset-x-0 after:bottom-1 after:h-px after:bg-current after:content-['']" : undefined
        }
      >
        {children}
      </span>
      {meta ? (
        <>
          <span aria-hidden="true" className="h-4 w-px bg-current opacity-25" />
          <bdi className="num text-[0.9em] font-medium">{meta}</bdi>
        </>
      ) : null}
    </button>
  );
}

import type { ReactNode } from "react";
import { Icon } from "./icon";

export type ToastTone = "success" | "info" | "urgent" | "error";

/* Ice Blue is temperature only, so "info" is neutral Mist. */
const toneMark: Record<ToastTone, string> = {
  success: "bg-fresh",
  info: "bg-mist",
  urgent: "bg-salmon",
  error: "bg-thaw",
};

/**
 * Toast. A square status mark (not an emoji, not a cartoon tick), a title, a mono
 * detail line, one action. A toast WITH an action never times out (WCAG 2.2.1):
 * the bottom hairline timer only runs on toasts without one, and it pauses on
 * hover and focus. With motion stopped the hairline stays full and still.
 * Live-region semantics belong to the toaster that hosts it (`announce` for a
 * stand-alone toast).
 */
export function Toast({
  tone = "success",
  title,
  detail,
  action,
  timer = !action,
  announce = false,
  className = "",
  onClose,
}: {
  tone?: ToastTone;
  title: ReactNode;
  detail?: ReactNode;
  action?: ReactNode;
  timer?: boolean;
  /** Be its own live region. Off when rendered inside a persistent toaster region. */
  announce?: boolean;
  className?: string;
  onClose?: () => void;
}) {
  return (
    <div
      role={announce ? (tone === "error" ? "alert" : "status") : undefined}
      className={`group/toast relative flex w-full max-w-toast items-start gap-3 rounded-md bg-steel py-4 ps-4 pe-2 shadow-float inset-ring inset-ring-hairline ${className}`}
    >
      <span aria-hidden="true" className={`mt-2 size-2 shrink-0 rounded-hair ${toneMark[tone]}`} />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="text-body font-medium text-frost">{title}</p>
        {detail ? <p className="text-small text-mist">{detail}</p> : null}
      </div>
      {action ? <div className="shrink-0 self-center">{action}</div> : null}
      <button
        type="button"
        aria-label="סגירת ההודעה"
        onClick={onClose}
        className="relative grid size-10 shrink-0 place-items-center rounded-sm text-mist transition-colors duration-fast ease-glide after:absolute after:-inset-0.5 after:content-[''] hover:bg-hairline hover:text-frost"
      >
        <Icon name="close" size={16} />
      </button>
      {timer ? (
        <span aria-hidden="true" className="absolute inset-x-2 bottom-0 h-px overflow-hidden bg-hairline">
          {/* melts toward the inline end, like ice off a ledge; freezes under the pointer or focus */}
          <span
            className={`block h-full origin-right motion-ok:animate-toast-timer group-hover/toast:[animation-play-state:paused] group-focus-within/toast:[animation-play-state:paused] ${toneMark[tone]}`}
          />
        </span>
      ) : null}
    </div>
  );
}

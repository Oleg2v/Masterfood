import type { ReactNode } from "react";
import { Icon } from "./icon";

export type ToastTone = "success" | "info" | "urgent" | "error";

const toneMark: Record<ToastTone, string> = {
  success: "bg-fresh",
  info: "bg-ice",
  urgent: "bg-salmon",
  error: "bg-thaw",
};

const toneTimer: Record<ToastTone, string> = {
  success: "bg-fresh",
  info: "bg-ice",
  urgent: "bg-salmon",
  error: "bg-thaw",
};

/**
 * Toast. A square status mark (not an emoji, not a cartoon tick), a title, a mono
 * detail line, one action. The hairline at the bottom is the auto-dismiss timer;
 * it pauses on hover and focus. Errors use role="alert", everything else "status".
 */
export function Toast({
  tone = "success",
  title,
  detail,
  action,
  timer = true,
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
      className={`group/toast relative flex w-full max-w-[26rem] items-start gap-3 overflow-hidden rounded-md bg-steel py-4 ps-4 pe-2 shadow-float ${className}`}
    >
      <span aria-hidden="true" className={`mt-2 size-2 shrink-0 rounded-[1px] ${toneMark[tone]}`} />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="text-body font-medium leading-snug text-frost">{title}</p>
        {detail ? <p className="text-small text-mist">{detail}</p> : null}
      </div>
      {action ? <div className="shrink-0 self-center">{action}</div> : null}
      <button
        type="button"
        aria-label="סגירת ההודעה"
        onClick={onClose}
        className="grid size-10 shrink-0 place-items-center rounded-sm text-mist transition-colors duration-fast ease-glide hover:bg-hairline hover:text-frost"
      >
        <Icon name="close" size={16} />
      </button>
      {timer ? (
        <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-hairline">
          <span
            className={`block h-full origin-right animate-toast-timer group-hover/toast:[animation-play-state:paused] group-focus-within/toast:[animation-play-state:paused] ${toneTimer[tone]}`}
          />
        </span>
      ) : null}
    </div>
  );
}

import type { AnimationEvent, ReactNode } from "react";
import { durations } from "@/design/tokens";
import { Icon } from "./icon";

export type ToastTone = "success" | "info" | "urgent" | "error";

/* Green means stock and Ice Blue means temperature, so success is Frost and info is Frost-2. */
const toneMark: Record<ToastTone, string> = {
  success: "bg-frost",
  info: "bg-frost-2",
  urgent: "bg-salmon",
  error: "bg-thaw",
};
const toneText: Record<ToastTone, string> = {
  success: "text-frost",
  info: "text-frost-2",
  urgent: "text-salmon",
  error: "text-thaw",
};
const toneGlyph = { success: "check", info: "info", urgent: "clock", error: "alert" } as const;

/* How long the hairline takes to melt (the toast-timer keyframes run for --dur-toast). */
const TOAST_MS = durations.find((d) => d.id === "toast")!.ms;

/**
 * Toast. A square status mark (not an emoji, not a cartoon tick), a title, a mono
 * detail line, one action. A toast WITH an action never times out (WCAG 2.2.1).
 * One without an action melts: the bottom hairline IS its timer. It freezes under
 * the pointer and while focus is inside, and `onTimeout` fires only once it has run
 * its whole course, so what you see is exactly how long you have. With motion
 * stopped there is no hairline and no timeout: the toast stays until closed.
 * The detail line is a size container, so a caller can set its facts by the
 * toast's real width. Live-region semantics belong to the toaster that hosts it
 * (`announce` for a stand-alone toast).
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
  onTimeout,
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
  /** Called when the timer hairline has fully melted. */
  onTimeout?: () => void;
}) {
  // An animation cut short (collapsed to 0.01ms when motion stops) ends too: only a full run counts.
  const melted = onTimeout
    ? (e: AnimationEvent<HTMLSpanElement>) => {
        if (e.animationName === "toast-timer" && e.elapsedTime * 1000 >= TOAST_MS - 50) onTimeout();
      }
    : undefined;

  return (
    <div
      role={announce ? (tone === "error" ? "alert" : "status") : undefined}
      className={`group/toast relative flex w-full max-w-toast items-start gap-3 rounded-edge bg-steel-2 py-4 ps-5 pe-2 shadow-float inset-ring inset-ring-hairline ${className}`}
    >
      {/* status never rests on hue: a 2px rule at the inline start plus a glyph */}
      <span aria-hidden="true" className={`absolute inset-y-3 start-0 w-0.5 rounded-hair ${toneMark[tone]}`} />
      <Icon name={toneGlyph[tone]} size={20} className={`mt-0.5 ${toneText[tone]} forced-colors:text-[CanvasText]`} />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="text-body font-medium text-frost">{title}</p>
        {detail ? <p className="@container text-caption text-frost-2">{detail}</p> : null}
      </div>
      {action ? <div className="shrink-0 self-center">{action}</div> : null}
      <button
        type="button"
        aria-label="סגירת ההודעה"
        onClick={onClose}
        className="relative grid size-10 shrink-0 place-items-center rounded-edge text-frost-2 transition-colors duration-hover ease-glide after:absolute after:-inset-0.5 after:content-[''] hover:bg-hairline hover:text-frost"
      >
        <Icon name="close" size={16} />
      </button>
      {timer ? (
        <span aria-hidden="true" className="absolute inset-x-2 bottom-0 h-px overflow-hidden bg-hairline motion-still:hidden">
          {/* anchored at the inline start (right), it melts back from the inline end, like ice off a ledge.
              The pause is !important: the animation shorthand from motion-ok would reset it to running. */}
          <span
            onAnimationEnd={melted}
            className={`block h-full origin-right motion-ok:animate-toast-timer group-hover/toast:[animation-play-state:paused]! group-focus-within/toast:[animation-play-state:paused]! ${toneMark[tone]}`}
          />
        </span>
      ) : null}
    </div>
  );
}

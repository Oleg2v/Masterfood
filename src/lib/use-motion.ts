"use client";

import { useSyncExternalStore } from "react";
import { MOTION_KEY } from "./motion-script";

/**
 * One source of truth for "is motion allowed right now". The OS setting
 * (prefers-reduced-motion) is the default, and the in-app "עצירת אנימציה" switch
 * overrides it in either direction through <html data-motion>:
 *   "off"  → still, whatever the OS says;
 *   "on"   → moving, even though the OS asks for reduced motion;
 *   absent → follow the OS.
 * still = off || (not on && the OS reduces motion). The motion-ok / motion-still CSS
 * variants (globals.css) read the same attribute and media query, so the stylesheet,
 * both toggles and every JS-driven animation always agree.
 */

const REDUCE = "(prefers-reduced-motion: reduce)";

function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion"] });
  const mq = window.matchMedia(REDUCE);
  mq.addEventListener("change", cb);
  return () => {
    mo.disconnect();
    mq.removeEventListener("change", cb);
  };
}

type Choice = "on" | "off" | undefined;

const choice = (): Choice => {
  const v = document.documentElement.dataset.motion;
  return v === "on" || v === "off" ? v : undefined;
};
const osReduced = () => window.matchMedia(REDUCE).matches;
const userStopped = () => choice() === "off";

/** Still right now, for code outside React's render (handlers, timers, canvas loops). */
export function isStill(): boolean {
  const c = choice();
  return c === "off" || (c !== "on" && osReduced());
}

/** true when the visitor has explicitly stopped motion with "עצירת אנימציה" */
export function useMotionStopped(): boolean {
  return useSyncExternalStore(subscribe, userStopped, () => false);
}

/** true when motion should be still for any reason: the switch, or an OS setting it has not overridden */
export function useStill(): boolean {
  return useSyncExternalStore(subscribe, isStill, () => false);
}

/**
 * The switch. Stopping always writes "off". Resuming writes "on" while the OS asks for reduced
 * motion (an explicit override, remembered); otherwise it clears the choice, so the page follows
 * the OS again and a later OS setting is never overruled by a stale click.
 */
export function setMotionStopped(stopped: boolean) {
  const next: Choice = stopped ? "off" : osReduced() ? "on" : undefined;
  const html = document.documentElement;
  if (next) html.dataset.motion = next;
  else delete html.dataset.motion;
  try {
    if (next) localStorage.setItem(MOTION_KEY, next);
    else localStorage.removeItem(MOTION_KEY);
  } catch {
    /* storage blocked: the choice lasts for this page view */
  }
}

/* ?still=1 pins the demo morning for screenshots: the clock stops at 04:12:33 with its
   seconds, and the frost glass shows its composed, pre-wiped arc. It is a screenshot
   switch only: review links use the plain /style-tile URL, where everything moves. */
const noop = () => () => {};
export const isPinned = () => new URLSearchParams(window.location.search).has("still");

/** true on ?still=1 (screenshots only) */
export function usePinned(): boolean {
  return useSyncExternalStore(noop, isPinned, () => false);
}

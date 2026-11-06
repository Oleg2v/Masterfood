"use client";

import { useSyncExternalStore } from "react";
import { MOTION_KEY } from "./motion-script";

/**
 * One source of truth for "is motion allowed right now": the OS setting
 * (prefers-reduced-motion) OR the in-app "עצירת אנימציה" switch, which lives on
 * <html data-motion="off">. Every toggle and every JS-driven animation reads
 * this, so two toggles can never disagree and the countdown can slow down too.
 */

function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-motion"] });
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => {
    mo.disconnect();
    mq.removeEventListener("change", cb);
  };
}

const userStopped = () => document.documentElement.dataset.motion === "off";
const osReduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** true when the visitor pressed "עצירת אנימציה" */
export function useMotionStopped(): boolean {
  return useSyncExternalStore(subscribe, userStopped, () => false);
}

/** true when motion should be still for any reason (OS setting or the switch) */
export function useStill(): boolean {
  return useSyncExternalStore(subscribe, () => userStopped() || osReduced(), () => false);
}

export function setMotionStopped(stopped: boolean) {
  const html = document.documentElement;
  if (stopped) html.dataset.motion = "off";
  else delete html.dataset.motion;
  try {
    localStorage.setItem(MOTION_KEY, stopped ? "off" : "on");
  } catch {
    /* storage blocked: the choice lasts for this page view */
  }
}


/* ?still=1 pins the demo morning for screenshots: the clock stops at 04:12:33 with its
   seconds, and the frost glass shows its composed, pre-wiped arc. */
const noop = () => () => {};
export const isPinned = () => new URLSearchParams(window.location.search).has("still");

/** true on ?still=1 (screenshots and review links) */
export function usePinned(): boolean {
  return useSyncExternalStore(noop, isPinned, () => false);
}

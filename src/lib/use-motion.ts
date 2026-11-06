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


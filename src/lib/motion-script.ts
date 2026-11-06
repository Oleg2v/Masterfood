/** Storage key for the "עצירת אנימציה" choice (shared by the head script and use-motion). */
export const MOTION_KEY = "mf-motion";

/**
 * Inline <head> script: restores the visitor's explicit choice before first paint, so nothing
 * moves for a frame when they stopped it, and nothing stands still when they overrode the OS
 * reduced-motion setting. "off" and "on" are the only values ever stored; no value means
 * "follow the OS", which CSS answers by itself.
 */
export const restoreMotionScript = `try{var m=localStorage.getItem("${MOTION_KEY}");if(m==="off"||m==="on")document.documentElement.dataset.motion=m}catch(e){}`;

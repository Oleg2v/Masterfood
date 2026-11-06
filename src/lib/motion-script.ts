/** Storage key for the "עצירת אנימציה" choice (shared by the head script and use-motion). */
export const MOTION_KEY = "mf-motion";

/** Inline <head> script: restores the choice before first paint (no flash of motion). */
export const restoreMotionScript = `try{if(localStorage.getItem("${MOTION_KEY}")==="off")document.documentElement.dataset.motion="off"}catch(e){}`;

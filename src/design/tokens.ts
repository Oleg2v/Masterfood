/**
 * מאסטרפוד · השוק של מחר — design tokens.
 *
 * SINGLE SOURCE OF TRUTH. `npm run tokens` (also run by predev/prebuild)
 * turns this file into src/app/tokens.css, a Tailwind v4 `@theme` block, so
 * every utility (bg-steel, text-h1, rounded-sm, shadow-rim, ease-glide,
 * duration-flap …) is generated from the values below, and the /style-tile
 * page renders its documentation from the very same objects.
 *
 * Keep this file dependency-free: it is imported by Node directly
 * (type stripping) as well as by Next.
 */

/* ───────────────────────────── Colour ───────────────────────────── */

export type ColorGroup = "base" | "accent" | "derived";

export interface ColorToken {
  /** CSS/Tailwind name: `--color-${id}` → bg-${id}, text-${id}, border-${id} */
  id: string;
  en: string;
  he: string;
  hex: string;
  group: ColorGroup;
  /** What it is for, in Hebrew (shown on the style tile). */
  role: string;
  /** May this colour carry text on Deep Ice / Steel? Checked by scripts/check-contrast.ts. */
  text: boolean;
}

export const colors: readonly ColorToken[] = [
  // Brief palette — the four neutrals
  { id: "deep-ice", en: "Deep Ice", he: "קרח עמוק", hex: "#07141C", group: "base", role: "רקע הדף. הלילה שלפני השוק.", text: false },
  { id: "steel", en: "Steel", he: "פלדה", hex: "#0F2230", group: "base", role: "משטחים: לוח, כרטיסים, שורות.", text: false },
  { id: "frost", en: "Frost", he: "כפור", hex: "#E8F3F7", group: "base", role: "טקסט ראשי, פעולה ראשית וטבעת המיקוד.", text: true },
  { id: "hairline", en: "Hairline", he: "קו שיער", hex: "#23394A", group: "base", role: "קווי הפרדה ורשת. דקורטיבי בלבד.", text: false },
  // Brief palette — category accents (semantic, never decorative)
  { id: "salmon", en: "Salmon", he: "סלמון", hex: "#FF7A59", group: "accent", role: "דגים. ודחיפות: פחות מ-30 דקות לסגירה.", text: true },
  { id: "bordeaux", en: "Bordeaux", he: "בורדו", hex: "#8C1C2B", group: "accent", role: "בשר. מילוי בלבד, לעולם לא טקסט על רקע כהה.", text: false },
  { id: "ice", en: "Ice Blue", he: "כחול קרח", hex: "#7FD1FF", group: "accent", role: "טמפרטורה ושרשרת הקירור – ורק הן.", text: true },
  { id: "fresh", en: "Fresh Green", he: "ירוק טרי", hex: "#2BD48A", group: "accent", role: "במלאי. ירידת מחיר לטובת הלקוח.", text: true },
  // Derived — the tints the system needs to stay AA
  { id: "mist", en: "Mist", he: "ערפל", hex: "#9DB4C0", group: "derived", role: "טקסט משני: מקור, יחידה, תיאור.", text: true },
  { id: "fog", en: "Fog", he: "אובך", hex: "#7F98A6", group: "derived", role: "טקסט שלישוני ותוויות מונו קטנות.", text: true },
  { id: "boundary", en: "Boundary", he: "גבול", hex: "#5A7488", group: "derived", role: "גבולות של שדות ופקדים (3:1).", text: false },
  { id: "claret", en: "Claret", he: "קלרט", hex: "#E58A95", group: "derived", role: "בשר כטקסט: גוון בהיר של בורדו שעובר AA.", text: true },
  { id: "thaw", en: "Thaw", he: "הפשרה", hex: "#FFB547", group: "derived", role: "שגיאות בלבד. חום הוא האויב של שרשרת הקירור – לכן ענבר, לא אדום.", text: true },
];

/** Background pairs every text colour must be checked against. */
export const textGrounds = ["deep-ice", "steel"] as const;

/* ───────────────────────────── Type ───────────────────────────── */

export const VIEWPORT = { minPx: 360, maxPx: 1440, rootPx: 16 } as const;

export type FontRole = "display" | "ui" | "mono";

export interface TypeStep {
  step: number;
  /** Tailwind name: text-${id} */
  id: string;
  minPx: number;
  maxPx: number;
  lineHeight: number;
  /** Only Latin mono micro-labels are tracked. Hebrew is never letter-spaced. */
  trackingEm: number;
  family: FontRole;
  weight: number;
  usage: string;
  sample: string;
}

export const typeScale: readonly TypeStep[] = [
  { step: -2, id: "micro", minPx: 12, maxPx: 12, lineHeight: 1.4, trackingEm: 0.08, family: "mono", weight: 500, usage: "תוויות מונו לטיניות: קודי שדה תעופה, HACCP, מק״ט", sample: "OSL–TLV · 05:40 · HACCP" },
  { step: -1, id: "small", minPx: 13, maxPx: 14, lineHeight: 1.5, trackingEm: 0, family: "ui", weight: 400, usage: "מטא-דאטה, הערות שוליים, תגיות", sample: "מוצרים במשקל משתנה יחויבו לפי שקילה בפועל" },
  { step: 0, id: "body", minPx: 16, maxPx: 17, lineHeight: 1.6, trackingEm: 0, family: "ui", weight: 400, usage: "גוף טקסט, שדות, כפתורים", sample: "המחירים של היום, מה שנחת הבוקר, וההזמנה למחר – בדקה." },
  { step: 1, id: "lead", minPx: 18, maxPx: 21, lineHeight: 1.5, trackingEm: 0, family: "ui", weight: 400, usage: "פתיח, שורת לוח, מחיר בכרטיס", sample: "סלמון נורבגי טרי · נחת 05:40" },
  { step: 2, id: "title", minPx: 24, maxPx: 28, lineHeight: 1.25, trackingEm: 0, family: "display", weight: 500, usage: "שם מוצר בכרטיס, כותרת טבלה", sample: "פיקנייה" },
  { step: 3, id: "heading", minPx: 28, maxPx: 38, lineHeight: 1.2, trackingEm: 0, family: "display", weight: 500, usage: "כותרת קטע", sample: "מה נחת הלילה" },
  { step: 4, id: "headline", minPx: 30, maxPx: 50, lineHeight: 1.1, trackingEm: 0, family: "display", weight: 400, usage: "כותרת מסך", sample: "מפת הנתחים" },
  { step: 5, id: "display", minPx: 40, maxPx: 84, lineHeight: 1.0, trackingEm: 0, family: "display", weight: 300, usage: "כותרת עמוד גדולה", sample: "השוק של מחר" },
  { step: 6, id: "monument", minPx: 52, maxPx: 144, lineHeight: 0.92, trackingEm: 0, family: "display", weight: 300, usage: "השעון לסגירה, רגע אחד בכל מסך", sample: "04:12:33" },
];

/** clamp(min, intercept + slope·vw, max) between VIEWPORT.minPx and VIEWPORT.maxPx, in rem + vw. */
export function fluidClamp(minPx: number, maxPx: number): string {
  const { minPx: vMin, maxPx: vMax, rootPx } = VIEWPORT;
  const r = (n: number) => Number(n.toFixed(4)).toString();
  if (minPx === maxPx) return `${r(minPx / rootPx)}rem`;
  const slope = (maxPx - minPx) / (vMax - vMin);
  const interceptPx = minPx - slope * vMin;
  return `clamp(${r(minPx / rootPx)}rem, ${r(interceptPx / rootPx)}rem + ${r(slope * 100)}vw, ${r(maxPx / rootPx)}rem)`;
}

/** The px a fluid step resolves to at a given viewport width. */
export function fluidPxAt(minPx: number, maxPx: number, viewportPx: number): number {
  const { minPx: vMin, maxPx: vMax } = VIEWPORT;
  const t = Math.min(1, Math.max(0, (viewportPx - vMin) / (vMax - vMin)));
  return minPx + (maxPx - minPx) * t;
}

/* ───────────────────────────── Space ───────────────────────────── */

/** Tailwind's numeric spacing: key n → n × 4px (via --spacing: 0.25rem). */
export const SPACING_BASE_PX = 4;

export interface SpaceStep {
  key: number;
  px: number;
  usage: string;
}

export const spacing: readonly SpaceStep[] = [
  { key: 1, px: 4, usage: "בין אייקון לטקסט" },
  { key: 2, px: 8, usage: "ריפוד פנימי של תגית" },
  { key: 3, px: 12, usage: "רווח בין שדות צפופים" },
  { key: 4, px: 16, usage: "שוליים במובייל, ריפוד כרטיס" },
  { key: 6, px: 24, usage: "בין רכיבים בקבוצה" },
  { key: 8, px: 32, usage: "שוליים בדסקטופ" },
  { key: 12, px: 48, usage: "בין קבוצות" },
  { key: 16, px: 64, usage: "בין קטעים במובייל" },
  { key: 24, px: 96, usage: "בין קטעים בדסקטופ" },
  { key: 32, px: 128, usage: "נשימה לפני כותרת מונומנטלית" },
];

/* ───────────────────────────── Radius ───────────────────────────── */

export interface RadiusToken {
  id: string;
  px: number;
  usage: string;
}

export const radii: readonly RadiusToken[] = [
  { id: "none", px: 0, usage: "לוח, טבלאות, תמונות" },
  { id: "xs", px: 2, usage: "אריחי הלוח המתהפכים" },
  { id: "sm", px: 4, usage: "כפתורים ושדות" },
  { id: "md", px: 8, usage: "כרטיסים וטוסטים" },
  { id: "pill", px: 999, usage: "תגיות סטטוס, כמו נורית בשדה תעופה" },
];

/* ───────────────────────────── Shadow ───────────────────────────── */

export interface ShadowToken {
  id: string;
  css: string;
  usage: string;
}

export const shadows: readonly ShadowToken[] = [
  { id: "rim", css: "inset 0 1px 0 0 rgb(232 243 247 / 0.06), inset 0 0 0 1px rgb(35 57 74 / 1)", usage: "אור קצה על משטח פלדה" },
  { id: "raise", css: "inset 0 1px 0 0 rgb(232 243 247 / 0.08), 0 1px 0 0 rgb(0 0 0 / 0.4), 0 16px 32px -20px rgb(0 0 0 / 0.8)", usage: "כרטיס במעבר עכבר" },
  { id: "float", css: "inset 0 1px 0 0 rgb(232 243 247 / 0.08), 0 24px 48px -16px rgb(2 8 12 / 0.9)", usage: "טוסט, תפריט צף" },
  { id: "frost", css: "0 0 0 1px rgb(232 243 247 / 0.34), 0 0 32px -6px rgb(232 243 247 / 0.16)", usage: "הילה קרה: נבחר, בהזמנה" },
  { id: "ember", css: "0 0 0 1px rgb(255 122 89 / 0.35), 0 0 40px -6px rgb(255 122 89 / 0.35)", usage: "דחיפות: פחות מ-30 דקות" },
];

/* ───────────────────────────── Motion ───────────────────────────── */

export interface DurationToken {
  id: string;
  ms: number;
  usage: string;
}

export const durations: readonly DurationToken[] = [
  { id: "flap", ms: 90, usage: "חצי היפוך של אריח בלוח" },
  { id: "fast", ms: 160, usage: "מעבר עכבר, לחיצה" },
  { id: "base", ms: 240, usage: "פתיחה של רכיב, החלפת מצב" },
  { id: "slow", ms: 420, usage: "כניסת טוסט, מעבר מסך" },
  { id: "calm", ms: 720, usage: "חשיפה של כותרת" },
  { id: "thaw", ms: 1800, usage: "הכפור חוזר לכסות אחרי ניגוב" },
  { id: "drift", ms: 24000, usage: "ערפל נע ברקע" },
];

export interface EasingToken {
  id: string;
  bezier: readonly [number, number, number, number];
  usage: string;
}

export const easings: readonly EasingToken[] = [
  { id: "glide", bezier: [0.22, 1, 0.36, 1], usage: "ברירת מחדל: יציאה רכה, בלי קפיצה" },
  { id: "settle", bezier: [0.65, 0, 0.35, 1], usage: "מעבר בין מצבים" },
  { id: "drop", bezier: [0.55, 0, 0.9, 0.4], usage: "אריח נופל בכוח המשיכה" },
  { id: "breath", bezier: [0.37, 0, 0.63, 1], usage: "פעימה עדינה של השעון" },
];

export function cubicBezier(e: EasingToken): string {
  return `cubic-bezier(${e.bezier.join(", ")})`;
}

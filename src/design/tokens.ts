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

export type ColorGroup = "base" | "accent" | "derived" | "material";

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
  // Brief palette — category accents: data only, never decoration
  { id: "salmon", en: "Salmon", he: "סלמון", hex: "#FF7A59", group: "accent", role: "דגים. ותפקיד שני אחד: 30 הדקות האחרונות לפני הסגירה.", text: true },
  { id: "bordeaux", en: "Bordeaux", he: "בורדו", hex: "#8C1C2B", group: "accent", role: "בשר. מילוי בלבד, לעולם לא טקסט על רקע כהה.", text: false },
  { id: "ice", en: "Ice Blue", he: "כחול קרח", hex: "#7FD1FF", group: "accent", role: "טמפרטורה ושרשרת הקירור – ורק הן.", text: true },
  { id: "fresh", en: "Fresh Green", he: "ירוק טרי", hex: "#2BD48A", group: "accent", role: "במלאי – ורק זה.", text: true },
  // Derived — the ramp that keeps the system at AA
  { id: "frost-2", en: "Frost 2", he: "כפור 2", hex: "#93AAB8", group: "derived", role: "טקסט משני: מקור, יחידות, עזרה, שינויי מחיר.", text: true },
  { id: "frost-3", en: "Frost 3", he: "כפור 3", hex: "#7A93A3", group: "derived", role: "טקסט שלישוני: שעות, כותרות עמודה, קרדיטים, נקודות מובילות.", text: true },
  { id: "edge", en: "Edge", he: "קצה", hex: "#5F7A8B", group: "derived", role: "גבול של כל פקד: שדות, כפתורים משניים, תגיות (3:1 לפחות).", text: false },
  { id: "meat-ink", en: "Meat ink", he: "דיו בשר", hex: "#D9849A", group: "derived", role: "בשר כטקסט או קו: כותרת ״בשר״, קו מוביל במפת הנתחים.", text: true },
  { id: "thaw", en: "Thaw", he: "הפשרה", hex: "#FFB547", group: "derived", role: "שגיאות, ובהמשך חריגות טמפרטורה. בפלטה קפואה, החום הוא האזעקה.", text: true },
  // Surfaces and states (never text)
  { id: "steel-2", en: "Steel 2", he: "פלדה 2", hex: "#132A3A", group: "material", role: "משטח מורם: ריחוף כרטיס, הודעות, מילוי מנוטרל.", text: false },
  { id: "well", en: "Well", he: "באר", hex: "#040E14", group: "material", role: "השקע שמאחורי הלוח המתהפך ולוחיות השעון.", text: false },
  { id: "shadow-ink", en: "Shadow ink", he: "דיו צל", hex: "#02080C", group: "material", role: "בסיס כל צל וציר האריח: עומק כחול־שחור, לעולם לא אפור.", text: false },
  { id: "frost-hover", en: "Frost hover", he: "קרח מלוטש", hex: "#F4FAFC", group: "material", role: "כפתור ראשי בריחוף.", text: false },
  { id: "frost-press", en: "Frost press", he: "קרח דחוס", hex: "#CFE2EA", group: "material", role: "כפתור ראשי בלחיצה.", text: false },
  { id: "meat-hover", en: "Meat hover", he: "בורדו ריחוף", hex: "#A02133", group: "material", role: "מילוי בורדו בריחוף (אזור במפה, לשונית בשר).", text: false },
  { id: "meat-press", en: "Meat press", he: "בורדו לחיצה", hex: "#74161F", group: "material", role: "מילוי בורדו בלחיצה או בבחירה.", text: false },
  { id: "frost-wash", en: "Frost wash", he: "שטיפת כפור", hex: "#152129", group: "material", role: "שורה שנבחרה או שהתעדכנה.", text: false },
  { id: "thaw-wash", en: "Thaw wash", he: "שטיפת הפשרה", hex: "#2A2B22", group: "material", role: "רקע להודעת שגיאה ולשורה שנכשלה.", text: false },
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
  { step: -2, id: "micro", minPx: 12, maxPx: 13, lineHeight: 1.33, trackingEm: 0.06, family: "mono", weight: 500, usage: "תוויות לטיניות בלבד: קודי נמל, מק״ט, קרדיטים", sample: "OSL–TLV · 05:40 · HACCP" },
  { step: -1, id: "caption", minPx: 14, maxPx: 15, lineHeight: 1.6, trackingEm: 0, family: "ui", weight: 400, usage: "כיתוב, עזרה, תגיות. הרצפה של העברית: אף פעם לא קטן מ־14", sample: "מוצרים במשקל משתנה יחויבו לפי שקילה בפועל" },
  { step: 0, id: "body", minPx: 16, maxPx: 18, lineHeight: 1.6, trackingEm: 0, family: "ui", weight: 400, usage: "גוף טקסט, שדות, כפתורים, שורות", sample: "המחירים של היום, מה שנחת הבוקר, וההזמנה למחר – בדקה." },
  { step: 1, id: "data", minPx: 18, maxPx: 22, lineHeight: 1.25, trackingEm: 0, family: "mono", weight: 500, usage: "כל מספר שנסחר: מחיר, משקל, שעה", sample: "₪62.90 · 312 · 05:40" },
  { step: 2, id: "dish", minPx: 24, maxPx: 30, lineHeight: 1.25, trackingEm: 0, family: "display", weight: 500, usage: "שם הנתח, כמו מנה בתפריט. הרצפה של Frank Ruhl", sample: "פיקנייה" },
  { step: 3, id: "title", minPx: 28, maxPx: 40, lineHeight: 1.2, trackingEm: 0, family: "display", weight: 500, usage: "כותרת משנה, הנתח הנבחר במפה", sample: "מה נחת הלילה" },
  { step: 4, id: "section", minPx: 32, maxPx: 56, lineHeight: 1.1, trackingEm: 0, family: "display", weight: 400, usage: "כותרת פרק, ותווית השעון", sample: "מפת הנתחים" },
  { step: 5, id: "headline", minPx: 44, maxPx: 88, lineHeight: 1.05, trackingEm: 0, family: "display", weight: 300, usage: "השוק של מחר, וכותרת ״ההזמנה נשלחה״", sample: "השוק של מחר" },
  { step: 6, id: "display", minPx: 60, maxPx: 148, lineHeight: 1, trackingEm: 0, family: "display", weight: 300, usage: "הענק היחיד במסך: ספרות השעון לסגירה", sample: "04:12:33" },
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
  { id: "none", px: 0, usage: "בית הלוח, שורות, ספרי חשבונות, צילומים" },
  { id: "hair", px: 2, usage: "אריחי הלוח ולוחיות השעון, תגיות" },
  { id: "edge", px: 4, usage: "כפתורים, שדות, כרטיסים, הודעות" },
  { id: "sheet", px: 12, usage: "פינות עליונות של גיליון תחתון בטלפון בלבד" },
  { id: "round", px: 999, usage: "נוריות סטטוס, מתג" },
];

/** Shapes that are not a px radius. */
export const shapes = [{ id: "oval", css: "50%", usage: "חותמת מקור (קוד ארץ ונמל)" }] as const;

/** Stacking order: one ladder, no magic numbers. */
export const zLadder = [
  { id: "bar", z: 30, usage: "סרגל עליון דביק" },
  { id: "toast", z: 40, usage: "הודעות" },
  { id: "badge", z: 50, usage: "תווית הדמו" },
  { id: "skip", z: 60, usage: "קישור הדילוג" },
] as const;

/** Press depth for every pressable surface. */
export const PRESS_SCALE = 0.98;

/** Widths that are part of the system. */
export const containers = [{ id: "toast", rem: 25 }] as const;

/* ───────────────────────────── Shadow ───────────────────────────── */

export interface ShadowToken {
  id: string;
  css: string;
  usage: string;
}

export const shadows: readonly ShadowToken[] = [
  { id: "rim", css: "inset 0 1px 0 0 rgb(232 243 247 / 0.10)", usage: "אור קצה על פלדה (הקו עצמו: inset-ring)" },
  { id: "rim-lift", css: "inset 0 1px 0 0 rgb(232 243 247 / 0.18), 0 16px 32px -20px rgb(2 8 12 / 0.8)", usage: "כרטיס בריחוף: קצה בהיר וצל כחול־שחור" },
  { id: "pressed", css: "inset 0 2px 4px 0 rgb(2 8 12 / 0.55)", usage: "לחיצה: נכנס לתוך הקרח" },
  { id: "float", css: "0 0 0 1px rgb(232 243 247 / 0.08), inset 0 1px 0 0 rgb(232 243 247 / 0.14), 0 24px 48px -16px rgb(2 8 12 / 0.72)", usage: "הודעות וגיליונות" },
  { id: "flap", css: "inset 0 1px 0 0 rgb(232 243 247 / 0.07), inset 0 -1px 0 0 rgb(2 8 12 / 0.5), 0 1px 0 0 rgb(2 8 12 / 0.6)", usage: "כל אריח בלוח ולוחית בשעון" },
  { id: "frost", css: "inset 0 1px 0 0 rgb(232 243 247 / 0.22), inset 0 0 32px 0 rgb(232 243 247 / 0.06)", usage: "שפת הזכוכית ומשטחי ״משוער״" },
  { id: "glow-salmon", css: "0 0 48px 8px rgb(255 122 89 / 0.35)", usage: "הילה נושמת: פחות מ־30 דקות" },
  { id: "glow-ice", css: "0 0 0 1px rgb(127 209 255 / 0.45), 0 0 20px -4px rgb(127 209 255 / 0.4)", usage: "טמפרטורה בטווח (0–2°) בלבד" },
];

/* ───────────────────────────── Motion ───────────────────────────── */

export interface DurationToken {
  id: string;
  ms: number;
  usage: string;
}

export const durations: readonly DurationToken[] = [
  { id: "tap", ms: 80, usage: "משוב לחיצה: שקיעה של פיקסל אחד" },
  { id: "hover", ms: 140, usage: "צבע, גבול ואור בריחוף" },
  { id: "state", ms: 220, usage: "החלפת מצב, סימון וי, פתיחת הטווח" },
  { id: "panel", ms: 320, usage: "כניסת הודעה, גיליון, מעבר עמוד – התקרה" },
  { id: "exit", ms: 200, usage: "יציאה: תמיד מהירה מהכניסה" },
  { id: "flap-riffle", ms: 60, usage: "כל אות ביניים בתוף (עד 3)" },
  { id: "flap-fall", ms: 90, usage: "העלה העליון נופל; תא גדול נופל לאט יותר" },
  { id: "flap-land", ms: 70, usage: "העלה החדש נוחת, בלי קפיצה" },
  { id: "thaw", ms: 600, usage: "הכפור מתפוגג: משוער הופך לבפועל" },
  { id: "breathe", ms: 2400, usage: "נשימת הסלמון מתחת ל־30 דקות" },
  { id: "refreeze", ms: 2400, usage: "הכפור חוזר אחרי ניגוב" },
  { id: "toast", ms: 6000, usage: "חיי הודעה בלי פעולה; נעצר בריחוף" },
];

export interface EasingToken {
  id: string;
  bezier: readonly [number, number, number, number];
  usage: string;
}

export const easings: readonly EasingToken[] = [
  { id: "glide", bezier: [0.2, 0, 0, 1], usage: "ברירת מחדל: יציאה מהירה, התייצבות קרה וארוכה" },
  { id: "exit", bezier: [0.4, 0, 1, 1], usage: "דברים שעוזבים מאיצים ולא מתעכבים" },
  { id: "move", bezier: [0.65, 0, 0.35, 1], usage: "דברים שנעים לעיני הצופה: קו לשונית, קו מוביל" },
  { id: "flap-fall", bezier: [0.32, 0, 0.67, 0], usage: "העלה נופל לציר ומאיץ, כמו כובד" },
  { id: "flap-land", bezier: [0.22, 1, 0.36, 1], usage: "העלה החדש נוחת – בלי חריגה" },
  { id: "thaw", bezier: [0.16, 1, 0.3, 1], usage: "קרח שמשחרר: התחלה איטית, זנב צלול" },
  { id: "breathe", bezier: [0.37, 0, 0.63, 1], usage: "סינוס: נשימת הסלמון והערפל" },
];

export function cubicBezier(e: EasingToken): string {
  return `cubic-bezier(${e.bezier.join(", ")})`;
}

/**
 * Newspaper dateline: "יום שישי · כ״ו בחשוון תשפ״ז · 6.11.2026".
 * Intl gives the Hebrew calendar with Arabic numerals ("26 בחשוון 5787"), so
 * day and year are rendered in gematria here, with gershayim and geresh.
 */

const ONES = ["", "א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט"];
const TENS = ["", "י", "כ", "ל", "מ", "נ", "ס", "ע", "פ", "צ"];
const HUNDREDS = ["", "ק", "ר", "ש", "ת", "תק", "תר", "תש", "תת", "תתק"];

/** 1–999 in gematria, with ט״ו / ט״ז and gershayim (or a geresh for one letter). */
export function gematria(n: number): string {
  const h = Math.floor(n / 100);
  const t = Math.floor((n % 100) / 10);
  const o = n % 10;
  let s = HUNDREDS[h] ?? "";
  if (t === 1 && (o === 5 || o === 6)) s += o === 5 ? "טו" : "טז";
  else s += (TENS[t] ?? "") + (ONES[o] ?? "");
  return s.length > 1 ? `${s.slice(0, -1)}״${s.slice(-1)}` : `${s}׳`;
}

const TZ = "Asia/Jerusalem";

export function hebrewDateline(date: Date): { weekday: string; hebrew: string; civil: string } {
  const parts = new Intl.DateTimeFormat("he-u-ca-hebrew", { day: "numeric", month: "long", year: "numeric", timeZone: TZ }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const day = Number(get("day"));
  const month = get("month");
  const year = Number(get("year")) % 1000;
  const weekday = new Intl.DateTimeFormat("he", { weekday: "long", timeZone: TZ }).format(date);
  const c = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "numeric", year: "numeric", timeZone: TZ }).formatToParts(date);
  const n = (type: string) => Number(c.find((p) => p.type === type)?.value ?? 0);
  const civil = `${n("day")}.${n("month")}.${n("year")}`;
  return { weekday, hebrew: `${gematria(day)} ב${month} ${gematria(year)}`, civil };
}

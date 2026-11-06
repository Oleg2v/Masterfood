import type { Photo } from "@/components/ui/graded-photo";
import type { MarketLine } from "@/components/ui/market-row";
import type { CardProduct } from "@/components/ui/product-card";

/* Everything on this page is demo content. Prices are "מחירי דמו". */

export const concept = [
  "כל בוקר הפורטל נפתח כמו רצפת מסחר: המחירים של היום, מה שנחת בלילה, והשעון עד סגירת ההזמנה למחר.",
  "החומר הוא פלדה, קרח וכפור; הטיפוגרפיה של תפריט מישלן – סריף לשם הנתח, מונו לאמת שבמספרים.",
  "קצב בחיפה קורא את הלוח, נוגע בנתח, מזמין כ־20 ק״ג ומקבל חלון אספקה למחר – בפחות מדקה.",
];

export const decisions: { title: string; body: string }[] = [
  {
    title: "הלוח הוא ההירו",
    body: "אין תמונת פתיחה ואין סלוגן. המסך הראשון הוא נתונים חיים על לוח מתהפך – אריחי CSS בתלת־ממד, 60 פריימים, נפתח שורה אחר שורה.",
  },
  {
    title: "זכוכית של ויטרינה קרה",
    body: "שכבת כפור על המסך שהאצבע מנגבת, וקופאת מחדש לאט. שיידר WebGL קל, מסכת CSS כגיבוי, ובלי תנועה כשביקשו לעצור.",
  },
  {
    title: "שני קולות, ושום דבר באמצע",
    body: "Frank Ruhl Libre בגודל מונומנטלי לשם הנתח ולשעון; IBM Plex Mono לכל מספר, מבודד ב־bdi. Heebo רק לממשק – שקט ומדויק.",
  },
  {
    title: "צבע הוא משמעות, לא קישוט",
    body: "ארבעה צבעי הדגשה, ארבע משמעויות: דג, בשר, טמפרטורה, מלאי. הכפתור הראשי לבן־קרח, כדי שהסלמון יישאר אזעקה.",
  },
  {
    title: "דירוג קר, בשר חם",
    body: "טיפול צבע אחד לכל הצילומים: השחורים מורמים לקרח עמוק, כך שהמזון צף בתוך הדף. רק החלבון שומר על החום שלו.",
  },
];

export const cliches: { title: string; instead: string }[] = [
  { title: "הקצביה הכפרית", instead: "לוחות גיר, קרטון חום, עץ, סכין קצבים. במקום: פלדה, קרח ונתונים." },
  { title: "פרה מצוירת ודג מחייך", instead: "אייקונים מצוירים ואימוג׳י. במקום: קו חריטה אחד, 1.5 פיקסל." },
  { title: "דשבורד SaaS גנרי", instead: "כרטיסי KPI עם צל, כתמי גרדיאנט וזכוכית בכל מקום. במקום: טבלה מדויקת ורשת קווי שיער." },
  { title: "קרוסלת ״ברוכים הבאים״", instead: "שף מחייך ושלוש שקופיות מתחלפות. במקום: המחיר של הבוקר, עכשיו." },
  { title: "קפיצות וקונפטי", instead: "קפיצי ספרינג, קונפטי על הזמנה, ספינרים. במקום: תנועה קרה ואטית שנעצרת במקום." },
];

/* Photos: Unsplash placeholders, credited. Filled in by the imagery scout. */
export const photos: Record<string, Photo | undefined> = {
  picanha: undefined,
  salmon: undefined,
  bream: undefined,
  ice: undefined,
  marbling: undefined,
};

export const cards: CardProduct[] = [
  {
    name: "פיקנייה",
    category: "meat",
    origin: "ברזיל · דרום אמריקה",
    stamp: "BR · GRU",
    kashrut: "רבנות",
    fresh: true,
    pricePerKg: 89,
    changePct: -0.8,
    availableKg: 140,
    photo: photos.picanha,
  },
  {
    name: "סלמון נורבגי טרי",
    category: "fish",
    origin: "נורווגיה",
    stamp: "NO · OSL",
    kashrut: "מהדרין",
    fresh: true,
    pricePerKg: 62.9,
    changePct: 1.2,
    availableKg: 312,
    arrival: "05:40",
    photo: photos.salmon,
  },
  {
    name: "דניס",
    category: "fish",
    origin: "קפריסין",
    stamp: "CY · LCA",
    kashrut: "רבנות",
    fresh: true,
    pricePerKg: 41.5,
    changePct: 0,
    availableKg: 0,
    arrival: "06:15",
    photo: photos.bream,
  },
];

export const lines: MarketLine[] = [
  {
    name: "סלמון נורבגי טרי",
    category: "fish",
    origin: "נורווגיה",
    route: { from: "OSL", to: "TLV", mode: "air" },
    arrival: "05:40",
    availableKg: 312,
    pricePerKg: 62.9,
    changePct: 1.2,
  },
  {
    name: "פיקנייה",
    category: "meat",
    origin: "ברזיל",
    route: { from: "GRU", to: "TLV", mode: "air" },
    arrival: "03:20",
    availableKg: 140,
    pricePerKg: 89,
    changePct: -0.8,
  },
  {
    name: "דניס",
    category: "fish",
    origin: "קפריסין",
    route: { from: "LCA", to: "TLV", mode: "air" },
    arrival: "06:15",
    availableKg: 220,
    pricePerKg: 41.5,
    changePct: 0,
  },
  {
    name: "כתף בקר קפואה",
    category: "meat",
    origin: "הולנד",
    route: { from: "RTM", to: "ASH", mode: "sea" },
    availableKg: 860,
    pricePerKg: 54.9,
    changePct: 0.4,
  },
  {
    name: "לברק",
    category: "fish",
    origin: "טורקיה",
    route: { from: "IST", to: "TLV", mode: "air" },
    arrival: "04:55",
    availableKg: 0,
    pricePerKg: 47.9,
    changePct: -1.6,
  },
];

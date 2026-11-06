import type { Photo } from "@/components/ui/graded-photo";

/**
 * Unsplash placeholders (Unsplash License), credited next to every use.
 * Each was viewed and checked for subject and mood; the credit was matched to
 * the photo's Unsplash page. Species are honest: no ribeye labelled as picanha.
 *
 * Card plates are 4:3 and carry the product only, so two sources are cut on the CDN
 * with a focal crop (each frame checked by eye at 1200×900):
 *  - salmonSteak: only the steak face; the source's flaky salt and peppercorns fall
 *    outside (they still show at fp-z 1.4 and 1.8 in a 4:3 frame; 2.1 is clean).
 *  - seaBass: only the rows of sea bass; the stall's "THE ORIGINAL" sign, the red
 *    rockfish and the spotted trout above them fall outside.
 */
export const photoSet = {
  marbling: {
    src: "https://images.unsplash.com/photo-1728042359930-c0145f0fd442",
    alt: "אנטריקוט נא עם שיש שומן עשיר, על משטח צפחה כהה",
    photographer: "Jakob Trost",
    page: "https://unsplash.com/photos/SckH8spaAtk",
    tone: "flesh",
  },
  fillet: {
    src: "https://images.unsplash.com/photo-1728042359879-f5d2c233a07c",
    alt: "נתח פילה בקר עבה ונא על צפחה, ברקע כהה",
    photographer: "Jakob Trost",
    page: "https://unsplash.com/photos/tYV77aKa4K0",
    tone: "flesh",
  },
  salmonFlesh: {
    src: "https://images.unsplash.com/photo-1706982272171-8ce965c1c996",
    alt: "בשר סלמון נא מקרוב: כתום עם קווי שומן לבנים",
    photographer: "Anna Bratiychuk",
    page: "https://unsplash.com/photos/jLZMZeLaf5k",
    tone: "flesh",
  },
  salmonSteak: {
    src: "https://images.unsplash.com/photo-1641898378373-0ef528eec4be?fit=crop&crop=focalpoint&fp-x=0.55&fp-y=0.47&fp-z=2.1&w=1200&h=900",
    alt: "סטייק סלמון נא מקרוב: חתך רוחב כתום ושולי העור הכסופים",
    photographer: "Karyna Panchenko",
    page: "https://unsplash.com/photos/1OnuYCARYmc",
    tone: "flesh",
  },
  seaBass: {
    src: "https://images.unsplash.com/photo-1789003909863-6d943b0b4341?fit=crop&crop=focalpoint&fp-x=0.74&fp-y=0.78&fp-z=2.1&w=1200&h=900",
    alt: "לברקים שלמים בשורות על קרח כתוש",
    photographer: "Megan Waksmundzki",
    page: "https://unsplash.com/photos/fJVjjsPOat8",
    tone: "cold",
    key: "high",
  },
  mackerelIce: {
    src: "https://images.unsplash.com/photo-1608502712357-b84a5084c6b2",
    alt: "דגים שלמים בעור כסוף, מונחים על קרח כתוש",
    photographer: "David Todd McCarty",
    page: "https://unsplash.com/photos/ccE1IAGnTwA",
    tone: "cold",
  },
  crushedIce: {
    src: "https://images.unsplash.com/photo-1662193552881-c1e0900b6bdb",
    alt: "קרח כתוש מקרוב על רקע כהה",
    photographer: "Marvin Ray",
    page: "https://unsplash.com/photos/j3wA2YhMFhY",
    tone: "cold",
  },
  lakeIce: {
    src: "https://images.unsplash.com/photo-1546453667-8a8d2d07bc20",
    alt: "משטח קרח כחול כהה עם סדקים לבנים",
    photographer: "Nick Iliasov",
    page: "https://unsplash.com/photos/i0fCUofGjV8",
    tone: "cold",
    key: "low",
  },
} as const satisfies Record<string, Photo & { tone: "flesh" | "cold"; key?: "high" | "low" }>;

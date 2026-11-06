import type { Photo } from "@/components/ui/graded-photo";

/**
 * Unsplash placeholders (Unsplash License), credited next to every use.
 * Each was viewed and checked for subject and mood; the credit was matched to
 * the photo's Unsplash page. Species are honest: no ribeye labelled as picanha.
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
    src: "https://images.unsplash.com/photo-1641898378373-0ef528eec4be",
    alt: "סטייק סלמון נא על צפחה שחורה",
    photographer: "Karyna Panchenko",
    page: "https://unsplash.com/photos/1OnuYCARYmc",
    tone: "flesh",
  },
  seaBass: {
    src: "https://images.unsplash.com/photo-1789003909863-6d943b0b4341",
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

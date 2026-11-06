import type { Metadata, Viewport } from "next";
import { Frank_Ruhl_Libre, Heebo, IBM_Plex_Mono } from "next/font/google";
import { DemoBadge } from "@/components/demo-badge";
import { SkipLink } from "@/components/skip-link";
import { restoreMotionScript } from "@/lib/motion-script";
import "./globals.css";

/* Display serif: variable wght 300–900, Hebrew + Latin. Headlines, product names, the countdown. */
const display = Frank_Ruhl_Libre({
  subsets: ["hebrew", "latin"],
  variable: "--font-frank",
  display: "swap",
});

/* UI sans: variable wght 100–900, Hebrew + Latin. Labels, body, controls. */
const ui = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-heebo",
  display: "swap",
});

/* Data mono: prices, weights, temperatures, times. No metric fallback: a glyph Plex Mono
   lacks (Hebrew, ״, ־) must fall straight to Heebo, not to a scaled Arial. */
const mono = IBM_Plex_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: {
    default: "השוק של מחר · מאסטרפוד (קונספט)",
    template: "%s · השוק של מחר (קונספט)",
  },
  description:
    "קונספט של Kikkey לפורטל הזמנות B2B עבור מאסטרפוד – לא האתר הרשמי של מאסטרפוד. כל המחירים הם מחירי דמו.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
  referrer: "no-referrer",
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: "#07141C",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="he" dir="rtl" className={`${display.variable} ${ui.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        {/* restore "עצירת אנימציה" before first paint, so nothing moves even for a frame */}
        <script dangerouslySetInnerHTML={{ __html: restoreMotionScript }} />
      </head>
      <body>
        <SkipLink />
        <DemoBadge />
        {children}
      </body>
    </html>
  );
}

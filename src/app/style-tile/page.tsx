import type { Metadata } from "next";
import { ComponentsSection } from "./_sections/components";
import { DecisionsSection, ImagerySection, TileFooter } from "./_sections/imagery-decisions";
import { Masthead, TopBar } from "./_sections/masthead";
import { MotionSection } from "./_sections/motion";
import { PaletteSection } from "./_sections/palette";
import { SpaceSection, SurfaceSection } from "./_sections/space-surface";
import { TypeSection } from "./_sections/type";

export const metadata: Metadata = {
  title: "לוח סגנון",
  description: "שלב 0 – כיוון אמנותי: פלטה, טיפוגרפיה, מרווחים, רדיוסים, צללים, תנועה ושישה רכיבים.",
};

export default function StyleTilePage() {
  return (
    <>
      <TopBar />
      <main id="main" tabIndex={-1} className="outline-none">
        <Masthead />
        <PaletteSection />
        <TypeSection />
        <SpaceSection />
        <SurfaceSection />
        <MotionSection />
        <ComponentsSection />
        <ImagerySection />
        <DecisionsSection />
      </main>
      <TileFooter />
    </>
  );
}

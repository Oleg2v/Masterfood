import { Fragment, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { FilterChip, StatusChip, Tag } from "@/components/ui/chip";
import { Icon } from "@/components/ui/icon";
import { MarketRow, MarketTableHead } from "@/components/ui/market-row";
import { Money } from "@/components/ui/money";
import { Num } from "@/components/ui/num";
import { ProductCard } from "@/components/ui/product-card";
import { Route } from "@/components/ui/route";
import { Toast } from "@/components/ui/toast";
import { WeightField } from "@/components/ui/weight-field";
import { KG } from "@/lib/format";
import { cards, lines } from "../_content";
import { Plate, Section, StateLabel } from "../_components/frame";
import { InvoiceSpecimen } from "../_components/invoice-specimen";
import { ScrollRegion } from "../_components/scroll-region";
import { ToastDemo } from "../_components/toast-demo";

/* A toast's facts never break inside a figure and its unit (the same seams as the live toasts). */
const facts = "inline-flex items-center gap-x-2 whitespace-nowrap";

/**
 * A pinned specimen: the caption first (spec-sheet order), then the component.
 * `inert` for forced states, so a pinned "focus" is never a real tab stop.
 */
function Pinned({ label, children, inert = false, className = "" }: { label: string; children: ReactNode; inert?: boolean; className?: string }) {
  return (
    <div className={`flex flex-col items-start gap-3 ${className}`} inert={inert}>
      <StateLabel>{label}</StateLabel>
      {children}
    </div>
  );
}

/** A Latin caption that wraps only between its segments, never inside one: each "·" ends the segment before it. */
function Segmented({ parts }: { parts: string[] }) {
  return (
    <StateLabel>
      {parts.map((part, i) => (
        <Fragment key={part}>
          {i > 0 ? " " : null}
          <span className="whitespace-nowrap">{i < parts.length - 1 ? `${part} ·` : part}</span>
        </Fragment>
      ))}
    </StateLabel>
  );
}

function ButtonPlate() {
  const total = <Money value={1780} round />;
  return (
    <Plate
      id="plate-button"
      title="כפתור"
      en="Button · 48px · rounded-edge"
      note="הפעולה הראשית לבנה כמו קרח – הצבעים שמורים למשמעות. הנתון שהכפתור מתחייב אליו (סכום, משקל) יושב אחרי קו שיער, במונו."
    >
      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          <Pinned label="Default">
            <Button meta={total}>שליחת ההזמנה</Button>
          </Pinned>
          <Pinned label="Hover" inert>
            <Button force="hover" meta={total}>
              שליחת ההזמנה
            </Button>
          </Pinned>
          <Pinned label="Focus" inert>
            <Button force="focus" meta={total}>
              שליחת ההזמנה
            </Button>
          </Pinned>
          <Pinned label="Active · press" inert>
            <Button force="active" meta={total}>
              שליחת ההזמנה
            </Button>
          </Pinned>
          <Pinned label="Loading · no double send">
            <Button loading meta={total}>
              שליחה…
            </Button>
          </Pinned>
          <Pinned label="Disabled · with its reason">
            <Button disabled meta={<Money value={0} round />} aria-describedby="disabled-reason">
              שליחת ההזמנה
            </Button>
            <p id="disabled-reason" className="text-caption text-frost-2">
              ההזמנה למחר נסגרה ב־<Num joined>14:00</Num>
            </p>
          </Pinned>
        </div>
        <div className="flex flex-wrap items-start gap-x-6 gap-y-8 border-t border-hairline pt-8">
          <Pinned label="Secondary">
            <Button variant="secondary" icon={<Icon name="clock" size={18} />}>
              הזמנה כמו ביום חמישי שעבר
            </Button>
          </Pinned>
          <Pinned label="Secondary · hover" inert>
            <Button variant="secondary" force="hover" icon={<Icon name="clock" size={18} />}>
              הזמנה כמו ביום חמישי שעבר
            </Button>
          </Pinned>
          <Pinned label="Quiet">
            <Button variant="quiet">הורדת PDF</Button>
          </Pinned>
          <Pinned label="Small · 44px target">
            <Button variant="secondary" size="sm">
              הוספה
            </Button>
          </Pinned>
          <Pinned label="Large">
            <Button size="lg">כניסה לשוק</Button>
          </Pinned>
        </div>
      </div>
    </Plate>
  );
}

function InputPlate() {
  return (
    <Plate
      id="plate-input"
      title="שדה משקל"
      en="Input · variable weight"
      note={
        <>
          מזמינים{" "}
          <span className="whitespace-nowrap">
            כ־<Num joined>20</Num> {KG}
          </span>{" "}
          ורואים מחיר משוער עם טווח. הטווח מצויר כרווח סמך על ציר מספרים: הנמוך משמאל, והגבוה מימין, מתחת לכפתור הפלוס. החיוב
          ייעשה לפי השקילה בפועל.
        </>
      }
    >
      <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2">
        <Pinned label="Default" className="w-full">
          <WeightField />
        </Pinned>
        <Pinned label="Focus" className="w-full" inert>
          <WeightField force="focus" product="סלמון נורבגי טרי" pricePerKg={62.9} defaultKg={12} />
        </Pinned>
        <Pinned label="Error · amber until fixed" className="w-full">
          <WeightField product="סינטה" pricePerKg={112} defaultKg={3} />
        </Pinned>
        <Pinned label="Disabled · sold out" className="w-full">
          <WeightField product="לברק" pricePerKg={47.9} defaultKg={10} disabled reason="אזל להיום · יגיע במשלוח הבא" />
        </Pinned>
      </div>
    </Plate>
  );
}

function CardPlate() {
  const [fillet, salmon, bass] = cards;
  return (
    <Plate
      id="plate-card"
      title="כרטיס מוצר"
      en="Card · product"
      note="פס קטגוריה בקצה ההתחלה – בורדו לבשר, סלמון לדג – והמילה עצמה ברובריקה. על הצילום לא מודפס דבר: כשרות, טמפרטורה, נחיתה וקוד המקור יושבים בשורה שמתחת לשם. המחיר בשורת תפריט עם נקודות מובילות, והמלאי בנקודה ירוקה."
    >
      {/* each card fills its cell, so the price lines and footers of a row line up */}
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 xl:grid-cols-4">
        <Pinned label="Default" className="w-full [&>article]:w-full [&>article]:flex-1">
          <ProductCard product={fillet!} headingLevel="h4" />
        </Pinned>
        <Pinned label="Hover · raise" className="w-full [&>article]:w-full [&>article]:flex-1" inert>
          <ProductCard product={salmon!} state="hover" headingLevel="h4" />
        </Pinned>
        <Pinned label="Sold out · drained" className="w-full [&>article]:w-full [&>article]:flex-1">
          <ProductCard product={bass!} state="soldout" headingLevel="h4" />
        </Pinned>
        <Pinned label="Loading · static hairlines" className="w-full [&>div]:w-full [&>div]:flex-1">
          <ProductCard product={fillet!} state="loading" />
        </Pinned>
      </div>
    </Plate>
  );
}

function ChipPlate() {
  return (
    <Plate
      id="plate-chip"
      title="תגיות"
      en="Chip · status, tag, filter"
      note="תגיות סטטוס הן נוריות של לוח טיסות. הנורית מתמלאת ככל שהסחורה מתקרבת אליכם: ״בדרך״ – טבעת, ״נחת״ – חצי, ״בשחרור״ – שלושה רבעים, ״במלאי״ – מלאה וירוקה. כשרות היא טקסט, לעולם לא חותמת."
    >
      {/* items-start: each Latin caption sits at the start (right), above the chips it names */}
      <div className="flex flex-col gap-8">
        <div className="flex flex-col items-start gap-3">
          <StateLabel>Shipment status · in order</StateLabel>
          <div className="flex flex-wrap gap-3">
            <StatusChip status="transit" />
            <StatusChip status="landed" />
            <StatusChip status="release" />
            <StatusChip status="stock" />
          </div>
        </div>
        <div className="flex flex-col items-start gap-3">
          <StateLabel>Category · kashrut · temperature</StateLabel>
          <div className="flex flex-wrap gap-3">
            <Tag tone="meat">בשר</Tag>
            <Tag tone="fish">דג</Tag>
            <Tag tone="rabbinate">רבנות</Tag>
            <Tag tone="mehadrin">מהדרין</Tag>
            <Tag tone="chilled">
              טרי <Num>0–2°</Num>
            </Tag>
            <Tag tone="frozen">
              קפוא <Num>−18°</Num>
            </Tag>
            <Tag tone="demo">מחירי דמו · לפני מע״מ</Tag>
          </div>
        </div>
        <div className="flex flex-col items-start gap-3">
          <Segmented parts={["Filter", "off / hover / focus / on / disabled"]} />
          <div className="flex flex-wrap gap-3">
            <FilterChip count={18}>נורבגיה</FilterChip>
            <FilterChip force="hover" count={6} inert>
              קפריסין
            </FilterChip>
            <FilterChip force="focus" count={4} inert>
              טורקיה
            </FilterChip>
            <FilterChip pressed count={9}>
              מהדרין
            </FilterChip>
            {/* no results: still a tab stop, and it says why */}
            <FilterChip disabled count={0} aria-describedby="filter-reason">
              קניה
            </FilterChip>
          </div>
          <p id="filter-reason" className="text-caption text-frost-2">
            אין היום מוצרים מקניה
          </p>
        </div>
      </div>
    </Plate>
  );
}

function RowPlate() {
  const [salmon, picanha, bream, shoulder, bass] = lines;
  return (
    <Plate
      id="plate-row"
      title="שורת לוח"
      en="Table row · market board"
      note="טבלה אמיתית, לא כרטיסים, בלי זברה. מספרים במונו מיושרים להתחלה, כך שהנקודות העשרוניות נערמות זו מתחת לזו, והיחידות בכותרת. מסלול נקרא כמו במפה, ממערב למזרח. מחיר שהתעדכן מקבל קו ואת המילה ״עודכן״, לא רק צבע. בחשבונית, מה שעוד לא סופי יושב על כפור."
    >
      <ScrollRegion label="דוגמת לוח השוק" className="relative -mx-4 overflow-x-auto sm:mx-0">
        <table className="w-full min-w-[46rem] border-collapse text-start">
          <caption className="sr-only">שורות לדוגמה בלוח השוק של הבוקר. מחירי דמו, לפני מע״מ.</caption>
          <MarketTableHead />
          <tbody>
            <MarketRow line={salmon!} />
            <MarketRow line={picanha!} state="hover" />
            <MarketRow line={bream!} state="updated" />
            <MarketRow line={shoulder!} state="focus" />
            <MarketRow line={bass!} state="soldout" />
          </tbody>
        </table>
      </ScrollRegion>
      <p className="text-caption text-frost-2">
        מחירי דמו, לפני מע״מ.<span className="sm:hidden"> בטלפון הלוח הופך לרשימה אנכית (שלב 1); כאן גוללים לצד.</span>
      </p>
      <ul className="flex flex-wrap gap-x-6 gap-y-2">
        <li>
          <StateLabel>Row 1 · default</StateLabel>
        </li>
        <li>
          <StateLabel>Row 2 · hover</StateLabel>
        </li>
        <li>
          <StateLabel>Row 3 · price updated</StateLabel>
        </li>
        <li>
          <StateLabel>Row 4 · focus within</StateLabel>
        </li>
        <li>
          <StateLabel>Row 5 · sold out</StateLabel>
        </li>
      </ul>
      <div className="flex flex-col gap-4 border-t border-hairline pt-8">
        {/* a block of its own, so the Latin caption starts at the right like the table under it */}
        <p>
          <Segmented parts={["Invoice", "estimated / actual", "frost thaws"]} />
        </p>
        <InvoiceSpecimen />
      </div>
    </Plate>
  );
}

function ToastPlate() {
  return (
    <Plate
      id="plate-toast"
      title="הודעה"
      en="Toast · status, polite"
      note="סימן מרובע במקום וי מצויר, שורת פרטים במונו, פעולה אחת. הודעה עם פעולה נשארת עד שסוגרים אותה; הודעה בלי פעולה נמסה – הקו התחתון הוא הטיימר, והוא נעצר כשהסמן עליה או כשהמיקוד בתוכה."
    >
      <div className="flex flex-wrap gap-6" inert>
        <Toast
          tone="success"
          title="נוסף להזמנה של מחר"
          detail={
            <>
              פיקנייה ·{" "}
              <span className="whitespace-nowrap">
                כ־<Num joined>20</Num> {KG}
              </span>
              <span className="@max-[14rem]:hidden"> · </span>
              <span className="whitespace-nowrap @max-[14rem]:block">
                כ־<Money joined value={1780} round />
              </span>
            </>
          }
          action={
            <Button variant="quiet" size="sm">
              ביטול
            </Button>
          }
        />
        <Toast
          tone="urgent"
          title={
            <>
              נותרו{" "}
              <span className="whitespace-nowrap">
                <Num>28</Num> דקות
              </span>{" "}
              לסגירה
            </>
          }
          detail={
            /* what is at stake first, then the hour; `pretty` so no word is left alone in a narrow toast */
            <span className="block text-pretty">
              ההזמנה למחר עוד לא נשלחה.{" "}
              <span className="whitespace-nowrap">
                הסגירה ב־<Num joined>14:00</Num>.
              </span>
            </span>
          }
          action={
            <Button variant="quiet" size="sm">
              מעבר להזמנה
            </Button>
          }
        />
        <Toast
          tone="info"
          title="נחת: סלמון נורבגי טרי"
          detail={
            <span className="flex flex-col flex-wrap @min-[18rem]:flex-row @min-[18rem]:items-center @min-[18rem]:gap-x-2">
              <span className={facts}>
                <Route from="OSL" to="TLV" mode="air" />·<Num>05:40</Num>
              </span>
              <span className="hidden @min-[18rem]:inline">·</span>
              <span className={facts}>
                <span className="whitespace-nowrap">
                  <Num>312</Num> {KG}
                </span>
                ·<Num className="text-ice">1.8°</Num>
              </span>
            </span>
          }
        />
        <Toast
          tone="error"
          title="השליחה לא הצליחה"
          detail="החיבור נקטע. ההזמנה נשמרה."
          action={
            <Button variant="quiet" size="sm">
              שליחה חוזרת
            </Button>
          }
        />
      </div>
      <div className="border-t border-hairline pt-6">
        <ToastDemo />
      </div>
    </Plate>
  );
}

export function ComponentsSection() {
  return (
    <Section
      id="components"
      index="06"
      en="Components"
      he="שישה רכיבים, כל המצבים"
      lede="כל רכיב מוצג במצביו: ברירת מחדל, ריחוף, מיקוד, לחיצה, טעינה, שגיאה ונטרול. המצבים כאן מקובעים לתצוגה – ואלה אותם רכיבים שייבנו מהם המסכים."
    >
      <div className="flex flex-col gap-6">
        <ButtonPlate />
        <InputPlate />
        <CardPlate />
        <ChipPlate />
        <RowPlate />
        <ToastPlate />
      </div>
    </Section>
  );
}

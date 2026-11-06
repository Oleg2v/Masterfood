import { Button } from "@/components/ui/button";
import { FilterChip, StatusChip, Tag } from "@/components/ui/chip";
import { Icon } from "@/components/ui/icon";
import { MarketRow, MarketTableHead } from "@/components/ui/market-row";
import { Money } from "@/components/ui/money";
import { Num } from "@/components/ui/num";
import { ProductCard } from "@/components/ui/product-card";
import { Toast } from "@/components/ui/toast";
import { WeightField } from "@/components/ui/weight-field";
import { KG } from "@/lib/format";
import { cards, lines } from "../_content";
import { Plate, Section, StateLabel } from "../_components/frame";
import { ToastDemo } from "../_components/toast-demo";

function Pinned({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col items-start gap-3 ${className}`}>
      {children}
      <StateLabel>{label}</StateLabel>
    </div>
  );
}

function ButtonPlate() {
  return (
    <Plate
      title="כפתור"
      en="Button · 48px · rounded-sm"
      note="הפעולה הראשית לבנה כמו קרח – הצבעים שמורים למשמעות. הנתון שהכפתור מתחייב אליו (סכום, משקל) יושב אחרי קו שיער, במונו."
    >
      <div className="flex flex-col gap-8">
        <div className="flex flex-wrap items-start gap-x-6 gap-y-6">
          <Pinned label="Default">
            <Button meta={<Money value={1780} round />}>שליחת ההזמנה</Button>
          </Pinned>
          <Pinned label="Hover · sheen">
            <Button force="hover" meta={<Money value={1780} round />}>
              שליחת ההזמנה
            </Button>
          </Pinned>
          <Pinned label="Focus">
            <Button force="focus" meta={<Money value={1780} round />}>
              שליחת ההזמנה
            </Button>
          </Pinned>
          <Pinned label="Active">
            <Button force="active" meta={<Money value={1780} round />}>
              שליחת ההזמנה
            </Button>
          </Pinned>
          <Pinned label="Loading">
            <Button loading meta={<Money value={1780} round />}>
              שולחים…
            </Button>
          </Pinned>
          <Pinned label="Disabled">
            <Button disabled meta={<Money value={0} round />}>
              שליחת ההזמנה
            </Button>
          </Pinned>
        </div>
        <div className="flex flex-wrap items-start gap-x-6 gap-y-6 border-t border-hairline pt-8">
          <Pinned label="Secondary">
            <Button variant="secondary" icon={<Icon name="clock" size={18} />}>
              כמו ביום חמישי שעבר
            </Button>
          </Pinned>
          <Pinned label="Secondary · hover">
            <Button variant="secondary" force="hover" icon={<Icon name="clock" size={18} />}>
              כמו ביום חמישי שעבר
            </Button>
          </Pinned>
          <Pinned label="Quiet">
            <Button variant="quiet">הורדת PDF</Button>
          </Pinned>
          <Pinned label="Small · secondary">
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
      title="שדה משקל"
      en="Input · variable weight"
      note="מזמינים ״כ־20 ק״ג״ ורואים מחיר משוער עם טווח. הטווח מצויר כמו רווח סמך, והחשבונית תחויב לפי השקילה בפועל."
    >
      <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2">
        <Pinned label="Default" className="w-full">
          <WeightField />
        </Pinned>
        <Pinned label="Focus" className="w-full">
          <WeightField force="focus" product="סלמון נורבגי טרי" pricePerKg={62.9} defaultKg={12} />
        </Pinned>
        <Pinned label="Error" className="w-full">
          <WeightField product="סינטה" pricePerKg={112} defaultKg={3} error={`המינימום להזמנה הוא 5 ${KG}`} />
        </Pinned>
        <Pinned label="Disabled · sold out" className="w-full">
          <WeightField product="לברק" pricePerKg={47.9} defaultKg={10} disabled />
        </Pinned>
      </div>
    </Plate>
  );
}

function CardPlate() {
  const [picanha, salmon, bream] = cards;
  return (
    <Plate
      title="כרטיס מוצר"
      en="Card · product"
      note="פס קטגוריה בקצה ההתחלה – בורדו לבשר, סלמון לדג. שם הנתח כמו בתפריט, המספרים במונו, המלאי בנקודה ירוקה."
    >
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 xl:grid-cols-4">
        <Pinned label="Default" className="w-full [&>article]:w-full">
          <ProductCard product={picanha!} />
        </Pinned>
        <Pinned label="Hover · raise" className="w-full [&>article]:w-full">
          <ProductCard product={salmon!} state="hover" />
        </Pinned>
        <Pinned label="Sold out" className="w-full [&>article]:w-full">
          <ProductCard product={bream!} state="soldout" />
        </Pinned>
        <Pinned label="Loading · frost skeleton" className="w-full [&>div]:w-full">
          <ProductCard product={picanha!} state="loading" />
        </Pinned>
      </div>
    </Plate>
  );
}

function ChipPlate() {
  return (
    <Plate
      title="תגיות"
      en="Chip · status, tag, filter"
      note="תגיות סטטוס הן נוריות של לוח טיסות: נחת בירוק, בדרך בכחול קרח שמהבהב לאט, בשחרור בטבעת ריקה. מסננים הם מתגים עם aria-pressed."
    >
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <StateLabel>Shipment status</StateLabel>
          <div className="flex flex-wrap gap-3">
            <StatusChip status="landed" />
            <StatusChip status="transit" />
            <StatusChip status="release" />
          </div>
        </div>
        <div className="flex flex-col gap-3">
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
            <Tag tone="demo">מחירי דמו</Tag>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <StateLabel>Filter · off / hover / focus / on / disabled</StateLabel>
          <div className="flex flex-wrap gap-3">
            <FilterChip count={18}>נורווגיה</FilterChip>
            <FilterChip force="hover" count={6}>
              קפריסין
            </FilterChip>
            <FilterChip force="focus" count={4}>
              טורקיה
            </FilterChip>
            <FilterChip pressed count={9}>
              מהדרין
            </FilterChip>
            <FilterChip disabled count={0}>
              קנייה
            </FilterChip>
          </div>
        </div>
      </div>
    </Plate>
  );
}

function RowPlate() {
  const [salmon, picanha, bream, shoulder, bass] = lines;
  return (
    <Plate
      title="שורת לוח"
      en="Table row · market board"
      note="טבלה אמיתית, לא כרטיסים. שם בסריף, נתונים במונו מיושרים לסוף, ומחיר שזה עתה השתנה מקבל קו כחול־קרח שדועך."
    >
      <div
        role="region"
        aria-label="דוגמת לוח השוק – גלילה אופקית במסך צר"
        tabIndex={0}
        className="relative -mx-4 overflow-x-auto sm:mx-0"
      >
        <table className="w-full min-w-[46rem] border-collapse text-start">
          <caption className="sr-only">שורות לדוגמה בלוח השוק של הבוקר, מחירי דמו</caption>
          <MarketTableHead />
          <tbody>
            <MarketRow line={salmon!} />
            <MarketRow line={picanha!} state="hover" />
            <MarketRow line={bream!} state="updated" />
            <MarketRow line={shoulder!} state="focus" />
            <MarketRow line={bass!} state="soldout" />
          </tbody>
        </table>
      </div>
      <p className="text-small text-mist sm:hidden">בטלפון הלוח הופך לטיקר אנכי (שלב 1). כאן: גלילה לצד.</p>
      <ul className="flex flex-wrap gap-x-6 gap-y-2">
        <li>
          <StateLabel>Row 1 · default</StateLabel>
        </li>
        <li>
          <StateLabel>2 · hover</StateLabel>
        </li>
        <li>
          <StateLabel>3 · price updated</StateLabel>
        </li>
        <li>
          <StateLabel>4 · focus within</StateLabel>
        </li>
        <li>
          <StateLabel>5 · sold out</StateLabel>
        </li>
      </ul>
    </Plate>
  );
}

function ToastPlate() {
  return (
    <Plate
      title="הודעה"
      en="Toast · status, polite"
      note="סימן מרובע במקום וי מצויר, שורת פרטים במונו, פעולה אחת. הקו התחתון הוא הטיימר, והוא נעצר כשמרחפים או מתמקדים."
    >
      <div className="grid grid-cols-1 gap-x-8 gap-y-6 lg:grid-cols-2">
        <Toast
          tone="success"
          title="נוסף להזמנה של מחר"
          detail={
            <>
              פיקנייה · כ־<Num>20</Num> {KG} · כ־<Money value={1780} round />
            </>
          }
          action={<Button variant="quiet" size="sm">ביטול</Button>}
        />
        <Toast
          tone="urgent"
          title="נותרו 28 דקות לסגירה"
          detail={
            <>
              ההזמנה למחר נסגרת ב־<Num>14:00</Num>. העגלה מוכנה.
            </>
          }
          action={<Button variant="quiet" size="sm">לעגלה</Button>}
          timer={false}
        />
        <Toast
          tone="info"
          title="נחת: סלמון נורבגי טרי"
          detail={
            <>
              <Num>OSL–TLV</Num> · <Num>05:40</Num> · <Num>312</Num> {KG} · <Num>1.8°</Num>
            </>
          }
          timer={false}
        />
        <Toast
          tone="error"
          title="השליחה לא הצליחה"
          detail="החיבור נקטע. ההזמנה שמורה – אפשר לנסות שוב."
          action={<Button variant="quiet" size="sm">לנסות שוב</Button>}
          timer={false}
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
      lede="כל רכיב מוצג במצביו: ברירת מחדל, ריחוף, מיקוד, לחיצה, טעינה, שגיאה ונטרול. המצבים כאן ״נעוצים״ לתצוגה – אלה אותם רכיבים שייבנו בהם המסכים."
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

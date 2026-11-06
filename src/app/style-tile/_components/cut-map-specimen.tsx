"use client";

import { useId, useState } from "react";
import { Money } from "@/components/ui/money";
import { Num } from "@/components/ui/num";
import { KG } from "@/lib/format";

/**
 * The cut map, as an engraved specimen: one beef hindquarter, drawn the way a
 * 1900s butcher's chart was engraved. 1px Frost-3 contours, 45° hatching for
 * volume, dashed seams. The typeset labels are the control: native radios (one
 * radiogroup, arrow keys for free, 48px rows); a tap on a region selects the same
 * radio. The selected region fades in Bordeaux under a 1.5px Frost outline, and a
 * Meat-ink leader draws to its name.
 *
 * Stage 0 locks stroke weights only. The anatomy is a sketch: the full carcass is
 * traced from a public-domain chart and checked against an Israeli cut chart.
 */

type CutId = "sirloin" | "tenderloin" | "rump" | "picanha";

const CUTS: {
  id: CutId;
  name: string;
  d: string;
  /** leader: anchor in the region, end at the callout, label baseline */
  leader: { from: [number, number]; to: [number, number]; label: [number, number] };
  products: { name: string; origin: string; kg: number; price: number }[];
}[] = [
  {
    id: "sirloin",
    name: "סינטה",
    d: "M48 92C120 90 230 88 300 86L306 140C230 144 120 146 48 148Z",
    leader: { from: [178, 118], to: [178, 40], label: [178, 28] },
    products: [
      { name: "סינטה טרייה", origin: "ארגנטינה", kg: 75, price: 139 },
      { name: "סינטה קפואה", origin: "ברזיל", kg: 320, price: 109.9 },
    ],
  },
  {
    id: "tenderloin",
    name: "פילה",
    d: "M74 156C160 150 300 148 398 158C390 176 322 184 232 182C152 180 96 172 74 156Z",
    leader: { from: [236, 168], to: [236, 310], label: [236, 338] },
    products: [{ name: "פילה בקר", origin: "אורוגוואי", kg: 48, price: 164.9 }],
  },
  {
    id: "rump",
    name: "שייטל",
    d: "M306 140L300 86C350 85 400 68 452 70C462 92 478 104 492 106C490 134 476 160 452 176C434 186 414 174 398 158C380 150 344 144 306 140Z",
    leader: { from: [404, 118], to: [404, 40], label: [404, 28] },
    products: [{ name: "שייטל טרי", origin: "אורוגוואי", kg: 90, price: 98.5 }],
  },
  {
    id: "picanha",
    name: "פיקנייה",
    d: "M452 70C480 71 520 73 548 76C540 98 512 108 492 106C478 104 462 92 452 70Z",
    leader: { from: [504, 90], to: [522, 40], label: [530, 28] },
    products: [
      { name: "פיקנייה טרייה", origin: "דרום אמריקה", kg: 140, price: 89 },
      { name: "פיקנייה קפואה", origin: "ארגנטינה", kg: 600, price: 72.9 },
    ],
  },
];

/* Unlabelled masses, engraved only: the round and the flank. */
const ROUND =
  "M548 76C560 78 570 86 576 98C590 124 596 170 592 206C588 246 576 282 562 308L558 334L506 334C504 312 496 290 486 270C478 254 470 242 458 234C450 228 444 226 436 226C444 212 450 194 452 176C476 160 490 134 492 106C512 108 540 98 548 76Z";
const FLANK =
  "M48 148C120 146 230 144 306 140C344 144 380 150 398 158C414 174 434 186 452 176C450 194 444 212 436 226C390 236 320 252 250 260C170 268 100 268 48 264Z";
/* The outline, open at the front: that edge is a cut, drawn dashed. */
const OUTLINE =
  "M48 92C120 90 230 88 300 86C350 85 400 68 452 70C480 71 520 73 548 76C560 78 570 86 576 98C590 124 596 170 592 206C588 246 576 282 562 308L558 334M506 334C504 312 496 290 486 270C478 254 470 242 458 234C450 228 444 226 436 226C390 236 320 252 250 260C170 268 100 268 48 264";
/* Shade bands: denser hatching where the form turns away from the light. */
const SHADE_BELLY = "M48 240C120 242 200 236 260 232C330 226 400 214 444 208L436 226C390 236 320 252 250 260C170 268 100 268 48 264Z";
const SHADE_ROUND = "M592 206C588 246 576 282 562 308L558 334L546 334L550 306C564 280 576 246 580 206C582 168 576 130 566 106C580 128 594 168 592 206Z";

export function CutMapSpecimen() {
  const [selected, setSelected] = useState<CutId>("picanha");
  const name = useId();
  const cut = CUTS.find((c) => c.id === selected)!;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-6">
      {/* the drawing: decorative to assistive technology; the radios carry the meaning */}
      <figure className="flex flex-col gap-4 lg:col-span-8 lg:col-start-5">
        <svg viewBox="0 0 640 360" className="h-auto w-full" aria-hidden="true" shapeRendering="geometricPrecision">
          <defs>
            <pattern id="cm-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="6" className="stroke-edge" strokeWidth="0.75" strokeOpacity="0.55" />
            </pattern>
            <pattern id="cm-hatch-dense" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="3" className="stroke-edge" strokeWidth="0.75" strokeOpacity="0.7" />
            </pattern>
          </defs>

          {/* engraving: hatched masses, then shade bands */}
          <path d={ROUND} fill="url(#cm-hatch)" />
          <path d={FLANK} fill="url(#cm-hatch)" opacity="0.6" />
          <path d={SHADE_BELLY} fill="url(#cm-hatch-dense)" />
          <path d={SHADE_ROUND} fill="url(#cm-hatch-dense)" />

          {/* selection fills sit under the line work; only opacity moves */}
          {CUTS.map((c) => (
            <path
              key={c.id}
              d={c.d}
              className={`fill-bordeaux transition-opacity duration-panel ease-move ${c.id === selected ? "opacity-100" : "opacity-0"}`}
            />
          ))}

          {/* form lines: muscle seams and the picanha's fat cap */}
          <g className="fill-none stroke-frost-3" strokeWidth="1" vectorEffect="non-scaling-stroke" strokeOpacity="0.45">
            <path d="M524 120C546 170 548 236 530 296" vectorEffect="non-scaling-stroke" />
            <path d="M460 77C484 79 520 81 540 85" vectorEffect="non-scaling-stroke" />
            <path d="M398 76C406 86 410 98 406 110" vectorEffect="non-scaling-stroke" />
          </g>

          {/* seams between cuts: dashed */}
          <g className="fill-none stroke-frost-3" strokeWidth="1" strokeDasharray="4 3">
            {CUTS.map((c) => (
              <path key={c.id} d={c.d} vectorEffect="non-scaling-stroke" />
            ))}
            <path d="M48 92L48 264" vectorEffect="non-scaling-stroke" />
          </g>

          {/* the contour */}
          <path d={OUTLINE} className="fill-none stroke-frost-3" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <path d="M558 334L506 334" className="fill-none stroke-frost-3" strokeWidth="1" strokeDasharray="4 3" vectorEffect="non-scaling-stroke" />

          {/* the selected cut: Frost outline, Meat-ink leader, its name */}
          <path d={cut.d} className="fill-none stroke-frost" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          <g key={cut.id} className="text-meat-ink">
            <circle cx={cut.leader.from[0]} cy={cut.leader.from[1]} r="2.5" className="fill-frost" />
            <path
              d={`M${cut.leader.from[0]} ${cut.leader.from[1]}L${cut.leader.to[0]} ${cut.leader.to[1]}`}
              pathLength={1}
              className="fill-none stroke-current motion-ok:animate-[cm-draw_var(--dur-panel)_var(--ease-move)_both]"
              strokeWidth="1"
              strokeDasharray="1"
              vectorEffect="non-scaling-stroke"
            />
            <text
              x={cut.leader.label[0]}
              y={cut.leader.label[1]}
              textAnchor="middle"
              className="fill-frost font-display font-medium"
              style={{ fontSize: 22 }}
            >
              {cut.name}
            </text>
          </g>

          {/* hit areas: a tap on a region selects the same radio (pointer only; keys use the labels) */}
          {CUTS.map((c) => (
            <path
              key={c.id}
              d={c.d}
              onClick={() => setSelected(c.id)}
              className={`cursor-pointer fill-transparent transition-[fill] duration-hover ease-glide ${c.id === selected ? "" : "hover:fill-bordeaux/30"}`}
            />
          ))}
        </svg>

        <figcaption className="flex flex-col gap-3 border-t border-hairline pt-4">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-caption text-frost-2">
            <li className="flex items-center gap-2">
              <svg width="28" height="8" aria-hidden="true" className="shrink-0">
                <path d="M0 4H28" className="stroke-frost-3" strokeWidth="1" />
              </svg>
              קו מתאר, פיקסל אחד
            </li>
            <li className="flex items-center gap-2">
              <svg width="28" height="8" aria-hidden="true" className="shrink-0">
                <path d="M0 4H28" className="stroke-frost-3" strokeWidth="1" strokeDasharray="4 3" />
              </svg>
              תפר חיתוך
            </li>
            <li className="flex items-center gap-2">
              <svg width="16" height="16" aria-hidden="true" className="shrink-0">
                <rect width="16" height="16" fill="url(#cm-hatch-dense)" />
              </svg>
              <span>
                הצללה ב־<Num joined>45°</Num>
              </span>
            </li>
            <li className="flex items-center gap-2">
              <svg width="16" height="16" aria-hidden="true" className="shrink-0">
                <rect x="0.75" y="0.75" width="14.5" height="14.5" className="fill-bordeaux stroke-frost" strokeWidth="1.5" />
              </svg>
              נבחר: בורדו וקו מתאר בהיר
            </li>
          </ul>
          <p className="max-w-[72ch] text-caption text-pretty text-frost-2">
            סקיצה לנעילת עובי הקווים, לא מפה סופית. הציור המלא יועתק מטבלת נתחים בנחלת הכלל, ייבדק מול טבלת נתחים ישראלית,
            ושמות האזורים וגבולותיהם יאושרו במאסטרפוד.
          </p>
        </figcaption>
      </figure>

      {/* the control: typeset labels as one radiogroup, then the matching products as carte lines */}
      <div className="flex flex-col gap-6 lg:col-span-4 lg:col-start-1 lg:row-start-1">
        <fieldset className="flex flex-col gap-3">
          <legend className="mb-3 text-caption text-frost-3">נתחי החלק האחורי</legend>
          <div className="grid grid-cols-2 gap-2 lg:flex lg:flex-col lg:gap-0">
            {CUTS.map((c) => (
              <label
                key={c.id}
                className={
                  "relative flex min-h-12 cursor-pointer items-center gap-3 rounded-edge px-3 transition-colors duration-hover ease-glide " +
                  "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-frost " +
                  "hover:bg-steel max-lg:inset-ring max-lg:inset-ring-edge lg:border-b lg:border-hairline lg:rounded-none " +
                  (c.id === selected ? "bg-steel text-frost" : "text-frost-2")
                }
              >
                <input
                  type="radio"
                  name={name}
                  value={c.id}
                  checked={c.id === selected}
                  onChange={() => setSelected(c.id)}
                  className="sr-only"
                />
                {/* the checked state, drawn: a ring that fills */}
                <span
                  aria-hidden="true"
                  className={`grid size-4 shrink-0 place-items-center rounded-full inset-ring-[1.5px] ${c.id === selected ? "inset-ring-frost" : "inset-ring-frost-3"}`}
                >
                  {c.id === selected ? <span className="size-2 rounded-full bg-frost" /> : null}
                </span>
                <span className="type-dish">{c.name}</span>
                <span className="ms-auto ps-3 text-caption text-frost-3 max-lg:hidden">
                  <Num>{c.products.length}</Num> {c.products.length === 1 ? "מוצר" : "מוצרים"}
                </span>
                {c.id === selected ? <span aria-hidden="true" className="absolute inset-y-2 start-0 w-0.5 bg-bordeaux" /> : null}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="flex flex-col">
          <p className="pb-2 text-caption text-frost-3">
            {cut.name} · <Num>{cut.products.length}</Num> {cut.products.length === 1 ? "מוצר" : "מוצרים"} · ₪ ל{KG} · מחירי דמו
          </p>
          <ul className="flex flex-col">
            {cut.products.map((p) => (
              <li key={p.name} className="flex items-end gap-2 border-t border-hairline py-3">
                <span className="flex flex-col">
                  <span className="text-body font-medium text-frost">{p.name}</span>
                  <span className="text-caption text-frost-2">
                    {p.origin} · <Num>{p.kg}</Num> {KG} במלאי
                  </span>
                </span>
                <span aria-hidden="true" className="leader mb-2 flex-1 max-[25rem]:invisible" />
                <Money value={p.price} className="text-data font-medium text-frost" />
              </li>
            ))}
          </ul>
          <p className="sr-only" aria-live="polite">
            {cut.name}: {cut.products.length} {cut.products.length === 1 ? "מוצר" : "מוצרים"}
          </p>
        </div>
      </div>
    </div>
  );
}

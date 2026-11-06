"use client";

import { type RefObject, useEffect, useRef, useState } from "react";
import { flapPlate } from "@/components/board/flap";
import { Button } from "@/components/ui/button";
import { Num } from "@/components/ui/num";
import { cubicBezier, durations, easings } from "@/design/tokens";
import { useStill } from "@/lib/use-motion";

const ms = (id: string) => durations.find((d) => d.id === id)!.ms;
const ease = (id: string) => cubicBezier(easings.find((e) => e.id === id)!);
const FALL = ms("flap-fall");
const LAND = ms("flap-land");
const RIFFLE = ms("flap-riffle");

const DRUM = "0123456789";
const TARGETS = ["9", "2", "4"];
const FIRST = "4";

/** The drum glyphs between two values, forward and wrapping, capped to the last three before the target. */
function riffles(from: string, to: string) {
  const out: string[] = [];
  for (let i = (DRUM.indexOf(from) + 1) % DRUM.length; DRUM[i] !== to; i = (i + 1) % DRUM.length) out.push(DRUM[i]!);
  return out.slice(-3);
}

/**
 * One flap at full size (step 6, 148px at 1440). The old top leaf falls 0 → −90°
 * on ease-flap-fall, then the new bottom leaf lands 90° → 0 on ease-flap-land.
 * Bigger is slower: both scale by √(h / 40px). On the way it riffles through at
 * most the three drum glyphs before the target, 60ms each. Compositor only:
 * transform on four half-plates, perspective 600px, backfaces hidden.
 */
export function FlapBench() {
  const still = useStill();
  const cell = useRef<HTMLDivElement>(null);
  const topStill = useRef<HTMLSpanElement>(null);
  const bottomStill = useRef<HTMLSpanElement>(null);
  const fallLeaf = useRef<HTMLSpanElement>(null);
  const landLeaf = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(FIRST);
  const [busy, setBusy] = useState(false);
  const [h, setH] = useState(0);
  const [digit, setDigit] = useState(0);
  const turn = useRef(0);

  useEffect(() => {
    const el = cell.current;
    if (!el) return;
    // The digit is set at step 6 (148px at 1440); its plate is 1.2em of that, so the two are read side by side.
    const ro = new ResizeObserver(() => {
      setH(Math.round(el.getBoundingClientRect().height));
      setDigit(Math.round(parseFloat(getComputedStyle(el).fontSize)));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scale = h ? Math.sqrt(h / 40) : 1;
  const fall = Math.round(FALL * scale);
  const land = Math.round(LAND * scale);

  const glyph = (ref: RefObject<HTMLSpanElement | null>, g: string) => {
    const span = ref.current?.firstElementChild as HTMLElement | null;
    if (span) span.textContent = g;
  };

  async function flipOnce(from: string, to: string, f: number, l: number) {
    const top = fallLeaf.current;
    const bottom = landLeaf.current;
    if (!top || !bottom) return;
    glyph(topStill, to);
    glyph(bottomStill, from);
    glyph(fallLeaf, from);
    glyph(landLeaf, to);
    const a = top.animate([{ transform: "rotateX(0deg)" }, { transform: "rotateX(-90deg)" }], {
      duration: f,
      easing: ease("flap-fall"),
      fill: "forwards",
    });
    await a.finished;
    const b = bottom.animate([{ transform: "rotateX(90deg)" }, { transform: "rotateX(0deg)" }], {
      duration: l,
      easing: ease("flap-land"),
      fill: "forwards",
    });
    await b.finished;
    // settle: every plate shows the new glyph, the landing leaf hides again
    glyph(bottomStill, to);
    glyph(fallLeaf, to);
    a.cancel();
    b.cancel();
  }

  async function flip() {
    if (busy) return;
    const to = TARGETS[turn.current % TARGETS.length]!;
    turn.current += 1;
    if (still) {
      for (const r of [topStill, bottomStill, fallLeaf, landLeaf]) glyph(r, to);
      setValue(to);
      return;
    }
    setBusy(true);
    let from = value;
    for (const r of riffles(value, to)) {
      await flipOnce(from, r, RIFFLE * 0.56, RIFFLE * 0.44);
      from = r;
    }
    await flipOnce(from, to, fall, land);
    setValue(to);
    setBusy(false);
  }

  const half = "absolute inset-x-0 h-1/2 overflow-hidden bg-well [backface-visibility:hidden]";
  const face = "absolute inset-x-0 flex h-[200%] items-center justify-center leading-none";

  return (
    <div className="flex flex-wrap items-end gap-8">
      {/* flapPlate carries no colour of its own: the bench's digit is Frost */}
      <div aria-hidden="true" className="type-display font-light text-frost">
        <div ref={cell} className={`${flapPlate} h-[1.2em] w-[0.74em] rounded-edge [perspective:600px]`}>
          <span ref={topStill} className={`${half} top-0`}>
            <span className={`${face} top-0`}>{FIRST}</span>
          </span>
          <span ref={bottomStill} className={`${half} top-1/2`}>
            <span className={`${face} bottom-0`}>{FIRST}</span>
          </span>
          <span ref={fallLeaf} className={`${half} top-0 origin-bottom will-change-transform`}>
            <span className={`${face} top-0`}>{FIRST}</span>
          </span>
          <span ref={landLeaf} className={`${half} top-1/2 origin-top [transform:rotateX(90deg)]`}>
            <span className={`${face} bottom-0`}>{FIRST}</span>
          </span>
        </div>
      </div>
      <div className="flex flex-col items-start gap-4">
        <dl className="grid grid-cols-[auto_auto] gap-x-6 gap-y-1 text-caption">
          <dt className="text-frost-3">גודל הספרה</dt>
          <dd className="text-frost">
            <Num>{digit ? `${digit}px` : "—"}</Num>
          </dd>
          <dt className="text-frost-3">גובה התא</dt>
          <dd className="text-frost">
            <Num>{h ? `${h}px` : "—"}</Num>
          </dd>
          <dt className="text-frost-3">נפילה · נחיתה</dt>
          <dd className="text-frost">
            <Num>{`${fall} + ${land}ms`}</Num>
          </dd>
          <dt className="text-frost-3">דפדוף</dt>
          <dd className="text-frost">
            <Num>{`${RIFFLE}ms`}</Num> לתו,{" "}
            <span className="whitespace-nowrap">
              עד <Num>3</Num> תווים
            </span>
          </dd>
        </dl>
        <Button variant="secondary" size="sm" onClick={flip} aria-disabled={busy || undefined}>
          הפיכה
        </Button>
        <p className="sr-only" aria-live="polite">
          הספרה בתא: {value}
        </p>
      </div>
    </div>
  );
}

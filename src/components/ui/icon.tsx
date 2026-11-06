import type { SVGProps } from "react";

/**
 * Engraving-weight line icons, drawn for this project on a 24px grid:
 * 1.5px stroke, butt caps, miter joins — the same line as the cut map.
 * Directional icons (plane, ship, truck, arrow) mirror in RTL via `rtl:-scale-x-100`.
 */
const paths = {
  plane: (
    <>
      <path d="M2.5 13.5 21 9.2c.9-.2 1.2 1 .4 1.4L6.6 17.8 3.5 16Z" />
      <path d="m8.6 12 2.6-6.2 2.2-.5-1 5.7M9.5 15.8 7.3 20l1.9-.4 3.9-5" />
    </>
  ),
  ship: (
    <>
      <path d="M2.5 15.5h19l-2.6 4.2H5.6Z" />
      <path d="M5 15.5V11h14v4.5M8 11V7.5h5V11M14.5 11V8.8h3V11" />
      <path d="M2.5 22.2c1.6 0 1.6-.9 3.2-.9s1.6.9 3.2.9 1.6-.9 3.1-.9 1.6.9 3.2.9 1.6-.9 3.2-.9 1.6.9 3.1.9" />
    </>
  ),
  truck: (
    <>
      <path d="M2.5 6.5h11.5v10H2.5ZM14 9.5h4.3l3.2 3.6v3.4H14" />
      <circle cx="6.5" cy="17.5" r="1.9" />
      <circle cx="17.5" cy="17.5" r="1.9" />
    </>
  ),
  thermometer: (
    <>
      <path d="M10 4.5a2 2 0 0 1 4 0v9.3a4 4 0 1 1-4 0Z" />
      <path d="M12 9v7.5M16.5 6.5h2.5M16.5 9.5h2.5M16.5 12.5h1.5" />
    </>
  ),
  scale: (
    <>
      <path d="M4.5 20.5h15l-1.6-11H6.1Z" />
      <path d="M9 9.5a3 3 0 0 1 6 0M12 13.2v3.2" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5.2l3.4 2" />
    </>
  ),
  check: <path d="m4.5 12.5 4.6 4.5L19.5 6.8" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  arrow: <path d="M19 12H5m5.5-5.5L5 12l5.5 5.5" />,
  alert: (
    <>
      <path d="M12 3.5 21.5 20h-19Z" />
      <path d="M12 9.5v5M12 16.8v1.4" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 10.8v5.4M12 7.5v1.4" />
    </>
  ),
  doc: (
    <>
      <path d="M6 2.8h8.5L18.5 7v14.2H6Z" />
      <path d="M14 3v4.5h4.5M9 12h6.5M9 15.5h6.5" />
    </>
  ),
} as const;

export type IconName = keyof typeof paths;

const directional = new Set<IconName>(["plane", "ship", "truck", "arrow"]);

export function Icon({
  name,
  size = 20,
  className = "",
  title,
  ...rest
}: { name: IconName; size?: number; title?: string } & Omit<SVGProps<SVGSVGElement>, "name">) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="butt"
      strokeLinejoin="miter"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      className={`shrink-0 ${directional.has(name) ? "rtl:-scale-x-100" : ""} ${className}`}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {paths[name]}
    </svg>
  );
}

/**
 * Solid trend triangles as SVG (▲ ▼ are missing from all three typefaces).
 * Up and down are named for assistive tech; flat stays silent because "0.0%" says it.
 */
export function TrendGlyph({ dir, className = "" }: { dir: "up" | "down" | "flat"; className?: string }) {
  const label = dir === "up" ? "עלייה" : dir === "down" ? "ירידה" : undefined;
  return (
    <svg
      viewBox="0 0 10 10"
      width="0.62em"
      height="0.62em"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={`inline-block shrink-0 ${className}`}
    >
      {dir === "up" ? <path d="M5 1.2 9.4 8.8H.6Z" fill="currentColor" /> : null}
      {dir === "down" ? <path d="M5 8.8.6 1.2h8.8Z" fill="currentColor" /> : null}
      {dir === "flat" ? <path d="M1 3.4h8M1 6.6h8" stroke="currentColor" strokeWidth="1.4" /> : null}
    </svg>
  );
}

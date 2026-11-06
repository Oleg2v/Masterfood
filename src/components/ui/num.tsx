import type { ReactNode } from "react";

/**
 * Every price, weight, time and temperature goes through <Num>: an isolated LTR
 * run (<bdi dir="ltr">) in IBM Plex Mono with tabular, slashed-zero numerals.
 */
export function Num({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <bdi dir="ltr" className={`num ${className}`}>
      {children}
    </bdi>
  );
}

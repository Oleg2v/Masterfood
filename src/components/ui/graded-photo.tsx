import Image from "next/image";

export interface Photo {
  src: string;
  alt: string;
  photographer: string;
  /** Unsplash photo page, for the credit link. */
  page?: string;
  /** "flesh" keeps the warmth of meat and fish; "cold" drains ice, steel and whole fish. */
  tone?: "flesh" | "cold";
  /** Compensate a bright ("high") or already dark ("low") source. */
  key?: "high" | "low";
}

/* Tested on every placeholder: flesh lands on the brand accents (salmon ≈ #FF7A59, beef ≈ Bordeaux). */
const grade = {
  cold: "[filter:brightness(0.9)_contrast(1.24)_saturate(0.55)]",
  flesh: "[filter:brightness(0.92)_contrast(1.1)_saturate(1.14)]",
  high: "[filter:brightness(0.72)_contrast(1.3)_saturate(0.55)]",
  low: "[filter:brightness(1.04)_contrast(1.04)_saturate(0.55)]",
  muted: "[filter:brightness(0.62)_contrast(1.05)_saturate(0.18)]",
} as const;

/**
 * "Only the protein is warm": one CSS grade that unifies mismatched stock photos.
 *  1. tone-specific brightness / contrast / saturation (flesh keeps its warmth);
 *  2. a Steel wash in soft-light cools neutrals and deepens reds without greying them;
 *  3. Deep Ice in `lighten` clamps every black to the page colour, so shadows
 *     melt into the page instead of sitting on it;
 *  4. a radial mask dissolves the edges into Deep Ice. No grain: it muddies food.
 * `muted` is the sold-out treatment: the product is still there, but drained.
 * In forced colours the two washes are hidden: the photo keeps only step 1.
 */
export function GradedPhoto({
  photo,
  sizes,
  priority = false,
  muted = false,
  className = "",
  imgClassName = "",
  position = "center",
  vignette = true,
  fill = false,
}: {
  photo: Photo;
  sizes: string;
  priority?: boolean;
  muted?: boolean;
  className?: string;
  imgClassName?: string;
  /** object-position, e.g. "center 70%" to crop away a sign at the top. */
  position?: string;
  /** Dissolve the edges into the page (off for crisp card plates). */
  vignette?: boolean;
  /** Fill a positioned parent (absolute inset-0) instead of sizing itself. */
  fill?: boolean;
}) {
  const tone = photo.tone ?? "flesh";
  const filter = muted ? grade.muted : photo.key ? grade[photo.key] : grade[tone];
  return (
    <div
      className={`${fill ? "absolute inset-0" : "relative"} isolate overflow-hidden bg-deep-ice ${vignette ? "[mask-image:radial-gradient(farthest-corner_at_50%_45%,#000_55%,rgb(0_0_0/0.7)_80%,transparent_100%)]" : ""} ${className}`}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes={sizes}
        priority={priority}
        style={{ objectPosition: position }}
        className={`object-cover ${filter} ${imgClassName}`}
      />
      {/* Forced colours would paint these washes Canvas, and `lighten` with a white Canvas
          blanks the photo, so they step aside and the photo shows with its filter grade alone. */}
      <span
        aria-hidden="true"
        className={`absolute inset-0 bg-steel mix-blend-soft-light forced-colors:hidden ${tone === "flesh" && !muted ? "opacity-70" : "opacity-100"}`}
      />
      <span aria-hidden="true" className="absolute inset-0 bg-deep-ice mix-blend-lighten forced-colors:hidden" />
    </div>
  );
}

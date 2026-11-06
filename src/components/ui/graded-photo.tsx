import Image from "next/image";

export interface Photo {
  src: string;
  alt: string;
  photographer: string;
  /** Unsplash photo page, for the credit link. */
  page?: string;
}

/**
 * "Cold grade, warm flesh": one CSS treatment that unifies mismatched stock photos.
 *  1. the photo is slightly desaturated and pulled down;
 *  2. a Deep Ice layer in `lighten` lifts pure black to the page colour, so shadows
 *     melt into the background instead of sitting on it;
 *  3. a cool soft-light wash tints the shadows only;
 *  4. a soft vignette makes different lenses feel like one shoot (no grain: it muddies food).
 */
export function GradedPhoto({
  photo,
  sizes,
  priority = false,
  frosted = false,
  className = "",
  imgClassName = "",
}: {
  photo: Photo;
  sizes: string;
  priority?: boolean;
  /** Frost on the glass = not available right now (sold out, after cutoff). */
  frosted?: boolean;
  className?: string;
  imgClassName?: string;
}) {
  return (
    <div className={`relative isolate overflow-hidden bg-deep-ice ${className}`}>
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-cover ${frosted ? "[filter:blur(10px)_saturate(0.5)_brightness(0.95)] scale-110" : "[filter:saturate(0.88)_contrast(1.08)_brightness(0.86)]"} ${imgClassName}`}
      />
      <span aria-hidden="true" className="absolute inset-0 bg-deep-ice mix-blend-lighten" />
      <span aria-hidden="true" className="absolute inset-0 bg-[#123A52] opacity-40 mix-blend-soft-light" />
      {frosted ? <span aria-hidden="true" className="frost-veil absolute inset-0" /> : null}
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_40%,transparent_55%,rgb(7_20_28/0.7)_100%)]"
      />
    </div>
  );
}

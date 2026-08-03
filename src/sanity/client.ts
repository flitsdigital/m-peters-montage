import { sanityClient } from "sanity:client";
import { createImageUrlBuilder } from "@sanity/image-url";
import type { Image } from "@sanity/types";

const builder = createImageUrlBuilder(sanityClient);

/** URL-builder voor Sanity-afbeeldingen (crop/hotspot-bewust). */
export function urlFor(source: Image) {
  return builder.image(source).auto("format").fit("max");
}

/**
 * Sanity-afbeelding → props voor onze `Image`-atom.
 * We leveren een kant-en-klare src + srcset; astro:assets kan Sanity-URL's
 * niet zelf optimaliseren.
 */
export function imageProps(source: (Image & { alt?: string }) | undefined, width = 1600) {
  if (!source?.asset) return undefined;
  return {
    src: urlFor(source).width(width).url(),
    alt: source.alt ?? "",
  };
}

export { sanityClient };

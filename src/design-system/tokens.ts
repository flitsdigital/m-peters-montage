/**
 * Token-registry — alleen NAMEN, geen waarden.
 *
 * De waarden staan in `src/styles/tokens.css` (single source of truth).
 * De styleguide resolvet ze in de browser met `getComputedStyle`, zodat een
 * tweak in de CSS meteen zichtbaar is zonder dit bestand aan te raken.
 */

export const SWATCHES = [
  "--swatch--brand",
  "--swatch--brand-text",
  "--swatch--light-100",
  "--swatch--light-80",
  "--swatch--light-60",
  "--swatch--light-faded",
  "--swatch--dark-100",
  "--swatch--dark-80",
  "--swatch--dark-60",
  "--swatch--dark-40",
  "--swatch--dark-faded",
  "--swatch--transparent",
] as const;

export const THEME_TOKENS = [
  "--theme--background",
  "--theme--background-secondary",
  "--theme--text",
  "--theme--border",
] as const;

export const BUTTON_TOKENS = [
  "--button--background",
  "--button--text",
  "--button--border",
  "--button--background-hover",
  "--button--text-hover",
  "--button--border-hover",
] as const;

export const THEMES = ["light", "dark", "invert", "inherit"] as const;
export type Theme = (typeof THEMES)[number];

export const TYPE_STYLES = [
  "display",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "text-large",
  "text-main",
  "text-small",
] as const;
export type TypeStyle = (typeof TYPE_STYLES)[number];

/** Fluid vanaf 2rem — de kleinere zijn vast. */
export const SIZES = [
  "0rem",
  "0-125rem",
  "0-25rem",
  "0-375rem",
  "0-5rem",
  "0-75rem",
  "1rem",
  "1-25rem",
  "1-5rem",
  "2rem",
  "2-5rem",
  "3rem",
  "3-5rem",
  "4rem",
  "4-5rem",
  "5rem",
  "5-5rem",
  "6rem",
  "6-5rem",
  "7rem",
  "7-5rem",
  "8rem",
  "8-5rem",
  "9rem",
  "9-5rem",
  "10rem",
  "11rem",
  "12rem",
  "13rem",
  "14rem",
  "15rem",
  "16rem",
] as const;

export const SPACES = [1, 2, 3, 4, 5, 6, 7, 8] as const;

export const SECTION_SPACES = ["none", "even", "small", "main", "large"] as const;
export type SectionSpace = (typeof SECTION_SPACES)[number];

export const RADII = ["small", "main", "round"] as const;

/** Exact de drie Webflow-breakpoints. Geen nieuwe toevoegen. */
export const BREAKPOINTS = { desktop: 991, tablet: 767, landscape: 479 } as const;

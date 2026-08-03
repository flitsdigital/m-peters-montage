/**
 * Site-brede constanten.
 *
 * Fase 4: dit wordt een Sanity `siteSettings`-singleton. Tot die tijd staat het
 * hier zodat de layout en secties al één bron hebben.
 */

export const SITE = {
  name: "M. Peters Montage",
  url: "https://www.mpetersmontage.nl",
  description:
    "Michael Peters Montage biedt vakkundige montage van kozijnen, veranda’s, glazen schuifwanden en zonwering. Kies voor duurzame oplossingen en professioneel maatwerk voor jouw woning of bedrijf!",
  ogImage: "https://www.mpetersmontage.nl/images/og-default.jpg",

  phone: "06 27104183",
  phoneHref: "tel:0627104183",
  phoneDisplay: "06 27 10 41 83",
  email: "info@mpetersmontage.nl",

  /** Besluit Checkpoint 0: de footer is leidend, de JSON-LD is hierop gecorrigeerd. */
  address: {
    street: "Lavas 10",
    postalCode: "7892 AG",
    city: "Klazienaveen",
    country: "NL",
  },

  /** Geocode van Lavas 10, 7892 AG Klazienaveen (OpenStreetMap/Nominatim). */
  geo: { lat: 52.7323333, lng: 6.9684729 },

  social: {
    facebook: "https://www.facebook.com/profile.php?id=61551208175957",
  },

  analytics: {
    ga4: "G-F7GZ2RSVSS",
    clarity: "r9c0o7p16n",
  },
} as const;

/**
 * Nav- en footerstructuur, 1-op-1 uit het Webflow-export.
 * Fase 4: verhuist naar de Sanity `siteSettings`-singleton.
 */

export const DIENSTEN = [
  { label: "Kunststof kozijnen", href: "/kunststof-kozijnen" },
  { label: "Veranda's", href: "/verandas" },
  { label: "Zonwering", href: "/zonwering" },
  { label: "Glazen schuifwanden", href: "/glazen-schuifwanden" },
  { label: "Rolluiken", href: "/rolluiken" },
];

/** Desktop-nav naast de dropdown. */
export const NAV_LINKS = [
  { label: "Over mij", href: "/over-mij" },
  { label: "Blogs", href: "/blogs" },
  { label: "Projecten", href: "/projecten" },
];

/** Mobiel overlay-menu — bewust een andere, kortere set dan de desktop-nav. */
export const NAV_MENU_LINKS = [
  { label: "Home", href: "/" },
  { label: "Over mij", href: "/over-mij" },
  { label: "Diensten", href: "/#diensten" },
  { label: "Blog", href: "/blogs" },
  { label: "Contact", href: "/contact" },
];

/** Vijf kolommen in de footer. Kolom 1 heeft het logo als slot. */
export const FOOTER_COLUMNS = [
  {
    links: [
      { label: "info@mpetersmontage.nl", href: "mailto:info@mpetersmontage.nl" },
      { label: "06 27 10 41 83", href: "tel:0627104183" },
      { label: "Lavas 10, 7892 AG Klazienaveen", href: "#", html: "Lavas 10<br>7892 AG Klazienaveen", plain: true },
    ],
  },
  {
    header: "LINKS",
    links: [
      { label: "Home", href: "/" },
      { label: "Diensten", href: "/#diensten" },
      { label: "Over mij", href: "/over-mij" },
      { label: "Blogs", href: "/blogs" },
      { label: "Projecten", href: "/projecten" },
      { label: "Keralit", href: "/keralit-gevelbekleding" },
    ],
  },
  {
    header: "DIENSTEN",
    links: DIENSTEN,
  },
  {
    header: "KUNSTSTOF KOZIJNEN",
    links: [
      { label: "Voordelen van Kunststof Kozijnen", href: "/kunststof-kozijnen/voordelen" },
      { label: "Soorten Kunststof Kozijnen", href: "/kunststof-kozijnen/soorten" },
      { label: "Betrokken in de regio", href: "/kunststof-kozijnen/regio" },
      { label: "Kunststof Kozijnen Klazienaveen", href: "/kunststof-kozijnen/regio/klazienaveen" },
      { label: "Kunststof Kozijnen Emmen", href: "/kunststof-kozijnen/regio/emmen" },
      { label: "Kunststof Kozijnen Drenthe", href: "/kunststof-kozijnen/regio/drenthe" },
    ],
  },
  {
    header: "ZONWERING",
    links: [
      { label: "Soorten zonwering", href: "/zonwering/soorten-zonwering" },
      { label: "Zonwering Klazienaveen", href: "/zonwering/zonwering-klazienaveen" },
      { label: "Zonwering Emmen", href: "/zonwering/zonwering-emmen" },
      { label: "Zonwering Drenthe", href: "/zonwering/drenthe" },
    ],
  },
];

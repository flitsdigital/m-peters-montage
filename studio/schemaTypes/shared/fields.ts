import { defineField } from "sanity";

/**
 * Gedeelde velden die op elk sectieblok terugkomen. Dit zijn de drie
 * "hooks" die het Webflow-origineel ook per sectie had: data-theme,
 * data-padding-top en data-padding-bottom.
 *
 * Belangrijk: deze velden dragen géén styling — ze mappen 1-op-1 op props
 * van de bestaande Astro-componenten.
 */

const THEMES = [
  { title: "Erven van boven (inherit)", value: "inherit" },
  { title: "Licht", value: "light" },
  { title: "Donker", value: "dark" },
  { title: "Omgekeerd (invert)", value: "invert" },
];

const SPACES = [
  { title: "Geen", value: "none" },
  { title: "Gelijk aan marge", value: "even" },
  { title: "Klein", value: "small" },
  { title: "Normaal", value: "main" },
  { title: "Groot", value: "large" },
];

export const sectionOptions = [
  defineField({
    name: "theme",
    title: "Kleurthema",
    type: "string",
    options: { list: THEMES },
    initialValue: "inherit",
    group: "opmaak",
  }),
  defineField({
    name: "paddingTop",
    title: "Ruimte boven",
    type: "string",
    options: { list: SPACES },
    initialValue: "main",
    group: "opmaak",
  }),
  defineField({
    name: "paddingBottom",
    title: "Ruimte onder",
    type: "string",
    options: { list: SPACES },
    initialValue: "main",
    group: "opmaak",
  }),
];

export const sectionGroups = [
  { name: "content", title: "Inhoud", default: true },
  { name: "opmaak", title: "Opmaak" },
];

/** Eyebrow-label boven een sectiekop. */
export const eyebrowField = defineField({
  name: "eyebrow",
  title: "Label boven de kop",
  type: "object",
  group: "content",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({ name: "text", title: "Tekst", type: "string" }),
    defineField({
      name: "icon",
      title: "Icoon",
      type: "string",
      options: {
        list: [
          { title: "Standaard (ster)", value: "eyebrow-default" },
          { title: "Contact", value: "eyebrow-contact" },
          { title: "Diensten", value: "eyebrow-diensten" },
          { title: "Reviews", value: "eyebrow-reviews" },
        ],
      },
      initialValue: "eyebrow-default",
    }),
    defineField({
      name: "variant",
      title: "Achtergrond",
      type: "string",
      options: {
        list: [
          { title: "Primair", value: "primary" },
          { title: "Secundair", value: "secondary" },
        ],
        layout: "radio",
      },
      initialValue: "primary",
    }),
  ],
});

/** Knop met interne of externe link. */
export const ctaField = defineField({
  name: "cta",
  title: "Knop",
  type: "object",
  group: "content",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({ name: "label", title: "Tekst", type: "string" }),
    defineField({ name: "href", title: "Link", type: "string" }),
  ],
});

/** Rich text met de opmaak die de site daadwerkelijk gebruikt. */
export const richText = defineField({
  name: "body",
  title: "Tekst",
  type: "array",
  group: "content",
  of: [
    {
      type: "block",
      styles: [
        { title: "Normaal", value: "normal" },
        { title: "Kop 2", value: "h2" },
        { title: "Kop 3", value: "h3" },
        { title: "Kop 4", value: "h4" },
        { title: "Citaat", value: "blockquote" },
      ],
      lists: [
        { title: "Opsomming", value: "bullet" },
        { title: "Genummerd", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Vet", value: "strong" },
          { title: "Cursief", value: "em" },
        ],
        annotations: [
          {
            name: "link",
            type: "object",
            title: "Link",
            fields: [
              defineField({ name: "href", title: "URL", type: "string" }),
              defineField({
                name: "blank",
                title: "In nieuw tabblad",
                type: "boolean",
                initialValue: false,
              }),
            ],
          },
        ],
      },
    },
    { type: "image", options: { hotspot: true } },
  ],
});

/**
 * Afbeelding met verplichte alt-tekst.
 * `group` alleen meegeven op types die veldgroepen hebben — geneste objecten
 * (bv. een dienst in een array) hebben die niet.
 */
export const imageField = (
  name = "image",
  title = "Afbeelding",
  /** `false` = geen veldgroep (voor geneste objecten). */
  group: string | false = "content",
) =>
  defineField({
    name,
    title,
    type: "image",
    ...(group ? { group } : {}),
    options: { hotspot: true },
    fields: [
      defineField({
        name: "alt",
        title: "Alt-tekst",
        type: "string",
        description: "Beschrijf wat er op de foto staat — nodig voor screenreaders en SEO.",
        validation: (rule) => rule.required(),
      }),
    ],
  });

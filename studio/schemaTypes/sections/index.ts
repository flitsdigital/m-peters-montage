import { defineType, defineField, defineArrayMember } from "sanity";
import {
  BlockContentIcon,
  ImageIcon,
  StarIcon,
  ThLargeIcon,
  HelpCircleIcon,
  EnvelopeIcon,
  ListIcon,
  DocumentTextIcon,
  PinIcon,
  LinkIcon,
  SplitVerticalIcon,
  CodeIcon,
} from "@sanity/icons";
import {
  sectionOptions,
  sectionGroups,
  eyebrowField,
  ctaField,
  richText,
  imageField,
} from "../shared/fields";

/**
 * Eén object-type per Astro-sectiecomponent uit Fase 3.
 * De velden zijn puur inhoud + de drie prop-hooks (theme/padding);
 * alle styling blijft in de componenten.
 */

export const heroHomeSection = defineType({
  name: "heroHomeSection",
  title: "Hero (homepage)",
  type: "object",
  icon: ImageIcon,
  groups: sectionGroups,
  fields: [
    defineField({
      name: "heading",
      title: "Kop",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "body", title: "Tekst", type: "text", rows: 3, group: "content" }),
    defineField({
      name: "rating",
      title: "Beoordelingsregel",
      type: "string",
      group: "content",
      initialValue: "Beoordeeld met 5 sterren",
    }),
    imageField("image", "Achtergrondfoto"),
    defineField({
      name: "overlay",
      title: "Donkerte overlay",
      type: "number",
      group: "opmaak",
      description: "0 = geen, 1 = volledig zwart.",
      initialValue: 0.6,
      validation: (rule) => rule.min(0).max(1),
    }),
    ctaField,
  ],
  preview: {
    select: { title: "heading", media: "image" },
    prepare: ({ title, media }) => ({
      title: title || "Hero",
      subtitle: "Sectie · Hero homepage",
      media: media ?? ImageIcon,
    }),
  },
});

export const headerCenteredSection = defineType({
  name: "headerCenteredSection",
  title: "Paginakop",
  type: "object",
  icon: BlockContentIcon,
  groups: sectionGroups,
  fields: [
    defineField({
      name: "variant",
      title: "Uitvoering",
      type: "string",
      group: "opmaak",
      options: {
        list: [
          { title: "Met achtergrondfoto", value: "hero" },
          { title: "Zonder foto (compact)", value: "plain" },
        ],
        layout: "radio",
      },
      initialValue: "hero",
    }),
    defineField({
      name: "heading",
      title: "Kop (h1)",
      type: "string",
      group: "content",
      description: "Mag leeg blijven voor een puur decoratieve fotoband.",
    }),
    defineField({
      name: "headingStyle",
      title: "Koptekstgrootte",
      type: "string",
      group: "opmaak",
      options: {
        list: [
          { title: "Groot (h1)", value: "h1" },
          { title: "Normaal (h2)", value: "h2" },
        ],
        layout: "radio",
      },
      initialValue: "h2",
    }),
    defineField({ name: "body", title: "Intro", type: "text", rows: 3, group: "content" }),
    eyebrowField,
    defineField({
      name: "breadcrumbs",
      title: "Kruimelpad",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "object",
          name: "crumb",
          fields: [
            defineField({ name: "label", title: "Tekst", type: "string" }),
            defineField({ name: "href", title: "Link", type: "string" }),
          ],
          preview: { select: { title: "label", subtitle: "href" } },
        }),
      ],
    }),
    imageField("image", "Achtergrondfoto"),
    defineField({
      name: "overlay",
      title: "Donkerte overlay",
      type: "number",
      group: "opmaak",
      initialValue: 0.7,
      validation: (rule) => rule.min(0).max(1),
    }),
    defineField({
      name: "showContactItems",
      title: "Telefoon en e-mail tonen",
      type: "boolean",
      group: "content",
      initialValue: false,
    }),
    ctaField,
  ],
  preview: {
    select: { title: "heading", media: "image" },
    prepare: ({ title, media }) => ({
      title: title || "Paginakop",
      subtitle: "Sectie · Paginakop",
      media: media ?? BlockContentIcon,
    }),
  },
});

export const mediaSection = defineType({
  name: "mediaSection",
  title: "Tekst met foto",
  type: "object",
  icon: SplitVerticalIcon,
  groups: sectionGroups,
  fields: [
    defineField({
      name: "variant",
      title: "Indeling",
      type: "string",
      group: "opmaak",
      options: {
        list: [
          { title: "Foto links, tekst rechts", value: "content" },
          { title: "Tekst links, foto rechts (donker)", value: "over" },
        ],
        layout: "radio",
      },
      initialValue: "content",
    }),
    defineField({
      name: "heading",
      title: "Kop",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    richText,
    eyebrowField,
    imageField(),
    ctaField,
    defineField({
      name: "background",
      title: "Op secundaire achtergrond",
      type: "boolean",
      group: "opmaak",
      initialValue: false,
    }),
    defineField({
      name: "zoom",
      title: "Zoom-effect op de foto",
      type: "boolean",
      group: "opmaak",
      initialValue: false,
    }),
    defineField({
      name: "showSocials",
      title: "Social-links tonen",
      type: "boolean",
      group: "content",
      description: "Toont de Facebook-knop uit de site-instellingen.",
      initialValue: false,
    }),
    ...sectionOptions,
  ],
  preview: {
    select: { title: "heading", media: "image", variant: "variant" },
    prepare: ({ title, media, variant }) => ({
      title: title || "Tekst met foto",
      subtitle: `Sectie · Tekst met foto (${variant === "over" ? "donker" : "standaard"})`,
      media: media ?? SplitVerticalIcon,
    }),
  },
});

export const contentCenteredSection = defineType({
  name: "contentCenteredSection",
  title: "Gecentreerde tekst",
  type: "object",
  icon: BlockContentIcon,
  groups: sectionGroups,
  fields: [
    defineField({
      name: "heading",
      title: "Kop",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    richText,
    eyebrowField,
    ctaField,
    ...sectionOptions,
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({
      title: title || "Gecentreerde tekst",
      subtitle: "Sectie · Gecentreerde tekst",
    }),
  },
});

export const richTextSection = defineType({
  name: "richTextSection",
  title: "Tekstblok",
  type: "object",
  icon: DocumentTextIcon,
  groups: sectionGroups,
  fields: [
    richText,
    ctaField,
    defineField({
      name: "align",
      title: "Uitlijning",
      type: "string",
      group: "opmaak",
      options: {
        list: [
          { title: "Volle breedte", value: "indent" },
          { title: "Gecentreerd", value: "center" },
        ],
        layout: "radio",
      },
      initialValue: "indent",
    }),
    defineField({
      name: "background",
      title: "Op secundaire achtergrond",
      type: "boolean",
      group: "opmaak",
      initialValue: false,
    }),
    ...sectionOptions,
  ],
  preview: {
    select: { body: "body" },
    prepare: ({ body }) => ({
      title: body?.[0]?.children?.[0]?.text?.slice(0, 60) || "Tekstblok",
      subtitle: "Sectie · Tekstblok",
    }),
  },
});

export const embedSection = defineType({
  name: "embedSection",
  title: "Externe widget",
  type: "object",
  icon: CodeIcon,
  groups: sectionGroups,
  fields: [
    defineField({
      name: "html",
      title: "HTML",
      type: "text",
      rows: 8,
      group: "content",
      description:
        "Code van een externe partij, bijvoorbeeld de Kleurmonster-widget. Plak hier alleen code die je vertrouwt.",
    }),
    ...sectionOptions,
  ],
  preview: {
    prepare: () => ({ title: "Externe widget", subtitle: "Sectie · Embed" }),
  },
});

export const featureGridSection = defineType({
  name: "featureGridSection",
  title: "Voordelen-grid",
  type: "object",
  icon: ThLargeIcon,
  groups: sectionGroups,
  fields: [
    defineField({ name: "heading", title: "Kop", type: "string", group: "content" }),
    defineField({ name: "intro", title: "Intro", type: "text", rows: 2, group: "content" }),
    eyebrowField,
    defineField({
      name: "items",
      title: "Kaartjes",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "object",
          name: "feature",
          fields: [
            defineField({ name: "title", title: "Titel", type: "string" }),
            defineField({ name: "text", title: "Tekst", type: "text", rows: 2 }),
            defineField({
              name: "width",
              title: "Breedte",
              type: "string",
              options: {
                list: [
                  { title: "Half (2 op een rij)", value: "half" },
                  { title: "Derde (3 op een rij)", value: "third" },
                ],
                layout: "radio",
              },
              initialValue: "third",
            }),
          ],
          preview: { select: { title: "title", subtitle: "text" } },
        }),
      ],
    }),
    defineField({
      name: "background",
      title: "Op secundaire achtergrond",
      type: "boolean",
      group: "opmaak",
      initialValue: false,
    }),
    ...sectionOptions,
  ],
  preview: {
    select: { title: "heading", items: "items" },
    prepare: ({ title, items }) => ({
      title: title || "Voordelen-grid",
      subtitle: `Sectie · Voordelen (${items?.length ?? 0} kaartjes)`,
    }),
  },
});

export const werkwijzeSection = defineType({
  name: "werkwijzeSection",
  title: "Werkwijze",
  type: "object",
  icon: ListIcon,
  groups: sectionGroups,
  fields: [
    defineField({
      name: "heading",
      title: "Kop",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "intro", title: "Intro", type: "text", rows: 3, group: "content" }),
    eyebrowField,
    defineField({
      name: "steps",
      title: "Stappen",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "object",
          name: "step",
          fields: [
            defineField({ name: "title", title: "Titel", type: "string" }),
            defineField({ name: "text", title: "Tekst", type: "text", rows: 3 }),
          ],
          preview: { select: { title: "title", subtitle: "text" } },
        }),
      ],
    }),
    ...sectionOptions,
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({
      title: title || "Werkwijze",
      subtitle: "Sectie · Werkwijze",
    }),
  },
});

export const reviewsSection = defineType({
  name: "reviewsSection",
  title: "Reviews",
  type: "object",
  icon: StarIcon,
  groups: sectionGroups,
  fields: [
    defineField({
      name: "heading",
      title: "Kop",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "intro", title: "Intro", type: "text", rows: 3, group: "content" }),
    eyebrowField,
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({
      title: title || "Reviews",
      subtitle: "Sectie · Reviews (alle reviews uit de CMS)",
    }),
  },
});

export const projectenSection = defineType({
  name: "projectenSection",
  title: "Projecten",
  type: "object",
  icon: ThLargeIcon,
  groups: sectionGroups,
  fields: [
    defineField({
      name: "heading",
      title: "Kop",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "intro", title: "Intro", type: "text", rows: 3, group: "content" }),
    eyebrowField,
    defineField({
      name: "filterTag",
      title: "Alleen projecten met deze tag",
      type: "reference",
      to: [{ type: "tag" }],
      group: "content",
      description: "Leeglaten om de meest recente projecten te tonen.",
    }),
    defineField({
      name: "theme",
      title: "Kleurthema",
      type: "string",
      group: "opmaak",
      options: {
        list: [
          { title: "Erven van boven", value: "inherit" },
          { title: "Licht", value: "light" },
          { title: "Donker", value: "dark" },
        ],
      },
      initialValue: "inherit",
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({
      title: title || "Projecten",
      subtitle: "Sectie · Projecten-slider",
    }),
  },
});

export const faqSection = defineType({
  name: "faqSection",
  title: "Veelgestelde vragen",
  type: "object",
  icon: HelpCircleIcon,
  groups: sectionGroups,
  fields: [
    defineField({
      name: "heading",
      title: "Kop",
      type: "string",
      group: "content",
      initialValue: "Veel gestelde vragen",
    }),
    eyebrowField,
    defineField({
      name: "items",
      title: "Vragen",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "object",
          name: "faq",
          fields: [
            defineField({ name: "question", title: "Vraag", type: "string" }),
            defineField({ name: "answer", title: "Antwoord", type: "array", of: [{ type: "block" }] }),
          ],
          preview: { select: { title: "question" } },
        }),
      ],
    }),
    ...sectionOptions,
  ],
  preview: {
    select: { title: "heading", items: "items" },
    prepare: ({ title, items }) => ({
      title: title || "Veelgestelde vragen",
      subtitle: `Sectie · FAQ (${items?.length ?? 0} vragen)`,
    }),
  },
});

export const contactSection = defineType({
  name: "contactSection",
  title: "Contact",
  type: "object",
  icon: EnvelopeIcon,
  groups: sectionGroups,
  fields: [
    defineField({
      name: "heading",
      title: "Kop",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    richText,
    eyebrowField,
    defineField({
      name: "formHeading",
      title: "Kop boven het formulier",
      type: "string",
      group: "content",
      initialValue: "Vul het formulier in om te starten",
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({
      title: title || "Contact",
      subtitle: "Sectie · Contact + formulier",
    }),
  },
});

export const dienstenSection = defineType({
  name: "dienstenSection",
  title: "Diensten",
  type: "object",
  icon: ThLargeIcon,
  groups: sectionGroups,
  fields: [
    defineField({
      name: "heading",
      title: "Kop",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    richText,
    eyebrowField,
    defineField({
      name: "items",
      title: "Diensten",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "object",
          name: "dienst",
          fields: [
            defineField({ name: "title", title: "Titel", type: "string" }),
            defineField({ name: "text", title: "Tekst", type: "text", rows: 2 }),
            defineField({ name: "href", title: "Link", type: "string" }),
            imageField("image", "Afbeelding", false),
          ],
          preview: { select: { title: "title", media: "image" } },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare: ({ title }) => ({
      title: title || "Diensten",
      subtitle: "Sectie · Diensten",
    }),
  },
});

export const cardGridSection = defineType({
  name: "cardGridSection",
  title: "Overzicht blogs of projecten",
  type: "object",
  icon: ThLargeIcon,
  groups: sectionGroups,
  fields: [
    defineField({
      name: "source",
      title: "Toon",
      type: "string",
      group: "content",
      options: {
        list: [
          { title: "Blogs", value: "blog" },
          { title: "Projecten", value: "project" },
        ],
        layout: "radio",
      },
      initialValue: "blog",
    }),
    defineField({ name: "heading", title: "Kop", type: "string", group: "content" }),
    defineField({
      name: "limit",
      title: "Maximum aantal",
      type: "number",
      group: "content",
      description: "Leeglaten om alles te tonen.",
    }),
    defineField({
      name: "background",
      title: "Op secundaire achtergrond",
      type: "boolean",
      group: "opmaak",
      initialValue: false,
    }),
    ...sectionOptions,
  ],
  preview: {
    select: { title: "heading", source: "source" },
    prepare: ({ title, source }) => ({
      title: title || (source === "project" ? "Projecten" : "Blogs"),
      subtitle: "Sectie · Overzicht",
    }),
  },
});

export const regioSection = defineType({
  name: "regioSection",
  title: "Regio's",
  type: "object",
  icon: PinIcon,
  groups: sectionGroups,
  fields: [
    defineField({
      name: "items",
      title: "Regio's",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "object",
          name: "regio",
          fields: [
            defineField({ name: "title", title: "Plaatsnaam", type: "string" }),
            defineField({ name: "href", title: "Link", type: "string" }),
            imageField("image", "Afbeelding", false),
          ],
          preview: { select: { title: "title", media: "image" } },
        }),
      ],
    }),
    ...sectionOptions,
  ],
  preview: {
    select: { items: "items" },
    prepare: ({ items }) => ({
      title: "Regio's",
      subtitle: `Sectie · Regio's (${items?.length ?? 0})`,
    }),
  },
});

export const linksSection = defineType({
  name: "linksSection",
  title: "Linklijst",
  type: "object",
  icon: LinkIcon,
  groups: sectionGroups,
  fields: [
    defineField({
      name: "links",
      title: "Links",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "object",
          name: "link",
          fields: [
            defineField({ name: "label", title: "Tekst", type: "string" }),
            defineField({ name: "href", title: "URL", type: "url" }),
          ],
          preview: { select: { title: "label", subtitle: "href" } },
        }),
      ],
    }),
    ...sectionOptions,
  ],
  preview: {
    select: { links: "links" },
    prepare: ({ links }) => ({
      title: "Linklijst",
      subtitle: `Sectie · Links (${links?.length ?? 0})`,
    }),
  },
});

export const sectionTypes = [
  heroHomeSection,
  headerCenteredSection,
  mediaSection,
  contentCenteredSection,
  richTextSection,
  featureGridSection,
  embedSection,
  werkwijzeSection,
  reviewsSection,
  projectenSection,
  faqSection,
  contactSection,
  dienstenSection,
  cardGridSection,
  regioSection,
  linksSection,
];

/** De union die `page.sections` gebruikt. */
export const SECTION_MEMBERS = sectionTypes.map((t) =>
  defineArrayMember({ type: t.name }),
);

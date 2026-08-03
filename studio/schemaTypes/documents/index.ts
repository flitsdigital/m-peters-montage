import { defineType, defineField, defineArrayMember } from "sanity";
import {
  DocumentIcon,
  ImagesIcon,
  DocumentTextIcon,
  StarIcon,
  TagIcon,
  CogIcon,
} from "@sanity/icons";
import { SECTION_MEMBERS } from "../sections";
import { richText, imageField } from "../shared/fields";

const seoFields = [
  defineField({
    name: "metaTitle",
    title: "SEO-titel",
    type: "string",
    group: "seo",
    description: "Wat er in het tabblad en in Google staat.",
    validation: (rule) => rule.max(70).warning("Houd het onder de 70 tekens."),
  }),
  defineField({
    name: "metaDescription",
    title: "SEO-omschrijving",
    type: "text",
    rows: 3,
    group: "seo",
    validation: (rule) => rule.max(170).warning("Houd het onder de 170 tekens."),
  }),
  defineField({ name: "ogImage", title: "Deelafbeelding", type: "image", group: "seo" }),
  defineField({
    name: "noindex",
    title: "Uitsluiten van Google",
    type: "boolean",
    group: "seo",
    initialValue: false,
  }),
];

export const page = defineType({
  name: "page",
  title: "Pagina",
  type: "document",
  icon: DocumentIcon,
  groups: [
    { name: "content", title: "Inhoud", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Titel",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Pad",
      type: "slug",
      group: "content",
      description:
        'Het pad zonder domein, bv. "kunststof-kozijnen/soorten". Gebruik "home" voor de homepage.',
      options: { source: "title", maxLength: 120, slugify: (input) => input },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "sections",
      title: "Secties",
      type: "array",
      group: "content",
      of: SECTION_MEMBERS,
    }),
    ...seoFields,
  ],
  preview: {
    select: { title: "title", slug: "slug.current" },
    prepare: ({ title, slug }) => ({
      title,
      subtitle: slug === "home" ? "/" : `/${slug}`,
    }),
  },
});

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  icon: ImagesIcon,
  groups: [
    { name: "content", title: "Inhoud", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Projecttitel",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Pad",
      type: "slug",
      group: "content",
      options: { source: "title", maxLength: 120 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Korte beschrijving",
      type: "text",
      rows: 3,
      group: "content",
    }),
    imageField("coverImage", "Hoofdfoto"),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "reference", to: [{ type: "tag" }] })],
    }),
    richText,
    defineField({
      name: "gallery",
      title: "Alle projectfoto's",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [defineField({ name: "alt", title: "Alt-tekst", type: "string" })],
        }),
      ],
      options: { layout: "grid" },
    }),
    defineField({
      name: "publishedAt",
      title: "Gepubliceerd op",
      type: "datetime",
      group: "content",
    }),
    ...seoFields,
  ],
  preview: {
    select: { title: "title", media: "coverImage", slug: "slug.current" },
    prepare: ({ title, media, slug }) => ({ title, subtitle: `/projecten/${slug}`, media }),
  },
});

export const blogPost = defineType({
  name: "blogPost",
  title: "Blog",
  type: "document",
  icon: DocumentTextIcon,
  groups: [
    { name: "content", title: "Inhoud", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Titel",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Pad",
      type: "slug",
      group: "content",
      options: { source: "title", maxLength: 120 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Samenvatting",
      type: "text",
      rows: 4,
      group: "content",
    }),
    imageField("mainImage", "Hoofdfoto"),
    defineField({
      name: "dienst",
      title: "Over welke dienst",
      type: "string",
      group: "content",
    }),
    richText,
    defineField({
      name: "publishedAt",
      title: "Gepubliceerd op",
      type: "datetime",
      group: "content",
    }),
    ...seoFields,
  ],
  preview: {
    select: { title: "title", media: "mainImage", slug: "slug.current" },
    prepare: ({ title, media, slug }) => ({ title, subtitle: `/blog/${slug}`, media }),
  },
});

export const review = defineType({
  name: "review",
  title: "Review",
  type: "document",
  icon: StarIcon,
  fields: [
    defineField({
      name: "name",
      title: "Naam",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "text",
      title: "Review",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Volgorde",
      type: "number",
      description: "Lager komt eerder in de slider.",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "text" },
  },
});

export const tag = defineType({
  name: "tag",
  title: "Tag",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      title: "Naam",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Pad",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "kind",
      title: "Soort",
      type: "string",
      description: "Plaatsnamen en diensten staan in dezelfde lijst; dit houdt ze uit elkaar.",
      options: {
        list: [
          { title: "Plaats", value: "plaats" },
          { title: "Dienst", value: "dienst" },
        ],
        layout: "radio",
      },
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "kind" },
  },
});

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site-instellingen",
  type: "document",
  icon: CogIcon,
  groups: [
    { name: "bedrijf", title: "Bedrijfsgegevens", default: true },
    { name: "navigatie", title: "Navigatie" },
    { name: "seo", title: "SEO & tracking" },
  ],
  fields: [
    defineField({ name: "name", title: "Bedrijfsnaam", type: "string", group: "bedrijf" }),
    defineField({ name: "email", title: "E-mailadres", type: "string", group: "bedrijf" }),
    defineField({
      name: "phoneDisplay",
      title: "Telefoonnummer (weergave)",
      type: "string",
      group: "bedrijf",
    }),
    defineField({
      name: "phoneHref",
      title: "Telefoonnummer (link)",
      type: "string",
      group: "bedrijf",
      description: 'Bijvoorbeeld "tel:0627104183".',
    }),
    defineField({
      name: "address",
      title: "Adres",
      type: "object",
      group: "bedrijf",
      fields: [
        defineField({ name: "street", title: "Straat en nummer", type: "string" }),
        defineField({ name: "postalCode", title: "Postcode", type: "string" }),
        defineField({ name: "city", title: "Plaats", type: "string" }),
        defineField({ name: "country", title: "Land", type: "string", initialValue: "NL" }),
      ],
    }),
    defineField({
      name: "geo",
      title: "Coördinaten",
      type: "object",
      group: "bedrijf",
      fields: [
        defineField({ name: "lat", title: "Breedtegraad", type: "number" }),
        defineField({ name: "lng", title: "Lengtegraad", type: "number" }),
      ],
    }),
    defineField({ name: "facebook", title: "Facebook-URL", type: "url", group: "bedrijf" }),
    defineField({
      name: "defaultDescription",
      title: "Standaard SEO-omschrijving",
      type: "text",
      rows: 3,
      group: "seo",
    }),
    defineField({ name: "ogImage", title: "Standaard deelafbeelding", type: "image", group: "seo" }),
    defineField({ name: "ga4", title: "Google Analytics ID", type: "string", group: "seo" }),
    defineField({ name: "clarity", title: "Microsoft Clarity ID", type: "string", group: "seo" }),
  ],
  preview: { prepare: () => ({ title: "Site-instellingen" }) },
});

export const documentTypes = [page, project, blogPost, review, tag, siteSettings];

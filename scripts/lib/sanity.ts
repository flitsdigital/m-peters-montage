import { createClient } from "@sanity/client";
import { JSDOM } from "jsdom";
import { htmlToBlocks } from "@portabletext/block-tools";
import { Schema } from "@sanity/schema";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import "dotenv/config";

/**
 * De migratiescripts lezen uit `_webflow_source/`. Die map is na de conversie
 * verwijderd; pak hem terug uit het zip-bestand als je opnieuw wilt migreren:
 *
 *   unzip michael-peters-montage.webflow.zip -d _webflow_source
 */
export const WEBFLOW_SOURCE = "_webflow_source";

export function requireWebflowSource() {
  if (!existsSync(WEBFLOW_SOURCE)) {
    console.error(
      `\n'${WEBFLOW_SOURCE}/' ontbreekt.\n` +
        `Pak het Webflow-export opnieuw uit:\n` +
        `  unzip michael-peters-montage.webflow.zip -d ${WEBFLOW_SOURCE}\n`,
    );
    process.exit(1);
  }
}

export const client = createClient({
  projectId: process.env.PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.PUBLIC_SANITY_DATASET ?? "production",
  token: process.env.SANITY_API_WRITE_TOKEN!,
  apiVersion: "2026-03-01",
  useCdn: false,
});

/* ------------------------------------------------------------------ blocks */

/**
 * Blok-schema dat overeenkomt met `richText` in de Studio. Nodig zodat
 * block-tools weet welke styles, lists, marks en annotaties geldig zijn —
 * alles daarbuiten wordt weggegooid.
 */
const blockSchema = Schema.compile({
  name: "default",
  types: [
    {
      name: "body",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "H4", value: "h4" },
            { title: "Quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Number", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                fields: [
                  { name: "href", type: "string" },
                  { name: "blank", type: "boolean" },
                ],
              },
            ],
          },
        },
      ],
    },
  ],
}).get("body");

/**
 * Interne links die in de Webflow-content naar routes wijzen die niet (meer)
 * bestaan. Zie ANALYSE.md §9.1.
 */
const LINK_FIXES: Record<string, string> = {
  "/diensten/kunststof-kozijnen": "/kunststof-kozijnen",
  "/diensten/zonwering": "/zonwering",
  "/kunststof-kozijnen/klazienaveen": "/kunststof-kozijnen/regio/klazienaveen",
  "/kunststof-kozijnen/emmen": "/kunststof-kozijnen/regio/emmen",
  "/kunststof-kozijnen/drenthe": "/kunststof-kozijnen/regio/drenthe",
  "/zonwering/zonwering-klazienaveen": "/zonwering/zonwering-klazienaveen",
};

export function fixHref(href: string): string {
  if (!href) return href;

  // Absolute URL's, mailto/tel en ankers blijven zoals ze zijn.
  if (/^(https?:|mailto:|tel:|#)/.test(href)) {
    // Interne absolute links naar het eigen domein wél omzetten naar een pad.
    const internal = href.match(/^https?:\/\/(?:www\.)?mpetersmontage\.nl(\/.*)?$/);
    if (!internal) return href;
    href = internal[1] || "/";
  }

  // "../../kunststof-kozijnen.html" → "/kunststof-kozijnen"
  const clean =
    "/" +
    href
      .replace(/^(\.\.\/|\.\/)+/, "")
      .replace(/^\//, "")
      .replace(/\.html$/, "");

  const normalised = clean === "/index" ? "/" : clean;
  return LINK_FIXES[normalised] ?? normalised;
}

/** HTML uit Webflow → Portable Text, met gerepareerde links. */
export function toPortableText(html: string) {
  if (!html?.trim()) return undefined;

  const blocks = htmlToBlocks(html, blockSchema, {
    parseHtml: (h) => new JSDOM(h).window.document,
  });

  // Links opschonen ná conversie: block-tools bewaart de href in markDefs.
  for (const block of blocks as any[]) {
    for (const def of block.markDefs ?? []) {
      if (def._type === "link" && typeof def.href === "string") {
        def.href = fixHref(def.href);
        if (/^https?:/.test(def.href)) def.blank = true;
      }
    }
  }

  return (blocks as any[]).filter(
    (b) => b._type !== "block" || b.children?.some((c: any) => c.text?.trim()),
  );
}

/* ------------------------------------------------------------------ assets */

const assetCache = new Map<string, string>();

/**
 * Downloadt een afbeelding (Webflow-CDN of lokaal pad) en uploadt hem naar
 * Sanity. Idempotent via een hash van de bron-URL in `source.id`, zodat
 * opnieuw draaien geen duplicaten oplevert.
 */
export async function uploadImage(url: string): Promise<string | undefined> {
  if (!url) return undefined;
  if (assetCache.has(url)) return assetCache.get(url);

  const sourceId = createHash("sha1").update(url).digest("hex");

  const existing = await client.fetch<{ _id: string } | null>(
    `*[_type == "sanity.imageAsset" && source.id == $sourceId][0]{_id}`,
    { sourceId },
  );
  if (existing?._id) {
    assetCache.set(url, existing._id);
    return existing._id;
  }

  let buffer: Buffer;
  if (url.startsWith("http")) {
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`  ! kon afbeelding niet ophalen (${response.status}): ${url}`);
      return undefined;
    }
    buffer = Buffer.from(await response.arrayBuffer());
  } else {
    // Lokaal pad uit het Webflow-export.
    if (!existsSync(url)) {
      console.warn(`  ! afbeelding niet gevonden: ${url}`);
      return undefined;
    }
    buffer = readFileSync(url);
  }

  const filename = decodeURIComponent(url.split("/").pop()!.split("?")[0]);
  const asset = await client.assets.upload("image", buffer, {
    filename,
    source: { name: "webflow", id: sourceId, url },
  });

  assetCache.set(url, asset._id);
  return asset._id;
}

/** Bouwt een image-veld met alt-tekst; `undefined` als de upload faalde. */
export async function imageValue(url: string | undefined, alt: string) {
  if (!url) return undefined;
  const assetId = await uploadImage(url);
  if (!assetId) return undefined;
  return {
    _type: "image",
    asset: { _type: "reference", _ref: assetId },
    alt,
  };
}

/* -------------------------------------------------------------- documents */

/**
 * Maakt of werkt een document bij op basis van type + slug. Sanity genereert
 * het `_id`; wij zoeken op slug zodat het script idempotent is.
 */
export async function upsertBySlug(type: string, slug: string, doc: Record<string, unknown>) {
  const existing = await client.fetch<{ _id: string } | null>(
    `*[_type == $type && slug.current == $slug][0]{_id}`,
    { type, slug },
  );

  const body = {
    _type: type,
    slug: { _type: "slug", current: slug },
    ...doc,
  };

  if (existing?._id) {
    await client.createOrReplace({ _id: existing._id, ...body } as any);
    return existing._id;
  }

  const created = await client.create(body as any);
  return created._id;
}

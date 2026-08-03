/**
 * Migreert de vier Webflow CSV-exports naar Sanity:
 * tags → reviews → projecten → blogs (tags eerst, want projecten verwijzen ernaar).
 *
 * Idempotent: draai zo vaak je wilt, documenten worden op slug bijgewerkt en
 * afbeeldingen worden hergebruikt op basis van hun bron-URL.
 *
 *   npx tsx scripts/migrate-cms.ts
 */
import { readFileSync } from "node:fs";
import { parse } from "csv-parse/sync";
import { client, toPortableText, imageValue, upsertBySlug } from "./lib/sanity";

const CSV_DIR = "/Users/jordiklavers/Downloads";
const FILES = {
  tags: "Michael Peters Montage - Projecten - Tags - 676e95cdf722ade1133d2c86.csv",
  reviews: "Michael Peters Montage - Reviews - 677e342665483fe5cf708ae0 (1).csv",
  projecten: "Michael Peters Montage - Projecten - 676e9469231497c67bac37b2 (1).csv",
  blogs: "Michael Peters Montage - Blogs - 67effabf6aff78843e91b211 (1).csv",
};

/** Tags die een dienst zijn; de rest is een plaatsnaam. */
const DIENST_TAGS = new Set([
  "kunststof-kozijnen",
  "verandas",
  "zonwering",
  "rolluiken",
  "glazen-schuifwanden",
  "overkapping",
  "tuinkamer",
]);

const read = (file: string) =>
  parse(readFileSync(`${CSV_DIR}/${file}`, "utf8"), {
    columns: true,
    skip_empty_lines: true,
  }) as Record<string, string>[];

const isPublished = (row: Record<string, string>) =>
  row["Archived"] !== "true" && row["Draft"] !== "true";

const toDate = (value: string) => (value ? new Date(value).toISOString() : undefined);

const splitList = (value: string) =>
  (value ?? "")
    .split(";")
    .map((v) => v.trim())
    .filter(Boolean);

async function migrateTags() {
  const rows = read(FILES.tags);
  const ids = new Map<string, string>();

  for (const row of rows) {
    const slug = row["Slug"];
    if (!slug) continue;
    const id = await upsertBySlug("tag", slug, {
      title: row["Name"],
      kind: DIENST_TAGS.has(slug) ? "dienst" : "plaats",
    });
    ids.set(slug, id);
    if (!isPublished(row)) console.log(`  · ${row["Name"]} (stond op draft — wel gemigreerd)`);
  }

  console.log(`Tags: ${ids.size}`);
  return ids;
}

async function migrateReviews() {
  const rows = read(FILES.reviews).filter(isPublished);

  for (const [index, row] of rows.entries()) {
    await upsertBySlug("review", row["Slug"], {
      name: row["Name"],
      text: row["Review Tekst"],
      order: index,
    });
  }

  console.log(`Reviews: ${rows.length}`);
}

async function migrateProjecten(tagIds: Map<string, string>) {
  const rows = read(FILES.projecten);
  let count = 0;
  let skipped = 0;

  for (const row of rows) {
    const slug = row["Slug"];
    if (!slug) continue;

    // "rolluiken" stond op draft in Webflow maar hoort wel op de site
    // (staat in de oude sitemap). Bewust meenemen als gepubliceerd.
    const KEEP_DRAFTS = new Set(["rolluiken"]);
    if (!isPublished(row) && !KEEP_DRAFTS.has(slug)) {
      console.log(`  · overgeslagen (draft): ${slug}`);
      skipped++;
      continue;
    }

    const title = row["✍️ Project Titel"] || row["Name"];
    const summary = row["✍️ Korte projectbeschrijving"];
    const cover = await imageValue(row["📸 Projectfoto"], title);

    const gallery = [];
    for (const [i, url] of splitList(row["📸 Alle projectfoto's"]).entries()) {
      const image = await imageValue(url, `${title} — foto ${i + 1}`);
      if (image) gallery.push({ ...image, _key: `foto-${i}` });
    }

    const tags = splitList(row["🔖 Tags"])
      .map((tagSlug) => tagIds.get(tagSlug))
      .filter(Boolean)
      .map((id, i) => ({ _type: "reference", _ref: id, _key: `tag-${i}` }));

    await upsertBySlug("project", slug, {
      title,
      summary,
      coverImage: cover,
      gallery,
      tags,
      body: toPortableText(row["✍️ Langere projectbeschrijving"]),
      publishedAt: toDate(row["Published On"] || row["Created On"]),
      metaTitle: `${title} | M. Peters Montage`,
      metaDescription: summary,
    });

    count++;
    console.log(`  ✓ ${slug}`);
  }

  console.log(`Projecten: ${count} gemigreerd, ${skipped} overgeslagen`);
}

async function migrateBlogs() {
  const rows = read(FILES.blogs).filter(isPublished);

  for (const row of rows) {
    const slug = row["Slug"];
    const title = row["Name"];
    const summary = row["Post Summary"];

    await upsertBySlug("blogPost", slug, {
      title,
      summary,
      mainImage: await imageValue(row["Main Image"], title),
      dienst: row["Dienst"] || undefined,
      body: toPortableText(row["Post Body"]),
      publishedAt: toDate(row["Published On"] || row["Created On"]),
      metaTitle: `${title} | M. Peters Montage`,
      metaDescription: summary?.slice(0, 165),
    });

    console.log(`  ✓ ${slug}`);
  }

  console.log(`Blogs: ${rows.length}`);
}

async function main() {
  console.log(`→ ${client.config().projectId}/${client.config().dataset}\n`);
  const tagIds = await migrateTags();
  await migrateReviews();
  await migrateProjecten(tagIds);
  await migrateBlogs();
  console.log("\nKlaar.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

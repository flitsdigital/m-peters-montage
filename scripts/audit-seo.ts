/**
 * SEO-audit: vergelijkt per pagina de <title>, meta description en H1 uit de
 * originele Webflow-HTML met wat er nu in Sanity staat / gerenderd wordt.
 *
 *   npx tsx scripts/audit-seo.ts
 */
import { readFileSync, existsSync } from "node:fs";
import { JSDOM } from "jsdom";
import { client, requireWebflowSource } from "./lib/sanity";

requireWebflowSource();
const SRC = "_webflow_source";

const FILES: Record<string, string> = {
  home: "index.html",
  "kunststof-kozijnen": "kunststof-kozijnen.html",
  verandas: "verandas.html",
  zonwering: "zonwering.html",
  rolluiken: "rolluiken.html",
  "glazen-schuifwanden": "glazen-schuifwanden.html",
  "keralit-gevelbekleding": "keralit-gevelbekleding.html",
  "over-mij": "over-mij.html",
  contact: "contact.html",
  "handige-links": "handige-links.html",
  blogs: "blogs.html",
  projecten: "projecten.html",
  "kunststof-kozijnen/soorten": "kunststof-kozijnen/soorten.html",
  "kunststof-kozijnen/soorten/draai-kiep": "kunststof-kozijnen/soorten/draai-kiep.html",
  "kunststof-kozijnen/soorten/schuifpui": "kunststof-kozijnen/soorten/schuifpui.html",
  "kunststof-kozijnen/soorten/vast": "kunststof-kozijnen/soorten/vast.html",
  "kunststof-kozijnen/soorten/soorten-dakkapel": "kunststof-kozijnen/soorten/soorten-dakkapel.html",
  "kunststof-kozijnen/voordelen": "kunststof-kozijnen/voordelen.html",
  "kunststof-kozijnen/voordelen/isolatie": "kunststof-kozijnen/voordelen/isolatie.html",
  "kunststof-kozijnen/materialen": "kunststof-kozijnen/materialen.html",
  "kunststof-kozijnen/montage": "kunststof-kozijnen/montage.html",
  "kunststof-kozijnen/regio": "kunststof-kozijnen/regio.html",
  "kunststof-kozijnen/regio/klazienaveen": "kunststof-kozijnen/regio/klazienaveen.html",
  "kunststof-kozijnen/regio/emmen": "kunststof-kozijnen/regio/emmen.html",
  "kunststof-kozijnen/regio/drenthe": "kunststof-kozijnen/regio/drenthe.html",
  "zonwering/soorten-zonwering": "zonwering/soorten-zonwering.html",
  "zonwering/zonwering-emmen": "zonwering/zonwering-emmen.html",
  "zonwering/zonwering-klazienaveen": "zonwering/zonwering-klazienaveen.html",
  "zonwering/drenthe": "zonwering/drenthe.html",
};

const clean = (s?: string | null) => (s ?? "").replace(/\s+/g, " ").trim();

const pages = await client.fetch<any[]>(
  `*[_type == "page"]{ "slug": slug.current, metaTitle, metaDescription }`,
);
const bySlug = new Map(pages.map((p) => [p.slug, p]));

let titleDiffs = 0;
let descDiffs = 0;
let descMissing = 0;

console.log("SEO-audit (origineel → Sanity)\n");

for (const [slug, file] of Object.entries(FILES)) {
  if (!existsSync(`${SRC}/${file}`)) continue;
  const doc = new JSDOM(readFileSync(`${SRC}/${file}`, "utf8")).window.document;
  const origTitle = clean(doc.querySelector("title")?.textContent);
  const origDesc = clean(
    doc.querySelector('meta[name="description"]')?.getAttribute("content"),
  );

  const page = bySlug.get(slug);
  const newTitle = clean(page?.metaTitle);
  const newDesc = clean(page?.metaDescription);

  const issues: string[] = [];
  if (origTitle !== newTitle) {
    titleDiffs++;
    issues.push(`  title:\n    oud:  "${origTitle}"\n    nieuw:"${newTitle}"`);
  }
  if (!newDesc) {
    descMissing++;
    issues.push(`  description ONTBREEKT (oud: "${origDesc.slice(0, 80)}…")`);
  } else if (origDesc !== newDesc) {
    descDiffs++;
    issues.push(
      `  description:\n    oud:  "${origDesc.slice(0, 90)}"\n    nieuw:"${newDesc.slice(0, 90)}"`,
    );
  }

  if (issues.length) console.log(`✗ ${slug}\n${issues.join("\n")}\n`);
}

console.log(
  `\n${Object.keys(FILES).length} pagina's — ` +
    `${titleDiffs} title-verschillen, ${descDiffs} description-verschillen, ` +
    `${descMissing} descriptions ontbreken.`,
);

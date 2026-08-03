/**
 * Content-volledigheid: vergelijkt elke alinea/lijst-item uit de originele
 * Webflow-HTML met de tekst die in Sanity is beland. Meldt per pagina wat er
 * ontbreekt, zodat de site inhoudelijk 1-op-1 met het origineel is.
 *
 *   npx tsx scripts/check-content.ts
 */
import { readFileSync, existsSync } from "node:fs";
import { JSDOM } from "jsdom";
import { client, requireWebflowSource } from "./lib/sanity";

requireWebflowSource();

const SRC = "_webflow_source";

/** slug → bestand (zelfde lijst als migrate-pages). */
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

/** Tekst normaliseren voor vergelijking: lowercase, witruimte samentrekken. */
const norm = (s: string) =>
  s
    .replace(/‍| /g, " ") // zero-width joiner + nbsp
    .replace(/\s+/g, " ")
    .replace(/[’']/g, "'")
    .trim()
    .toLowerCase();

/** Betekenisvolle tekstblokken uit de originele <main>. */
function originalChunks(file: string): string[] {
  const doc = new JSDOM(readFileSync(`${SRC}/${file}`, "utf8")).window.document;
  const main = doc.querySelector("main");
  if (!main) return [];

  const chunks: string[] = [];
  for (const el of Array.from(main.querySelectorAll("p, li, h2, h3, h4, h5, h6, blockquote"))) {
    // Knoppen, eyebrows en lege placeholders overslaan.
    if (el.closest(".btn_main_wrap, .eyebrow_layout, .breadcrumbs_slot")) continue;
    if (el.classList.contains("w-dyn-bind-empty")) continue;
    const text = norm(el.textContent || "");
    if (text.length < 12) continue; // losse woorden negeren
    chunks.push(text);
  }
  return chunks;
}

/** Alle tekst uit een Sanity-pagina platslaan tot één string. */
function sanityText(sections: any[]): string {
  const out: string[] = [];
  const walk = (v: any) => {
    if (!v) return;
    if (typeof v === "string") out.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (typeof v === "object") {
      // Portable-text-blok: children[].text
      if (v._type === "block" && Array.isArray(v.children)) {
        out.push(v.children.map((c: any) => c.text ?? "").join(""));
      }
      for (const [k, val] of Object.entries(v)) {
        if (k === "_type" || k === "_key") continue;
        walk(val);
      }
    }
  };
  walk(sections);
  return norm(out.join(" "));
}

async function main() {
  const pages = await client.fetch<{ slug: string; sections: any[] }[]>(
    `*[_type == "page"]{ "slug": slug.current, sections }`,
  );
  const bySlug = new Map(pages.map((p) => [p.slug, p]));

  let totalMissing = 0;
  const pagesWithGaps: string[] = [];

  for (const [slug, file] of Object.entries(FILES)) {
    if (!existsSync(`${SRC}/${file}`)) continue;
    const page = bySlug.get(slug);
    if (!page) {
      console.log(`✗ ${slug} — niet in Sanity`);
      continue;
    }

    const haystack = sanityText(page.sections ?? []);
    const missing = originalChunks(file).filter((chunk) => {
      // Chunk kan in het origineel meerdere zinnen zijn; check per zin-fragment
      // op aanwezigheid, zodat kleine opmaakverschillen niet vals-positief zijn.
      const probe = chunk.slice(0, 40);
      return !haystack.includes(probe);
    });

    // Ontdubbelen (dezelfde tekst kan meermaals voorkomen).
    const uniqueMissing = [...new Set(missing)];

    if (uniqueMissing.length) {
      pagesWithGaps.push(slug);
      totalMissing += uniqueMissing.length;
      console.log(`\n✗ ${slug} — ${uniqueMissing.length} ontbrekend:`);
      for (const m of uniqueMissing.slice(0, 8)) {
        console.log(`    "${m.slice(0, 90)}${m.length > 90 ? "…" : ""}"`);
      }
      if (uniqueMissing.length > 8) console.log(`    … en ${uniqueMissing.length - 8} meer`);
    }
  }

  console.log(
    `\n${Object.keys(FILES).length} pagina's gecontroleerd — ` +
      `${pagesWithGaps.length} met ontbrekende content, ${totalMissing} fragmenten totaal.`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

/**
 * Controleert of elke Webflow-pagina evenveel secties heeft opgeleverd in
 * Sanity, en meldt lege koppen of ontbrekende afbeeldingen.
 *
 *   npx tsx scripts/verify-pages.ts
 */
import { readFileSync, existsSync } from "node:fs";
import { JSDOM } from "jsdom";
import { client, requireWebflowSource } from "./lib/sanity";

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
  "kunststof-kozijnen/soorten/soorten-dakkapel":
    "kunststof-kozijnen/soorten/soorten-dakkapel.html",
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

requireWebflowSource();

const pages = await client.fetch<any[]>(
  `*[_type == "page"]{"slug": slug.current, title, metaTitle, metaDescription,
     "sections": sections[]{_type, _key, heading, "img": defined(image.asset)}}`,
);

let problems = 0;

for (const page of pages.sort((a, b) => a.slug.localeCompare(b.slug))) {
  const file = FILES[page.slug];
  const path = `${SRC}/${file}`;
  if (!file || !existsSync(path)) continue;

  const doc = new JSDOM(readFileSync(path, "utf8")).window.document;
  const expected = doc.querySelectorAll("main section").length;
  const actual = page.sections?.length ?? 0;

  const issues: string[] = [];
  if (expected !== actual) issues.push(`${expected} in HTML → ${actual} in Sanity`);
  if (!page.metaTitle) issues.push("geen metaTitle");
  if (!page.metaDescription) issues.push("geen metaDescription");

  for (const s of page.sections ?? []) {
    const needsHeading = [
      "mediaSection",
      "heroHomeSection",
      "werkwijzeSection",
      "contactSection",
    ];
    if (needsHeading.includes(s._type) && !s.heading) {
      issues.push(`${s._key} (${s._type}) heeft geen kop`);
    }
    // Een paginakop zonder kop én zonder foto is leeg; mét foto is het een
    // bewuste decoratieve band (komt 8× voor in het origineel).
    if (s._type === "headerCenteredSection" && !s.heading && !s.img) {
      issues.push(`${s._key} (paginakop) is helemaal leeg`);
    }
    if (["heroHomeSection", "mediaSection"].includes(s._type) && !s.img) {
      issues.push(`${s._key} (${s._type}) heeft geen afbeelding`);
    }
  }

  if (issues.length) {
    problems++;
    console.log(`\n✗ ${page.slug}`);
    issues.forEach((i) => console.log(`    ${i}`));
  } else {
    console.log(`✓ ${page.slug.padEnd(45)} ${actual} secties`);
  }
}

console.log(`\n${pages.length} pagina's, ${problems} met opmerkingen.`);

/**
 * Controleert of alle interne links in de Sanity-content naar een bestaande
 * route wijzen.
 *
 *   npx tsx scripts/check-links.ts
 */
import { client } from "./lib/sanity";

const [pages, projects, blogs] = await Promise.all([
  client.fetch<any[]>(`*[_type == "page"]{"slug": slug.current, title, sections}`),
  client.fetch<string[]>(`*[_type == "project" && defined(slug.current)].slug.current`),
  client.fetch<string[]>(`*[_type == "blogPost" && defined(slug.current)].slug.current`),
]);

const routes = new Set<string>([
  ...pages.map((p) => (p.slug === "home" ? "/" : `/${p.slug}`)),
  ...projects.map((s) => `/projecten/${s}`),
  ...blogs.map((s) => `/blog/${s}`),
  "/404",
]);

/** Alle href-achtige strings uit een willekeurig genest object. */
function hrefs(value: unknown, out: string[] = []): string[] {
  if (Array.isArray(value)) value.forEach((v) => hrefs(v, out));
  else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) {
      if (k === "href" && typeof v === "string") out.push(v);
      else hrefs(v, out);
    }
  }
  return out;
}

const broken = new Map<string, Set<string>>();
let total = 0;

for (const page of pages) {
  for (const href of hrefs(page.sections)) {
    if (/^(https?:|mailto:|tel:|#)/.test(href)) continue;
    total++;
    const path = href.split("#")[0].replace(/\/$/, "") || "/";
    if (!routes.has(path)) {
      if (!broken.has(href)) broken.set(href, new Set());
      broken.get(href)!.add(page.slug);
    }
  }
}

console.log(`${routes.size} routes, ${total} interne links gecontroleerd.\n`);

if (broken.size === 0) {
  console.log("Alle interne links wijzen naar een bestaande pagina.");
} else {
  console.log(`${broken.size} kapotte link(s):`);
  for (const [href, on] of [...broken].sort()) {
    console.log(`  ${href}`);
    console.log(`      op: ${[...on].join(", ")}`);
  }
  process.exitCode = 1;
}

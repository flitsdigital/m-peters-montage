/**
 * Zet de 27 statische Webflow-pagina's om in Sanity `page`-documenten met een
 * `sections[]`-array. Leest `_webflow_source/` en mapt elke <section> op het
 * bijbehorende sectieschema.
 *
 * Idempotent: pagina's worden op slug bijgewerkt, afbeeldingen hergebruikt.
 *
 *   npx tsx scripts/migrate-pages.ts [slug ...]
 */
import { readFileSync, existsSync } from "node:fs";
import { JSDOM } from "jsdom";
import {
  client,
  toPortableText,
  fixHref,
  imageValue,
  upsertBySlug,
  requireWebflowSource,
} from "./lib/sanity";

const SRC = "_webflow_source";

/** Webflow-bestand → route. */
const PAGES: { file: string; slug: string }[] = [
  { file: "index.html", slug: "home" },
  { file: "kunststof-kozijnen.html", slug: "kunststof-kozijnen" },
  { file: "verandas.html", slug: "verandas" },
  { file: "zonwering.html", slug: "zonwering" },
  { file: "rolluiken.html", slug: "rolluiken" },
  { file: "glazen-schuifwanden.html", slug: "glazen-schuifwanden" },
  { file: "keralit-gevelbekleding.html", slug: "keralit-gevelbekleding" },
  { file: "over-mij.html", slug: "over-mij" },
  { file: "contact.html", slug: "contact" },
  { file: "handige-links.html", slug: "handige-links" },
  { file: "blogs.html", slug: "blogs" },
  { file: "projecten.html", slug: "projecten" },
  { file: "kunststof-kozijnen/soorten.html", slug: "kunststof-kozijnen/soorten" },
  { file: "kunststof-kozijnen/soorten/draai-kiep.html", slug: "kunststof-kozijnen/soorten/draai-kiep" },
  { file: "kunststof-kozijnen/soorten/schuifpui.html", slug: "kunststof-kozijnen/soorten/schuifpui" },
  { file: "kunststof-kozijnen/soorten/vast.html", slug: "kunststof-kozijnen/soorten/vast" },
  { file: "kunststof-kozijnen/soorten/soorten-dakkapel.html", slug: "kunststof-kozijnen/soorten/soorten-dakkapel" },
  { file: "kunststof-kozijnen/voordelen.html", slug: "kunststof-kozijnen/voordelen" },
  { file: "kunststof-kozijnen/voordelen/isolatie.html", slug: "kunststof-kozijnen/voordelen/isolatie" },
  { file: "kunststof-kozijnen/materialen.html", slug: "kunststof-kozijnen/materialen" },
  { file: "kunststof-kozijnen/montage.html", slug: "kunststof-kozijnen/montage" },
  { file: "kunststof-kozijnen/regio.html", slug: "kunststof-kozijnen/regio" },
  { file: "kunststof-kozijnen/regio/klazienaveen.html", slug: "kunststof-kozijnen/regio/klazienaveen" },
  { file: "kunststof-kozijnen/regio/emmen.html", slug: "kunststof-kozijnen/regio/emmen" },
  { file: "kunststof-kozijnen/regio/drenthe.html", slug: "kunststof-kozijnen/regio/drenthe" },
  { file: "zonwering/soorten-zonwering.html", slug: "zonwering/soorten-zonwering" },
  { file: "zonwering/zonwering-emmen.html", slug: "zonwering/zonwering-emmen" },
  { file: "zonwering/zonwering-klazienaveen.html", slug: "zonwering/zonwering-klazienaveen" },
  { file: "zonwering/drenthe.html", slug: "zonwering/drenthe" },
];

/* ------------------------------------------------------------------ helpers */

const text = (el: Element | null | undefined) => el?.textContent?.trim() || undefined;

/** Eerste kop die tekst bevat, in volgorde van voorkeur. */
const heading = (scope: Element | null | undefined, tags = ["h2", "h1", "h3"]) => {
  for (const tag of tags) {
    const value = text(scope?.querySelector(tag));
    if (value) return value;
  }
  return undefined;
};

/** Eyebrow-tekst → het icoon dat het origineel gebruikt. */
const EYEBROW_ICONS: Record<string, string> = {
  CONTACT: "eyebrow-contact",
  DIENSTEN: "eyebrow-diensten",
  REVIEWS: "eyebrow-reviews",
};

function readEyebrow(scope: Element | null) {
  const el = scope?.querySelector(".eyebrow_layout");
  if (!el) return undefined;
  const label = text(el.querySelector(".eyebrow_text"));
  if (!label) return undefined;
  return {
    text: label,
    icon: EYEBROW_ICONS[label.toUpperCase()] ?? "eyebrow-default",
    variant: el.classList.contains("is-secondary") ? "secondary" : "primary",
  };
}

function readCta(scope: Element | null) {
  const button = scope?.querySelector(".btn_main_wrap");
  if (!button) return undefined;
  const label = text(button.querySelector(".btn_main_text"));
  const href = button.querySelector<HTMLAnchorElement>(".g_clickable_link")?.getAttribute("href");
  if (!label || !href || href === "#") return undefined;
  return { label, href: fixHref(href) };
}

/** Eerste <img> in een sectie → lokaal pad in het export. */
function readImageSrc(scope: Element | null): string | undefined {
  const src = scope?.querySelector("img")?.getAttribute("src");
  if (!src || src.startsWith("http")) return undefined;
  const clean = decodeURIComponent(src.replace(/^(\.\.\/)+/, ""));
  const path = `${SRC}/${clean}`;
  return existsSync(path) ? path : undefined;
}

function readOverlay(scope: Element | null) {
  const style = scope?.querySelector(".g_visual_overlay")?.getAttribute("style");
  const match = style?.match(/opacity:\s*(\d+)%/);
  return match ? Number(match[1]) / 100 : undefined;
}

/** Alle <p>/<h*>/<ul> in een blok → Portable Text, kop uitgezonderd. */
function readBody(scope: Element | null, skip: string[] = ["h1", "h2", "h3"]) {
  if (!scope) return undefined;
  const parts: string[] = [];
  for (const child of Array.from(scope.children)) {
    const tag = child.tagName.toLowerCase();
    if (skip.includes(tag)) continue;
    if (child.classList.contains("eyebrow_layout")) continue;
    if (child.querySelector?.(".btn_main_wrap")) continue;
    // Losse tekst-elementen direct in de wrapper.
    if (tag === "p" || tag === "ul" || tag === "ol" || /^h[1-6]$/.test(tag)) {
      parts.push(child.outerHTML);
    }
    // Rich-text-container — Webflow gebruikt zowel .u-rich-text als .w-richtext.
    else if (
      child.classList.contains("u-rich-text") ||
      child.classList.contains("w-richtext")
    ) {
      parts.push(child.innerHTML);
    }
    // Anders: pak eventuele rich-text die dieper genest zit (bv. in een
    // extra div-laag), zodat er nooit stilletjes tekst wegvalt.
    else {
      const rich = child.querySelector(".u-rich-text, .w-richtext");
      if (rich) parts.push(rich.innerHTML);
    }
  }
  return parts.length ? toPortableText(parts.join("\n")) : undefined;
}

const key = (prefix: string, i: number) => `${prefix}-${i}`;

/* --------------------------------------------------------------- extractors */

async function extractSection(section: Element, index: number): Promise<any | undefined> {
  const cls = section.className;
  const _key = key("s", index);
  const container = section.querySelector(".u-container, .u-container-small");
  const paddingTop = container?.getAttribute("data-padding-top") ?? "main";
  const paddingBottom = container?.getAttribute("data-padding-bottom") ?? "main";

  /* ---- hero (homepage) ---- */
  if (cls.includes("section_home-hero")) {
    const wrap = section.querySelector(".home_hero_heading-wrap");
    return {
      _key,
      _type: "heroHomeSection",
      heading: text(wrap?.querySelector("h1")),
      body: text(wrap?.querySelector(".home_hero-paragraph-wrap p")),
      rating: text(wrap?.querySelector(".u-hflex-left-center .u-mt-1")),
      image: await imageValue(
        readImageSrc(section),
        section.querySelector("img")?.getAttribute("alt") ?? "",
      ),
      overlay: readOverlay(section),
      cta: readCta(wrap),
    };
  }

  /* ---- paginakop ---- */
  if (cls.includes("section_header-centered") || cls.includes("section_content-header")) {
    const plain = cls.includes("section_content-header");
    const h1 = section.querySelector("h1");
    const crumbs = Array.from(section.querySelectorAll(".breadcrumbs_item")).map((a, i) => ({
      _key: key("c", i),
      label: text(a),
      href: fixHref(a.getAttribute("href") ?? "/"),
    }));
    const alt = section.querySelector("img")?.getAttribute("alt") ?? "";
    return {
      _key,
      _type: "headerCenteredSection",
      variant: plain ? "plain" : "hero",
      heading: heading(section, ["h1", "h2"]),
      headingStyle: h1?.classList.contains("u-text-style-h2") ? "h2" : "h1",
      body: text(section.querySelector(".u-text-align-center p")),
      eyebrow: readEyebrow(section),
      breadcrumbs: crumbs.length ? crumbs : undefined,
      image: plain ? undefined : await imageValue(readImageSrc(section), alt),
      overlay: readOverlay(section),
      showContactItems: Boolean(section.querySelector(".contact_items-wrap")),
      cta: readCta(section),
    };
  }

  /* ---- section_content zonder foto: voordelen-grid of tekstblok ---- */
  if (cls.includes("section_content") && !cls.includes("centered") && !cls.includes("header")) {
    const imgWrapCheck = section.querySelector(".content_img-wrap");
    const secondary = Boolean(section.querySelector(".background_secondary"));

    if (!imgWrapCheck) {
      const cards = Array.from(section.querySelectorAll(".content_waarom-item"));

      if (cards.length) {
        const header = section.querySelector(".content_content-wrapper");
        return {
          _key,
          _type: "featureGridSection",
          heading: heading(header),
          intro: text(header?.querySelector("p")),
          eyebrow: readEyebrow(header),
          items: cards.map((card, i) => ({
            _key: key("f", i),
            title: text(card.querySelector("h3")),
            text: text(card.querySelector("p")),
            width: card.parentElement?.classList.contains("u-column-6") ? "half" : "third",
          })),
          background: secondary || undefined,
          paddingTop,
          paddingBottom,
        };
      }

      // Alleen rich text (soms met een knop eronder). Een losse <h2>/<h3>
      // naast de rich-text-div (bv. "Waarom zonwering in Emmen?") staat niet
      // ín .w-richtext; die nemen we mee bovenaan zodat geen kop wegvalt.
      const richWrap = section.querySelector(".content_content-wrapper") ?? section;
      const rich = richWrap.querySelector(".u-rich-text, .w-richtext");
      const loseHeading = Array.from(richWrap.children).find(
        (c) => /^h[2-4]$/.test(c.tagName.toLowerCase()),
      );
      const html = [loseHeading?.outerHTML, rich?.innerHTML].filter(Boolean).join("\n");
      const body = toPortableText(html);
      if (!body?.length) return undefined;
      return {
        _key,
        _type: "richTextSection",
        body,
        cta: readCta(section),
        align: section.querySelector(".u-column-centered") ? "center" : "indent",
        background: secondary || undefined,
        paddingTop,
        paddingBottom,
      };
    }

    // De tekstkolom heet niet overal hetzelfde (over-mij gebruikt
    // over_header-heading); pak anders de eerste grid-kolom die niet de foto is.
    const wrapper =
      section.querySelector(".content_content-wrapper, .over_header-heading") ??
      Array.from(section.querySelectorAll(".content_layout > *")).find(
        (el) => !el.classList.contains("content_img-wrap"),
      ) ??
      null;
    const imgWrap = imgWrapCheck;
    const alt = imgWrap?.querySelector("img")?.getAttribute("alt") ?? "";
    const image = await imageValue(readImageSrc(imgWrap), alt);
    if (!image) return undefined;
    return {
      _key,
      _type: "mediaSection",
      variant: "content",
      heading: heading(wrapper),
      body: readBody(wrapper),
      eyebrow: readEyebrow(wrapper),
      image,
      cta: readCta(wrapper),
      zoom: Boolean(imgWrap?.hasAttribute("data-img-container")),
      showSocials: Boolean(wrapper?.querySelector(".over_socials-wrap")) || undefined,
      background: secondary || undefined,
      paddingTop,
      paddingBottom,
    };
  }

  if (cls.includes("section_over")) {
    const wrapper = section.querySelector(".over_content");
    const imgWrap = section.querySelector(".over_img-wrap");
    const alt = imgWrap?.querySelector("img")?.getAttribute("alt") ?? "";
    const image = await imageValue(readImageSrc(imgWrap), alt);
    if (!image) return undefined;
    return {
      _key,
      _type: "mediaSection",
      variant: "over",
      heading: heading(wrapper),
      body: readBody(wrapper),
      eyebrow: readEyebrow(wrapper),
      image,
      cta: readCta(wrapper),
      zoom: Boolean(imgWrap?.querySelector("[data-img-container]")),
      paddingTop,
      paddingBottom,
    };
  }

  if (cls.includes("section_content-centered")) {
    const wrapper = section.querySelector(".u-column-centered");
    return {
      _key,
      _type: "contentCenteredSection",
      heading: heading(wrapper),
      body: readBody(wrapper),
      eyebrow: readEyebrow(wrapper),
      cta: readCta(wrapper),
      paddingTop,
      paddingBottom,
    };
  }

  /* ---- tekstblok ---- */
  if (cls.includes("section_rich-text")) {
    const rich = section.querySelector(".u-rich-text, .w-richtext");
    const body = toPortableText(rich?.innerHTML ?? "");
    if (!body?.length) return undefined;
    return {
      _key,
      _type: "richTextSection",
      body,
      cta: readCta(section),
      align: section.querySelector(".u-column-centered") ? "center" : "indent",
      background: section.querySelector(".background_secondary") ? true : undefined,
      paddingTop,
      paddingBottom,
    };
  }

  /* ---- werkwijze ---- */
  if (cls.includes("section_werkwijze")) {
    const header = section.querySelector(".werkwijze_heading");
    return {
      _key,
      _type: "werkwijzeSection",
      heading: heading(header),
      intro: text(section.querySelector(".werkwijze_header-layout > p")),
      eyebrow: readEyebrow(header),
      steps: Array.from(section.querySelectorAll(".werkwijze_item")).map((item, i) => ({
        _key: key("step", i),
        title: text(item.querySelector("h3")),
        text: text(item.querySelector("p")),
      })),
      paddingTop,
      paddingBottom,
    };
  }

  /* ---- reviews ---- */
  if (cls.includes("section_reviews")) {
    const header = section.querySelector(".reviews_heading");
    return {
      _key,
      _type: "reviewsSection",
      heading: heading(header),
      intro: text(section.querySelector(".reviews_heading-layout > p")),
      eyebrow: readEyebrow(header),
    };
  }

  /* ---- projecten ---- */
  if (cls.includes("section_projecten")) {
    const header = section.querySelector(".projecten_header");
    return {
      _key,
      _type: "projectenSection",
      heading: heading(header),
      intro: text(header?.querySelector("p")),
      eyebrow: readEyebrow(header),
      theme: section.getAttribute("data-theme") ?? "inherit",
    };
  }

  /* ---- faq ---- */
  if (cls.includes("section_faq")) {
    const items = Array.from(section.querySelectorAll(".faq_item")).map((item, i) => ({
      _key: key("faq", i),
      // De vraag is het eerste kind van .faq_title (soms een <div>, soms een
      // <h3>); de tweede is altijd .faq_title-icon.
      question: text(item.querySelector(".faq_title > :not(.faq_title-icon)")),
      answer: toPortableText(item.querySelector(".faq_paragraph")?.innerHTML ?? ""),
    }));
    return {
      _key,
      _type: "faqSection",
      heading: heading(section),
      eyebrow: readEyebrow(section),
      items,
      paddingTop,
      paddingBottom,
    };
  }

  /* ---- contact ---- */
  if (cls.includes("section_contact")) {
    const content = section.querySelector(".contact_content");
    return {
      _key,
      _type: "contactSection",
      heading: heading(content),
      body: readBody(content),
      eyebrow: readEyebrow(content),
      formHeading: text(section.querySelector(".contact_component h3")),
    };
  }

  /* ---- diensten ---- */
  if (cls.includes("section_diensten")) {
    const header = section.querySelector(".over_content");
    const items = [];
    for (const [i, card] of Array.from(section.querySelectorAll(".diensten_item")).entries()) {
      const alt = card.querySelector("img")?.getAttribute("alt") ?? "";
      const image = await imageValue(readImageSrc(card), alt);
      if (!image) continue;
      items.push({
        _key: key("dienst", i),
        title: text(card.querySelector("h3")),
        text: text(card.querySelector("p")),
        href: fixHref(card.getAttribute("href") ?? "#"),
        image,
      });
    }
    return {
      _key,
      _type: "dienstenSection",
      heading: heading(header),
      body: readBody(header),
      eyebrow: readEyebrow(header),
      items,
    };
  }

  /* ---- overzicht blogs/projecten ---- */
  if (cls.includes("section_blog-items")) {
    const heading = text(section.querySelector("h1"));
    return {
      _key,
      _type: "cardGridSection",
      source: heading?.toLowerCase().includes("project") ? "project" : "blog",
      heading,
      background: cls.includes("is-secondary") || undefined,
      paddingTop,
      paddingBottom,
    };
  }

  /* ---- regio's ---- */
  if (cls.includes("section_regio")) {
    // In Webflow een CMS-lijst; er is geen CSV-export van die collectie.
    // De drie regiopagina's bestaan wel statisch — die gebruiken we.
    const regios = [
      { title: "Klazienaveen", slug: "klazienaveen" },
      { title: "Emmen", slug: "emmen" },
      { title: "Drenthe", slug: "drenthe" },
    ];
    const items = [];
    for (const [i, regio] of regios.entries()) {
      const page = `${SRC}/kunststof-kozijnen/regio/${regio.slug}.html`;
      if (!existsSync(page)) continue;
      const doc = new JSDOM(readFileSync(page, "utf8")).window.document;
      const header = doc.querySelector(".section_header-centered");
      const alt = header?.querySelector("img")?.getAttribute("alt") ?? regio.title;
      const image = await imageValue(readImageSrc(header), alt);
      if (!image) continue;
      items.push({
        _key: key("regio", i),
        title: regio.title,
        href: `/kunststof-kozijnen/regio/${regio.slug}`,
        image,
      });
    }
    return { _key, _type: "regioSection", items, paddingTop: "none", paddingBottom };
  }

  /* ---- externe widget (w-embed) ---- */
  const embed = section.querySelector(".w-embed");
  if (embed && !cls) {
    return {
      _key,
      _type: "embedSection",
      html: embed.innerHTML.trim(),
      paddingTop,
      paddingBottom,
    };
  }

  /* ---- sectie zonder class: losse rich text ---- */
  if (!cls) {
    const rich = section.querySelector(".u-rich-text, .w-richtext");
    const body = toPortableText(
      Array.from(section.querySelectorAll(".w-richtext, .u-rich-text"))
        .map((el) => el.innerHTML)
        .join("\n"),
    );
    if (!rich || !body?.length) return undefined;
    return { _key, _type: "richTextSection", body, paddingTop, paddingBottom };
  }

  /* ---- linklijst ---- */
  if (cls.includes("section_links")) {
    return {
      _key,
      _type: "linksSection",
      links: Array.from(section.querySelectorAll(".links_wrap a")).map((a, i) => ({
        _key: key("link", i),
        label: text(a),
        href: a.getAttribute("href"),
      })),
      paddingTop,
      paddingBottom,
    };
  }

  return undefined;
}

/* -------------------------------------------------------------------- main */

async function migratePage({ file, slug }: { file: string; slug: string }) {
  const path = `${SRC}/${file}`;
  if (!existsSync(path)) {
    console.warn(`  ! ontbreekt: ${file}`);
    return;
  }

  const doc = new JSDOM(readFileSync(path, "utf8")).window.document;
  const main = doc.querySelector("main");
  if (!main) return;

  const sections = [];
  for (const [i, el] of Array.from(main.querySelectorAll("section")).entries()) {
    const section = await extractSection(el, i);
    if (section) sections.push(section);
  }

  const metaTitle = text(doc.querySelector("title"));
  const metaDescription = doc
    .querySelector('meta[name="description"]')
    ?.getAttribute("content");

  await upsertBySlug("page", slug, {
    title: metaTitle?.split("|")[0].trim() || slug,
    sections,
    metaTitle,
    metaDescription,
  });

  console.log(`  ✓ ${slug.padEnd(45)} ${sections.length} secties`);
}

async function main() {
  requireWebflowSource();

  const only = process.argv.slice(2);
  const pages = only.length ? PAGES.filter((p) => only.includes(p.slug)) : PAGES;

  console.log(`→ ${client.config().projectId}/${client.config().dataset}\n`);
  for (const page of pages) await migratePage(page);
  console.log(`\n${pages.length} pagina's.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

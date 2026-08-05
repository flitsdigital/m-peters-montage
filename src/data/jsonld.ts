/**
 * JSON-LD-bouwers voor detailpagina's. LocalBusiness zit in BaseLayout;
 * hier de per-pagina schema's (Article op blogs/projecten, kruimelpad).
 */
import { SITE } from "./site";

const abs = (href: string) => new URL(href, SITE.url).href.replace(/\/$/, "");

export function breadcrumbLd(items: { label: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      item: abs(c.href),
    })),
  };
}

export function articleLd(a: {
  title: string;
  description?: string;
  image?: string;
  datePublished?: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    ...(a.description && { description: a.description }),
    ...(a.image && { image: a.image }),
    ...(a.datePublished && { datePublished: a.datePublished }),
    mainEntityOfPage: abs(a.path),
    author: { "@type": "Person", name: SITE.name },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      logo: { "@type": "ImageObject", url: SITE.ogImage },
    },
  };
}

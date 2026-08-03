import { sanityClient } from "sanity:client";
import { defineQuery } from "groq";

const fetch$ = <T>(query: string, params: Record<string, unknown> = {}) =>
  sanityClient.fetch<T>(query, params);

/**
 * Eén projectie voor alle sectietypes. Alles wat een sectie nodig heeft komt
 * inline mee, zodat de renderer geen extra queries hoeft te doen.
 *
 * Reviews en projecten zijn de uitzondering: die secties tonen documenten uit
 * de CMS in plaats van inline content, dus die halen we hier op.
 */
const SECTIONS = `
  sections[]{
    _key,
    _type,
    ...,
    cta{label, href},
    eyebrow{text, icon, variant},

    _type == "reviewsSection" => {
      "reviews": *[_type == "review"] | order(order asc, name asc){_id, name, text}
    },

    _type == "projectenSection" => {
      "projects": *[
        _type == "project"
        && defined(slug.current)
        && (!defined(^.filterTag) || ^.filterTag._ref in tags[]._ref)
      ] | order(publishedAt desc)[0...12]{
        _id, title, summary, "slug": slug.current, coverImage,
        "tags": tags[]->title
      }
    },

    _type == "cardGridSection" => {
      "items": select(
        source == "project" =>
          *[_type == "project" && defined(slug.current)] | order(publishedAt desc){
            _id, title, summary, "slug": slug.current, "image": coverImage,
            "tags": tags[]->title
          },
        *[_type == "blogPost" && defined(slug.current)] | order(publishedAt desc){
          _id, title, summary, "slug": slug.current, "image": mainImage
        }
      )
    }
  }
`;

const SEO = `metaTitle, metaDescription, ogImage, noindex`;

export const PAGE_QUERY = defineQuery(`
  *[_type == "page" && slug.current == $slug][0]{
    _id, _type, title, ${SEO}, ${SECTIONS}
  }
`);

export const PAGE_SLUGS_QUERY = defineQuery(`
  *[_type == "page" && defined(slug.current)]{"slug": slug.current}
`);

export const PROJECT_QUERY = defineQuery(`
  *[_type == "project" && slug.current == $slug][0]{
    _id, _type, title, summary, "slug": slug.current,
    coverImage, gallery, body, publishedAt,
    "tags": tags[]->title,
    ${SEO},
    "related": *[_type == "project" && slug.current != $slug] | order(publishedAt desc)[0...8]{
      _id, title, summary, "slug": slug.current, coverImage, "tags": tags[]->title
    }
  }
`);

export const PROJECT_SLUGS_QUERY = defineQuery(`
  *[_type == "project" && defined(slug.current)]{"slug": slug.current}
`);

export const BLOG_QUERY = defineQuery(`
  *[_type == "blogPost" && slug.current == $slug][0]{
    _id, _type, title, summary, "slug": slug.current,
    mainImage, body, publishedAt, dienst,
    ${SEO},
    "related": *[_type == "blogPost" && slug.current != $slug] | order(publishedAt desc)[0...3]{
      _id, title, summary, "slug": slug.current, "image": mainImage
    }
  }
`);

export const BLOG_SLUGS_QUERY = defineQuery(`
  *[_type == "blogPost" && defined(slug.current)]{"slug": slug.current}
`);

export const SETTINGS_QUERY = defineQuery(`*[_type == "siteSettings"][0]`);

/** De contactsectie staat onder elke project- en blogpagina. */
export const CONTACT_SECTION_QUERY = defineQuery(`
  *[_type == "page" && slug.current == "contact"][0]
    .sections[_type == "contactSection"][0]{_key, _type, ..., eyebrow{text, icon, variant}}
`);

export const fetchPage = (slug: string) => fetch$<any>(PAGE_QUERY, { slug });
export const fetchProject = (slug: string) => fetch$<any>(PROJECT_QUERY, { slug });
export const fetchBlog = (slug: string) => fetch$<any>(BLOG_QUERY, { slug });
export const fetchContactSection = () => fetch$<any>(CONTACT_SECTION_QUERY);
export const fetchSettings = () => fetch$<any>(SETTINGS_QUERY);

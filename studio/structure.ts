import type { StructureResolver } from "sanity/structure";
import { CogIcon } from "@sanity/icons";

/**
 * Site-instellingen is een singleton; de rest zijn gewone lijsten.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Inhoud")
    .items([
      S.listItem()
        .title("Site-instellingen")
        .icon(CogIcon)
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
      S.divider(),
      S.documentTypeListItem("page").title("Pagina's"),
      S.documentTypeListItem("project").title("Projecten"),
      S.documentTypeListItem("blogPost").title("Blogs"),
      S.divider(),
      S.documentTypeListItem("review").title("Reviews"),
      S.documentTypeListItem("tag").title("Tags"),
    ]);

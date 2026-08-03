import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";
import { structure } from "./structure";

export default defineConfig({
  name: "default",
  title: "M. Peters Montage",
  projectId: "r6eh5fne",
  dataset: "production",

  plugins: [
    structureTool({ structure }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
    // Site-instellingen mag maar één keer bestaan.
    templates: (prev) => prev.filter((t) => t.schemaType !== "siteSettings"),
  },

  document: {
    actions: (prev, { schemaType }) =>
      schemaType === "siteSettings"
        ? prev.filter(({ action }) => action !== "unpublish" && action !== "delete")
        : prev,
  },
});

// @ts-check
import { defineConfig } from "astro/config";
import { loadEnv } from "vite";
import vercel from "@astrojs/vercel";
import sitemap from "@astrojs/sitemap";
import sanity from "@sanity/astro";

const { PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET } = loadEnv(
  process.env.NODE_ENV ?? "development",
  process.cwd(),
  "",
);

/** Interne review-routes: wel in de repo, niet op de live site. */
export const DEV_ONLY = ["styleguide", "components", "sections"];

export default defineConfig({
  site: "https://www.mpetersmontage.nl",
  server: { port: Number(process.env.PORT) || 4321 },

  integrations: [
    sanity({
      projectId: PUBLIC_SANITY_PROJECT_ID,
      dataset: PUBLIC_SANITY_DATASET,
      apiVersion: "2026-03-01",
      useCdn: false,
    }),
    sitemap({
      // Review-routes horen niet in de sitemap.
      filter: (page) => !DEV_ONLY.some((r) => page.includes(`/${r}`)),
    }),
  ],

  // Statisch; alleen /api/contact draait als serverless functie op Vercel.
  // De review-routes worden na de build gestript (scripts/strip-dev-pages.mjs).
  adapter: vercel(),
  build: { format: "directory" },
});

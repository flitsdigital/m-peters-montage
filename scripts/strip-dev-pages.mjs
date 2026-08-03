/**
 * Verwijdert de interne review-routes uit de Vercel-build.
 *
 * Draait als postbuild-stap (na de Vercel-adapter, zie package.json). Alleen
 * actief op Vercel (`VERCEL=1`); lokaal blijven de pagina's staan zodat je ze
 * kunt bekijken. De bronbestanden blijven altijd in de repo.
 */
import { rmSync, existsSync } from "node:fs";

const DEV_ONLY = ["styleguide", "components", "sections"];

if (!process.env.VERCEL) {
  console.log("[strip-dev-pages] niet op Vercel — review-routes blijven staan");
  process.exit(0);
}

// De Vercel-adapter schrijft statische output naar .vercel/output/static/.
const roots = [".vercel/output/static", "dist/client", "dist"];

for (const route of DEV_ONLY) {
  for (const root of roots) {
    const dir = `${root}/${route}`;
    if (existsSync(dir)) {
      rmSync(dir, { recursive: true, force: true });
      console.log(`[strip-dev-pages] verwijderd: ${dir}`);
    }
  }
}

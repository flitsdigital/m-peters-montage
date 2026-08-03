/**
 * Vult de siteSettings-singleton met de gegevens uit `src/data/site.ts`.
 *
 *   npx tsx scripts/migrate-settings.ts
 */
import { client, uploadImage } from "./lib/sanity";
import { SITE } from "../src/data/site";

async function main() {
  const ogAsset = await uploadImage(SITE.ogImage);

  await client.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    name: SITE.name,
    email: SITE.email,
    phoneDisplay: SITE.phoneDisplay,
    phoneHref: SITE.phoneHref,
    address: { ...SITE.address },
    geo: { ...SITE.geo },
    facebook: SITE.social.facebook,
    defaultDescription: SITE.description,
    ...(ogAsset
      ? { ogImage: { _type: "image", asset: { _type: "reference", _ref: ogAsset } } }
      : {}),
    ga4: SITE.analytics.ga4,
    clarity: SITE.analytics.clarity,
  } as any);

  console.log("Site-instellingen bijgewerkt.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

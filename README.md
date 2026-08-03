# M. Peters Montage

Astro-site met Sanity als CMS, omgezet vanaf een Webflow-export.

## Structuur

```
src/
  styles/            tokens.css · themes.css · base.css · fonts.css
  design-system/     tokens.ts (token-registry voor de styleguide)
  layouts/           BaseLayout.astro · PageLayout.astro
  components/
    atoms/           14 bouwstenen (Button, FormField, Icon, …)
    molecules/       12 combinaties (Slider, ContactForm, kaarten, …)
    sections/        20 secties + SectionShell
  sanity/            client · queries · SectionRenderer · PortableText
  pages/             [...slug] · projecten/[slug] · blog/[slug] · 404 · api/contact
  data/              site.ts · navigation.ts
studio/              Sanity Studio (los project)
scripts/             migratie en controles
```

## Wat er nog te doen is

- **`N8N_CONTACT_WEBHOOK_URL`** invullen in `.env` — zonder die URL geeft
  `/api/contact` een nette foutmelding terug in plaats van te versturen.
- **`/projecten/rolluiken`** staat op *draft* in Sanity maar wel in de oude
  sitemap. Publiceren of een redirect instellen.
- **Geo-coördinaten** in `siteSettings` horen nog bij het oude adres
  (Zuiderkruis 19); opnieuw bepalen voor Lavas 10.

## Ontwikkelen

```bash
npm run dev
```

Studio draaien (los, op poort 3333):

```bash
npm run studio
```

## Design system

Drie routes met levende documentatie, `noindex` en zonder analytics:

| Route | Wat |
|---|---|
| `/styleguide` | Tokens, themes, typografie, spacing, grid |
| `/components` | Alle atoms in hun varianten |
| `/sections` | Alle secties met voorbeeldcontent |

## Content

Alles staat in Sanity: pagina's zijn een `sections[]`-array die de
Astro-secties uit `src/components/sections/` aanstuurt. Een sectieschema
bevat alleen inhoud plus drie opmaak-hooks (`theme`, `paddingTop`,
`paddingBottom`) — nooit styling.

| Documenttype | Route |
|---|---|
| `page` | `/` en alle inhoudspagina's |
| `project` | `/projecten/{slug}` |
| `blogPost` | `/blog/{slug}` ⚠️ enkelvoud; overzicht staat op `/blogs` |
| `review` | geen eigen route |
| `tag` | geen eigen route |
| `siteSettings` | singleton |

## Migratie

Eenmalig gedraaid vanaf de Webflow-export en de CSV's. Idempotent, dus
opnieuw draaien kan altijd — maar de scripts lezen uit `_webflow_source/`,
en die map is na de conversie verwijderd. Eerst terugzetten:

```bash
unzip ~/Downloads/michael-peters-montage.webflow.zip -d _webflow_source
```

```bash
npm run migrate:cms       # tags, reviews, projecten, blogs uit de CSV's
npm run migrate:pages     # de 29 statische pagina's → page-documenten
npm run migrate:settings  # siteSettings-singleton
```

Controles:

```bash
npm run verify:pages      # sectie-aantallen tegen de Webflow-HTML
npm run check:links       # interne links tegen bestaande routes
```

## Omgevingsvariabelen

Zie `.env.example`. `SANITY_API_WRITE_TOKEN` is alleen nodig voor de
migratiescripts; `N8N_CONTACT_WEBHOOK_URL` voor het contactformulier.

## Bouwen

Statisch, met één serverless functie (`/api/contact`) via de Vercel-adapter.

```bash
npm run build
```

De review-routes (`/styleguide`, `/components`, `/sections`) blijven in de repo
en werken lokaal, maar worden op Vercel (`VERCEL=1`) automatisch uit de build
gehaald — ze staan niet op de live site.

## Livegang (Vercel)

1. **Repo naar GitHub** en in Vercel importeren (framework: Astro — wordt
   automatisch herkend).
2. **Environment variables** in Vercel (Project → Settings → Environment
   Variables), voor Production én Preview:

   | Variabele | Waarde |
   |---|---|
   | `PUBLIC_SANITY_PROJECT_ID` | `r6eh5fne` |
   | `PUBLIC_SANITY_DATASET` | `production` |
   | `SANITY_API_READ_TOKEN` | het Viewer-token uit `.env` |
   | `N8N_CONTACT_WEBHOOK_URL` | de n8n productie-webhook-URL |

   `SANITY_API_WRITE_TOKEN` hoeft **niet** op Vercel — dat is alleen voor de
   lokale migratiescripts.
3. **Sanity CORS**: voeg de Vercel-URL(s) toe onder
   [sanity.io/manage](https://www.sanity.io/manage) → API → CORS origins
   (productiedomein + de `*.vercel.app` preview-URL).
4. **Studio deployen** zodat Michael content kan beheren:
   ```bash
   npm --prefix studio run deploy
   ```
   (draait op `https://<naam>.sanity.studio`)
5. **DNS**: `mpetersmontage.nl` in Vercel koppelen (Vercel regelt SSL).

Na een contentwijziging in Sanity een nieuwe Vercel-build triggeren (of een
deploy-webhook instellen), want de pagina's zijn statisch gebouwd.

## Omgevingsvariabelen

Zie `.env.example`. `SANITY_API_WRITE_TOKEN` is alleen nodig voor de
migratiescripts; `N8N_CONTACT_WEBHOOK_URL` voor het contactformulier.
# m-peters-montage

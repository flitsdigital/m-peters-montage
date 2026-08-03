# ANALYSE — Webflow export → Astro × Sanity

Bron: `michael-peters-montage.webflow.zip` (21 MB, last published 30-07-2026)
Live: https://www.mpetersmontage.nl · Sitemap: 55 URL's
Uitgepakt naar `_webflow_source/` (referentie, wordt in Fase 5 verwijderd).

---

## 1. Samenvatting

De site is gebouwd met een **Lumos-achtig 3-lagen tokensysteem** (swatches → semantische
theme-tokens → componenten) en is opvallend consistent: **35 HTML-pagina's zijn allemaal
een stapeling van dezelfde ~18 secties**. Dat maakt dit een tekstboek-geval voor een
**block-based page builder** in Sanity: één `page`-document met een `sections[]`-array
dekt vrijwel de hele site.

| | Aantal |
|---|---|
| HTML-pagina's in export | 35 (waarvan 3 lege CMS-templates + 1 styleguide + 2 utility) |
| URL's in sitemap | 55 |
| Unieke secties | 18 + nav + footer |
| Design tokens (`:root`) | ~200 |
| Themes | 4 waarden (`light` / `dark` / `invert` / `inherit`) |
| Fonts | 2 families, 7 bestanden (.ttf/.otf) |
| Afbeeldingen lokaal | 108 bestanden / 18 MB (met duplicaten) |
| CMS-collecties | 4 (Projecten, Blogs, Reviews, Tags) |
| Breakpoints | 991 / 767 / 479 px |

---

## 2. Pagina-inventaris

### 2.1 Statische pagina's (worden Sanity `page`-documenten)

| URL | Export-bestand | Sectiestapel |
|---|---|---|
| `/` | `index.html` | home-hero · over · diensten · reviews · content · contact · projecten |
| `/kunststof-kozijnen` | `kunststof-kozijnen.html` | header-centered · werkwijze · content · reviews · faq · projecten · contact |
| `/verandas` | `verandas.html` | header-centered · werkwijze · content · reviews · faq · projecten · contact |
| `/zonwering` | `zonwering.html` | idem verandas |
| `/rolluiken` | `rolluiken.html` | idem verandas |
| `/glazen-schuifwanden` | `glazen-schuifwanden.html` | header-centered · werkwijze · content · reviews · projecten · contact |
| `/keralit-gevelbekleding` | `keralit-gevelbekleding.html` | header-centered · content · reviews · contact |
| `/over-mij` | `over-mij.html` | content · content-centered · reviews · projecten · contact |
| `/contact` | `contact.html` | header-centered · contact |
| `/handige-links` | `handige-links.html` | header-centered · links · contact |
| `/kunststof-kozijnen/soorten` | `.../soorten.html` | header-centered · rich-text · over · rich-text · content · rich-text · faq · contact |
| `/kunststof-kozijnen/soorten/draai-kiep` | `.../draai-kiep.html` | 9 secties |
| `/kunststof-kozijnen/soorten/schuifpui` | `.../schuifpui.html` | 7 secties |
| `/kunststof-kozijnen/soorten/vast` | `.../vast.html` | 7 secties |
| `/kunststof-kozijnen/soorten/soorten-dakkapel` | `.../soorten-dakkapel.html` | 9 secties |
| `/kunststof-kozijnen/voordelen` | `.../voordelen.html` | 11 secties |
| `/kunststof-kozijnen/voordelen/isolatie` | `.../isolatie.html` | 9 secties |
| `/kunststof-kozijnen/materialen` | `.../materialen.html` | 12 secties |
| `/kunststof-kozijnen/montage` | `.../montage.html` | 8 secties |
| `/kunststof-kozijnen/regio` | `.../regio.html` | content-header · regio · contact |
| `/kunststof-kozijnen/regio/emmen` | `.../regio/emmen.html` | 15 secties |
| `/kunststof-kozijnen/regio/klazienaveen` | `.../regio/klazienaveen.html` | 9 secties |
| `/kunststof-kozijnen/regio/drenthe` | `.../regio/drenthe.html` | 12 secties |
| `/zonwering/soorten-zonwering` | `.../soorten-zonwering.html` | 8 secties |
| `/zonwering/zonwering-emmen` | `.../zonwering-emmen.html` | 11 secties |
| `/zonwering/zonwering-klazienaveen` | `.../zonwering-klazienaveen.html` | 12 secties |
| `/zonwering/drenthe` | `.../drenthe.html` | 11 secties |
| `/blogs` | `blogs.html` | blog-items (CMS) · contact |
| `/projecten` | `projecten.html` | blog-items (CMS) · contact |
| `/404` | `404.html` | hero_utility-page |
| `/401` | `401.html` | hero_utility-page |

> **Conclusie:** 27 inhoudspagina's = pure sectie-stapelingen. Eén `[...slug].astro`-route
> met een Sanity `page.sections[]` dekt ze allemaal. `/blogs` en `/projecten` zijn
> overzichtspagina's met een CMS-lijst; die krijgen een eigen sectieblok.

### 2.2 CMS-detail templates

| Template | Route | Status |
|---|---|---|
| `detail_projecten.html` | `/projecten/{slug}` | ✅ gevuld — header-centered · project-images · projecten · contact |
| `detail_blog.html` | `/blog/{slug}` ⚠️ enkelvoud | ✅ gevuld — header-centered · blog-content · blog-items · contact |
| `detail_projecten-tags.html` | — | ⬜ leeg, geen sitemap-URL → geen route nodig |
| `detail_reviews.html` | — | ⬜ leeg, geen sitemap-URL → geen route nodig |
| `detail_kunststof-kozijnen-regio.html` | — | ⬜ leeg. De 3 regiopagina's bestaan als **statische** pagina's, niet als CMS-items. |

⚠️ **URL-let-op:** overzicht is `/blogs` (meervoud), detail is `/blog/{slug}` (enkelvoud).
Dat moet 1-op-1 behouden blijven.

### 2.3 Overig

- `styleguide.html` — Webflow's eigen styleguide. **Niet overnemen**; we bouwen in Fase 1
  een eigen, levende `/styleguide` die tokens dynamisch uitleest.
- `401.html` / `404.html` — utility hero, minimale opmaak.

---

## 3. Design tokens

Bron: `:root` in `css/michael-peters-montage.webflow.css` + 4 inline `<style>`-blokken
die op **elke** pagina identiek voorkomen (Webflow "page code" embeds). Alle 4 blokken
zijn per pagina byte-identiek geverifieerd → veilig te centraliseren.

### Laag 1 — primitives (`tokens.css`)

**Swatches**
| Token | Waarde |
|---|---|
| `--swatch--brand` | `#c50600` |
| `--swatch--brand-text` | `var(--swatch--dark-100)` |
| `--swatch--light-100` | `white` |
| `--swatch--light-80` | `#e8eae9` |
| `--swatch--light-60` | `#dedede` |
| `--swatch--light-faded` | `#ffffff1a` |
| `--swatch--dark-100` | `black` |
| `--swatch--dark-80` | `#1d1e20` |
| `--swatch--dark-60` | `#282829` |
| `--swatch--dark-40` | `#343536` |
| `--swatch--dark-faded` | `#0009` |
| `--swatch--transparent` | `transparent` |

⚠️ **Gevonden bug in origineel:** `themes.css` verwijst naar `--swatch--dark`,
`--swatch--light` (zonder numeriek suffix) bij de hover-states van buttons. Die tokens
**bestaan niet** in `:root`. Gevolg: `--button--background-hover` etc. resolven naar
niets. Zie §8.

**Sizes** — `--size--0rem` t/m `--size--16rem`, plus fractionele (`0-125`, `0-25`, `0-375`,
`0-5`, `0-75`, `1-25`, `1-5`, `2-5`, `3-5`, …). Alles ≥ `2rem` is **fluid** via een
`clamp()`-override in inline blok 3 (fluidbuilder, 20 → 90rem viewport). Voorbeeld:
`--size--7rem: clamp(4rem, 3.142rem + 4.29vw, 7rem)`.

**Spacing** — `--space--1` … `--space--8` → mappen op `--size--*`
(`0.25 / 0.5 / 0.75 / 1 / 1.5 / 2 / 3 / 4 rem`).

**Section spacing** — `none: 0` · `even: var(--site--margin)` · `small: 5rem` ·
`main: 7rem` · `large: 10rem` (allemaal fluid).

**Radii / borders / focus** — `--radius--small .5rem`, `--radius--main 1rem`,
`--radius--round 100vw`, `--border-width--main .094rem`, `--focus--width .125rem`,
`--focus--offset-outer .1875rem`, `--focus--offset-inner -.125rem`.

**Typografie**
| | family | size | line-height | weight | letter-spacing | transform |
|---|---|---|---|---|---|---|
| display | primary | `7rem` | 1.3 | 900 | -.03em | uppercase |
| h1 | primary | `3rem` | 1.1 | 900 | -.03em | uppercase |
| h2 | primary | `2rem` | 1.3 | 900 | -.03em | uppercase |
| h3 | primary | `1.5rem` | 1.1 | 900 | -.03em | uppercase |
| h4 | primary | `2rem` | 1.3 | 900 | 0 | uppercase |
| h5 | primary | `0.75rem` | 1.3 | 900 | 0 | uppercase |
| h6 | primary | `1rem` | 1.3 | 900 | 0 | uppercase |
| text-large | primary | `1.25rem` | 1.5 | 400 | 0 | inherit |
| text-main | primary | `1rem` | 1.5 | 400 | 0 | none |
| text-small | primary | `.875rem` | 1.5 | 400 | 0 | inherit |

**Grid/layout** — `--site--width 90rem`, `--site--column-count 12`,
`--site--gutter 1rem`, `--site--margin clamp(1rem, 0.428rem + 2.86vw, 3rem)`,
`--container--main/small/full` en `--column-width--1…12` + `--column-margin--1…12`
(berekend in inline blok 1), `--grid-main`, `--grid-1…12`, `--grid-breakout(-single)`.

**Overig** — `--nav--height 5rem`, `--cutout-size .75rem`,
`--animation-smooth: all .5s cubic-bezier(.65,.01,.15,.99)`,
`--animation-fast: all .3s …`, `--ease-default: cubic-bezier(0.91,0,0.06,1)`.

### Laag 2 — semantische themetokens (`themes.css`)

`--theme--background`, `--theme--background-secondary`, `--theme--text`,
`--theme--border`, `--button--{background,text,border}` (+ `-hover`) en een
`--button-secondary--*`-set.

### Laag 3 — componenten

Componenten consumeren **alleen** laag 2. Geen enkele component grijpt direct naar een
swatch, behalve enkele accenten (`.footer_link::before`, swiper-bullet-active) die
`--swatch--brand` gebruiken — die uitzondering nemen we 1-op-1 over.

---

## 4. Theming (`data-theme`)

Mechanisme = **attribuut**, niet class. Vier waarden: `light`, `dark`, `invert`, `inherit`.

```css
/* light */
:root, [data-theme="light"], [data-theme="dark"] [data-theme="invert"] { … }
/* dark */
[data-theme="dark"], [data-theme="invert"], [data-theme="light"] [data-theme="invert"] { … }
```

- `invert` **flipt relatief t.o.v. zijn parent** (nesting-gevoelig).
- `inherit` doet géén remap — erft de kleuren van boven.
- Achtergrond/tekst worden toegepast via
  `:is(c, :where([data-theme]:not([data-theme="inherit"])))`.
  (`c` is een niet-bestaande tag; puur specificity-hack — 1-op-1 overnemen.)
- `[data-background="secondary"]` forceert de secundaire achtergrond (met `!important`).
- `[data-button-style="secondary"]` remapt de `--button--*`-set naar de secondary-set.

**Basis:** `<body data-theme="dark">` staat op élke inhoudspagina (alleen 401/404 hebben
geen theme). De site is dus standaard **dark**; secties met `inherit` zijn dark.

**Themagebruik per sectie** (geteld over alle pagina's):

| Sectie | data-theme |
|---|---|
| `section_home-hero` | `dark` |
| `section_over` | `dark` (14×) |
| `section_diensten` | `dark` |
| `section_contact` | `dark` (30×), `light` (1×) |
| `section_reviews` | `light` (15×) |
| alle overige | `inherit` |

De `section_wrapper`-div eromheen zet soms zelf `data-theme="dark"` als parent-context
voor een genest `invert` (o.a. het contactformulier `contact_component`).

---

## 5. Fonts

| Family | Bestand | Weight | Style |
|---|---|---|---|
| Nexa | `Nexa-Book.ttf` | 400 | normal |
| Nexa | `Nexa-BookItalic.ttf` | 400 | italic |
| Nexa | `Nexa-Bold.ttf` | 700 | normal |
| Nexa | `Nexa-BoldItalic.ttf` | 700 | italic |
| Nexa | `Nexa-Black.ttf` | 900 | normal |
| Nexa | `Nexa-BlackItalic.ttf` | 900 | italic |
| PP Supply Sans | `PPSupplySans-Bold.otf` | 700 | normal |

`--font--primary-family: Nexa, Arial, sans-serif` · `--font--secondary-family: "PP Supply Sans", Arial, sans-serif`.
Alle `@font-face` gebruiken `font-display: swap`.

**Actie:** kopiëren naar `public/fonts/`, converteren naar `.woff2` (veilige winst:
~7 MB → ~1,5 MB, metrics blijven identiek), Nexa Book + Black preloaden in `BaseLayout`.
De secondary family wordt in de CSS nauwelijks gebruikt — checken in Fase 1 of ze
überhaupt nodig is.

---

## 6. Assets

- `images/` — 108 bestanden, 18 MB. Bevat veel ruis:
  - Webflow's `-p-500/-p-800/-p-1080/-p-1600` responsive varianten
  - duplicaten met dubbele naam (`FLITS-2501-Groot_1FLITS-2501 (Groot).avif`) — deze
    staan wél in de `srcset`s maar zijn identiek aan het hoofdbestand
  - Formaten: `.avif` (fotografie), `.webp`, `.jpg`
- Favicon: `images/favicon.jpg` · Apple touch: `images/webclip.jpg`
- `og:image` verwijst naar absolute Webflow-CDN-URL → **blijft absoluut** tot de assets
  gemigreerd zijn.
- **CMS-afbeeldingen (projecten, blogs) staan volledig op `cdn.prod.website-files.com`.**
  Die moeten gedownload en naar Sanity geüpload worden. Zie §9.

**Actie Fase 1:** alleen de daadwerkelijk gebruikte bronbestanden overnemen naar
`public/images/`; Astro `<Image>` genereert zelf de responsive varianten, dus de
`-p-*`-duplicaten vervallen. Verwachte reductie: 18 MB → ~7 MB.

---

## 7. Interacties & scripts

Externe libs (nu via CDN in de export):

| Lib | Versie | Gebruik |
|---|---|---|
| jQuery | 3.5.1 | alleen als glue in de custom scripts |
| GSAP + CustomEase | 3.12.5 | nav-animatie, FAQ-accordeon |
| Swiper | 11 | reviews-slider, projecten-slider |
| Lenis | (CSS aanwezig, JS niet geladen) | smooth scroll — **lijkt dood**, checken |
| `webflow.js` | — | IX2-engine; wordt volledig vervangen |

### Te herbouwen interacties

1. **Nav-menu (mobile/overlay)** — `data-menu-toggle` opent `.nav_menu`. GSAP-timeline:
   hamburger-lijnen roteren (45°/90°, y ±5), `nav_menu-wrap` `xPercent 120 → 0`,
   overlay fade, `nav_menu-bg` stagger `0.12` `xPercent 101 → 0` (duration `.75`),
   links `yPercent 100 → 0` stagger `0.1`. Escape sluit. `body.no-scroll` tijdens open.
2. **Nav-dropdown (Diensten)** — pure CSS, alleen `@media (hover:hover) and (pointer:fine)`.
   `visibility/opacity/transform: translateY(-10px) scale(.4)` → in `.1s`, uit `.45s`,
   easing `var(--ease-spring)`. ⚠️ **`--ease-spring` is nergens gedefinieerd** → zie §8.
3. **Reviews-swiper** — `loop`, `grabCursor`, `centeredSlides`, `autoplay 8000ms`,
   breakpoints `320:1/16`, `480:1.5/24`, `640:2.5/24`, pagination clickable,
   custom nav `.swiper-button-forward` / `.swiper-button-previous`.
4. **Projecten-swiper** — `loop`, `centeredSlides`, `createElements`, `autoplay 3000ms`,
   breakpoints `320:1/24`, `480:2/24`, `640:4/24`, pagination.
5. **FAQ-accordeon** — GSAP, één tegelijk open, icoon roteert 45°, `height auto ↔ 0`,
   `duration .7`. `data-open` attribuut op `.faq_item`.
6. **Button hover** — puur CSS: `.btn_bg` `scaleY` (transform-origin bottom, `.8s`),
   `.btn_cutout` schuift weg (`.5s`).
7. **Diensten-card hover** — `img scale(1.1)`, twee pijl-iconen wisselen diagonaal
   (`translate(-100%,100%)` ↔ `translate(100%,-100%)`), `.3s`.
8. **Footer-link hover** — pseudo-element blokje in brandkleur schuift in + kleur wordt brand.
9. **FLITS-logo hover** — `flits-flash` keyframes (flikkerend geel `#FFF203`), `.8s`.
10. **`.footer_cms-link` hover** — preview-image schuift in beeld.
11. **Lightbox** (`project-images_lightbox`, `w-lightbox`) — Webflow-lightbox op de
    projectgalerij. Vervangen door een kleine eigen dialog-island.
12. **`data-animate` / `data-trigger`** — IX2-scroll-reveals. Staan op ~alle secties.
    ⚠️ Moet in Fase 5 visueel geverifieerd worden wat ze precies doen (fade-up?).

**Aanpak:** GSAP + Swiper als **npm-dependency** (geen CDN), jQuery volledig weg,
elke interactie als eigen, component-scoped island (`client:visible` / `client:idle`).

---

## 8. Gevonden fouten in het origineel

Deze reproduceren we **niet** blind — voorleggen aan de gebruiker:

| # | Probleem | Effect |
|---|---|---|
| 1 | `--swatch--dark` / `--swatch--light` (zonder suffix) bestaan niet, maar worden gebruikt voor àlle button-hoverstates | Button-hover heeft geen gedefinieerde kleur → browser valt terug op de niet-hover waarde. Waarschijnlijk bedoeld: `--swatch--dark-100` / `--swatch--light-100`. |
| 2 | `--ease-spring` niet gedefinieerd | Nav-dropdown transition valt terug op de default easing i.p.v. spring. |
| 3 | `.footer_logo-wrap.u-column-custom { background-color: red; height: 100rem }` | Dode regel (class komt niet in de HTML voor), maar wél in de CSS. Niet migreren. |
| 4 | `.swiper-button-previous:hover { transform scale(1.1) }` — ontbrekende `:` | Regel doet niets. |
| 5 | `detail_projecten.html` heeft placeholdertekst "Lorem ipsum dolor sit amet…" in de projecten-sectie | Staat live op elke projectdetailpagina. |
| 6 | `hero_utility-page_text` bestaat op 401 maar niet op 404 | Inconsistent, geen blocker. |
| 7 | Sitemap bevat `/projecten/rolluiken` terwijl dat item in de CSV `Draft: true` is | Item is gepubliceerd geweest, daarna op draft gezet. Beslissing nodig. |

---

## 9. CMS-analyse

### 9.1 Bestaande Webflow-collecties (uit de aangeleverde CSV's)

| Collectie | Items | Route | Velden |
|---|---|---|---|
| **Projecten** | 23 (1 draft) | `/projecten/{slug}` | Naam, Slug, Project Titel, Korte beschrijving, Projectfoto, Tags (ref), Langere beschrijving (rich text), Alle projectfoto's (multi-image) |
| **Blogs** | 5 | `/blog/{slug}` | Naam, Slug, Post Body (rich text), Post Summary, Main Image, Thumbnail, Dienst, Featured?, Color |
| **Reviews** | 5 | geen route | Naam, Slug, Review Tekst |
| **Projecten – Tags** | 19 (1 draft) | geen route | Naam, Slug |

Tags mengen twee soorten labels door elkaar: **plaatsen** (Emmen, Klazienaveen,
Zwartemeer, Angelslo, Dalen, Erica, Ter-Apel, Barger-Compascuum, Barger-Oosterveld,
Nieuw Dordrecht, Tweede Exloërmond, Amsterdam) en **diensten** (Kunststof Kozijnen,
Veranda's, Zonwering, Rolluiken, Glazen Schuifwanden, Overkapping, Tuinkamer).
→ Voorstel: één `tag`-document met een `type`-veld (`plaats` | `dienst`), zodat je later
op beide kunt filteren zonder de bestaande slugs te breken.

⚠️ **Alle CMS-afbeeldingen staan op `cdn.prod.website-files.com`** (± 90 URL's over
projecten en blogs). Die moeten in een migratiescript gedownload en naar Sanity
geüpload worden. De Webflow-CDN blijft na de switch niet gegarandeerd bereikbaar.

⚠️ **Rich text bevat interne links** met oude paden, waarvan sommige **al kapot zijn**:
`/diensten/kunststof-kozijnen`, `/diensten/zonwering`, `/kunststof-kozijnen/klazienaveen`,
`/kunststof-kozijnen/emmen`, `/kunststof-kozijnen/drenthe` — die routes bestaan niet in de
sitemap (moet zijn `/kunststof-kozijnen`, `/zonwering`, `/kunststof-kozijnen/regio/…`).
Meenemen in het migratiescript.

### 9.2 Voorgesteld Sanity-model

**Documenten**

| Type | Doel |
|---|---|
| `page` | Alle 27 inhoudspagina's. Velden: `title`, `slug` (`home` voor `/`), `sections[]`, SEO (`metaTitle`, `metaDescription`, `ogImage`, `canonical`), `breadcrumbs[]` |
| `project` | Uit `Projecten.csv` |
| `blogPost` | Uit `Blogs.csv` |
| `review` | Uit `Reviews.csv` |
| `tag` | Uit `Tags.csv` + `type`-veld |
| `siteSettings` (singleton) | Nav-structuur, footer-links, NAW/contact, socials, GTM/Clarity-ID's, LocalBusiness schema |

**`page.sections[]` union** — één object-type per Fase 3-sectie (zie
`COMPONENT_MAPPING.md`), plus één `flexibleSection` voor vrije blokken.

**Routes**

| Astro-route | Bron |
|---|---|
| `src/pages/[...slug].astro` | `page` |
| `src/pages/projecten/[slug].astro` | `project` |
| `src/pages/blog/[slug].astro` | `blogPost` |
| `src/pages/404.astro` | statisch |

Reviews en tags krijgen geen eigen route (zoals nu).

---

## 10. CSS-migratiestrategie

**Verboden:** `webflow.css` of `michael-peters-montage.webflow.css` importeren; één
globale `app.css`; utility-spaghetti; tijdelijke globale overrides.

**Doelstructuur**

```
src/styles/
  tokens.css   laag 1 — swatches, sizes, spaces, radii, typografie, grid, fluid clamps
  themes.css   laag 2 — [data-theme] mappings, invert-nesting, [data-button-style], [data-background]
  base.css     reset (uit normalize.css) + element-defaults + de globale helpers
               die écht globaal moeten blijven (u-container, u-grid-desktop, u-column-*,
               data-padding-*, u-block-gap, u-text-style-*, focus-ring, margin-trim)
  fonts.css    7 @font-face
```

De `u-*`-laag is géén utility-spaghetti maar een **layoutsysteem** (12-koloms grid +
sectiespacing) waar de fidelity op leunt. Die gaat 1-op-1 mee naar `base.css`; alles
daarbuiten wordt component-scoped.

**Uit `webflow.css` wordt alléén overgenomen wat een component echt nodig heeft:**
`.w-richtext`-basis (voor Portable Text output), form-states (`w-form-done`/`w-form-fail`),
checkbox/radio custom inputs. De rest (`.w-slider`, `.w-nav`, `.w-tabs`, IX2-hooks) valt weg.

**Te droppen:** `data-wf-page` / `data-wf-site`, `w-mod-js`/`w-mod-touch`,
`.w-dyn-empty`/`.w-condition-invisible` placeholders, Webflow-badge,
`.w-inline-block` (vervangen door normale display-regels).

---

## 11. SEO & integraties (1-op-1 behouden)

- Per pagina: `<title>`, `meta description`, `og:title/description/image/type`,
  `twitter:title/description/card`, `link rel=canonical`.
- **Google Tag Manager / GA4**: `G-F7GZ2RSVSS` (incl. `gtag('set','developer_id.dZGVlNj')`).
- **Microsoft Clarity**: `r9c0o7p16n`.
- **JSON-LD `LocalBusiness`** in de `<head>`: naam, image, url, telefoon,
  adres (Zuiderkruis 19, 7891 BJ Klazienaveen), geo (52.7298467 / 6.9873018),
  `sameAs` Facebook.
  ⚠️ Het adres in de JSON-LD (**Zuiderkruis 19**) wijkt af van het adres in de footer
  (**Lavas 10, 7892 AG Klazienaveen**). Voorleggen aan de gebruiker.
- Favicon `images/favicon.jpg`, apple-touch `images/webclip.jpg`.
- Het contactformulier is nu een Webflow-form (`method="get"`, geen action) →
  heeft in Astro een echte backend nodig. Keuze nodig (zie checkpoint-vragen).

---

## 12. Responsive

Exact drie breakpoints, allemaal `max-width`: **991 / 767 / 479**. Geen nieuwe
breakpoints toevoegen. Belangrijkste reflows:

- `991`: **`u-grid-desktop` wordt `display:flex; flex-flow: column`** (het 12-koloms grid
  vervalt hier al); `u-grid-column-4` → 2 koloms; `u-container-full` krijgt 1rem
  side-padding; `hide-mobile` verdwijnt; nav-links worden kolom;
  `swiper-button-wrap` verborgen; `section_header-centered` krijgt `height: 100svh`;
  `home_hero-diensten-wrap` wordt kolom.
- `767`: `u-grid-column-2/3` → 1 kolom.
- `479`: `section_wrapper` padding → 0; `over_img-wrap_inner` wordt
  `aspect-ratio: 1` + relatief; `projecten_container` krijgt weer top-padding;
  `u-hflex-left-center.u-gap-4` wordt kolom; `divider` verborgen;
  footer-grid wordt kolom;
  `breadcrumbs_slot` wordt kolom; `footer-new_bottom` auto-hoogte;
  `nav_dropdown-item` 1rem/400.

---

## 13. Voorgestelde projectstructuur

```
src/
  styles/        tokens.css  themes.css  base.css  fonts.css
  design-system/ tokens.ts
  layouts/       BaseLayout.astro
  components/
    atoms/       Button · Heading · Text · RichText · Icon · Logo · Eyebrow · Image
                 Input · Textarea · Select · Label · StarRating · Cutout
    molecules/   NavLink · NavDropdown · Breadcrumbs · ReviewCard · ProjectCard
                 BlogCard · DienstCard · WerkwijzeStep · FaqItem · RegioCard
                 ContactItem · FooterLinkGroup · ContactForm · Visual
    sections/    Navbar · Footer · HeroHome · HeaderCentered · SectionMedia
                 SectionContentCentered · SectionRichText · SectionWerkwijze
                 SectionReviews · SectionProjecten · SectionFaq · SectionContact
                 SectionDiensten · SectionCardGrid · SectionBlogContent
                 SectionProjectImages · SectionRegio · SectionLinks · HeroUtility
  sanity/        client.ts · loadQuery.ts · SectionRenderer.astro · FlexibleSection.astro
  pages/         styleguide · components · sections · [...slug] · projecten/[slug]
                 blog/[slug] · 404
studio/          schemaTypes/{documents,sections,blocks,shared}
public/          fonts/  images/
scripts/         migrate-webflow-csv.ts   (CSV + CDN-images → Sanity)
```

---

## 14. Beslissingen (Checkpoint 0 — akkoord 30-07-2026)

| # | Onderwerp | Besluit |
|---|---|---|
| 1 | **Fouten uit §8** | **Repareren + loggen.** `--swatch--dark` → `--swatch--dark-100`, `--swatch--light` → `--swatch--light-100`, `--ease-spring` definiëren, dode CSS niet migreren, lorem ipsum melden. Elke afwijking t.o.v. live in `FIDELITY.md`. |
| 2 | **Contactformulier** | **n8n.** Submit gaat naar een Astro API-route (`/api/contact`) die doorpost naar een n8n-webhook. URL via env (`N8N_CONTACT_WEBHOOK_URL`) zodat 'ie server-side blijft en er geen CORS-gedoe is. |
| 3 | **Sanity** | **Nieuw project, los Studio** in `studio/` met eigen deploy naar `*.sanity.studio`. |
| 4 | **Adres** | **Lavas 10, 7892 AG Klazienaveen** (footer is leidend). JSON-LD `LocalBusiness` wordt hierop gecorrigeerd; geo-coördinaten opnieuw bepalen. |
| 5 | `/projecten/rolluiken` | Nog open — draft-item dat wél in de sitemap staat. Beslissen bij de CSV-migratie (Fase 4). |
| 6 | Regiopagina's | Default: als gewone `page`-documenten (ze zijn nu statisch). Geen aparte collectie. |

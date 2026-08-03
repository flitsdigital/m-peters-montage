# FIDELITY — afwijkingen t.o.v. de Webflow-site

Bijgewerkt per fase. Elke bewuste afwijking staat hier; alles wat er niet in staat is
1-op-1 overgenomen.

---

## Fase 1 — Foundation

### Bewust gerepareerd (besluit Checkpoint 0)

| # | Origineel | Nu | Waarom |
|---|---|---|---|
| 1 | `--swatch--dark` / `--swatch--light` worden gebruikt in álle button-hoverstates maar zijn nergens gedefinieerd → hover had geen kleur | Aliassen toegevoegd in `tokens.css`: `--swatch--light: var(--swatch--light-100)`, `--swatch--dark: var(--swatch--dark-100)` | Zonder deze regels valt hover terug op de rustkleur. **Zichtbaar verschil t.o.v. live: buttons hebben nu wél een hoverkleur.** |
| 2 | `--ease-spring` gebruikt in de nav-dropdown-transition, nergens gedefinieerd → browser gebruikt de default easing | `--ease-spring: cubic-bezier(0.34, 1.52, 0.64, 1)` toegevoegd (dezelfde curve die het FLITS-logo al gebruikt) | De transition was duidelijk als spring bedoeld. **Zichtbaar verschil: dropdown veert nu.** |
| 3 | `.footer_logo-wrap.u-column-custom { background-color: red; height: 100rem }` | Niet gemigreerd | Dode regel — de class komt in geen enkele HTML voor. |
| 4 | `.swiper-button-previous:hover { transform scale(1.1) }` (dubbele punt ontbreekt) | Wordt in Fase 5 als geldige regel opgenomen | Regel deed niets in het origineel. **Zichtbaar verschil: swiper-knoppen schalen nu bij hover.** |

### Structurele keuzes

| Onderwerp | Origineel | Nu | Effect |
|---|---|---|---|
| Fonts | 7× `.ttf`/`.otf`, 467 kB | 7× `.woff2`, 171 kB | Geen. Metrics identiek, alleen de container verschilt. Nexa Book + Black worden gepreload. |
| Utilities | 200+ `u-*` classes in de CSS | Alleen de 45 die daadwerkelijk in de HTML voorkomen | Geen. De rest was ongebruikt. |
| `--theme--text-secondary` | Stond in `:root` op `white`, werd nergens geremapt of gebruikt | Niet overgenomen | Geen. |
| margin-trim | Geschreven met `.w-condition-invisible`-selectors | Vereenvoudigd naar `> :first-child` / `> :last-child` | Geen — logisch equivalent. |
| `<html lang>` | `en` | `nl` | Geen visueel effect; correcter voor screenreaders en SEO. |
| JSON-LD adres | Zuiderkruis 19, 7891 BJ | Lavas 10, 7892 AG (footer is leidend) | Structured data komt nu overeen met de footer. ⚠️ Geo-coördinaten horen nog bij het oude adres. |

### Bekende beperking — 1-op-1 overgenomen, niet gefixt

`data-theme="invert"` kijkt niet naar de *dichtstbijzijnde* theme-parent maar naar *elke*
theme-voorouder. Staat er zowel een `light` als een `dark` boven een `invert`, dan wint de
laatste regel in de CSS (dark). Op deze site komt dat nergens voor — de nesting is nooit
dieper dan één niveau onder `<body data-theme="dark">`. Gereproduceerd zoals het is.

### Nog te verifiëren

- [x] `--font--secondary-family` (PP Supply Sans) — **wél in gebruik**: buttontekst,
      eyebrows en formulier-labels. Font blijft.
- [ ] Lenis smooth-scroll: de CSS staat in de export maar het JS wordt niet geladen.
      Uitzoeken of het live wél actief is.
- [ ] `data-animate` / `data-trigger`: IX2-scroll-reveals staan op bijna elke sectie.
      Exact gedrag (fade-up? stagger?) moet in Fase 5 visueel bepaald worden.

## Fase 2 — Atoms

| Onderwerp | Origineel | Nu | Effect |
|---|---|---|---|
| Toegankelijke buttonlabels | De sr-only span in elke button was **leeg**; de zichtbare tekst stond op `aria-hidden` → buttons hadden geen accessible name | `Clickable` vult de sr-only span met het label | Geen visueel verschil; screenreaders kunnen de knoppen nu wél lezen. |
| g_clickable link/button-hack | Rendert altijd link + button, verbergt er één via `a[href="#"] { display:none }` | Conditionele render: `href` → `<a>`, anders `<button type>` | Zelfde gedrag, schonere DOM. |
| Formulier-labels | Hardcoded in caps ("VOORNAAM") | Gewone tekst + `text-transform: uppercase` in CSS | Identieke rendering; CMS kan straks normale tekst aanleveren. |
| Select-focus | Webflow-blauw `#3898ec` op focus | 1-op-1 overgenomen | Geen. Bewust niet "verbeterd". |
| Icoonnaam | — | `regio_icon` bleek een pijl, geen pin — bestand heet `arrow-simple.svg` | Alleen naamgeving. |

**Mapping-afwijkingen t.o.v. COMPONENT_MAPPING.md** (dedup):
- `Input` + `Textarea` + `Select` + `Label` → één **`FormField`**-atom (`kind`-prop) —
  markup en styling waren op het veldtype na identiek.
- `Cutout` → in **`Button`** gevouwen; alle 208 cutouts op de site zitten in buttons.
- **`Clickable`** toegevoegd als atom: het g_clickable-patroon wordt in Fase 3 ook door
  ProjectCard en RegioCard gebruikt (3+ afnemers).

## Fase 3 — Molecules + Sections

### Gerepareerd

| # | Origineel | Nu | Effect |
|---|---|---|---|
| 1 | `.swiper-button-previous:hover { transform scale(1.1) }` — dubbele punt ontbrak, regel deed niets | Geldige `transform: scale(1.1)` | **Zichtbaar:** slider-knoppen schalen nu bij hover. |
| 2 | Slider-paginatie lag absoluut over de slides (Swiper's eigen CSS won van de `position: relative`-override) | Selector specifieker gemaakt zodat de balk ónder de slider staat | **Zichtbaar:** paginatie overlapt de reviews niet meer. |
| 3 | Actieve paginatie-bullet was een uitgerekte ellips (Swiper's `border-radius: 50%` won van `border-radius: 0`) | `.swiper` ervoor gezet zodat de vierkante variant wint | **Zichtbaar:** bullets zijn weer vierkant, actieve is een breed streepje. |

### Bewuste afwijkingen

| Onderwerp | Origineel | Nu | Waarom |
|---|---|---|---|
| Formulier-spacing | `u-gap-6` → 2rem tussen velden | `--space--8` → 4rem, ook als rij-gap in de 2-koloms rijen | Op verzoek. De zwevende chip-labels steken boven hun veld uit waardoor 2rem optisch te krap oogt. |
| FAQ-accordeon | Divs + GSAP-timeline, `data-open`-attribuut | Native `<details>`/`<summary>` met `name`-groep | Zelfde beeld en timing, plus toetsenbordbediening en werkt zonder JS. Eén-tegelijk-open komt nu van de browser. |
| Nav-menu | GSAP-timeline (jQuery + GSAP in de bundle) | CSS-transitions op een `data-nav`-state | Zelfde richting, duur en stagger (0.1s per link). Scheelt jQuery + GSAP volledig. |
| Nav-dropdown | Alleen hover | Hover **en** `:focus-within` | Toetsenbordgebruikers konden er niet bij. |
| Projectgalerij | Webflow `w-lightbox` | Native `<dialog>` | Geen library nodig. |
| Cutout-achtergrond | Per button een `data-cutout-background="primary\|secondary"` | Eén `--cutout-background`-variabele die de sectie zet | Cutouts kunnen niet meer uit de pas lopen met hun achtergrond. |

### Inconsistentie in het origineel — niet overgenomen

Van de 25 buttons in `content_content-wrapper` staan er 16 op `primary` en 9 op
`secondary`, terwijl `section_content` altijd dezelfde achtergrond heeft. Bij 5 van die 9
staat er geen `background_secondary` in de buurt — dat lijkt handmatig verkeerd gezet in
Webflow. `SectionMedia` heeft nu een `background="secondary"`-prop voor de gevallen waar
de sectie écht op de secundaire achtergrond ligt; de rest rendert met de juiste
(primaire) cutout.

### Nog te doen in Fase 5

- [ ] `data-animate` / `data-trigger` scroll-reveals — exact gedrag bepalen en herbouwen.
- [ ] Contactformulier koppelen aan de echte n8n-webhook (`N8N_CONTACT_WEBHOOK_URL`).

## Fase 4 — Sanity + pagina's

### Nieuw gevonden secties (stonden niet in ANALYSE.md)

Bij het extraheren bleken er drie sectievarianten te bestaan die ik in Fase 0 gemist had,
omdat ze allemaal de class `section_content` dragen:

| Variant | Aantal | Nu |
|---|---:|---|
| Grid van kaartjes (`content_waarom-item`) | 6 secties / 27 kaartjes | Nieuwe sectie **`SectionFeatureGrid`** |
| Alleen rich text (soms met knop) | 7 | Naar **`SectionRichText`**, uitgebreid met `cta`, `align` en `background` |
| Externe widget (Kleurmonster op de Keralit-pagina) | 1 | Nieuwe sectie **`SectionEmbed`** |

Daarnaast: de Facebook-knop op `/over-mij` (`over_socials-wrap`) zat in geen enkele
sectie. Toegevoegd als `showSocials`-optie op `SectionMedia` — anders was de enige
social-link van de site verdwenen.

### Gerepareerd

| # | Probleem | Oplossing |
|---|---|---|
| 1 | **Alle sectie-CSS werkte niet.** De `<section>` wordt door `SectionShell` gerenderd, dus Astro's scoped styles bereikten hem niet — hero-marge, sectiehoogtes en secundaire achtergronden vielen weg. | Selectors die het section-element zelf targeten in `:global()` gezet (7 componenten). |
| 2 | Interne links met `../../` werden niet genormaliseerd → kapotte kruimelpaden op alle diepe pagina's. | `fixHref` herschreven; vangt nu ook absolute links naar het eigen domein. |
| 3 | Rich-text-links naar niet-bestaande routes (`/diensten/…`, `/kunststof-kozijnen/emmen`) | Omgezet naar de juiste paden tijdens de migratie. |

### Bewuste afwijkingen

| Onderwerp | Origineel | Nu | Waarom |
|---|---|---|---|
| Regio-overzicht | Webflow CMS-collectie zonder CSV-export | Drie vaste items (Klazienaveen, Emmen, Drenthe) met de headerfoto van hun eigen pagina | Er was geen export van die collectie; dit zijn de enige drie regio's met een pagina. |
| Decoratieve fotobanden | 8× een `section_header-centered` met alleen een achtergrondfoto, zonder kop | 1-op-1 overgenomen; `heading` is optioneel in het schema | Bewuste vormgeving, geen fout. |
| Afbeeldingen | Lokale bestanden + Webflow-CDN | Alles in Sanity (assets hergebruikt op bron-URL) | De Webflow-CDN blijft na de overstap niet gegarandeerd bereikbaar. |
| `<head>`-teksten | — | Door `stegaClean` gehaald | Anders komen onzichtbare visual-editing-tekens in `<title>` en `<meta>` terecht. |

### Gerepareerd na de eerste review

| # | Probleem | Oorzaak | Oplossing |
|---|---|---|---|
| 4 | Paginakop stond bovenaan i.p.v. verticaal gecentreerd | Webflow zet `align-self: center` in een per-element `#w-node-…`-regel, niet in de class — die regels had ik in Fase 1 niet uitgelezen | `align-self: center` op `.header-centered_heading` (43 instanties), `align-self: end` op `.home_hero-paragraph-wrap` |
| 5 | Geen ruimte tussen eyebrow en de kop eronder | Ik gaf h1–h6 allemaal `margin-top: 0`. In het origineel overschrijft het thema h2 **niet**, dus houdt h2 de webflow.css-defaults (20px / 10px) | h2 teruggezet op `margin-top: 20px; margin-bottom: 10px` |
| 6 | `/projecten` toonde blogkaarten | `SectionCardGrid` gebruikte altijd `BlogCard` | `variant`-prop: projecten krijgen `ProjectCard` (tags + "meer lezen"-chip), blogs `BlogCard` |
| 7 | FAQ-antwoorden toonden `[object Object]` | De antwoorden zijn Portable Text, maar werden met `set:html` gerenderd | `SectionFaq` rendert nu Portable Text; strings blijven werken voor de showcase |
| 8 | Nav-menu had een dichte zwarte achtergrond i.p.v. een doorzichtige overlay | Ik had `data-theme="dark"` op `.nav` en `.nav_menu` gezet; themes.css geeft die dan een ondoorzichtige achtergrondkleur. Het origineel zet daar geen theme | `data-theme` verwijderd van beide |
| 9 | Koppen in CMS-tekst kregen de verkeerde typografie | De rich text stond niet in een `.u-rich-text`-wrapper, zoals in het origineel wél | Slot van `SectionMedia`, `SectionContentCentered`, `SectionContact` en `SectionDiensten` in `RichText` gewikkeld |

Sectie-padding is nagemeten tegen live: `main` = 105,18px en `large` = 149,73px bij 1280px
breed, in beide identiek.

### Openstaand

- **`/projecten/rolluiken`** staat wél in de sitemap maar het CMS-item staat op *draft*
  (beslissing #5 uit Checkpoint 0). Nu niet gebouwd — 56 van de 57 sitemap-URL's staan er.
  Publiceren in de Studio, of een redirect instellen.
- **Visual editing** (Presentation-tool) is voorbereid in `studio/presentation.ts` maar de
  draft-mode-routes aan Astro-kant staan nog niet — dat hoort bij Fase 5.

## Fase 5 — Interacties, QA en opruimen

### Scroll-animaties: die zijn er niet

`data-animate` (15×) en `data-trigger` (5×) staan overal in de export, maar op de **live
site** hebben al die elementen `opacity: 1` en `transform: none`, en geen enkel script
verwijst ernaar. Gecontroleerd op twee pagina's. Ook Lenis (smooth scroll) staat wel in de
CSS maar wordt nergens geladen.

Het zijn dus overblijfselen van een animatie-opzet die nooit is afgemaakt. **Niets
nagebouwd** — er is niets om na te bouwen. De attributen zijn niet overgenomen.

### Visual editing: verwijderd op verzoek

Was opgezet (SSR-preview + stega + Presentation-tool) maar er weer uitgehaald. Daarmee
zijn ook React, `@astrojs/react` en `@sanity/visual-editing` uit het project. De Studio
heeft nu alleen Structure + Vision.

### Interacties: eindstand

| Interactie | Origineel | Nu |
|---|---|---|
| Nav-menu openen | GSAP-timeline + jQuery | CSS-transitions op `data-nav` |
| Nav-dropdown | CSS-hover | CSS-hover + `:focus-within` |
| FAQ-accordeon | GSAP + `data-open` | Native `<details>` |
| Reviews- en projectenslider | Swiper 11 (CDN) | Swiper 11 (npm), lazy geladen |
| Projectgalerij | Webflow `w-lightbox` | Native `<dialog>` |
| Button-hover, dienstkaarten, footer-links, FLITS-logo | CSS | CSS, 1-op-1 |

jQuery, GSAP, CustomEase en `webflow.js` zijn allemaal verdwenen.

### Performance

| | Origineel | Nu |
|---|---:|---:|
| JS bij pageload | ~290 kB (jQuery + webflow.js + GSAP + CustomEase + Swiper) | **24 kB** |
| JS na scrollen naar een slider | — | +64 kB (Swiper, via IntersectionObserver) |
| CSS | ~120 kB (3 bestanden, grotendeels ongebruikt) | **55 kB** |
| Fonts | 467 kB (.ttf/.otf) | **188 kB** (.woff2) |

Swiper laadt pas als een slider binnen 200px van het scherm komt; geverifieerd dat er bij
pageload 0 sliders geïnitialiseerd zijn en na scrollen 1.

### Responsive

Nagemeten op 1280 / 894 / 760 / 479 px. Alle breakpoint-regels uit het origineel komen
terug (grid → flex-kolom op 991, 2/3-koloms grids → 1 kolom op 767, en op 479 de
sectiemarge, hamburger-menu op volle breedte, verborgen divider en het formulier-label dat
uit de veldrand springt). **Geen horizontale overflow** op geen enkele breedte.

### Toegankelijkheid

67 klikbare elementen, allemaal met een toegankelijke naam · alle afbeeldingen hebben
alt-tekst · één `<h1>` per pagina · geen kopniveaus overgeslagen · `lang="nl"` ·
`nav`/`main`/`footer` landmarks aanwezig · focus-ring uit de tokens.

### Opgeruimd

- `_webflow_source/` (21 MB) verwijderd. De migratiescripts stoppen nu met een duidelijke
  melding als de map ontbreekt en vertellen hoe je het zip opnieuw uitpakt.
- 28 ongebruikte afbeeldingen uit `src/assets/images` (5,5 MB). Wat overblijft is alleen
  wat de `/sections`-showcase gebruikt; alle pagina-afbeeldingen zitten in Sanity.
- `gsap` als dependency verwijderd (was al niet meer in gebruik).

### Eindcontrole

| Controle | Uitkomst |
|---|---|
| `verify:pages` — sectie-aantallen tegen de originele HTML | 29 pagina's, 0 opmerkingen |
| `check:links` — interne links tegen bestaande routes | 297 links, allemaal geldig |
| Sitemap-dekking | 56 van 57 URL's (alleen het draft-item ontbreekt) |
| Build | 59 routes, geen fouten |

## Content-volledigheid (na review)

Bij het nalopen bleek dat de automatische pagina-migratie op scommige blokken tekst liet
vallen. Opgespoord met een nieuw script (`npm run check:content`) dat elke alinea, lijst-
item en kop uit de originele Webflow-HTML vergelijkt met wat in Sanity staat.

| Bug | Oorzaak | Fix |
|---|---|---|
| Bodytekst van tekst-met-foto-blokken verdween | `readBody` herkende alleen `.u-rich-text`, terwijl Webflow de body vaak in `.w-richtext` zet | Beide klassen (+ dieper geneste rich text) worden nu gepakt |
| FAQ-vragen op regio-/zonweringpagina's waren leeg | De vraag stond in een `<h3>` i.p.v. een `<div>`; de selector was tag-specifiek | Selector nu tag-onafhankelijk (`.faq_title > :not(.faq_title-icon)`) |
| Losse `<h2>` boven een rich-text-blok verdween | De kop stond náást de `.w-richtext`, niet erin | Losse kop wordt nu vooraan de rich text meegenomen |

Resultaat: **45 → 0 ontbrekende tekstfragmenten** over alle 29 pagina's. De check draait
mee als `npm run check:content` (vereist het uitgepakte `_webflow_source/`).

## Livegang-voorbereiding (Vercel)

- **Adapter** van Node naar `@astrojs/vercel` — `/api/contact` wordt een serverless functie.
- **Review-routes** (`/styleguide`, `/components`, `/sections`) blijven in de repo maar
  worden op Vercel na de build gestript (`scripts/strip-dev-pages.mjs`, gate op `VERCEL=1`)
  en uit de sitemap gefilterd.
- **`/projecten/rolluiken`** (was draft) alsnog gepubliceerd in Sanity → 60 routes.
- **og:image** lokaal gehost (`/images/og-default.jpg`) i.p.v. de Webflow-CDN.
- **Geo-coördinaten** gecorrigeerd naar Lavas 10 (via OpenStreetMap).
- **sitemap.xml + robots.txt** toegevoegd.

## Openstaande contentkwesties

- Lorem ipsum staat live in `section_projecten` op elke projectdetailpagina
  ("Lorem ipsum dolor sit amet consectetur…"). Vervangen door echte tekst bij de
  CSV-migratie.
- Rich text in de CMS-content bevat interne links naar routes die niet bestaan:
  `/diensten/kunststof-kozijnen`, `/diensten/zonwering`, `/kunststof-kozijnen/klazienaveen`,
  `/kunststof-kozijnen/emmen`, `/kunststof-kozijnen/drenthe`. Worden in het migratiescript
  omgezet naar de juiste paden.

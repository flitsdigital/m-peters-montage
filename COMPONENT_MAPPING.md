# COMPONENT MAPPING — Webflow class → Astro component

Legenda: **A** = atom · **M** = molecule · **S** = section (organism) · **L** = layout

---

## Sections (organisms)

| Webflow class | Astro component | Lvl | ×  | Sanity block | Props / slots |
|---|---|:--:|--:|---|---|
| `nav_wrap` + `nav_menu` | `sections/Navbar.astro` | S | 31 | `siteSettings.nav` | `links[]`, `dropdown[]`, `cta`, `logo` — island voor menu-toggle |
| `footer-new` | `sections/Footer.astro` | S | 31 | `siteSettings.footer` | `columns[]`, `contact`, `bottom` |
| `section_home-hero` | `sections/HeroHome.astro` | S | 1 | `heroHomeSection` | `image`, `overlayOpacity`, `rating`, `heading`, `body`, `button` |
| `section_header-centered` | `sections/HeaderCentered.astro` | S | 34 | `headerCenteredSection` | `image?`, `overlayOpacity`, `breadcrumbs?`, `eyebrow?`, `heading`, `body?`, `button?`, `contactItems?` |
| `section_content-header` | ↳ zelfde component, `variant="plain"` | S | 1 | idem | geen achtergrondbeeld |
| `section_content` | `sections/SectionMedia.astro` | S | 41 | `mediaSection` | `mediaPosition: 'left'`, `mediaCols: 6`, `eyebrow`, `heading`, `body`, `button?` |
| `section_over` | ↳ zelfde component, `variant="over"` | S | 14 | idem | `mediaPosition: 'right'`, `mediaCols: 5`, overhangende afbeelding |
| `section_content-centered` | `sections/SectionContentCentered.astro` | S | 1 | `contentCenteredSection` | `eyebrow`, `heading`, `body`, `button?` |
| `section_rich-text` | `sections/SectionRichText.astro` | S | 32 | `richTextSection` | `content` (Portable Text), `background?` |
| `section_werkwijze` | `sections/SectionWerkwijze.astro` | S | 12 | `werkwijzeSection` | `eyebrow`, `heading`, `intro`, `steps[]` |
| `section_reviews` | `sections/SectionReviews.astro` | S | 15 | `reviewsSection` | `eyebrow`, `heading`, `intro` — items uit `review`-docs · island (Swiper) |
| `section_projecten` | `sections/SectionProjecten.astro` | S | 14 | `projectenSection` | `eyebrow`, `heading`, `intro`, `filterTag?` — items uit `project`-docs · island (Swiper) |
| `section_faq` | `sections/SectionFaq.astro` | S | 17 | `faqSection` | `eyebrow`, `heading`, `items[]` (2 kolommen) · island (accordeon) |
| `section_contact` | `sections/SectionContact.astro` | S | 31 | `contactSection` | `eyebrow`, `heading`, `body`, `formHeading` |
| `section_diensten` | `sections/SectionDiensten.astro` | S | 1 | `dienstenSection` | `eyebrow`, `heading`, `intro`, `items[]` |
| `section_blog-items` | `sections/SectionCardGrid.astro` | S | 3 | `cardGridSection` | `source: 'blog' \| 'project'`, `heading`, `columns` |
| `section_blog-content` | `sections/SectionBlogContent.astro` | S | 1 | — (vast op blogroute) | `body` (Portable Text) |
| `section_project-images` | `sections/SectionProjectImages.astro` | S | 1 | — (vast op projectroute) | `intro`, `images[]` · island (lightbox) |
| `section_regio` | `sections/SectionRegio.astro` | S | 1 | `regioSection` | `items[]` |
| `section_links` | `sections/SectionLinks.astro` | S | 1 | `linksSection` | `links[]` |
| `hero_utility-page_wrap` | `sections/HeroUtility.astro` | S | 2 | — | `title`, `text?` |
| `page_main` | `layouts/BaseLayout.astro` | L | 33 | — | `<slot>`, SEO, GTM, JSON-LD |
| `section_wrapper` (`is-top`) | prop `wrapped` op de sectie zelf | — | 48 | `wrapper: boolean` | 1rem padding rondom; `is-top` = geen top-padding |

### Dedup-beslissingen

- **`section_content` + `section_over` → één `SectionMedia`.** Beide zijn tekst+beeld op
  het 12-koloms grid; ze verschillen alleen in kolomverdeling, volgorde en of de
  afbeelding overhangt. Twee componenten zou 55 instanties van bijna identieke markup
  opleveren. Één component met `mediaPosition` + `variant` dekt beide 1-op-1.
- **`section_header-centered` + `section_content-header` → één `HeaderCentered`.**
  Verschil is puur wel/geen achtergrondbeeld (`variant="plain"`).
- **`section_blog-items` (blogs én projecten) → één `SectionCardGrid`.** Zelfde grid,
  zelfde kaart-markup, andere bron.
- **`section_reviews` / `section_projecten` blijven apart.** Andere swiper-config,
  andere kaart, andere layout — samenvoegen zou een configuratie-monster worden.

---

## Molecules

| Webflow class(es) | Astro component | ×  | Gebruikt in |
|---|---|--:|---|
| `nav_link`, `nav_dropdown-w`, `nav_dropdown-item` | `molecules/NavDropdown.astro` | 31 | Navbar |
| `nav_menu-link-wrap` + `nav_menu-link` | `molecules/NavMenuLink.astro` | 155 | Navbar (overlay) |
| `breadcrumbs_wrapper` / `_slot` / `_item` | `molecules/Breadcrumbs.astro` | 14 | HeaderCentered |
| `g_visual_wrap` + `_background` + `_img` + `_overlay` | `molecules/Visual.astro` | 101 | overal (achtergrond-/coverbeeld) |
| `reviews_item` + `_stars-wrap` + `_quote-wrap` + `_name` | `molecules/ReviewCard.astro` | 15 | SectionReviews |
| `project-item` / `project_visual` / `project_item_content` / `project_category` | `molecules/ProjectCard.astro` | 15 | SectionProjecten |
| `blog-items_wrapper` + `_img` + `_content` | `molecules/BlogCard.astro` | 2 | SectionCardGrid |
| `diensten_item` + `_img-wrap` + `_content-wrap` | `molecules/DienstCard.astro` | 6 | SectionDiensten |
| `diensten_link-wrap` + `_link-icon1/2` + `diensten_text` | `molecules/ReadMoreLink.astro` | 21 | DienstCard, ProjectCard |
| `werkwijze_item` + `werkwijze_number` | `molecules/WerkwijzeStep.astro` | 27 | SectionWerkwijze |
| `faq_item` + `faq_title` + `faq_answer-wrap` | `molecules/FaqItem.astro` | 86 | SectionFaq |
| `regio_item` + `_image-wrap` + `_content` + `_icon` | `molecules/RegioCard.astro` | 1 | SectionRegio |
| `contact_item` + `contact_icon` | `molecules/ContactItem.astro` | 2 | HeaderCentered, Footer |
| `form_main_wrap` + `_list` + `_success/_error` | `molecules/ContactForm.astro` | 33 | SectionContact |
| `footer_links` + `_links-header` + `_links-wrapper` | `molecules/FooterLinkGroup.astro` | 155 | Footer |
| `swiper` + `swiper-button-*` + `swiper-pagination` | `molecules/Slider.astro` | 29 | SectionReviews, SectionProjecten |

---

## Atoms

| Webflow class(es) | Astro component | ×  | Varianten / props |
|---|---|--:|---|
| `btn_main_wrap` + `btn_bg` + `btn_main_text` + `btn_icon-wrap` + `g_clickable_*` | `atoms/Button.astro` | 141 | `style: primary\|secondary` (`data-button-style`), `as: a\|button`, `icon`, `cutouts: boolean` |
| `btn_cutout` | `atoms/Cutout.astro` | 208 | `pos: top-left\|bottom-right`, `size: small\|large`, `background: primary\|secondary` |
| `btn_link` | `atoms/TextLink.astro` | 2 | tekstlink met icoon |
| `eyebrow_layout` + `_icon-wrap` + `_text` | `atoms/Eyebrow.astro` | 105 | `variant: default\|secondary` (`is-secondary`), `icon`, `text` |
| `u-text-style-h1…h6 / display / large / main / small` | `atoms/Heading.astro` + `atoms/Text.astro` | 220 | `level`, `style`, `align`, `weight`, `clamp` |
| `u-rich-text` / `w-richtext` | `atoms/RichText.astro` | 72 | Portable Text renderer met de originele `u-rich-text` typografie |
| `icon-s` / `iconify` / inline `<svg>` | `atoms/Icon.astro` | 43 | `name`, `size` — SVG-sprite in `src/icons/` |
| `nav_logo` / `footer_logo` | `atoms/Logo.astro` | 62 | `variant: nav\|footer` |
| `footer_flits` + `#flitsLogo` | `atoms/FlitsLogo.astro` | 31 | eigen hover-animatie |
| `reviews_star` | `atoms/StarRating.astro` | 75 | `count` |
| `form_main_field_input` (text/email/tel) | `atoms/Input.astro` | 195 | `type`, `name`, `label`, `placeholder`, `required` |
| `form_main_field_input is-message` | `atoms/Textarea.astro` | 33 | `rows`, `maxlength` |
| `form_main_field_input w-select` | `atoms/Select.astro` | 4 | `options[]` |
| `form_main_label` | `atoms/Label.astro` | 204 | `weight` |
| `g_visual_img` | `atoms/Image.astro` | 101 | Astro `<Image>` wrapper, `loading`, `sizes` |
| `divider` | `atoms/Divider.astro` | 31 | 25% hoge overlay onderaan section_contact |
| `background_secondary` | inline in de sectie | 46 | absolute achtergrondlaag |

---

## Globale CSS-laag (géén component)

Deze blijven globaal in `base.css` — het zijn het grid- en spacing-systeem waar de
pixel-fidelity op leunt. Niet omzetten naar componenten, niet "opschonen".

| Class / attribuut | Rol |
|---|---|
| `u-container` / `-small` / `-full` | max-width + sectiepadding |
| `u-grid-desktop` | 12-koloms grid, klapt op 767 naar flex-column |
| `u-column-1…12`, `u-column-custom`, `u-column-indent`, `u-column-centered` | grid-plaatsing |
| `u-grid-column-2/3`, `u-grid-custom`, `u-grid-autofit` | subgrids |
| `data-padding-top/bottom="none\|even\|small\|main\|large"` | sectiespacing |
| `u-mt-*` / `u-mb-*` / `u-gap-*` / `u-gap-row-*` | spacing-stappen |
| `u-block-gap`, `u-block-gap-vertical` | gap-systeem voor inline-block groepen |
| `u-vflex-*` / `u-hflex-*` | flex-uitlijning |
| `u-cover-absolute` | absolute inset-0 |
| `u-text-align-*`, `u-weight-*`, `u-line-clamp-*`, `u-text-2lines` | tekst-helpers |
| `u-sr-only`, `u-hide-if-empty`, `u-display-none`, `hide-mobile` | zichtbaarheid |
| margin-trim regels (`:not(.u-margin-trim-off) > …`) | eerste/laatste marge weghalen |
| `data-theme`, `data-background`, `data-button-style` | theming |

---

## Wat verdwijnt

| Webflow-artefact | Reden |
|---|---|
| `styleguide_*` (42 classes) | Vervangen door eigen levende `/styleguide` |
| `w-dyn-list` / `w-dyn-item` / `w-dyn-empty` / `w-dyn-bind-empty` | CMS-placeholders |
| `w-inline-block`, `w-nav`, `w-slider`, `w-tabs`, `w-lightbox` | Webflow-runtime |
| `data-wf-page`, `data-wf-site`, `w--current` | Webflow-metadata (`w--current` → `aria-current`) |
| `page_code_*` / `w-embed` divs | Inline style-embeds → `tokens.css` / `themes.css` / `base.css` |
| `.footer_logo-wrap.u-column-custom` | Dode CSS-regel (§8.3 in ANALYSE.md) |
| `.hero_placeholder_contain`, `.div-block`, `.heading-2` | Ongebruikte restanten |
| jQuery | Alle interacties worden vanilla / GSAP |

---

## Sanity `page.sections[]` union (voorstel)

```ts
of: [
  { type: 'heroHomeSection' },
  { type: 'headerCenteredSection' },
  { type: 'mediaSection' },              // section_content + section_over
  { type: 'contentCenteredSection' },
  { type: 'richTextSection' },
  { type: 'werkwijzeSection' },
  { type: 'reviewsSection' },
  { type: 'projectenSection' },
  { type: 'faqSection' },
  { type: 'contactSection' },
  { type: 'dienstenSection' },
  { type: 'cardGridSection' },
  { type: 'regioSection' },
  { type: 'linksSection' },
  { type: 'flexibleSection' },           // vrije blokken
]
```

Elk sectieblok krijgt daarnaast dezelfde drie prop-velden die het origineel ook heeft:
`theme` (`light|dark|invert|inherit`), `paddingTop` / `paddingBottom`
(`none|even|small|main|large`) en `wrapper` (boolean, voor `section_wrapper`).

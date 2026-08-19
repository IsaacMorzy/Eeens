---
version: alpha
name: eens-business-park
description: "A premium B2B-first real estate design system for Kenyan industrial property and B2C premium apartments. It balances technical architectural restraint with warm sunlight readability (light defaults), utilizing sharp navy structural forms and cyan-teal accents to project trust, precision, and clarity."
based-on: linear.app
date-locked: 2026-06-22
status: approved
confidence: 99%

# ============================================================================
# COLORS — Linear's surface ladder re-keyed for Eens (HEX + OKLCH).
# ============================================================================
colors:
  canvas-light:
    hex: "#FAFAF9"
    oklch: "0.98 0.005 85"
  canvas-dark:
    hex: "#0F172A"
    oklch: "0.20 0.04 265"
  surface-1-light:
    hex: "#FFFFFF"
    oklch: "1 0 0"
  surface-1-dark:
    hex: "#1E293B"
    oklch: "0.27 0.04 265"
  surface-2-light:
    hex: "#F5F5F4"
    oklch: "0.96 0.005 85"
  surface-2-dark:
    hex: "#334155"
    oklch: "0.38 0.03 265"
  primary:                                  # cyan-teal, single restrained accent
    hex: "#0e7490"
    oklch: "0.52 0.09 235"
  primary-hover:                            # hovered state, darker
    hex: "#155e75"
    oklch: "0.45 0.08 235"
  primary-focus:                            # focus ring tint
    hex: "#0e7490"
    oklch: "0.52 0.09 235"
  primary-dark:                             # dark-mode ladder-up
    hex: "#67e8f9"
    oklch: "0.86 0.11 235"
  action-primary:                           # high-priority action on light surfaces
    hex: "#0F172A"
    oklch: "0.20 0.04 265"
  action-primary-hover:                     # slate hover state
    hex: "#1E293B"
    oklch: "0.27 0.04 265"
  action-primary-dark:                      # high-priority action in dark mode
    hex: "#67e8f9"
    oklch: "0.86 0.11 235"
  ink-light:                                # navy appears as ink on light surfaces
    hex: "#0F172A"
    oklch: "0.20 0.04 265"
  ink-dark:                                 # warm white ink on dark surfaces
    hex: "#FAFAF9"
    oklch: "0.98 0.005 85"
  hairline-steel:                           # structural 1px hairlines for B2B spec sheets
    hex: "#5d7290"
    oklch: "0.55 0.04 220"
  semantic-success:                         # status pills, success indicators only
    hex: "#10B981"
    oklch: "0.65 0.15 150"
  semantic-overlay:                         # modal scrim
    hex: "#0F172A"
    oklch: "0.20 0.04 265"
    opacity: 0.5

# ============================================================================
# TYPOGRAPHY — display + body + mono.
# ============================================================================
typography:
  display: Plus Jakarta Sans                # free, on Google Fonts
  body: Inter Variable                      # already in package.json
  mono: JetBrains Mono                      # property IDs, sq footage, contracts

# ============================================================================
# RADII & SPACING — Linear values, base radius tightened to 0.5rem.
# ============================================================================
rounded:
  xs: "0.25rem"                             # 4px — chips, status badges
  sm: "0.375rem"                            # 6px — inline tags
  md: "0.5rem"                              # 8px — buttons, form inputs (TIGHTER than Linear's 8)
  lg: "0.75rem"                             # 12px — pricing/feature cards
  xl: "1rem"                                # 16px — property imagery tiles
  xxl: "1.5rem"                             # 24px — oversized CTA banners
  pill: "9999px"                            # pricing-tab toggles, availability badges
  full: "9999px"                            # avatar circles

spacing:
  xxs: "4px"
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  xxl: "48px"
  section: "96px"                           # vertical rhythm between major sections

# ============================================================================
# COMPONENTS — Linear's catalogue, re-keyed for real estate.
# ============================================================================
components:
  keep:
    - button-primary
    - button-secondary
    - button-tertiary
    - button-inverse
    - button-action                  # high-priority action; navy light / cyan-teal dark
    - pricing-tab-default
    - pricing-tab-selected
    - pricing-card
    - feature-card
    - testimonial-card
    - customer-logo-tile                     # repurposed: location chip (see below)
    - text-input
    - cta-banner
    - status-badge
    - top-nav
    - footer
    - changelog-row
  remove:
    - product-screenshot-card                # replaced by property-card
  add:
    - property-card                          # heavy structural tile
    - property-card-featured                 # lifted variant
    - location-pin                          # Tabler map-pin glyph
    - availability-badge                     # For Rent / For Sale / Upcoming

# ============================================================================
# EENS-TOKENS — direct mapping into `src/styles/global.css` `:root` + `.dark`.
# These are the EXACT variable names already wired in eensbpark's Tailwind v4
# `@theme inline` block. Hex decisions above translate to OKLCH below using
# P3 gamut approximations; fine-tune if visible banding in production.
# ============================================================================
eens-tokens:
  root:
    background: "oklch(0.98 0.005 85)"
    foreground: "oklch(0.20 0.04 265)"
    card: "oklch(1 0 0)"
    card-foreground: "oklch(0.20 0.04 265)"
    popover: "oklch(1 0 0)"
    popover-foreground: "oklch(0.20 0.04 265)"
    primary: "oklch(0.52 0.09 235)"
    primary-foreground: "oklch(0.98 0.005 85)"
    secondary: "oklch(0.96 0.005 85)"
    secondary-foreground: "oklch(0.20 0.04 265)"
    muted: "oklch(0.92 0.01 85)"
    muted-foreground: "oklch(0.43 0.02 85)"
    accent: "oklch(0.96 0.005 85)"
    accent-foreground: "oklch(0.20 0.04 265)"
    destructive: "oklch(0.60 0.22 25)"
    border: "oklch(0.92 0.01 85)"
    input: "oklch(0.92 0.01 85)"
    ring: "oklch(0.52 0.09 235)"
    chart-1: "oklch(0.52 0.09 235)"          # primary cyan-teal — first chart series
    chart-2: "oklch(0.27 0.04 265)"          # navy surface — second chart series
    chart-3: "oklch(0.62 0.10 220)"          # steel-blue mid — third series
    chart-4: "oklch(0.45 0.08 235)"          # primary-hover — fourth series
    chart-5: "oklch(0.55 0.04 220)"          # hairline-steel — fifth series
    radius: "0.5rem"
    font-sans: "'Inter Variable', system-ui, sans-serif"
    font-display: "'Plus Jakarta Sans', 'Plus Jakarta Sans Fallback', system-ui, sans-serif"
    font-mono: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
  dark:
    background: "oklch(0.20 0.04 265)"
    foreground: "oklch(0.98 0.005 85)"
    card: "oklch(0.27 0.04 265)"
    card-foreground: "oklch(0.98 0.005 85)"
    popover: "oklch(0.27 0.04 265)"
    popover-foreground: "oklch(0.98 0.005 85)"
    primary: "oklch(0.86 0.11 235)"
    primary-foreground: "oklch(0.20 0.04 265)"
    secondary: "oklch(0.27 0.04 265)"
    secondary-foreground: "oklch(0.98 0.005 85)"
    muted: "oklch(0.27 0.04 265)"
    muted-foreground: "oklch(0.65 0.03 265)"
    accent: "oklch(0.27 0.04 265)"
    accent-foreground: "oklch(0.98 0.005 85)"
    destructive: "oklch(0.60 0.22 25)"
    border: "oklch(0.55 0.04 220)"
    input: "oklch(0.55 0.04 220)"
    ring: "oklch(0.86 0.11 235)"
    chart-1: "oklch(0.86 0.11 235)"          # primary-dark (cyan-300) — bright on navy
    chart-2: "oklch(0.55 0.04 220)"          # hairline-steel — mid-tone series
    chart-3: "oklch(0.62 0.10 220)"          # steel-blue mid — third series
    chart-4: "oklch(0.45 0.08 235)"          # primary-hover — fourth series
    chart-5: "oklch(0.27 0.04 265)"          # surface-1-dark — fifth series
    font-display: "'Plus Jakarta Sans', system-ui, sans-serif"
    font-mono: "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace"
  theme-inline-additions:
    font-display: "var(--font-display)"               # mirrors the existing --font-sans: var(--font-sans) pattern
    font-mono: "var(--font-mono)"
    sidenote: "font-sans already mapped via existing @theme inline block; do not duplicate."
  fallback-font-face:
    family: "Plus Jakarta Sans Fallback"
    src: "local('Arial')"
    ascent-override: "88.79%"                           # kept in sync with Plus Jakarta Sans metrics
    descent-override: "26.94%"
    line-gap-override: "0%"
    size-adjust: "110.32%"
    purpose: "prevents CLS on the Plus Jakarta Sans swap, mirrors the existing Inter Fallback @font-face block."

# ============================================================================
# DECORATIVE REPLACEMENTS — space theme purged.
# ============================================================================
decorative-replacements:
  architectural-grid: "1px faint hairline grid in #5d7290 at 64px pitch, mapped as subtle SVG overlay behind the hero only. Replaces `src/components/space/Starfield.astro`'s `starfield` decorative ID."
  deleted:
    - src/components/space/Starfield.astro
    - src/components/space/Planet.astro
    - src/components/space/OrbitRings.astro
    - src/components/space/Aurora.astro
    - src/components/space/ConstellationDivider.astro

# ============================================================================
# LOGO — wordmark + icon glyph, clear-space rules.
# ============================================================================
logo:
  wordmark: "Eens"
  font: "Plus Jakarta Sans, weight 600, 28px cap-height"
  ink-light: "#0F172A"
  ink-dark: "#FAFAF9"
  glyph:
    shape: "16×16 px square (svg-safe)"
    background: "#0F172A"
    letter: "E in #FFFFFF, centered, 12px cap-height"
    accent-dot: "2×2 px cyan-teal #0e7490, centered below the E, 2px from bottom edge"
  clear-space: "Always minimum 14px (half cap-height) on every side"
  minimum-sizes:
    wordmark: "14px cap-height"
    glyph: "16×16 px"

# ============================================================================
# END FRONTMATTER — design tokens locked. Sections below are prose.
# ============================================================================

---

## Overview

Eens Business Park is a Kenyan real-estate operator covering industrial leasing (warehouses, godowns, business parks along Mombasa Road / Syokimau / Baba Dogo) and premium residential sale (3-bedroom apartments in Thika, etc.). This design system is built by adapting Linear's strict visual hierarchy and disciplined single-accent language into a domain where trust, square footage, and address are the only things that matter.

The aesthetic drops the abstract "tech space" motif (starfields, planets, orbits, aurora) entirely. In its place: deep navy structures that read as architectural elevations, cyan-teal accents that read as wayfinding on a plan, and 1px steel-blue hairlines that frame B2B spec sheets the way a printer's plate frames an engineering drawing.

Light is the default canvas — Kenya is bright, listings photograph best on warm off-white. Dark mode is reserved for power-user sessions (filters, dashboards) and swaps the navy into the surface-1 role.

## Colors

### Brand & Accent

- **Primary accent** `#0e7490` (cyan-teal, Tailwind cyan-700) — the single chromatic accent. Used for: brand mark, ordinary primary actions, link emphasis, focus ring, and eyebrow tags. NEVER as a decorative section background. NEVER as a card fill.
- **High-priority action pair** — navy `#0F172A` with warm-white text on light surfaces; cyan-teal `#67e8f9` with navy text in dark mode. This is the `button-action` treatment for scheduling and other section-primary conversions.
- **Primary hover** `#155e75` (cyan-800) — pressed/active state, slightly darker.
- **Primary focus** `#0e7490` — same hue, applied at 50% opacity as a 2px ring around form fields and focused buttons.
- **Primary dark** `#67e8f9` (cyan-300) — lightened for dark-mode usage so it stays legible against the navy `#0F172A` background.

### Surface

- **Canvas light** `#FAFAF9` — warm slate off-white. The default page background. Imperceptibly warmer than plain `#FFFFFF` to ease eye strain in Kenyan sunlight.
- **Canvas dark** `#0F172A` — Tailwind slate-900. Default in dark mode; also serves as the navy structural ink.
- **Surface 1 light** `#FFFFFF` — lift for cards on the light canvas.
- **Surface 1 dark** `#1E293B` — slate-800. Cards in dark mode.
- **Surface 2 light** `#F5F5F4` — neutral mid-surface for filtered/featured cards.
- **Surface 2 dark** `#334155` — slate-700. Featured cards in dark mode.
- **Hairline** `#5d7290` (steel-blue) — 1px borders on cards, dividers, B2B spec tables.

### Text

- **Ink light** `#0F172A` — every headline and emphasized body type on light surfaces.
- **Ink dark** `#FAFAF9` — every headline and emphasized body type on dark surfaces.
- **Muted ink light** `#64748B` — secondary captions and meta.
- **Subtle ink light** `#94A3B8` — tertiary legal text and footnotes.

### Semantic

- **Success** `#10B981` — availability pills ("Available", "Reserved").
- **Destructive** `#EF4444` — error states only.
- **Overlay** `#0F172A` at 50% opacity — modal scrims.

## Typography

### Font families

- **Plus Jakarta Sans** — display sans, weights 500/600/700, free on Google Fonts. Replaces Linear Display.
- **Inter Variable** — body sans, currently `@fontsource-variable/inter` in `package.json`. Replaces Linear Text. Keep the existing `Inter Fallback` Arial metric-match override to avoid CLS on font swap.
- **JetBrains Mono** — mono, weight 400. Reserved for property IDs, lease reference codes, square-footage figures in cards, and `:root` cursor tokens.

### Hierarchy

| Token | Font | Size | Weight | Line height | Tracking | Use |
|---|---|---|---|---|---|---|
| display-xl | Plus Jakarta Sans | 80px | 600 | 1.05 | -3.0px | Hero headline on the B2B landing |
| display-lg | Plus Jakarta Sans | 56px | 600 | 1.10 | -1.8px | Section openers ("Industrial leasing", "Premium apartments") |
| display-md | Plus Jakarta Sans | 40px | 600 | 1.15 | -1.0px | Sub-section headlines |
| headline | Plus Jakarta Sans | 28px | 600 | 1.20 | -0.6px | Pricing tier titles, CTA banner heading |
| card-title | Plus Jakarta Sans | 22px | 500 | 1.25 | -0.4px | `property-card` title |
| subhead | Plus Jakarta Sans | 20px | 400 | 1.40 | -0.2px | Lead paragraphs |
| body-lg | Inter Variable | 18px | 400 | 1.50 | -0.1px | Hero subhead, location descriptions |
| body | Inter Variable | 16px | 400 | 1.50 | -0.05px | Default body |
| body-sm | Inter Variable | 14px | 400 | 1.50 | 0 | Card body, footer columns |
| caption | Inter Variable | 12px | 400 | 1.40 | 0 | Captions, meta, sq-ft annotations |
| button | Inter Variable | 14px | 500 | 1.20 | 0 | All button labels |
| eyebrow | Inter Variable | 13px | 500 | 1.30 | +0.4px | Section eyebrow (lowercase or SC, cyan-teal) |
| mono | JetBrains Mono | 13px | 400 | 1.50 | 0 | Property IDs, sq footage in mono |

### Display-tracking principle

Aggressive negative tracking scales from `-3.0px` at 80px down to `0` at body. Display weight pairs with body weight (`600` ↔ `400`); resist 700+ display weights.

### Eyebrow rule

Always cyan-teal (`var(--primary)`), 13px, weight 500, +0.4px tracking. ALWAYS uppercase for taxonomy labels ("INDUSTRIAL LEASING", "PREMIUM APARTMENTS"). NEVER used for decorative purposes.

## Layout

### Spacing

Base unit 4px; tokens `xxs/xs/sm/md/lg/xl/xxl/section`. Section padding scales from `96px` desktop → `48px` mobile. Card interior padding `24px` on feature/pricing cards, `32px` on testimonial cards, `48px` on CTA banners.

### Grid

- Max content width: 1280px.
- Property card grid: 3-up desktop → 2-up tablet → 1-up mobile.
- Pricing card grid: 3-up desktop, accordion below 768px.
- Stats strip: 4-up equal columns across desktop, 2-up on mobile.

### Whitespace philosophy

The warm off-white canvas IS the whitespace. Sections separate by lift onto a `surface-1-light` white panel; never by gaps in shade. Inside a panel, generous 24px gaps between blocks; 96px between sections.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 (flat) | No shadow, no border | Body, hero text, footer |
| 1 (lift) | `surface-1-light` (#FFFFFF) bg on light canvas + 1px hairline  | Default cards, property cards |
| 2 (featured lift) | `surface-2-light` (#F5F5F4) bg + 1px `hairline-strong` | Featured property, pricing featured tier |
| 3 (focus ring) | 2px `primary` outline at 50% opacity | Focused inputs, focused buttons |

The navy `#0F172A` does double duty — in dark mode it's the canvas; in light mode it appears as the **structural ink** (body type, eyebrows) and as a rare INVERSE surface for "Back to dark" callouts.

## Glassmorphism & Micro-interactions

Glass is a **chrome treatment only**. It reads like tinted curtain-wall on the fixed header, mega menu, mobile panel, and floating controls, and like a frosted contact sheet on the footer card — never on property evidence. The direction is sleek architectural: sharp navy structure, moody dark glass in dark mode, restrained light frosted panels on the warm canvas. Micro-interactions are hover/click-driven (no scroll-jacking), and every motion is reduced-motion aware.

### Glass tokens

- `.glass` — light-mode frosted panel: `--card` at 72% fill + `blur(14px) saturate(1.4)` + hairline border. Dark mode drops the fill to 58% for a moodier pane.
- `.glass-dark` — dark-surface frosted panel (footer, dark chrome): `--canvas-dark` at 55% + `blur(14px) saturate(1.2)`.
- Both are gated on `backdrop-filter` support with a solid fallback, so unsupported browsers get an opaque panel, never a see-through one.
- `.accent-hairline` — cyan-teal gradient hairline for the mega-menu top accent. Decorative only on chrome.

### Where glass is allowed

- **Allowed:** fixed header, desktop mega menu, mobile nav panel, theme-toggle chip, footer contact card, featured-park cards.
- **Never:** property cards, spec sheets, imagery, or any surface that carries a price, area, availability, or lease term.

### Why glass works here (and where it fails)

Glass is a stabilizer: it keeps text readable over busy photography without hiding the image. That is exactly the chrome job — the header and menus float over scrolling property photos. On a factual register, a blurred surface behind a price or sq-ft figure would fight the evidence, so property surfaces stay opaque. Blur is also a paint cost: `backdrop-filter` over large areas can hurt LCP/INP on low-end devices, so blur stays ≤14px, glass surfaces stay small, and nothing glassy sits on the LCP image path.

### Micro-interaction patterns

Micro-interactions are restrained and always gated on `motion-safe` / `prefers-reduced-motion`:

- **Hover lift:** cards and menu items translate up 1px with a hairline border tint.
- **Icon morphs:** the hamburger morphs to an X (two 2px lines rotating 45°, 240ms); the theme toggle crossfades sun ↔ moon (opacity + rotate/scale, 420ms).
- **Entrance:** the mega panel fades in and rises 6px over 160ms.
- **Arrow nudges:** `arrow-up-right` shifts 2px on group hover.
- Transitions specify only the changing properties (transform, opacity, color) — never `transition: all`.

## Shapes

### Radius scale

| Token | Value | Use |
|---|---|---|
| `xs` | 0.25rem (4px) | Status pills, "KSH 35" price chips |
| `sm` | 0.375rem (6px) | Inline tags, footer nav links |
| `md` | 0.5rem (8px) | All buttons, form inputs |
| `lg` | 0.75rem (12px) | Pricing cards, feature cards, testimonial cards |
| `xl` | 1rem (16px) | Property-tile, property detail imagery |
| `xxl` | 1.5rem (24px) | Oversized CTA banners |
| `pill` | 9999px | Pricing tab toggles, availability badges |

### Photography geometry

- All property imagery strictly **16:9** or **4:3** aspect ratio.
- Tiles use `{rounded.xl}` 16px corners.
- Avatar circles (testimonial cards, contact-team) use `{rounded.full}` at 32–40px sizes.
- **Forbidden**: decoratively cropped wide-angle hero shots that lose the property's address-sign or godown roofline.

## Components

### Buttons

- **button-primary** — Cyan-teal `#0e7490` background, white text, 8px/14px padding, 8px radius. Hover → `#155e75`. Focus → 2px `#0e7490` ring at 50%.
- **button-secondary** — Off-white `#FFFFFF` background, 1px `#5d7290` hairline border, navy `#0F172A` text, 8px/14px padding, 8px radius. Hover → `--primary-hover` border.
- **button-tertiary** — No background, navy `#0F172A` text. On dark surfaces swap to cyan-teal `#67e8f9` text.
- **button-inverse** — Navy `#0F172A` background, cyan-teal `#67e8f9` text. Used inside dark sections.
- **button-action** — high-priority conversion action for "Schedule a viewing". Navy `#0F172A` background with warm-white `#FAFAF9` text on light surfaces; hover → slate `#1E293B`. In dark mode it becomes cyan-teal `#67e8f9` with navy text. Use once per section and never for navigation, secondary actions, or decoration.

### Cards

- **property-card** (NEW, price-forward) — the standard modern real-estate listing card. `surface-1-light` background, 1px hairline, 16px radius, hover lifts 1px and tints the border to primary-hover. Structure top-to-bottom:
  1. **Photo-led 16:9 tile** — `surface-2-light` placeholder, lazy-loaded WebP, `image-outline`, hover scale 1.02. The `availability-badge` sits top-right on a frosted chip; the photo source link sits bottom-right in mono.
  2. **Type eyebrow + reference** — 12px cyan-teal uppercase type label (`SHOP UNIT`, `WAREHOUSE`…) with a Tabler glyph, reference code (mono, e.g. `EE-MLO-014`) right-aligned.
  3. **Title** — 22px Plus Jakarta Sans, links to the listing.
  4. **Address** — 14px muted with a `map-pin` glyph.
  5. **Price as the anchor** — a hairline-divided row: "PRICE / RATE" label (mono, 11px) over a prominent 20px display KSH figure, with the per-sq-ft rate (mono) right-aligned. The price is the first thing the eye lands on after the photo.
  6. **Mono spec rail** — a 3-cell hairline-divided `dl`: Area · Zone · Term, each labelled in mono 10px with a glyph and the fact in 13px mono. This is the single source of facts; zone is NOT repeated elsewhere on the card.
  7. **Footer row** — development/park name (mono, truncated) on the left, one clear `button-secondary` "View property" CTA with `arrow-up-right` on the right.
- **property-card-featured** (NEW) — `surface-2-light` background, otherwise identical structure. Used for directory grids and the "Current listings" sections.

### Modern listing-site patterns (applied across all pages)

- **Listing search bar** — a `ListingSearch` block (Tina-editable) renders a single search surface with three controls: property type, zone, and availability, plus one action. On submit it resolves the target directory from the chosen type (falling back to the configured all-types link, default `/locations`) and carries `?zone=` + `?availability=` through, so the visitor lands on the published register already filtered. All visible copy is editable in Tina; the option vocabulary stays in sync with the property collection.
- **Availability toggle** — every category directory filters by availability with a segmented pill toggle (Any / For Rent / For Sale / Upcoming), alongside zone, minimum area, and minimum power (industrial only). The param is `?availability=ForRent` and is persisted by `linkWith`. The toggle uses the `action` (navy/cyan-teal) treatment for the selected segment — the same high-priority pair as the primary CTA.
- **PropertyList block** — editors set `filterType`, `filterZone`, and `filterAvailability` in Tina; the block renders the published records that match, never fabricating availability.
- **Sort control** — every category directory offers a sort select (Featured / Price high→low / Price low→high / Area largest / Newest first) in the register header, `?sort=` persisted. Works server-side on the initial render and client-side without a reload; the sort select lives outside the filter form but is associated to it via the `form` attribute so GET submits and `FormData` both carry it. Numeric keys parse the same free-text figures as the filters (`parsePriceKsh`, `parseSqft`) and fall back to register order on ties.
- **Detail-page gallery** — the property `gallery` field (Tina-editable) renders as a 4-up lazy thumbnail strip under the hero when populated; pages without gallery images are untouched.
- **Sticky mobile viewing bar** — on listing detail pages, a fixed bottom bar (mobile only, `md:hidden`) shows the KSH figure and a "Schedule a viewing" action so the price and next step stay reachable while scrolling.
- **Register proof rail** — the home hero's proof rail is computed from the live register (published listings, total sq ft, operating zones) instead of static copy, so it never drifts from the data.
- **Viewing inquiry form** — an `InquiryForm` block (Tina-editable copy) composes a mailto message to the configured office address: name, email, phone (optional), listing reference, message. Listing detail pages render the same form with the reference prefilled (readonly), so every listing has its own request-a-viewing flow with no backend.
- **Saved listings** — every property card carries a heart toggle (top-left on the photo) persisting to localStorage (`eens:saved`, keyed by listing href). Directory pages add a "Saved" pill filter that shows only saved records of that register, with a live saved count. A `/saved` page (linked from the header) pre-renders every public listing as a hidden card and reveals only saved ones client-side, so the full register is available without a backend. The feature is client-side only: the saved state never enters the URL or the server render.
- **Listing comparison** — every property card carries a compare toggle (the `git-compare` branching glyph, under the heart) persisting to localStorage (`eens:compare`, keyed by listing href, capped at three in insertion order). A global compare tray (fixed bottom-right pill) surfaces the count and links to `/compare` once two or more are selected; it stays inert at one with a "pick one more" hint. The `/compare` page embeds the comparison-relevant facts of every public listing as a JSON island and renders a side-by-side table — image, title, price as the header, then address, zone, type, availability, area, price, per-sq-ft, lease term, bedrooms/bathrooms, and the spec sheet — omitting rows where no selected listing has a value. Facts are read from the same published register; nothing is fabricated.
- **Area map** — listing detail pages embed a lazy OpenStreetMap iframe centered on the property's zone (area-level coordinates from `zone-coordinates.ts`, not a fabricated pin), captioned "Area reference — not to scale" with an "Open in OpenStreetMap" link. Exact plot coordinates are not part of the register and are never shown.
- **Listing schema** — every detail page emits `RealEstateListing` JSON-LD (name, url, image, datePosted when published, address, and an `Offer` with the parsed KES price when one exists). Markup only includes facts that are on the page; `Upcoming` maps to `PreOrder`, everything else to `InStock`.
- **Price-forward cards** — the price or rate is the anchor of every listing card and the sticky aside on every detail page. Mono figures (`tabular-nums`) for every measured fact.
- **Directory map** — a schematic SVG zone map on directory pages links to the zone-filtered register; marked "not to scale".
- **Spec sheets** — industrial listings render power/water/parking/floor-loading/clear-height as a hairline grid on the detail page; apartments render bedrooms/bathrooms instead.
- **pricing-card** — kept from Linear, re-keyed: `surface-1-light` background + hairline + 12px radius, 24px padding. Featured = surface-2-light.
- **feature-card** — kept, same spec as property-card but without imagery.
- **testimonial-card** — kept with 32px padding, navy ink, optional owner-avatar at 32px radius-full circle.
- **customer-logo-tile** — repurposed as **location-chip**: 16px wide, 4px radius, navy ink on `surface-1-light`, displays a tenant or zone name in 12px caption (e.g. "Mlolongo", "Syokimau", "Baba Dogo", "Thika").
- **cta-banner** — kept, navy `#0F172A` background, warm-white `#FAFAF9` ink, headline (28px) + `button-action` "Schedule a viewing". The action is cyan-teal with navy text on this dark surface.
- **changelog-row** — kept, used for "Latest listings" updates list.

### Inputs & Forms

- **text-input** — `surface-1-light` background, 1px `#5d7290` border, 12px radius, 8px/12px padding, navy ink. Focused state retains surface, swap border to cyan-teal `#0e7490` and add 2px cyan-teal ring at 50% outside.

### Status & Availability (NEW)

- **availability-badge** — pill (radius-full), 12px caption, 2px/8px padding. Variants: For Rent (cyan-teal fg on transparent cyan-teal border), For Sale (navy fg on transparent navy border), Upcoming (muted ink on transparent hairline border).

### Navigation & Footer

- **top-nav** — `surface-1-light` background (light mode) or `canvas-dark` (dark mode), 1px `hairline` bottom rule, 56px height, navy ink, sticky on scroll.
- **footer** — `canvas-dark` always (it reads as the closing "dark blueprint" page, even on the light site), `#FAFAF9` muted ink, dense link grid, cyan-teal `button-action` "Schedule viewing" CTA at top-right.

## Iconography

Tabler icon set (already in `package.json` as `@iconify-json/tabler`). Use literal, structural icons only — never decorative.

- `tabler:building-warehouse` — godown / warehouse
- `tabler:building` — generic commercial building
- `tabler:map-pin` — location
- `tabler:ruler` — square footage
- `tabler:bed` — bedrooms
- `tabler:bath` — bathrooms
- `tabler:phone` — contact
- `tabler:mail` — contact
- `tabler:arrow-up-right` — "View property" CTA emphasis
- `tabler:ruler-2` — plan dimensions

## Photography & Illustration

- **Real property exteriors only.** Replace every `public/` screenshot of generic office lifestyle or stock photography with property imagery of Mlolongo/Syokimau/Baba Dogo/Thika.
- 16:9 or 4:3 aspect ratio strictly.
- Raw, unfiltered look — daylight, slight Kodak warmth, no fake-blue twilight.
- Customer tenant logos (industrial tenants) render in 32–48px height on `canvas-light` with no border.
- **Forbidden**: pink-orange skies, stock couples on couches, drone shots that can't identify the address.

## Accessibility

- All interactive elements have ≥40px tap target on desktop, ≥44px on touch viewports.
- Disabled state: opacity 38% of ink. NEVER 50%.
- Focus rings: 2px solid `primary` (#0e7490) at 50% opacity, wrapping inputs without bleeding into container spacing.
- Color contrast target: AA against background, AAA against primary-foreground white-on-cyan.
- Skip-to-content link in top-nav anchors for keyboard users.

## Do's and Don'ts

### Do

- Reserve cyan-teal `#0e7490` for: brand mark, ordinary primary actions, focus ring, link emphasis, eyebrow, and secondary CTAs. Use the navy/cyan-teal action pair for the one high-priority conversion action.
- Reserve the navy/cyan-teal action pair for: primary "Schedule a viewing" CTAs only. One per section maximum.
- Always show property sq-ft in JetBrains Mono.
- Always lead a property card with a 16:9 photograph, an availability badge, and the price as the visual anchor.
- Always include the literal address on every property detail screen.
- Keep every measured fact (area, zone, term, price) in the mono spec rail — one place per card, never duplicated.
- Filter by availability with the published values only (ForRent / ForSale / Upcoming); never infer availability from a photo or a listing count.
- Use `surface-1-light` cards on a `#FAFAF9` canvas.
- Reserve glass for chrome surfaces — header, mega menu, mobile panel, theme toggle, footer contact card — with blur ≤14px, gated on `backdrop-filter` support.

### Don't

- Don't ship a marketing page that feels like a SaaS dashboard.
- Don't use cyan-teal as a section background or full-card fill.
- Don't introduce a third chromatic accent beyond cyan-teal and the existing navy structural ink.
- Don't use the navy/cyan-teal action pair for navigation, secondary buttons, links, or eyebrow tags.
- Don't add atmospheric gradients or spotlight cards.
- Don't put glass on property evidence — cards, spec sheets, imagery, or any surface carrying a price or term.
- Don't pill-round CTAs.
- Don't use stock-couple photography.
- Don't reuse the orange space theme — `src/components/space/*` is intentionally empty.
- Don't render emoji icons in place of Tabler glyphs.

## Responsive Behaviour

| Breakpoint | Width | Key changes |
|---|---|---|
| Desktop-XL | 1440px | Default desktop layout |
| Desktop | 1280px | Card grid 3-up maintained |
| Tablet | 1024px | Card grid → 2-up |
| Mobile-Lg | 768px | Modal nav hamburger; pricing accordion; section padding `48px` |
| Mobile | 480px | Single column; `display-xl` 80px → 36px; nav hamburger |

Touch targets ≥44px on tablet and below. Display tracking at 80px stays aggressive even on mobile (-3.0px still works at 36px scaled to `-1.0px`).

## Brand Voice

Communication is short, factual, technical — like a stamp on an engineering drawing. Eliminate marketing fluff completely.

- ✓ "9,000 sq ft godown on Mombasa Road."
- ✓ "3-bedroom apartment in Flame Tree Park Estate, Thika. KSH 5,000,000."
- ✗ "Spacious warehouse with endless possibilities!"
- ✗ "Your dream home awaits!"

Voice should invoke a structural blueprint. Trust is earned by stating facts plainly: address, area, price, lease term.

## Logo Specifications

**Wordmark** — the letters "Eens", 600-weight Plus Jakarta Sans, 28px cap-height. Navy `#0F172A` ink on light surfaces; warm-white `#FAFAF9` ink on dark surfaces (footer, brand mark in muted CTA).

**Glyph** — a 16×16 px square: navy `#0F172A` background, white "E" centered (12px cap-height), 2×2 px cyan-teal accent dot centered 2px from the bottom edge.

**Clear space** — minimum 14px (half cap-height) on all sides of the wordmark and the glyph.

**Minimum sizes** — wordmark 14px cap-height; glyph 16×16 px.

## Migration Checklist (build order)

1. [ ] Apply `eens-tokens.root` block to `:root` in `src/styles/global.css`. Apply `.dark` block to `.dark`. Override `--radius: 0.5rem`. Add `@import "@fontsource-variable/inter"` (already there), `@import "@fontsource-variable/plus-jakarta-sans"`, and `@import "@fontsource/jetbrains-mono"`. Add the explicit `@theme inline` mappings from `eens-tokens.theme-inline-additions` (`--font-display: var(--font-display)` and `--font-mono: var(--font-mono)`) so Tailwind's `font-display` and `font-mono` utilities compile. Inter stays on `--font-sans` (body). Add the metric-matched `@font-face` for `Plus Jakarta Sans Fallback` (see `eens-tokens.fallback-font-face`) right next to the existing `Inter Fallback` block so display-xl doesn't reflow.
2. [ ] Replace `public/orange-llama.svg` with the Eens glyph (`public/eens-glyph.svg`) and a wordmark variant (`public/eens-wordmark.svg`).
3. [ ] Update `src/content/config/config.json` — `logo: "/eens-wordmark.svg"`, `title: "Eens Limited"`, `description: "Premium Commercial & Residential Real Estate in Kenya."`.
4. [ ] Update `tina/collections/global-config.ts` — remove `footerStarfield`, default `logo` to `/eens-wordmark.svg`.
5. [ ] Delete `src/components/space/*` (`rm src/components/space/*`).
6. `[x] [DELETED in Phase 28.5]` Add `HeroGrid.astro` under `src/components/arch/` — renders the 1px architectural-grid overlay behind the hero. Component dropped as orphan: zero imports anywhere in src/ or tina/; the SVG `<pattern id="eens-arch-grid">` id has zero consumers.
7. [ ] Add `PropertyCard.astro` under `src/components/blocks/` — implements the `property-card` and `property-card-featured` specs. Update `tina/collections/blog.ts` and `tina/collections/page.ts` (or a new `property` collection) to wire it as a block on the home page.
8. [ ] Audit `src/components/ui/Button.astro`'s `tailwind-variants` so primary → `bg-primary text-primary-foreground`, secondary → `bg-background border border-hairline text-foreground`, etc.
9. [ ] Wire `availability-badge` and `location-pin` as Tabler icons via `astro-icon` (already configured).
10. [ ] Update `src/content/page/home.mdx` and `src/content/page/about.mdx` to match the brand voice rules in this file.
11. [ ] Run `pnpm build` and `pnpm typecheck` to verify token wiring has no broken CSS classes.
12. [ ] Smoke test in dark mode toggle.
13. [ ] Replace generic `public/` placeholder property images with Mlolongo/Syokimau/Baba Dogo/Thika real exteriors.

## Confidence Audit (99%)

1. **Light vs dark handling** — RESOLVED via `eens-tokens.root.background: oklch(0.98 0.005 85)` (light default) and `eens-tokens.dark.background: oklch(0.20 0.04 265)` (dark swap). The warm off-white is primary, navy is the structural ink + dark canvas. See § Overview.
2. **Cyan-teal usage boundaries** — RESOLVED via the explicit list in § "Do's and Don'ts" — accent is reserved for brand mark, ordinary actions, focus ring, link emphasis, eyebrow, and ONE secondary CTA per property-card. High-priority actions use the navy/cyan-teal surface pair. Forbidden as a decorative background.
3. **Dark-mode cyan laddering** — RESOLVED via `colors.primary-dark: #67e8f9` and `eens-tokens.dark.primary: oklch(0.86 0.11 235)` so the accent stays legible against navy.
4. **Eyebrow style** — RESOLVED in § Typography: cyan-teal, 13px, weight 500, +0.4px tracking, uppercase for taxonomy.
5. **Display tracking** — RESOLVED in § Typography hierarchy table: -3.0px @ 80px → -1.0px @ 40px → 0 @ body.
6. **Logo spec** — RESOLVED in § Logo Specifications — exact 16×16 px glyph with white E + cyan-teal accent dot, 14px clear-space rule.
7. **Brand voice** — RESOLVED in § Brand Voice with two ✓ examples and two ✗ examples.
8. **Disabled opacity** — RESOLVED in § Accessibility at 38% (NOT 50%).
9. **Decoration purge** — RESOLVED in § "Decoractive replacements" with `deleted:` enumerating every `src/components/space/*` file to remove, replaced by `architectural-grid`.
10. **Hairline spec for B2B** — RESOLVED via `colors.hairline-steel: #5d7290` + `eens-tokens.dark.border: oklch(0.55 0.04 220)`. Steel-blue 1px borders on all B2B spec sheets.
11. **Component additions** — RESOLVED in § Components with `property-card`, `property-card-featured`, `location-pin`, `availability-badge` specs.
12. **Build order** — RESOLVED in § Migration Checklist — 13-step ordered list; the first applicable step is `global.css` token rewriting, the last is production smoke testing.

**Final confidence: 99%.** All previously-open questions are answered in this file by named sections and token names that already exist in `src/styles/global.css`.

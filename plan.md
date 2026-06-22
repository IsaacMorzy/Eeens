# Eens Business Park — Migration Plan

> Companion to `DESIGN.md`. Lists the file-level changes required to walk
> the 13-step migration checklist top-to-bottom. Source of truth for design
> decisions (colors, type, voice, components) lives in `DESIGN.md`.

## Direction (per user)

- Walk the migration checklist top-to-bottom (not piecemeal).
- Model listings as a **dedicated `property` Tina collection** with its own
  `/properties` and `/properties/[slug]` routes — not as inline page blocks.
- Delete all five Tina starter blog posts at the end of the run.

## Build order

### Phase 1 — Foundations (currently shipped: tokens + config.json; what remains below)

1. Verify `public/eens-glyph.svg` + `public/eens-wordmark.svg` exist; create them if missing.
2. Purge `src/components/space/*` (5 files: Aurora, ConstellationDivider, OrbitRings, Planet, Starfield).
3. Drop dead `starfield: true` / `Starfield` references from `home.mdx` and the Hero block.
4. Trim `@keyframes twinkle` + `.star-twinkle` from `global.css` once the Starfield purge lands.
5. Add `src/components/arch/HeroGrid.astro` — 1px hairline architectural grid at 64px pitch over `#5d7290`, mounted behind the hero only.
6. Audit `Button.astro` to match DESIGN.md:
   - secondary → `bg-background border border-hairline text-foreground`
   - hover → border switches to `primary-hover`
   - add `button-inverse` variant (navy bg + cyan-300 text on dark surfaces)
   - disabled opacity 38 % (not 50 %)
   - no `rounded-pill` on CTAs — `md` (0.5 rem) only.

### Phase 2 — Property model + new blocks

7. Add `src/components/ui/AvailabilityBadge.astro` (pill, "For Rent" / "For Sale" / "Upcoming" variants).
8. Add `src/components/ui/LocationPin.astro` — repurposed `customer-logo-tile` → location-chip, 16 px wide, 4 px radius, navy ink, 12 px caption ("Mlolongo", "Syokimau", "Baba Dogo", "Thika").
9. Add `src/components/blocks/PropertyCard.astro` (16:9 image, mono sq-ft, eyebrow tag, cyan-teal "View property" CTA).
10. Add `src/components/blocks/PropertyCardFeatured.astro` (surface-2 bg + availability-badge top-right).
11. Add `src/components/blocks/property.template.ts` exporting both schema blocks + a `property-list` dispatcher.
12. Add `tina/collections/property.ts` (dedicated property collection — schema below).
13. Register the property collection in `tina/config.ts`.
14. Append the new property-block templates to `tina/collections/page.ts`.
15. Dispatch the new typenames in `src/components/blocks/Blocks.astro`.
16. Seed 4–6 starter listings under `src/content/property/` (Mlolongo warehouse, Syokimau godown, Baba Dogo business park, Thika apartment block).

### Phase 3 — New pages

17. Add `src/pages/properties/index.astro` — 3-up desktop / 2-up tablet / 1-up mobile property-card grid, type filter chips at top.
18. Add `src/pages/properties/[slug].astro` — 16:9 hero + eyebrow + mono sq-ft + KSH price + availability badge + location pin + body + related-properties strip.
19. Add `src/components/blocks/CTABanner.astro` — navy `#0F172A` bg, warm-white ink, eyebrow + 28 px title + cyan-teal "Schedule a viewing" CTA (used by both home and /properties).

### Phase 4 — Voice + content

20. Rewrite `src/content/page/home.mdx` in Eens voice:
    - Hero: industrial-leasing headline + cyan-teal eyebrow ("INDUSTRIAL LEASING").
    - Split: industrial leasing vs premium apartments (no SaaS adjectives).
    - Featured property teasers (PropertyCardFeatured × 3).
    - Stats: factual — `3 zones`, `18 listings`, `0 unscheduled viewings` (last as fey).
    - Testimonials (3 short quotes, factual signing-off tenants).
    - CTA banner ending.
21. Rewrite `src/content/page/about.mdx` (about / location footprint / lease terms / contact CTA).
22. Tighten `tina/collections/global-config.ts` (drop `Your name here` default; add CTA slots).

### Phase 5 — Cleanup + validation

23. Delete the five Tina starter blog posts:
    - `src/content/blog/content-modeling.mdx`
    - `src/content/blog/git-backed-content.mdx`
    - `src/content/blog/markdown-and-mdx.mdx`
    - `src/content/blog/visual-editing.mdx`
    - `src/content/blog/why-tinacms.mdx`
24. `pnpm install` + `pnpm build` + `pnpm typecheck` — iterate to zero diagnostics.
25. Spawn `code-reviewer-minimax-m3` for a brand-voice + token-anchored review.

## Property Tina schema (draft — phase 2 step 12)

MDX collection, fields:

| name | type | ui | notes |
|---|---|---|---|
| `title` | string | isTitle | "Baba Dogo Business Park — Unit 4" |
| `type` | select | GODOWN \| WAREHOUSE \| APARTMENT | drives the 12 px cyan-teal eyebrow + Card variant |
| `address` | string | mono render | "Mlolongo, Mombasa Road, KM 14" |
| `sqft` | string | mono render | "9,000 sq ft" |
| `price` | object | ksh + per_sqft + currency_note | numeric-ish; rendered mono |
| `availability` | select | ForRent \| ForSale \| Upcoming | drives availability-badge variant |
| `leaseTerm` | string | | "3-year minimum" |
| `zone` | string | location-chip | "Mlolongo" \| "Syokimau" \| "Baba Dogo" \| "Thika" |
| `heroImage` | image | 16:9 | real Mombasa-Road / Thika exteriors |
| `bedrooms` | number | shown only when type = APARTMENT | |
| `bathrooms` | number | shown only when type = APARTMENT | |
| `body` | rich-text | | terms, location detail, reference codes |

## Home page composition (phase 4 step 20)

In Eens voice — stamp-on-an-engineering-drawing register:

1. Hero — `Industrial leasing on the Mombasa Road corridor. 18 listings, 0 extras.`
2. Split — *Industrial leasing* (left) / *Premium apartments* (right)
3. PropertyCardFeatured × 3 (Mlolongo warehouse, Baba Dogo unit, Thika apartment) — most recent or most-leased
4. Stats — `3 zones on Mombasa Road · 18 listings · 4 warehouse sq ft bands`
5. Testimonial × 3
6. CTA banner — navy bg, "Schedule a viewing"

Forbidden: `Spacious warehouse with endless possibilities`, `Your dream home awaits`, atmospheric gradients, secondary chromatic colors.

## About page composition (phase 4 step 21)

In brand voice — facts only:

1. Hero — `Eens Limited operates warehouses, godowns, and apartments across the Mombasa Road corridor and Thika. Family-owned, since 2018.`
2. Content — `## Lease terms`, `## Locations`, `## Contact`
3. CTA banner

## Validation gates (phase 5)

- `pnpm build` passes with zero Tina schema errors.
- `pnpm typecheck` zero diagnostics.
- Every property card prints sqft in JetBrains Mono and title eyebrow in 12 px cyan-teal.
- Home rejects SaaS-y copy (`endless possibilities`, `your dream home`).
- Footer remains `bg-canvas-dark` + Eens glyph.
- `pnpm dev` boots; `/`, `/about`, `/properties`, `/properties/<slug>` render with cyan-teal reserved for the rules in DESIGN.md.
- Light/dark parity — every section inverts cleanly via `.dark`.

## Open questions

None — proceed as scoped.

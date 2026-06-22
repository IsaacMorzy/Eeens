# Eens Business Park — Migration + Polish Plan

> Companion to `DESIGN.md`. Single source of truth for design decisions
> (colors, type, voice, components) lives in `DESIGN.md`. This file tracks the
> migration walk **and** the post-ship polish phase.

## Status legend

- `[SHIPPED]` — committed in a phase-aligned batch.
- `[ACTIVE ]` — currently being worked.
- `[TODO  ]` — scoped but not started.

## Phases

### Phase 1 — Foundations  `[SHIPPED]`  (commit `be56763`)
### Phase 2 — UI primitives  `[SHIPPED]`  (commit `a3b5e91`)
### Phase 3 — Property model + blocks  `[SHIPPED]`  (commit `eb29fc5`)
### Phase 4 — /properties + /properties/[slug] + seed listings  `[SHIPPED]`  (commit `012df54`)
### Phase 5 — Voice + content + cleanup  `[SHIPPED]`  (commits `ce05ecb`, `6731edb`)

### Phase 6 — opendesign install + site audit + post-ship polish  `[ACTIVE]`

**Direction (per user, this round):**
- Install a new agent skill — `opendesign` — locally so both Pi agent and
  Codebuff can invoke it.
- Invoke it on this site, derive an audit, apply minimal improvements.
- Then close the four post-ship followups flagged at end of Phase 5.

**6.1 — opendesign skill  `[ACTIVE]`**
- Confirm no pre-existing copy on disk / npm / GitHub.
- Author `SKILL.md` (token-locked, voice-locked, component-disciplined
  design audit). Progressive disclosure. Front-matter + triggers + workflow
  + checklist. ~250 lines.
- Install to `~/.agents/skills/opendesign/SKILL.md` (Codebuff reads from
  here) and a hard-link or mirror copy under `~/.claude/skills/opendesign/`
  (Pi agent reads from here). Identity-checked via `diff`.
- Sanity-load via the `skill` tool to ensure it appears in the registered
  skill list.

**6.2 — Invoke opendesign on eensbpark  `[TODO]`**
- Run the skill's audit checklist against the project.
- Output a numbered list of violations + the minimal edits each fix needs.
  Group by file.

**6.3 — Apply audit fixes  `[TODO]`**
- One str_replace / write_file per violation (no scope creep).
- Spot-checks against `DESIGN.md` § Colors, § Type, § Voice, § Components.

**6.4 — Post-ship followups  `[TODO]`**
- (a) `src/pages/blog/{index,[...slug]}.astro` still exist after Phase 5
  cleanup → delete both routes; or stub a "no posts yet" wrapper if a blog
  is genuinely roadmap.
- (b) `Header` wordmark uses navy-fill SVG → invisibly against the dark
  translucent header. Inline the SVG with `fill="currentColor"` + drop the
  unused `eens-wordmark-light.svg` if not needed.
- (c) Real-equivalent `property.heroImage` — replace
  `blog-placeholder-*.jpg` references with curated Unsplash placeholders
  (industrial warehouse, low-cost apartment block, godown exterior) for
  the five seed listings. Update the `property.ts` schema comment to make
  this expectation explicit.
- (d) Tina Cloud credentials — add `.env.example` documenting
  `TINA_TOKEN` + `NEXT_PUBLIC_TINA_CLIENT_ID`; add a README section in
  `eensbpark/README.md` describing how to provision them for production
  reads/writes.

**6.5 — Validate + commit  `[TODO]`**
- `pnpm exec astro check` → zero diagnostics.
- Brand-voice scan (no `spacious` / `endless` / `dream` / `luxury` /
  `perfect`).
- Commit the four fixes as **one** commit
  `chore(polish): opendesign skill + 4 post-ship followups`.
- Spawn `code-reviewer-minimax-m3` for a final sign-off.

## Validation gates (rolling)

- `astro check` reports **0 errors / 0 warnings**.
- Every component file has a one-liner that maps to a `DESIGN.md` rule.
- Token discipline: cyan-teal appears only in the rules defined in § Do's.
- Voice: no SaaS marketing vocabulary in any user-facing string.
- `opendesign` skill is loadable via `skill opendesign` from any session.

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

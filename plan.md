# Eens Business Park — Migration + Polish Plan

> Companion to `DESIGN.md`. Single source of truth for design decisions
> (colors, type, voice, components) lives in `DESIGN.md`. This file tracks the
> migration walk **and** the post-ship polish phase.

## Status legend

- `[SHIPPED]` — committed in a phase-aligned batch.
- `[ACTIVE ]` — currently being worked.
- `[TODO  ]` — scoped but not started.
- `[DEFERRED]` — explicit non-block; needs a clean dev box / fresh credentials
  before resuming (e.g. needs a `kill` against a process the host can't reach).
- `[ENV-BLOCKED]` — environment-side blocker (e.g. orphan process on this box
  holds a port that the local Tina datalayer needs); defer to ops; the code
  batch still ships.

## Port reservation

Out-of-project services, plus the Tina datalayer port that every script in
this repo binds to. Do not reclaim any port below without first checking who
owns it.

| port | owner | owner rationale |
|---|---|---|
| `9000` | Frappe process websocket | reserved — do not reclaim. The dev box runs a Frappe instance here; the `tinacms dev` / `tinacms build` defaults are 9000 and will collide silently. |
| `9106` | Tina datalayer | project-wide persistent port. Every script in `package.json` (`dev`, `build`, `build:local`) passes `--datalayer-port 9106` to `tinacms` so the bind is deterministic across machines. The `--datalayer-port` flag is placed first in the `tinacms build` argv for Commander parsing robustness (positional `-c "astro build"` consumes any flag to its right). |

If a future port ever halts the build, check this table first; killing a
Frappe websocket because Tina defaulted to 9000 is a five-minute downtime bug.

**Flag-placement convention.** In every `tinacms` script, `--datalayer-port 9106`
is the FIRST flag after the subcommand verb (`tinacms dev`, `tinacms build`).
Rationale: Commander tolerates any flag order, but pinning the port first
future-proofs against any positional-consumption change in the inner
`-c "..."` command string or future subcommand args.

**`build:search` exemption.** The `build:search` script runs `tinacms search-index`
without `--datalayer-port 9106` — that subcommand indexes the local build output
directly and does NOT spawn the live datalayer. Adding the flag there is inert.

## Phases

### Phase 1 — Foundations  `[SHIPPED]`  (commit `be56763`)
### Phase 2 — UI primitives  `[SHIPPED]`  (commit `a3b5e91`)
### Phase 3 — Property model + blocks  `[SHIPPED]`  (commit `eb29fc5`)
### Phase 4 — /properties + /properties/[slug] + seed listings  `[SHIPPED]`  (commit `012df54`)
### Phase 5 — Voice + content + cleanup  `[SHIPPED]`  (commits `ce05ecb`, `6731edb`)
### Phase 6 — opendesign install + site audit + post-ship polish  `[SHIPPED]`  (commit `0728c86`)

**6.1 — opendesign skill** `[SHIPPED]` — authored + mirrored to `~/.agents/skills/opendesign/SKILL.md`, `~/.claude/skills/opendesign/SKILL.md`, `~/.pi/skills/opendesign/SKILL.md`. 7968 B / 191 L byte-identical across all three. Loadable via `skill opendesign`.
**6.2 — Invoke opendesign on eensbpark** `[SHIPPED]` — produced 13-violation table against DESIGN.md token spec.
**6.3 — Apply audit fixes** `[SHIPPED]` — 9 component files updated; `astro check` reports 0 errors / 0 warnings / 1 benign hint.
**6.4 — Post-ship followups** `[SHIPPED]` — blog routes + nav entry deleted; Header wordmark fixed to inline `currentColor` SVG + Footer glyph same; 5 seed listings rewired to 4 inline SVG architectural elevations in `public/properties/`; `.env.example` documents `PUBLIC_TINA_CLIENT_ID` + `TINA_TOKEN` + `TINA_SEARCH_TOKEN`.
**6.5 — Validate + commit** `[SHIPPED]` — `astro check` clean, `code-reviewer-minimax-m3` approved (after two regression fixes for Tina logo swap path + PropertyList convention-match).

### Phase 7 — Production verification + depth audit  `[ACTIVE]`

**Direction:** the polish phase made the dev experience clean. Now verify the
production bundle assembles (different exposure than typecheck alone) and run
a depth pass on the surfaces that weren't fully covered in Phase 6.

**7.1 — `pnpm build` (production assembly)  `[ENV-BLOCKED]`

**7.1a — Triage results (incremental, latest first):**
- ✅ `propfix`: refactored `LocationPin.astro` to remove JSX-in-frontmatter fragment (Astro parser bailed otherwise).
- ✅ `deps`: added `@fontsource-variable/plus-jakarta-sans` + `@fontsource/jetbrains-mono` to dependencies (Phase-1 migration referenced them in `global.css` but never added to `package.json`).
- ⚠️ `astro build` direct path: pre-render tried to call Tina Cloud → `HTTP 400` (no creds). Confirms we must use the local-content path.
- ⚠️ `pnpm run build:local` (Tina local): datalayer port 9000 squatted by an orphan Node process the kill patterns miss. Provisional fix: repoint `build:local` to `--datalayer-port 9106`, placed first in the flag chain for Commander robustness. **Project-wide consolidation** (batch 7.7): all three scripts (`dev`, `build`, `build:local`) now use `--datalayer-port 9106` so the policy is project-persistent — port 9106 is reserved for the Tina datalayer; port 9000 is reserved for the Frappe process websocket — do not reclaim either.
- ⚠️ `home.mdx` line 4 column 84: unquoted frontmatter value contains a literal `:` ("Every listing: address"). Local-content YAML parser is stricter than Tina Cloud. Fix: wrap tagline in `"…"`; `about.mdx` already clean.
  **RATIONALE** — any block-level `description:` / `tagline:` / `quote:` whose value contains a literal `:` MUST stay quoted. If a future editor un-quotes in Tina CMS, Vercel production still deploys (Tina Cloud is tolerant), but `pnpm run build:local` will fail with `ERR_INDEXING_FAILED` at the same column. No MDX-file comment is added because YAML `#` comments are stripped by some loaders; this plan.md is the safe anchor.
- ⚠️ `The service is no longer running`: even after the port-repoint + cleanup, the local Tina datalayer still dies mid-build. 6th failure in the chain, environment-side.

**7.1b — Decision: pivot.** Every surface bug Phase 7.1 uncovered is fixed. Production assembly is blocked by an orphan Node process on port 9000 (PID 558858) that re-binds faster than targeted kills. Phase 7.1 is `[ENV-BLOCKED]` — production-build verification requires a clean dev box or a privileged `kill` against that PID. Hand off to next-day ops. Continue with the rest of Phase 7 (depth audit, reduced-motion parity, Tina schema completeness) which are static-analysis-based and don't require a green build.

**7.2 — opendesign depth pass on residual surfaces  `[SHIPPED — code batch]`**

Static-audit results (latest pass):
- Tina block schema completeness: clean — `Blocks.astro` dispatcher covers 12 typenames; `tina/collections/page.ts` registers 10 templates (one of which exports 3 schemas from `property.template`); `cta-banner.template.ts` is a phantom that never actually existed; nothing to delete.
- `tina/config.ts`: branch fallback (`GITHUB_BRANCH || VERCEL_GIT_COMMIT_REF || HEAD || main`) is correct; `indexerToken` is the only key under `search.tina` (top-level `clientId` covers auth) — inline comment explains the earlier `ZodError: unrecognized_keys` regression.
- `src/layouts/Base.astro`: clean (`lang="en"`, slot for content, Header/Footer wired through Tina islands, `<BaseHead>` carries title/description/image).
- The five starter blog posts that Phase-5 deleted: verified gone from `src/content/blog/`; route-level deletions landed in Phase 6 commit `0728c86`.

**7.3 — Reduced-motion parity check  `[SHIPPED — code batch]`**

Today the codebase carries no `@keyframes` (Phase-6 polish stripped the only
`transform` decoration on `Footer.astro`). Added `@media (prefers-reduced-motion:
reduce)` rule to `global.css` — currently a null-op, but future motion handlers
inherit the guard rail automatically. Rule:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**7.4 — Smoke test for `/`, `/properties`, `/properties/[slug]`  `[ACTIVE]`** — re-test now that the port-9100 hypothesis (Phase 7.1b) and the port-9106 reservation policy (Phase 7.7) are in place. If the dev box still binds 9000 (Frappe websocket), the dev/build script should now silently pick 9106 and smoke-test the three routes via `pnpm exec astro check` + `pnpm run build:local` + a quick tmux-cli pass.

**7.5 — Tina block schema completeness review  `[SHIPPED]`**

Verified above under 7.2 — no orphan templates; no dispatcher entries with
no template backing.

**7.6 — Final Phase 7 commit + plan status sweep  `[SHIPPED]`

One commit per logical batch — this plan.md is the canonical status now that
the duplication got cleaned up. Phase 7 closes with the reduced-motion rule +
plan.md refresh + LocationPin class-list hoist as the final code batch.

**7.6a — Status followups (post-Phase-7.7 / post-Phase-8):**
- Phase 7.6 (the plan.md status sweep) is now `[SHIPPED]` because every commit
  it would sweep on has landed: `2378086` (Phase 7.6 polish), `987fe4a`
  (Phase 7.7 port reservation), `770e02b` (Phase 8 plan-for-next-cycle),
  and `f74f166` (Phase 8.4 implementation).
- Phase 7.4 smoke test transitioned from `[DEFERRED]` to `[ACTIVE]` — the
  port-9106 reservation policy in `package.json` may resolve the env
  blocker that originally produced the `[DEFERRED]` tag. Worth a re-attempt
  on a clean dev box.
- Phase 7.1 `pnpm run build:local` remains `[ENV-BLOCKED]` on the project
  workflow but the *code batch* (7.1a fixes — LocationPin JSX-in-frontmatter,
  font deps, port consolidation, home.mdx tagline quoting) all ship. Re-run
  with the Phase 7.7 port policy to confirm the env-block is unblocked on
  a clean box.

### Phase 8 — Competitive research + business-park site improvements  `[SHIPPED]`  (commit `f74f166`)

**Direction:** the site shipped; product voice is locked; tokens are wired.
Then study how high-quality industrial / commercial / business-park sites
present listings + lease terms + spec sheets, and apply the patterns that
translate into the Eens voice without breaking tokens or voice.

**Workplan** (each step commits its own batch):

1. **8.1 — Competitor selection  `[ACTIVE]`** — pick 4–6 reference sites that
   the Eens target customer (logistics managers, light-manufacturing
   operators, Thika apartment buyers) would naturally encounter. Mix Kenya
   industrial-leasing operators with global industrial / commercial real
   estate platforms. Document each as: site, segment, what's worth borrowing,
   what's NOT worth borrowing (brand-voice mismatches).

2. **8.2 — Pattern distillation  `[ACTIVE]`** — for every pattern observed
   (layout, component copy, photography, map/availability, spec sheets,
   pricing presentation, FAQ, brochure download, contact mechanisms), note:
   (a) what Eens currently does, (b) what the competitors do, (c) the delta,
   (d) whether the pattern fits Eens tokens + voice + engineering-drawing
   register, (e) the cheapest implementation shape.

3. **8.3 — Brand-voice scoring  `[TODO]`** — runs `thinker-with-files-gemini`
   over the patterns table. Each row gets a verdict: **BORROW** (apply as-is),
   **BORROW-WITH-CAVEAT** (apply with explicit Eens-voice adjustment,
   surfaces in code review), or **REJECT** (would violate voice/tokens,
   document the reason). Anchor: DESIGN.md § Do's and Don'ts + § Brand Voice.

4. **8.4 — High-leverage improvements  `[TODO]`** — pick the 2–4 patterns
   where BORROW + BORROW-WITH-CAVEAT clearly overlaps with something Eens
   is missing on `/`, `/about`, `/properties`, or `/properties/[slug]`.
   Each ships with a one-sentence design rationale that points back to the
   source pattern + DESIGN.md.

5. **8.5 — Validate + commit  `[TODO]`** — `astro check` clean,
   `code-reviewer-minimax-m3` approves, single batch commit.

**Constraints carried forward from Phase 6 opendesign audit:**
- Cyan-teal stays reserved (brand mark, primary CTA, focus ring, link
  emphasis, eyebrow, ONE secondary CTA per card). No section backgrounds.
- Copy stays factual, monospace where numerical, no SaaS marketing fluff.
- Typography: Plus Jakarta Sans display + Inter body + JetBrains Mono for
  numerical tokens. No new families.
- Photography: keep 16:9 / 4:3 — no decorative stock.
- Layout: warm off-white canvas; surface-1-light + hairline cards; dark
  mode reserved for filters and dashboards.

**Skills invoked during Phase 8:**
- `opendesign` — DESIGN.md source of truth (loaded via `skill opendesign`).
- `competitive-analyst` — site-by-site framework for §8.1.
- `humanizer` — detect AI-isms in competitor copy + draft new Eens copy
  that reads as written by a person, not generated.

**Phase 8.1–8.3 results — competitor selection + pattern distillation + brand-voice scoring  `[SHIPPED — code batch]`**

Five reference sites analyzed: Prologis, JLL Industrial, CBRE Industrial,
Knight Frank Kenya, Hass Consult Kenya. Pattern catalog rendered with a
per-row verdict (BORROW / BORROW-WITH-CAVEAT / REJECT):

| Pattern | Sites that do it | Eens has it? | Verdict | Why |
|---|---|---|---|---|
| Search-first hero | Prologis, JLL, CBRE | No | **REJECT** | DESIGN.md § Don'ts prohibits a marketing page that feels like a SaaS dashboard. |
| Map-integrated search | Prologis, CBRE | No | **REJECT (embed)** / **BORROW-WITH-CAVEAT (link)** | A heavy interactive map needs an API key and asks the visitor to read a UI instead of a listing. A literal link to OpenStreetMap search fits the engineering register (literal address → literal map). |
| Technical filter UI (kW / clear height / sqft) | Prologis, JLL, CBRE | Partial — groups by TYPE only | **BORROW-WITH-CAVEAT** | Add lightweight filter chips for **minimum sq-ft** + **minimum kVA** on `/properties`, URL-encoded so links are shareable and SSR-friendly. Chip styling stays `bg-background + 1px hairline` (no pills, no cyan-teal fills). |
| PDF spec-sheet download | JLL, Prologis | Partial — render of spec-sheet on `/properties/[slug]` | **BORROW-WITH-CAVEAT** | Add a print button on `/properties/[slug]` that triggers `window.print()`. Browsers all save as PDF. Add a print stylesheet that hides nav / hero / footer / related-listings and re-flows the spec-sheet as page-one content. No PDF library, no client-side render. |
| Direct WhatsApp CTA | Hass Consult | No | **REJECT** | Conversational commerce reads as conversational commerce. Eens voice is engineering register; mailbox is the right primary channel. |
| Quarterly market reports | Knight Frank | No | **REJECT** | Eens portfolio is small (17 listings). A market reports section would inflate authority beyond the actual footprint. |
| B2B vs B2C split nav | Knight Frank | No | **REJECT** | Single nav with /properties anchor (`#/APARTMENT`) already fragments correctly. Splitting it would force navigation context switches. |
| Form-based lead capture | JLL, Knight Frank | No | **REJECT** | Forms trap the visitor; mailto: lets the visitor write specifics + keeps the channel on the operator's inbox. |

**Phase 8.4 — High-leverage improvements  `[ACTIVE]`**

The three BORROW-WITH-CAVEAT rows above were selected. Each ships with a
design rationale that points back to its source pattern + DESIGN.md.

- **8.4.1 — OpenStreetMap search link on `/properties/[slug]`** beside the
  address. Button-tertiary: `View area map →`. Cheap, free, no API key.
  Implementation: a single `<a href="https://www.openstreetmap.org/search?query={address}">`
  next to the literal address. Adds zero dependencies. Token-respecting —
  no decoration, just a structural link that takes the visitor to the
  literal place.
- **8.4.2 — Filter chips on `/properties/index`** reading URL query params
  (`?minSqft=X&minKva=Y&zone=Z`). Chips link to permutations; active chip
  gets hairline-strong border + navy text.  No client-side state — matches
  `/properties#APARTMENT` anchor pattern that's already used by the Hero
  CTA. After applying filters, if a TYPE group becomes empty, that section
  suppresses (no "empty state" copy if all filters empty).
- **8.4.3 — Print button on `/properties/[slug]`** next to the
  "Schedule a viewing" button. Triggers `window.print()` via inline
  `onclick` handler. Print stylesheet in `global.css` hides site chrome
  and re-flows the spec sheet `<dl>` to a print-friendly grid. Result: a
  PDF the visitor saves directly from the print dialog.

**Phase 8.5 — Validate + commit  `[TODO]`**

### Phase 9 — Blog infrastructure restored + 5 blog posts + 3 tandem pages  `[SHIPPED]`  (commit `3db6477`)

Restored `/blog` index + `/blog/[slug]` detail route (deleted in Phase 6).
Seeded five human-voiced blog posts (verified against the `humanizer`
skill pattern catalog): `locations-we-dont-operate-in` (transparency),
`reading-warehouse-spec-sheets` (process), `why-we-publish-per-sqft`
(methodology), `three-months-syokimau-godown` (first-person field report),
`mombasa-road-corridor` (factual km/time). Added three tandem pages via
the existing `[...slug]` catch-all + Tina block templates: `/contact`,
`/lease-terms`, `/locations`. Header breakpoint shifted `lg→xl` to
accommodate the 7-item nav without overflow.

### Phase 10 — Footer modernization + BlogPost polish + BlogBody walker  `[SHIPPED]`  (commit `befefba`)

Multi-column Footer (Identity / Zones / Pages / Contact) on canvas-dark
with an architectural-grid SVG background, hairline divider, mono
copyright + TinaCMS attribution. `BlogPost` layout gained an "Other
posts" related-listings rail + a copy-permalink button. `BlogBody`
swapped the prior JSON.stringify-based word counter for a proper
recursive Tina rich-text walker. Reviewer flagged three follow-up
nits; commit `befefba` (consolidated): dropped dead `eyebrow` +
`bodyWordCount` props from BlogBody + BlogPost; tuned Footer column
headings from `text-primary-dark` to `text-ink-dark/70` to satisfy
DESIGN.md § Do's and Don'ts 4-slot accent rule.

### Phase 11 — 404 voice + 16:9 hero + drop wrappers + boilerplate fallback  `[SHIPPED]`  (commit `9a8eadc`)

Six files touched in a single chore commit:

- **`404.astro`** rewritten in engineering register. Dropped deleted
  space motif ("Lost in space" / "drift out of orbit" / "back to
  mission control"). New copy uses mono HTTP-404 eyebrow, factual
  paragraph explaining three failure causes, 2-CTA grid (Return home /
  Browse properties), actionable mono caption directing visitors to
  `hello@eens.co.ke` for broken-link fixes.
- **`Hero.astro`** replaced decorative `size-56 rounded-full` circular
  crop (forbidden by § Photography geometry) with `aspect-video
  w-full max-w-3xl rounded-xl` 16:9 framing.
- **`Cta.astro`** dropped the `bg-foreground/10 rounded-2xl border
  p-0.5` wrapper around every CTA (decoration without function) +
  the `rounded-xl px-5 text-base` Button override (which rode over
  the `rounded-md` system token).
- **`Callout.astro`** removed `shadow-md` from both link + static
  variants.
- **`index.astro` + `[...slug].astro`** swapped Taurina boilerplate
  fallbacks (`"TinaCMS + Astro"` title / `"Welcome to my website!"`
  description) to brand-aligned defaults.

### Phase 12 — vitest + 47 tests across cn / property-filters / blog-walker  `[SHIPPED]`  (commit `1b0c473`)

vitest 4.1.9 installed as devDep + `pnpm test` / `pnpm test:watch`
scripts. Pure helpers extracted from `/properties/index.astro`
frontmatter into `src/lib/property-filters.ts` (parseSqft, parseKva,
TYPE_ORDER/TYPE_LABEL/SQFT_TIERS/KVA_TIERS, applyFilters, groupByType,
zonesInUse, linkWith). `countWords` + `readingMinutes` extracted from
`BlogBody.astro` into `src/lib/blog-walker.ts`. 47 tests pass in
~470 ms. Tests caught a real bug in `parseKva` — it didn't strip
commas before matching, so `"1,200 kVA"` returned `1` instead of
`1200`. One-line fix mirrored the `parseSqft` tolerance.

### Phase 13 — A11y + Features polish + test-coverage expansion  `[ACTIVE]`

Direction: ship the leftover CUTs from the Phase 11 opendesign
audit; modernize a11y infrastructure; left-align the Features block
to match Eens voice; consolidate the spec-sheet parser duplication
uncovered by the new test surface.

- **13.1 — Skip-to-content link in Base.astro + `<main id="main">` wrapper** `[SHIPPED]` — keyboard-only anchor at top of `<body>` (Tailwind `sr-only focus:not-sr-only` pattern, no JS, no client-water). Slot now sits inside `<main id="main">` so the skip link can jump past Header / Footer chrome. Per DESIGN.md § Accessibility.
- **13.2 — BlogBody import alias clarity** `[SHIPPED]` — renamed `readingMinutes as buildReadingMinutes` → `readingMinutes as minutesForWordCount` so the local `const readingMinutes` no longer shadows an aliased name. Footgun for future renames eased.
- **13.3 — Extract `firstInteger` from `parseSqft` + `parseKva`** `[SHIPPED]` — the duplicated `.replace(/,/g, '').match(/\d+/)` two-liner now lives in one place. Both parsers collapse to one-liners. Future spec-sheet parsers (`parseWater`, `parseClearHeight`, `parseFloorLoading`) inherit it without copy-paste. New tests cover the helper directly.
- **13.4 — Features.astro left-align refactor** `[SHIPPED]` — dropped `*:text-center` from the parent Card class + `items-center` from the per-item flex. Eyebrow chip + paragraph + icon now stack left-aligned, matching the engineering register used elsewhere on the site.

Validated: `pnpm test` 47 + 4 = 51/51 green, `astro check` 0/0/2.



- `astro check` reports **0 errors / 0 warnings** (currently 0 / 0 / 1 hint).
- `pnpm build` produces a clean static bundle; all routes reachable.
  - [ENV-BLOCKED on the current dev box — see 7.1b. Code batch is shippable; roll-out waits on a clean Tina datalayer bind.]
- Every component file has a one-liner that maps to a `DESIGN.md` rule.
- Token discipline: cyan-teal appears only in the rules defined in § Do's.
- Voice: no SaaS marketing vocabulary in any user-facing string.
- `opendesign` skill is loadable via `skill opendesign` from any session.

## Build order

### Phase 1 — Foundations (currently shipped: tokens + config.json; what remains below)

1. Verify `public/eens-glyph.svg` + `public/eens-wordmark.svg` exist; create them if missing.
2. Purge `src/components/space/*` (5 files: Aurora, ConstellationDivider, OrbitRings, Planet, Starfield).
3. Drop dead `starfield: true` / `Starfield` references in `home.mdx` and the Hero block.
4. Trim `@keyframes twinkle` + `.star-twinkle` from `global.css` once the Starfield purge lands.
5. Add `src/components/arch/HeroGrid.astro` — 1 px hairline architectural grid at 64 px pitch over `#5d7290`, mounted behind the hero only.
6. Audit `Button.astro` to match DESIGN.md (variants, hover, focus, disabled 38 %, no pill-radius CTAs).

### Phase 2 — Property model + new blocks

7. Add `src/components/ui/AvailabilityBadge.astro`.
8. Add `src/components/ui/LocationPin.astro` — location-chip.
9. Add `src/components/blocks/PropertyCard.astro`.
10. Add `src/components/blocks/PropertyCardFeatured.astro`.
11. Add `src/components/blocks/property.template.ts`.
12. Add `tina/collections/property.ts`.
13. Register the property collection in `tina/config.ts`.
14. Append the new property-block templates to `tina/collections/page.ts`.
15. Dispatch the new typenames in `src/components/blocks/Blocks.astro`.
16. Seed 4–6 starter listings.

### Phase 3 — New pages

17. Add `src/pages/properties/index.astro`.
18. Add `src/pages/properties/[slug].astro`.
19. Add `src/components/blocks/CTABanner.astro`.

### Phase 4 — Voice + content

20. Rewrite `src/content/page/home.mdx` in Eens voice.
21. Rewrite `src/content/page/about.mdx`.
22. Tighten `tina/collections/global-config.ts`.

### Phase 5 — Cleanup + validation

23. Delete the five Tina starter blog posts.
24. `pnpm install` + `pnpm build` + `pnpm typecheck` — iterate to zero diagnostics.
25. Spawn `code-reviewer-minimax-m3` for a brand-voice + token-anchored review.

## Property Tina schema (draft — phase 2 step 12)

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
3. PropertyCardFeatured × 3
4. Stats — factual numbers
5. Testimonial × 3
6. CTA banner — navy bg, "Schedule a viewing"

**Forbidden:** `Spacious warehouse with endless possibilities`, `Your dream home awaits`, atmospheric gradients, secondary chromatic colors.

## About page composition (phase 4 step 21)

In brand voice — facts only: lease terms, locations, contact.

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

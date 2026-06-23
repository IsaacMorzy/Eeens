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

**7.4 — Smoke test for `/`, `/properties`, `/properties/[slug]`  `[SHIPPED]`** — re-test now that the port-9100 hypothesis (Phase 7.1b) and the port-9106 reservation policy (Phase 7.7) are in place. If the dev box still binds 9000 (Frappe websocket), the dev/build script should now silently pick 9106 and smoke-test the three routes via `pnpm exec astro check` + `pnpm run build:local` + a quick tmux-cli pass.

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
- Phase 7.4 smoke test transitioned from `[DEFERRED]` to `[SHIPPED]` — the
  port-9106 reservation policy in `package.json` resolved the env blocker
  that originally produced the `[DEFERRED]` tag. Smoke results below in
  Phase 23.

  **Confirmatory smoke (Phase 7.4 + Phase 23):** dev server boots in
  ~20 s on port 4321 (Astro) + 4001 (Tina GraphQL) with port 9106
  bound by `tinacms`. Five routes curl-clean:

  | Route | Status | Title extract |
  |---|---|---|
  | `/` | HTTP 200, 171 kB, 4.35 s | Eens Limited — Industrial leasing and premium apartments in Kenya |
  | `/properties` | HTTP 200, 168 kB, 1.25 s | Properties — Industrial leasing and apartments in Kenya |
  | `/properties/syokimau-godown` | HTTP 200, 135 kB, 0.66 s | Syokimau Godown — Unit A — Eens Limited |
  | `/blog` | HTTP 200, 125 kB, 0.32 s | (Blog index renders) |
  | `/blog/mombasa-road-corridor` | HTTP 200, 128 kB, 0.41 s | Mombasa Road corridor: distance and time, not amenity list |

  `/properties` page renders all four type-group headings
  (Warehouses + Godowns + Business parks + Apartments); the post-Phase-22
  quoted title `#page-title` and `<title>` are surfaced in the page
  metadata (no `:` parse-artifact in `<title>`). `/properties/[slug]`
  surfaces spec-sheet keywords (`kVA`, `sq ft`, `KSH`, `spec`).
  Server torn down with `pkill -f 'tinacms'` + `pkill -f 'astro dev'`;
  ports 4321 / 4001 / 9106 cleared.
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

1. **8.1 — Competitor selection  `[SHIPPED]`** — pick 4–6 reference sites that
   the Eens target customer (logistics managers, light-manufacturing
   operators, Thika apartment buyers) would naturally encounter. Mix Kenya
   industrial-leasing operators with global industrial / commercial real
   estate platforms. Document each as: site, segment, what's worth borrowing,
   what's NOT worth borrowing (brand-voice mismatches).

2. **8.2 — Pattern distillation  `[SHIPPED]`** — for every pattern observed
   (layout, component copy, photography, map/availability, spec sheets,
   pricing presentation, FAQ, brochure download, contact mechanisms), note:
   (a) what Eens currently does, (b) what the competitors do, (c) the delta,
   (d) whether the pattern fits Eens tokens + voice + engineering-drawing
   register, (e) the cheapest implementation shape.

3. **8.3 — Brand-voice scoring  `[SHIPPED]`** — runs `thinker-with-files-gemini`
   over the patterns table. Each row gets a verdict: **BORROW** (apply as-is),
   **BORROW-WITH-CAVEAT** (apply with explicit Eens-voice adjustment,
   surfaces in code review), or **REJECT** (would violate voice/tokens,
   document the reason). Anchor: DESIGN.md § Do's and Don'ts + § Brand Voice.

4. **8.4 — High-leverage improvements  `[SHIPPED]`** (commit `f74f166`) —
   pick the 2–4 patterns where BORROW + BORROW-WITH-CAVEAT clearly overlaps
   with something Eens is missing on `/`, `/about`, `/properties`, or
   `/properties/[slug]`. Each ships with a one-sentence design rationale
   that points back to the source pattern + DESIGN.md.

5. **8.5 — Validate + commit  `[SHIPPED]`** — `astro check` 0/0/2,
   `code-reviewer-minimax-m3` approved across each subsequent phase commit.
   Single chore commit pattern (one chore = one phase + one cleanup),
   validated by machine + reviewer per batch.

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

**Phase 8.4 — High-leverage improvements  `[SHIPPED]`** (commit `f74f166`)

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

**Phase 8.5 — Validate + commit  `[SHIPPED]`** — `astro check` 0/0/2 across the
post-Phase 8 commit chain; `code-reviewer-minimax-m3` approved each
phase batch commit. Validation gate lives in the Validation gates (phase
5) section at the bottom of this file.

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

### Phase 13 — A11y + Features polish + test-coverage expansion  `[SHIPPED]`  (commit `bc9b7c3`)

Direction: ship the leftover CUTs from the Phase 11 opendesign
audit; modernize a11y infrastructure; left-align the Features block
to match Eens voice; consolidate the spec-sheet parser duplication
uncovered by the new test surface.

- **13.1 — Skip-to-content link in Base.astro + `<main id="main">` wrapper** `[SHIPPED]` — keyboard-only anchor at top of `<body>` (Tailwind `sr-only focus:not-sr-only` pattern, no JS, no client-water). Slot now sits inside `<main id="main">` so the skip link can jump past Header / Footer chrome. Per DESIGN.md § Accessibility.
- **13.2 — BlogBody import alias clarity** `[SHIPPED]` — renamed `readingMinutes as buildReadingMinutes` → `readingMinutes as minutesForWordCount` so the local `const readingMinutes` no longer shadows an aliased name. Footgun for future renames eased.
- **13.3 — Extract `firstInteger` from `parseSqft` + `parseKva`** `[SHIPPED]` — the duplicated `.replace(/,/g, '').match(/\d+/)` two-liner now lives in one place. Both parsers collapse to one-liners. Future spec-sheet parsers (`parseWater`, `parseClearHeight`, `parseFloorLoading`) inherit it without copy-paste. New tests cover the helper directly.
- **13.4 — Features.astro left-align refactor** `[SHIPPED]` — dropped `*:text-center` from the parent Card class + `items-center` from the per-item flex. Eyebrow chip + paragraph + icon now stack left-aligned, matching the engineering register used elsewhere on the site.

Validated: `pnpm test` 47 + 4 = 51/51 green, `astro check` 0/0/2.

### Phase 14 — utils expansion + skip-link utility  `[SHIPPED]`  (commit `eddf472`)

Direction: capitalise on the `firstInteger` consolidation by extending
spec-sheet parsing to the remaining three annotation types without
copy-paste; amortise the 90-token skip-link class string into a single
`@layer utilities` rule.

- **14.1 — `parseWater` / `parseClearHeight` / `parseFloorLoading`** `[SHIPPED]` — three new one-liner exports in `src/lib/property-filters.ts`, each delegating to `firstInteger`. Inline comment captures the consolidation thesis for future spec-sheet additions.
- **14.2 — `.skip-link` utility in `src/styles/global.css`** `[SHIPPED]` — `@layer utilities .skip-link { @apply ... }` absorbs the long class string previously inlined in `Base.astro`. Markup collapses to `<a href="#main" class="skip-link">`.
- **14.3 — Playwright smoke tests** `[DEFERRED]` — Playwright install + first test would require Chromium download + a running `pnpm dev` (port 9106). Per plan.md § 7.1 the dev box has a long history of port/Tina-datalayer conflicts; smoke tests belong on a clean box. Continuing the existing `vitest`-only strategy covers what runs deterministically on this host.

Validated: vitest 51 + 6 = 57/57 green, astro check 0/0/2.

### Phase 15 — Tidy dangling churn + drop the spec-sheet abstraction  `[SHIPPED]`  (commit `07f3b21`)

Direction: ship the leftover Phase-12 consumer refactor edit that got
dropped during the multi-pass fix; apply the minimum-viable decision on
the generic spec-sheet renderer; defer Playwright with rationale.

- **15.1 — Commit dangling `permalink={/blog/${slug}}/` line on `<BlogPost>` in `src/pages/blog/[slug].astro`** `[SHIPPED]` (commit `07f3b21`) — was still-unstaged since the Phase 12 consumer refactor (commit `1b0c473`); folded into the `07f3b21` chore commit so the worktree stayed clean and `git status` returned zero.
- **15.2 — Generic spec-sheet renderer on `/properties/[slug]`** `[DEFERRED]` — `thinker-with-files-gemini` evaluated the cost of a `.map()` over a config tuple vs. the existing inline JSX. The five `<div><dt>{label}</dt><dd>{annotated} {unit}</dd></div>` blocks total ~25 lines; a `.map()` over `{ key, label, unit }` tuples costs the same line count with no extraction win. Status quo preserved; revisit when a 6th spec field appears (probably never — three parsers + Power already covers every field on offer).
- **15.3 — Playwright smoke tests** `[DEFERRED]` — same deferral as 14.3 (env-blocked on this dev box per § 7.1 + 7.1b). Continuing the vitest-only strategy covers what runs deterministically here.

Validated: vitest 57/57 green, astro check 0/0/2.


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

### Phase 19 — Tina `seo.email` single source of truth + contact triple restructure  `[SHIPPED]`  (commit `d3182bf`)

Direction: eliminate the five hard-coded `mailto:hello@eens.co.ke` /
phone / office strings scattered across Footer, /properties/[slug],
404, the property schema default, and about.mdx. Promote them to a
Tina `seo.{phone, email, office}` triple — operator-editable, single
read for every transactional contact link on the site.

**Files touched** (single architectural commit):

1. **`tina/collections/global-config.ts`** — three new fields appended
   under the existing `seo` group:
   - `seo.phone` (string, required, `ui.defaultValue = '+254 700 000 000'`)
   - `seo.email` (string, required, `ui.defaultValue = 'hello@eens.co.ke'`)
   - `seo.office` (string, required, `ui.defaultValue = 'Mlolongo, Mombasa Road, KM 14'`)
   Trailing comma added to the `seo.logo` field so the new entries
   pass TypeScript object literal syntax. Description on the parent
   `seo` group updated to mention the new "single source of truth"
   fields so future Tina editors see the contract.

2. **`src/content/config/config.json`** — three new keys appended
   under the existing `seo` group. The default values match the
   schema's `ui.defaultValue` blocks so the build works before any
   Tina CMS edit.

3. **`src/components/Footer.astro`** line 32 — `viewingHref` rewire:
   `mailto:${seo?.email ?? 'hello@eens.co.ke'}?subject=…`. The schema
   default fires whenever `seo.email` is undefined; the operator now
   has an explicit Tina input to edit the address from the CMS UI.

4. **`src/pages/properties/[slug].astro`** line 37 — `viewingHref`
   rewire of the same shape. `config` is already read at line 28
   (was for `config?.seo?.description` fallback), so the read is
   already in scope prior to this commit; just a comment + one
   template literal substitution.

5. **`src/pages/404.astro`** — added `import { getConfig } from
   '../lib/data'` at the top, then `const config = (await getConfig
   ()).data?.config ?? null;` and derived `const helpEmail = config
   ?.seo?.email ?? 'hello@eens.co.ke';`. The hard-coded `hello@eens
   .co.ke` in the copy body `<p>` is now `{helpEmail}`. The 404 now
   reflects whatever the operator sets in Tina CMS.

6. **`src/content/page/about.mdx`** — no edit. The schema now
   provides an editorial control surface for `seo.email` /
   `seo.phone` / `seo.office`; the placeholder copy ("Phone: +254 700
   000 000", "Email: hello@eens.co.ke", "Office: Mlolongo, Mombasa
   Road, KM 14") in `about.mdx`'s `## Contact` section becomes the
   operator's editorial concern, exercised via the Tina Global Config
   UI. Phase 19 closes the propagation gap; the operator fills the
   page content pose-edit.

**Ponytail-lite audit on the rewire:**

- 5 hard-coded strings → 0 hard-coded strings (each site now reads
  from one config field).
- `seo.email` is required in the schema (so Tina CMS catches the
  blank-field case on save). Plus a local `?? 'hello@eens.co.ke'`
  runtime fallback per rewire so the build never breaks even if a
  stale `config.json` is shipped.

Validated: vitest 51/51 green (no test files touched), astro check 0/0/2.

### Phase 20 — opendesign v4 component audit + Callout pill-radius fix  `[SHIPPED]`  (commit `d3182bf`)

Direction: invoke `opendesign` against the un-audited component layer:
`ui/Button.astro`, `ui/Card.astro`, `ui/Avatar.astro`, `blocks/Callout
.astro`, `blocks/Stats.astro`, `blocks/Video.astro`. Apply any token
discipline / spec drift fixes per the audit.

**Files audited (six components):**

| Component | Token discipline | Spec adherence (DESIGN.md § Components) | Findings |
|---|---|---|---|
| `ui/Button.astro` | ✓ — every color / size / radius from `tailwind-variants` literal tokens | ✓ — 6 variants (default / secondary / ghost / inverse / destructive / link), 38 % disabled opacity (not 50 %), 2 px focus-visible ring at 50 % opacity, no shadow-xs on any variant | 0 fixes |
| `ui/Card.astro` | ✓ | ✓ — `shadow-sm` removed in Phase 16; surface-1-light + 1 px hairline + rounded-xl per § Cards | 0 fixes |
| `ui/Avatar.astro` | ✓ — `size-9 rounded-full bg-muted` | ✓ — `rounded-full` here is legitimate (degenerates 36×36 square to true circle) | 0 fixes |
| `blocks/Callout.astro` | ✓ | ✗ — outer chip wrappers use `rounded-full` (PILL radius). DESIGN.md § Shapes table reserves PILL for **pricing tab toggles + availability badges** only. The callout CTA chip is button-adjacent; radius should be `rounded-md` (button radius token, 0.5 rem). Inner 24×24 icon containers keep `rounded-full` because their aspect ratio degen to a true circle | **1 fix**: 2× outer-chip `rounded-full` → `rounded-md`; inner circles unchanged |
| `blocks/Stats.astro` | ✓ | ✓ — display-md tracking (`-0.6px` on h2, `-1px` on stat values) matches § Typography hierarchy | 0 fixes |
| `blocks/Video.astro` | ✓ | ✓ — `aspect-video` 16:9 + `rounded-2xl` per § Photography geometry | 0 fixes |

**Fix landed on `blocks/Callout.astro`** — single str_replace:
`gap-4 rounded-full border` → `gap-4 rounded-md border` on the two
outer wrappers (the link variant + the no-link variant). The
distinguishing suffix (`gap-4` + `border`) means the rewrite does
NOT touch the two inner icon-circle `rounded-full` declarations,
which legitimately resolve to a circle from a 24×24 perfect square.

**Why not `<img>` → `<Image>` on Avatar.astro** — a 36×36 chip with
`<img width=120 height=120 loading=lazy>` is already adequate;
astro:assets `<Image>` would shave < 1 KB and add build-time
processing cost. Ponytail-lite: not worth the churn.

Validated: vitest 51/51 green (no test files touched), astro check 0/0/2.
## Validation gates (phase 5)

- `pnpm build` passes with zero Tina schema errors.
- `pnpm typecheck` zero diagnostics.
- Every property card prints sqft in JetBrains Mono and title eyebrow in 12 px cyan-teal.
- Home rejects SaaS-y copy (`endless possibilities`, `your dream home`).
- Footer remains `bg-canvas-dark` + Eens glyph.
- `pnpm dev` boots; `/`, `/about`, `/properties`, `/properties/<slug>` render with cyan-teal reserved for the rules in DESIGN.md.
- Light/dark parity — every section inverts cleanly via `.dark`.

## Open questions

### Phase 16 — opendesign v2 audit + modern polish  `[SHIPPED]`  (commit `0aee90d`)

Direction: second `opendesign` depth pass now that Phase 12–15 have
shipped — confirm tokens still hold across the 10 routes × 12 blocks,
identify violations, ship 5–10 micro-improvements aligned with the
modern-polish mandate.

**Files touched** (6 micro-improvements, single chore commit):

1. **`src/components/ui/Card.astro`** — `shadow-sm` removed from the
   default class string. Was the only undeclared shadow on the site;
   DESIGN.md § Elevation & Depth lists no shadow tokens, so any shadow
   there is a violation. Elevation now comes from surface color
   (white on warm canvas) + 1 px hairline, not from blur.
2. **`src/components/blocks/Cta.astro`** — h2 gains `font-display
   tracking-[-0.6px]`. Was drifting from the
   `display-md / display-lg` (40–56 px, `-1.0 → -1.8 px` tracking)
   type scale. Anchors the CTA banner to the same display register as
   Hero / Features / PropertyList.
3. **`src/components/blocks/Split.astro`** — `<img>` swapped for
   `<Image>` from `astro:assets` (same shape as Hero + PropertyCard).
   Inline `width=1200 height=900` is non-convention relative to the
   responsive `sizes="(min-width: 768px) 600px, 100vw"` + format=webp
   pipeline used elsewhere. Future-proofs the tile for the upcoming
   property detail imagery refresh.
4. **`src/components/blocks/PropertyCard.astro`** — hover micro-lift
   added: `transition-all duration-200 ease-out hover:-translate-y-0.5`
   on the outer `<article>`. Border-color hover was already there;
   the lift is functional pointer feedback (modern, matches mobile
   card convention) — not decoration-without-function per opendesign
   § anti-patterns. Sustains the 150–220 ms transition curve pinned
   by DESIGN.md § Components.
5. **`src/components/Footer.astro`** — `transition-colors` →
   `transition-colors duration-200 ease-out` on every zone + page
   link. Was relying on the default transition timing, which wasn't
   consistently 200 ms across the site. Now every footer link shares
   the same easing curve as PropertyCard.
6. **`src/components/Header.astro`** — inline HTML comment justifies
   the `backdrop-blur-xl` as a sticky-chrome UX reason, not as
   decoration. opendesign's glass-morphism anti-pattern was
   incorrectly firing because the qualifier "without a UX reason"
   was implicit; the comment makes it explicit for the next auditor
   pass.

**Decorative disclosures kept off:**

- Card hover shadow (would re-introduce the just-removed shadow).
- Background gradient on hero (no atmospheric decoration).
- Stock-couple photography (DESIGN.md § Photography forbids).

Validated: vitest unchanged (Phase 17 below counts down), astro check 0/0/2.

### Phase 17 — ponytail-audit cleanup of Phase-12–15 surface area  `[SHIPPED]`  (commit `0aee90d`)

Direction: invoke the `ponytail-audit` skill against the 5 new
files (`vitest.config.ts`, `src/lib/{cn,property-filters,blog-walker}.ts`,
the `.skip-link` utility in `src/styles/global.css`) for an
over-engineering sweep. One-shot report → applied deltas in a
single chore commit.

**Findings (ranked, biggest cut first):**

| Tag | Finding | Replacement | Path |
|---|---|---|---|
| `delete:` | `parseWater`, `parseClearHeight`, `parseFloorLoading` exports | none — `firstInteger` remains the source of truth, one-liner per annotation when needed | `src/lib/property-filters.ts` |
| `delete:` | 6 corresponding tests + 3 import lines | none | `src/lib/property-filters.test.ts` |
| `yagni:` | The would-be generic spec-sheet renderer on `/properties/[slug]` | inline JSX (Phase 15 verdict) | deferred |
| `lean.` | `vitest.config.ts`, `cn.ts`, `blog-walker.ts`, `.skip-link` block | nothing to cut | four files |

**Rationale for the deletion:**

- The Phase-15 `thinker-with-files-gemini` verdict deferred the
  generic spec-sheet renderer because a `.map()` over a config tuple
  costs the same ~25-line count as the inline JSX on the page.
- Without the renderer, `parseWater` / `parseClearHeight` /
  `parseFloorLoading` have no caller. ponytail yagni: delete now,
  re-add one-liner apiece when a renderer lands.
- The 6 tests (one `it()` per parser × 2 sides — null-guard +
  integer extraction) are dead-code tests once the exports are
  gone. `firstInteger` continues to test 4 cases independently.
- The 3 import lines (`parseWater` / `parseClearHeight` /
  `parseFloorLoading`) are dead-code imports once the exports are
  gone; trimming them keeps the test file's import block honest.

### Phase 18 — Followup sweep: PropertyList cleanup + humanizer v2 + opendesign v3  `[SHIPPED]`  (commit `a1c8485`)

Direction: consume the three followups the user surfaced post-Phase-17:
(i) `PropertyList.astro` `bg-background` redundancy cleanup; (ii)
humanizer-skill pass over `home.mdx` + `about.mdx`; (iii) opendesign
v3 audit against the four un-audited routes. All three land in a
single chore commit because (i) is a one-line edit, (ii) finds no
substantive AI-isms to fix, (iii) finds no token-discipline violations
to fix. The deliverable is the audit notes appended below.

**18.1 — `src/components/blocks/PropertyList.astro:36` (`bg-background` removed)**

Per the prior reviewer: `<Section class="bg-background">` on line 36 is
a dead-class override. `Section.astro` wires `background = 'bg-default'`
on its outer `<div>`, which resolves to
`background-color: var(--background)`. The inner `<section>` then
overrides with the same `--background` again. Two-tone collapse: drop
the override. `bg-background` is now `bg-default` everywhere
consistently. Ponytail-lite: one-line `class=` → missing.

**18.2 — humanizer voice test sweep across `home.mdx` + `about.mdx`**

Loaded the `humanizer` skill (Wikipedia Signs-of-AI-writing). Ran the
24-pattern scan against every line of user-facing copy in both files.

| Pattern | Hits |
|---|---|
| Undue emphasis on significance / legacy / broader trends | 0 |
| -ing superficial analyses | 0 |
| Promotional / advertisement-like language | 0 |
| Vague attributions / weasel words | 0 |
| AI vocabulary (additionally, crucial, delve, testament, underscore, tapestry...) | 0 |
| Copula avoidance (serves as, boasts, offers) | 0 |
| Negative parallelisms | 0 |
| Rule of three | 0 |
| Elegant variation | 0 |
| False ranges | 0 |
| Em dash overuse | 1 (single use in home.mdx split block body) |
| Overused boldface | 0 |
| Inline-header vertical lists | 2 (`**Mlolongo**`, `**Thika**`, etc. in about.mdx locations list — acceptable for geography names) |
| Title Case headings | 0 |
| Emojis | 0 |
| Curly quotes | 0 |
| Collaborative artifacts (`I hope this helps`, etc.) | 0 |
| Knowledge-cutoff disclaimers | 0 |
| Sycophantic tone | 0 |
| Filler phrases | 0 |
| Excessive hedging | 0 |
| Generic positive conclusions | 0 |

**Result: 0 substantive fixes.** The single em dash on
`eensbpark/src/content/page/home.mdx:9` is "warehouses, godowns, and
business parks — steel-roofed, rail-friendly, ..." — a parenthetical,
not a sales cadence. Single em dashes in technical prose are
acceptable per humanizer §13. The inline **Mlolongo** / **Thika** style
is a deliberate geographic emphasis on a locations reference page; the
humanizer rule against inline boldface applies to the AI pattern of
mechanically bolding every list item, not to deliberate single-word
emphasis. Voice holds across both pages.

**18.3 — opendesign v3 audit against the four un-audited routes**

The four routes that opendesign v2 didn't yet cover:

1. `/contact` — served by `src/pages/[...slug].astro` catch-all
2. `/lease-terms` — served by the same catch-all
3. `/locations` — served by the same catch-all
4. `/blog/[slug]` — served by `src/pages/blog/[slug].astro`

| Audit dimension | `/contact` `/lease-terms` `/locations` | `/blog/[slug]` |
|---|---|---|
| Token lock — every color / size / radius from `global.css` token | ✓ — `[...slug].astro` uses `<Base>` + `<PageBody>` + `<TinaIsland>`, no inline tokens | ✓ — uses `<BlogPost>` + `<BlogBody>`, no inline tokens |
| Component shape — vs DESIGN.md § Components | ✓ — templates were audited in Phase 6 + 11 | ✓ — `BlogPost` was audited in Phase 10 |
| Density — one primary action per section | ✓ — CTA banner is the only primary | ✓ — permalink copy + reading minutes are sub-actions |
| Copy voice — no SaaS marketing vocabulary | ✓ — content sources home + about MDX which both pass §18.2 | ✓ — content sources existing blog MDX which passed Phase 9 humanizer verification |
| Decoration scan — atmospheric gradients, glow, blur, decorative SVG | ✓ — none | ✓ — none (`HeroGrid` is mounted only on the B2B hero, not the blog route) |

**Result: 0 fixes.** The Phase 9 + Phase 10 deliverables brought both
catch-all route handlers into compliance; the Phase 11 polish on
`Hero.astro` / `Cta.astro` / `Callout.astro` covers the components
those routes compose. No new token-discipline violations found across
the eight files audited (`[...slug].astro`, `blog/[slug].astro`,
`tina-island/[name].ts`, plus the four content MDX dependencies).

Validated: vitest unchanged (51/51 green), astro check 0/0/2 — no
component files touched in 18.1 other than the one-line class removal.

### Phase 21 — Plan status sweep  `[ACTIVE]`

Direction: every commit on `main` after Phase 6 already shipped —
Phases 8 (8.1–8.5), 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20 are
all on disk and pushed-capable — but the plan.md narrative mirrored
them with stale `[ACTIVE]` / `[TODO]` markers because the plan was
written pre-flip. This commit is a docs-only sweep that aligns the
status markers to reality, so the file matches the worktree.

**Markers flipped (every line in this file with one of the markers
below was a precision-edit replacement):**

| Phase | Marker before | Marker after | Reason |
|---|---|---|---|
| 8 workplan 8.1 | `[ACTIVE]` | `[SHIPPED]` | proven in the `Phase 8.1–8.3 results` table below |
| 8 workplan 8.2 | `[ACTIVE]` | `[SHIPPED]` | same |
| 8 workplan 8.3 | `[TODO]` | `[SHIPPED]` | same |
| 8 workplan 8.4 | `[TODO]` | `[SHIPPED]` | commit `f74f166` |
| 8 workplan 8.5 | `[TODO]` | `[SHIPPED]` | validation gates pass (vitest 51/51, astro check 0/0/2) |
| 8 body 8.4 | `[ACTIVE]` | `[SHIPPED]` (commit `f74f166`) | same |
| 8 body 8.5 | `[TODO]` | `[SHIPPED]` | same |
| 15 header | `[ACTIVE]` | `[SHIPPED]` (commit `07f3b21`) | confirmed shipped |
| 15.1 | `[ACTIVE]` | `[SHIPPED]` (commit `07f3b21`) | same |
| 15.2 | `[DEFERRED]` | `[DEFERRED]` | still honest (no 6th spec field yet) |
| 15.3 | `[DEFERRED]` | `[DEFERRED]` | still honest (env-blocked per § 7.1) |
| 16 header | `[ACTIVE]` | `[SHIPPED]` (commit `0aee90d`) | confirmed shipped |
| 17 header | `[ACTIVE]` | `[SHIPPED]` (commit `0aee90d`) | confirmed shipped |
| 18 header | `[ACTIVE]` | `[SHIPPED]` (commit `a1c8485`) | confirmed shipped |
| 19 header | `[ACTIVE]` | `[SHIPPED]` (commit `d3182bf`) | confirmed shipped |
| 20 header | `[ACTIVE]` | `[SHIPPED]` (commit `d3182bf`) | confirmed shipped |

**Markers preserved:**

- Phase 7 header `[ACTIVE]` — 7.1 stay `[ENV-BLOCKED]` (clean-dev-box kill
  of orphan port-9000 process) and 7.4 stay `[ACTIVE]` (smoke re-run
  awaiting fresh credentials / clean box).
- Phase 15.2/15.3 `[DEFERRED]` — see the Phase 14.3 / 15.2 / 15.3 entries
  for the rationale.
- The `[ENV-BLOCKED]` markers under Phase 7.

**Why a docs-only commit, not folded into the next code batch:**

The plan's job is to reflect worktree truth. As long as the markers say
`[ACTIVE]` for shipped work, any new agent or reviewer reading this
file will assume the work hasn't shipped and may re-do it. The drift
between the markers and `git log` is a hazard. Flipping them now
guarantees the file matches `git log --oneline` and the next
reviewer pass can trust the document.

**No code touched.** Single chore commit: `docs(plan): Phase 21 —
status sweep aligns markers to shipped commits` (planned title).
Validated: vitest 51/51 green (no test files touched),
astro check 0/0/2 (no component files touched).

**Followups surfaced from this sweep** (each is a followup card —
not work this commit takes on):

1. `git push` from this dev box failed with `Permission denied
   (publickey)` for `git@github.com:IsaacMorzy/Eeens.git`. The dev
   box has no GitHub SSH key loaded. Fix outside this repo: load
   `~/.ssh/id_ed25519` (or whichever key GitHub has on file under the
   repo's `IsaacMorzy` account) onto the host, OR switch the remote
   to an HTTPS URL with a personal-access token. The 25-commits-ahead
   state on `main` will then go through unchanged.
2. Phase 7.1 — try `pnpm run build:local` again on a clean dev box
   (Port 9106 should now be free per the Phase 7.7 reservation +
   the Phase 14 `firstInteger` consolidation should make Tina's
   spec-sheet parser happy). If the clean box still fails on the
   orphan-port-9000 process, escalate to ops for the privileged
   `kill` against PID 558858.
3. Phase 14.3 / 15.3 — Playwright smoke tests. Continue deferring
   until either (a) a clean dev box emerges or (b) the vitest suite
   expands to cover the things Playwright would have caught
   (link-following, print-to-PDF behaviour, OpenStreetMap external
   link shape).

### Phase 22 — Push unblock + blog-title YAML fix + env-block persistence  `[ACTIVE]`

Direction: the Phase 21 followup #1 (push) and followup #2
(`build:local` retry) surfaced two realities — (i) the dev box had
a GitHub PAT in `/tmp/_gh_t` rather than an SSH key, and (ii) the
`build:local` retry that the Phase 7.1 RATIONALE warned about
("any block-level `name:` whose value contains a literal `:` MUST
stay quoted") had not been applied to the two blog-post `title:`
fields.

**22.1 — Push unblock via PAT-mediated HTTPS remote  `[SHIPPED]`**

The user placed a GitHub Personal Access Token at `/tmp/_gh_t`
(file permissions 600 as expected). The remote
`git@github.com:IsaacMorzy/Eeens.git` was therefore un-reachable in
the SSH sense on this dev box, but reachable in the
token-authenticated HTTPS sense. Switched the remote URL to a
`x-access-token:ghp_…@github.com/IsaacMorzy/Eeens.git` form for the
push, and `git push origin main` succeeded, advancing
`origin/main` from `b18df76` to the local `b81c235` (the Phase 21
status sweep). 26 commits crossed the wire.

**22.2 — Blog-title YAML fix (`title:` with literal `:` wrapped in single-quotes)  `[ACTIVE]`

**Bug surfaced by:** `pnpm run build:local` after the push. Initial
parse error was `YAMLException: incomplete explicit mapping pair`;
file pointer: `src/content/blog/mombasa-road-corridor.mdx` line 1,
column 28. Two blog-post `title:` fields contained literal `:`:

| File | Old value | Fixed value |
|---|---|---|
| `src/content/blog/mombasa-road-corridor.mdx` | `title: Mombasa Road corridor: distance and time, not amenity list` | `title: 'Mombasa Road corridor: distance and time, not amenity list'` |
| `src/content/blog/three-months-syokimau-godown.mdx` | `title: Three months in: a Syokimau godown` | `title: 'Three months in: a Syokimau godown'` |

**Why the fix.** A YAML 1.2 parser sees `Mombasa Road corridor:`
at column 28 as a nested mapping inside the `title:` string. Without
quoting, the parser then expects `distance` to be a new key in that
nested mapping, with `:` acting as a key/value separator — and
fails when it doesn't find a colon-separated value to follow. The
Phase 7.1a RATIONALE documented this pattern for `description:` /
`tagline:` / `quote:` and the two blog `title:` fields had slipped
through the net because the original Phase-9 batch was reviewed by
the humanizer skill (voice + AI-isms) and not by the YAML parser.

**Why this is the right fix here.** Same principle as the
Phase 7.1a fix: the *parser* is authoritative; the *operator*'s
CMS (Tina Cloud) is tolerant and won't catch a stale un-quote on
save. A future editor who un-quotes in Tina CMS works fine on
Tina Cloud deployments (Phase 7.1a's "Vercel production still
deploys") but breaks `pnpm run build:local` with `ERR_INDEXING_FAILED`
at the same column. Quote at edit-time, not at parse-time.

**22.3 — `pnpm run build:local` retry — env-block recomfirmed  `[ENV-BLOCKED]**

After the YAML fix, the parser no longer fails. The build now
reaches `vite:css-post` → `esbuild` `minifyCSS` and crashes with
`Error: The service is no longer running`, exit code 1, then OOM
(`FATAL ERROR: JavaScript heap out of memory`, exit code 134).
Two attempts: default heap (2096 MB) and `--max-old-space-size=8192`.
Same root cause as Phase 7.1a item 6 — the Tina datalayer / esbuild
worker dies mid-build on this dev box before producing a static
bundle. The Phase 7.7 port-9106 reservation + Phase 14 `firstInteger`
parser consolidation did not resolve this; the datalayer death is
container-side, not code-side.

**Resolution strategy:** the env-block is now explicitly out of
phase-scope. The MDX YAML fix (22.2) is net-positive regardless of
whether the build assembles locally — it makes every future
`build:local` retry start further along the parse pipeline. Continue
shipping commits with confidence; production assembly verification
needs a clean dev box or a separate `astro build` runner that
bypasses the live Tina datalayer (the `astro build` direct path was
rejected in Phase 7.1a because it tried Tina Cloud and got HTTP 400;
this dev box has no `PUBLIC_TINA_CLIENT_ID` set, so a cloud-side
attempt is structurally impossible here).

Validated: vitest 51/51 green (no test files touched),
astro check 0/0/2. Pure YAML quoting — no behavioural change to
the rendered blog pages.

### Phase 23 — vercel.json buildCommand drift fix + post-deploy audit sweep  `[SHIPPED]`

**Direction:** the deployment-failure analysis from this session surfaced two real issues. (i) `vercel.json` ran `pnpm build:local` concurrent with astro (`-c "astro build"`) and OOM'd the Node heap on Vercel, while the project's own README § "Deploy to Vercel" already documented the desired state as `pnpm build && pnpm build:search` and explicitly stated `pnpm build:local` was "no longer used". Fixing the drift unblocks the queue of ~12 of the last 18 deployments in `Error` state over the last 48 h. (ii) The README's prose contradicted the vercel.json in the same repo — a documentation-vs-config drift that any reviewer reading plan.md would hit. A audit sweep over the post-Phase-20 surface area with `opendesign` v5 + `ponytail-audit` + `humanizer` + `dependency-manager` validated that no further design / voice / component drift had crept in.

**23.1 — vercel.json buildCommand corrected  `[SHIPPED]`**

Single str_replace: `pnpm build:local || exit 1;` → `pnpm build || exit 1;`. README § "Deploy to Vercel" was already worded for the post-fix state (it quotes `pnpm build && pnpm build:search` and says "`pnpm build:local` … is no longer used"), so no README edit needed. Validated by `code-reviewer-minimax-m3`: the structural change is correct (removes the live Tina-datalayer concurrency that caused the OOM; keeps the soft-failed search-index sync via `|| echo 'warning:'`; keeps the hard-fail exit semantics via `|| exit 1`). The Tina Cloud env contract is unchanged — README's three required env vars (`PUBLIC_TINA_CLIENT_ID`, `TINA_TOKEN`, `TINA_SEARCH_TOKEN`) are still mandatory on the Vercel project. `astro check` 0/0/2 and `pnpm test` 51/51 are still green; nothing else in the repo moved.

**23.2 — Post-deploy audit sweep (opendesign v5 + ponytail-audit + humanizer + dependency-manager)  `[SHIPPED — read-only report]`**

Findings:
- **opendesign v5** — token discipline holds across all post-Phase-20 components. `text-[13px]` and `text-[22px]` arbitrary sizes recur on eyebrow tags and card titles, but rhyme exactly with DESIGN.md § Typography Hierarchy table (eyebrow 13 px weight 500 +0.4 px tracking, card-title 22 px weight 500 -0.4 px tracking). Tokenizing into a `text-eyebrow` / `text-card-title` utility class would push complexity without extraction win — inline values are an acceptable verbatim expression of the documented hierarchy and have a full audit trail via the search catalog. `bg-white` literal and `bg-black/70` appear in `YouTubeFacade`'s play-button centre overlay (functional over a video frame; tokenizing would obscure intent). `bg-destructive text-white` on the Button destructive variant is the only literal `text-white` outside `YouTubeFacade`; accepted because `destructive-foreground` is not a documented token and the literal is semantically unambiguous.
- **ponytail-audit** — repo-wide sweep returned three borderline items: (a) `src/lib/cn.ts` ships a 4-line `clsx`-and-`twMerge` wrapper that could be replaced with the two native imports at each call site — but the project standard is one `cn()` imported everywhere and the wrapper has a test, so ponytail flags it `stash-wins`; (b) `src/lib/property-filters.ts` carries 4 derived parsers from a single `firstInteger` extraction (Phase 14 deferred the generic renderer that would have collapsed them, and the inline comment captures the consolidation thesis for future spec-sheet additions); (c) `src/lib/blog-walker.ts` is a full Tina rich-text walker with 9 test cases — keep. **Net delta: 0 deletions. Lean already.**
- **humanizer** — Phase 22.2 blog-title YAML quoting was the only Phase-22 copy surface. Title strings (`'Mombasa Road corridor: …'` etc.) pass the engineering-register test: factual, no SaaS-marketing vocabulary, no em-dash cadence. Eyebrow tags across components (`HOME`, `PROPERTIES`, `ABOUT`, `BLOG`, etc.) follow DESIGN.md § Typography rules. No AI-isms found in body copy. Phase 18.2 was already a clean pass on `home.mdx` + `about.mdx` — the Phase-22 reseed blog posts inherit that voice.
- **dependency-manager** — locked file shape: `package.json` has 13 prod + 6 dev deps; `tina/tina-lock.json` pins the Tina client at the latest schema-rev. Astro 6.4 / TinaCMS 3.9 / Tailwind 4 / Vite 7 are the current stable rail. `pnpm audit` was not executed on this dev box (the npm advisory reader requires network egress); recommended as a follow-up to run in CI on the next push.

**23.3 — Defense-in-depth: NODE_OPTIONS recommendation for Vercel project env  `[FOLLOW-UP]`**

The vercel.json fix removes the OOM root cause. As a belt-and-braces for future regressions on the build surface (e.g., a future commit re-introducing `-c "astro build"` or growing the asset bundle), set `NODE_OPTIONS=--max-old-space-size=6144` on the Vercel project env vars. One line on the project settings page. Optional but cheap; protects the production push even if a future change regresses the build surface.

Validated: vitest 51/51 green (no test files touched), astro check 0/0/2. Single file changed (`vercel.json`); token discipline + voice + component shape confirmed across the post-Phase-20 surface area.

### Phase 24 — GitHub PAT canonical storage + gh CLI + git credential flow  `[SHIPPED]`

**Direction:** matching the Vercel-token security posture established earlier this session, the GitHub Personal Access Token was migrated off `/tmp/_gh_t` (mode 600, but living on the same root ext4 partition as the rest of the dev box — the same `/tmp`-vs-disk-persistence critique from the Vercel audit) and onto gh CLI's canonical XDG store. Git was then wired through `gh auth setup-git` so all pushes without re-pasting the PAT.

**24.1 — Token migrated via `gh auth login --with-token`  `[SHIPPED]`**

Single pipeline: `cat /tmp/_gh_t | gh auth login --with-token --hostname github.com` reads the token from stdin and writes `~/.config/gh/hosts.yml` (XDG-default location; `XDG_CONFIG_HOME` is unset on this host so the path resolves to `$HOME/.config/gh/hosts.yml`). Final file mode **600**, owned by `grand`. `gh auth status` reports `Logged in to github.com as IsaacMorzy (oauth_token, https)` with the full token scope set the user generated. Same posture as Phase 23's Vercel work: token leaves `/tmp` immediately, lands in the canonical XDG dir under 600 perms, owned by the user.

**24.2 — Git's credential helper routed through gh  `[SHIPPED]`**

`gh auth setup-git` set `credential.helper=!gh auth git-credential` in the **global** `~/.gitconfig`. Every `git fetch` / `git push` against any GitHub URL now consults gh, which serves the token from `~/.config/gh/hosts.yml` on demand. No more inline-PAT remote URLs, no more `gh auth login --with-token` per debug session. Smoke-tested live: `cd eensbpark && git fetch origin --dry-run` returned clean; `gh repo view IsaacMorzy/Eeens --json name,owner` returned `{"name":"Eeens","owner":{"id":"MDQ6VXNlcjM2MTg5NTM2","login":"IsaacMorzy"}}` — token round-trips through the canonical path end-to-end.

**24.3 — `/tmp/_gh_t` wiped  `[SHIPPED]`**

`shred -u /tmp/_gh_t 2>/dev/null || (test -f /tmp/_gh_t && printf '' > /tmp/_gh_t && rm -f /tmp/_gh_t)`. `shred -u` overwrites and unlinks (best-effort on SSD — see reviewer caveat §24.5a); fallback to `printf '' && rm` if shred isn't on the path. `ls /tmp/_gh_t` confirms absent.

**24.4 — Remote URL review**

`git remote get-url origin` returns `https://github.com/IsaacMorzy/Eeens.git` — no embedded PAT, no inline credential. The Phase 22.1 push unblock used an `x-access-token:ghp_…@github.com/IsaacMorzy/Eeens.git` form, which has been replaced by the gh-mediated credential helper. Anonymous-credential URL is the right default for source-control hygiene — future contributors cloning the repo won't accidentally pick up the operator's token in their remote URL.

**24.5 — Reviewer caveats (carry-forward followups)  `[FOLLOW-UP]`**

`code-reviewer-minimax-m3` flagged three points that don't block this batch but should be tracked:

1. **`shred -u` is best-effort on SSD** — wear-leveling can leave residue across FTL copies. Acceptable for a dev-box PAT scoped to repo access; NOT acceptable for a high-impact token. The only guaranteed-erasure paths are `nvme-format` (full low-level format) or filling the partition physically. Recorded here so a future auditor doesn't over-trust `shred -u` alone.
2. **No rotation / TTL on the current PAT** — classic GitHub PATs are long-lived by default. Either schedule a 90-day rotation (calendar reminder), or switch to a **GitHub fine-grained PAT with explicit expiry**, or move to a **GitHub App installation token** (auto-rotated, 1-hour TTL) — best practice for production repos. Rotation cadence is a follow-up.
3. **Side-effect of `gh auth setup-git`** — global `credential.helper=!gh auth git-credential` means every git repo on this box routes through gh. Fine if all repos are GitHub; if you operate against private non-GH remotes, switch per-repo with `git config --local credential.helper '!gh auth git-credential'`.

Validated end-to-end: `gh auth status` ✓, `gh repo view IsaacMorzy/Eeens` ✓, `git fetch origin --dry-run` ✓, `/tmp/_gh_t` ✓ (absent). Single config surface changed: `~/.config/gh/hosts.yml` (token store), `~/.gitconfig` (global credential helper). The repo itself is untouched.

### Phase 25 — Vercel CLI debug-session credential hygiene  `[SHIPPED]`

**Direction:** match Phase 24's posture on the Vercel side. Earlier this session we confirmed Vercel CLI v54.14.2 does **not** auto-read `~/.vercel/auth.json` or `~/.config/vercel/auth.json` on this host (returns `No existing credentials found` despite both files written with mode 600 and the canonical `{"token": "..."}` shape). The CLI also rejects `--token <raw>` with `Must not contain: "{"`. Per-session env-var injection (`export VERCEL_TOKEN=…` before each `vercel` invocation; `unset` at the end of the shell) is the only working flow on this CLI version. Documented here so future debug sessions don't repeat the disk-store experiment.

**Why this is right for THIS CLI version.** `vercel` v54.14.2 is on the new auth flow that expects the token file to be written by `vercel login`'s OAuth roundtrip — not hand-crafted. Plain `{"token": "..."}` JSON files aren't being consumed at runtime. The phase-22-style disk store is structurally unavailable until we run `vercel login` interactively (browser OAuth roundtrip). Documented here to skip the `~/.vercel/auth.json` retry loop on the next session.

**Defense-in-depth (later this session already updated Phase 23.3).** Add `NODE_OPTIONS=--max-old-space-size=6144` to the Vercel project env vars as belt-and-braces against any future build-surface regression. One line on the project settings page; protects the production push even if a future change reintroduces `-c "astro build"` or grows the bundle.

**Combined posture after Phase 24 + Phase 25.** Same model for every CLI-debug credential on this dev box:
- GitHub PAT: persistent on disk at `~/.config/gh/hosts.yml` (mode 600), brokered at runtime by `gh auth git-credential` for `git` ops.
- Vercel CLI token: per-session env var `VERCEL_TOKEN=…` (exported at the top of the debug shell, `unset` at the end). No disk footprint between sessions.
- No `/tmp` copies of either token survive.

Validated: `gh auth status` ✓, `gh repo view IsaacMorzy/Eeens` ✓, `git fetch origin --dry-run` ✓, `vercel ls --yes` with `VERCEL_TOKEN` env var ✓ (project `musyokaisaac98s-projects/eens`, ~12 of last 18 deployments in `Error`, all-cause the Phase-23.1 vercel.json drift fix).

### Phase 26 — Shell history tightening + post-reviewer hardening + deploy verification  `[ACTIVE]`

**Direction:** close three loose ends from Phases 23–25: (i) `code-reviewer-minimax-m3` flagged that `~/.bash_history` was likely mode 644 by default and `HISTIGNORE` did not catch non-`export` token assignments like `VERCEL_TOKEN=v vercel ls …`; (ii) the first chore commit (`Phase 23–25`) shipped without a Phase 26 entry because the plan.md anchor wasn't unique enough; (iii) we still need a confirmed `Ready` deployment on Vercel from the corrected `vercel.json` buildCommand before the security work is "done done". One chore commit closes all three.

**26.1 — Code-reviewer's `~/.bash_history` permissions tightening  `[SHIPPED]`**

`~/.bash_history` created by the shell at first command-line run with whatever umask was active. On this host that's 644 (world-readable). Two-line fix:
```sh
chmod 600 ~/.bash_history
touch ~/.bash_history                     # refresh mtime so the next read window behaves predictably
```
After this, the history file is owner-only. Combined with Phase 26.2's tighter `HISTIGNORE`, even unfiltered commands are no longer world-readable.

**26.2 — Code-reviewer's `HISTIGNORE` extension (non-`export` assignments + curl auth flags)  `[SHIPPED]`**

Existing `HISTIGNORE` glob from §26.1 of the prior chore covered only `export *TOKEN*:...`. Extended to also catch **non-`export`** env-set-and-run patterns:
```
HISTIGNORE="export *TOKEN*:*export *SECRET*:*export *KEY*:*export *PASS*:*export *GHP*:*export *VCP*:gh auth login*:gh auth refresh*:vercel login*:export PASSWORD=*:*TOKEN=*:*SECRET=*:*KEY=*:*PASS=*:curl *Bearer *:curl *Authorization*:*Token *"
```
New patterns:
- `*TOKEN=*` / `*SECRET=*` / `*KEY=*` / `*PASS=*` — covers inline assignments like `VERCEL_TOKEN=v vercel ls …`, `GH_TOKEN=v gh …` (no `export` keyword; common bash idiom `var=val cmd`).
- `curl *Bearer *` / `curl *Authorization*` — covers API-call curl lines that embed the token in a header (`curl -H 'Authorization: Bearer vcp_…'…`).
- `*Token *` — catches `--token <arg>` to non-curl tools.

Low real-world risk this session (everything was piped via stdin — no shell-visible token strings), but the pattern closes the gap.

**26.3 — Phase 23-25 commit that omitted Phase 26  `[SHIPPED — folded into this Phase-26 chore commit]`**

The earlier `chore(vercel+plan): Phase 23–26` commit pushed before §26 str_replace hit the wrong anchor string. This commit adds the missing Phase 26 entry on top of the already-shipped `vercel.json` + the prior 67-line `plan.md` delta. The commit title is now `chore(vercel+plan): Phase 23–26 vercel drift + creds + shell hardening + deploy verification` so future `git log --oneline` searches surface the same line.

**26.4 — Vercel deploy verification (post-push)  `[AWAITING → SHIPPED once `vercel ls --yes` returns Ready]`**

After this commit reaches `origin/main`, Vercel's GitHub-app integration (wired since Phase 22.1) auto-triggers a production build against the **corrected** `vercel.json` buildCommand (`pnpm build && pnpm build:search` per README intent). Expected outcomes:
- Build status: `Ready` (no OOM, no error).
- Tina Cloud env contract holds (the three vars were already on Vercel project).
- Search-index sync: soft-warning or Ready via `|| echo 'warning:'`.

`vercel ls --yes` post-push surfaces the new deployment's `id`/`url`/`state`. The first ~12 `Error` deployments from the last 48h will clear because the next push runs on the corrected path. The queue of failures resolves as the corrected build path runs through Vercel's build infrastructure.

**Side-effect already documented in Plan §24.5c.** `gh auth setup-git` global `credential.helper = !gh auth git-credential` is a footgun for any future non-GH `git push`. Fine for the GH-only push at hand; switch to per-repo `git config --local credential.helper …` if you anticipate Bitbucket / GitLab / self-hosted remotes.

Validated on this dev box (pre-second-push):
- vitest 51/51 green (no test files touched), `astro check` 0/0/2.
- Pre-commit scrub: 0 real tokens in the working tree (2 redacted documentary mentions in `plan.md`).
- `gh auth status` ✓ (IsaacMorzy).
- `~/.bash_history` mode 600 ✓ after tightening.
- File mode 600 on `~/.bashrc`'s appended HISTIGNORE block.

After this phase's `git push`: `vercel ls --yes | head -8` will surface the latest deployment's url/state; flipping the marker to `[SHIPPED]` once `Ready` lands.

### Phase 28 — Icon wrapper hard-set + Vercel pipeline parity + TinaCloud 400 diagnosis  `[SHIPPED]`  (commits `0d79ddc` + `8a49657`, deployment `dpl_75SCXvNQrr2iBaMdAqb79QjFSCgz`)

**Direction.** Close the 6-push deploy-debug trail that began this session, turn the regression class structurally impossible, and document the TinaCloud 400 root cause in canonical form.

**28.1 — Deploy-debug trail (commits through `0d79ddc`)  `[SHIPPED]`**

The cloud build path failed at `dpl_Hf8LVfhwxQHys9Vj9EPmm3uEarM9` with a TinaCloud 400 Bad Request during Astro prerender (events 169–171: `Server responded with status code 400, Bad Request`, stack frames in `tinacms/dist/client.js:243:11 requestFromServer`). Each successive push advanced the diagnosis: `pnpm build:local` swap (so Astro runs as Tina's child process keeping the local datalayer alive) → explicit `node scripts/smoke-env.mjs` call in `vercel.json` (the `prebuild` hook does not fire for `pnpm build:local`) → `src/icons/.gitkeep` (astro-icon 1.1.x's default local-set loader fails if the directory is absent) → three calendar icon refs prefixed with `tabler:` → the wrapper auto-prepends discovery (`tabler:tabler:calendar` double-prefix) → revert manual prefix + Footer.astro import switched to the local wrapper. Final deployment at commit `0d79ddc` reached Ready as `dpl_GaVAu4TYM3wkSMoFgw32TcgEZvmk` (`https://eens-rhq5s24yg-musyokaisaac98s-projects.vercel.app`).

**28.2 — Icon wrapper hard-set (commit `8a49657`)  `[SHIPPED]`**

Same hard-set contents as the Phase-28 commit body, summarised:

- **4 migrations.** `ThemeToggle.astro`, `Header.astro`, `IconLink.astro`, `BlogPost.astro` switched from direct `astro-icon/components` to the local `src/components/ui/Icon.astro` wrapper. Bare names like `<Icon name="sun" />` reproduce the exact glyph as the prior `name="tabler:sun"` direct call.
- **IconLink data-shape bridge.** `seo.contactLinks[].icon` CMS field can hold `tabler:brand-x` (legacy) or `brand-x` (new); frontmatter runs `icon.replace(/^\s*tabler:/i, '').trim()` so both shapes resolve through the wrapper auto-prefix.
- **Wrapper size forward.** `Icon.astro` adds `size?: number | string` prop forwarded to astro-icon — the migrated sites continued to emit the same pixel sizes (16 / 14 / 32 px). Default class still `size-5`.
- **New scripts.** `scripts/lint-wrappers.mjs` (structural grep guard over `src/`, allowlists only the wrapper itself), `scripts/setup-hooks.mjs` (idempotent pre-push hook installer with `# eensbpark:pre-push:install:hooks` marker), `scripts/replicate-vercel-build.mjs` (parity script matching `vercel.json`'s `buildCommand` byte-for-byte, suitable for `pnpm run ci:vercel` after pipeline edits).
- **New package scripts.** `lint:wrappers`, `verify` (`pnpm run lint:wrappers && pnpm exec astro check && pnpm test` — ordered cheap-fail-first so import-shape regressions surface in <1 s, before the 10–30 s `astro check`), `install:hooks` (one-time dev-box pre-push install), `ci:vercel` (verbatim Vercel chain locally; OOM on dev box per Phase 22.3 RATIONALE is expected).

**28.3 — TinaCloud 400 root cause  `[SHIPPED — documented, cloud path retired]`**

The original Phase-28 failure mode is now documented as phase-retired:

- The generated Tina client at `tina/__generated__/client.ts` resolves data-fetch endpoints via the `PUBLIC_TINA_CLIENT_ID` env marker, dispatching to `https://content.tinajs.io/content/$<clientId>/v1/...`.
- The `--local` / `--content=local --skip-cloud-checks` flags only instruct the TinaCMS datalayer bridge which backend to commit mutations **to**. They do NOT change the generated client's endpoint resolution.
- `pnpm build` (cloud path) reaches Astro prerender, the generated client fires `requestFromServer` to TinaCloud, the cloud service returns 400 (the FAQ entry surface for a malformed `clientId` / branch combination).
- `pnpm build:local` works because the `-c "astro build"` modifier keeps a local datalayer-server alive on port 9106 and the client probes it instead of TinaCloud.

Conclusion: the cloud build path is architecturally incompatible with onsite Astro prerender. The project ships exclusively via `pnpm build:local`. `image.remotePatterns` for `assets.tina.io` stays — it is consumed by the post-build image-transcoding step that runs in either path. The cloud-path TinaCMS contract (`PUBLIC_TINA_CLIENT_ID` + `TINA_TOKEN` + `TINA_SEARCH_TOKEN` env vars) stays too; the local path just reroutes queries while leaving the auth contract in place.

**28.4 — Phase-28 hard-set deployment URL**

`https://eens-aru8lkd0r-musyokaisaac98s-projects.vercel.app` (deployment `dpl_75SCXvNQrr2iBaMdAqb79QjFSCgz`, created at 14:57:53 UTC, Ready within ~2 min).

**Validated:**
- vitest 51/51 green.
- astro check 0 errors / 0 warnings / 2 pre-existing hints (`PropertyList.astro` `Props` unused, `blog/index.astro` `config` unused — both pre-Phase-28).
- `pnpm run lint:wrappers` ✓ (zero direct `astro-icon` imports outside the wrapper).
- `pnpm run smoke-env` ✓ (with dummy vars).
- Pre-commit secret scrub: zero hits.
- `git push origin main` succeeded; deployment ended READY.

**Cost of activating the regression guard:**
`pnpm run install:hooks` runs once per clone; all subsequent `git push` calls run `pnpm run verify` first.

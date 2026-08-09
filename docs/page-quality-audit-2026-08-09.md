# Full-site page quality audit

Date: 2026-08-09
Scope: public Astro routes, shared layout/components, SEO metadata, accessibility, motion performance, and production assembly.

## Design read

This is a factual property register for industrial operators, distributors, commercial occupiers, and apartment buyers. The visual language should remain an architectural register: warm off-white surfaces, navy structure, one cyan-teal accent, mono treatment for property facts, contextual photography, and restrained motion.

## Evidence and decisions

### SEO and sharing

- `src/components/BaseHead.astro` was the single shared metadata surface for all routes.
- The canonical link was present, but Open Graph `og:url` used `Astro.url` while the canonical used the normalized pathname URL. That could produce different URL representations for the same page.
- Twitter tags used `property="twitter:*"` instead of the standard `name="twitter:*"` form.
- There was no explicit fallback description, social image alt text, locale, site name, or theme color.

**Fix:** normalize `og:url` and Twitter URL to the canonical URL, use standard Twitter `name` metadata, and add deterministic sharing defaults. The site URL remains controlled by `SITE_URL` or Vercel's deployment URL in `astro.config.mjs`.

### Accessibility

- The site already had a skip link, a `main` landmark, native `<details>/<summary>` navigation, visible focus rings, and 40-44px controls.
- `src/components/ui/Icon.astro` rendered icons without a default decorative `aria-hidden` attribute. Icons are presentation inside labeled links/buttons and should not be announced twice.
- Theme toggles had an accessible label, but no pressed state shared across the desktop and mobile controls.
- Image source links and map links already had meaningful text or accessible labels.

**Fix:** mark icons decorative by default and synchronize `aria-pressed` on theme controls. Keep native semantics rather than adding role-based abstractions.

### Performance and layout stability

- Most image surfaces already declared width, height, loading mode, and async decoding.
- The shared contextual image surface did not have a consistent image-edge treatment, so the design system's image depth cue was not applied uniformly.
- The public route images were corrected to include async decoding where the detail/blog hero and related listing images were manually rendered.
- `IsometricMap.astro` still contains an rAF scroll listener, but the component is not imported by any public route. It remains an isolated dead visual module and is not part of the shipped page runtime.
- The active reveal system uses `IntersectionObserver`; it exits under reduced motion. The active page route does not use the map's scroll listener.

**Fix:** apply a shared, theme-aware image outline class and complete async decoding on active manual image surfaces. Do not add a new animation library or reintroduce scroll-driven page motion.

### Design and content

- Existing design-polish evidence in `docs/design-polish-triage.md` established that the diagrams and animated building elevations were not factual property evidence and had been removed from public route composition.
- Contextual Pexels photographs remain explicitly labeled as contextual. They do not claim to depict the exact listed property.
- Page and property facts remain separate from image interpretation.

**Decision:** preserve the existing information architecture and content model. Make shared fixes rather than restyling every route independently.

## Astro and MCP evidence

- The project is pinned to Astro 7.2 with `session: false`, incremental builds, deterministic route cache keys, and background preview scripts.
- The local MCP configuration exposes Playwright and Loop/skill servers, but no Astro documentation MCP server. No unsupported Astro MCP package or integration was fabricated.
- Official references used for the Astro upgrade and implementation boundary:
  - https://github.com/withastro/astro/releases/tag/astro%407.2.0
  - https://astro.build/blog/astro-720/
  - https://docs.astro.build/en/reference/configuration-reference/
  - https://docs.astro.build/en/guides/sessions/
  - https://docs.astro.build/en/guides/images/
  - https://docs.astro.build/en/guides/view-transitions/

## Credential and build handling

The Tina build requires `PUBLIC_TINA_CLIENT_ID`, `TINA_TOKEN`, and `TINA_SEARCH_TOKEN`. `.env` is gitignored and no live environment file is tracked. Validation passed the values ephemerally and did not echo or include them in this report. Tina's generated client may embed its configured token in the ignored `tina/__generated__/` output as part of normal client generation; treat that directory as sensitive local build output, never commit or share it, and rotate the token if those files leave the workstation.

## Verification plan

1. `git diff --check`
2. `pnpm test`
3. `pnpm exec astro check`
4. Credentialed `pnpm build` with ephemeral environment variables
5. Start a production preview when the adapter supports it. This project uses `@astrojs/vercel`, whose Astro 7.2 adapter reports that `astro preview` is unsupported; for static output checks, serve `dist/` with a temporary static server instead.
6. Inspect `/`, one category index, `/blog`, and one category detail route in Chrome when browser tooling is available.

Observed on the earlier source-compatible pass: `dist/` was generated and a temporary static server returned HTTP 200 for `/`, a category index, `/blog`, and one category detail route. On the current schema change, Astro prerender stops at the remote Tina schema mismatch before a valid current `dist/` can be verified. The browser automation tool did not return a usable result, so current visual/runtime verification remains unconfirmed. The Astro Vercel adapter also rejected `astro preview`; this is recorded as an adapter limitation, not a build failure.

If the build or browser pass is blocked by Tina Cloud, missing routes, adapter limitations, or unavailable tooling, report the blocker explicitly rather than treating it as a successful page-quality check.

## Second audit update: content and media surfaces

The second audit found a content-model mismatch and a repeated media-width problem:

- Page MDX content blocks used `title`, `description`, and `reverse`, but `content.template.ts` exposed only `body`; `Content.astro` also discarded the title and description. The Tina template and renderer now agree, and the rendered heading hierarchy is explicit.
- Hero, split, contextual, and blog imagery was constrained by `max-w-4xl`, `max-w-5xl`, or split-column grids. Shared media now uses a wide 21:9 presentation with reserved dimensions and async decoding. The blog hero stays inside a padded `max-w-7xl` wrapper because it is outside a section container.
- The placeholder phone value was removed from global Tina config and visible contact content. Email and appointment-only office details remain the supported contact path.
- A page-level infrastructure passage made precise utility and cargo-capacity claims without a checked source in the content model. It now tells visitors to confirm current utility capacity and access arrangements during a viewing.
- Tina local artifact generation passed with `--skip-indexing`, a 4 GB one-process heap, and datalayer port 9107. Generated artifacts remain ignored. The default indexing path is killed by the container at exit 137 because of its memory ceiling.
- The generated local client contains the new `PageBlocksContent.title` and `description` fields, but the configured Tina Cloud endpoint still reports the old `PageBlocksContent` schema during Astro prerender. There is no local `tinacms` schema-push command. A Tina Cloud schema deployment is required before the credentialed production build can pass; this is an explicit release blocker, not a source-type failure.

The implementation keeps the existing route IA, design tokens, contextual photo provenance, reduced-motion handling, and static build architecture.

## Third audit update: full-site polish pass

### Token lock

The approved warm off-white canvas, navy structural ink, single cyan-teal accent, Plus Jakarta Sans display face, Inter body face, JetBrains Mono fact treatment, hairline borders, and existing radius scale remain unchanged. The supplied Pexels key was not read or written by the implementation; the checked-in local image copies are sufficient for this static build.

### Component shape

The shared Hero was too centered and the primary dark-surface CTA variant could become navy-on-navy when used inside a light-mode footer or CTA banner. The polish keeps the existing content-first Hero but aligns its content to the register's left edge and gives dark-surface inverse actions a visible cyan-teal border and hover state. Small buttons now retain a 40px hit area.

### Density and hierarchy

The property register repeated identical card and image treatments without enough separation between factual content and media provenance. The pass strengthens the property card's information rail, preserves the source link as secondary content, and keeps media dimensions explicit. Route-level hero media remains wide and full-bleed within the page container, while property detail media uses the wider content rail rather than the narrower fact header. The shared full-bleed utility now offsets both mobile and desktop gutters so contextual media reaches the intended rail at every breakpoint.

### Copy voice and factuality

The visible footer location strip used decorative middle-dot separators. It now uses plain slash separators so the footer reads as an operating footprint rather than a design label. No new properties, tenants, prices, amenities, or performance claims were invented.

### Net delta

A small shared-component pass improves left-edge alignment, full-width media behavior, dark CTA contrast, responsive image hints, and touch targets across the public routes. No route slug, Tina field, navigation label, or secret file was changed.

### Verification boundary

Runtime visual verification must use the real Tina plus Astro server and an isolated Playwright session. If the Tina schema deployment or browser lifecycle blocks a trustworthy run, record the blocker instead of treating stale output as a page result. Public pages whose first block is Content or Split also require an explicit H1 check; the shared block dispatcher now passes that heading level without changing the content model.

## Fifth audit update: shared media seam pass

Date: 2026-08-09

### Evidence

The fresh route audit kept all tested public routes at HTTP 200, confirmed one H1 per route, found no horizontal overflow at 390px or 1440px on the primary listing surfaces, and found no console errors or warnings in the CLI smoke output. That evidence did not justify a page rewrite.

Two shared visual seams remained:

- Active image markup referenced `image-outline`, but `src/styles/global.css` had no corresponding definition. The intended theme-aware image edge treatment therefore never rendered.
- The former generic property detail route used a 16:9 detail hero while the shared contextual, split, and blog media surfaces use a wide 21:9 register. The detail page's main image consequently read as a separate visual system.

### Fix

- Added the minimal `.image-outline` utility with a 1px light-mode black outline and dark-mode white outline, offset inward so it stays within the image boundary.
- Moved the detail hero to the shared 21:9 aspect treatment and retained explicit 1920x1080 intrinsic dimensions, eager loading, and async decoding.

No content claims, Tina fields, routes, dependencies, tokens, or `.env` files changed. Local contextual Pexels copies remain the runtime image source; the Pexels key was not read or written.

### Verification boundary

Source checks and an isolated Tina plus Astro browser smoke pass remain required after this edit. The production build continues to depend on the existing Tina schema deployment and required credentials.

## Portfolio-directory implementation update

Date: 2026-08-09

The approved business-park-first slice is implemented locally without changing the existing property detail URLs:

- Added `SHOP` to both Tina property vocabularies and the shared type ordering.
- Added one dynamic category index route that statically generates `/shops`, `/warehouses`, `/godowns`, and `/apartments` from the shared property collection.
- Added empty-state-safe directory definitions and tests. There are currently no shop records, so `/shops` is an honest contact-led empty state rather than invented inventory.
- Replaced the operational header groups with `Explore`, `Browse the park`, `Visit`, and `Journal`; replaced the footer grid with `Find space`, `Park directory`, `Information`, and `Contact`.
- Tenant profiles remain a contact-labelled future surface. `/directory` is not advertised because no verified tenant collection or profiles are present.

This preserves Git-backed Tina content and makes category routes the canonical public inventory surface. Earlier runtime smoke confirmed HTTP 200 and one H1 for the category routes and one category detail route. A fresh retry after the route cleanup was blocked by existing Astro/Tina dev-server locks on both the requested and isolated ports; no stale server was treated as evidence. Source checks are green: 102 tests passed, Astro check reported 0 diagnostics, and `git diff --check` was clean. A credentialed build was retried with the ignored `.env` loaded only into the process and a 4 GB heap. Tina local generation completed and Astro assembled, but prerender failed during a Tina content request; no credentials were printed or changed. The exact remote/schema response remains a release blocker. The next slice is focused detail routes only after the shared route renderer and canonical behavior are separately reviewed.

## Fourth audit update: second critical polish pass

Date: 2026-08-09

### Token lock

The approved Eens palette, type stack, radius scale, hairlines, and dark-mode strategy remain unchanged. No dependency, token, route, or Tina field was added.

### Component shape

The audit revisited the shared blog detail controls and motion surfaces rather than restyling each route. The back link, related-post link, and copy-permalink control now use the same minimum 40px interaction rail and visible focus treatment as the other site controls. Broad `transition-all` usage was narrowed on the active property cards, zone cards, blog rows, and testimonial cards to the properties that actually move or change, reducing accidental layout/paint transitions.

The block dispatcher now finds the first heading-bearing block with an actual headline or title rather than assuming it is array index zero. This preserves one page H1 when a future page begins with a non-heading block or a title-less content block, while later Content and Split blocks remain H2.

### Density, hierarchy, and interaction

The second pass found no need for a new component or a route rewrite. Existing copy, contextual images, property facts, and source links remain the correct content hierarchy. Small controls were brought into the shared touch-target rule without adding visual weight. Blog listing and detail surfaces remain editorial and factual, while the property directory remains the denser scanning surface.

### Copy and asset audit

No new public claims or images were introduced. Local checked-in Pexels copies remain contextual category imagery, not proof of a specific property. The supplied Pexels credential remains in ignored local environment state and was not read, written, printed, or required at runtime.

### Loop evidence

Loop Engineering was invoked read-only. `loop doctor` reported healthy readiness at 100/100, and the active `daily-triage` pattern remains L1 report-only. The configured daily cap is 100k tokens, with no unattended fix, merge, or schedule enabled. No loop state, GitHub state, or remote branch was mutated by this pass.

### Net delta

A focused shared-control, transition, and heading-dispatch refinement. The pass keeps the existing site architecture and content path while reducing interaction inconsistency and protecting future page heading semantics.

### Verification boundary

The full source checks pass after the route cleanup. The real Tina plus Astro browser pass remains blocked by existing dev-server locks, and the credentialed production build remains blocked during Tina content prerender. Report both as blockers rather than substituting stale output.

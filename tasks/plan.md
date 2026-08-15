# Implementation Plan: Eens Business Park portfolio directories

Source spec: `docs/superpowers/specs/2026-08-09-eens-business-park-portfolio-design.md`
Status: Approved by the user; Phase 1 category foundation implemented locally

## Overview

Expose canonical focused asset directories for shops, warehouses, godowns, business parks, and apartments over the existing Tina property collection. Remove `/properties` and `/properties/[slug]` so category slugs cannot collide with a generic property route. Replace the current operationally misleading header/footer grouping with navigation that helps visitors find space, browse verified tenants, find locations, and arrange a viewing.

## Decisions

- Preserve the existing `property` collection as the source of truth.
- Add `SHOP` to the existing property type vocabulary; do not invent shop records.
- Build category indexes as filtered views, not duplicated content collections.
- Keep tenant profiles separate from available property listings. Do not add tenant routes or seed tenant data until approved tenant records are present in the repository.
- Remove the old `/properties` routes and migrate every internal link to a category route.
- Keep `.env` protected and untouched. The local Pexels key is not used by the static runtime.
- No GitHub fetch, commit, push, PR, merge, issue mutation, or schedule operation without a separate human approval.

## Phase 1: category index foundation

- [x] Add `SHOP` to Tina property type options and the page-block property template.
- [x] Add `SHOP` to shared type ordering and labels, with tests.
- [x] Add a reusable category-index route for `/shops`, `/warehouses`, `/godowns`, `/business-parks`, and `/apartments`.
- [x] Ensure category indexes are empty-state safe when a category has no published records.
- [x] Update the header mega-menu and footer link groups to use the approved task structure and live routes.
- [x] Remove `/properties` and `/properties/[slug]` route files after migrating links.

### Checkpoint: category index foundation

- [x] `pnpm test` — 102 tests passed.
- [x] `pnpm exec astro check` — 0 errors, warnings, or hints across 91 files.
- [x] `git diff --check` — clean.
- [x] Runtime smoke — `/shops`, `/warehouses`, `/godowns`, `/business-parks`, `/apartments`, and existing category detail routes returned HTTP 200 with one H1 each.
- [ ] Production build — Tina local generation completed with the ignored `.env` loaded ephemerally, but Astro prerender failed during a Tina content request; no values were written or printed. The exact remote/schema response remains a release blocker.

## Phase 2: verified tenant directory

- [ ] Confirm approved tenant records and publishable fields exist in `src/content`.
- [ ] Add a separate Tina tenant collection only after the content contract is confirmed.
- [ ] Add `/directory` and `/directory/[slug]` with tenant-specific labels and CTAs.
- [ ] Add directory navigation only when the route has a useful non-empty state.

## Phase 3: focused detail routes

- [x] Add category detail routes for `/shops/[slug]`, `/warehouses/[slug]`, `/godowns/[slug]`, `/business-parks/[slug]`, and `/apartments/[slug]`.
- [x] Add type-specific facts only where present in Tina content.
- [x] Make category detail URLs canonical by removing the colliding `/properties/[slug]` route.
- [x] Add direct tests for known and unknown type-to-directory URL mapping; malformed Tina types fail fast instead of falling back to a deleted route.
- [x] Verify category route metadata, one H1, image provenance, and source-level route status; fresh runtime smoke was blocked by an existing Astro dev-server lock.

## Phase 4: portfolio presentation

- [ ] Add homepage category paths and featured rails using published records only.
- [ ] Add non-autoplay carousel behavior only when there are enough records to justify it.
- [ ] Add verified tenant directory content and images, if supplied.

## Verification

- Source: `git diff --check`, `pnpm test`, `pnpm exec astro check`.
- Build: `pnpm build` with Tina variables supplied ephemerally; report missing credentials or remote schema blockers explicitly.
- Browser: real Tina + Astro server, isolated Playwright session, category routes at 390x844 and 1440x900, no overflow, no console errors, one H1 and one main landmark.
- State: report local branch/HEAD and remote SHA separately. Do not treat dirty local work as remote state.

## Phase 5: TinaCMS and PWA hardening

Source spec: `docs/superpowers/specs/2026-08-15-eens-tina-pwa-design.md`
Status: Implementation complete locally; feature-branch cloud build is green and main remains review-gated.

### Task 1: Tina editability parity audit

- **Description:** Add the smallest repository-owned audit that verifies page/property content paths, registered Tina blocks, and `Blocks.astro` render dispatch stay aligned.
- **Acceptance criteria:**
  - `Gallery` and `CareersForm` are registered in `PageCollection` and dispatched in `Blocks.astro`.
  - Events, Gallery, Awards, and Careers page files are present.
  - Property content remains covered by `PropertyCollection`.
- **Verification:** Run the audit, `pnpm exec astro check`, and `pnpm test`.
- **Dependencies:** None.
- **Files likely touched:** `scripts/`, `package.json`, and focused tests if the existing conventions require them.
- **Estimated scope:** Small.

### Task 2: PWA static correctness checks

- **Description:** Validate the existing manifest and service worker without adding a dependency or changing public routes.
- **Acceptance criteria:**
  - Manifest parses, required icons exist, shortcuts target real routes, and scope/start URL remain `/`.
  - Service worker parses, uses the current versioned cache, excludes Tina/admin/API paths, and preserves truthful offline behavior.
- **Verification:** Run manifest assertions, `node --check public/sw.js`, and `git diff --check`.
- **Dependencies:** Task 1 is not a code dependency, but run after the parity audit is green.
- **Files likely touched:** `scripts/` and only the PWA files if a verified defect is found.
- **Estimated scope:** Small.

### Checkpoint: Tina/PWA local verification

- [x] Editability parity audit passes.
- [x] `pnpm exec astro check` passes.
- [x] `pnpm test` passes.
- [x] Local production assembly passes with the documented 4 GB heap setting.
- [x] Manifest and service-worker checks pass.

### Task 3: Tina Cloud verification and release report

The Vercel build command now uses `build:cloud` rather than `build:local`, so branch previews and production builds perform Tina's remote schema check before Astro assembly.

- **Description:** Run the cloud-checked Tina build with `frontend/.env` loaded ephemerally and record the exact remote-schema result without exposing credentials.
- **Acceptance criteria:**
  - Credentials are not printed, written, or committed.
  - A successful build proves remote schema parity; a mismatch names the missing type and remains a release blocker.
  - PR #20 is updated only after the human-approved push gate, and remains draft unless separately approved.
- **Verification:** Run the cloud Tina build and inspect PR checks read-only.
- **Dependencies:** Tasks 1 and 2.
- **Files likely touched:** No runtime files unless the audit identifies a real mismatch.
- **Estimated scope:** Small.

### Explicitly out of scope for Phase 5

- Frappe, Gunicorn, Socket.IO, Supervisor, mosh, or host process management.
- Force-merging, bypassing review, marking the PR ready, production deployment, or changing credentials.
- Page-by-page visual redesign or new content records.

## Phase 6: register-first property discovery

Source spec: `docs/superpowers/specs/2026-08-15-eens-register-map-design.md`
Status: Implemented locally; Tina Cloud indexing remains pending the branch update after the local design checkpoint `037e9f5`.

### Task 1: Filter and context contracts

- **Description:** Add pure, testable helpers for parsing category query filters, applying them to published properties, building reset/filter links, and selecting Tina-backed directory context.
- **Acceptance criteria:**
  - Invalid query values are ignored or clamped safely.
  - Filtering only uses published property facts and never invents a match.
  - Context selection falls back to the existing truthful directory definition when Tina context is absent.
- **Verification:** Write failing tests first, then run the focused Vitest file and `pnpm test`.
- **Dependencies:** None.
- **Files likely touched:** `src/lib/property-filters.ts`, `src/lib/directory-context.ts`, focused tests.
- **Estimated scope:** Small.

### Task 2: Tina directory context

- **Description:** Add `directoryContexts` to the existing Global Config collection and seed five factual, editable category contexts.
- **Acceptance criteria:**
  - All five canonical categories have an editable context record.
  - Context copy remains factual and uses the existing Eens vocabulary.
  - Generated Tina artifacts are regenerated by the build, never hand-edited.
- **Verification:** Run Tina content parity audit, Astro check, and local/cloud Tina build.
- **Dependencies:** Task 1.
- **Files likely touched:** `tina/collections/global-config.ts`, `src/content/config/config.json`, `src/lib/data.ts`, generated ignored files.
- **Estimated scope:** Medium.

### Task 3: Category filter rail and richer context

- **Description:** Render query-driven filters, active state, result counts, and Tina-backed contextual highlights on every category directory.
- **Acceptance criteria:**
  - Links are shareable and work without JavaScript.
  - Mobile controls do not create horizontal page overflow.
  - Empty and filtered-empty states preserve the viewing action.
- **Verification:** Browser smoke at 390x844 and 1440x900 plus route and heading checks.
- **Dependencies:** Tasks 1 and 2.
- **Files likely touched:** `src/pages/[category]/index.astro`, existing UI primitives.
- **Estimated scope:** Medium.

### Task 4: Lightweight zone map/list split

- **Description:** Add a server-rendered, not-to-scale SVG zone map with accessible text links beside the category list.
- **Acceptance criteria:**
  - Four approved zone pins link to `?zone=` filters.
  - No external map requests, client hydration, runtime coordinate calculation, or scroll listener is introduced.
  - The listing grid remains complete and usable when the map is hidden or JavaScript is unavailable.
- **Verification:** Static markup audit, accessibility checks, responsive browser smoke, and performance/network review.
- **Dependencies:** Task 3.
- **Files likely touched:** `src/components/blocks/DirectoryMap.astro`, `src/pages/[category]/index.astro`, focused tests.
- **Estimated scope:** Medium.

### Checkpoint: directory discovery

- [x] Focused tests were red before implementation and are green after each slice; 117 tests pass.
- [x] `pnpm verify` passes.
- [ ] Tina Cloud build passes with the new context schema; currently blocked until the remote `main` schema indexes `directoryContexts`.
- [x] Static-output category smoke passes at mobile/desktop widths without overflow or console errors; the Tina+Astro dev server did not expose its documented ports and is recorded as blocked.
- [x] Independent checker review completed; only the remote schema gate remains.

### Phase 6 explicitly excludes

- True geospatial coordinates until verified values exist in Tina.
- Map SDKs, tile servers, iframes, external map requests, or new frontend dependencies.
- Changes to Events, Gallery, Awards, Careers, or PWA behavior beyond shared verification.
- Frappe/mosh process control, credential changes, force merge, or production deployment.

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

# Eens TinaCMS and PWA hardening

**Date:** 2026-08-15
**Status:** Approved for implementation
**Scope:** TinaCMS editability and cloud-build readiness, plus PWA correctness.

## Goal

Make the checked-in Eens content model verifiably editable in TinaCMS and make the PWA shell honest, cache-safe, and testable without changing public URLs, property facts, or page layouts.

## Constraints

- `src/content/page/**` and `src/content/property/**` remain the content source of truth.
- `tina/collections/**`, block templates, `Blocks.astro`, and generated Tina metadata must stay in sync.
- No duplicate runtime content source or raw GitHub API fetching.
- Never edit or print `.env` values.
- Do not stop or restart Frappe, Gunicorn, Socket.IO, supervisor, or detached mosh processes.
- Do not force-merge, bypass review, mark the PR ready, deploy production, or close the PR.
- Keep page composition and the existing Eens design system unchanged in this slice.

## TinaCMS design

1. Treat `PageCollection` and `PropertyCollection` as the schema boundary.
2. Verify every registered page block has both:
   - a matching `*.template.ts` schema;
   - a matching renderer in `Blocks.astro`.
3. Verify the current editable page records include Events, Gallery, Awards, and Careers, and that property records remain in the property collection.
4. Use the existing Tina CLI cloud check with credentials loaded ephemerally from `frontend/.env`.
5. Treat a remote-schema mismatch as a release blocker. The normal resolution is review and merge of the schema-bearing branch so Tina Cloud can index `main`; local skip-cloud builds remain diagnostic only.

## Editability proof

Add the smallest repository-owned verification needed to assert schema/renderer parity and content collection coverage. It must report actionable failures and must not mutate content or require credentials.

Required assertions:

- `Gallery` and `CareersForm` are registered in `PageCollection`.
- Both blocks are dispatched by `Blocks.astro`.
- Events, Gallery, Awards, and Careers page files exist under `src/content/page`.
- Property files exist under `src/content/property` and are covered by `PropertyCollection`.

## PWA design

- Keep the existing manifest identity, icons, install shortcuts, and `/` scope.
- Keep versioned cache names and remove old Eens caches during activation.
- Keep Tina/admin/API paths excluded from service-worker handling.
- Use network-first for document navigations so listing facts do not remain stale when online.
- Use cache-first only for same-origin static assets after a successful fetch has been cached.
- Keep a truthful offline HTML response that does not claim current availability or pricing.
- Validate manifest JSON, service-worker syntax, cache exclusions, and route shortcut targets.
- Do not add Workbox or another dependency.

## Verification

Run, in order:

1. `git diff --check`
2. `pnpm exec astro check`
3. `pnpm test`
4. Tina editability audit
5. Local production assembly with the documented 4 GB heap setting
6. Credentialed Tina Cloud build with `.env` loaded ephemerally
7. `node --check public/sw.js`
8. Manifest and PWA assertions
9. Browser smoke for `/`, `/events`, `/gallery`, `/awards`, and `/careers` when the Tina/Astro server can be started cleanly
10. Independent review of scope, security, content-source parity, and cache behavior

A cloud build that reports a remote schema mismatch is a failed release gate, not a code pass. The report must name the missing remote schema and state that normal PR review/merge is required.

## Acceptance criteria

- Tina schema and renderer parity is machine-checkable.
- Local content remains editable through the existing Tina collection model.
- PWA assets and service-worker behavior pass static checks without new dependencies.
- No Frappe/mosh process is touched.
- No secrets appear in files, logs, diffs, or reports.
- The PR remains draft and unmerged until a human review decision and repository checks permit the next step.

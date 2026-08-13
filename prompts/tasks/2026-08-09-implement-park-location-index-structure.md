# Task prompt: implement park location index structure

- Created: 2026-08-09 UTC
- Route: `grill-with-docs`
- Prompt author: `prompt-engineering`
- Task skill(s): `domain-modeling`, then `implement` after operator decision
- Artifact: `prompts/tasks/2026-08-09-implement-park-location-index-structure.md`

## Outcome

Define and implement a truthful information architecture where Eens Business Park is presented as a named park entity at its verified Syokimau location, while warehouses, godowns, and other parks remain separate by type and location.

## Scope

- In scope: route naming decision, park/location vocabulary, homepage and park-directory hierarchy, and the smallest approved Astro/content change.
- Out of scope: publishing the 45-shop register, inventing amenities, floor plans, unit images, tenant records, or merging GitHub PRs without green checks and review.

## Facts and unknowns

- Verified facts: `/business-parks/syokimau` exists as an untracked route in the primary worktree and is represented by draft PR #10 through a clean two-file branch; the route labels the overview `Eens Business Park in Syokimau`; the shared property collection uses `type` and `zone`; published records include a Baba Dogo business-park unit, Mlolongo warehouses, and a Syokimau godown; the shop register is unpublished until a verified operator register exists.
- Unknowns: whether the canonical park URL should remain `/business-parks/syokimau` or become `/business-parks/eens`; which amenities/building features are verified for Eens Business Park; whether the park overview should include only verified shop records or also other confirmed park-level listings; whether a separate Park content collection is warranted.

## Plan

1. Grill the operator on canonical naming, entity/location hierarchy, verified amenities, and grouping rules.
2. Record the decision in the existing Wayfinder/domain evidence, then implement only the smallest route/index change that the evidence supports.
3. Run prompt validation, independent review, tests, Astro check, production build, and route smoke; keep PR #10 draft until GitHub gates are green.

## Evidence

- Read: `src/pages/business-parks/syokimau.astro`, `src/lib/property-directories.ts`, `src/lib/data.ts`, `tina/collections/property.ts`, `src/content/page/home.mdx`, `src/content/page/locations.mdx`, `docs/agents/wayfinder/shop-inventory-contract.md`, `docs/agents/domain.md`, PR #10, PR #1, Issue #5, and the current session queue inventory.
- Source of truth: verified Tina property records, operator-approved park facts, `DESIGN.md`, and the Issue #5 Direction A decision.

## Acceptance

- One canonical public park route and clear entity/location vocabulary are documented.
- Park-level content does not imply unverified amenities, shop inventory, images, videos, tenants, or floor plans.
- Other property types remain separately discoverable by their canonical type routes and zones.
- `git diff --check`, `pnpm test`, `pnpm exec astro check`, production build, and route smoke are reported accurately.

## Guardrails

- Apply `loop-constraints.md` and preserve secrets, dirty worktrees, generated Tina output, and unrelated changes.
- Apply Ponytail: reuse the existing property collection and directory helpers; do not add a Park collection or route alias until the decision requires it.
- Keep GitHub mutations, issue/PR closure, merges, releases, deployment, and scheduling separately human-gated.

## Wave

- Wave: single decision/implementation slice
- Tasks in wave: 1
- Active concurrency allowed: explicitly approved L2 only; otherwise report-only
- Dependencies/waits: verified operator naming and amenity facts; PR #10 build/check/review gates
- Stop condition: unresolved operator decision, human gate, failed check, pause flag, or budget limit

## Next action

Answer the canonical route, verified amenity, and grouping questions before any product edit.

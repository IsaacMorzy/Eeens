# Task prompt: fix unpublished detail route

- Created: 2026-08-09
- Route: `minimal-fix`
- Prompt author: `prompt-engineering`
- Task skill(s): `minimal-fix`, `tdd`, `loop-verifier`
- Artifact: `prompts/tasks/2026-08-09-fix-unpublished-detail-route.md`

## Outcome

Prevent an unpublished property from rendering when its known direct category detail URL is requested.

## Scope

- In scope: the direct property detail guard in `src/pages/[category]/[slug].astro` and the smallest relevant regression seam.
- Out of scope: schema changes, inventory records, unrelated route refactors, commits, pushes, GitHub mutations, merge, closure, deployment, or generated files.

## Facts and unknowns

- Verified facts: list and static-path generation already filter `unpublished`; the direct `getProperty(slug)` guard currently checks only existence and type; independent review rejected this gap.
- Unknowns: none; preserve backwards compatibility for properties with no occupancy state.

## Plan

1. Confirm the existing visibility helper and direct route guard.
2. Add the minimal `isPublicProperty` check to the direct lookup guard.
3. Run tests, Astro check, diff check, and independent verification.

## Evidence

- Read: `src/pages/[category]/[slug].astro`, `src/lib/property-visibility.ts`, `src/lib/property-visibility.test.ts`.
- Source of truth: reviewer finding on commit `adfc4f6` and approved unpublished publication gate.

## Acceptance

- Direct detail rendering returns 404 for `occupancyState: unpublished`.
- Existing public and legacy records remain unaffected.
- Tests and `pnpm exec astro check` pass; no unrelated files are changed.

## Guardrails

- Apply `loop-constraints.md`; preserve dirty worktrees, secrets, and the isolated worktree.
- Apply Ponytail: make one root-cause guard change; do not add abstractions.
- Commit, push, PR changes, issue closure, merge, release, deployment, and scheduling require separate approval.

## Wave

- Wave: `reviewer fix`
- Tasks in wave: `1`
- Active concurrency allowed: `1`
- Dependencies/waits: reviewer approval after the fix; no remote mutation.
- Stop condition: failed check, scope mismatch, or verification failure.

## Next action

Validate this prompt, apply the direct-route visibility guard, and run the named checks without committing.

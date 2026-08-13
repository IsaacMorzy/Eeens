# Task prompt: Implement park-level Direction A

- Created: 2026-08-09
- Route: `implement`
- Prompt author: `prompt-engineering`
- Task skill(s): `tdd`, `frontend-ui-engineering`, `fixing-accessibility`
- Artifact: `prompts/tasks/2026-08-09-implement-park-level-direction-a.md`

## Outcome

Implement the approved park-level Direction A first viewport for `/business-parks/syokimau` without publishing unsupported shop inventory.

## Scope

- In scope: `src/pages/business-parks/syokimau.astro`, existing contextual visual, existing Button primitive, and focused route verification.
- Out of scope: floor plans, shop rows, unit availability, unit-level media, new schema fields, new dependencies, unrelated homepage changes, issue/PR closure, merge, deployment, or release.

## Facts and unknowns

- Verified facts: Issue #5 approves Direction A: factual H1, concise support copy, `Arrange a viewing`, `Browse shop units`, wide contextual image rail, restrained motion, and verified inventory only. The route already has a contextual image and directory paths but lacks the primary viewing action in its first viewport.
- Unknowns: verified shop register, floor plan, current availability, unit media permissions, and exact unit membership.

## Plan

1. Add one primary `Arrange a viewing` action linked to `/contact` beside the existing browse action, reusing `Button`.
2. Preserve the contextual-image label and all inventory evidence boundaries.
3. Run prompt validation, diff check, Astro check, tests, and route smoke verification.

## Evidence

- Read: `src/pages/business-parks/syokimau.astro`, `docs/agents/wayfinder/portfolio-composition-wow.md`, and GitHub Issue #5.
- Source of truth: approved Direction A decision and existing Eens design/content rules.

## Acceptance

- The route has one clear primary viewing action and one browse action in the first viewport.
- No shop records, floor-plan claims, availability, or unit-media claims are introduced.
- Prompt validation, `git diff --check`, `pnpm exec astro check`, and `pnpm test` pass.

## Guardrails

- Apply `loop-constraints.md` and preserve secrets, dirty worktrees, and unrelated changes.
- Apply Ponytail: reuse existing `Button`, route, and contextual visual; do not add abstractions or dependencies.
- Keep GitHub mutations, issue/PR closure, merges, releases, deployment, and scheduling separately human-gated.

## Wave

- Wave: `Pass N+1`
- Tasks in wave: `1`
- Active concurrency allowed: `1 approved isolated L2 worktree`.
- Dependencies/waits: operator inventory remains required for any shop-unit strip.
- Stop condition: tests fail, source boundary is unclear, human gate, pause flag, or budget.

## Next action

Create an isolated worktree from the current approved route base and add the viewing CTA only.

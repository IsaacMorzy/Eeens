# Task prompt: Research Eens Business Park Syokimau

- Created: 2026-08-09
- Route: `research`
- Prompt author: `prompt-engineering`
- Task skill(s): `brand`, `anti-slop`
- Artifact: `prompts/tasks/2026-08-09-research-eens-business-park-syokimau.md`

## Outcome

Record public-source context for Eens Business Park without treating third-party listings as verified unit inventory or publishing permission.

## Scope

- In scope: `docs/agents/wayfinder/` research evidence, official Eens pages, the supplied Finlay listing, source boundaries, and operator verification gaps.
- Out of scope: creating shop rows, asserting current availability, importing third-party prices/amenities, unit-level media claims, schema changes, GitHub mutation, closure, merge, or deployment.

## Facts and unknowns

- Verified facts: Public sources describe Eens Business Park/Eens properties context in the Syokimau/Mlolongo and Mombasa Road area; public pages do not provide a verified master shop schedule, current unit availability, or unit-level media permissions.
- Unknowns: operator-approved floor plan, stable shop IDs, exact rows, current status, terms, source permissions, and mapped photos/videos.

## Plan

1. Capture dated URLs and distinguish first-party facts from third-party/contextual discovery.
2. Record evidence gaps and prevent unsupported claims from entering `src/content/property/`.
3. Validate the note and leave implementation gated on an operator source.

## Evidence

- Read: `docs/agents/wayfinder/shop-inventory-contract.md`, `docs/agents/wayfinder/image-provenance-manifest.md`, `docs/agents/wayfinder/image-provenance-uniqueness.md`.
- Sources: `https://eens.co.ke/`, the official Eens Business Park page, and `https://finlay.co.ke/listings/eens-business-park-syokimau`.

## Acceptance

- Sources are cited and claims are labeled first-party, third-party, or unverified.
- No public research is converted into shop inventory, current availability, or media permission.
- Prompt validation and diff checks pass; no secrets or product source change.

## Guardrails

- Apply `loop-constraints.md` and preserve secrets, dirty worktrees, and unrelated changes.
- Apply Ponytail: reuse existing docs and avoid speculative schema/content additions.
- Keep GitHub mutations, issue/PR closure, merges, releases, deployment, and scheduling separately human-gated.

## Wave

- Wave: `Pass N+1`
- Tasks in wave: `1`
- Active concurrency allowed: `0 for L1 report-only; up to 10 for explicitly approved L2, otherwise the lower runtime cap`.
- Dependencies/waits: operator floor plan or unit schedule remains required for implementation.
- Stop condition: evidence recorded, unsupported claim found, or operator gate remains blocked.

## Next action

Record the source-backed research note under `docs/agents/wayfinder/` and validate it.

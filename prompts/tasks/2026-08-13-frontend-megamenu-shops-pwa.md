# Task prompt: frontend megamenu, shop register, and PWA triage

- Created: 2026-08-13
- Route: `triage` (documented exact Matt route; unavailable in this runtime)
- Prompt author: `prompt-engineering`
- Task skill(s): `loop-triage`, then approved design and implementation skills
- Artifact: `prompts/tasks/2026-08-13-frontend-megamenu-shops-pwa.md`

## Outcome

Triage the requested frontend polish, then ship only verified improvements to the mega menu, footer, Tina-backed shop directory/cards, and Astro PWA support without inventing property facts.

## Scope

- In scope: audit and, if evidence supports it, improve shared header mega menu, footer, shop directory data flow/cards, and PWA configuration using existing Astro/Tina patterns and installed dependencies.
- Out of scope: invented shop inventory, tenant records, prices, availability, image provenance, a new content transport, unrelated redesign, or unapproved production/deployment changes.

## Facts and unknowns

- Verified facts: Astro 7.2/TinaCMS site; `/shops` is a canonical filtered property directory; the property schema already supports `SHOP`, `development`, `availability`, `address`, `zone`, `sqft`, pricing, images, and references; header and footer already exist; package.json has no PWA package; working tree is already dirty with unrelated tracked and untracked changes.
- Unknowns: which shop records are operator-verified and publishable; whether a PWA integration is compatible with this static Tina/Vercel build; exact PR number and whether required checks/reviews will pass; whether the user approves committing unrelated pre-existing changes.

## Plan

1. Run the required session preflight and queue gate, inspect current shop records and shared UI evidence, and produce concise triage findings.
2. Implement the smallest approved shared UI/content slice; use only existing verified shop records and only add PWA support if an installed or explicitly approved compatible package is verified.
3. Run diff checks, tests, Astro check/build where environment permits, and browser smoke checks for header/footer/shop routes; review the diff independently.

## Evidence

- Read: `AGENTS.md`, `docs/matt-pocock-skills.md`, `DESIGN.md`, `loop-constraints.md`, `loop-budget.md`, `LOOP.md`, `STATE.md`, `package.json`, `tina/config.ts`, `tina/collections/property.ts`, `src/lib/property-directories.ts`, `src/components/Header.astro`, `src/components/Footer.astro`, `src/components/blocks/PropertyCard.astro`, `src/components/blocks/PropertyList.astro`.
- Source of truth: `DESIGN.md`, the Tina property schema, checked-in `src/content/property/**`, and the exact current Git state.

## Acceptance

- Triage separates high-priority work, watch items, noise, and state updates without proposing an architectural overhaul.
- Any shipped shop card is backed by a checked-in Tina property record with factual fields and a valid canonical route.
- Mega menu/footer preserve keyboard access, focus visibility, touch targets, valid routes, dark-mode readability, and reduced motion.
- PWA behavior is either verified and implemented with a compatible dependency/configuration or explicitly reported as blocked; no speculative dependency is added.
- Required checks are run and reported exactly; no PR merge/close or branch deletion occurs without exact-target human approval and green verification.

## Guardrails

- Apply `loop-constraints.md`; preserve secrets, generated Tina output, dirty worktrees, and unrelated changes.
- Apply Ponytail: reuse existing code/dependencies, prefer native HTML/CSS/browser behavior, and reject speculative abstractions or packages.
- Keep GitHub mutations, commit/push, PR creation/closure/merge, deployment, and scheduling separately target-confirmed and human-gated.

## Wave

- Wave: single bounded triage/implementation slice
- Tasks in wave: 1
- Active concurrency allowed: 0 for the repository's L1 report-only loop; no sub-agents spawned.
- Dependencies/waits: verified shop register and exact PR target; Tina env vars/browser server may block checks.
- Stop condition: human gate, missing verified content, queue/dependency blocker, runtime cap, or completed slice with checks reported.

## Next action

Run `LOOP_SESSION_ID=$(node -e "console.log(crypto.randomUUID())") pnpm session:preflight` and stop if upstream inventory verification fails.

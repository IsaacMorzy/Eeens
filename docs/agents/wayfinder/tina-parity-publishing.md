# Tina parity and publishing workflow

Type: task + grilling
Map: [Wayfinder map](eens-portfolio-wow.md)
Status: implementation slice complete; operator data gates remain

## Question

What is the smallest Tina/content shape that can maintain shop units and keep the public route, card, detail page, images, and editor fields synchronized?

## Decision

Keep the shared `property` collection as the source of truth. The Session 1 parity slice adds publishing, provenance, and optional video fields without creating a second shop collection or adding placeholder inventory.

## Implemented parity

- Tina property schema exposes `occupancyState`, `floorSection`, `frontage`, `deposit`, `serviceCharge`, `permittedUse`, `viewingStatus`, `lastReviewedDate`, and `reviewer`.
- `imageProvenance` records source, permission, reviewer, dimensions, and mapped unit reference.
- Optional property videos store a title and YouTube URL; supported YouTube URL forms are parsed and rendered through the existing privacy-friendly facade.
- Public listing and direct category-detail generation reject records marked `unpublished`; records without a state remain public for backwards compatibility.
- Tests cover visibility filtering and YouTube URL parsing.

## Evidence

- Local commits: `b6322df` (`feat: align property publishing and video parity`) and `70154b3` (`fix: hide unpublished property details`) on `task/tina-parity-publishing`.
- Primary verification: 109 Vitest tests and 6 workflow/task tests passed; primary Astro check passed with 0 errors, warnings, or hints before transplant.
- Isolated verification: 109 Vitest tests passed and `git diff --check` passed. `astro check` is currently blocked by missing generated Tina client/type artifacts in the clean isolated worktree; regenerate through the normal Tina local command before release checks. No generated files were hand-edited.

## Remaining operator-data gates

- Supply a verified operator register before creating or publishing shop records.
- Confirm stable unit references, factual rows, approved exact photos, image permissions, and one-to-one media mappings.
- Keep contextual imagery clearly labeled; it is not exact unit evidence.
- Keep Issue #7 open until the operator-approved register and media evidence are available.

## Boundary

Do not infer compound membership from the Syokimau location alone. Do not publish invented prices, availability, amenities, tenant names, or unit imagery. Push, PR updates, issue comments/closure, merge, deployment, and release remain separately human-gated.

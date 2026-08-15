# Shared UI design triage - 2026-08-15

## Scope

Improve the shared header megamenu, footer, and property cards. Shop records are explicitly out of scope for this pass. No routes, Tina content records, or property data will be added.

## Design read

This is a factual property register for industrial operators and apartment buyers. Preserve the Eens architectural-register language: warm off-white canvas, navy structure, one cyan-teal accent, mono property facts, hairline borders, restrained motion, and clear viewing actions.

## Audit

### Token lock

- Existing `DESIGN.md` tokens are sound and already used by the shared components.
- Keep the existing radius scale, typography families, color tokens, and dark-mode class strategy.
- Avoid new dependencies, gradients, glass surfaces, decorative illustrations, and route changes.

### Component shape

- The megamenu already uses native `details` and `summary`, which is the right low-JavaScript seam.
- The footer has the right content groups but gives the identity panel and link grid similar visual weight.
- Property cards contain the required facts, but the information rail can scan more clearly when the title and primary fact hierarchy are separated from secondary metadata.

### Density and hierarchy

- Desktop menu panels are wide and useful, but each panel needs a stronger visual anchor and less repeated chrome.
- Footer link groups need clearer column headings, a stronger contact route, and a more deliberate bottom strip.
- Cards need a consistent image-to-information transition, tighter metadata grouping, and a single obvious card action.

### Copy voice

- Preserve existing factual copy and route labels.
- Do not add invented availability, tenant, price, or amenity claims.
- Do not introduce generic marketing language.

### Decoration scan

- Keep motion limited to transform, opacity, color, and border states.
- Preserve keyboard focus rings and reduced-motion behavior.
- Remove no existing content and do not make hover the only way to discover links.

## Net delta

1. Give each desktop megamenu panel a compact route summary and clearer active state without changing its links.
2. Make the mobile menu read as a deliberate navigation sheet with a stronger close/action area.
3. Rebalance the footer into identity, discovery, and contact zones while retaining all existing links.
4. Improve card scan order and action emphasis using the existing `PropertyCard` primitive.

## Validation plan

- `git diff --check`
- `pnpm exec astro check`
- `pnpm test`
- `pnpm build` if shared route assembly remains clean
- Review changed files for no Tina data changes and no unrelated lockfile churn

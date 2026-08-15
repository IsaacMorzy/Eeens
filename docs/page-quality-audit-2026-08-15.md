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

## Focused slice: shared mega menu

Date: 2026-08-15
Scope: `src/components/Header.astro`
Mode: redesign-preserve
Audience: operators, distributors, manufacturers, occupiers, and apartment buyers

### Current strengths

- Native `details` and `summary` provide a no-JavaScript desktop menu primitive.
- The menu groups point to live routes and include useful descriptions.
- The panel is viewport-anchored and capped for small screens.
- Mobile navigation has a bounded scroll panel, Escape handling, and focus return.

### Design opportunities

1. The desktop panel has a strong layout but no explicit open-state entrance treatment.
2. The panel hierarchy can be clearer if the section lead and item grid share a stronger structural edge.
3. Current transitions are functional but the menu can feel more intentional with a short transform/opacity reveal.
4. The existing panel shadow is acceptable, but the visual system should remain border-led rather than effect-led.

### Chosen slice

Add a restrained desktop mega-panel reveal using transform and opacity only. Add a stronger panel edge and preserve the current viewport anchoring, native controls, route order, and mobile behavior.

### Acceptance checks

- Desktop menu remains within the viewport at 1280px and 1440px.
- Mobile menu behavior and route order remain unchanged.
- No horizontal overflow, console errors, or broken focus styles.
- Reduced-motion mode removes the entrance animation through the existing global rule.
- Astro diagnostics and tests remain green.

## Focused slice: footer, property cards, and media delivery

Date: 2026-08-15
Scope: `src/components/Footer.astro`, `src/components/blocks/PropertyCard.astro`, `src/components/ui/Button.astro`, `src/components/ui/ContextualVisual.astro`, and `src/pages/[category]/[slug].astro`

### Chosen changes

- Split the footer's long Information list into Visit and Journal groups so the link grid has a clear task order.
- Restored the property-card lift by using the approved `bg-card` token for standard cards.
- Added balanced title wrapping and tabular numerals for prices and references.
- Standardized button press feedback to the existing motion pattern at `scale-[0.96]`.
- Routed local and Tina images through Astro's existing `Image` pipeline with WebP output and responsive `sizes`; no dependency or route changes.
- Kept the architectural-register constraint: no glass, blur, gradient, glow, or heavy shadow treatment.

### Production Lighthouse baseline

Run against the currently deployed Tailscale URL with Lighthouse 13.4.1 on 2026-08-15. This is a baseline for the deployed artifact, not a claim about unpushed source changes.

| Preset | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT |
|---|---:|---:|---:|---:|---:|---:|---:|
| Mobile default | 80 | 100 | 96 | 92 | 2.0 s | 0 | 730 ms |
| Desktop | 95 | 100 | 96 | 100 | 0.6 s | 0 | 190 ms |

Google's Core Web Vitals thresholds remain the acceptance bar: LCP under 2.5 seconds, CLS under 0.1, and INP under 200 milliseconds where field data is available. The mobile LCP and CLS baseline pass; mobile Performance is below the requested 95 because main-thread work and the Astro ClientRouter account for the largest measured cost. This remains a follow-up performance slice, not a design-only fix to hide with visual effects.

### Verification status

- `pnpm verify`: passed, 117 tests, Astro diagnostics 0/0/0.
- `pnpm exec astro check`: passed after Astro `Image` changes.
- `pnpm exec astro build`: blocked by the local Tina data fetch (`fetch failed`).
- `pnpm build:local`: blocked by host exit 137 while Tina indexes local files.
- Lighthouse report files are kept outside the repository under `/tmp/eens-lighthouse-live*.json`.

## Focused slice: test layout and mobile rendering budget

Date: 2026-08-15

- Moved the canonical 11 Vitest files from `src/lib/` into `tests/` so frontend tests have one discoverable home. The `/tmp/eens-*` copies were compared by hash; duplicate stale worktrees were not copied over newer tests.
- Updated imports and `vitest.config.ts` to keep the test suite deterministic from its new location.
- Added native `content-visibility: auto` with an intrinsic placeholder size to the shared `Section` primitive. This lets browsers skip layout and paint for below-fold sections on long property-register pages without hiding content or adding JavaScript.
- A fresh production Tailscale Lighthouse sample measured mobile Performance 91, LCP 2.0s, and TBT 350ms. This is an environment/deployment baseline; the source change requires a cloud build before an after-score can be claimed.
- The local Tina dev server returned HTTP 200, but its development-mode Lighthouse sample was not used as a production benchmark because it reported 19.0s LCP and 29 Performance.

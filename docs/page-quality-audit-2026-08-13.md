# Eens frontend design triage - 2026-08-13

## Scope

- **Surface:** shared header mega menu, footer, property cards, `/shops`, and PWA metadata/runtime wiring.
- **Mode:** redesign-preserve. Keep the current route IA, Tina ownership, architectural-register visual system, and factual register voice.
- **Evidence:** `AGENTS.md`, `DESIGN.md`, `docs/page-quality-audit-2026-08-12.md`, current shared components, checked-in Tina property records, package metadata, and read-only GitHub state.

## Design read

Reading this as a factual B2B property register for operators, distributors, manufacturers, commercial occupiers, and apartment buyers. The existing language is warm off-white, navy structure, cyan-teal wayfinding, mono facts, contextual photography, and restrained feedback motion.

- **DESIGN_VARIANCE:** 6. Improve hierarchy and information scent without an overhaul.
- **MOTION_INTENSITY:** 4. Keep transform/opacity feedback and reduced-motion behavior; add no scroll choreography.
- **VISUAL_DENSITY:** 5. Make cards and navigation easier to scan without adding decorative panels.

## Token lock

- Reuse the tokens and radii in `DESIGN.md` and `src/styles/global.css`.
- No gradients, glows, glass, new accent colors, or generic SaaS copy.
- Preserve keyboard focus, 40px/44px hit areas, dark-mode readability, and reduced motion.

## Verified findings

- The header already uses native `<details>/<summary>` mega-menu groups and has an Escape path, outside-click closing, focus rings, and a mobile menu.
- The footer already has a dark blueprint surface, property-type links, park links, contact links, and a viewing action.
- Property cards show raw enum values such as `BUSINESS_PARK` and do not surface the operator reference code, even though those values exist in the Tina schema.
- `/shops` and the park-linked shop section are correctly backed by `listProperties()` and the `development === 'Eens Business Park'` relation, but there are currently zero checked-in `SHOP` records.
- No PWA package, web manifest, or service-worker registration is present. The official `@vite-pwa/astro` integration supports Astro 4+ and the current Astro 7.2/Vite 7 stack.
- Open GitHub state has PR #11 open with successful Vercel checks, plus issues #8, #7, #5, and #2. The current branch is dirty and diverged from its remote.

## Triage

### High priority

1. **Property cards expose enum-like labels and omit listing references.** Improve display labels and show verified reference codes so users can scan and quote a listing.
2. **PWA support is absent despite the static Astro site being a good fit for a manifest and service worker.** Add only the verified official integration and stable existing brand assets.
3. **Shop inventory cannot be populated safely.** No operator-approved `SHOP` record exists. Keep the empty state and park linkage; request a verified register before publishing inventory.

### Watch items

- Mega menu and footer are functional but can gain clearer type-specific iconography, a stronger footer edge, and slightly sharper information hierarchy without changing routes.
- PWA installability may still need raster 192px/512px icons for Lighthouse-level install criteria; this slice can use the existing brand SVG and report that limitation rather than inventing artwork.
- Tina Cloud schema/deployment remains a known blocker from `STATE.md`.

### Noise / ignore

- Do not create placeholder shop records, tenant profiles, prices, availability, or fake unit images.
- Do not rewrite the site IA, replace the design system, or add a new client-side menu library.
- Do not merge or close PRs/issues from this task without exact-target approval and green verification.

## Smallest approved delta

1. Add `@vite-pwa/astro` and wire manifest/service-worker registration through the existing `BaseHead`/`Base` shell.
2. Improve shared property card labels/reference metadata and type-specific menu iconography.
3. Add a restrained footer top rule only if it remains token-compliant.
4. Leave shop data unchanged and report the verified-register dependency.

## Acceptance

- `/shops` remains a factual empty state until a verified `SHOP` record is supplied.
- PWA config builds, manifest is linked, service worker is generated, and no secret/generated Tina files are committed.
- Mega menu/footer/card changes preserve semantics, focus, touch targets, dark mode, and reduced motion.
- `git diff --check`, `pnpm test`, `pnpm exec astro check`, `pnpm build`, and browser smoke are attempted and reported exactly.

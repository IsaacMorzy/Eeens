# Eens frontend design audit - 2026-08-12

## Scope

- **Surface:** public Eens site shell plus homepage and representative property-register/park directory surfaces.
- **Primary task:** help an operator or occupier understand the portfolio and reach a viewing request.
- **Mode:** redesign-preserve. Keep routes, content ownership, and the architectural-register identity.
- **Evidence:** `AGENTS.md`, `DESIGN.md`, shared Astro components, current route source, and current dirty-worktree state.

## Design read

Reading this as a factual B2B property register for operators, distributors, manufacturers, commercial occupiers, and apartment buyers. The existing direction is an industrial/editorial architectural register: warm off-white canvas, navy structure, one cyan-teal wayfinding accent, mono property facts, contextual photography, restrained motion, and direct viewing actions.

- **DESIGN_VARIANCE:** 6. Use measured asymmetry and hierarchy, not a visual overhaul.
- **MOTION_INTENSITY:** 4. Keep existing reveal and hover feedback; animate only transform/opacity and honor reduced motion.
- **VISUAL_DENSITY:** 5. Show portfolio breadth while keeping listing facts easy to scan.

## Token lock

- Reuse the existing CSS variables and Tailwind utilities from `src/styles/global.css`.
- Preserve Plus Jakarta Sans for display, Inter Variable for body, and JetBrains Mono for factual values.
- Preserve the warm off-white, navy, cyan-teal, hairline, radius, focus, touch-target, and dark-mode rules in `DESIGN.md`.
- No new palette, gradients, glows, glass, dependency, or route surface.

## Component shape

- `Base.astro` owns the skip link, global header/footer islands, and `main` landmark.
- `BaseHead.astro` owns canonical, title, description, Open Graph, Twitter, favicon, theme, and reduced-motion/reveal setup.
- `Hero.astro`, `PropertyCard.astro`, `Button.astro`, `Section.astro`, and `ContextualVisual.astro` are the primary reusable visual owners.
- `Header.astro`, `Footer.astro`, and `home.mdx` contain unrelated existing dirty changes and are excluded from this edit slice.

## Density + hierarchy

- The shared hero is left aligned and content-first, with a real image surface, visible actions, and a factual proof rail on the home route.
- Property cards keep availability, area, price, address, zone, and the next action in a stable information rail.
- The Eens park route currently repeats several section/eyebrow/card patterns and also renders broad warehouse/godown data inside sections described as other-location space. The latter is a product/content-boundary issue, not part of this focused visual polish slice; retain it as a follow-up.
- Shared controls generally meet the 40px/44px hit-area and visible-focus rules.

## Copy voice

- Public copy is mostly factual and route-oriented.
- Preserve existing labels and operator-supplied facts. Do not invent amenities, tenants, prices, availability, or infrastructure claims.
- Avoid adding marketing slogans or decorative microcopy.

## Decoration scan

- No `transition-all`, decorative gradients, glows, or glass were found in active shared UI.
- Existing motion uses reveal-on-scroll, image transform, and button press feedback; reduced motion is handled globally and in the reveal observer.
- Existing image provenance links and `image-outline` styling are present.
- Some long source comments and an em-dash in an accessibility label are code/content hygiene follow-ups, not necessary to block this visual slice.

## Net delta

- The selected slice is the Eens park route boundary: keep the shop register on the park page, remove misleading warehouse/godown card grids, and retain separate directory links and zone summaries.
- Replace unsupported `VERIFIED PARK FACTS` framing with plain public-context language until operator-backed development facts exist.
- Do not redesign the header/footer or rewrite the homepage because those files are already dirty.
- Runtime rendering cannot currently be verified: the existing server returns 404 for `/` and 500 for public directory routes. Report that blocker rather than claiming a visual pass.

## Implemented slice

- `src/pages/business-parks/eens.astro`: removed warehouse and godown card rendering from the park page while retaining `/warehouses` and `/godowns` directory paths; qualified the public-context copy.
- No new dependency, route, data-model field, or operator fact was introduced. The current property model has no verified park/development membership field, so shop filtering remains a bounded follow-up rather than an invented rule.

## Acceptance checks

- Preserve all unrelated dirty files and generated Tina output.
- `git diff --check`, `pnpm test`, `pnpm exec astro check`, and `pnpm build` are attempted as appropriate.
- Browser smoke is valid only against a confirmed live Tina + Astro server with expected status, structure, and no unexpected console errors.

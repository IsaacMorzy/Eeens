# Design polish triage

Date: 2026-08-09
Scope: public Astro routes, shared components, property detail pages, content voice, and visual assets.

## High-priority items

### 1. Decorative diagrams displaced property evidence
- Evidence: `src/components/blocks/Hero.astro` rendered `IsometricMap` when a page had no CMS image; `src/pages/properties/[slug].astro` rendered `AnimatedBuilding` for every listing and `FloorPlan` for apartments.
- Why it mattered: the diagram surfaces were authored illustrations rather than evidence of the listed property. They also introduced gradients, blur, inline styles, motion, and non-token dimensions that conflicted with the photographic property-register direction in `DESIGN.md`.
- Decision: use the existing local Pexels-backed contextual photographs for the home fallback and property detail visual. Keep published address, area, price, terms, and spec sheet as the factual source of truth. Do not call the supplied API key; no new asset lookup is needed.

### 2. AnimatedBuilding contained multiple decoration/token violations
- Evidence: `src/components/arch/AnimatedBuilding.astro:45-162` used inline perspective and positioning styles, raw gradient declarations, blur, animated shadows, and decorative light sweeps.
- Why it mattered: this directly failed the `opendesign` decoration scan and made a factual listing page feel like a product demo.
- Decision: remove the component from the public route. The page now presents a contextual photograph with a factual caption.

### 3. IsometricMap added motion and a false spatial metaphor
- Evidence: `src/components/arch/IsometricMap.astro:46-430` rendered a large inline SVG map and applied scroll-tied transforms through `el.style.transform`.
- Why it mattered: the four locations do not form one literal linear corridor, and the animated diagram competed with the route's listing evidence.
- Decision: remove it from the home hero fallback. Home now uses the warehouse contextual photograph already present in the local asset set.

## Watch items

### 4. Pexels imagery is contextual, not site-specific evidence
- Evidence: `src/lib/pexels-images.ts` labels the images as warehouse, logistics yard, commercial architecture, and apartment context; property content uses those files as fallbacks.
- Risk: the photographs must not be read as the exact Mlolongo, Syokimau, Baba Dogo, or Thika property unless the operator confirms that provenance.
- Mitigation: the UI labels images as contextual and keeps the literal property facts separate. Replace these files with confirmed property photography when available.

### 5. `Hero` lacked a home contextual fallback
- Evidence: `src/lib/contextual-images.ts` had page hero mappings for about, contact, lease terms, and locations, but not home; `Hero.astro` therefore fell through to the diagram.
- Decision: add an explicit `home` mapping to the warehouse contextual image.

### 6. Source links need to stay secondary
- Evidence: shared image components expose `Pexels source` links next to operational content.
- Decision: retain provenance links for the existing stock assets, but keep them visually and semantically secondary to the listing facts and actions.

## Accessibility and content checks

- `src/layouts/Base.astro:25-31` already provides a skip link and a named `main` landmark.
- `src/components/ui/Button.astro:25-57` already provides visible focus styling and 38% disabled opacity; large buttons use a 44px height.
- Header, theme toggle, pagination, image links, and the property action controls have explicit focus-visible states or semantic labels.
- No forbidden property-marketing terms were found in the current content scan. The remaining technical use of “transform” and motion-related terms is code, not customer-facing copy.
- Property facts remain in mono treatment where rendered: area, prices, references, and specifications.

## Minimal implementation shipped from this triage

1. Add `home` to contextual hero visuals.
2. Replace the home hero diagram fallback with a contextual photograph.
3. Replace property detail building/floor-plan illustration sections with a contextual property image and factual explanatory copy.
4. Keep the existing local Pexels provenance system; do not add a dependency or expose the supplied API key.

## Follow-up

- Obtain confirmed, location-specific property exteriors and replace contextual assets when the operator supplies them.
- Install the Matt Pocock bundle in a normal user shell if the Freebuff PromptScript global-install limitation is removed.
- Run the full project checks after the diagram removal and delete only now-unreferenced visual components if the final reference audit confirms they are dead.

# Eens Register-First Property Discovery

**Date:** 2026-08-15
**Status:** Design approved by the user; implementation not started
**Scope:** Category directories for shop units, warehouses, godowns, business parks, and apartments

## Design read

Eens is a factual B2B-first property register for operators, distributors, manufacturers, commercial occupiers, and apartment buyers. The redesign preserves the existing architectural-register language: warm off-white canvas, navy structure, one cyan-teal accent, mono property facts, hairline borders, restrained motion, and clear viewing actions.

Modern listing research points to a small set of useful patterns: location and size discovery, visible price or rate facts, mobile-first scanning, clear listing cards, and a direct contact or viewing path. Eens will use those patterns without copying marketplace complexity or inventing unavailable data.

## Goals

- Make category pages faster to scan and compare.
- Keep shop units, industrial space, business parks, and apartments in the existing canonical routes.
- Make contextual category guidance editable in TinaCMS.
- Add a useful map/list relationship without external map tiles, a heavy client bundle, or false geographic precision.
- Preserve no-JavaScript access to every published listing.
- Keep all public facts sourced from the Tina property collection or approved Tina global context.

## Non-goals

- No new property records or invented availability, prices, amenities, tenants, or coordinates.
- No route changes, generic `/properties` route, or second property data source.
- No map iframe, Mapbox/Google Maps SDK, external tile requests, canvas, or client-side map library.
- No client-side filtering bundle or hydration requirement for the directory.
- No Frappe, Supervisor, Gunicorn, Socket.IO, mosh, or production host operations.

## Architecture

### Tina-backed category context

Extend the existing `config` Tina collection with a `directoryContexts` list. Each record is keyed to one canonical directory:

- `shops`
- `warehouses`
- `godowns`
- `business-parks`
- `apartments`

Editable fields:

- `key`
- `title`
- `description`
- `highlights` as label/value pairs
- `zoneLabel`
- `primaryActionLabel`
- `primaryActionLink`
- `mapLabel`

The route vocabulary and type mapping remain code-owned in `DIRECTORY_DEFINITIONS`. The contextual copy and highlights are Tina-owned. A missing context uses the existing truthful directory fallback and does not block a route build.

### Server-rendered filters

Category pages will read these query parameters:

- `zone`
- `minSqft`
- `minKva` for industrial records with published power values

The page will parse, validate, and clamp values through pure helpers. Invalid or unsupported values are ignored rather than reflected into links. Filtering runs at build/request data assembly using the existing `listProperties()` source.

The rendered directory includes:

- result count for the filtered set;
- links for supported zones present in the current portfolio;
- area and power filter links where the category supports those facts;
- active-filter summary;
- reset link back to the canonical category path;
- the existing truthful empty state and viewing CTA.

Each filter is a normal link. The list remains complete and navigable with JavaScript disabled.

### Lightweight schematic map/list split

Add a focused `DirectoryMap` component containing a small inline SVG and an accessible text fallback. It is a zone diagram, not a geographic map, and is labeled `Not to scale`.

- Four zone pins represent the approved zone vocabulary only.
- Each pin links to the matching category URL with `?zone=`.
- The accessible text list repeats the zone links outside the SVG.
- On desktop, the schematic occupies a stable side rail beside the listing grid.
- On mobile, it appears inside a native `<details>` panel before the listing grid.
- No client hydration, external requests, tile downloads, map library, scroll listener, or runtime coordinate calculation.
- The existing full listing rail remains the primary content and fallback.

If verified latitude/longitude fields are added to Tina in a future approved change, the schematic can be replaced behind the same component boundary. This change does not claim precise geography.

### Listing card hierarchy

Reuse `PropertyCard` and preserve the existing data contract. Improve scan order only where the fields are present:

1. type and availability;
2. title and reference;
3. address and development;
4. area and price/rate;
5. zone and lease term;
6. one clear listing action.

Do not infer missing fields or replace a missing fact with a marketing claim.

## Performance and accessibility

- Keep filters and map links server-rendered.
- Keep the SVG small and static.
- Avoid new dependencies and third-party network requests.
- Preserve visible focus, native links, keyboard access, text alternatives, and reduced-motion support.
- Do not add animations to the map. Existing card transitions remain transform/opacity-only.
- Keep mobile controls at least 44px high.
- Preserve dark-mode tokens and contrast.
- Test at 390x844 and 1440x900.

## Tina editability

The following remain editable in Tina:

- directory context copy and highlights through Global Config;
- property listing facts through the existing Property collection;
- page-level Events, Gallery, Awards, and Careers content through the existing Page collection.

Generated Tina artifacts will be regenerated by the local/cloud build and will not be hand-edited.

## Verification gates

- Write failing unit tests for query parsing, filter application, reset links, and context selection before implementation.
- `git diff --check`
- `pnpm run audit:content-sync`
- `pnpm run audit:pwa`
- `pnpm run audit:vercel-output`
- `pnpm exec astro check`
- `pnpm test`
- Vercel-mode Tina Cloud build with credentials loaded ephemerally
- Browser smoke for `/shops`, `/warehouses`, `/godowns`, `/business-parks`, and `/apartments` at mobile and desktop widths
- Confirm no horizontal overflow, one H1 per directory, accessible map text fallback, and no unexpected console errors
- Independent checker review before any push or PR update

## Acceptance criteria

- Category directory content is richer but remains truthful and Tina-editable.
- Filters change the displayed listing set through shareable canonical query URLs.
- Empty states remain useful and never invent inventory.
- The schematic map/list view works without JavaScript and does not add external network or heavy runtime cost.
- Existing URLs, Tina property records, PWA behavior, and Frappe output paths remain intact.

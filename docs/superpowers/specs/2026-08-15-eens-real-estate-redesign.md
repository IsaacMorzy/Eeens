# Eens real-estate redesign

**Status:** approved for implementation
**Date:** 2026-08-15

## Design read

This is a redesign-overhaul pass for a trust-first Kenyan commercial property register. The visual language becomes more editorial and image-led while preserving Eens's factual architectural-register tokens, route structure, and content voice.

## Goals

- Make Eens Business Park and its property register feel contemporary without turning the site into a generic real-estate template.
- Help a visitor compare location, area, price or rate, availability, specifications, and next step quickly.
- Add credible editorial surfaces for Events, Gallery, and Awards without inventing operator facts.
- Improve installability and offline behavior without making the service worker required for core listing use.
- Preserve existing canonical routes, Tina-backed content, keyboard access, dark mode, reduced motion, and local image provenance.

## Out of scope

- No new map provider, map API key, live tenant directory, rent portal, event booking system, or user account flow.
- No fabricated events, dates, partners, awards, accreditations, tenants, prices, availability, amenities, or property claims.
- No changes to the locked Eens color and typography tokens.
- No new third-party dependency.

## Information architecture

Add the following public routes through the existing Tina page collection and catch-all route:

- `/events` - public event archive shell. It shows published events only; the initial state explains when no verified events are available and links to contact.
- `/gallery` - visual register using existing local assets. Contextual Pexels imagery is labeled as context and is never presented as a specific Eens unit.
- `/awards` - accolades register shell. It shows approved records only; the initial state explains that no public accolades are published and identifies the future Tina fields needed for an entry.

Expose the three routes in the shared navigation and footer without changing existing route slugs or labels that serve the current listing workflow.

## Visual direction

- Keep the warm off-white canvas, navy structural ink, cyan-teal wayfinding accent, Plus Jakarta Sans display, Inter body, and JetBrains Mono factual values from `DESIGN.md`.
- Use an asymmetric split hero, larger editorial type, strong image framing, and fewer boxed surfaces.
- Use a dominant featured listing plus supporting records instead of a flat equal-card row where the page supports that composition.
- Keep one clear primary action per section, 40-44px hit areas, visible focus rings, and `text-balance`/`text-pretty` wrapping.
- Use only transform/opacity interaction motion and respect `prefers-reduced-motion`.
- Do not add gradients, glows, glass, decorative status dots, or invented social proof.

## Listing treatment

- Improve category directory hierarchy with a compact result summary and clearer type/location entry points.
- Preserve the existing card fact rail: availability, address, development, area, price/rate, zone, lease term, and one listing action.
- Keep map access literal through the existing area-map links rather than adding an embedded provider.
- Use native HTML and server-rendered data where possible; do not add client-side state for features that can remain URL- or content-driven.

## PWA and metadata

- Keep the root manifest and existing secure-context service-worker registration.
- Add shortcuts only for real routes: Shop units, Warehouses, Eens Business Park, and Contact.
- Version the cache, clean old caches, use network-first navigation, cache-first same-origin static assets, and provide a concise offline navigation response.
- Keep the service worker optional and avoid caching admin, API, Tina, or cross-origin requests.
- Add page metadata and breadcrumb JSON-LD only where the visible page hierarchy supports it. Do not add structured data for unsupported awards, events, ratings, or prices.

## Content safeguards

- Events and awards remain empty until operator-approved records exist.
- Gallery captions identify the asset's role and provenance; contextual photography is not property evidence.
- Future award entries require title, issuer, year, source URL, and image before publication.
- All visible copy remains concrete and avoids hype, unsupported claims, and SaaS language.

## Validation

Run:

- `git diff --check`
- `pnpm exec astro check`
- `pnpm test`
- `pnpm verify`
- `NODE_OPTIONS=--max-old-space-size=4096 pnpm build:local`
- a Tina + Astro browser smoke pass at 390x844 and 1440x900 for `/`, `/business-parks/eens`, `/events`, `/gallery`, and `/awards`

Report Tina Cloud build blockers separately from local verification. Do not claim browser verification unless the actual server, route status, snapshot structure, and console output are confirmed.

## Research sources

- Google Search Central, BreadcrumbList structured data: https://developers.google.com/search/docs/appearance/structured-data/breadcrumb
- web.dev, Web app manifest: https://web.dev/learn/pwa/web-app-manifest
- web.dev, Service workers: https://web.dev/learn/pwa/service-workers
- Baymard Institute, property search split view research: https://baymard.com/blog/accommodations-split-view

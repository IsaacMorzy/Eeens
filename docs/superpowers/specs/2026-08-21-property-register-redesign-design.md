# Property register redesign

Date: 2026-08-21
Status: Approved design; implementation pending written-spec review

## Problem

The site already has a shared Tina property collection, category routes, property cards, progressive filters, saved listings, comparison, listing schema, and mailto-based viewing forms. The primary journey is fragmented: the homepage search sends a visitor away to a category directory, featured/current listings are not directly below the search, and category pages spend too much space on directory context and zone-map presentation. The current forms also rely on browser-specific `mailto` POST behavior and have no meaningful input bounds or bot friction.

## Goals

- Make `/` a modern, factual real-estate discovery page.
- Put the search surface immediately before featured listing results.
- Show filtered homepage results in place after a search, while keeping a no-JavaScript and crawlable fallback.
- Improve all shared listing surfaces without duplicating listing data or card logic.
- Keep `/shops` as a canonical route, but make it a focused listing register rather than a zone directory.
- Reduce category-page repetition and reserve zone context for `/locations`.
- Harden the existing static mailto forms without pretending that a client-only package provides server security.
- Preserve the approved Eens visual system, route contract, SEO/schema behavior, saved/compare behavior, print behavior, and dark mode.

## Non-goals

- No new property collection, duplicate listing records, or `/properties` route.
- No geographic map or exact property coordinates on category pages.
- No server-backed submissions, database storage, authentication, rate limiting, or email provider in this slice.
- No random or unverified Astro forms package.
- No new decorative theme, heavy animation, gradient, or glass surface over property facts.
- No invented prices, availability, tenants, amenities, addresses, or infrastructure claims.

## Research and source decisions

- The current package is Astro `7.2.0`, configured with `output: 'static'`, a Vercel adapter, TinaCMS, and Tailwind CSS 4.
- Astro’s official Actions guide documents type-safe server functions, Zod validation, and `accept: 'form'`, but those are server functions. Astro’s on-demand-rendering guide documents that server-rendered routes require an adapter and opting out of prerendering. Switching the current static mailto flow to Actions would therefore be a deployment and delivery architecture change, not a package-only improvement.
- Native HTML forms are widely supported and provide `required`, `minlength`, `maxlength`, `type`, `pattern`, and browser constraint validation. The static form hardening will use those primitives plus a honeypot and explicit URL encoding.
- The product-specific research conclusion is that the site should behave like a clear property register: search and compare published facts first, use zones as a filter/context field, and keep geographic context on the locations page rather than repeating a map on every category.

Sources:

- https://docs.astro.build/en/guides/actions/
- https://docs.astro.build/en/guides/on-demand-rendering/
- https://docs.astro.build/en/reference/configuration-reference/#output
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/form

## Information architecture and data flow

The Tina `property` collection remains the single source of truth. `listProperties()` remains the loader and `isPublicProperty()` remains the publication boundary.

### Homepage

- Keep the existing hero and factual register proof rail.
- Move the `PropertyList` block directly after the `ListingSearch` block in `src/content/page/home.mdx`.
- Configure this homepage list as the featured/current listing surface and render every public property needed for client-side filtering, with no arbitrary editorial limit that could hide a searched match.
- Add stable data attributes for type, zone, availability, price, area, date, and listing href to the homepage result cards.
- Update `ListingSearch.astro` to support an inline homepage result target. When that target exists, allowlist `type`, `zone`, and `availability`, update the URL, filter the complete server-rendered result set, update result status, and provide a clear state. When no inline target exists, retain the existing category-directory navigation behavior.
- Unknown query values must be treated as empty filters. The client must never construct arbitrary destinations from user-controlled query strings.

### Category directories

- Keep the canonical routes `/shops`, `/warehouses`, `/godowns`, `/business-parks`, and `/apartments`.
- Keep server-side initial filtering, sorting, saved-listings filtering, no-JavaScript-readable cards, empty states, and viewing actions.
- Remove the directory-context/highlights section and `DirectoryMap` from the category index route. Keep zone filtering in the register toolbar. `/locations` remains the zone-context surface.
- Use compact page hierarchy: title/description, property-type tabs, filter/sort toolbar, result grid, empty state, viewing CTA.
- Keep `/shops` linked from relevant park pages, the existing Explore menu, and homepage search. Its route remains canonical even though its page is visually simplified.

### Detail and shared listing surfaces

- Improve the shared `PropertyCard` once so category directories, homepage results, park pages, saved, comparison-related cards, subunits, and related listings inherit the same fact-forward presentation.
- Keep photo provenance, availability, price/rate, area, zone, lease term, listing reference, saved toggle, compare toggle, keyboard focus, and valid listing href behavior.
- Rebalance `src/pages/[category]/[slug].astro` opening hierarchy around image, title, price, availability, address, and viewing CTA without removing existing schema, gallery, area-level map, WhatsApp, print, subunits, specs, inquiry form, or related listings.
- Improve park-page listing surfaces only through shared card inputs and small spacing/hierarchy changes; do not introduce a second park-specific card.

## Visual system

Use the locked `DESIGN.md` tokens and existing utilities:

- warm off-white canvas, navy structural ink, cyan-teal accent;
- Plus Jakarta Sans display, Inter body, JetBrains Mono for listing facts;
- opaque property evidence surfaces with hairline borders;
- glass only on existing chrome surfaces;
- no decorative gradient/glow/starfield/map clutter;
- one clear action per section;
- 44px touch targets, visible keyboard focus, dark-mode readability, and reduced-motion support;
- property facts remain more visually important than decoration.

The design should be a density and hierarchy improvement, not a brand rewrite.

## Form hardening

Apply the same policy to `InquiryForm.astro` and `CareersForm.astro`:

- keep native labels, autocomplete, required fields, and native constraint validation;
- add meaningful `minlength`/`maxlength` bounds for names, roles, messages, references, phone, and portfolio URLs;
- add a visually hidden `website` honeypot with `tabindex="-1"` and `autocomplete="off"`;
- on submit, reject a filled honeypot and build a bounded `mailto:` URL/body from `FormData` with `encodeURIComponent`;
- do not log or persist submitted values;
- keep listing references generated/read-only on detail pages;
- expose an accessible status/error message without exposing internal details;
- state plainly that the site does not store the inquiry and opens the visitor’s email client.

This is abuse reduction for a static site, not server-side validation or spam protection. A future server-backed form requires a separate approved design covering output mode, delivery service, secrets, rate limiting, and privacy.

## Implementation files

Expected source changes are limited to the existing product seams:

- `src/content/page/home.mdx`
- `src/components/blocks/ListingSearch.astro`
- `src/components/blocks/PropertyList.astro`
- `src/components/blocks/PropertyCard.astro`
- `src/pages/[category]/index.astro`
- `src/pages/[category]/[slug].astro`
- `src/pages/business-parks/eens.astro` and/or `src/pages/business-parks/syokimau.astro` only where shared-card integration requires it
- `src/components/blocks/InquiryForm.astro`
- `src/components/blocks/CareersForm.astro`
- focused utilities/tests under `src/lib/` and `tests/` only if the inline filter/form serialization logic cannot be tested through existing seams

Do not hand-edit generated Tina files. Do not edit `.env` files or credential paths.

## Acceptance criteria

1. On `/`, the visible order is search followed immediately by featured/current listings.
2. Submitting homepage search shows matching published properties in that same result section and updates the URL with only allowlisted filters.
3. Direct `/category` pages still render useful listing HTML without JavaScript.
4. `/shops` no longer spends a full section on “Shop directory zones” or a repeated zone map; its zone remains available as a filter.
5. All property cards across category, homepage, park, saved, subunit, and related surfaces share the improved component behavior.
6. Detail pages preserve existing JSON-LD, media provenance, map semantics, WhatsApp, print, inquiry, and related-listing functionality.
7. Inquiry and career forms reject overlong/invalid input natively, ignore/reject filled honeypots, and construct mailto content safely without storing values.
8. No new form package or external service is added.
9. `git diff --check`, `pnpm exec astro check`, `pnpm test`, and the appropriate build pass, or exact environment blockers are reported.
10. Browser smoke checks cover 390px and 1440px, homepage search/results, `/shops`, one other category route, and one detail route. Console errors, request failures, heading structure, focusability, and overflow are recorded.

## Risks and mitigations

- **Static query rendering**: Astro cannot render request-specific filters at build time. Keep all listings in server-rendered HTML and use client-side progressive enhancement for homepage search.
- **Large homepage output**: rendering the complete public register increases static HTML. Measure the resulting output and use the existing card markup; do not add a new client data fetch or hide records that the search promises to find.
- **Mailto portability**: build the body explicitly and make the visible copy explain that an email client opens; retain native form fallback behavior where practical.
- **Tina parity**: do not add CMS fields in this slice. If a new field becomes necessary, update schema, content, derived types, and renderer together, then regenerate through the documented local flow.
- **Scope creep**: do not convert the site to SSR or add a hosted form provider under the visual-refresh request.

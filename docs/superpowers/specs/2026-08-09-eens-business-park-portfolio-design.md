# Eens Business Park portfolio design

Date: 2026-08-09
Status: Written spec approved by the user; Phase 1 implementation slice complete locally
Scope: Information architecture, navigation, footer, page composition, content model direction, imagery, and featured inventory interaction

## Design read

Eens Business Park is a factual property directory for people choosing a shop unit, warehouse, godown, or apartment across Mlolongo, Syokimau, Baba Dogo, and Thika. It should feel like a clear asset register, not a generic real-estate brochure or a mall operations portal.

The primary user job is:

> Find the right space, understand its verified commercial facts, and arrange a viewing.

The design preserves the existing Eens visual language: warm off-white surfaces, navy structural ink, one cyan-teal accent, mono treatment for property facts, contextual photography, hairline borders, restrained motion, dark-mode readability, and visible keyboard focus.

## Guardrails

The pasted mega-menu blueprint includes unsupported systems and claims such as cinema, food courts, EV charging, online rent payments, keycard activation, loading reservations, forklift booking, freight receiving, COI uploads, employee badging, maintenance tickets, and job boards. These are excluded from the design unless separately implemented and verified.

Do not represent an occupied tenant as an available shop unit. Do not use stock or contextual photography as proof that an image depicts the listed property. Do not invent prices, rates, amenities, tenants, operating hours, infrastructure, or availability.

The Pexels key stays in the ignored local `.env` only. It is not needed by the static runtime and must not appear in content, client code, logs, documentation, or commits.

## Approved information architecture

Eens Business Park is the umbrella brand for the full multi-location portfolio. Every listing identifies its operating zone.

```text
/                               Business Park portfolio hub

/shops                          Available shop units
/shops/[slug]                   Shop-unit detail

/directory                      Occupied tenant directory
/directory/[slug]               Tenant profile

/warehouses                     Warehouse inventory
/warehouses/[slug]              Warehouse detail

/godowns                        Godown inventory
/godowns/[slug]                 Godown detail

/apartments                     Apartment inventory
/apartments/[slug]              Apartment detail

/locations                      Operating zones
/lease-terms                    Industrial and residential terms
/contact                        Viewing and office contact
/blog                           Practical property notes
```

Category routes are the canonical public inventory surface. The former generic property routes were removed because their slug namespace collided with category detail routes. Existing external links should be redirected at the hosting layer before release if preserving search signals is required.

The public distinction is explicit:

- Shop units are spaces available to lease.
- The tenant directory contains occupied businesses with approved profiles.
- Warehouses and godowns are industrial inventory.
- Apartments are residential inventory.

The category pages may be focused views over a shared content foundation. They must not create duplicated content sources merely to create separate URLs.

## Header mega-menu

Use four user-task groups and one primary action:

```text
Explore
  Shop units
  Warehouses
  Godowns
  Apartments
  All listings

Tenant directory
  Browse businesses
  Browse by category
  Browse by location
  Locations

Visit
  Arrange a viewing
  Lease terms
  Contact Eens

Journal

[Arrange a viewing]
```

The desktop panel uses three columns:

1. **Find space:** Shop units, Warehouses, Godowns, Apartments, All listings.
2. **Browse the park:** Tenant directory, Browse by category, Browse by location, Locations.
3. **Take the next step:** Arrange a viewing, Read lease terms, Contact Eens. A small recently published listing is optional only when it is genuinely available.

Keep descriptions short and factual. Do not put price ranges, parking claims, EV charging, facility hours, or technical specifications in the mega-menu. Those belong on category and detail pages and must come from verified content.

The mobile menu uses native expandable sections:

```text
Explore                 >
Tenant directory        >
Locations               >
Visit                   >
Arrange a viewing
Theme toggle
```

All links remain large enough for touch and keyboard use. No carousel belongs inside the mobile menu.

## Footer

The footer closes the visitor journey rather than duplicating every menu item.

Opening CTA:

```text
Have a space in mind?
Send the listing reference and we will arrange the next step.
[Arrange a viewing]
```

Link groups:

**Find space**

- Shop units
- Warehouses
- Godowns
- Apartments
- All listings

**Park directory**

- Browse businesses
- Browse by category
- Browse by location
- Locations

**Information**

- Lease terms
- Buying information
- About Eens
- Journal

**Contact**

- Email Eens
- Office location
- Request a viewing
- Replies within one business day

Closing line:

```text
Mlolongo / Syokimau / Baba Dogo / Thika
© Eens Limited
```

Do not include links for payment portals, loading reservations, repair tickets, employee badging, or job boards until those systems exist.

## Homepage

The homepage acts as the portfolio front door:

1. Hero: Eens Business Park, with a factual statement that the portfolio provides space to trade, store, and live across four Kenyan locations.
2. Primary paths: Find a shop unit, Find warehouse or godown space, Find an apartment, Browse the tenant directory.
3. Featured inventory rails: Shop units, Industrial space, Apartments.
4. Park locations: Mlolongo, Syokimau, Baba Dogo, Thika.
5. How listings work: published address, published price or rate, published terms, viewing by appointment.
6. Final viewing CTA: Send the listing reference.

Avoid claims such as premium, world-class, vibrant community, or seamless experience unless a verified source supports them.

## Category indexes

Every category index follows this structure:

1. Short factual hero.
2. Filter bar.
3. Optional featured listing row.
4. Full server-rendered inventory grid.
5. Terms or specification summary.
6. Viewing CTA.

### Shop units

Purpose: help retailers and service operators compare available spaces.

Show, where verified:

- monthly rent
- area
- floor or frontage
- service charge
- deposit
- permitted use
- availability
- zone

Page promise: “Compare shop units by area, monthly rent, and availability.”

### Warehouses

Page promise: “Warehouse space with published technical details.”

Show, where verified:

- area
- rate per sq ft
- total rate
- power
- clear height
- floor loading
- water
- parking
- lease term
- zone

### Godowns

Page promise: “Godown space for storage and distribution.”

Show, where verified:

- area
- access/loading
- power and water
- parking
- lease term
- zone

Warehouse and godown pages may share components but should retain distinct terminology when the published facts differ.

### Apartments

Page promise: “Apartments with published prices and sale terms.”

Show, where verified:

- sale price
- bedrooms
- bathrooms
- internal area
- parking
- floor
- amenities
- title/transfer terms
- warranty

### Tenant directory

The tenant directory is not an availability index.

```text
/directory
/directory/[slug]
```

Profiles use a visibly different state:

- Tenant directory
- Located at Eens Business Park
- Visit business or View profile

They do not use available, lease, request rate, or similar language. Publish only approved full profiles, images, logos, contacts, and hours.

## Detail pages

All detail pages share this sequence:

1. Breadcrumb/category.
2. Title, zone, availability, reference.
3. Hero image or gallery.
4. Price matrix.
5. Key facts.
6. Amenities or technical specifications.
7. Description.
8. Terms.
9. Location/map link.
10. Related listings.
11. Arrange a viewing CTA.

### Price matrix

Use sparse factual fields rather than promotional “starting from” language.

| Field | Shop | Warehouse/Godown | Apartment |
|---|---|---|---|
| Primary price | Monthly rent | Monthly rent or KSH/sq ft | Sale price |
| Area | Sq ft | Sq ft | Sq ft / sqm |
| Deposit | If verified | If verified | If applicable |
| Service charge | If verified | If verified | If verified |
| Lease/sale term | If verified | Minimum lease | Transfer/warranty |
| Availability | Required | Required | Required |

Unknown values are omitted or explicitly marked as awaiting confirmation. They are never guessed.

## Featured carousel policy

Carousels are secondary browsing aids, never the only inventory surface.

Homepage category rails contain 3-5 featured listings. Every rail has a visible Browse all link. The full inventory remains a server-rendered, crawlable grid or list.

Each carousel must provide:

- accessible previous and next buttons
- keyboard operation
- no autoplay by default
- reduced-motion behavior
- stable image dimensions
- independent card links
- a non-carousel grid/list below or a clear Browse all route

On mobile, featured items may use a horizontal scroll-snap rail. Full inventory must not require a swipe-only interaction.

## Image policy

Use three image classes:

1. Actual property images, used when they depict the listed unit.
2. Contextual local photography, labeled with a small Photo source link and never presented as proof of the listed property.
3. Tenant-approved images/logos, used only in the tenant directory after permission is confirmed.

Use wide 21:9 media for page/detail hero surfaces, 16:9 for listing cards, and a consistent 4:3 or square crop for tenant profiles. Keep intrinsic dimensions explicit. Preserve visible image provenance without turning credits into decorative copy.

## Content model direction

Do not create four unrelated property data systems. Prefer a shared property foundation with an explicit kind:

```text
Property
  kind: SHOP | WAREHOUSE | GODOWN | APARTMENT
  common facts
  type-specific facts
  gallery
  body
  terms
```

Tenant profiles remain a separate entity:

```text
Tenant
  name
  category
  location
  description
  logo/photo
  contact/hours, if approved
  profile status
```

The current Tina schemas and generated client must be inspected before implementation. Any new fields require matching Tina schema, local content, generated types, route rendering, and tests where behavior changes.

## Copy system

Preferred copy:

- “Compare shop units by area and monthly rent.”
- “View warehouse specifications before requesting a tour.”
- “Published prices and terms are shown on each listing.”
- “Browse businesses located across the Eens portfolio.”

Avoid AI-fluff and unsupported marketing language such as:

- unlock
- elevate
- seamless
- world-class
- vibrant ecosystem
- premium lifestyle
- real-time availability without a live source
- amenities when the data is actually a technical specification

## Approval boundary

This document records the approved design direction. The user approved implementation of the first vertical slice: shared property vocabulary, focused category indexes, category-canonical detail routes, and the approved task-based navigation/footer. The separate tenant directory remains gated on verified tenant records and a later implementation slice. Environment-file changes remain outside this implementation.

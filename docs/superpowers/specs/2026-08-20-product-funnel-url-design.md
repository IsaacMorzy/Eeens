# Product-specific Tailscale Funnel URLs

## Problem

`astro.config.mjs` currently falls back to the Eens Business Park Funnel URL when `SITE_URL` is missing. A self-hosted product built from the same project can therefore publish Eens canonical, Open Graph, sitemap, and RSS URLs.

## Decision

Use one `SITE_URL` value per product deployment. Production builds must fail when the value is missing. Development builds may use `http://localhost:4321`.

The Eens deployment keeps its existing public origin:

```text
https://vmi3416692.tailc65d30.ts.net:10000
```

Other products must provide their own Funnel origin through their deployment environment. On one Tailscale node, Funnel can use ports `443`, `8443`, and `10000`; the port is part of the product URL. The repository documents the mapping but does not change live Tailscale or Nginx services.

## Scope

- Add a small URL resolver with production validation.
- Use it from Astro configuration.
- Document the per-product environment contract and the existing Eens value.
- Add regression tests for missing, local, invalid, and valid production values.

## Non-goals

- Do not edit `.env`, `.env.local`, or other credential files.
- Do not configure, restart, or stop Tailscale, Nginx, Frappe, or production services from this repository.
- Do not invent product names, Funnel hostnames, or local backend ports.
- Do not add a runtime proxy or path-based product router.

## Acceptance criteria

- A production build without `SITE_URL` throws a clear error.
- A development build without `SITE_URL` uses `http://localhost:4321`.
- Production `SITE_URL` values must be absolute HTTPS origins without a path, query, or fragment.
- Astro uses the resolved value for `site` and therefore existing metadata consumers use the correct product origin.
- The Eens production value remains documented as the value to set for `eensbpark.ke`.
- Tests and the repository checks pass, or any environment blocker is reported exactly.

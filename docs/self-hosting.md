# Self-hosting with product-specific Tailscale Funnel URLs

Each product build must set its own `SITE_URL`. This value controls Astro's canonical URLs, Open Graph URLs, sitemap links, and RSS links.

## Eens production

Keep the existing Eens public origin:

```text
SITE_URL=https://vmi3416692.tailc65d30.ts.net:10000
```

The current Eens routing is:

```text
public Funnel :10000 -> local Nginx :8081 -> Eens static site
```

Set `SITE_URL` in the production environment used to build Eens. Do not edit the ignored `.env` files from source control.

## Other products on the same server

Tailscale Funnel supports public HTTPS ports `443`, `8443`, and `10000`. Give each product a distinct port and local backend, then build it with the matching origin:

```text
Product B: https://<tailnet-node>.ts.net:8443 -> 127.0.0.1:<product-b-port>
Product C: https://<tailnet-node>.ts.net:443  -> 127.0.0.1:<product-c-port>
```

The CLI shape is:

```bash
tailscale funnel --bg --https=10000 http://127.0.0.1:8081
tailscale funnel --bg --https=8443 http://127.0.0.1:<product-b-port>
tailscale funnel --bg --https=443 http://127.0.0.1:<product-c-port>
```

Replace placeholders with the real product backend ports. Do not reuse `:10000` for another product.

Each product build must receive a different value, for example:

```text
Eens:     SITE_URL=https://vmi3416692.tailc65d30.ts.net:10000
Product B: SITE_URL=https://vmi3416692.tailc65d30.ts.net:8443
Product C: SITE_URL=https://vmi3416692.tailc65d30.ts.net:443
```

On one Tailscale node, these are separate URLs by port. Distinct `*.ts.net` hostnames require distinct Tailscale nodes. This repository only validates and consumes `SITE_URL`; it does not start, stop, or rewrite live Tailscale, Nginx, or application services.

## Verification

Before publishing a product build:

1. Set that product's `SITE_URL` in its deployment environment.
2. Run the build.
3. Check the generated HTML for that product's canonical and Open Graph URLs.
4. Run `tailscale funnel status --json` on the host and confirm the port-to-backend mapping.
5. Open the product URL and confirm it does not redirect or publish another product's origin.

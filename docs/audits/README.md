# Audits

Raw evidence for the page-quality audits in `docs/page-quality-audit-*.md`.

## Layout

- `lighthouse/` — Lighthouse JSON report dumps and HTML reports.
  - `eens-lh-canonical-*` — canonical desktop/mobile runs (2026-08-15) on the
    local static build (desktop home, mobile home/shops/events/warehouses/careers).
  - `eens-lh-prod-*` / `eens-lh-tailscale-*` — same-day runs against the
    production (Vercel) and tailscale-served builds.
  - `lh-*.json` — 2026-08-16 session runs (home + `/warehouses`) used to
    diagnose the mobile LCP gap; heavy host contention made them noisy, which
    is why the audit doc reports ranges, not single numbers.
  - `eens-lighthouse-live.*` — initial live-site capture (2026-08-15).
- `screenshots/` — mobile/desktop viewport captures from the same sessions.

## How to read

Each `*.json` is a full Lighthouse 13.4.1 result. Quick score extraction:

```bash
node -e "const r=require('./lighthouse/lh-desktop.json'); \
console.log(r.categories.performance.score, \
r.audits['largest-contentful-paint'].numericValue, \
r.audits['cumulative-layout-shift'].numericValue)"
```

## Verdict (2026-08-16)

- Desktop: perf 99, LCP 0.8 s — clean.
- Mobile: LCP pinned ~3.0 s on this box across every fix; run-to-run variance
  (element-render-delay 446 ms ↔ 2170 ms) exceeds the effect size — the box
  (frappe workers, MariaDB, other sessions) under 4x throttle is the bottleneck,
  not the critical path. On a clean runner (Vercel preview + Lighthouse CI,
  `.github/workflows/lighthouse-ci.yml`) the gate is perf ≥ 0.95, LCP ≤ 2.5 s,
  CLS ≤ 0.1 per Google's thresholds.

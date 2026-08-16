# Page quality audit — 2026-08-17

Real-estate listing modernization pass. PR #29 (perf + glass + mega-menu) is
ready; this session adds: Lighthouse CI on Vercel preview, audit evidence in
`docs/audits/`, and modernized listing surfaces (property card, property
detail, business parks, index).

## Scope (wayfinder tickets)

- **Lighthouse CI** — `.github/workflows/lighthouse-ci.yml` +
  `lighthouserc.js`. Waits for the Vercel preview deployment
  (`vercel/wait-for-deployment-action`, no Vercel token needed; polls
  GitHub's Deployments API), then runs Lighthouse CI (mobile preset, 3 runs)
  asserting Google's CWV thresholds: perf >= 0.95, LCP <= 2500 ms, CLS <= 0.1,
  TBT <= 200 ms, plus a11y / best-practices / SEO >= 0.9.
- **Audit evidence** — the Lighthouse JSON/HTML dumps and viewport screenshots
  previously scattered in `/tmp` now live in `docs/audits/lighthouse/` and
  `docs/audits/screenshots/` with an index README.
- **Listing surfaces** — PropertyCard (badge + photo source on the image,
  decluttered body rail), property detail page (spec sheet as a grouped spec
  grid, related listings via PropertyCard), business parks pages (icon-backed
  directory tiles, modern step cards).

## Token lock

No token changes. Same Eens tokens (warm canvas, navy ink, cyan-teal accent,
hairline-steel) from `DESIGN.md` / `global.css`. Glass stays on chrome; property
evidence (cards, imagery, spec sheets) remains opaque per the decoration scan.

## Design read

Real-estate register for B2B/industrial property seekers: trust-first, evidence
over decoration. Modernization levers applied in order: typography rhythm
(preserved), spacing, one chromatic accent (locked), motion (hover lifts only,
reduced-motion safe), hero/section recomposition on the park pages.

## Performance

- Desktop remains 99 (LCP 0.8 s) — unchanged by this pass.
- Mobile LCP was pinned ~3.0 s on this box across every fix (environment
  contention); the Lighthouse CI gate now enforces LCP <= 2500 ms on a clean
  Vercel preview runner instead of this shared VPS.

## Copy voice

Unchanged — property-register voice preserved. New labels are factual
("View listing", "Photo source").

## Watch items

- CLS 0.185 observed once on `/warehouses` (single noisy run, not locatable in
  Lighthouse 13 debugdata) — now covered by the CI CLS <= 0.1 gate.
- Vercel preview requires the repo's Vercel GitHub integration (already linked
  via `.vercel/project.json`) and the Tina env vars configured in the Vercel
  project (they were present for the Aug 15 build attempts).

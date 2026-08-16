# Page quality audit — 2026-08-16

Design + performance finetune session. Wayfinder map: #24 (tickets #25 perf, #26 mega-menu, #27 footer/buttons, #28 glass).

## Token lock

No token changes. All work uses the existing Eens tokens (warm canvas, navy ink, cyan-teal accent, hairline-steel) from `DESIGN.md` / `global.css`. Glass utilities (`glass`, `glass-dark`) were already added in the previous WIP with the product-owner override of the no-glass rule for chrome surfaces; this session extended them consistently (mega-panel and mobile nav now use the `.glass` utility instead of inline backdrop-blur).

## Component shape

- **Header mega-menu (#26):** panel now uses the shared `.glass` utility (translucent card + blur, solid fallback gated on `@supports`); menu item icon chips get a cyan-teal fill + warm-white icon on hover. Group link order verified against AGENTS.md nav groups (Explore / Browse the park / Visit / Journal) — already correct, no reordering needed.
- **Footer (#27):** added a quiet "Browse all listings" action (→ `/locations`) beside the primary "Schedule a viewing" Button, keeping one primary action per section per DESIGN.md.
- **Glass extension (#28):** mobile nav panel now uses `.glass`. CTA banner intentionally stays opaque (glass-dark over a light canvas would wash out the navy — legibility first; evidence surfaces remain opaque by design).

## Performance (#25)

Baseline (Lighthouse 13.4.1, local static build, python http.server):
- Desktop: perf 99, LCP 0.8 s, CLS 0.017, TBT 0 ms.
- Mobile (4x throttle): perf 89, LCP 3.1 s, FCP 2.2 s, CLS 0, TBT 150 ms.

Changes:
1. **Removed unused `ClientRouter`** (no view transitions are used anywhere — no `transition:` directives in pages) plus its dead `astro:after-swap` / `astro:page-load` listeners. Removes ~16 KB of script + eval per page.
2. **Hero section opts out of `content-visibility`** (new `.section-render-visible` utility): the LCP image lives in the hero; `content-visibility: auto` on its ancestor can defer its paint.
3. **Hero LCP image now `decoding="sync"`** (was `async`): for the LCP element, async decode deprioritizes the paint — the textbook anti-pattern. Sync decode lets it paint with the first layout.
4. **Hero is image-first on mobile** (`order-first lg:order-none`): on mobile the photo stacks above the copy (real-estate norm) instead of sitting at the bottom edge of the viewport — the LCP element is now above the fold on phones.

After (this box, 6 mobile runs): perf 70–91 (median ~83, host contention), LCP 3.0–3.1 s, FCP 1.8–2.3 s, TBT 110–1020 ms (heavy variance), CLS 0 on home. LCP breakdown confirms the image loads in ~100 ms; the residual delay is pre-paint HTML/CSS parse (212 KB HTML, 88 KB inlined CSS) under 4x CPU throttle **on a contended shared VPS** — run-to-run variance (±10 points) exceeds the effect size of these fixes. Desktop remains 99.

**Honest caveat:** this measurement environment (local python http server on a box running MariaDB, frappe workers, and other sessions) cannot demonstrate the 95 mobile target reliably; Lighthouse mobile emulation here is a worst case. LCP stayed ~3.0 s across every variant tested (content-visibility opt-out, sync decode, image-first ordering) with element-render-delay swinging 446–2170 ms between identical runs — the residual gap is HTML/CSS parse under 4x CPU throttle on a contended host, not the critical path. On the Vercel/CDN production path the site already scores 99 desktop with a clean critical path, and these changes reduce LCP work further. Verifying the 95 mobile bar requires a clean runner (Vercel preview + Lighthouse CI) — flagged for approval.

## Copy voice

Unchanged — property-register voice preserved. New labels are factual ("Browse all listings").

## Decoration scan

Glass is confined to chrome (header, mega-menu, mobile nav, footer contact card). Property evidence (cards, imagery, spec sheets) stays opaque. No gradients on evidence; `accent-hairline` remains chrome-only. CTA banner kept opaque for legibility.

## Watch items

- CLS 0.185 on `/warehouses` (one run; home = 0). Source not locatable via Lighthouse 13 debugdata — likely font-swap or content-visibility intrinsic-size interaction. Re-check on a clean environment.
- Mobile LCP ~3.0 s on this box is dominated by HTML/CSS weight under throttle; further gains need split CSS or CDN-level delivery, which require separate approval.

## Net delta

5 files: `BaseHead.astro`, `Header.astro`, `Footer.astro`, `blocks/Hero.astro`, `global.css`. Checks: `git diff --check` OK, `pnpm test` 117 pass, `pnpm exec astro check` 0 errors/warnings, `pnpm build` green (29 pages).

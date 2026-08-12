# Eens Business Park implementation checklist

- [x] Add `SHOP` to Tina property vocabulary and page-block template.
- [x] Add `SHOP` to shared property ordering, labels, and tests.
- [x] Add filtered category index routes for shops, warehouses, godowns, and apartments.
- [x] Remove `/properties` and `/properties/[slug]` and migrate to category-canonical routes.
- [x] Update Header mega-menu to Explore, Browse the park, Visit, and Journal.
- [x] Update Footer to Find space, Park directory, Information, and Contact groups.
- [x] Keep tenant directory links factual and do not add empty fictional profiles.
- [x] Update relevant workflow/audit documentation with the implementation boundary and lessons.
- [x] Run `git diff --check`.
- [x] Run `pnpm test` — 102 tests passed.
- [x] Run `pnpm exec astro check` — 0 diagnostics.
- [x] Run a credentialed production build with `.env` loaded ephemerally; Tina generation completed, but Astro prerender failed during a Tina content request and remains a remote/schema blocker.
- [ ] Run isolated HTTP runtime smoke across all category routes and category detail routes; blocked by existing Astro/Tina dev-server locks on the requested and isolated ports.
- [x] Run independent code review and loop verification; checker escalated only the missing build/browser evidence, with route smoke now complete.
- [x] Report local/remote GitHub state separately; GitHub mutation remains a separate explicitly approved operation.

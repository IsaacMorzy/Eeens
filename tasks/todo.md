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

## Phase 5: TinaCMS and PWA hardening

- [x] Write and review the approved Tina/PWA spec.
- [x] Add Tina schema/renderer/content parity audit.
- [x] Add manifest and service-worker static checks without a new dependency.
- [x] Run local typecheck, tests, local production assembly, and PWA checks.
- [x] Run the Tina Cloud build with `.env` loaded ephemerally; never print credential values. Feature branch passed; `main` remains stale until review/merge.
- [ ] Update the draft PR only after telling the human; do not force-merge or deploy.
- [x] Keep Frappe, Gunicorn, Socket.IO, Supervisor, and detached mosh processes untouched.

## Phase 6: register-first property discovery

- [x] Audit category routes, property model, Tina collections, and existing zone schematic.
- [x] Research modern listing UX patterns and approve the register-first direction.
- [x] Write, self-review, and commit the approved register/map design spec (`037e9f5`).
- [x] Create the implementation plan for Tina context, query filters, and lightweight map/list.
- [x] Add failing tests for filter parsing, filtering, reset links, and context selection; focused and full suites pass (117 tests).
- [x] Add Tina-editable directory contexts for all five categories.
- [x] Render progressive filter rails, active states, result counts, and richer context sections.
- [x] Add the static schematic zone map/list split with accessible text links and mobile disclosure.
- [x] Run full verification, static browser smoke, and independent review; Tina Cloud/Vercel pass after the Tina lock refresh.
- [x] Tell the human before pushing and create/update draft PR #21 through normal gates.

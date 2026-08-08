# Eens Business Park repository guide

## Purpose

This repository builds and optimizes the public Eens Business Park website. It is an Astro 6 site with TinaCMS-managed content for a Kenyan property operator. The website helps operators, distributors, manufacturers, commercial occupiers, and apartment buyers inspect published properties and request the next step.

The core product is not a generic real-estate brochure. It is a clear property register: address, area, price, availability, specifications, lease or sale terms, and a practical way to arrange a viewing.

## Stack and workflow

- Astro 6 with MDX pages and server-rendered `.astro` components.
- TinaCMS content in `src/content/` and schemas in `tina/collections/`.
- Tailwind CSS 4 through `src/styles/global.css`.
- Vitest tests live beside utilities in `src/lib/`.
- Use the existing dependencies and components before adding anything new.
- Typical checks: `pnpm exec astro check`, `pnpm test`, and `pnpm build`.

## Site map

- `/` — operating overview and featured listings.
- `/properties` — filterable property directory.
- `/properties/[slug]` — individual property detail and specifications.
- `/locations` — Mlolongo, Syokimau, Baba Dogo, and Thika operating zones.
- `/lease-terms` — published industrial lease and residential sale terms.
- `/contact` — viewing requests and office contact details.
- `/about` — operator, publishing principles, and footprint.
- `/blog` — practical notes on locations, specifications, and leasing.

## Navigation language

The header uses four short menu groups:

1. **Listings** — published units and apartments.
2. **Visiting** — locations, office details, and viewing requests.
3. **Leasing** — industrial listings, specifications, and lease terms.
4. **Tenant contact** — questions, documents, and the office inbox.

Keep these groups grounded in routes and actions the site actually supports. If a future feature such as online rent payments, keycard requests, loading-dock reservations, COI submission, or job listings is not implemented, do not present it as live functionality. Link to a clear contact route or mark it as planned only when the product owner asks for that state.

## Design rules

Read `DESIGN.md` before changing visuals. Use its tokens and component shapes rather than introducing ad-hoc colors, radii, shadows, spacing, or typography. The visual language is an architectural register:

- warm off-white canvas, navy structural ink, cyan-teal wayfinding accent, navy primary actions on light surfaces, and cyan-teal primary actions in dark mode;
- Plus Jakarta Sans for display, Inter for body copy, JetBrains Mono for references, area, prices, addresses, and technical values;
- hairline borders and restrained motion; no decorative gradients, glows, starfields, or glass surfaces;
- preserve visible keyboard focus, 44px touch targets, reduced-motion support, and dark-mode readability;
- keep one clear primary action per section and make property facts easy to scan.

## Content and voice

Write like a property register, not a campaign generator. Use short, specific sentences and concrete facts. Menu labels should be one or two words; descriptions should state what the link contains. Prefer:

- “9,000 sq ft warehouse on Mombasa Road, KM 14.”
- “3-year minimum. KSH invoiced monthly.”
- “Send the listing reference. We reply within one business day.”

Avoid hype, filler, invented testimonials, unsupported performance claims, fake amenities, and SaaS language such as “unlock,” “elevate,” “seamless,” “world-class,” or “endless possibilities.” Do not use “dream home,” “stunning,” “luxury,” or exclamation marks. Never invent prices, infrastructure, tenants, operational portals, or availability to make a page feel fuller. If a fact is not in the content model or an existing source file, ask or use a plainly stated contact prompt.

## Implementation guidance

- Prefer existing blocks (`Hero`, `Split`, `Content`, `Features`, `Stats`, `PropertyList`, `CtaBanner`) and existing UI components.
- Keep property data in `src/content/property/` and page copy in `src/content/page/`; keep Tina schemas in sync when adding fields.
- Use `contactEmail()` for transactional email links so the configured inbox remains the single source of truth.
- Keep route links valid against the current site map. Query links such as `/properties?zone=Mlolongo` are intentional.
- If an exported symbol changes, search every reference before finishing.
- Do not run destructive commands, change production configuration, or add third-party services without explicit approval.

## Agent workflow blueprint

This is the default order for work in this repository. Do not invoke every skill on every task. Route the task to the smallest useful set, then validate the result.

### 0. Safety and scope

1. Load `loop-constraints` before any loop or autonomous workflow. Read `loop-constraints.md` from the repo root if it exists and begin with `Constraints loaded from loop-constraints.md: N rules active.` If it does not exist, say `loop-constraints.md not found; default safety rules active.` Then apply these defaults: never edit secrets/auth/payment paths, never disable tests, never auto-merge, and escalate after three failed attempts.
2. Load `loop-budget` at the start and end of a long-running loop. Read `loop-budget.md` and recent `loop-run-log.md` entries if present. At 80% of the configured cap, switch to report-only; at 90%, escalate budget or stop; at 100% or `loop-pause-all`, exit. Append the required JSON run record at the end only when the loop files are actually present. If the files do not exist, do not invent budget state; keep the run small and report-only.
3. Check the requested scope and current git state. Do not touch unrelated files.

### 1. Understand the request

- Use `loop-triage` for a queue of issues, CI failures, stale work, or competing priorities. Its output must contain exactly these useful sections: **High-Priority Items**, **Watch Items**, **Noise / Ignore**, and **State Updates**. Keep the report concise and do not propose architectural work during triage.
- Use `frappe-agent-interpreter` only for vague Frappe/ERPNext requests. This repo is Astro/Tina, so it is normally out of scope.
- Use `business-analyst` or `assumption-mapping` when the business requirement is unclear or contains unsupported assumptions.
- Use `file-picker`, `code-searcher`, and `read_files` to map the relevant implementation before editing. Use at most one `thinker-with-files-gemini` for a genuinely non-trivial design or architecture decision.

### 2. Choose the smallest implementation

- Load `ponytail` for every implementation request by default. Apply its ladder: delete speculative work, prefer platform features, reuse installed dependencies, then write the minimum code.
- Load `minimal-fix` for one explicit bug, reviewer comment, typo, or CI failure. It is one problem per run and never a drive-by refactor.
- Load `ponytail-review` after a focused diff when the question is “what can we delete?” It reports only over-engineering findings and does not edit.
- Load `ponytail-audit` for a whole-repository simplification audit. It reports ranked deletions and does not edit.
- Use `code-searcher` whenever an exported symbol, route, schema field, or shared component API changes. Update all references in the same change.

### 3. Design and content gates

For any visual or copy change, use this sequence:

1. **Design source:** read `DESIGN.md`. Load `design-bridge` only when translating an external design document or a new brand reference into implementation instructions. Do not change locked tokens from memory.
2. **Visual audit:** load `opendesign` for token lock, component shape, hierarchy, copy voice, and decoration checks. Its required audit shape is: Token lock, Component shape, Density + hierarchy, Copy voice, Decoration scan, then Net delta.
3. **Copy edit:** load `no-ai-slop` when editing supplied copy or any user-facing draft. Load `ai-writing-auditor` for a formal AI-pattern audit or a full rewrite report. Preserve concrete facts; never invent testimonials, tenants, amenities, prices, portals, or performance claims.
4. **Inclusive UI:** load `accessibility-tester` for keyboard navigation, focus states, screen readers, WCAG, contrast, touch targets, forms, or responsive interaction changes.
5. **Visual assets:** use the project’s existing architectural SVG/photo system first. Historical project references to `visual-asset-generator`, `mermaid-diagrams`, `excalidraw`, `c4-architecture`, `ui-designer`, or `humanizer` are not assumed installed; verify with the skill loader before invoking them.

For this Eens site, the design gate means: tokens from `DESIGN.md`, one restrained cyan-teal accent, navy high-priority actions on light surfaces, cyan-teal high-priority actions in dark mode, no gradients/glows/glass, no decorative imagery, factual mono treatment for property numbers, and reduced-motion support.

### 4. Implement

- Make the smallest relevant edit with existing Astro components, Tina schemas, CSS tokens, and native HTML where possible.
- Keep native `<details>/<summary>`, semantic landmarks, ordinary links, and CSS ahead of a new JavaScript abstraction.
- Keep live features separate from future ideas. A menu item may link to an existing contact route, but must not imply an online rent portal, keycard service, dock calendar, COI upload, job board, or other system that is not implemented.
- Mark intentional shortcuts with `ponytail:` only when the limitation and upgrade condition matter.

### 5. Review and verify

Use a maker/checker split for non-trivial changes:

1. Implementer edits the files.
2. `code-reviewer-luna` reviews the diff for correctness and scope.
3. Load the `loop-verifier` skill and apply its independent maker/checker checklist through an available reviewer or the parent agent. Do not spawn `loop-verifier` by name unless the runtime explicitly exposes it as an agent type. Never use the implementer as its own verifier. If tests cannot run, the result is `ESCALATE_HUMAN`, not approval.
4. Load `accessibility-tester` or `opendesign` again when the review identifies UI/design risk.
5. Run the smallest relevant checks, then the project checks when practical:
   - `git diff --check`
   - `pnpm exec astro check`
   - `pnpm test`
   - `pnpm build` when content/schema or production assembly changed
6. Report exact commands and whether each passed, failed, or was blocked by the environment. Never claim a check passed when the terminal or browser was unavailable.

### 6. Loop-engineering installation and invocation

Loop Engineering is report-only during its first week. Do not enable unattended fixes, auto-merge, or schedules without explicit human approval and a healthy doctor result.

Use the unified CLI for new Loop setup:

```bash
npx @cobusgreyling/loop
npx @cobusgreyling/loop doctor . --json
npx @cobusgreyling/loop status .
npx @cobusgreyling/loop init . --pattern daily-triage --tool codex
npx @cobusgreyling/loop cost -p daily-triage -l L1 -c 1d
npx @cobusgreyling/loop badge .
```

Choose patterns by pain: `daily-triage`, `pr-babysitter`, `ci-sweeper`, `dependency-sweeper`, `post-merge-cleanup`, `changelog-drafter`, or `issue-triage`. Choose tools only from the CLI-supported set: `grok`, `claude`, `codex`, or `opencode`.

Existing doors remain valid and should not be rewritten unless asked:

```bash
npx @cobusgreyling/loop-init .
npx @cobusgreyling/loop-audit . --suggest
```

Stop Loop setup after doctor output and first-run instructions unless the user explicitly asks for more. Never run install/init/doctor commands as a substitute for normal site work.

### 7. Skill invocation contract

- Skills are loaded by exact name with the `skill` tool, for example `skill opendesign` or `skill no-ai-slop`.
- Agent types are different from skills. Spawn `file-picker`, `code-searcher`, `basher`, `code-reviewer-luna`, or `thinker-with-files-gemini` only when their job is needed; do not pretend a missing agent type exists.
- The `mattpocock/skills` catalog below is documented from upstream. Do not claim it is globally installed until the installer verification succeeds.
- If a requested skill is unavailable, state that clearly and use the closest verified skill. Never fabricate a skill name, output format, or command.

### Verified skill catalog for this repo

These existing Freebuff skills are available to this agent:

- **Loop controls:** `loop-constraints`, `loop-budget`, `loop-triage`, `loop-verifier`, `minimal-fix`, `install-loop`.
- **Design system and UI:** `opendesign`, `design-bridge`, `accessibility-tester`.
- **Writing and copy:** `no-ai-slop`, `ai-writing-auditor`.
- **Simplicity and code reduction:** `ponytail`, `ponytail-review`, `ponytail-audit`.
- **Reasoning and review support:** `thinker-with-files-gemini` and `code-reviewer-luna` are runtime agent types, not skills; use them through the spawn mechanism when available.

The project history in `plan.md` mentions `humanizer`, `ui-designer`, `visual-asset-generator`, `mermaid-diagrams`, `excalidraw`, and `matpocock`; they are not verified loadable skills in this session. Check with the skill loader before use. Do not claim they are installed because they appear in old planning notes.

## Matt Pocock skill bundle

**Upstream:** [mattpocock/skills](https://github.com/mattpocock/skills). The singular `mattpocock/skill` URL is not the active upstream repository.

**Verification status (2026-08-09):** the upstream repository cloned successfully and exposed 35 skills, but this Freebuff PromptScript runtime rejected global installation with `PromptScript does not support global skill installation`. Do not claim the bundle is globally installed. Two verified local skill files are present under `$HOME/.agents/skills/`: `ask-matt/SKILL.md` and `setup-matt-pocock-skills/SKILL.md`.

In a normal user shell, retry the requested global installation and verify it:

```bash
npx skills@latest add mattpocock/skills --global --yes
npx skills@latest list
find "$HOME/.agents/skills" "$HOME/.claude/skills" -maxdepth 3 -name SKILL.md -print 2>/dev/null | sort
```

If global installation remains unsupported, use the verified Freebuff skills and do not add an unverified project-local copy. Run `setup-matt-pocock-skills` only after global installation succeeds and only once per repository; it is prompt-driven and must confirm the issue tracker before writing `docs/agents/*`.

## Design-polish triage

For a visual or copy pass, read `DESIGN.md`, run `opendesign`, `accessibility-tester`, `no-ai-slop`, and `ai-writing-auditor`, then record evidence in `docs/design-polish-triage.md` before editing. Use existing contextual imagery before diagrams or new dependencies. Treat Pexels assets as contextual stock unless the operator confirms the image is the listed property. Keep literal address, area, price, availability, specifications, and terms separate from image interpretation. Remove decorative diagrams, gradients, blur, and scroll-tied motion when they compete with property evidence. Validate with `git diff --check`, `pnpm exec astro check`, `pnpm test`, and `pnpm build` when route assembly changes.

### Engineering — user-invoked

Use these when the user explicitly asks for the named flow or the task clearly requires that orchestration. A user-invoked skill may call model-invoked skills, but should not call another user-invoked skill directly.

| Skill | Invoke when | Eens-specific use |
|---|---|---|
| `ask-matt` | The request is confusing or points at several possible workflows. | Route ambiguous website, content, bug, or planning requests to the right skill. |
| `grill-with-docs` | A large or ambiguous change needs shared terminology and durable decisions. | Interview before changing property vocabulary, content models, or multi-page workflows; write `CONTEXT.md`/ADRs only when configured and requested. |
| `triage` | There is an incoming queue of issues, CI failures, or competing priorities. | Prioritize site defects and content requests before implementation. |
| `improve-codebase-architecture` | The user asks for an architecture survey or the repository has recurring seam problems. | Review Astro components, content boundaries, and Tina integration; do not use for a focused fix. |
| `setup-matt-pocock-skills` | The bundle has just been installed globally and this repo has not been configured. | Run once in Eens, then record the chosen issue tracker/docs layout. |
| `to-spec` | An agreed conversation needs to become a durable implementation specification. | Capture routes, content fields, acceptance criteria, and validation commands before a large change. |
| `to-tickets` | A spec or plan must be split into small executable units. | Break multi-page/property/content work into tracer-bullet tickets with blocking edges. |
| `implement` | An approved spec or ticket set is ready to build. | Implement vertical slices using existing Astro/Tina patterns, tests, review, and the Eens design/content gates. |
| `wayfinder` | A large initiative spans multiple sessions and needs a decision map. | Plan a substantial site redesign, content-model migration, or cross-cutting platform change. |

### Engineering — model-invoked

Use these as reusable disciplines when the task matches; do not invoke every one by default.

| Skill | Invoke when | Eens-specific use |
|---|---|---|
| `prototype` | A UI or interaction question is unresolved. | Build a disposable HTML prototype for a page/component choice; do not ship it without approval. |
| `diagnosing-bugs` | A hard bug or performance regression needs reproduction and minimization. | Reproduce Astro build, route, hydration, content, or visual regressions before fixing. |
| `research` | External primary-source research is needed. | Research Astro, Tina, accessibility, property publishing, or design references and save cited findings when appropriate. |
| `tdd` | Non-trivial behavior or logic is changing. | Use red-green-refactor for filters, pagination, content transforms, route logic, and interactive behavior. |
| `domain-modeling` | Business vocabulary, entities, or rules are changing. | Clarify properties, zones, units, apartments, terms, availability, viewings, and listing references before changing schemas. |
| `codebase-design` | New seams or deeper modules are needed. | Design boundaries between MDX/content collections, Tina schemas, route loaders, and reusable blocks before adding abstractions. |
| `code-review` | A non-trivial implementation needs a separate standards/spec review. | Review correctness, Eens conventions, design/content rules, and acceptance criteria after implementation. |
| `resolving-merge-conflicts` | A merge or rebase has conflicts. | Resolve hunk by hunk while preserving current site content and route intent; never abort automatically. |
| `wizard` | A human must perform credentials, infrastructure, or one-off cutover steps. | Generate a visible human-run shell wizard; never hide secrets or production actions in automation. |

### Productivity — user-invoked

| Skill | Invoke when | Eens-specific use |
|---|---|---|
| `grill-me` | The user wants a rigorous interview without repository documentation. | Resolve design, scope, content, or rollout decisions interactively before editing. |
| `handoff` | Work must move to another agent/session. | Record changed files, decisions, blocked checks, and exact next commands. |
| `teach` | The user wants a stateful explanation across sessions. | Teach Astro, Tina, content modeling, or the Eens workflow using a durable learning workspace. |
| `to-questionnaire` | Important decisions are unresolved and asynchronous input is preferable. | Create a concise questionnaire for product/content/design decisions without guessing facts. |
| `wait-what` | The user indicates that a prior explanation or decision was misunderstood. | Re-explain in Eens vocabulary and state the concrete next action. |

### Productivity — model-invoked

| Skill | Invoke when | Eens-specific use |
|---|---|---|
| `grilling` | A reusable interview primitive is needed by another workflow. | Support `grill-me`, `grill-with-docs`, triage, wayfinding, or architecture discussions. |
| `writing-for-agents` | Agent-facing documentation is being created or changed. | Use when editing `AGENTS.md`, skills, pointers, or workflow instructions; keep guidance concise and discoverable. |

### Miscellaneous

| Skill | Invoke when | Eens-specific use |
|---|---|---|
| `scaffold-exercises` | The user explicitly asks to create upstream exercise scaffolding. | Not part of normal Eens website work; do not invoke for site implementation. |

### Matt Pocock routing shortcuts

| Request shape | First choice | Then |
|---|---|---|
| “This request is unclear.” | `ask-matt` | `grill-me` or `grill-with-docs` depending on whether repo docs are needed. |
| “Plan this large change.” | `wayfinder` | `domain-modeling` → `to-spec` → `to-tickets`. |
| “Implement this approved plan.” | `implement` | `tdd` where behavior changes → `code-review` → project checks. |
| “Why is this bug/regression happening?” | `diagnosing-bugs` | `tdd` for the regression test, then `code-review`. |
| “Review/simplify this codebase.” | `improve-codebase-architecture` for architecture; existing `ponytail-audit` for deletion-focused audit | `code-review` only after changes. |
| “We have many issues/CI failures.” | `triage` | `diagnosing-bugs` or `implement` for selected items. |
| “Document this decision or hand off.” | `to-questionnaire` for open decisions; `handoff` for session transfer | `writing-for-agents` when agent docs change. |

### Out-of-scope skill families

The available Frappe/ERPNext skills (`frappe-*`) apply only if this repository is changed into a Frappe project. Do not load them for Astro/Tina website work. If that happens later, start with `frappe-agent-interpreter` for vague requirements and `frappe-agent-validator` before deployment, then load the relevant syntax, implementation, core, error, ops, and testing skills for the chosen mechanism.

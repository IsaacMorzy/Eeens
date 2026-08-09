# Matt Pocock engineering skills

Verified: 2026-08-09

Upstream: https://github.com/mattpocock/skills

The upstream README is the source of truth for the active catalog. The bundle is installed under `$HOME/.agents/skills/` for this runtime. Freebuff can load the verified skill names through its skill loader, but it cannot register skills with external PromptScript agents; never claim external global registration.

## Strict first-step routing

Before any repository task:

1. Read `AGENTS.md` and this catalog.
2. Choose the smallest exact Matt Pocock skill for the request.
3. Load that skill before planning or editing.
4. Follow its process and human gates through completion.
5. For code changes, use the repository's checker, tests, and review gates.

If the request is ambiguous, route with `ask-matt`. If it is a large initiative, use `wayfinder`; for an agreed implementation, use `implement`. Do not invoke every skill by default.

## Active upstream catalog

These names are transcribed from the upstream README's Engineering and Productivity sections. The category is part of the catalog because it determines invocation: user-invoked skills orchestrate work; model-invoked skills provide reusable disciplines.

### Engineering: user-invoked

- `ask-matt`
- `grill-with-docs`
- `triage`
- `improve-codebase-architecture`
- `setup-matt-pocock-skills`
- `to-spec`
- `to-tickets`
- `implement`
- `wayfinder`

### Engineering: model-invoked

- `prototype`
- `diagnosing-bugs`
- `research`
- `tdd`
- `domain-modeling`
- `codebase-design`
- `code-review`
- `resolving-merge-conflicts`
- `wizard`

### Productivity: user-invoked

- `grill-me`
- `handoff`
- `teach`
- `to-questionnaire`
- `wait-what`

### Productivity: model-invoked

- `grilling`
- `writing-for-agents`

## Routing table

| Request | First skill | Follow with |
|---|---|---|
| Unclear task or workflow | `ask-matt` | `grill-me` or `grill-with-docs` |
| Large multi-session initiative | `wayfinder` | `domain-modeling` → `to-spec` → `to-tickets` |
| Approved implementation | `implement` | `tdd` where behavior changes → `code-review` → project checks |
| Bug or performance regression | `diagnosing-bugs` | `tdd` for the regression, then `code-review` |
| Queue, issue, or CI prioritization | `triage` | `diagnosing-bugs` or `implement` for the selected item |
| Architecture survey | `improve-codebase-architecture` | `codebase-design` for the chosen seam |
| Agent documentation | `writing-for-agents` | `code-review` and documentation checks |
| Unresolved decision | `to-questionnaire` | Human answers before implementation |
| Explanation or learning request | `teach` | Use the requested teaching path |
| Merge/rebase conflict | `resolving-merge-conflicts` | Review and project checks |

## Human gates and safety

- `setup-matt-pocock-skills`, `triage`, `wayfinder`, `to-spec`, and `to-tickets` remain human-gated. They may inspect or draft state, but must not auto-close issues, push, merge, schedule work, or change production systems.
- Use `implement` only for an approved spec or ticket slice. For one explicit defect, the repository may use the verified `minimal-fix` discipline instead.
- Use `writing-for-agents` whenever changing `AGENTS.md` or this catalog.
- If a requested name is not in this active upstream catalog or cannot be loaded in the runtime, report that gap and select the closest verified discipline. Never fabricate invocation success.
- Treat `loop-constraints.md`, `LOOP.md`, and the repository safety rules as binding. Keep loop automation report-only unless the human explicitly approves a reviewed promotion.

## Source boundary

The broader `$HOME/.agents/skills` directory contains Freebuff and community skills. Their presence does not make them Matt Pocock skills. This document intentionally excludes unrelated UI, SEO, social research, and loop skills. The upstream README also describes `misc`, `in-progress`, and `deprecated` repository areas; those are not part of the active engineering/productivity catalog above.

## Installation and verification

The upstream README documents these entry points:

```bash
# Editable files for Codex and other agents
npx skills@latest add mattpocock/skills

# Managed Claude Code plugin
claude plugins install mattpocock-skills
```

For this Freebuff runtime, verify local files with:

```bash
find "$HOME/.agents/skills" -maxdepth 2 -name SKILL.md -print | sort
```

The final external PromptScript registration step is unsupported here. Local skill files are available to the Freebuff skill loader; external agents must be configured separately by their own tooling.

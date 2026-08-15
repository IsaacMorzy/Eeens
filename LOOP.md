# Loop Configuration - Eens Business Park

## Active Loops

| Pattern | Cadence | Status | Automation prompt |
|---------|---------|--------|-------------------|
| Daily Triage | 1d | L1 report-only | `Run $loop-triage. Read STATE.md. Report only.` |

## Human Gates

- No auto-fix until a separately approved L2 change.
- No auto-merge, push, issue closure, scheduling, or production action without explicit human approval.
- All high-risk paths require human review under `loop-constraints.md` and `docs/safety.md`.

## Worktrees

- Codex provides a built-in worktree per thread for L2+ fix attempts.
- One fix per worktree; the verifier must approve before a PR is proposed.

## Connectors (MCP)

- MCP is optional for L1 report-only loops.
- For L2+, GitHub access remains read-only until a separate scope review approves otherwise.

## Budget

- Max sub-agent spawns per run: 0 (L1).
- Daily cap: 100k tokens, maximum 2 runs/day.
- Switch to report-only at 80%; stop at 100% or when `loop-pause-all` is active.

## Links

- Triage skill: `.codex/skills/loop-triage/SKILL.md`
- Budget skill: `.codex/skills/loop-budget/SKILL.md`
- Constraints skill: `.codex/skills/loop-constraints/SKILL.md`
- Verifier: `.codex/agents/verifier.toml`
- Budget: `loop-budget.md`
- Constraints: `loop-constraints.md`
- Repository guidance: `AGENTS.md`
- Simplicity discipline: `ponytail` runtime skill

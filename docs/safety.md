# Eens agent safety

This file is the short safety pointer for Loop Engineering. The binding rules live in `loop-constraints.md`; update that file when policy changes.

## Protected paths

Never edit or read values from `.env`, `.env.*`, `auth/`, `payments/`, `secrets/`, or `credentials/`. Keep credentials ephemeral and never print them.

## GitHub and production

Pushing, creating or updating pull requests, merging, closing issues, scheduling loops, restarting services, and deploying require explicit human approval for that specific action. Never force-push, force-merge, bypass review, or auto-merge.

## Loop mode

Eens runs Daily Triage at L1 report-only: inspect state, report findings, and take no autonomous fix action. The loop may not enable auto-fix, auto-merge, scheduling, or production writes without a separately reviewed change to `loop-constraints.md`, a healthy doctor result, and explicit human approval.

## Verification

Code changes require the repository checks in `AGENTS.md`. A verifier rejects changes when tests are missing, scope is broader than the request, or a denylisted path is touched.

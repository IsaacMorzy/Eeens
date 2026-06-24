#!/usr/bin/env node
/**
 * audit:guard — build-pipeline recency guard for `prebuild`.
 *
 * Thin Node CLI wrapper that consumes the pure decision module at
 * `scripts/lib/audit-guard.mjs`. The lib IS the source of truth for
 * window resolution and the ok/fail decision; this file owns only
 * I/O (read .audit-cycle.json) and process side-effects (exit code).
 *
 * Window-0 semantics (honest, not aspirational): `--window 0` blocks
 * ONLY when the most recent run was red AND happened today (the
 * `daysSinceRun <= 0` comparison is true only for today). Anything
 * older than today passes. Documented in `--help` rather than
 * oversold.
 *
 * Companion: `audit-cycle.mjs` runs the gates and writes
 * `.audit-cycle.json`; this script reads it and exits 0 (build
 * allowed) or 1 (build blocked). Wired into `prebuild` (see
 * `package.json`).
 *
 * Exit-code contract: 0 = build may proceed, 1 = build blocked.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
	decideGuardAction,
	resolveWindow,
	DEFAULT_WINDOW_DAYS,
} from './lib/audit-guard.mjs';

const PROJECT_ROOT = process.cwd();
const COUNTER_PATH = join(PROJECT_ROOT, '.audit-cycle.json');

function readCounter() {
	try {
		return JSON.parse(readFileSync(COUNTER_PATH, 'utf8'));
	} catch (err) {
		// ENOENT (first ever run) → fall back to empty-counter shape so
		// first-ever CI runs are not blocked by an undefined counter.
		if (err?.code !== 'ENOENT') {
			console.warn(
				`audit:guard WARN — cannot read ${COUNTER_PATH}: ${err?.message ?? err}. Falling back to empty counter.`,
			);
		}
		return { totalAttempts: 0, successfulCycles: 0, lastRunAt: null, lastResult: null };
	}
}

function reportBadInput(scope, message) {
	console.error(`audit:guard FAIL — ${message}`);
	console.error(
		scope === 'cli'
			? 'Usage: --window N (N = block if red within last N days; 0 = today only).'
			: 'Set AUDIT_RECENCY_DAYS to a non-negative integer.',
	);
}

function main(args, envValue, exitFn) {
	const resolution = resolveWindow(args, envValue, DEFAULT_WINDOW_DAYS);
	if (!resolution.ok) {
		const scope = args.findIndex((a) => a === '--window' || a.startsWith('--window=')) !== -1 ? 'cli' : 'env';
		const label = scope === 'cli' ? '--window' : 'AUDIT_RECENCY_DAYS';
		const message = resolution.message.startsWith('unset') ? `${label} is empty/unset.` : resolution.message;
		reportBadInput(scope, message);
		exitFn(1);
		return;
	}
	const counter = readCounter();
	const decision = decideGuardAction(counter, resolution.value);
	if (decision.kind === 'pass') {
		console.log(decision.message);
		exitFn(0);
		return;
	}
	console.error(decision.message);
	exitFn(1);
}

const args = process.argv.slice(2);
const flag = args[0];
if (flag === '--help' || flag === '-h') {
	console.log('audit:guard — build-pipeline recency guard');
	console.log('');
	console.log('Usage:');
	console.log('  node scripts/audit-guard.mjs                       # default 7-day window');
	console.log('  AUDIT_RECENCY_DAYS=14 node scripts/audit-guard.mjs # env override');
	console.log('  node scripts/audit-guard.mjs --window 0             # block only if red today');
	console.log('  node scripts/audit-guard.mjs --window 30            # 30-day window');
	console.log('  node scripts/audit-guard.mjs --help                 # this help');
	console.log('');
	console.log('Exit 0: build may proceed.  Exit 1: build blocked.');
	console.log('');
	console.log('Companion: pnpm run audit:cycle --status  # also writes .audit-feed.json');
	process.exit(0);
}
// Runtime consumes only `decideGuardAction` + `resolveWindow` (and the
// `DEFAULT_WINDOW_DAYS` fallback). `validateWindow` is exercised
// recursively inside `resolveWindow` from the lib; no direct call
// here keeps the CLI surface lean and aligned with the public API.
main(args, process.env.AUDIT_RECENCY_DAYS, (code) => process.exit(code));

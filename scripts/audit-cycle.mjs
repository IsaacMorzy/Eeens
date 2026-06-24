#!/usr/bin/env node
/**
 * audit:cycle — periodic validate-gate wrapper with a cadence counter.
 *
 * Runs the project's three gates (lint:wrappers, astro check, vitest)
 * in the same order as `pnpm run verify`, then bumps a counter in
 * `.audit-cycle.json` so the repo can see how many audit cycles have
 * shipped this chapter without grepping plan.md or git log.
 *
 * Why a thin wrapper. `pnpm run verify` already covers the gates but
 * returns no signal of cadence or last-success. Tracking the count
 * in `.audit-cycle.json` makes it visible on a single
 * `cat .audit-cycle.json`, on any "what's the audit cadence this
 * quarter?" dashboard, and on the operator's daily run-down.
 *
 * The `.audit-map.json` manifest lists the per-phase audits (33, 34,
 * 35, …) with status, so `--status` can print a one-line summary of
 * recent shipped phases without forcing the operator to grep plan.md.
 * The map is hand-curated by the operator when a phase ships; the
 * counter is machine-managed when the gate runs.
 *
 * Wired in four places:
 *   1. `audit:cycle` npm script in package.json — `pnpm run audit:cycle`.
 *   2. `--status` flag for cadence-only readout (no gate runs, and
 *      now also writes `.audit-feed.json` for dashboards).
 *   3. `--help` flag for usage text.
 *   4. Companion script `scripts/audit-guard.mjs` (Phase 37) owns
 *      the build-pipeline recency guard that previously lived in
 *      `checkRecent()`. Splitting keeps each script single-purpose:
 *      cycle runs gates, guard decides whether a build may start.
 *
 * Exit-code contract: 0 = gate all-green + counter bumped, non-zero if
 * any gate failed.
 *
 * Robustness posture: a one-byte local mis-edit must NOT brick the
 * dev loop. `readJson` catches both ENOENT (first run) and SyntaxError
 * (manually-mangled manifest) and falls back to the initial shape, so
 * a broken `.audit-map.json` falls back to an empty audits list
 * rather than exit 1.
 *
 * Counter semantics: both `totalAttempts` AND `successfulCycles` are
 * bumped on green runs; only `totalAttempts` is bumped on red. This
 * way a `--status` readout gives the operator both the head-count and
 * the success ratio at a glance.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

const PROJECT_ROOT = process.cwd();
const COUNTER_PATH = join(PROJECT_ROOT, '.audit-cycle.json');
const MAP_PATH = join(PROJECT_ROOT, '.audit-map.json');
const FEED_PATH = join(PROJECT_ROOT, '.audit-feed.json');

function readJson(path, fallback) {
	try {
		return JSON.parse(readFileSync(path, 'utf8'));
	} catch {
		return fallback;
	}
}

function writeJson(path, data) {
	writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
}

function printStatus() {
	const counter = readJson(COUNTER_PATH, {
		totalAttempts: 0,
		successfulCycles: 0,
		lastRunAt: null,
		lastResult: null,
	});
	const map = readJson(MAP_PATH, { audits: [] });
	console.log('audit:cycle status');
	console.log(`  totalAttempts:    ${counter.totalAttempts}`);
	console.log(`  successfulCycles: ${counter.successfulCycles}`);
	console.log(`  lastRunAt:        ${counter.lastRunAt ?? '(never)'}`);
	console.log(`  lastResult:       ${counter.lastResult ?? '(none)'}`);
	console.log('');
	console.log(`  audits (${map.audits.length}):`);
	const tail = map.audits.slice(-5);
	for (const a of tail) {
		console.log(`    [${a.status}] Phase ${a.phase} — ${a.summary} (${a.shippedAt})`);
	}
	if (map.audits.length > tail.length) {
		console.log(`    … +${map.audits.length - tail.length} earlier`);
	}
	// Phase 37: write a flat dashboard feed so non-developer surfaces
	// (operator's daily rundown, CI summary) can read state without
	// parsing console output. Best-effort: a write failure here must
	// not mask the gate result. Wrapped in try/catch with a warn-and-
	// continue posture so `cycle()` green exits are not flipped to
	// red by a transient filesystem error.
	writeFeed(counter, map);
}

function writeFeed(counter, map) {
	const feed = {
		generatedAt: new Date().toISOString(),
		counter: {
			totalAttempts: counter.totalAttempts ?? 0,
			successfulCycles: counter.successfulCycles ?? 0,
			lastRunAt: counter.lastRunAt ?? null,
			lastResult: counter.lastResult ?? null,
		},
		recentAudits: (map.audits ?? []).slice(-5),
		auditCount: (map.audits ?? []).length,
	};
	// Best-effort: feed is observability, not a gate. A write failure
	// here (read-only filesystem, perm denied, EROFS) warns and
	// continues. The gate exit code is the source of truth.
	try {
		writeJson(FEED_PATH, feed);
	} catch (err) {
		console.warn(
			`audit:cycle WARN — .audit-feed.json write failed: ${err?.message ?? err}. Continuing; gate result is authoritative.`,
		);
	}
}

function runGate(label, cmd) {
	console.log(`\n=== ${label} ===`);
	const result = spawnSync('pnpm', cmd.split(' '), {
		stdio: 'inherit',
		cwd: PROJECT_ROOT,
	});
	return result.status === 0;
}

// Build-pipeline recency guard is now owned by
// `scripts/audit-guard.mjs` (Phase 37 split). This script runs
// gates and bumps the cadence counter; the guard script decides
// whether a build may start based on those gates' output.

function cycle() {
	console.log('audit:cycle starting');
	const steps = [
		['lint:wrappers', 'run lint:wrappers'],
		['astro check', 'exec astro check'],
		['vitest', 'test'],
	];
	let allGreen = true;
	for (const [label, cmd] of steps) {
		const ok = runGate(label, cmd);
		if (!ok) {
			allGreen = false;
			console.error(`audit:cycle: ${label} FAILED`);
			break;
		}
	}
	const counter = readJson(COUNTER_PATH, {
		totalAttempts: 0,
		successfulCycles: 0,
		lastRunAt: null,
		lastResult: null,
	});
	counter.totalAttempts += 1;
	if (allGreen) counter.successfulCycles += 1;
	counter.lastRunAt = new Date().toISOString().slice(0, 10);
	counter.lastResult = allGreen ? 'green' : 'red';
	writeJson(COUNTER_PATH, counter);
	console.log('');
	console.log(
		`audit:cycle: ${allGreen ? 'GREEN ✓' : 'RED ✗'} — attempt #${counter.totalAttempts} (successful #${counter.successfulCycles}) recorded.`,
	);
	printStatus();
	process.exit(allGreen ? 0 : 1);
}

const flag = process.argv[2];
if (flag === '--status' || flag === '-s') {
	printStatus();
	process.exit(0);
}
if (flag === '--help' || flag === '-h') {
	console.log('audit:cycle — periodic validate-gate wrapper with cadence counter');
	console.log('');
	console.log('Usage:');
	console.log('  pnpm run audit:cycle              # run gate + bump counter');
	console.log('  pnpm run audit:cycle --status     # print cadence + recent audits + write .audit-feed.json');
	console.log('  pnpm run audit:cycle --help       # this help');
	console.log('');
	console.log('Companion script (Phase 37 split):');
	console.log('  node scripts/audit-guard.mjs           # prebuild recency guard (default 7d window)');
	console.log('  AUDIT_RECENCY_DAYS=14 audit-guard.mjs  # env override');
	console.log('');
	console.log('Note: --status regenerates .audit-feed.json (best-effort; see .gitignore).');
	process.exit(0);
}
cycle();

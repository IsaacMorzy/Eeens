#!/usr/bin/env node
/**
 * ci:vercel — run the EXACT build chain from vercel.json locally.
 *
 * Mirrors `vercel.json`'s `buildCommand` so pre-flight failures can
 * be caught on the dev box before consuming Vercel build minutes.
 * Expects to be slow / OOM-prone on the dev machine — this is
 * parity verification, not a daily driver. Use `pnpm run verify` for
 * the cheap pre-push gate; use `pnpm run ci:vercel` when changing
 * anything in the build pipeline, schema, or env-var contracts.
 *
 * Steps in order (matches `vercel.json` byte-for-byte):
 *   1. NODE_OPTIONS=--max-old-space-size=6144
 *   2. node scripts/smoke-env.mjs        (exits 1 if env preflight fails)
 *   3. pnpm audit --prod --audit-level=critical
 *   4. pnpm build:local                  (Astro is Tina's child here)
 *   5. pnpm build:search                 (non-fatal, like vercel.json)
 */

import { spawnSync } from 'node:child_process';

process.env.NODE_OPTIONS ??= '--max-old-space-size=6144';

function step(label, cmd, args, { continueOnError = false } = {}) {
	console.log(`\n[ci:vercel] ${label}: ${cmd} ${args.join(' ')}`);
	const result = spawnSync(cmd, args, { stdio: 'inherit', env: process.env });
	if (result.status !== 0 && !continueOnError) {
		console.error(`[ci:vercel] FAIL at "${label}" (exit ${result.status})`);
		process.exit(result.status ?? 1);
	}
	if (result.status !== 0) {
		console.warn(`[ci:vercel] WARN at "${label}" (exit ${result.status}, continuing)`);
	}
}

step('smoke-env', 'node', ['scripts/smoke-env.mjs']);
step('audit', 'pnpm', ['audit', '--prod', '--audit-level=critical']);
step('build:local', 'pnpm', ['build:local']);
step('build:search', 'pnpm', ['build:search'], { continueOnError: true });

console.log('\n[ci:vercel] ✓ matched vercel.json buildCommand shape');

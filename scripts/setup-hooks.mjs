#!/usr/bin/env node
/**
 * install:hooks — install the local pre-push git hook so pushes run
 * `pnpm run verify` (astro check + lint:wrappers + vitest) before
 * sending code to Vercel.
 *
 * Why this hook. Phase 28's deploy-debug trail (6 failed Vercel
 * pushes in a row to ship the build pipeline refactor) was driven
 * by errors at multiple steps that a fast local gate would have
 * caught on the dev machine: import-shape regressions, missing
 * helper directories, double-prefixed icon names. This hook throws
 * those classes of failure at the dev box first.
 *
 * Idempotent. If `.git/hooks/pre-push` already exists AND is owned
 * by this script (it includes the marker line below), the install
 * is treated as up-to-date. If a DIFFERENT pre-push hook is
 * present, refuses to clobber it unless `--force` is passed.
 *
 * Run once after each fresh clone: `pnpm run install:hooks`.
 * Optional `git config core.hooksPath .githooks` would let the
 * hook live in the tracked tree instead — not adopted here to keep
 * the change non-invasive.
 */

import { chmodSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const HOOK_PATH = resolve(process.cwd(), '.git/hooks/pre-push');
const FORCE = process.argv.includes('--force');
const MARKER = '# eensbpark:pre-push:install:hooks';

const HOOK_CONTENT = `#!/usr/bin/env bash
${MARKER}
# Pre-push guard for eensbpark — installed by scripts/setup-hooks.mjs.
# Runs the local verify chain (astro check + lint:wrappers +
# vitest) before allowing the push to reach Vercel.
set -e
cd "\\$(git rev-parse --show-toplevel)"
echo '[pre-push] pnpm run verify'
pnpm run verify
`;

if (existsSync(HOOK_PATH)) {
	const existing = readFileSync(HOOK_PATH, 'utf8');
	if (existing.includes(MARKER)) {
		console.log('install:hooks: pre-push hook already installed ✓');
		process.exit(0);
	}
	if (!FORCE) {
		console.error('install:hooks: a different pre-push hook already exists.');
		console.error('Re-run with --force to replace it, or wire `pnpm run verify`');
		console.error('into the existing hook manually.');
		process.exit(1);
	}
	console.error('install:hooks: --force: replacing existing pre-push hook.');
}

writeFileSync(HOOK_PATH, HOOK_CONTENT);
chmodSync(HOOK_PATH, 0o755);
console.log(`install:hooks: pre-push hook installed at ${HOOK_PATH}`);
console.log('Run `pnpm run install:hooks` once after each fresh clone.');

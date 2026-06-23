#!/usr/bin/env node
/**
 * lint:wrappers — fail if any source file imports the `astro-icon`
 * primitive directly outside the project's local wrapper
 * (`src/components/ui/Icon.astro`).
 *
 * Background. The local wrapper at `src/components/ui/Icon.astro` is
 * the single source of truth for icon resolution: it auto-prepends
 * the `tabler:` icon-set prefix to bare names like `"calendar"` and
 * delegates to `astro-icon/components`. Direct imports from
 * `astro-icon/components` bypass the wrapper and reproduce the
 * double-prefix bug in two failure modes:
 *
 *   1. The caller passes `name="tabler:sun"` (already prefixed) to
 *      the wrapper → wrapper outputs `tabler:tabler:sun`.
 *   2. The caller passes `name="sun"` directly to
 *      `astro-icon/components` without the wrapper-provided `tabler:`
 *      prefix → astro-icon falls through to whatever set happens to
 *      match if any, otherwise 404s at prerender time.
 *
 * Phase 28b-5 traced one such bug to `Footer.astro`'s direct
 * `astro-icon/components` import plus a bare `name="calendar"`. The
 * build failed with `Unable to locate "tabler:tabler:calendar" icon!`
 * at the `/properties/*` prerender step. This guard prevents the
 * same footgun in any new file or any future refactor that reverts a
 * wrapper to a direct import.
 *
 * Run via `pnpm run lint:wrappers` (also wired into `pnpm run verify`
 * for pre-push; CI surface is `pnpm run verify`).
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, relative, resolve } from 'node:path';

const PROJECT_ROOT = process.cwd();
const SRC_ROOT = join(PROJECT_ROOT, 'src');
// The ONLY file allowed to import directly from `astro-icon/components`.
// Every other Icon import must go through this wrapper.
const WRAPPER_PATH = resolve(SRC_ROOT, 'components/ui/Icon.astro');

const EXTENSIONS = new Set(['.astro', '.ts', '.tsx', '.mjs', '.cjs', '.jsx']);
const IMPORT_PATTERNS = [
	/from\s+['"]astro-icon\/components['"]/g,
	/from\s+['"]astro-icon['"]/g,
];

const violations = [];

function walk(dir) {
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry);
		const stat = statSync(full);
		if (stat.isDirectory()) walk(full);
		else if (EXTENSIONS.has(extname(full))) inspect(full);
	}
}

function inspect(file) {
	if (resolve(file) === WRAPPER_PATH) return;
	const text = readFileSync(file, 'utf8');
	const lines = text.split('\n');
	for (let i = 0; i < lines.length; i++) {
		for (const pattern of IMPORT_PATTERNS) {
			pattern.lastIndex = 0;
			if (pattern.test(lines[i])) {
				violations.push({
					file: relative(PROJECT_ROOT, file),
					line: i + 1,
					text: lines[i].trim(),
				});
			}
		}
	}
}

walk(SRC_ROOT);

if (violations.length === 0) {
	console.log(`lint:wrappers: no direct \`astro-icon\` imports outside ${relative(PROJECT_ROOT, WRAPPER_PATH)} ✓`);
	process.exit(0);
}

console.error(`lint:wrappers: FAIL`);
console.error(`Direct imports of \`astro-icon\` outside the local wrapper (${relative(PROJECT_ROOT, WRAPPER_PATH)}):`);
for (const v of violations) {
	console.error(`  ${v.file}:${v.line}: ${v.text}`);
}
console.error('');
console.error('Fix: change the import to `import Icon from \'./path/to/Icon.astro\'`');
console.error('     (or the equivalent path) and pass a bare name without the `tabler:` prefix.');
console.error('     The local wrapper handles the `tabler:` prefix automatically.');
process.exit(1);

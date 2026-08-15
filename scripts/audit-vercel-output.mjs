#!/usr/bin/env node
import fs from 'node:fs';

const astroConfig = fs.readFileSync(new URL('../astro.config.mjs', import.meta.url), 'utf8');
const vercelConfig = JSON.parse(
	fs.readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'),
);

const checks = [
	[
		'astro config detects Vercel builds',
		/process\.env\.VERCEL(?:\s*===\s*['"]1['"]|_ENV)/.test(astroConfig),
	],
	[
		'Vercel builds use a repository-local dist output',
		/outDir:\s*outputDirectory/.test(astroConfig) && /['"]\.\/dist\/?['"]/.test(astroConfig),
	],
	[
		'local builds preserve the Frappe output path',
		/\.\.\/eens_app\/public\/astro_pages/.test(astroConfig),
	],
	['Vercel declares dist as its output directory', vercelConfig.outputDirectory === 'dist'],
];

const failures = checks.filter(([, passed]) => !passed).map(([label]) => label);
if (failures.length > 0) {
	console.error('vercel-output-audit: FAIL');
	for (const failure of failures) console.error(`  - ${failure}`);
	process.exit(1);
}

console.log('vercel-output-audit: Vercel uses local dist; Frappe keeps its local output ✓');

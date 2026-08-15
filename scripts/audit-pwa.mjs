#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const manifestPath = join(root, 'public/manifest.webmanifest');
const serviceWorkerPath = join(root, 'public/sw.js');
const failures = [];

const read = (path) => {
	if (!existsSync(path)) {
		failures.push(`missing ${path.replace(`${root}/`, '')}`);
		return '';
	}
	return readFileSync(path, 'utf8');
};

const manifestSource = read(manifestPath);
const serviceWorkerSource = read(serviceWorkerPath);
let manifest = null;
try {
	manifest = JSON.parse(manifestSource);
} catch {
	failures.push('manifest.webmanifest is not valid JSON');
}

if (manifest) {
	for (const key of ['name', 'short_name', 'start_url', 'scope', 'display', 'icons', 'shortcuts']) {
		if (!(key in manifest)) failures.push(`manifest is missing ${key}`);
	}
	if (manifest.start_url !== '/' || manifest.scope !== '/') failures.push('manifest start_url and scope must remain /');
	for (const icon of manifest.icons ?? []) {
		if (!icon.src || !existsSync(join(root, 'public', icon.src.replace(/^\//, '')))) failures.push(`manifest icon does not exist: ${icon.src}`);
	}
	const shortcutRoutes = new Set((manifest.shortcuts ?? []).map((shortcut) => shortcut.url));
	for (const route of ['/shops', '/warehouses', '/business-parks/eens', '/contact']) {
		if (!shortcutRoutes.has(route)) failures.push(`manifest shortcut is missing ${route}`);
	}
}

for (const invariant of [
	"const CACHE_NAME = 'eens-pwa-",
	'request.method !== \'GET\'',
	"url.pathname === '/admin'",
	"url.pathname.startsWith('/api/')",
	"url.pathname.startsWith('/.tina/')",
	"request.mode === 'navigate'",
	'OFFLINE_HTML',
]) {
	if (!serviceWorkerSource.includes(invariant)) failures.push(`service worker is missing invariant: ${invariant}`);
}

if (failures.length > 0) {
	console.error('audit:pwa: FAIL');
	for (const failure of failures) console.error(`  - ${failure}`);
	process.exit(1);
}

console.log(`audit:pwa: manifest, ${manifest.shortcuts.length} shortcuts, icons, cache versioning, exclusions, navigation strategy, and offline fallback are valid ✓`);

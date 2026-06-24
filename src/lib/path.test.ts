import { describe, it, expect } from 'vitest';
import { isCurrentPath } from './path';

describe('isCurrentPath', () => {
	// Root `/` is exact-match only. The startsWith fallback that would otherwise
	// match every pathname (because every pathname starts with `/`) must NOT
	// fire on `href === '/'`. This case is the canonical footgun that
	// motivated pulling `isCurrentPath` into a shared helper in Phase 30.1.

	it('returns true when both pathname and href are exactly `/`', () => {
		expect(isCurrentPath('/', '/')).toBe(true);
	});

	it('returns false when pathname is non-root against the root href', () => {
		expect(isCurrentPath('/properties', '/')).toBe(false);
	});

	it('returns false when pathname is a deep descendant against the root href', () => {
		expect(isCurrentPath('/blog/mombasa-road-corridor', '/')).toBe(false);
	});

	it('returns false when pathname is a non-descendant route against the root', () => {
		expect(isCurrentPath('/about', '/')).toBe(false);
	});

	// Non-root href matches when pathname === href OR pathname starts with
	// `href + '/'`. The second clause is what makes
	// `/properties/mlolongo-warehouse` highlight the `/properties` nav link.

	it('returns true on exact match for /properties', () => {
		expect(isCurrentPath('/properties', '/properties')).toBe(true);
	});

	it('returns true on exact match for /blog', () => {
		expect(isCurrentPath('/blog', '/blog')).toBe(true);
	});

	it('returns true on exact match for /about', () => {
		expect(isCurrentPath('/about', '/about')).toBe(true);
	});

	it('returns true when pathname is a sub-path of /properties', () => {
		expect(isCurrentPath('/properties/mlolongo-warehouse', '/properties')).toBe(true);
	});

	it('returns true when pathname is a sub-path of /blog', () => {
		expect(isCurrentPath('/blog/mombasa-road-corridor', '/blog')).toBe(true);
	});

	// Trailing-slash trap: a href like `/properties/` would, if the function
	// compared literally, never match anything (no pathname starts with the
	// double slash). But our implementation's startsWith uses `href + '/'`,
	// so a `/properties/` href would compound to `/properties//` — false.
	// Locks down the canonical shape of the prefix clause.

	it('returns false when href carries a trailing slash', () => {
		expect(isCurrentPath('/properties/mlolongo-warehouse', '/properties/')).toBe(false);
	});

	// Negative guards.

	it('returns false when pathname is not under the href', () => {
		expect(isCurrentPath('/contact', '/properties')).toBe(false);
	});

	it('returns false when two distinct sections share a prefix', () => {
		expect(isCurrentPath('/properties', '/blog')).toBe(false);
	});

	// Strict prefix guard: `/propertysomething` is NOT under `/properties`
	// (no slash boundary). Catches the bug where `pathname.startsWith(href)`
	// (without the trailing `/`) would falsely match.

	it('returns false when pathname shares a prefix without a slash boundary', () => {
		expect(isCurrentPath('/propertysomething', '/properties')).toBe(false);
	});

	// Defensive empty-href guard. An empty href would otherwise drive into
	// `pathname.startsWith('')` which returns true for every string.

	it('returns false when href is empty against root pathname', () => {
		expect(isCurrentPath('/', '')).toBe(false);
	});

	it('returns false when href is empty against sub-path pathname', () => {
		expect(isCurrentPath('/properties', '')).toBe(false);
	});
});

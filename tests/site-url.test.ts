import { describe, expect, it } from 'vitest';
import { resolveSiteUrl } from '../scripts/site-url.mjs';

describe('resolveSiteUrl', () => {
	it('uses a localhost origin for development when SITE_URL is absent', () => {
		expect(resolveSiteUrl(undefined, false)).toBe('http://localhost:4321');
	});

	it('rejects a missing SITE_URL in production', () => {
		expect(() => resolveSiteUrl(undefined, true)).toThrow(
			'SITE_URL is required for production builds',
		);
	});

	it('accepts the Eens production Funnel origin', () => {
		expect(resolveSiteUrl('https://vmi3416692.tailc65d30.ts.net:10000', true)).toBe(
			'https://vmi3416692.tailc65d30.ts.net:10000',
		);
	});

	it('accepts a different product origin on another Funnel port', () => {
		expect(resolveSiteUrl('https://product-b.tailc65d30.ts.net:8443', true)).toBe(
			'https://product-b.tailc65d30.ts.net:8443',
		);
	});

	it('rejects non-HTTPS production origins', () => {
		expect(() => resolveSiteUrl('http://product-b.tailc65d30.ts.net:8443', true)).toThrow(
			'SITE_URL must use HTTPS in production',
		);
	});

	it('rejects URLs with a path, query, or fragment', () => {
		expect(() => resolveSiteUrl('https://product-b.tailc65d30.ts.net:8443/site', true)).toThrow(
			'SITE_URL must be an origin without a path, query, or fragment',
		);
	});
});

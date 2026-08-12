import { describe, expect, it } from 'vitest';
import { stableStringify } from './cache-key';

describe('stableStringify', () => {
	it('sorts object keys so equivalent data has one cache key', () => {
		expect(stableStringify({ b: 2, a: 1 })).toBe(stableStringify({ a: 1, b: 2 }));
	});

	it('preserves array order and nested values', () => {
		expect(stableStringify({ items: [{ id: 1 }, { id: 2 }] })).toBe(
			'{"items":[{"id":1},{"id":2}]}',
		);
	});
});

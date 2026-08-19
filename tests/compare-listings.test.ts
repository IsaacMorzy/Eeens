import { describe, expect, it } from 'vitest';
import { COMPARE_MAX, toggleInCompare } from '../src/lib/compare-listings';

describe('toggleInCompare', () => {
	it('adds a href and preserves insertion order', () => {
		const result = toggleInCompare(new Set(), '/warehouses/a');
		expect([...result]).toEqual(['/warehouses/a']);
	});

	it('removes a href that is already present', () => {
		const result = toggleInCompare(new Set(['/warehouses/a', '/godowns/b']), '/warehouses/a');
		expect([...result]).toEqual(['/godowns/b']);
	});

	it('caps the set at COMPARE_MAX and drops the newest overflow', () => {
		let result = new Set<string>(['/a', '/b', '/c']);
		result = toggleInCompare(result, '/d');
		expect(result.size).toBe(COMPARE_MAX);
		expect(result.has('/d')).toBe(false);
	});

	it('does not mutate the input set', () => {
		const input = new Set(['/a']);
		toggleInCompare(input, '/b');
		expect([...input]).toEqual(['/a']);
	});
});

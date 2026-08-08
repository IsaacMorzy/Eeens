import { describe, expect, it } from 'vitest';
import { paginate, pageHref, parsePage } from './pagination';

describe('parsePage', () => {
	it('normalizes missing and invalid pages to one', () => {
		expect(parsePage(null)).toBe(1);
		expect(parsePage('')).toBe(1);
		expect(parsePage('nope')).toBe(1);
		expect(parsePage('0')).toBe(1);
	});

	it('parses a positive page', () => {
		expect(parsePage('3')).toBe(3);
	});
});

describe('paginate', () => {
	it('slices the requested page and exposes display bounds', () => {
		const result = paginate(['a', 'b', 'c', 'd', 'e'], 2, 2);
		expect(result.items).toEqual(['c', 'd']);
		expect(result.meta).toEqual({
			page: 2,
			pageSize: 2,
			totalItems: 5,
			totalPages: 3,
			from: 3,
			to: 4,
		});
	});

	it('clamps pages beyond the end and handles empty lists', () => {
		expect(paginate(['a'], 8, 2).meta.page).toBe(1);
		expect(paginate([], 8, 2).meta).toMatchObject({
			page: 1,
			totalItems: 0,
			totalPages: 1,
			from: 0,
			to: 0,
		});
	});
});

describe('pageHref', () => {
	it('preserves filters and omits the first-page parameter', () => {
		expect(pageHref('/properties', { minSqft: '9000', minKva: null, zone: 'Mlolongo' }, 1)).toBe(
			'/properties?minSqft=9000&zone=Mlolongo',
		);
		expect(pageHref('/properties', { minSqft: '9000', minKva: null, zone: 'Mlolongo' }, 2)).toBe(
			'/properties?minSqft=9000&zone=Mlolongo&page=2',
		);
	});
});

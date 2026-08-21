import { describe, it, expect } from 'vitest';
import {
	TYPE_ORDER,
	TYPE_LABEL,
	SQFT_TIERS,
	KVA_TIERS,
	firstInteger,
	parseSqft,
	parseKva,
	applyFilters,
	groupByType,
	zonesInUse,
	linkWith,
	parseDirectoryFilters,
	activeFilterCount,
	parseSortKey,
	applySort,
	getIllustrationSrc,
	parseListingSearchFilters,
	matchesListingSearch,
	type PropertyFilters,
} from '../src/lib/property-filters';
import type { PropertyNode } from '../src/lib/data';

const property = (over: Partial<PropertyNode>): PropertyNode => ({ ...over });

describe('parseSqft', () => {
	it('returns 0 for empty / null / undefined', () => {
		expect(parseSqft(null)).toBe(0);
		expect(parseSqft(undefined)).toBe(0);
		expect(parseSqft('')).toBe(0);
	});

	it('parses a bare integer string', () => {
		expect(parseSqft('1200')).toBe(1200);
	});

	it('parses a thousands-separated number with unit suffix', () => {
		expect(parseSqft('9,000 sq ft')).toBe(9000);
	});

	it('parses the integer when mixed with decimals', () => {
		expect(parseSqft('1234.56 sqm')).toBe(1234);
	});

	it('returns 0 when no digits are present', () => {
		expect(parseSqft('—')).toBe(0);
	});
});

describe('parseKva', () => {
	it('returns 0 when property is null', () => {
		expect(parseKva(null)).toBe(0);
	});

	it('returns 0 when specSheet.power is null', () => {
		expect(parseKva(property({}))).toBe(0);
		expect(parseKva(property({ specSheet: null }))).toBe(0);
		expect(parseKva(property({ specSheet: { power: null } }))).toBe(0);
	});

	it('parses the integer from a power annotation', () => {
		expect(parseKva(property({ specSheet: { power: '450 kVA' } }))).toBe(450);
		expect(parseKva(property({ specSheet: { power: '1,200' } }))).toBe(1200);
	});
});

describe('TYPE_ORDER + TYPE_LABEL + tiers', () => {
	it('TYPE_ORDER puts shop units first and apartments last', () => {
		expect(TYPE_ORDER[0]).toBe('SHOP');
		expect(TYPE_ORDER[TYPE_ORDER.length - 1]).toBe('APARTMENT');
	});

	it('TYPE_LABEL has a render label for every TYPE_ORDER entry', () => {
		for (const t of TYPE_ORDER) {
			expect(TYPE_LABEL[t]).toBeTruthy();
		}
	});

	it('SQFT_TIERS ascend by powers of magnitude', () => {
		expect(SQFT_TIERS).toEqual([4000, 9000, 18000]);
	});

	it('KVA_TIERS ascend by orders of magnitude', () => {
		expect(KVA_TIERS).toEqual([50, 200]);
	});
});

describe('applyFilters', () => {
	const list: PropertyNode[] = [
		property({ sqft: '9,000 sq ft', specSheet: { power: '200 kVA' }, zone: 'Mlolongo', _sys: { filename: 'a' } }),
		property({ sqft: '4,500 sq ft', specSheet: { power: '50 kVA' }, zone: 'Syokimau', _sys: { filename: 'b' } }),
		property({ sqft: '18,500 sq ft', specSheet: { power: '450 kVA' }, zone: 'Baba Dogo', _sys: { filename: 'c' } }),
		property({ sqft: '110 sq m', zone: 'Thika', specSheet: null, _sys: { filename: 'd' } }),
	];

	it('returns all when no filter active', () => {
		const out = applyFilters(list, { minSqft: null, minKva: null, zone: null, availability: null });
		expect(out).toHaveLength(list.length);
	});

	it('filters by minSqft (preserves order)', () => {
		const out = applyFilters(list, { minSqft: 9000, minKva: null, zone: null, availability: null });
		expect(out.map((p) => p._sys?.filename)).toEqual(['a', 'c']);
	});

	it('filters by minKva', () => {
		const out = applyFilters(list, { minSqft: null, minKva: 200, zone: null, availability: null });
		expect(out.map((p) => p._sys?.filename)).toEqual(['a', 'c']);
	});

	it('filters by zone', () => {
		const out = applyFilters(list, { minSqft: null, minKva: null, zone: 'Mlolongo', availability: null });
		expect(out.map((p) => p._sys?.filename)).toEqual(['a']);
	});

	it('composes all three filters (AND)', () => {
		const out = applyFilters(list, { minSqft: 9000, minKva: 200, zone: 'Mlolongo', availability: null });
		expect(out.map((p) => p._sys?.filename)).toEqual(['a']);
	});

	it('filters by availability (ForRent)', () => {
		const rentList: PropertyNode[] = [
			property({ sqft: '9,000 sq ft', availability: 'ForRent', _sys: { filename: 'r1' } }),
			property({ sqft: '9,000 sq ft', availability: 'ForSale', _sys: { filename: 'r2' } }),
			property({ sqft: '9,000 sq ft', availability: null, _sys: { filename: 'r3' } }),
		];
		const out = applyFilters(rentList, { minSqft: null, minKva: null, zone: null, availability: 'ForRent' });
		expect(out.map((p) => p._sys?.filename)).toEqual(['r1']);
	});

	it('composes availability with zone (AND)', () => {
		const mixed: PropertyNode[] = [
			property({ zone: 'Mlolongo', availability: 'ForRent', _sys: { filename: 'm1' } }),
			property({ zone: 'Mlolongo', availability: 'ForSale', _sys: { filename: 'm2' } }),
			property({ zone: 'Thika', availability: 'ForRent', _sys: { filename: 'm3' } }),
		];
		const out = applyFilters(mixed, { minSqft: null, minKva: null, zone: 'Mlolongo', availability: 'ForRent' });
		expect(out.map((p) => p._sys?.filename)).toEqual(['m1']);
	});

	it('ignores a null availability filter', () => {
		const listWithNull: PropertyNode[] = [property({ availability: null, _sys: { filename: 'n1' } })];
		expect(applyFilters(listWithNull, { minSqft: null, minKva: null, zone: null, availability: null })).toHaveLength(1);
	});
});

describe('groupByType', () => {
	it('groups in stable TYPE_ORDER and drops empty groups', () => {
		const list: PropertyNode[] = [
			property({ type: 'WAREHOUSE', _sys: { filename: 'a' } }),
			property({ type: 'APARTMENT', _sys: { filename: 'b' } }),
			property({ type: 'WAREHOUSE', _sys: { filename: 'c' } }),
			property({ type: null, _sys: { filename: 'd' } }),
		];
		const groups = groupByType(list);
		expect(groups.map((g) => g.type)).toEqual(['WAREHOUSE', 'APARTMENT']);
		expect(groups[0].items).toHaveLength(2);
		expect(groups[1].items).toHaveLength(1);
	});

	it('returns an empty array when nothing matches a known TYPE_ORDER entry', () => {
		expect(groupByType([property({ type: 'UNUSED', _sys: { filename: 'x' } })])).toEqual([]);
	});
});

describe('zonesInUse', () => {
	it('returns sorted unique zones', () => {
		const list: PropertyNode[] = [
			property({ zone: 'Syokimau' }),
			property({ zone: 'Mlolongo' }),
			property({ zone: 'Mlolongo' }),
		];
		expect(zonesInUse(list)).toEqual(['Mlolongo', 'Syokimau']);
	});

	it('drops null zones', () => {
		const list: PropertyNode[] = [property({ zone: null }), property({ zone: 'Thika' })];
		expect(zonesInUse(list)).toEqual(['Thika']);
	});
});
describe('parseSortKey + applySort', () => {
	it('parseSortKey falls back to featured for null / unknown values', () => {
		expect(parseSortKey(null)).toBe('featured');
		expect(parseSortKey('bogus')).toBe('featured');
	});

	it('parseSortKey accepts known keys', () => {
		expect(parseSortKey('price-desc')).toBe('price-desc');
		expect(parseSortKey('price-asc')).toBe('price-asc');
		expect(parseSortKey('area-desc')).toBe('area-desc');
		expect(parseSortKey('newest')).toBe('newest');
	});

	it('featured keeps the source register order', () => {
		const list: PropertyNode[] = [
			property({ price: { ksh: '9,000 / yr' }, _sys: { filename: 'a' } }),
			property({ price: { ksh: '90,000,000' }, _sys: { filename: 'b' } }),
		];
		expect(applySort(list, 'featured').map((p) => p._sys?.filename)).toEqual(['a', 'b']);
	});

	it('sorts price-desc by the numeric total, ignoring separators and suffixes', () => {
		const list: PropertyNode[] = [
			property({ price: { ksh: '1,260,000 / yr' }, _sys: { filename: 'low' } }),
			property({ price: { ksh: '87,000,000' }, _sys: { filename: 'high' } }),
			property({ price: { ksh: '3,150,000 / yr' }, _sys: { filename: 'mid' } }),
		];
		expect(applySort(list, 'price-desc').map((p) => p._sys?.filename)).toEqual(['high', 'mid', 'low']);
	});

	it('sorts price-asc ascending', () => {
		const list: PropertyNode[] = [
			property({ price: { ksh: '87,000,000' }, _sys: { filename: 'high' } }),
			property({ price: { ksh: '1,260,000 / yr' }, _sys: { filename: 'low' } }),
		];
		expect(applySort(list, 'price-asc').map((p) => p._sys?.filename)).toEqual(['low', 'high']);
	});

	it('sorts area-desc by parsed square footage', () => {
		const list: PropertyNode[] = [
			property({ sqft: '4,000 sq ft', _sys: { filename: 'small' } }),
			property({ sqft: '18,000 sq ft', _sys: { filename: 'big' } }),
			property({ sqft: '9,000 sq ft', _sys: { filename: 'mid' } }),
		];
		expect(applySort(list, 'area-desc').map((p) => p._sys?.filename)).toEqual(['big', 'mid', 'small']);
	});

	it('sorts newest first by publishedDate, missing dates last', () => {
		const list: PropertyNode[] = [
			property({ publishedDate: null, _sys: { filename: 'none' } }),
			property({ publishedDate: '2026-01-01', _sys: { filename: 'old' } }),
			property({ publishedDate: '2026-08-01', _sys: { filename: 'new' } }),
		];
		expect(applySort(list, 'newest').map((p) => p._sys?.filename)).toEqual(['new', 'old', 'none']);
	});

	it('ties fall back to the stable register order', () => {
		const list: PropertyNode[] = [
			property({ price: { ksh: '5,000,000' }, _sys: { filename: 'x' } }),
			property({ price: { ksh: '5,000,000' }, _sys: { filename: 'y' } }),
		];
		expect(applySort(list, 'price-asc').map((p) => p._sys?.filename)).toEqual(['x', 'y']);
	});
});

describe('parseDirectoryFilters', () => {
	it('accepts supported zone and tier values', () => {
		expect(parseDirectoryFilters(new URLSearchParams('zone=Syokimau&minSqft=9000&minKva=200'), ['Mlolongo', 'Syokimau'])).toEqual({
			zone: 'Syokimau',
			minSqft: 9000,
			minKva: 200,
			availability: null,
		});
	});

	it('ignores unknown zones and unsupported numeric values', () => {
		expect(parseDirectoryFilters(new URLSearchParams('zone=Unknown&minSqft=1234&minKva=-2'), ['Mlolongo'])).toEqual({
			zone: null,
			minSqft: null,
			minKva: null,
			availability: null,
		});
	});

	it('parses a supported availability value', () => {
		expect(parseDirectoryFilters(new URLSearchParams('availability=ForSale'), ['Mlolongo'])).toEqual({
			zone: null,
			minSqft: null,
			minKva: null,
			availability: 'ForSale',
		});
	});

	it('ignores an unsupported availability value', () => {
		expect(parseDirectoryFilters(new URLSearchParams('availability=ForLease'), ['Mlolongo'])).toEqual({
			zone: null,
			minSqft: null,
			minKva: null,
			availability: null,
		});
	});
});

describe('activeFilterCount', () => {
	it('counts only active filter values', () => {
		expect(activeFilterCount({ zone: 'Mlolongo', minSqft: 9000, minKva: null, availability: null })).toBe(2);
		expect(activeFilterCount({ zone: null, minSqft: null, minKva: null, availability: null })).toBe(0);
		expect(activeFilterCount({ zone: null, minSqft: null, minKva: null, availability: 'Upcoming' })).toBe(1);
	});
});

describe('linkWith (chip URL composer)', () => {
	const base: PropertyFilters = { minSqft: 9000, minKva: null, zone: 'Mlolongo', availability: null };

	it('preserves sibling params when overriding one to null (delete)', () => {
		expect(linkWith(base, { minSqft: null })).toBe('/warehouses?zone=Mlolongo');
	});

	it('preserves sibling params when overriding to a new value', () => {
		expect(linkWith(base, { zone: 'Thika' })).toBe('/warehouses?minSqft=9000&zone=Thika');
	});

	it('returns the bare category path when all filters are cleared', () => {
		expect(linkWith({ minSqft: null, minKva: null, zone: null, availability: null }, {})).toBe('/warehouses');
	});

	it('adds a new param without dropping siblings', () => {
		expect(linkWith(base, { minKva: '200' })).toBe(
			'/warehouses?minSqft=9000&zone=Mlolongo&minKva=200',
		);
	});

	it('preserves an active availability param', () => {
		const withAvail: PropertyFilters = { minSqft: null, minKva: null, zone: 'Thika', availability: 'ForSale' };
		expect(linkWith(withAvail, {})).toBe('/warehouses?zone=Thika&availability=ForSale');
	});

	it('deletes an availability param when overridden to null', () => {
		const withAvail: PropertyFilters = { minSqft: null, minKva: null, zone: 'Thika', availability: 'ForSale' };
		expect(linkWith(withAvail, { availability: null })).toBe('/warehouses?zone=Thika');
	});
});

describe('firstInteger', () => {
	it('returns 0 for null / undefined / empty / no-digit inputs', () => {
		expect(firstInteger(null)).toBe(0);
		expect(firstInteger(undefined)).toBe(0);
		expect(firstInteger('')).toBe(0);
		expect(firstInteger('—')).toBe(0);
	});

	it('parses a bare integer string', () => {
		expect(firstInteger('1200')).toBe(1200);
	});

	it('strips thousands separators (single and chain)', () => {
		expect(firstInteger('1,200')).toBe(1200);
		expect(firstInteger('9,000,000')).toBe(9000000);
	});

	it('returns the first integer run when mixed with units', () => {
		expect(firstInteger('450 kVA')).toBe(450);
		expect(firstInteger('1234.56 sqm')).toBe(1234);
	});
});

describe('homepage listing search', () => {
	const zones = ['Mlolongo', 'Syokimau', 'Thika'];

	it('parses known type, zone, and availability values', () => {
		expect(parseListingSearchFilters(new URLSearchParams('type=WAREHOUSE&zone=Syokimau&availability=ForRent'), zones)).toEqual({
			type: 'WAREHOUSE',
			zone: 'Syokimau',
			availability: 'ForRent',
		});
	});

	it('clears unknown values instead of carrying arbitrary query input', () => {
		expect(parseListingSearchFilters(new URLSearchParams('type=OFFICE&zone=Unknown&availability=ForLease'), zones)).toEqual({
			type: null,
			zone: null,
			availability: null,
		});
	});

	it('matches a published property against every active filter', () => {
		const listing = property({ type: 'APARTMENT', zone: 'Thika', availability: 'ForSale' });
		expect(matchesListingSearch(listing, { type: 'APARTMENT', zone: 'Thika', availability: 'ForSale' })).toBe(true);
		expect(matchesListingSearch(listing, { type: 'WAREHOUSE', zone: 'Thika', availability: 'ForSale' })).toBe(false);
		expect(matchesListingSearch(listing, { type: null, zone: null, availability: null })).toBe(true);
	});
});

describe('getIllustrationSrc', () => {
	it('returns the expected local Pexels path for every known property type', () => {
		expect(getIllustrationSrc('WAREHOUSE')).toBe('/photography/pexels-photo-9716363.jpeg');
		expect(getIllustrationSrc('GODOWN')).toBe('/photography/pexels-photo-19634723.jpeg');
		expect(getIllustrationSrc('BUSINESS_PARK')).toBe('/photography/pexels-photo-19920921.jpeg');
		expect(getIllustrationSrc('APARTMENT')).toBe('/photography/pexels-photo-34604972.jpeg');
	});

	it('returns null for null / undefined / empty / unknown types', () => {
		expect(getIllustrationSrc(null)).toBeNull();
		expect(getIllustrationSrc(undefined)).toBeNull();
		expect(getIllustrationSrc('')).toBeNull();
		expect(getIllustrationSrc('UNKNOWN_TYPE')).toBeNull();
	});
});

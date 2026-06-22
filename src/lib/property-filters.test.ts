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
	type PropertyFilters,
} from './property-filters';
import type { PropertyNode } from './data';

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
	it('TYPE_ORDER is industrial-first and residential-last', () => {
		expect(TYPE_ORDER[0]).toBe('WAREHOUSE');
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
		const out = applyFilters(list, { minSqft: null, minKva: null, zone: null });
		expect(out).toHaveLength(list.length);
	});

	it('filters by minSqft (preserves order)', () => {
		const out = applyFilters(list, { minSqft: 9000, minKva: null, zone: null });
		expect(out.map((p) => p._sys?.filename)).toEqual(['a', 'c']);
	});

	it('filters by minKva', () => {
		const out = applyFilters(list, { minSqft: null, minKva: 200, zone: null });
		expect(out.map((p) => p._sys?.filename)).toEqual(['a', 'c']);
	});

	it('filters by zone', () => {
		const out = applyFilters(list, { minSqft: null, minKva: null, zone: 'Mlolongo' });
		expect(out.map((p) => p._sys?.filename)).toEqual(['a']);
	});

	it('composes all three filters (AND)', () => {
		const out = applyFilters(list, { minSqft: 9000, minKva: 200, zone: 'Mlolongo' });
		expect(out.map((p) => p._sys?.filename)).toEqual(['a']);
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

describe('linkWith (chip URL composer)', () => {
	const base: PropertyFilters = { minSqft: 9000, minKva: null, zone: 'Mlolongo' };

	it('preserves sibling params when overriding one to null (delete)', () => {
		expect(linkWith(base, { minSqft: null })).toBe('/properties?zone=Mlolongo');
	});

	it('preserves sibling params when overriding to a new value', () => {
		expect(linkWith(base, { zone: 'Thika' })).toBe('/properties?minSqft=9000&zone=Thika');
	});

	it('returns bare /properties when all filters cleared', () => {
		expect(linkWith({ minSqft: null, minKva: null, zone: null }, {})).toBe('/properties');
	});

	it('adds a new param without dropping siblings', () => {
		// Insertion order: base filters first (minSqft, zone — minKva is null and
		// skipped), then the override. URLSearchParams preserves insertion order
		// in `toString()`, so the override lands after the base keys it didn't
		// replace.
		expect(linkWith(base, { minKva: '200' })).toBe(
			'/properties?minSqft=9000&zone=Mlolongo&minKva=200',
		);
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

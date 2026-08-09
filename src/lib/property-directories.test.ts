import { describe, expect, it } from 'vitest';
import {
	DIRECTORY_DEFINITIONS,
	directoryHrefForType,
	directoryKeyForType,
	filterDirectoryProperties,
} from './property-directories';
import type { PropertyNode } from './data';

const property = (type: string, title: string): PropertyNode => ({
	type,
	title,
	_sys: { filename: title.toLowerCase().replaceAll(' ', '-') },
});

describe('property directories', () => {
	it('defines the approved asset directories', () => {
		expect(Object.keys(DIRECTORY_DEFINITIONS)).toEqual([
			'shops',
			'warehouses',
			'godowns',
			'business-parks',
			'apartments',
		]);
	});

	it('maps known property types to canonical directory paths', () => {
		expect(directoryKeyForType('SHOP')).toBe('shops');
		expect(directoryHrefForType('WAREHOUSE')).toBe('/warehouses');
		expect(directoryHrefForType('GODOWN', 'mlolongo-godown')).toBe('/godowns/mlolongo-godown');
		expect(directoryHrefForType('BUSINESS_PARK', 'baba-dogo-business-park')).toBe('/business-parks/baba-dogo-business-park');
		expect(directoryHrefForType('APARTMENT', 'flame-tree-3bed')).toBe('/apartments/flame-tree-3bed');
	});

	it('does not generate a route for an unknown property type', () => {
		expect(directoryKeyForType('LEGACY_PROPERTY')).toBeNull();
		expect(directoryHrefForType('LEGACY_PROPERTY', 'legacy')).toBeNull();
	});

	it('filters only the requested property kind', () => {
		const properties = [
			property('SHOP', 'Shop unit'),
			property('WAREHOUSE', 'Warehouse'),
			property('APARTMENT', 'Apartment'),
		];

		expect(filterDirectoryProperties(properties, 'shops').map((item) => item.title)).toEqual(['Shop unit']);
		expect(filterDirectoryProperties(properties, 'apartments').map((item) => item.title)).toEqual(['Apartment']);
	});

	it('returns an empty result when the category has no published records', () => {
		expect(filterDirectoryProperties([property('WAREHOUSE', 'Warehouse')], 'shops')).toEqual([]);
	});
});

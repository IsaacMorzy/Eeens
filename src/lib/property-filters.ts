/**
 * Pure helpers + constants extracted from the all-listings directory so they
 * can be unit-tested without the Astro frontmatter. Same semantics as the
 * inlined page logic — page now imports from here.
 */
import type { PropertyNode } from './data';
import { getPropertyVisual } from './contextual-images';

/**
 * Returns the context-aligned local Pexels photo for a property type.
 * The legacy export name is retained so existing card callers stay stable.
 */
export const getIllustrationSrc = (type: string | null | undefined): string | null =>
	getPropertyVisual(type)?.src ?? null;

export const TYPE_ORDER = ['SHOP', 'WAREHOUSE', 'GODOWN', 'BUSINESS_PARK', 'APARTMENT'] as const;
export const TYPE_LABEL: Record<string, string> = {
	SHOP: 'Shop units',
	WAREHOUSE: 'Warehouses',
	GODOWN: 'Godowns',
	BUSINESS_PARK: 'Business parks',
	APARTMENT: 'Apartments',
};

export const SQFT_TIERS = [4000, 9000, 18000] as const;
export const KVA_TIERS = [50, 200] as const;

/**
 * Extract the first integer from a free-text numeric annotation.
 * Strips thousands separators so both "1,200" and "1200" resolve to 1200.
 * Returns 0 for null / undefined / empty / no-digits inputs. The single
 * source of truth for every spec-sheet parser — `parseWater`,
 * `parseClearHeight`, etc. inherit this without copy-pasting the
 * `.replace(/,/g, '').match(/\d+/)` two-liner.
 */
export const firstInteger = (s: string | null | undefined): number => {
	if (!s) return 0;
	const m = String(s).replace(/,/g, '').match(/\d+/);
	return m ? Number(m[0]) : 0;
};

export const parseSqft = (s: string | null | undefined): number => firstInteger(s);

export const parseKva = (p: PropertyNode | null | undefined): number =>
	firstInteger(p?.specSheet?.power);

export const AVAILABILITY_OPTIONS = ['ForRent', 'ForSale', 'Upcoming'] as const;
export type AvailabilityKey = (typeof AVAILABILITY_OPTIONS)[number];

export const PROPERTY_TYPE_OPTIONS = ['SHOP', 'WAREHOUSE', 'GODOWN', 'BUSINESS_PARK', 'APARTMENT'] as const;
export type PropertyTypeKey = (typeof PROPERTY_TYPE_OPTIONS)[number];

export interface ListingSearchFilters {
	type: PropertyTypeKey | null;
	zone: string | null;
	availability: AvailabilityKey | null;
}

export const parseListingSearchFilters = (
	searchParams: URLSearchParams,
	supportedZones: readonly string[],
): ListingSearchFilters => {
	const type = searchParams.get('type');
	const zone = searchParams.get('zone');
	const availability = searchParams.get('availability');
	return {
		type: type && (PROPERTY_TYPE_OPTIONS as readonly string[]).includes(type)
			? (type as PropertyTypeKey)
			: null,
		zone: zone && supportedZones.includes(zone) ? zone : null,
		availability: availability && (AVAILABILITY_OPTIONS as readonly string[]).includes(availability)
			? (availability as AvailabilityKey)
			: null,
	};
};

export const matchesListingSearch = (
	property: PropertyNode,
	filters: ListingSearchFilters,
): boolean =>
	(!filters.type || property.type === filters.type)
	&& (!filters.zone || property.zone === filters.zone)
	&& (!filters.availability || property.availability === filters.availability);

export interface PropertyFilters {
	minSqft: number | null;
	minKva: number | null;
	zone: string | null;
	availability: AvailabilityKey | null;
}

const parseTier = (value: string | null, tiers: readonly number[]): number | null => {
	if (!value || !/^\d+$/.test(value)) return null;
	const parsed = Number(value);
	return tiers.includes(parsed) ? parsed : null;
};

/**
 * Parse the availability query param. Only the three published values are
 * accepted (ForRent / ForSale / Upcoming); anything else is treated as no
 * filter so the directory never fabricates an availability claim.
 */
const parseAvailability = (value: string | null): AvailabilityKey | null =>
	value && (AVAILABILITY_OPTIONS as readonly string[]).includes(value)
		? (value as AvailabilityKey)
		: null;

export const parseDirectoryFilters = (
	searchParams: URLSearchParams,
	supportedZones: readonly string[],
): PropertyFilters => {
	const zone = searchParams.get('zone');
	return {
		zone: zone && supportedZones.includes(zone) ? zone : null,
		minSqft: parseTier(searchParams.get('minSqft'), SQFT_TIERS),
		minKva: parseTier(searchParams.get('minKva'), KVA_TIERS),
		availability: parseAvailability(searchParams.get('availability')),
	};
};

export const activeFilterCount = (filters: PropertyFilters): number =>
	[filters.zone, filters.minSqft, filters.minKva, filters.availability].filter((value) => value !== null).length;

export const applyFilters = (
	properties: readonly PropertyNode[],
	filters: PropertyFilters,
): PropertyNode[] =>
	properties.filter((p) => {
		if (filters.minSqft !== null && parseSqft(p.sqft) < filters.minSqft) return false;
		if (filters.minKva !== null && parseKva(p) < filters.minKva) return false;
		if (filters.zone && p.zone !== filters.zone) return false;
		if (filters.availability && p.availability !== filters.availability) return false;
		return true;
	});

export const SORT_OPTIONS = [
	{ value: 'featured', label: 'Featured (register order)' },
	{ value: 'price-desc', label: 'Price: high to low' },
	{ value: 'price-asc', label: 'Price: low to high' },
	{ value: 'area-desc', label: 'Area: largest first' },
	{ value: 'newest', label: 'Newest first' },
] as const;

export type SortKey = (typeof SORT_OPTIONS)[number]['value'];

/**
 * Parse the sort query param. Only the known keys are accepted; anything
 * else falls back to the register order (featured).
 */
export const parseSortKey = (value: string | null): SortKey =>
	value && (SORT_OPTIONS as readonly { value: string }[]).some((o) => o.value === value)
		? (value as SortKey)
		: 'featured';

/** Numeric total from the free-text KSH figure ("3,150,000 / yr" → 3150000). */
export const parsePriceKsh = (p: PropertyNode | null | undefined): number =>
	firstInteger(p?.price?.ksh);

/**
 * Sort a filtered register by a known key. `featured` keeps the source
 * order; numeric keys fall back to the register order on ties via a
 * stable comparison (reference code, then title).
 */
export const applySort = (
	properties: readonly PropertyNode[],
	sort: SortKey,
): PropertyNode[] => {
	if (sort === 'featured') return [...properties];
	const order = [...properties];
	const tiebreak = (a: PropertyNode, b: PropertyNode): number => {
		const refA = a.reference ?? a.title ?? '';
		const refB = b.reference ?? b.title ?? '';
		return refA.localeCompare(refB);
	};
	order.sort((a, b) => {
		if (sort === 'price-desc' || sort === 'price-asc') {
			const diff = parsePriceKsh(a) - parsePriceKsh(b);
			if (diff !== 0) return sort === 'price-desc' ? -diff : diff;
		}
		if (sort === 'area-desc') {
			const diff = parseSqft(a.sqft) - parseSqft(b.sqft);
			if (diff !== 0) return -diff;
		}
		if (sort === 'newest') {
			const timeA = Date.parse(a.publishedDate ?? '');
			const timeB = Date.parse(b.publishedDate ?? '');
			const diff = (Number.isNaN(timeA) ? 0 : timeA) - (Number.isNaN(timeB) ? 0 : timeB);
			if (diff !== 0) return -diff;
		}
		return tiebreak(a, b);
	});
	return order;
};

/**
 * Group by type in stable industrial-first, residential-last order. Drops
 * any type group that ends up empty so the listing rail suppresses unused
 * section headers.
 */
export const groupByType = (
	properties: readonly PropertyNode[],
): Array<{ type: string; items: PropertyNode[] }> =>
	TYPE_ORDER
		.map((t) => ({ type: t, items: properties.filter((p) => p.type === t) }))
		.filter((g) => g.items.length > 0);

/**
 * Discover the zone set that actually has listings (sorted unique), so the
 * filter chip rail doesn't surface empty zones.
 */
export const zonesInUse = (
	properties: readonly PropertyNode[],
): string[] =>
	Array.from(
		new Set(properties.map((p) => p.zone).filter((z): z is string => Boolean(z))),
	).sort();

/**
 * Composable URL builder for a category filter rail. Preserves sibling
 * params when a new chip is clicked; `null` overrides delete the
 * existing key.
 */
export const linkWith = (
	filters: PropertyFilters,
	overrides: Record<string, string | null>,
	pathname = '/warehouses',
): string => {
	const next = new URLSearchParams();
	if (filters.minSqft !== null) next.set('minSqft', String(filters.minSqft));
	if (filters.minKva !== null) next.set('minKva', String(filters.minKva));
	if (filters.zone) next.set('zone', filters.zone);
	if (filters.availability) next.set('availability', filters.availability);
	for (const [k, v] of Object.entries(overrides)) {
		if (v === null) next.delete(k);
		else next.set(k, v);
	}
	const qs = next.toString();
	return qs ? `${pathname}?${qs}` : pathname;
};

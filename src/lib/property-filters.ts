/**
 * Pure helpers + constants extracted from the /properties index page so they
 * can be unit-tested without the Astro frontmatter. Same semantics as the
 * inlined page logic — page now imports from here.
 */
import type { PropertyNode } from './data';

// ------------------------------------------------------------------
// Illustration SVG fallback — maps property type to a type-appropriate
// vector illustration so property cards / detail pages always render an
// image even when Tina's image-type field resolution returns null at
// runtime (the `image` type inside an object type creates a nested type
// that the local datalayer may not resolve identically to a plain string).
// ------------------------------------------------------------------
const ILLUSTRATION_MAP: Record<string, string> = {
	WAREHOUSE: '/properties/illustration-warehouse.svg',
	GODOWN: '/properties/illustration-godown.svg',
	BUSINESS_PARK: '/properties/illustration-business-park.svg',
	APARTMENT: '/properties/illustration-apartment.svg',
};

/**
 * Returns the illustration SVG path for a given property type, or null
 * if the type is unrecognized / missing. Callers use this as a fallback
 * when `heroImage.src` is unreachable through Tina's image-type field.
 */
export const getIllustrationSrc = (type: string | null | undefined): string | null =>
	type ? (ILLUSTRATION_MAP[type] ?? null) : null;

export const TYPE_ORDER = ['WAREHOUSE', 'GODOWN', 'BUSINESS_PARK', 'APARTMENT'] as const;
export const TYPE_LABEL: Record<string, string> = {
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

export interface PropertyFilters {
	minSqft: number | null;
	minKva: number | null;
	zone: string | null;
}

export const applyFilters = (
	properties: readonly PropertyNode[],
	filters: PropertyFilters,
): PropertyNode[] =>
	properties.filter((p) => {
		if (filters.minSqft !== null && parseSqft(p.sqft) < filters.minSqft) return false;
		if (filters.minKva !== null && parseKva(p) < filters.minKva) return false;
		if (filters.zone && p.zone !== filters.zone) return false;
		return true;
	});

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
 * Composable URL builder for the filter chip rail. Preserves sibling
 * params when a new chip is clicked; `null` overrides delete the
 * existing key. Returns bare `/properties` when no params survive.
 */
export const linkWith = (
	filters: PropertyFilters,
	overrides: Record<string, string | null>,
): string => {
	const next = new URLSearchParams();
	if (filters.minSqft !== null) next.set('minSqft', String(filters.minSqft));
	if (filters.minKva !== null) next.set('minKva', String(filters.minKva));
	if (filters.zone) next.set('zone', filters.zone);
	for (const [k, v] of Object.entries(overrides)) {
		if (v === null) next.delete(k);
		else next.set(k, v);
	}
	const qs = next.toString();
	return qs ? `/properties?${qs}` : '/properties';
};

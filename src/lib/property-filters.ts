/**
 * Pure helpers + constants extracted from the /properties index page so they
 * can be unit-tested without the Astro frontmatter. Same semantics as the
 * inlined page logic — page now imports from here.
 */
import type { PropertyNode } from './data';

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
 * Parse the human-readable sqft / kVA strings back to numbers.
 * "9,000 sq ft" -> 9000.  "1,200" -> 1200.  "" / null / undefined -> 0
 * (treated as "unknown" — never matches a minSqft filter).
 */
export const parseSqft = (s: string | null | undefined): number => {
	if (!s) return 0;
	const m = String(s).replace(/,/g, '').match(/\d+/);
	return m ? Number(m[0]) : 0;
};

export const parseKva = (p: PropertyNode | null | undefined): number => {
	const raw = p?.specSheet?.power;
	if (!raw) return 0;
	// Strip thousands separators so "1,200 kVA" → 1200, consistent with parseSqft.
	const m = String(raw).replace(/,/g, '').match(/\d+/);
	return m ? Number(m[0]) : 0;
};

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

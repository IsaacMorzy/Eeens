/**
 * compare-listings.ts — client-side listing comparison.
 *
 * Persists a small set of listing hrefs in localStorage under `eens:compare`
 * so a visitor can hold up to three listings and open them side by side on
 * /compare. Mirrors saved-listings.ts: storage failures (private mode,
 * quota) fall back to in-memory toggling for the session.
 */
const STORAGE_KEY = 'eens:compare';
export const COMPARE_MAX = 3;

/**
 * Pure toggle: remove `href` if present, otherwise add it — capped at
 * COMPARE_MAX. Insertion order is preserved so the compare table reads
 * left to right in the order the visitor picked.
 */
export const toggleInCompare = (current: Set<string>, href: string): Set<string> => {
	const next = new Set(current);
	if (next.has(href)) next.delete(href);
	else if (next.size < COMPARE_MAX) next.add(href);
	return next;
};

export const loadCompareHrefs = (): Set<string> => {
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		const parsed = raw ? JSON.parse(raw) : [];
		return new Set(
			Array.isArray(parsed)
				? parsed.filter((v): v is string => typeof v === 'string').slice(0, COMPARE_MAX)
				: [],
		);
	} catch {
		return new Set();
	}
};

export const toggleCompare = (href: string): boolean => {
	const next = toggleInCompare(loadCompareHrefs(), href);
	try {
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
	} catch {
		// Storage unavailable — the in-memory set still toggles for this session.
	}
	return next.has(href);
};

export const clearCompare = (): void => {
	try {
		window.localStorage.removeItem(STORAGE_KEY);
	} catch {
		// Storage unavailable — nothing persisted to clear.
	}
};

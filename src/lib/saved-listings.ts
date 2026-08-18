/**
 * saved-listings.ts — client-side saved listings (favorites).
 *
 * Persists a set of listing hrefs in localStorage under `eens:saved`.
 * Pure browser helpers shared by the property-card save toggle and the
 * directory "Saved only" filter. Storage failures (private mode, quota)
 * fall back to in-memory toggling for the session.
 */
const STORAGE_KEY = 'eens:saved';

export const loadSavedHrefs = (): Set<string> => {
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		const parsed = raw ? JSON.parse(raw) : [];
		return new Set(
			Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : [],
		);
	} catch {
		return new Set();
	}
};

export const toggleSaved = (href: string): boolean => {
	const saved = loadSavedHrefs();
	if (saved.has(href)) saved.delete(href);
	else saved.add(href);
	try {
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...saved]));
	} catch {
		// Storage unavailable — the in-memory set still toggles for this session.
	}
	return saved.has(href);
};

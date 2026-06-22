/**
 * Recursive walker over the Tina rich-text tree. Sums the lengths of every
 * `text` field, descending into `children` recursively. Replaces a prior
 * JSON.stringify-based path which double-counted structural keys ('type',
 * 'children', 'level', etc.) and inflated the per-post word count by
 * 20-40 %.
 *
 * Lives in `src/lib/` so it's importable in unit tests without spinning up
 * Astro.
 */
export const countWords = (node: unknown): number => {
	if (node == null) return 0;
	if (typeof node === 'string') {
		const trimmed = node.trim();
		return trimmed ? trimmed.split(/\s+/).length : 0;
	}
	if (Array.isArray(node)) return node.reduce((s, n) => s + countWords(n), 0);
	if (typeof node === 'object') {
		const o = node as { text?: unknown; children?: unknown };
		return countWords(o.text) + countWords(o.children);
	}
	return 0;
};

/**
 * Reading-time annotation: 200 wpm is the engineering convention for prose.
 * Round up. Minimum 1 when a positive word count exists; null otherwise so
 * the caller can choose to skip rendering.
 */
export const readingMinutes = (wordCount: number): number | null =>
	wordCount > 0 ? Math.max(1, Math.ceil(wordCount / 200)) : null;

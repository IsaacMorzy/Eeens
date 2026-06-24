/**
 * isCurrentPath — single source of truth for `aria-current="page"`.
 *
 * Rules:
 * - Root `/` is an exact-match only (no prefix fallback — `startsWith('/' + '/')`
 *   would always be true and would mark every page as "home").
 * - Any other href matches when pathname === href OR pathname starts with
 *   `href + '/'`, so `/properties/mlolongo-warehouse` correctly marks the
 *   `/properties` nav link as the current section.
 *
 * Used by Header (desktop + mobile nav) and Footer (pageLinks). Centralizing
 * here keeps the three sites from drifting on the next nav edit.
 */
export function isCurrentPath(pathname: string, href: string): boolean {
	if (!href) return false;
	if (href === '/') return pathname === '/';
	return pathname === href || pathname.startsWith(href + '/');
}

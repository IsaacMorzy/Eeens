export interface PaginationMeta {
	page: number;
	pageSize: number;
	totalItems: number;
	totalPages: number;
	from: number;
	to: number;
}

export const parsePage = (value: string | null | undefined): number => {
	const page = Number.parseInt(value ?? '', 10);
	return Number.isFinite(page) && page > 0 ? page : 1;
};

export const paginate = <T>(
	items: readonly T[],
	page: number,
	pageSize: number,
): { items: T[]; meta: PaginationMeta } => {
	const safePageSize = Math.max(1, Math.floor(pageSize));
	const totalItems = items.length;
	const totalPages = Math.max(1, Math.ceil(totalItems / safePageSize));
	const currentPage = Math.min(Math.max(1, Math.floor(page)), totalPages);
	const start = (currentPage - 1) * safePageSize;
	const visible = items.slice(start, start + safePageSize);

	return {
		items: visible,
		meta: {
			page: currentPage,
			pageSize: safePageSize,
			totalItems,
			totalPages,
			from: totalItems === 0 ? 0 : start + 1,
			to: start + visible.length,
		},
	};
};

export const pageHref = (
	pathname: string,
	params: Record<string, string | null | undefined>,
	page: number,
): string => {
	const search = new URLSearchParams();
	for (const [key, value] of Object.entries(params)) {
		if (value !== null && value !== undefined && value !== '') search.set(key, value);
	}
	if (page > 1) search.set('page', String(page));
	const query = search.toString();
	return query ? `${pathname}?${query}` : pathname;
};

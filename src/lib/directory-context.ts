export interface DirectoryHighlight {
	label?: string | null;
	value?: string | null;
}

export interface DirectoryContext {
	key?: string | null;
	title?: string | null;
	description?: string | null;
	highlights?: Array<DirectoryHighlight | null> | null;
	zoneLabel?: string | null;
	primaryActionLabel?: string | null;
	primaryActionLink?: string | null;
	mapLabel?: string | null;
}

export const selectDirectoryContext = (
	contexts: readonly (DirectoryContext | null | undefined)[] | null | undefined,
	key: string,
): DirectoryContext | null =>
	contexts?.find((context) => context?.key === key) ?? null;

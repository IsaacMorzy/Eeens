import type { PropertyNode } from './data';

export type DirectoryKey = 'shops' | 'warehouses' | 'godowns' | 'business-parks' | 'apartments';

type DirectoryDefinition = {
	key: DirectoryKey;
	type: string;
	label: string;
	title: string;
	description: string;
	emptyTitle: string;
	emptyDescription: string;
};

export const DIRECTORY_DEFINITIONS: Record<DirectoryKey, DirectoryDefinition> = {
	shops: {
		key: 'shops',
		type: 'SHOP',
		label: 'Shop units',
		title: 'Shop units published across the Eens portfolio.',
		description: 'Start with the Eens Business Park overview, then compare any shop records that have been published with a zone, area, price, and availability.',
		emptyTitle: 'No shop units are published yet.',
		emptyDescription: 'No operator-approved shop records are published yet. Start with the Eens Business Park overview or ask the office about the next verified register.',
	},
	warehouses: {
		key: 'warehouses',
		type: 'WAREHOUSE',
		label: 'Warehouses',
		title: 'Warehouse space with published technical details.',
		description: 'Review area, power, clear height, loading, price, and lease terms before requesting a tour.',
		emptyTitle: 'No warehouses are published yet.',
		emptyDescription: 'Contact Eens for current warehouse availability and viewing arrangements.',
	},
	godowns: {
		key: 'godowns',
		type: 'GODOWN',
		label: 'Godowns',
		title: 'Godown space for storage and distribution.',
		description: 'Compare access, area, published specifications, price, and lease terms across the portfolio.',
		emptyTitle: 'No godowns are published yet.',
		emptyDescription: 'Contact Eens for current godown availability and viewing arrangements.',
	},
	'business-parks': {
		key: 'business-parks',
		type: 'BUSINESS_PARK',
		label: 'Business parks',
		title: 'Business-park units with published commercial facts.',
		description: 'Review published area, price, location, availability, and terms for business-park units.',
		emptyTitle: 'No business-park units are published yet.',
		emptyDescription: 'Contact Eens for current commercial-unit availability and viewing arrangements.',
	},
	apartments: {
		key: 'apartments',
		type: 'APARTMENT',
		label: 'Apartments',
		title: 'Apartments with published prices and sale terms.',
		description: 'Review bedrooms, bathrooms, area, price, availability, and the published terms for each unit.',
		emptyTitle: 'No apartments are published yet.',
		emptyDescription: 'Contact Eens for current apartment availability and viewing arrangements.',
	},
};

const DIRECTORY_BY_TYPE = Object.values(DIRECTORY_DEFINITIONS).reduce<Record<string, DirectoryKey>>(
	(map, definition) => {
		map[definition.type] = definition.key;
		return map;
	},
	{},
);

export const directoryKeyForType = (type: string | null | undefined): DirectoryKey | null =>
	type ? DIRECTORY_BY_TYPE[type] ?? null : null;

export const directoryHrefForType = (
	type: string | null | undefined,
	slug?: string | null,
): string | null => {
	const key = directoryKeyForType(type);
	if (!key) return null;
	return slug ? `/${key}/${slug}` : `/${key}`;
};

export const filterDirectoryProperties = (
	properties: readonly PropertyNode[],
	key: DirectoryKey,
): PropertyNode[] => {
	const definition = DIRECTORY_DEFINITIONS[key];
	return properties.filter((property) => property.type === definition.type);
};

export const filterParkProperties = (
	properties: readonly PropertyNode[],
	development = 'Eens Business Park',
): PropertyNode[] => properties.filter((property) => property.development === development);

export const filterZoneProperties = (
	properties: readonly PropertyNode[],
	zone: string,
): PropertyNode[] => properties.filter((property) => property.zone === zone);

/**
 * Property collection — dedicated MDX store of every listing operated
 * by Eens Limited. Each entry mounts at its type-specific category route
 * via `tina/collections/page.ts`'s router, and is enumerated by the
 * `PropertyList` page block and the category index/detail pages.
 *
 * Schema rationale (DESIGN.md § Confidence Audit + plan.md):
 *   - `type`  drives the 12 px cyan-teal eyebrow + the variant of the
 *     property card; it also seeds the spec sheet (only warehouse / godown /
 *     business-park listings carry industrial specs).
 *   - `availability` drives the pill badge (ForRent / ForSale / Upcoming).
 *   - `sqft` + `price.ksh` + `price.perSqft` are rendered in JetBrains Mono
 *     and quoted verbatim on the listing detail page.
 *   - `reference` is the on-paper code (e.g. EE-MLO-014) shown beneath the
 *     availability badge in JetBrains Mono.
 *   - `specSheet` is the B2B engineer's spec table — rendered only on
 *     industrial-type listings.
 */
import type { Collection } from 'tinacms';

// Property type is required for the public URL. Fail fast on malformed or
// legacy records so Tina never recreates the deleted generic `/properties` route.
const categoryPath = (type: string | undefined): string => {
	const path = {
		SHOP: 'shops',
		WAREHOUSE: 'warehouses',
		GODOWN: 'godowns',
		BUSINESS_PARK: 'business-parks',
		APARTMENT: 'apartments',
	}[type ?? ''];
	if (!path) throw new Error(`Unsupported property type: ${type ?? 'missing'}`);
	return path;
};

const TYPE_OPTIONS = [
	{ label: 'Shop', value: 'SHOP' },
	{ label: 'Warehouse', value: 'WAREHOUSE' },
	{ label: 'Godown', value: 'GODOWN' },
	{ label: 'Apartment', value: 'APARTMENT' },
	{ label: 'Business Park', value: 'BUSINESS_PARK' },
];

const AVAILABILITY_OPTIONS = [
	{ label: 'For Rent', value: 'ForRent' },
	{ label: 'For Sale', value: 'ForSale' },
	{ label: 'Upcoming', value: 'Upcoming' },
];

const ZONE_OPTIONS = [
	{ label: 'Mlolongo', value: 'Mlolongo' },
	{ label: 'Syokimau', value: 'Syokimau' },
	{ label: 'Baba Dogo', value: 'Baba Dogo' },
	{ label: 'Thika', value: 'Thika' },
];

export const PropertyCollection: Collection = {
	name: 'property',
	label: 'Properties',
	path: 'src/content/property',
	format: 'mdx',
	ui: {
		router: ({ document }) => `/${categoryPath(document.type)}/${document._sys.filename}`,
		itemProps: (item) => ({ label: item?.title ?? 'Untitled listing' }),
	},
	fields: [
		{
			name: 'title',
			label: 'Title',
			type: 'string',
			isTitle: true,
			required: true,
			description: 'Shown on the listing card and as the page H1. Always include the zone + identifier.',
		},
		{ name: 'type', label: 'Type', type: 'string', options: TYPE_OPTIONS, required: true },
		{
			name: 'development',
			label: 'Development / park (optional)',
			type: 'string',
			options: [{ label: 'Eens Business Park', value: 'Eens Business Park' }],
			description: 'Select only when an operator-approved record identifies the named development or park. Leave blank when compound membership is unknown.',
		},
		{
			name: 'subunits',
			label: 'Published subunits (optional)',
			type: 'string',
			list: true,
			description: 'Add the checked-in filename slug for each published subunit. Each slug must point to an existing property record of the same type.',
		},
		{
			name: 'buildingFeatures',
			label: 'Approved amenities / features',
			type: 'string',
			list: true,
			description: 'Operator-approved building or unit features only. Do not copy third-party listing claims or infer amenities from stock photography.',

		},
		{ name: 'availability', label: 'Availability', type: 'string', options: AVAILABILITY_OPTIONS, required: true },
		{
			name: 'address',
			label: 'Address',
			type: 'string',
			required: true,
			description: 'Include the zone + road + kilometer mark. e.g. "Mlolongo, Mombasa Road, KM 14".',
		},
		{ name: 'zone', label: 'Zone', type: 'string', options: ZONE_OPTIONS, required: true },
		{
			name: 'sqft',
			label: 'Square footage',
			type: 'string',
			required: true,
			description: 'Render in JetBrains Mono. e.g. "9,000 sq ft".',
		},
		{
			name: 'price',
			label: 'Pricing',
			type: 'object',
			required: true,
			fields: [
				{ name: 'ksh', label: 'Total (KSH)', type: 'string', description: 'Total annual or sale price in KSH.' },
				{ name: 'perSqft', label: 'KSH / sq ft', type: 'string', description: 'Industrial rentals are quoted per sq ft / month.' },
			],
		},
		{ name: 'leaseTerm', label: 'Lease term', type: 'string', description: 'e.g. "3-year minimum".' },
		{
			name: 'bedrooms',
			label: 'Bedrooms (apartments only)',
			type: 'number',
			description: 'Hidden unless `type` = APARTMENT.',
		},
		{
			name: 'bathrooms',
			label: 'Bathrooms (apartments only)',
			type: 'number',
		},
		{
			name: 'heroImage',
			label: 'Hero image (16:9)',
			type: 'object',
			fields: [
				{ name: 'src', label: 'Image source', type: 'image', description: '16:9 Mombasa Road / Syokimau / Baba Dogo / Thika exterior.' },
				{ name: 'alt', label: 'Alt text', type: 'string', description: 'Address + zone + structural detail (no marketing prose).' },
			],
		},
		{
			name: 'gallery',
			label: 'Gallery (optional)',
			type: 'object',
			list: true,
			ui: { itemProps: (item) => ({ label: item?.alt ?? 'image' }) },
			fields: [
				{ name: 'src', label: 'Image', type: 'image' },
				{ name: 'alt', label: 'Alt text', type: 'string' },
			],
		},
		{
			name: 'occupancyState',
			label: 'Occupancy state',
			type: 'string',
			options: [
				{ label: 'Available', value: 'available' },
				{ label: 'Reserved', value: 'reserved' },
				{ label: 'Occupied', value: 'occupied' },
				{ label: 'Unpublished', value: 'unpublished' },
			],
			description: 'Use only with a verified operator register. Unpublished records stay out of public routes.',
		},
		{
			name: 'floorSection',
			label: 'Floor / section',
			type: 'string',
		},
		{ name: 'frontage', label: 'Frontage', type: 'string' },
		{ name: 'deposit', label: 'Deposit', type: 'string' },
		{ name: 'serviceCharge', label: 'Service charge', type: 'string' },
		{ name: 'permittedUse', label: 'Permitted use', type: 'string' },
		{ name: 'viewingStatus', label: 'Viewing status', type: 'string' },
		{ name: 'lastReviewedDate', label: 'Last reviewed', type: 'datetime' },
		{ name: 'reviewer', label: 'Reviewer', type: 'string' },
		{
			name: 'imageProvenance',
			label: 'Image provenance',
			type: 'object',
			fields: [
				{ name: 'source', label: 'Image source', type: 'string' },
				{ name: 'permission', label: 'Image permission', type: 'string' },
				{ name: 'reviewer', label: 'Image reviewer', type: 'string' },
				{ name: 'width', label: 'Image width', type: 'number' },
				{ name: 'height', label: 'Image height', type: 'number' },
				{ name: 'mappedUnitReference', label: 'Mapped unit reference', type: 'string' },
			],
		},
		{
			name: 'videos',
			label: 'Property videos (optional)',
			type: 'object',
			list: true,
			ui: { itemProps: (item) => ({ label: item?.title ?? item?.url ?? 'video' }) },
			fields: [
				{ name: 'title', label: 'Title', type: 'string' },
				{ name: 'url', label: 'YouTube URL', type: 'string' },
			],
		},
		{
			name: 'specSheet',
			label: 'B2B spec sheet (industrial listings only)',
			type: 'object',
			description: 'Renders as a 1px hairline spec table on the listing detail page.',
			fields: [
				{ name: 'power', label: 'Power (kVA)', type: 'string' },
				{ name: 'water', label: 'Water (m³/day)', type: 'string' },
				{ name: 'parking', label: 'Parking bays', type: 'number' },
				{ name: 'floorLoading', label: 'Floor loading (kN/m²)', type: 'string' },
				{ name: 'clearHeight', label: 'Clear height (m)', type: 'string' },
			],
		},
		{ name: 'publishedDate', label: 'Published date', type: 'datetime' },
		{
			name: 'reference',
			label: 'Reference code (mono)',
			type: 'string',
			description: 'On-paper code shown beneath the availability badge. e.g. EE-MLO-014.',
		},
		{
			type: 'rich-text',
			name: 'body',
			label: 'Body',
			isBody: true,
		},
	],
};

/**
 * property.template.ts — Tina block schemas for the Page collection.
 *
 * Exports three templates:
 *  - `propertyCardBlockSchema` → inline single listing card on a Page
 *  - `propertyListBlockSchema` → dispatcher that pulls from the
 *     dedicated `property` Tina collection, filters by type/zone,
 *     limits, and lays out as grid or strip
 *  - `ctaBannerBlockSchema`     → navy-bg closing CTA per
 *     DESIGN.md § Components > Cards > cta-banner
 *
 * The TYPE / AVAILABILITY / ZONE option lists are kept in sync with
 * tina/collections/property.ts so the editor sees the same vocabulary
 * everywhere.
 */
import type { Template } from 'tinacms';
import type { Action } from '../../lib/data';

const TYPE_OPTIONS = [
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

export const propertyCardBlockSchema: Template = {
	label: 'Property card',
	name: 'PropertyCard',
	ui: {
		defaultItem: {
			type: 'WAREHOUSE',
			availability: 'ForRent',
			sqft: '9,000 sq ft',
			viewLabel: 'View property',
		},
	},
	fields: [
		{ name: 'type', label: 'Type', type: 'string', options: TYPE_OPTIONS },
		// `isTitle` is reserved for top-level identity fields on a Tina
		// collection — using it inside a block template triggers a
		// GraphQL schema-generation conflict when several blocks share
		// the same `title` key. Block identity flows through
		// `__typename` instead, so `title` here is just a string field.
		{ name: 'title', label: 'Title', type: 'string' },
		{ name: 'availability', label: 'Availability', type: 'string', options: AVAILABILITY_OPTIONS },
		{ name: 'address', label: 'Address', type: 'string', description: 'Includes the zone + road + kilometer mark.' },
		{ name: 'sqft', label: 'Square footage', type: 'string', description: 'Render in JetBrains Mono — e.g. "9,000 sq ft".' },
		{
			name: 'price', label: 'Pricing', type: 'object',
			fields: [
				{ name: 'ksh', label: 'Total (KSH)', type: 'string' },
				{ name: 'perSqft', label: 'KSH / sq ft', type: 'string' },
			],
		},
		{ name: 'zone', label: 'Zone', type: 'string', options: ZONE_OPTIONS },
		{ name: 'leaseTerm', label: 'Lease term', type: 'string' },
		{
			name: 'image', label: 'Hero image (16:9)', type: 'object',
			fields: [
				{ name: 'src', label: 'Image source', type: 'image' },
				{ name: 'alt', label: 'Alt text', type: 'string' },
			],
		},
		{ name: 'ref', label: 'Linked listing slug (optional)', type: 'string', description: 'If set, the CTA links to /properties/{ref}.' },
		{ name: 'href', label: 'Custom link (overrides ref)', type: 'string' },
		{ name: 'viewLabel', label: 'CTA label', type: 'string' },
	],
};

export const propertyListBlockSchema: Template = {
	label: 'Property list',
	name: 'PropertyList',
	ui: {
		defaultItem: {
			limit: 3,
			filterType: 'ALL',
			layout: 'grid',
			display: 'featured',
		},
	},
	fields: [
		// See PropertyCard: `isTitle` not used inside block templates —
		// the discriminator `__typename` is the canonical identifier.
		{ name: 'title', label: 'Section title', type: 'string' },
		{ name: 'description', label: 'Section description', type: 'string', ui: { component: 'textarea' } },
		{ name: 'limit', label: 'Max items', type: 'number' },
		{
			name: 'filterType',
			label: 'Filter by type',
			type: 'string',
			options: [{ label: 'All', value: 'ALL' }, ...TYPE_OPTIONS],
		},
		{ name: 'filterZone', label: 'Filter by zone', type: 'string', options: ZONE_OPTIONS },
		{
			name: 'layout', label: 'Layout',
			type: 'string',
			options: [
				{ label: 'Grid (3-up → 2-up → 1-up)', value: 'grid' },
				{ label: 'Strip (stacked)', value: 'strip' },
			],
		},
		{
			name: 'display', label: 'Display variant',
			type: 'string',
			options: [
				{ label: 'Featured (surface-2-light)', value: 'featured' },
				{ label: 'Standard (surface-1-light)', value: 'standard' },
			],
		},
		{
			type: 'object',
			label: 'Section actions',
			name: 'actions',
			list: true,
			ui: {
				defaultItem: { label: 'View all listings', type: 'button', link: '/properties' },
				itemProps: (item: Action) => ({ label: item?.label ?? '' }),
			},
			fields: [
				{ type: 'string', label: 'Label', name: 'label' },
				{
					type: 'string',
					label: 'Type',
					name: 'type',
					options: [
						{ label: 'Button (primary)', value: 'button' },
						{ label: 'Link (ghost)', value: 'link' },
					],
				},
				{ type: 'string', label: 'Icon (Tabler name)', name: 'icon' },
				{ type: 'string', label: 'Link', name: 'link' },
			],
		},
	],
};

export const ctaBannerBlockSchema: Template = {
	label: 'CTA banner',
	name: 'CtaBanner',
	ui: {
		defaultItem: {
			eyebrow: 'SCHEDULE A VIEWING',
			title: 'Visit the property.',
			ctaLabel: 'Schedule a viewing',
			ctaLink: 'mailto:hello@eens.co.ke?subject=Schedule%20a%20viewing',
		},
	},
	fields: [
		{ name: 'eyebrow', label: 'Eyebrow (uppercase)', type: 'string' },
		// See PropertyCard: `isTitle` not used inside block templates.
		{ name: 'title', label: 'Title', type: 'string' },
		{ name: 'description', label: 'Description', type: 'string', ui: { component: 'textarea' } },
		{ name: 'ctaLabel', label: 'CTA label', type: 'string' },
		{ name: 'ctaLink', label: 'CTA link (mailto or url)', type: 'string' },
	],
};

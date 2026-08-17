import type { Template } from 'tinacms';

/**
 * listing-search.template.ts — Tina block schema for the modern listing
 * search bar. All visible copy is editable; the option vocabulary (types,
 * zones, availability) matches the property collection so the search only
 * offers values the register can produce.
 */
export const listingSearchBlockSchema: Template = {
	label: 'Listing search',
	name: 'ListingSearch',
	ui: {
		defaultItem: {
			title: 'Find a space.',
			description: 'Pick the type, zone, and availability you need, then open the filtered register.',
			typeLabel: 'Property type',
			zoneLabel: 'Zone',
			availabilityLabel: 'Availability',
			searchLabel: 'Search listings',
			allTypesLabel: 'All property types',
			allZonesLabel: 'All zones',
			anyAvailabilityLabel: 'Any availability',
			allTypesLink: '/locations',
			hint: 'Filters use published type, zone, and availability facts only.',
		},
	},
	fields: [
		{ name: 'title', label: 'Title (optional)', type: 'string' },
		{ name: 'description', label: 'Description (optional)', type: 'string', ui: { component: 'textarea' } },
		{ name: 'typeLabel', label: 'Type select label', type: 'string' },
		{ name: 'zoneLabel', label: 'Zone select label', type: 'string' },
		{ name: 'availabilityLabel', label: 'Availability select label', type: 'string' },
		{ name: 'searchLabel', label: 'Search button label', type: 'string' },
		{ name: 'allTypesLabel', label: 'All-types option label', type: 'string' },
		{ name: 'allZonesLabel', label: 'All-zones option label', type: 'string' },
		{ name: 'anyAvailabilityLabel', label: 'Any-availability option label', type: 'string' },
		{
			name: 'allTypesLink',
			label: 'All-types target (e.g. /locations)',
			type: 'string',
			description: 'Where the search lands when no property type is selected.',
		},
		{ name: 'hint', label: 'Hint under the bar (optional)', type: 'string' },
	],
};

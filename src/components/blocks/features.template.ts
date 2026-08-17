import type { Template } from 'tinacms';
import type { FeatureItem } from '../../lib/data';

export const featuresBlockSchema: Template = {
	name: 'features',
	label: 'Features',
	fields: [
		{ type: 'string', label: 'Title', name: 'title' },
		{ type: 'string', label: 'Description', name: 'description' },
		{
			type: 'object', label: 'Feature Items', name: 'items', list: true,
			ui: { itemProps: (i: FeatureItem) => ({ label: i?.title ?? '' }), defaultItem: { title: 'Address and access', text: 'Start with the literal address, corridor, loading approach, and parking information.' } },
			fields: [
				{ type: 'string', label: 'Icon (Tabler name)', name: 'icon' },
				{ type: 'string', label: 'Title', name: 'title' },
				{ type: 'rich-text', label: 'Text', name: 'text' },
			],
		},
	],
	ui: {
		defaultItem: {
			title: 'What to check before a viewing',
			description: 'The listing gives you the first questions to ask before arranging a walk-through.',
			items: [
				{ title: 'Address and access', text: 'Start with the literal address, corridor, loading approach, and parking information.', icon: 'map-pin' },
				{ title: 'Area and specification', text: 'Compare square footage, power, water, floor loading, and clear height where published.', icon: 'ruler' },
				{ title: 'Terms and next step', text: 'Read the lease or sale position, then send the listing reference to request a viewing.', icon: 'file-text' },
			],
		},
	},
};
